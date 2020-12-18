import {
	AfterContentInit,
	Directive,
	ElementRef,
	EventEmitter,
	Inject,
	InjectionToken,
	Input,
	OnDestroy,
	Optional,
	Output,
	Self,
	ViewContainerRef,
} from '@angular/core';
import { FocusMonitor, FocusOrigin, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import {
	FlexibleConnectedPositionStrategy,
	HorizontalConnectionPos,
	Overlay,
	OverlayConfig,
	OverlayRef,
	VerticalConnectionPos,
	ScrollStrategy,
	OverlayContainer,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { MatMenu, MatMenuItem, MatMenuPanel, MAT_MENU_SCROLL_STRATEGY, MenuPositionX, MenuPositionY } from '@lenovo/material/menu';
/** Default top padding of the menu panel. */
export const MENU_PANEL_TOP_PADDING = 8;

/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

export class MenuMissingError extends Error {
}

export class MenuRecursiveError extends Error {
}

@Directive({
	selector: '[vtrMenuHover]',
	// tslint:disable-next-line:no-host-metadata-property
	host: {
		class: 'mat-menu-trigger',
		'aria-haspopup': 'true',
		'[attr.aria-expanded]': 'menuOpen || null',
		'[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
		'(mousedown)': '_handleMousedown($event)',
		'(keydown)': '_handleKeydown($event)',
		'(click)': '_handleClick($event)',
		'(pointerenter)': '_handlePointerEnter($event)',
		'(pointerleave)': '_handlePointerLeave($event)',
		'(focus)': '_handleFocus($event)',
	},
	exportAs: 'menuHoverDirective',
})
export class MenuHoverDirective implements AfterContentInit, OnDestroy {
	private _portal: TemplatePortal;
	private _overlayRef: OverlayRef | null = null;
	private _menuOpen: boolean = false;
	private _closingActionsSubscription = Subscription.EMPTY;
	private _hoverSubscription = Subscription.EMPTY;
	private _menuCloseSubscription = Subscription.EMPTY;
	private _scrollStrategy: () => ScrollStrategy;
	private _menu: MatMenuPanel;
	private _pointerEnterTimer: any;
	/** Data to be passed along to any lazily-rendered content. */
	// tslint:disable-next-line:no-input-rename
	@Input('matMenuHoverTriggerData') menuData: any;

	/**
	 * Whether focus should be restored when the menu is closed.
	 * Note that disabling this option can have accessibility implications
	 * and it's up to you to manage focus, if you decide to turn it off.
	 */
	// tslint:disable-next-line:no-input-rename
	@Input('matMenuHoverTriggerRestoreFocus') restoreFocus = true;

	/** Event emitted when the associated menu is opened. */
	// tslint:disable-next-line:no-input-rename
	@Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * Event emitted when the associated menu is opened.
	 * @deprecated Switch to `menuOpened` instead
	 * @breaking-change 8.0.0
	 */
	// tslint:disable-next-line:no-output-on-prefix
	@Output() readonly onMenuOpen: EventEmitter<void> = this.menuOpened;

	/** Event emitted when the associated menu is closed. */
	@Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * Event emitted when the associated menu is closed.
	 * @deprecated Switch to `menuClosed` instead
	 * @breaking-change 8.0.0
	 */
	// tslint:disable-next-line:no-output-on-prefix
	@Output() readonly onMenuClose: EventEmitter<void> = this.menuClosed;
	// Tracking input type is necessary so it's possible to only auto-focus
	// the first item of the list when the menu is opened via the keyboard
	_openedBy: 'mouse' | 'touch' | null = null;

	/**
	 * Handles touch start events on the trigger.
	 * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
	 */
	private _handleTouchStart = () => (this._openedBy = 'touch');

	/** References the menu instance that the trigger is associated with. */
	@Input('menuHoverTriggerFor')
	get menu() {
		return this._menu;
	}
	set menu(menu: MatMenuPanel) {
		if (menu === this._menu) {
			return;
		}

		this._menu = menu;
		this._menuCloseSubscription.unsubscribe();

		if (menu) {
			if (menu === this._parentMenu) {
				throw new MenuRecursiveError();
			}
			this._menuCloseSubscription = menu.close.subscribe(
				(reason: 'click' | 'tab' | 'keydown' | undefined) => {
					this._destroyMenu();

					// If a click closed the menu, we should close the entire chain of nested menus.
					if ((reason === 'click' || reason === 'tab') && this._parentMenu) {
						this._parentMenu.closed.emit(reason);
					}
				}
			);
		}
	}

	constructor(
		private _overlay: Overlay,
		private _element: ElementRef<HTMLElement>,
		private _viewContainerRef: ViewContainerRef,
		@Inject(MAT_MENU_SCROLL_STRATEGY) scrollStrategy: any,
		@Optional() private _parentMenu: MatMenu,
		@Optional() @Self() private _menuItemInstance: MatMenuItem,
		@Optional() private _dir: Directionality,
		private _focusMonitor?: FocusMonitor
	) {
		_element.nativeElement.addEventListener(
			'touchstart',
			this._handleTouchStart,
			passiveEventListenerOptions
		);

		if (_menuItemInstance) {
			_menuItemInstance._triggersSubmenu = this.triggersSubmenu();
		}

		this._scrollStrategy = scrollStrategy;
	}

	ngAfterContentInit() {
		this._checkMenu();
		this._handleHover();
	}

	ngOnDestroy() {
		if (this._overlayRef) {
			this._overlayRef.dispose();
			this._overlayRef = null;
		}

		this._element.nativeElement.removeEventListener(
			'touchstart',
			this._handleTouchStart,
			passiveEventListenerOptions
		);

		this._menuCloseSubscription.unsubscribe();
		this._closingActionsSubscription.unsubscribe();
		this._hoverSubscription.unsubscribe();
	}

	/** Whether the menu is open. */
	get menuOpen(): boolean {
		return this._menuOpen;
	}

	/** The text direction of the containing app. */
	get dir(): Direction {
		return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
	}

	/** Whether the menu triggers a sub-menu or a top-level one. */
	triggersSubmenu(): boolean {
		return !!(this._menuItemInstance && this._parentMenu);
	}

	/** Toggles the menu between the open and closed states. */
	toggleMenu(): void {
		return this._menuOpen ? this.closeMenu() : this.openMenu();
	}

	/** Opens the menu. */
	openMenu(): void {
		if (this._menuOpen) {
			return;
		}

		this._pointerEnterTimer = setTimeout(() => {
			this._checkMenu();

			const overlayRef = this._createOverlay();
			const overlayConfig = overlayRef.getConfig();

			this._setPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
			overlayRef.attach(this._getPortal());

			overlayRef.outsidePointerEvents().subscribe(($event) => {
				const element = this._element.nativeElement;
				const position = {
					x1: element.offsetLeft,
					y1: element.offsetTop,
					x2: element.clientWidth + element.offsetLeft,
					y2: element.clientHeight + element.offsetTop,
				};
				if (!this.isPointerInRectangle({ x: $event.x, y: $event.y }, position)) {
					this.closeMenu();
				}
			});

			if (this.menu.lazyContent) {
				this.menu.lazyContent.attach(this.menuData);
			}

			this._closingActionsSubscription = this._menuClosingActions().subscribe(() =>
				this.closeMenu()
			);
			this._initMenu();

			if (this.menu instanceof MatMenu) {
				this.menu._startAnimation();
			}
		}, 200);
	}

	isPointerInRectangle(point: any, rectangle: any): boolean {
		return (
			point.x >= rectangle.x1 &&
			point.x <= rectangle.x2 &&
			point.y >= rectangle.y1 &&
			point.y <= rectangle.y2
		);
	}

	/** Closes the menu. */
	closeMenu(): void {
		this.menu.close.emit();
	}

	/**
	 * Focuses the menu trigger.
	 * @param origin Source of the menu trigger's focus.
	 */
	focus(origin: FocusOrigin = 'program', options?: FocusOptions) {
		if (this._focusMonitor) {
			this._focusMonitor.focusVia(this._element, origin, options);
		} else {
			this._element.nativeElement.focus(options);
		}
	}

	/** Closes the menu and does the necessary cleanup. */
	private _destroyMenu() {
		if (!this._overlayRef || !this.menuOpen) {
			return;
		}

		const menu = this.menu;
		this._closingActionsSubscription.unsubscribe();
		this._overlayRef.detach();
		this._restoreFocus();

		if (menu instanceof MatMenu) {
			menu._resetAnimation();

			if (menu.lazyContent) {
				// Wait for the exit animation to finish before detaching the content.
				menu._animationDone
					.pipe(
						filter((event) => event.toState === 'void'),
						take(1),
						// Interrupt if the content got re-attached.
						takeUntil(menu.lazyContent._attached)
					)
					.subscribe({
						next: () => menu.lazyContent?.detach(),
						// No matter whether the content got re-attached, reset the menu.
						complete: () => this._setIsMenuOpen(false),
					});
			} else {
				this._setIsMenuOpen(false);
			}
		} else {
			this._setIsMenuOpen(false);

			if (menu.lazyContent) {
				menu.lazyContent.detach();
			}
		}
	}

	/**
	 * This method sets the menu state to open and focuses the first item if
	 * the menu was opened via the keyboard.
	 */
	private _initMenu(): void {
		this.menu.parentMenu = this.triggersSubmenu() ? this._parentMenu : undefined;
		this.menu.direction = this.dir;
		this._setMenuElevation();
		this._setIsMenuOpen(true);
		this.menu.focusFirstItem(this._openedBy || 'program');
	}

	/** Updates the menu elevation based on the amount of parent menus that it has. */
	private _setMenuElevation(): void {
		if (this.menu.setElevation) {
			let depth = 0;
			let parentMenu = this.menu.parentMenu;

			while (parentMenu) {
				depth++;
				parentMenu = parentMenu.parentMenu;
			}

			this.menu.setElevation(depth);
		}
	}

	/** Restores focus to the element that was focused before the menu was open. */
	private _restoreFocus() {
		// We should reset focus if the user is navigating using a keyboard or
		// if we have a top-level trigger which might cause focus to be lost
		// when clicking on the backdrop.
		if (this.restoreFocus) {
			if (!this._openedBy) {
				// Note that the focus style will show up both for `program` and
				// `keyboard` so we don't have to specify which one it is.
				this.focus();
			} else if (!this.triggersSubmenu()) {
				this.focus(this._openedBy);
			}
		}

		this._openedBy = null;
	}

	// set state rather than toggle to support triggers sharing a menu
	private _setIsMenuOpen(isOpen: boolean): void {
		this._menuOpen = isOpen;
		this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();

		if (this.triggersSubmenu()) {
			this._menuItemInstance._highlighted = isOpen;
		}
	}

	/**
	 * This method checks that a valid instance of MatMenu has been passed into
	 * matMenuHoverTriggerFor. If not, an exception is thrown.
	 */
	private _checkMenu() {
		if (!this.menu) {
			throw new MenuMissingError();
		}
	}

	/**
	 * This method creates the overlay from the provided menu's template and saves its
	 * OverlayRef so that it can be attached to the DOM when openMenu is called.
	 */
	private _createOverlay(): OverlayRef {
		if (!this._overlayRef) {
			const config = this._getOverlayConfig();
			this._subscribeToPositions(
				config.positionStrategy as FlexibleConnectedPositionStrategy
			);
			this._overlayRef = this._overlay.create(config);

			// Consume the `keydownEvents` in order to prevent them from going to another overlay.
			// Ideally we'd also have our keyboard event logic in here, however doing so will
			// break anybody that may have implemented the `MatMenuPanel` themselves.
			this._overlayRef.keydownEvents().subscribe();
		}

		return this._overlayRef;
	}

	/**
	 * This method builds the configuration object needed to create the overlay, the OverlayState.
	 * @returns OverlayConfig
	 */
	private _getOverlayConfig(): OverlayConfig {
		return new OverlayConfig({
			positionStrategy: this._overlay
				.position()
				.flexibleConnectedTo(this._element)
				.withLockedPosition()
				.withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
			backdropClass: this.menu.backdropClass || 'cdk-overlay-transparent-backdrop',
			panelClass: this.menu.overlayPanelClass,
			scrollStrategy: this._scrollStrategy(),
			direction: this._dir,
		});
	}

	/**
	 * Listens to changes in the position of the overlay and sets the correct classes
	 * on the menu based on the new position. This ensures the animation origin is always
	 * correct, even if a fallback position is used for the overlay.
	 */
	private _subscribeToPositions(position: FlexibleConnectedPositionStrategy): void {
		if (this.menu.setPositionClasses) {
			position.positionChanges.subscribe((change) => {
				const posX: MenuPositionX =
					change.connectionPair.overlayX === 'start' ? 'after' : 'before';
				const posY: MenuPositionY =
					change.connectionPair.overlayY === 'top' ? 'below' : 'above';

				this.menu?.setPositionClasses(posX, posY);
			});
		}
	}

	/**
	 * Sets the appropriate positions on a position strategy
	 * so the overlay connects with the trigger correctly.
	 * @param positionStrategy Strategy whose position to update.
	 */
	private _setPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
		let [originX, originFallbackX]: HorizontalConnectionPos[] =
			this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];

		const [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
			this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

		let [originY, originFallbackY] = [overlayY, overlayFallbackY];
		let [overlayX, overlayFallbackX] = [originX, originFallbackX];
		let offsetY = 0;

		if (this.triggersSubmenu()) {
			// When the menu is a sub-menu, it should always align itself
			// to the edges of the trigger, instead of overlapping it.
			overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
			originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
			offsetY = overlayY === 'bottom' ? MENU_PANEL_TOP_PADDING : -MENU_PANEL_TOP_PADDING;
		} else if (!this.menu.overlapTrigger) {
			originY = overlayY === 'top' ? 'bottom' : 'top';
			originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
		}

		positionStrategy.withPositions([
			{ originX, originY, overlayX, overlayY, offsetY },
			{ originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
			{
				originX,
				originY: originFallbackY,
				overlayX,
				overlayY: overlayFallbackY,
				offsetY: -offsetY,
			},
			{
				originX: originFallbackX,
				originY: originFallbackY,
				overlayX: overlayFallbackX,
				overlayY: overlayFallbackY,
				offsetY: -offsetY,
			},
		]);
	}

	/** Returns a stream that emits whenever an action that should close the menu occurs. */
	private _menuClosingActions() {
		const backdrop = this._overlayRef?.backdropClick();
		const detachments = this._overlayRef?.detachments();
		const parentClose = this._parentMenu ? this._parentMenu.closed : observableOf();
		const hover = this._parentMenu
			? this._parentMenu._hovered().pipe(
				filter((active) => active !== this._menuItemInstance),
				filter(() => this._menuOpen)
			)
			: observableOf();

		return merge(backdrop, parentClose, hover, detachments);
	}

	/** Handles mouse presses on the trigger. */
	_handleMousedown(event: MouseEvent): void {
		if (!isFakeMousedownFromScreenReader(event)) {
			// Since right or middle button clicks won't trigger the `click` event,
			// we shouldn't consider the menu as opened by mouse in those cases.
			this._openedBy = event.button === 0 ? 'mouse' : null;

			// Since clicking on the trigger won't close the menu if it opens a sub-menu,
			// we should prevent focus from moving onto it via click to avoid the
			// highlight from lingering on the menu item.
			if (this.triggersSubmenu()) {
				event.preventDefault();
			}
		}
	}

	/** Handles key presses on the trigger. */
	_handleKeydown(event: KeyboardEvent): void {
		const keyCode = event.keyCode;

		if (
			this.triggersSubmenu() &&
			((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
				(keyCode === LEFT_ARROW && this.dir === 'rtl'))
		) {
			this.openMenu();
		}
	}

	_handlePointerEnter(event: any): void {
		this.openMenu();
	}

	_handlePointerLeave(event: any): void {
		if (this._pointerEnterTimer) {
			clearTimeout(this._pointerEnterTimer);
			this._pointerEnterTimer = null;
		}
	}

	_handleFocus(event: any): void {
		this.openMenu();
	}

	/** Handles click events on the trigger. */
	_handleClick(event: MouseEvent): void {
		this.openMenu();
	}

	/** Handles the cases where the user hovers over the trigger. */
	private _handleHover() {
		// Subscribe to changes in the hovered item in order to toggle the panel.
		if (!this.triggersSubmenu()) {
			return;
		}

		this._hoverSubscription = this._parentMenu
			._hovered()
			// Since we might have multiple competing triggers for the same menu (e.g. a sub-menu
			// with different data and triggers), we have to delay it by a tick to ensure that
			// it won't be closed immediately after it is opened.
			.pipe(
				filter((active) => active === this._menuItemInstance && !active.disabled),
				delay(0, asapScheduler)
			)
			.subscribe(() => {
				this._openedBy = 'mouse';

				// If the same menu is used between multiple triggers, it might still be animating
				// while the new trigger tries to re-open it. Wait for the animation to finish
				// before doing so. Also interrupt if the user moves to another item.
				if (this.menu instanceof MatMenu && this.menu._isAnimating) {
					// We need the `delay(0)` here in order to avoid
					// 'changed after checked' errors in some cases. See #12194.
					this.menu._animationDone
						.pipe(
							take(1),
							delay(0, asapScheduler),
							takeUntil(this._parentMenu._hovered())
						)
						.subscribe(() => this.openMenu());
				} else {
					this.openMenu();
				}
			});
	}

	/** Gets the portal that should be attached to the overlay. */
	private _getPortal(): TemplatePortal {
		// Note that we can avoid this check by keeping the portal on the menu panel.
		// While it would be cleaner, we'd have to introduce another required method on
		// `MatMenuPanel`, making it harder to consume.
		if (!this._portal || this._portal.templateRef !== this.menu.templateRef) {
			this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
		}

		return this._portal;
	}
}

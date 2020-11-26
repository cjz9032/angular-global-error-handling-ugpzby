import {
	Directive,
	OnInit,
	ElementRef,
	Renderer2,
	HostListener,
	Input,
	Output,
	EventEmitter,
	AfterViewInit,
} from '@angular/core';
import { KeyCode } from 'src/app/enums/key-code.enum';

interface selectValueFromList {
	value?: number;
	hideList: boolean;
}

@Directive({
	selector: '[uiDropdownNavigate]',
})
export class UiDropdownNavigate implements OnInit, AfterViewInit {
	focusable: Array<any>;
	nextIndex: number;
	@Input() isDropdownOpen: boolean;
	@Input() selectedChild: number;
	@Output()
	closeDropdown: EventEmitter<selectValueFromList> = new EventEmitter<selectValueFromList>();

	constructor(private elRef: ElementRef, private renderer: Renderer2) {}

	// Dropdown listbox receives the focus
	ngOnInit() {
		this.elRef.nativeElement.focus();
	}

	// this lifecycle hook sets focus to selected interval if any or sets focus to first element in list
	ngAfterViewInit() {
		this.focusable = [...Array.from(this.elRef.nativeElement.children)];
		if (this.selectedChild) {
			this.nextIndex = this.selectedChild;
			this.renderer.setAttribute(
				this.elRef.nativeElement.children[this.nextIndex],
				'tabindex',
				'0'
			);
			this.elRef.nativeElement.children[this.nextIndex].focus();
		} else {
			this.nextIndex = 0;
			this.renderer.setAttribute(
				this.elRef.nativeElement.children[this.nextIndex],
				'tabindex',
				'0'
			);
			this.elRef.nativeElement.children[this.nextIndex].focus();
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownEvent() {
		// keyboard events triggered on the listbox.
		switch (event['keyCode']) {
			case KeyCode.TAB:
			case KeyCode.ESC:
				this.closeDropdown.emit({ hideList: false });
				this.elRef.nativeElement.previousElementSibling.focus();
				break;
			case KeyCode.RETURN:
				this.closeDropdown.emit({ value: this.nextIndex, hideList: true });
				this.elRef.nativeElement.previousElementSibling.focus();
				break;
			case KeyCode.UP:
				event.preventDefault();
				if (this.nextIndex === 0) {
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'-1'
					);
					this.nextIndex = this.focusable.length - 1;
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'0'
					);
					this.elRef.nativeElement.children[this.nextIndex].focus();
				} else {
					this.nextIndex = this.nextIndex > 0 ? this.nextIndex - 1 : 0;
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'0'
					);
					this.elRef.nativeElement.children[this.nextIndex].focus();
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex + 1],
						'tabindex',
						'-1'
					);
				}
				break;
			case KeyCode.HOME:
				event.preventDefault();
				this.renderer.setAttribute(
					this.elRef.nativeElement.children[this.nextIndex],
					'tabindex',
					'-1'
				);
				this.nextIndex = 0;
				this.renderer.setAttribute(
					this.elRef.nativeElement.children[this.nextIndex],
					'tabindex',
					'0'
				);
				this.elRef.nativeElement.children[this.nextIndex].focus();
				break;
			case KeyCode.END:
				event.preventDefault();
				this.renderer.setAttribute(
					this.elRef.nativeElement.children[this.nextIndex],
					'tabindex',
					'-1'
				);
				this.nextIndex = this.focusable.length - 1;
				this.renderer.setAttribute(
					this.elRef.nativeElement.children[this.nextIndex],
					'tabindex',
					'0'
				);
				this.elRef.nativeElement.children[this.nextIndex].focus();
				break;
			case KeyCode.DOWN:
				event.preventDefault();
				if (this.nextIndex === this.focusable.length - 1) {
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'-1'
					);
					this.nextIndex = 0;
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'0'
					);
					this.elRef.nativeElement.children[this.nextIndex].focus();
				} else {
					this.nextIndex =
						this.nextIndex < this.elRef.nativeElement.childElementCount
							? this.nextIndex + 1
							: this.nextIndex;
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex],
						'tabindex',
						'0'
					);
					this.elRef.nativeElement.children[this.nextIndex].focus();
					this.renderer.setAttribute(
						this.elRef.nativeElement.children[this.nextIndex - 1],
						'tabindex',
						'-1'
					);
				}
				break;
		}
	}

	// closes the list box when clicked outside.
	@HostListener('document:click', ['$event'])
	onClickedOutside() {
		if (
			this.isDropdownOpen &&
			!this.elRef.nativeElement.contains((<HTMLButtonElement>event.target).nextElementSibling)
		) {
			this.closeDropdown.emit({ hideList: false });
			return;
		}
	}
}

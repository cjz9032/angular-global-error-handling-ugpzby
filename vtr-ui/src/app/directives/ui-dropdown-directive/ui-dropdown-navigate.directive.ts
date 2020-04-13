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
} from "@angular/core";

interface selectValueFromList {
	value?: number;
	hideList: boolean;
}

@Directive({
	selector: "[uiDropdownNavigate]",
})
export class UiDropdownNavigate implements OnInit, AfterViewInit {
	focusable: Array<any>;
	nextIndex: number;
	@Input() isDropdownOpen: boolean;
	@Input() selectedChild: number;
	@Output() closeDropdown: EventEmitter<selectValueFromList> = new EventEmitter<
	selectValueFromList
	>();

	constructor(private elRef: ElementRef, private renderer: Renderer2) {}

	ngOnInit() {
		this.elRef.nativeElement.focus();
	}

	ngAfterViewInit() {
		this.focusable = [...Array.from(this.elRef.nativeElement.children)];
		if(this.selectedChild) {
			this.nextIndex = this.selectedChild;
			this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '0');
			this.elRef.nativeElement.children[this.nextIndex].focus();
		} else {
			this.nextIndex = 0;
			this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '0');
			this.elRef.nativeElement.children[this.nextIndex].focus();
		}
	}

	@HostListener("document:keydown", ["$event"])
	onKeydownEvent() {
		
		switch(event['keyCode']) {
			case 9:
			case 27:
				this.closeDropdown.emit({value: this.selectedChild, hideList: false});
				this.elRef.nativeElement.previousElementSibling.focus();
				break;
			case 13:
				this.closeDropdown.emit({value: this.nextIndex, hideList: true});
				this.elRef.nativeElement.previousElementSibling.focus();
				break;
			case 38:
					this.nextIndex = this.nextIndex > 0 ? this.nextIndex - 1 : 0;
					this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '0');
					this.elRef.nativeElement.children[this.nextIndex].focus()
					this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex + 1], 'tabindex', '-1');
				break;
			case 40:
					if(this.nextIndex === this.focusable.length - 1) {
						this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '-1');
						this.nextIndex = 0;
						this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '0');
						this.elRef.nativeElement.children[this.nextIndex].focus()
					} else {
						this.nextIndex = this.nextIndex < this.elRef.nativeElement.childElementCount ? this.nextIndex + 1 : this.nextIndex;
						this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex], 'tabindex', '0');
						this.elRef.nativeElement.children[this.nextIndex].focus()
						this.renderer.setAttribute(this.elRef.nativeElement.children[this.nextIndex - 1], 'tabindex', '-1')
					}				
				break;
		}
		
	}

	@HostListener("document:click", ["$event"])
	onClickedOutside() {
		if (
			this.isDropdownOpen &&
			(!this.elRef.nativeElement.contains((<HTMLButtonElement>event.target).nextElementSibling))
		) {
			this.closeDropdown.emit({hideList: false});
			return;
		}
	}
}
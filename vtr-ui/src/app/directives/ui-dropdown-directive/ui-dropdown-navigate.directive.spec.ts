import { TestBed, ComponentFixture } from "@angular/core/testing";
import { UiDropdownNavigate } from "./ui-dropdown-navigate.directive";
import {
	Component,
	ElementRef,
	Renderer2,
	DebugElement,
	Type,
} from "@angular/core";
import { By } from "@angular/platform-browser";

@Component({
    selector: 'test-comp',
	template: `
		<div
			uiDropdownNavigate
			[isDropdownOpen]="isDropDownOpen"
			[selectedChild]="selectedDuration"
			class="ui-menu-dropdown"
			role="listbox"
		>
			<a
				*ngFor="let item of list; let i = index"
				role="option"
				id="{{ item.text }}"
				tabindex="-1"
				>{{ item.text }}</a
			>
		</div>
	`,
})
class MockComponent {
	isDropDownOpen = true;
	selectedDuration = 0;
}

xdescribe("UiDropdownNavigate", () => {
	let component: MockComponent;
	let fixture: ComponentFixture<MockComponent>;
	let dummyElement;
	// let renderer: Renderer2;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			declarations: [MockComponent, UiDropdownNavigate],
			// providers: [Renderer2],
        }).createComponent(MockComponent)
        
        fixture.detectChanges();
        dummyElement = fixture.debugElement.query(By.directive(UiDropdownNavigate))
	});
	it("should create an instance", () => {
        const divEl = dummyElement.nativeElement.focus();
        expect(divEl).toHaveBeenCalled()
    });
});

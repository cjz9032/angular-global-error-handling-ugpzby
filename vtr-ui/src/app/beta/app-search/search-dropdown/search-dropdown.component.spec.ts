import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchDropdownComponent } from './search-dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('SearchDropdownComponent', () => {
	let component: SearchDropdownComponent;
	let fixture: ComponentFixture<SearchDropdownComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SearchDropdownComponent],
			imports: [FontAwesomeModule, RouterTestingModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

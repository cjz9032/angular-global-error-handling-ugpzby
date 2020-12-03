import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchTipsComponent } from './search-tips.component';

describe('SearchTipsComponent', () => {
	let component: SearchTipsComponent;
	let fixture: ComponentFixture<SearchTipsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SearchTipsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchTipsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

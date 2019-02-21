import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedHomeSecurityComponent } from './connected-home-security.component';

describe('ConnectedHomeSecurityComponent', () => {
	let component: ConnectedHomeSecurityComponent;
	let fixture: ComponentFixture<ConnectedHomeSecurityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ConnectedHomeSecurityComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConnectedHomeSecurityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

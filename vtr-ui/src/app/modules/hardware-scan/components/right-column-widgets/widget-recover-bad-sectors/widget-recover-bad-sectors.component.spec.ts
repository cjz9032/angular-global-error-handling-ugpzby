import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetRecoverBadSectorsComponent } from './widget-recover-bad-sectors.component';

xdescribe('WidgetRecoverBadSectorsComponent', () => {
	let component: WidgetRecoverBadSectorsComponent;
	let fixture: ComponentFixture<WidgetRecoverBadSectorsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetRecoverBadSectorsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetRecoverBadSectorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

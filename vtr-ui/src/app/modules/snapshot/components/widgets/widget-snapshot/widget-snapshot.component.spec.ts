import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { WidgetSnapshotComponent } from './widget-snapshot.component';

describe('WidgetSnapshotComponent', () => {
	let component: WidgetSnapshotComponent;
	let fixture: ComponentFixture<WidgetSnapshotComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WidgetSnapshotComponent],
			imports: [TranslateModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSnapshotComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should validate the title text when instantiate the widget', () => {
		const widgetTitle = 'snapshot.title';

		const descriptionElement = fixture.debugElement.query(By.css('#snapshot-widget-title'))
			.nativeElement;

		expect(descriptionElement.textContent).toEqual(widgetTitle);
	});

	it('should validate the description text when instantiate the widget', () => {
		const widgetDescription = 'snapshot.description';

		const descriptionElement = fixture.debugElement.query(
			By.css('#snapshot-widget-description')
		).nativeElement;

		expect(descriptionElement.textContent).toEqual(widgetDescription);
	});
});

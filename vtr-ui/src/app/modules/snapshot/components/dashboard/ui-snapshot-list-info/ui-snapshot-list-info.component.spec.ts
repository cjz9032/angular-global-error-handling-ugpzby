import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UiSnapshotListInfoComponent } from './ui-snapshot-list-info.component';

describe('UiSnapshotListInfoComponent', () => {
	let component: UiSnapshotListInfoComponent;
	let fixture: ComponentFixture<UiSnapshotListInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSnapshotListInfoComponent],
			imports: [TranslateModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSnapshotListInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should test selectAny emitter onSelectAll method', () => {
		component.componentList = [
			{
				name: '',
				components: [],
				selected: true,
				indeterminate: true,
			},
		];

		spyOn(component.selectAny, 'emit').and.callThrough();
		component.onSelectAll();
		expect(component.selectAny.emit).toHaveBeenCalled();
	});

	it('should test selectAny emitter onDeviceSelectionClicked method', () => {
		const item = {
			name: '',
			components: [],
			selected: true,
			indeterminate: true,
		};
		spyOn(component.selectAny, 'emit').and.callThrough();
		component.onDeviceSelectionClicked(item, true);
		expect(component.selectAny.emit).toHaveBeenCalled();
	});

	it('should test selectAny emitter onCheckChildren method', () => {
		const item = {
			name: '',
			components: [],
			selected: true,
			indeterminate: true,
		};
		spyOn(component.selectAny, 'emit').and.callThrough();
		component.onCheckChildren(item);
		expect(component.selectAny.emit).toHaveBeenCalled();
	});
});

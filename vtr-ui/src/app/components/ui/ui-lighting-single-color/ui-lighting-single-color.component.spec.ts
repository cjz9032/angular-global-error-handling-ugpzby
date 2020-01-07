import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLightingSingleColorComponent } from './ui-lighting-single-color.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';

describe('UiLightingSingleColorComponent', () => {
	let component: UiLightingSingleColorComponent;
	let fixture: ComponentFixture<UiLightingSingleColorComponent>;
	const items = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiLightingSingleColorComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
				schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingSingleColorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.options = items;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the value of the selected option', () => {
		component.getValue(1);
		expect(component.selectedOptionId).toBe(1);
	});

	it('should get true from isChecked', () => {
		component.selectedOptionId = 1;
		const res = component.isChecked(1);
		expect(res).toBe(true);
	});

	it('should update the selectedoption based on the input changes', () => {
		component.ngOnChanges({ selectedOptionId: { previousValue: 2, currentValue: 1}});
		expect(component.selectedOptionId).toBe(1);
	});


});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}

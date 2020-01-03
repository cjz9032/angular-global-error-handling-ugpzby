import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetNetworkboostComponent } from './widget-networkboost.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';

describe('WidgetNetworkboostComponent', () => {
	let component: WidgetNetworkboostComponent;
	let fixture: ComponentFixture<WidgetNetworkboostComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				WidgetNetworkboostComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })
			  ],
			  schemas: [NO_ERRORS_SCHEMA],
			  providers: [
				{ provide: HttpClient }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetNetworkboostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check removeApp', () => {
		component.removeApp('Google Chrome', 1);
		expect(component).toBeTruthy();
	});

	it('should check openModal', () => {
		component.openModal();
		expect(component).toBeTruthy();
	});
	it('should check ngOnChanges', () => {
		component.ngOnChanges(true);
		expect(component).toBeTruthy();
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsInputAccessoryComponent } from './subpage-device-settings-input-accessory.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

xdescribe('SubpageDeviceSettingsInputAccessoryComponent', () => {
  let component: SubpageDeviceSettingsInputAccessoryComponent;
  let fixture: ComponentFixture<SubpageDeviceSettingsInputAccessoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubpageDeviceSettingsInputAccessoryComponent,
        mockPipe({ name: 'translate' }) ],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule],
        providers: [
					{ provide: HttpClient }]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageDeviceSettingsInputAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			// public transform(query: string, ...args: any[]): any {
			// 	return query;
			// }
		}
	);
}

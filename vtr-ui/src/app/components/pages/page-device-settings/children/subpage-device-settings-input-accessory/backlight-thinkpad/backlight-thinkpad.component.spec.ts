import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklightThinkpadComponent } from './backlight-thinkpad.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { UiSwitchOnoffComponent } from 'src/app/components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { DevService } from 'src/app/services/dev/dev.service';

describe('BacklightThinkpadComponent', () => {
	let component: BacklightThinkpadComponent;
	let fixture: ComponentFixture<BacklightThinkpadComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BacklightThinkpadComponent, UiRowSwitchComponent, UiSwitchOnoffComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'removeSpace' }), mockPipe({ name: 'separatePascalCase' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore, DevService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BacklightThinkpadComponent);
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
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}

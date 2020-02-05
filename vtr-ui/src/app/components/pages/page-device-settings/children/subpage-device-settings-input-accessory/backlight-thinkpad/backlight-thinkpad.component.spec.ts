import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklightThinkpadComponent } from './backlight-thinkpad.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { BacklightStatusEnum, BacklightLevelEnum } from '../backlight/backlight.enum';

describe('BacklightThinkpadComponent', () => {
	let component: BacklightThinkpadComponent;
	let fixture: ComponentFixture<BacklightThinkpadComponent>;
	let keyboardService: InputAccessoriesService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BacklightThinkpadComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'removeSpace' }), mockPipe({ name: 'separatePascalCase' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientTestingModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BacklightThinkpadComponent);
		component = fixture.componentInstance;
		keyboardService = fixture.debugElement.injector.get(InputAccessoriesService);
		// fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#updateMode called with Auto', async () => {
		spyOn(component, 'setAutomaticKBDBacklight');
		spyOn(component, 'setKBDBacklightStatus');
		fixture.detectChanges();
		component.updateMode(BacklightStatusEnum.AUTO);
		expect(component.setAutomaticKBDBacklight).toHaveBeenCalled();
		// expect(component.setKBDBacklightStatus).not.toHaveBeenCalled();
	});

	it('#updateMode called with Level_2', async () => {
		spyOn(component, 'setAutomaticKBDBacklight');
		spyOn(component, 'setKBDBacklightStatus');
		fixture.detectChanges();
		component.updateMode(BacklightStatusEnum.LEVEL_2);
		expect(component.setAutomaticKBDBacklight).toHaveBeenCalled();
		expect(component.setKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightCapability capability: true', async () => {
		spyOn(keyboardService, 'getKBDBacklightCapability').and.returnValue(Promise.resolve(true));
		spyOn(component, 'getAutoKBDBacklightCapability');
		spyOn(component, 'getKBDBacklightLevel');
		fixture.detectChanges();
		component.getKBDBacklightCapability();
		expect(keyboardService.getKBDBacklightCapability).toHaveBeenCalled();
	});

	it('##getKBDBacklightCapability capability: false', async () => {
		spyOn(keyboardService, 'getKBDBacklightCapability').and.returnValue(Promise.resolve(false));
		spyOn(component, 'getAutoKBDBacklightCapability');
		spyOn(component, 'getKBDBacklightLevel');
		fixture.detectChanges();
		component.getKBDBacklightCapability();
		expect(keyboardService.getKBDBacklightCapability).toHaveBeenCalled();
	});

	it('#getAutoKBDBacklightCapability capability: true', async () => {
		spyOn(keyboardService, 'getAutoKBDBacklightCapability').and.returnValue(Promise.resolve(true));
		spyOn(component, 'getAutoKBDStatus');
		fixture.detectChanges();
		component.getAutoKBDBacklightCapability();
		expect(keyboardService.getAutoKBDBacklightCapability).toHaveBeenCalled();
	});

	it('#getAutoKBDBacklightCapability capability: false', async () => {
		spyOn(keyboardService, 'getAutoKBDBacklightCapability').and.returnValue(Promise.resolve(false));
		spyOn(component, 'getAutoKBDStatus');
		fixture.detectChanges();
		component.getAutoKBDBacklightCapability();
		expect(keyboardService.getAutoKBDBacklightCapability).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Auto', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(Promise.resolve(BacklightStatusEnum.AUTO));
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Level_2', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(Promise.resolve(BacklightStatusEnum.LEVEL_2));
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: DisabledOff', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(Promise.resolve(BacklightStatusEnum.DISABLED_OFF));
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Off', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(Promise.resolve(BacklightStatusEnum.OFF));
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getAutoKBDStatus status: true', async () => {
		spyOn(keyboardService, 'getAutoKBDStatus').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.getAutoKBDStatus();
		expect(keyboardService.getAutoKBDStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: NoCapability', async () => {
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(Promise.resolve(BacklightLevelEnum.NO_CAPABILITY));
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: NoCapability -catch', async () => {
		let error = {message: 'There is an error'}
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(Promise.reject(error));
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: OneLevel', async () => {
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(Promise.resolve(BacklightLevelEnum.ONE_LEVEL));
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: TWO_LEVELS_AUTO', async () => {
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(Promise.resolve(BacklightLevelEnum.TWO_LEVELS_AUTO));
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called', async () => {
		spyOn(keyboardService, 'setKBDBacklightStatus').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(keyboardService.setKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called -else', async () => {
		let spy = spyOn(keyboardService, 'setKBDBacklightStatus')
		// fixture.detectChanges();
		keyboardService.isShellAvailable = false
		component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(spy).not.toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called - catch block', async () => {
		spyOn(keyboardService, 'setKBDBacklightStatus').and.returnValue(Promise.reject(true));
		fixture.detectChanges();
		component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(keyboardService.setKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#setAutomaticKBDBacklight called', async () => {
		spyOn(keyboardService, 'setAutomaticKBDBacklight').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		component.setAutomaticKBDBacklight(true);
		expect(keyboardService.setAutomaticKBDBacklight).toHaveBeenCalled();
	});

	it('#setAutomaticKBDBacklight called -else', async () => {
		let spy = spyOn(keyboardService, 'setAutomaticKBDBacklight');
		// fixture.detectChanges();
		keyboardService.isShellAvailable = false
		component.setAutomaticKBDBacklight(true);
		expect(spy).not.toHaveBeenCalled();
	});

	it('#setAutomaticKBDBacklight called - catch block', async () => {
		spyOn(keyboardService, 'setAutomaticKBDBacklight').and.returnValue(Promise.reject(true));
		fixture.detectChanges();
		component.setAutomaticKBDBacklight(true);
		expect(keyboardService.setAutomaticKBDBacklight).toHaveBeenCalled();
	});

	it('should call compare - Auto', () => {
		let value = 'Auto'
		component['compare'](value)
		expect(BacklightStatusEnum.AUTO).toEqual(value)
	});

	it('should call compare - Level_1', () => {
		let value = 'Level_1'
		component['compare'](value)
		expect(BacklightStatusEnum.LEVEL_1).toEqual(value)
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

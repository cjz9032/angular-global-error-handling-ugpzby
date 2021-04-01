import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { BacklightLevelEnum, BacklightStatusEnum } from '../backlight/backlight.enum';
import { BacklightThinkpadComponent } from './backlight-thinkpad.component';

describe('BacklightThinkpadComponent', () => {
	let component: BacklightThinkpadComponent;
	let fixture: ComponentFixture<BacklightThinkpadComponent>;
	let keyboardService: InputAccessoriesService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				BacklightThinkpadComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'removeSpace' }),
				mockPipe({ name: 'separatePascalCase' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientTestingModule, RouterTestingModule],
			providers: [TranslateStore],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BacklightThinkpadComponent);
		component = fixture.componentInstance;
		keyboardService = fixture.debugElement.injector.get(InputAccessoriesService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
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
		spyOn(keyboardService, 'getAutoKBDBacklightCapability').and.returnValue(
			Promise.resolve(true)
		);
		spyOn(component, 'getAutoKBDStatus');
		fixture.detectChanges();
		component.getAutoKBDBacklightCapability();
		expect(keyboardService.getAutoKBDBacklightCapability).toHaveBeenCalled();
	});

	it('#getAutoKBDBacklightCapability capability: false', async () => {
		spyOn(keyboardService, 'getAutoKBDBacklightCapability').and.returnValue(
			Promise.resolve(false)
		);
		spyOn(component, 'getAutoKBDStatus');
		fixture.detectChanges();
		component.getAutoKBDBacklightCapability();
		expect(keyboardService.getAutoKBDBacklightCapability).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Auto', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(
			Promise.resolve(BacklightStatusEnum.AUTO)
		);
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Level_2', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(
			Promise.resolve(BacklightStatusEnum.LEVEL_2)
		);
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: DisabledOff', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(
			Promise.resolve(BacklightStatusEnum.DISABLED_OFF)
		);
		fixture.detectChanges();
		component.getKBDBacklightStatus();
		expect(keyboardService.getKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#getKBDBacklightStatus status: Off', async () => {
		spyOn(keyboardService, 'getKBDBacklightStatus').and.returnValue(
			Promise.resolve(BacklightStatusEnum.OFF)
		);
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
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(
			Promise.resolve(BacklightLevelEnum.NO_CAPABILITY)
		);
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: NoCapability -catch', async () => {
		const error = { message: 'There is an error' };
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(Promise.reject(error));
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: OneLevel', async () => {
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(
			Promise.resolve(BacklightLevelEnum.ONE_LEVEL)
		);
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#getKBDBacklightLevel status: TWO_LEVELS_AUTO', async () => {
		spyOn(keyboardService, 'getKBDBacklightLevel').and.returnValue(
			Promise.resolve(BacklightLevelEnum.TWO_LEVELS_AUTO)
		);
		fixture.detectChanges();
		component.getKBDBacklightLevel();
		expect(keyboardService.getKBDBacklightLevel).toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called', async () => {
		spyOn(keyboardService, 'setKBDBacklightStatus').and.returnValue(Promise.resolve(true));
		fixture.detectChanges();
		await component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(keyboardService.setKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called -else', async () => {
		const spy = spyOn(keyboardService, 'setKBDBacklightStatus');
		keyboardService.isShellAvailable = false;
		await component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(spy).not.toHaveBeenCalled();
	});

	it('#setKBDBacklightStatus called - catch block', async () => {
		spyOn(keyboardService, 'setKBDBacklightStatus').and.returnValue(Promise.reject(true));
		fixture.detectChanges();
		await component.setKBDBacklightStatus(BacklightLevelEnum.ONE_LEVEL);
		expect(keyboardService.setKBDBacklightStatus).toHaveBeenCalled();
	});

	it('#setAutomaticKBDBacklight called -else', async () => {
		const spy = spyOn(keyboardService, 'setAutomaticKBDBacklight');
		// fixture.detectChanges();
		keyboardService.isShellAvailable = false;
		await component.setAutomaticKBDBacklight(true);
		expect(spy).not.toHaveBeenCalled();
	});
	
	it('should call compare - Auto', () => {
		const value = 'Auto';
		component.compare(value);
		expect(BacklightStatusEnum.AUTO).toEqual(value);
	});

	it('should call compare - Level_1', () => {
		const value = 'Level_1';
		component.compare(value);
		expect(BacklightStatusEnum.LEVEL_1).toEqual(value);
	});
});

export const mockPipe = (options: Pipe): Pipe => {
	const metadata: Pipe = {
		name: options.name,
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string): any {
				return query;
			}
		}
	);
};

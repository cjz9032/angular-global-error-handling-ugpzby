import { TestBed, tick, waitForAsync } from '@angular/core/testing';
import { GamingLightingService } from './gaming-lighting.service';
import { HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

const listInfo: any = [
	{
		lightPanelType: 1,
		lightEffectType: 2,
		lightColor: '009BFA',
		lightBrightness: 2,
		lightSpeed: 1,
	},
	{
		lightPanelType: 2,
		lightEffectType: 4,
		lightColor: '009BFA',
		lightBrightness: 2,
		lightSpeed: 1,
	},
	{
		lightPanelType: 4,
		lightEffectType: 8,
		lightColor: '009BFA',
		lightBrightness: 2,
		lightSpeed: 1,
	},
	{
		lightPanelType: 8,
		lightEffectType: 32,
		lightColor: '009BFA',
		lightBrightness: 2,
		lightSpeed: 1,
	},
];
const spy = jasmine.createSpyObj('VantageService', ['getGamingLighting']);
const stubValue = {
	getLightingProfileById(profileId: number) {
		throw new Error('getLightingProfileById error');
	},
	getLightingCapabilities() {
		throw new Error('getLightingCapabilities error');
	},
};

describe('Shared service:', () => {
	let shellService: VantageShellService;
	let service: GamingLightingService;

	describe('isShellAvailable should be false:', () => {
		let shellService: VantageShellService;
		let service: GamingLightingService;
		beforeEach(() => {
			spy.getGamingLighting.and.returnValue(null);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [GamingLightingService, { provide: VantageShellService, useValue: spy }],
			});

			service = TestBed.inject(GamingLightingService);
			shellService = TestBed.inject(VantageShellService);
		});

		it('should call getLightingCapabilities', () => {
			service.isShellAvailable = false;
			const res = service.getLightingCapabilities();
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.getLightingCapabilities();
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});
	});

	describe('isShellAvailable should be true:', () => {
		beforeEach(() => {
			spy.getGamingLighting.and.returnValue(stubValue);
			TestBed.configureTestingModule({
				imports: [HttpClientModule],
				providers: [GamingLightingService, { provide: VantageShellService, useValue: spy }],
			});

			service = TestBed.inject(GamingLightingService);
			shellService = TestBed.inject(VantageShellService);
		});

		function setup() {
			// eslint-disable-next-line no-shadow
			const service = new GamingLightingService(shellService);
			return { service };
		}

		it('should call getLightingCapabilities', () => {
			service.isShellAvailable = false;
			const res = service.getLightingCapabilities();
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.getLightingCapabilities();
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call regLightingProfileIdChangeEvent', () => {
			service.isShellAvailable = false;
			const res = service.regLightingProfileIdChangeEvent();
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.regLightingProfileIdChangeEvent();
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call getLightingProfileId', () => {
			service.isShellAvailable = false;
			const res = service.getLightingProfileId();
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.getLightingProfileId();
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingProfileId', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileId(1, 1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileId(1, 1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingProfileEffectColor', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileEffectColor({});
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileEffectColor({});
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingDefaultProfileById', () => {
			service.isShellAvailable = false;
			const res = service.setLightingDefaultProfileById(1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingDefaultProfileById(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call getLightingProfileById', () => {
			service.isShellAvailable = false;
			const res = service.getLightingProfileById(1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.getLightingProfileById(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call setLightingProfileBrightness', () => {
			service.isShellAvailable = false;
			const res = service.setLightingProfileBrightness(1);
			expect(res).toBe(undefined);
			service.isShellAvailable = true;
			try {
				service.setLightingProfileBrightness(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});

		it('should call checkAreaColorFn', () => {
			const res = service.checkAreaColorFn(listInfo);
			expect(res).toBe(false);
			const listInfo2 = [];
			const res2 = service.checkAreaColorFn(listInfo2);
			expect(res2).toBe(false);
			try {
				service.checkAreaColorFn(1);
			} catch (e) {
				expect(e).not.toBeNull();
			}
		});
	});
});

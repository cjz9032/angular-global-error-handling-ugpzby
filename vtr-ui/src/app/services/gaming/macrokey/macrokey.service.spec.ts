import { MacroKeyInputChange } from 'src/app/data-models/gaming/macrokey/macrokey-input-change.model';
import { MacroKeyRecordedChange } from 'src/app/data-models/gaming/macrokey/macrokey-recorded-change.model';
import { MacroKeyTypeStatus } from 'src/app/data-models/gaming/macrokey/macrokey-type-status.model';
import { TestBed } from '@angular/core/testing';

import { MacrokeyService } from './macrokey.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { HttpClientModule } from '@angular/common/http';

describe('MacrokeyService', () => {

	let shellService: VantageShellService;
	let service: MacrokeyService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [MacrokeyService, VantageShellService],
		});
		service = TestBed.get(MacrokeyService);
		shellService = TestBed.get(VantageShellService);
	});

	describe(':', () => {

		function getService() {
			const macrokeyService = TestBed.get(MacrokeyService);
			return macrokeyService;
		}

		it('should be created', () => {
			const macrokeyService: MacrokeyService = TestBed.get(MacrokeyService);
			expect(macrokeyService).toBeTruthy();
		});

		it('should return isMacroKeyAvailable true', async () => {
			const macrokeyService = getService();
			expect(macrokeyService.isMacroKeyAvailable).toBe(true);
		});

		it('should return macrokey available', () => {
			const macrokeyService: MacrokeyService = TestBed.get(MacrokeyService);
			expect(macrokeyService).toBeTruthy();
		});

		it('should call gamingMacroKeyInitializeEvent', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'gamingMacroKeyInitializeEvent').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.gamingMacroKeyInitializeEvent();
			expect(macrokeyService.gamingMacroKeyInitializeEvent).toHaveBeenCalled();
		});

		it('should call setMacroKeyApplyStatus', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacroKeyApplyStatus').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setMacroKeyApplyStatus('1');
			expect(macrokeyService.setMacroKeyApplyStatus).toHaveBeenCalled();
		});

		it('should call setStartRecording', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setStartRecording').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setStartRecording('1');
			expect(macrokeyService.setStartRecording).toHaveBeenCalled();
		});

		it('should call setStopRecording abnomally', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setStopRecording').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setStopRecording('1', true, 1);
			expect(macrokeyService.setStopRecording).toHaveBeenCalled();
		});

		it('should call setStopRecording normally', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setStopRecording').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setStopRecording('1', true, 0);
			expect(macrokeyService.setStopRecording).toHaveBeenCalled();
		});

		it('should call setKey', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setKey').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setKey('1');
			expect(macrokeyService.setKey).toHaveBeenCalled();
		});

		it('should call clearKey', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'clearKey').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.clearKey('1');
			expect(macrokeyService.clearKey).toHaveBeenCalled();
		});

		it('should call setRepeat', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setRepeat').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setRepeat('1', 1);
			expect(macrokeyService.setRepeat).toHaveBeenCalled();
		});

		it('should call setInterval', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setInterval').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setInterval('1', 1);
			expect(macrokeyService.setInterval).toHaveBeenCalled();
		});

		it('should call setMacroKey', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacroKey').and.callThrough();
			macrokeyService.isMacroKeyAvailable = true;
			macrokeyService.setMacroKey('1', []);
			expect(macrokeyService.setMacroKey).toHaveBeenCalled();
		});

		it('should return undefined gamingMacroKeyInitializeEvent', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.gamingMacroKeyInitializeEvent()).toBe(undefined);
		});

		it('should return undefined setMacroKeyApplyStatus', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setMacroKeyApplyStatus('1')).toBe(undefined);
		});

		it('should return undefined setStartRecording', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setStartRecording('1')).toBe(undefined);
		});

		it('should return undefined setStopRecording abnomally', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setStopRecording('1', true, 1)).toBe(undefined);
		});

		it('should return undefined setStopRecording normally', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setStopRecording('1', true, 0)).toBe(undefined);
		});

		it('should return undefined setKey', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setKey('1')).toBe(undefined);
		});

		it('should return undefined clearKey', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.clearKey('1')).toBe(undefined);
		});

		it('should return undefined setRepeat', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setRepeat('1', 1)).toBe(undefined);
		});

		it('should return undefined setInterval', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setInterval('1', 1)).toBe(undefined);
		});

		it('should return undefined setMacroKey', async () => {
			const macrokeyService = getService();
			macrokeyService.isMacroKeyAvailable = false;
			expect(macrokeyService.setMacroKey('1', [])).toBe(undefined);
		});

		it('should call setMacrokeyTypeStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacrokeyTypeStatusCache').and.callThrough();
			macrokeyService.setMacrokeyTypeStatusCache(MacroKeyTypeStatus);
			expect(macrokeyService.setMacrokeyTypeStatusCache).toHaveBeenCalled();
		});

		it('should call getMacrokeyTypeStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'getMacrokeyTypeStatusCache').and.callThrough();
			macrokeyService.getMacrokeyTypeStatusCache();
			expect(macrokeyService.getMacrokeyTypeStatusCache).toHaveBeenCalled();
		});

		it('should call setMacrokeyRecordedStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacrokeyRecordedStatusCache').and.callThrough();
			macrokeyService.setMacrokeyRecordedStatusCache(MacroKeyRecordedChange);
			expect(macrokeyService.setMacrokeyRecordedStatusCache).toHaveBeenCalled();
		});

		it('should call getMacrokeyRecordedStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'getMacrokeyRecordedStatusCache').and.callThrough();
			macrokeyService.getMacrokeyRecordedStatusCache();
			expect(macrokeyService.getMacrokeyRecordedStatusCache).toHaveBeenCalled();
		});

		////

		it('should call setMacrokeyInputChangeCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacrokeyInputChangeCache').and.callThrough();
			macrokeyService.setMacrokeyInputChangeCache(new MacroKeyInputChange);
			expect(macrokeyService.setMacrokeyInputChangeCache).toHaveBeenCalled();
		});

		it('should call getMacrokeyInputChangeCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'getMacrokeyInputChangeCache').and.callThrough();
			macrokeyService.getMacrokeyInputChangeCache();
			expect(macrokeyService.getMacrokeyInputChangeCache).toHaveBeenCalled();
		});

		it('should call setMacrokeyInitialKeyDataCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacrokeyInitialKeyDataCache').and.callThrough();
			macrokeyService.setMacrokeyInitialKeyDataCache(new MacroKeyInputChange);
			expect(macrokeyService.setMacrokeyInitialKeyDataCache).toHaveBeenCalled();
		});

		it('should call getMacrokeyInitialKeyDataCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'getMacrokeyInitialKeyDataCache').and.callThrough();
			macrokeyService.getMacrokeyInitialKeyDataCache();
			expect(macrokeyService.getMacrokeyInitialKeyDataCache).toHaveBeenCalled();
		});

		it('should call updateMacrokeyInitialKeyRepeatDataCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'updateMacrokeyInitialKeyRepeatDataCache').and.callThrough();
			macrokeyService.updateMacrokeyInitialKeyRepeatDataCache(2);
			expect(macrokeyService.updateMacrokeyInitialKeyRepeatDataCache).toHaveBeenCalled();
		});

		it('should call updateMacrokeyInitialKeyIntervalDataCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'updateMacrokeyInitialKeyIntervalDataCache').and.callThrough();
			macrokeyService.updateMacrokeyInitialKeyIntervalDataCache(2);
			expect(macrokeyService.updateMacrokeyInitialKeyIntervalDataCache).toHaveBeenCalled();
		});

		// it('should call updateMacrokeyInitialKeyDataCache', async () => {
		// 	const macrokeyService = getService();
		// 	spyOn(macrokeyService, 'updateMacrokeyInitialKeyDataCache').and.callThrough();
		// 	macrokeyService.updateMacrokeyInitialKeyDataCache([]);
		// 	expect(macrokeyService.updateMacrokeyInitialKeyDataCache).toHaveBeenCalled();
		// });

		it('should call setMacrokeyChangeStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setMacrokeyChangeStatusCache').and.callThrough();
			macrokeyService.setMacrokeyChangeStatusCache(new MacroKeyTypeStatus);
			expect(macrokeyService.setMacrokeyChangeStatusCache).toHaveBeenCalled();
		});

		it('should call setOnRepeatStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnRepeatStatusCache').and.callThrough();
			macrokeyService.setOnRepeatStatusCache(2, '0');
			expect(macrokeyService.setOnRepeatStatusCache).toHaveBeenCalled();
		});

		it('should call setOnIntervalStatusCache', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnIntervalStatusCache').and.callThrough();
			macrokeyService.setOnIntervalStatusCache(2, '0');
			expect(macrokeyService.setOnIntervalStatusCache).toHaveBeenCalled();
		});

		it('should call setOnRepeatStatusCache for m1', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnRepeatStatusCache').and.callThrough();
			macrokeyService.setOnRepeatStatusCache(2, 'M1');
			expect(macrokeyService.setOnRepeatStatusCache).toHaveBeenCalled();
		});

		it('should call setOnIntervalStatusCache for m1', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnIntervalStatusCache').and.callThrough();
			macrokeyService.setOnIntervalStatusCache(2, 'M1');
			expect(macrokeyService.setOnIntervalStatusCache).toHaveBeenCalled();
		});

		it('should call setOnRepeatStatusCache for null', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnRepeatStatusCache').and.callThrough();
			macrokeyService.setOnRepeatStatusCache(2, null);
			expect(macrokeyService.setOnRepeatStatusCache).toHaveBeenCalled();
		});

		it('should call setOnIntervalStatusCache for null', async () => {
			const macrokeyService = getService();
			spyOn(macrokeyService, 'setOnIntervalStatusCache').and.callThrough();
			macrokeyService.setOnIntervalStatusCache(2, null);
			expect(macrokeyService.setOnIntervalStatusCache).toHaveBeenCalled();
		});

	});
});

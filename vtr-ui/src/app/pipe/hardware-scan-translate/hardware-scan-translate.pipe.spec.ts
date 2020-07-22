// import { HardwareScanTranslatePipe, HardwareScanTranslateOptions } from './hardware-scan-translate.pipe';
// import { async, TestBed, inject } from '@angular/core/testing';
// import { TranslationModule } from 'src/app/modules/translation.module';
// import { TranslatePipe } from '@ngx-translate/core';

// fdescribe('HardwareScanTranslatePipe', () => {

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [HardwareScanTranslatePipe],
// 			imports: [TranslationModule.forChild()]
// 		});
// 	}));

// 	it('create an instance', inject([TranslatePipe], (translatePipe: TranslatePipe) => {
// 		const pipe = new HardwareScanTranslatePipe(translatePipe);
// 		expect(pipe).toBeTruthy();
// 	}));

// 	it('try to translate a not found token should return an empty string', inject([TranslatePipe], (translatePipe: TranslatePipe) => {
// 		const pipe = new HardwareScanTranslatePipe(translatePipe);
// 		const result = pipe.transform('hardwareScan.NotFoundToken', HardwareScanTranslateOptions.ReturnEmptyStringIfNotFound);
// 		expect(result).toBeFalsy();
// 	}));

// 	it('try to translate a not found token should return the token', inject([TranslatePipe], (translatePipe: TranslatePipe) => {
// 		const pipe = new HardwareScanTranslatePipe(translatePipe);
// 		const result = pipe.transform('hardwareScan.NotFoundToken', HardwareScanTranslateOptions.ReturnTheTokenIfNotFound);
// 		expect(result).toEqual('hardwareScan.NotFoundToken');
// 	}));

// 	it('try to translate a not found token should return the last part of the token', inject([TranslatePipe], (translatePipe: TranslatePipe) => {
// 		const pipe = new HardwareScanTranslatePipe(translatePipe);
// 		const result = pipe.transform('hardwareScan.NotFoundToken', HardwareScanTranslateOptions.RetunrTheLastPartOfTokenIfNotFound);
// 		expect(result).toEqual('NotFoundToken');
// 	}));
// });

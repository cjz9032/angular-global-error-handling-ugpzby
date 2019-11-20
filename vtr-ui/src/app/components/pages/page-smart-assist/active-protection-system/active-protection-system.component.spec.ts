// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ActiveProtectionSystemComponent } from './active-protection-system.component';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { CommonService } from 'src/app/services/common/common.service';
// import { PowerService } from 'src/app/services/power/power.service';
// import { HttpLoaderFactory, TranslationModule } from 'src/app/modules/translation.module';
// import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';


// fdescribe('ActiveProtectionSystemComponent', () => {
// 	let component: ActiveProtectionSystemComponent;
// 	let fixture: ComponentFixture<ActiveProtectionSystemComponent>;
// 	let debugElement;

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [ActiveProtectionSystemComponent],
// 			schemas: [NO_ERRORS_SCHEMA],
// 			imports: [TranslateModule.forRoot({
// 				loader: {
// 					provide: TranslateLoader,
// 					useFactory: HttpLoaderFactory,
// 					deps: [HttpClient]
// 				},
// 				isolate: false
// 			}),
// 			TranslationModule.forChild(), HttpClientModule],
// 			providers: [CommonService, PowerService]
// 		}).compileComponents();
// 	}));

// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(ActiveProtectionSystemComponent);
// 		debugElement = fixture.debugElement;
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('should create', async () => {
// 		spyOn(component, 'initAPS');
// 		await component.ngOnInit();
// 		expect(component).toBeTruthy();
// 	});
// });

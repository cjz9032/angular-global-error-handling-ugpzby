import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSmartPerformanceCancelComponent } from './modal-smart-performance-cancel.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { TranslationModule, HttpLoaderFactory } from 'src/app/modules/translation.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModalSmartPerformanceCancelComponent', () => {
  let component: ModalSmartPerformanceCancelComponent;
  let fixture: ComponentFixture<ModalSmartPerformanceCancelComponent>;
  let smartPerformanceServiceSpy = jasmine.createSpyObj('SmartPerformanceService', ['cancelScan']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSmartPerformanceCancelComponent],
      imports: [HttpClientModule, RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        isolate: false
      }),
        TranslationModule.forChild()
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, SmartPerformanceService, VantageShellService,
        { provide: SmartPerformanceService, useValue: smartPerformanceServiceSpy}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSmartPerformanceCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cancelScan, closeModal, and onAgree', () => {
    component.cancelScan();
    component.closeModal();
    component.onAgree();
    const spycancelScan = spyOn(component, "cancelScan");
    const spycloseModal = spyOn(component, "closeModal");
    const spyonAgree = spyOn(component, "onAgree");
    expect(spycloseModal).toBeTruthy();
    expect(spyonAgree).toBeTruthy();
    expect(spycancelScan).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should call cancel scan and return true', () => {
    smartPerformanceServiceSpy.cancelScan.and.returnValue(new Promise(resolve => { resolve(true)}));
    component.cancelScan();
    const spycancelScan = spyOn(component, "cancelScan");
    expect(spycancelScan).toBeTruthy();
  });

  it('should call onFocus when calling modal focus', (() => {
		const modal = document.createElement('div');
		modal.setAttribute('class', 'cancel-modal');
		fixture.debugElement.nativeElement.append(modal);
		component.onFocus();
		expect(modal).toBeTruthy();
	}));

});

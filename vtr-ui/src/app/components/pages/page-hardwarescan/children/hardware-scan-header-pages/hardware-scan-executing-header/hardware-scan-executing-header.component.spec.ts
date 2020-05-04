import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareScanExecutingHeaderComponent } from './hardware-scan-executing-header.component';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

fdescribe('HardwareScanExecutingHeaderComponent', () => {
  let component: HardwareScanExecutingHeaderComponent;
  let fixture: ComponentFixture<HardwareScanExecutingHeaderComponent>;
  let translation: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareScanExecutingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareScanExecutingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should have a title', () => {
    expect(component.title).toBe(translation.instant('hardwareScan.title'));

    //Accessing class title
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(title.innerHTML).toBe(translation.instant('hardwareScan.title'));
  });

  fit('should have a warning message', () => {
    //Accessing class warning message
    const warningMessage = fixture.debugElement.query(By.css('#warning-message')).nativeElement;
    expect(warningMessage.innerHTML).toBe(translation.instant('hardwareScan.warningMessage'));
  });

  fit('should cancel the scan if button is clicked', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('#hw_cancel_scan');
    btn.click();
    expect(component.onCancel()).toHaveBeenCalled();
  });
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import moment from "moment";

import { SubpageScheduleScanComponent } from './subpage-schedule-scan.component';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { CommonService } from 'src/app/services/common/common.service';
import { enumSmartPerformance } from 'src/app/enums/smart-performance.enum';


describe('SubpageScheduleScanComponent', () => {
  let component: SubpageScheduleScanComponent;
  let fixture: ComponentFixture<SubpageScheduleScanComponent>;
  let commonService: CommonService
  let smartPerformanceService: SmartPerformanceService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ SubpageScheduleScanComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        NgbTooltipModule
      ],
      providers: [
        SmartPerformanceService,
        LoggerService,
        CommonService
      ]
    });
    fixture = TestBed.createComponent(SubpageScheduleScanComponent);
    component = fixture.componentInstance
  }));

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy();
  });

  it('scheduleScanFrequency is undefined - subscribed user', () => {
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValues(true, undefined, true, true)
    fixture.detectChanges()
    expect(component.selectedFrequency).toEqual(component.scanFrequency[0]);
  });

  it('scheduleScanFrequency is undefined - non-subscribed user', () => {
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValues(false, undefined, true, true)
    fixture.detectChanges()
    expect(component.selectedFrequency).toEqual(component.scanFrequency[0]);
  });

  it('scheduleScanFrequency is defined - subscribed user', () => {
    const payload = enumSmartPerformance.SCHEDULESCANANDFIX
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValues(true, component.scanFrequency[0], false, true)
    const spy = spyOn(component, 'getNextScanRunTime')
    fixture.detectChanges()
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('scheduleScanFrequency is defined - non-subscribed user', () => {
    const payload = enumSmartPerformance.SCHEDULESCAN
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValues(false, component.scanFrequency[0], false, true)
    const spy = spyOn(component, 'getNextScanRunTime')
    fixture.detectChanges()
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('should expand schedule scan widget', () => {
      component.scanToggleValue = true;
      component.changeScanSchedule();
      expect(component.isChangeSchedule).toEqual(true)
  });

  it('should not expand dropdowns in schedule scan', () => {
    component.scheduleTab = 1;
    component.openScanScheduleDropDown(1);
    expect(component.scheduleTab).toEqual("")
  });

  it('should expand dropdowns in schedule scan', () => {
    component.scheduleTab = "";
    component.openScanScheduleDropDown(1);
    expect(component.scheduleTab).toEqual(1)
  });

  it('should close schedule scan expansion when clicked outside - when schedule Tab is undefined', () => {
    component.scheduleTab = ""
    const event: any = {}
    expect(component.onClick(event)).toBeUndefined()
  });

  it('should close schedule scan expansion when clicked outside', () => {
    const event: any = {
      target: {
        classList: ['text']
      }
    }
    component.onClick(event)
    expect(component.scheduleTab).toEqual("")
  });

  it('should change scan frequency - once a week', () => {
    const value = 0
    component.changeScanFrequency(value)
    expect(component.selectedDay).toEqual(component.days[value])
  });

  it('should change scan frequency - every other week', () => {
    const value = 1
    component.changeScanFrequency(value)
    expect(component.selectedDay).toEqual(component.days[0])
  });

  it('should change scan frequency -every month', () => {
    const value = 2
    component.changeScanFrequency(value)
    expect(component.selectedNumber).toEqual(component.dates[0])
  });

  it('should change scan day', () => {
    const value = 3;
    component.changeScanDay(value);
    expect(component.dayValue).toEqual(value);
    expect(component.scheduleTab).toEqual("");
    expect(component.selectedDay).toEqual(component.days[3])
  });

  it('should change scan date', () => {
    const value = 10;
    component.changeScanDate(value);
    expect(component.dateValue).toEqual(value);
    expect(component.scheduleTab).toEqual("");
    expect(component.selectedNumber).toEqual(component.dates[10])
  });

  it('should not save changed schedule scan - subscribed user', () => {
    component.isSubscribed = true;
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValue(component.scanFrequency[0])
    component.cancelChangedScanSchedule();
    expect(component.scheduleScanFrequency).toEqual(component.scanFrequency[0])
  });

  it('should not save changed schedule scan - non-subscribed user', () => {
    component.isSubscribed = false;
    commonService = TestBed.get(CommonService);
    spyOn(commonService, 'getLocalStorageValue').and.returnValue(component.scanFrequency[0])
    component.cancelChangedScanSchedule();
    expect(component.scheduleScanFrequency).toEqual(component.scanFrequency[0])
  });

  it('should change hour in copyScanTime', () => {
    const value = 5
    component.changeHoursTime(value);
    expect(component.copyScanTime.hour).toEqual(6)
    expect(component.copyScanTime.hourId).toEqual(value)
  });

  it('should change minutes in copyScanTime', () => {
    const value = 5
    component.changeMinutesTime(value);
    expect(component.copyScanTime.min).toEqual("25")
    expect(component.copyScanTime.minId).toEqual(value)
  });

  it('should change amPm in copyScanTime', () => {
    const value = 1
    component.changeAmPm(value);
    expect(component.copyScanTime.amPm).toEqual("PM")
    expect(component.copyScanTime.amPmId).toEqual(value)
  });

  it('should set type of scan frequency - for everyotherweek', () => {
    component.changeScanFrequency(0)
    component.setTypeOfFrequency()
    expect(component.type).toEqual('weekly')
  });

  it('should set type of scan frequency - for onceamonth', () => {
    component.changeScanFrequency(1)
    component.setTypeOfFrequency()
    expect(component.type).toEqual('otherweek')
  });

  it('should set type of scan frequency - for everymonth', () => {
    component.changeScanFrequency(2)
    component.setTypeOfFrequency()
    expect(component.type).toEqual('monthly')
  });

  it('should close schedule scan widget expansion', () => {
    component.scheduleTab = 2
    component.changeScanScheduleDate()
    expect(component.scheduleTab).toEqual("")
  });

  it('should save schedule scan', () => {
    const spy = spyOn(component, 'scheduleScan')
    component.saveChangedScanSchedule()
    expect(spy).toHaveBeenCalled()
  });

  it('should delete record from task scheduler', () => {
    const scantype = enumSmartPerformance.SCHEDULESCANANDFIX
    const res: any = {state: true}
    component.scanToggleValue = true
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    const spy = spyOn(smartPerformanceService, 'unregisterScanSchedule').and.returnValue(res)
    component.unregisterScheduleScan(scantype)
    expect(spy).toHaveBeenCalled()
  });

  it('should call setEnableScanStatus - switch is enabled', () => {
    commonService = TestBed.get(CommonService)
    const event = { switchValue: true}
    component.isSubscribed = true
    spyOn(commonService, 'getLocalStorageValue').and.returnValue(false)
    const spy = spyOn(component, 'scheduleScan')
    component.setEnableScanStatus(event);
    expect(spy).toHaveBeenCalled()
  });

  it('should call setEnableScanStatus - switch is disabled', () => {
    const event = { switchValue: false}
    component.isSubscribed = true
    const spy = spyOn(component, 'unregisterScheduleScan')
    component.setEnableScanStatus(event);
    expect(spy).toHaveBeenCalled()
  });

  it('should schedule scan - subscribed user', () => {
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    component.isSubscribed = true
    const payload = {
      scantype: enumSmartPerformance.SCHEDULESCANANDFIX,
      frequency: 'onceaweek',
      day: 'Wednesday',
      time: '2020-06-17T17:45:00',
      date: []
    }
    const res:any = {state: true}
    const spy = spyOn(smartPerformanceService, 'setScanSchedule').and.returnValue(res)
    component.scheduleScan(payload)
    expect(spy).toHaveBeenCalled()
  });

  it('should schedule scan - non-subscribed user', () => {
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    component.isSubscribed = false
    const payload = {
      scantype: enumSmartPerformance.SCHEDULESCAN,
      frequency: 'onceaweek',
      day: 'Wednesday',
      time: '2020-06-17T17:45:00',
      date: []
    }
    const res:any = {state: true}
    const spy = spyOn(smartPerformanceService, 'setScanSchedule').and.returnValue(res)
    component.scheduleScan(payload)
    expect(spy).toHaveBeenCalled()
  });

  it('should get record from task scheduler - onceaweek', () => {
    const scantype = enumSmartPerformance.SCHEDULESCANANDFIX
    const res: any = {nextruntime: '2020-06-17T17:45:00' } 
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(res)
    component.changeScanFrequency(0)
    component.getNextScanRunTime(scantype)
    expect(spy).toHaveBeenCalled()
  });

  it('should get record from task scheduler - everyotherweek', () => {
    const scantype = enumSmartPerformance.SCHEDULESCANANDFIX
    const res: any = {nextruntime: '2020-06-17T17:45:00' } 
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(res)
    component.changeScanFrequency(1)
    component.getNextScanRunTime(scantype)
    expect(spy).toHaveBeenCalled()
  });

  it('should get record from task scheduler - every month', () => {
    const scantype = enumSmartPerformance.SCHEDULESCANANDFIX
    const res: any = {nextruntime: '2020-06-17T17:45:00' } 
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(res)
    component.changeScanFrequency(2)
    component.getNextScanRunTime(scantype)
    expect(spy).toHaveBeenCalled()
  });

  it('should set record task scheduler', () => {
    const scantype = enumSmartPerformance.SCHEDULESCANANDFIX
    const res: any = {state: false } 
    smartPerformanceService = TestBed.get(SmartPerformanceService)
    const spy = spyOn(smartPerformanceService, 'getNextScanRunTime').and.returnValue(res)
    component.getNextScanRunTime(scantype)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload for firstRun -if case FirstVisit', () => {
    component.isFirstVisit = true
    const momentMin = moment().minute(56).toDate()
    jasmine.clock().mockDate(momentMin)
    const typeRun = "firstRun"
    component.payloadData(typeRun)
    expect(component.requestScanData['frequency']).toEqual('onceaweek')
  });

  it('should set payload for firstRun -else case FirstVisit', () => {
    component.isFirstVisit = true
    const momentMin = moment().minute(20).toDate()
    jasmine.clock().mockDate(momentMin)
    const typeRun = "firstRun"
    component.payloadData(typeRun)
    expect(component.requestScanData['frequency']).toEqual('onceaweek')
  });

  it('should set payload for firstRun -if case not FirstVisit', () => {
    component.isFirstVisit = false
    const momentMin = moment().minute(56).toDate()
    jasmine.clock().mockDate(momentMin)
    const typeRun = "firstRun"
    component.payloadData(typeRun)
    expect(component.requestScanData['frequency']).toEqual('onceaweek')
  });

  it('should set payload for firstRun -else case not FirstVisit', () => {
    component.isFirstVisit = false
    const momentMin = moment().minute(20).toDate()
    jasmine.clock().mockDate(momentMin)
    const typeRun = "firstRun"
    component.payloadData(typeRun)
    expect(component.requestScanData['frequency']).toEqual('onceaweek')
  });

  it('should set payload depending on typeRun - weekly -if case', () => {
    component.dayValue = 2
    const momentDay = moment().day(1).toDate()
    jasmine.clock().mockDate(momentDay)
    const typeRun = "weekly"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload depending on typeRun - weekly -else case', () => {
    component.dayValue = 2
    const momentDay = moment().day(4).toDate()
    jasmine.clock().mockDate(momentDay)
    const typeRun = "weekly"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload depending on typeRun - other week - if case', () => {
    component.dayValue = 2
    const momentDay = moment().day(1).toDate()
    jasmine.clock().mockDate(momentDay)
    const typeRun = "otherweek"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload depending on typeRun - other week - else case', () => {
    component.dayValue = 2
    const momentDay = moment().day(4).toDate()
    jasmine.clock().mockDate(momentDay)
    const typeRun = "otherweek"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload depending on typeRun - monthly - if case', () => {
    component.selectedNumber = 2
    const momentDate = moment().date(4).toDate()
    jasmine.clock().mockDate(momentDate)
    const typeRun = "monthly"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should set payload depending on typeRun - monthly - else case', () => {
    component.selectedNumber = 10
    const momentDate = moment().date(4).toDate()
    jasmine.clock().mockDate(momentDate)
    const typeRun = "monthly"
    const spy = spyOn(component, 'commonLines')
    component.payloadData(typeRun)
    expect(spy).toHaveBeenCalled()
  });

  it('should call commonLines to set payload object for schedule scan - onceaweek', () => {
    const currentMom = moment().day(2).format("YYYY, MM, D, ss")
    const frequency = 'Once a week'
    component.isSubscribed = true
    component.commonLines(currentMom, frequency)
    expect(component.requestScanData['frequency']).toEqual('onceaweek')
  });

  it('should call commonLines to set payload object for schedule scan - every other week', () => {
    const currentMom = moment().day(4).format("YYYY, MM, D, ss")
    const frequency = 'Every other week'
    component.isSubscribed = false
    component.commonLines(currentMom, frequency)
    expect(component.requestScanData['frequency']).toEqual('everyotherweek')
  });

  it('should call commonLines to set payload object for schedule scan - every month', () => {
    const currentMom = moment().date(4).format("YYYY, MM, D, ss")
    const frequency = 'Every month'
    component.isSubscribed = false
    component.commonLines(currentMom, frequency)
    expect(component.requestScanData['frequency']).toEqual('onceamonth')
  });
});
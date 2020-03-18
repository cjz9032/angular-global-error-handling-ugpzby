import { TestBed } from '@angular/core/testing';

import { HandleProtocolService } from './handle-protocol.service';

describe('HandleProtocolService', () => {
  let service: HandleProtocolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleProtocolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('decode base64 string short', () => {
	const base64str = 'bGVub3ZvLXZhbnRhZ2UzOnBhc3N3b3JkLXByb3RlY3Rpb24=';
    expect(service.decodeBase64String(base64str)).toEqual('lenovo-vantage3:password-protection');
  });

  it('decode base64 string long', () => {
	const base64str = 'bGVub3ZvLWNvbXBhbmlvbjpQQVJBTT9mZWF0dXJlSWQ9NkY0ODZDRjUtNUQ1MS00QUU4LUFCQTktMDg5QjVDQjk2NDIwJmFtcDtub3RpZmljYXRpb25JZD1DNzAyQjJFMS0zNEJBLTQ2MDQtOTJGNy04OERDMEQxOTU0QTcmYW1wO2J1dHRvbkNsaWNrZWQ9TGVhcm5Nb3JlJmFtcDtwbHVnaW49TGVub3ZvV2lGaVNlY3VyaXR5UGx1Z2luJmFtcDtjaG9pY2U9b3BlbiZhbXA7bXNnTmFtZT1Db21wYW5pb24uV2lGaVNlY3VyaXR5LlByb21vdGVUb0VuYWJsZTI=';
    expect(service.decodeBase64String(base64str)).toEqual('lenovo-companion:PARAM?featureId=6F486CF5-5D51-4AE8-ABA9-089B5CB96420&amp;notificationId=C702B2E1-34BA-4604-92F7-88DC0D1954A7&amp;buttonClicked=LearnMore&amp;plugin=LenovoWiFiSecurityPlugin&amp;choice=open&amp;msgName=Companion.WiFiSecurity.PromoteToEnable2');
  });

  it('Is valid 3.x protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection';
    expect(service.isValidVantage3xProtocol(protocol)).toBeTruthy();
  });

  it('Is not valid 3.x protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection-not-exist';
    expect(service.isValidVantage3xProtocol(protocol)).toBeFalsy();
  });

  it('Is not valid 3.x protocol', () => {
	const protocol = 'lenovo-metro-companion:password-protection';
    expect(service.isValidVantage3xProtocol(protocol)).toBeFalsy();
  });

  it('Is not valid 3.x protocol', () => {
	const protocol = 'lenovo-metro-companion:?featureId=6F486CF5-5D51-4AE8-ABA9-089B5CB96420';
    expect(service.isValidVantage3xProtocol(protocol)).toBeFalsy();
  });

  it('Is valid old protocol', () => {
	const protocol = 'lenovo-metro-companion:?featureId=6F486CF5-5D51-4AE8-ABA9-089B5CB96420';
    expect(service.isValidVantage2xProtocol(protocol)).toBeTruthy();
  });

  it('Is not valid old protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection';
    expect(service.isValidVantage2xProtocol(protocol)).toBeFalsy();
  });

  it('Is not valid old protocol', () => {
	const protocol = 'lenovo-vantage3:?featureId=6F486CF5-5D51-4AE8-ABA9-089B5CB96420';
    expect(service.isValidVantage2xProtocol(protocol)).toBeFalsy();
  });

  it('Is not valid old protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection';
    expect(service.isValidVantage2xProtocol(protocol)).toBeFalsy();
  });
});

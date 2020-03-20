import { TestBed } from '@angular/core/testing';

import { HandleProtocolService } from './handle-protocol.service';

describe('HandleProtocolService', () => {
  let service: HandleProtocolService;
  beforeEach(() => {
    // TestBed.configureTestingModule({});
	// service = TestBed.inject(HandleProtocolService);
	service = new HandleProtocolService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

//   it('initializeUrl launch by protocol', () => {
// 	window.location = jasmine.createSpyObj('location', ['href'])
// 	window.location.href = 'https://vantage.csw.lenovo.com/#/?protocol=bGVub3ZvLXZhbnRhZ2UzOmluc3RhbGxmaWdsZWFm';
// 	const spy = spyOn(service, 'processUrl').and.returnValue('https://vantage.csw.lenovo.com/#/security/wifi-security');
// 	service.initializeUrl();
//     expect(window.location.href).toEqual('https://vantage.csw.lenovo.com/#/security/wifi-security');
//   });

//   it('initializeUrl launch by normal url', () => {
// 	window.location.href = 'https://vantage.csw.lenovo.com/#/dashboard';
// 	const spy = spyOn(service, 'processUrl').and.returnValue('https://vantage.csw.lenovo.com/#/dashboard');
// 	service.initializeUrl();
//     expect(window.location.href).toEqual('https://vantage.csw.lenovo.com/#/dashboard');
//   });

  it('constructURL with valid url string', () => {
	const urlStr = 'https://vantage.csw.lenovo.com/#/dashboard';
	const url = new URL(urlStr);
	expect(service.constructURL(urlStr)).toEqual(url);
  });

  it('constructURL with invalid url string', () => {
	const url = 'this-is-a-invalid-url';
	expect(service.constructURL(url)).toEqual(undefined);
  });

  it('processUrl with invalid url', () => {
	const url = 'this-is-a-invalid-url';
	const spy = spyOn(service, 'constructURL').and.returnValue(undefined);
	expect(service.processUrl(url)).toEqual('this-is-a-invalid-url');
  });

  it('processUrl with non-protocol url', () => {
	const url = 'https://vantage.csw.lenovo.com/#/security/wifi-security';
	expect(service.processUrl(url)).toEqual('https://vantage.csw.lenovo.com/#/security/wifi-security');
  });

  it('processUrl with invalid base64', () => {
	const url = 'https://vantage.csw.lenovo.com/#/?protocol=1';
	expect(service.processUrl(url)).toEqual('https://vantage.csw.lenovo.com/#/');
  });

  it('processUrl with old protocol', () => {
	const url = 'https://vantage.csw.lenovo.com/#/?protocol=bGVub3ZvLWNvbXBhbmlvbjo/ZmVhdHVyZUlkPTZGNDg2Q0Y1LTVENTEtNEFFOC1BQkE5LTA4OUI1Q0I5NjQyMA==';
	const spy3x = spyOn(service, 'convertToUrlAssumeProtocolIs3x').and.returnValue('');
	const spy2x = spyOn(service, 'convertToUrlAssumeProtocolIs2x').and.returnValue('security/wifi-security');
	expect(service.processUrl(url)).toEqual('https://vantage.csw.lenovo.com/#/security/wifi-security');
  });

  it('processUrl with old invalid protocol', () => {
	const url = 'https://vantage.csw.lenovo.com/#/?protocol=bGVub3ZvLWNvbXBhbmlvbjo/ZmVhdHVyZUlkPTZGNDg2Q0Y1LTVENTEtNEFFOC1BQkE5LTA4OUI1Q0I5NjQyMA==';
	const spy3x = spyOn(service, 'convertToUrlAssumeProtocolIs3x').and.returnValue('');
	const spy2x = spyOn(service, 'convertToUrlAssumeProtocolIs2x').and.returnValue('');
	expect(service.processUrl(url)).toEqual('https://vantage.csw.lenovo.com/#/');
  });

  it('processUrl with new protocol', () => {
	const url = 'https://vantage.csw.lenovo.com/#/?protocol=bGVub3ZvLXZhbnRhZ2UzOmRldmljZS1zZXR0aW5ncw==';
	const spy = spyOn(service, 'convertToUrlAssumeProtocolIs3x').and.returnValue('device/device-settings/power');
	expect(service.processUrl(url)).toEqual('https://vantage.csw.lenovo.com/#/device/device-settings/power');
  });

  it('decode base64 string short', () => {
	const base64str = 'bGVub3ZvLXZhbnRhZ2UzOnBhc3N3b3JkLXByb3RlY3Rpb24=';
    expect(service.decodeBase64String(base64str)).toEqual('lenovo-vantage3:password-protection');
  });

  it('decode base64 string long', () => {
	const base64str = 'bGVub3ZvLWNvbXBhbmlvbjpQQVJBTT9mZWF0dXJlSWQ9NkY0ODZDRjUtNUQ1MS00QUU4LUFCQTktMDg5QjVDQjk2NDIwJmFtcDtub3RpZmljYXRpb25JZD1DNzAyQjJFMS0zNEJBLTQ2MDQtOTJGNy04OERDMEQxOTU0QTcmYW1wO2J1dHRvbkNsaWNrZWQ9TGVhcm5Nb3JlJmFtcDtwbHVnaW49TGVub3ZvV2lGaVNlY3VyaXR5UGx1Z2luJmFtcDtjaG9pY2U9b3BlbiZhbXA7bXNnTmFtZT1Db21wYW5pb24uV2lGaVNlY3VyaXR5LlByb21vdGVUb0VuYWJsZTI=';
    expect(service.decodeBase64String(base64str)).toEqual('lenovo-companion:PARAM?featureId=6F486CF5-5D51-4AE8-ABA9-089B5CB96420&amp;notificationId=C702B2E1-34BA-4604-92F7-88DC0D1954A7&amp;buttonClicked=LearnMore&amp;plugin=LenovoWiFiSecurityPlugin&amp;choice=open&amp;msgName=Companion.WiFiSecurity.PromoteToEnable2');
  });

  it('decode base64 invalid string', () => {
	const base64str = '1';
    expect(service.decodeBase64String(base64str)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs3x valid 3.x protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('security/password-protection');
  });

  it('convertToUrlAssumeProtocolIs3x 3.x protocol without path', () => {
	const protocol = 'lenovo-vantage3:';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs3x invalid 3.x like protocol', () => {
	const protocol = 'lenovo-vantage3:not-exist';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs3x empty args', () => {
	const protocol = '';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs3x valid 2.x protocol', () => {
	const protocol = 'lenovo-companion:PARAM?section=input';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs3x non-url string', () => {
	const protocol = 'general-string';
    expect(service.convertToUrlAssumeProtocolIs3x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x valid 3.x protocol', () => {
	const protocol = 'lenovo-vantage3:password-protection';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2x protocol without path', () => {
	const protocol = 'lenovo-companion:?section=input';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2x protocol with existed feature-id', () => {
	const protocol = 'lenovo-companion:PARAM?featureId=5fbdca5f-02ca-4159-8f1c-725703e31473';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('device/device-settings/power?featureId=5fbdca5f-02ca-4159-8f1c-725703e31473');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2x protocol with not existed feature-id', () => {
	const protocol = 'lenovo-companion:PARAM?featureId=xxxxxx-02ca-4159-8f1c-725703e31473';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2x protocol with existed feature-id but feature-id is useless', () => {
	const getSpy = jasmine.createSpy().and.returnValue({
		'6f486cf5-5d51-4ae8-aba9-xxxxxxxxxxxx': 'xxxxxxxx'
	})
	Object.defineProperty(service, 'featureIdToSemantic', { get: getSpy });
	const protocol = 'lenovo-companion:PARAM?featureId=6f486cf5-5d51-4ae8-aba9-xxxxxxxxxxxx';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x invalid 3.x like protocol', () => {
	const protocol = 'lenovo-vantage3:not-exist';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x empty args', () => {
	const protocol = '';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2.x protocol', () => {
	const protocol = 'lenovo-companion:PARAM?section=input';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('device/device-settings/input-accessories?section=input');
  });

  it('convertToUrlAssumeProtocolIs2x valid 2.x protocol, exist section, but no semantic', () => {
	const getSpy = jasmine.createSpy().and.returnValue({
		'input': 'xxxxx',
	})
	Object.defineProperty(service, 'sectionToSemantic', { get: getSpy });

	const protocol = 'lenovo-companion:PARAM?section=input';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x invalid 2.x protocol', () => {
	const protocol = 'lenovo-companion:PARAM?section=not-exist';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });

  it('convertToUrlAssumeProtocolIs2x non-url string', () => {
	const protocol = 'general-string';
    expect(service.convertToUrlAssumeProtocolIs2x(protocol)).toEqual('');
  });
});

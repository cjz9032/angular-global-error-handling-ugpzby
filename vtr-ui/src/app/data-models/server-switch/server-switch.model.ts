import CountryList from "../../../assets/server-switch/CountryList.json";
import LanguageList from "../../../assets/server-switch/LanguageList.json";
export class ServerSwitch {
	public currentUrl: string;
	public cmsserver: any;
	public country: any;
	//public countryId: string;
	public language: any;
	//public languageId: string;
	public segment: any;
	//public segmentId: string;
	public oem: any;
	//public segmentId: string;
	public brand: any;
	//public segmentId: string;
	public page: any;

	public countryList: any = CountryList;
	public languageList: any = LanguageList;

	public segmentList: string[] = [
		'Commercial',
		'Consumer',
		'Gaming',
		'SMB'
	];
	public serverList: string[] = [
		'https://ce.csw.lenovo.com',
		'https://vantage.csw.lenovo.com',
		'https://ce-qa.csw.lenovo.com',
		'https://vantage-qa.csw.lenovo.com',
		'https://ce-dev.csw.lenovo.com',
		'https://vantage-dev.csw.lenovo.com'
	];

	public brandList: string[] = [
		'Lenovo',
		'Idea',
		'Think'
	];

	public oemList: string[] = [
		'Lenovo',
		'Fujitsu',
		'NEC'
	];

	public pageList: any = [
		{'label':'Dashboard','componentSelector':'vtr-page-dashboard'},
		{'label':'My Device','componentSelector':'vtr-cptpage-my-device'},
		{'label':'My Device Settings','componentSelector':'vtr-cptpage-device-settings'},
		{'label':'System Update','componentSelector':'vtr-page-device-updates'},
		{'label':'Smart Assist','componentSelector':'vtr-page-smart-assist'},
		{'label':'Support Detail','componentSelector':'vtr-page-support-detail'},
		/* non hw */
		/*{'label':'Preference settings','componentSelector':'vtr-page-settings'},
		{'label':'Connected Home','componentSelector':'vtr-page-connected-home-security'},
		{'label':'Privacy','componentSelector':''},*/
	];

}

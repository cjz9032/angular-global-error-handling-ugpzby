import CountryList from "src/assets/server-switch/CountryList.json";
import LanguageList from "src/assets/server-switch/LanguageList.json";
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
}

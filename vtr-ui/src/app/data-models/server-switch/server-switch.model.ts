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
		/*hardware*/
		{
			'optgroup': 'Hardware',
			'opt': [
				{ 'label': 'Dashboard', 'componentSelector': 'vtr-page-dashboard'  },
				{ 'label': 'Device--My Device', 'componentSelector': 'vtr-cptpage-my-device' },
				{ 'label': 'Device--My Device Settings', 'componentSelector': 'vtr-cptpage-device-settings' },
				{ 'label': 'Device--System Update', 'componentSelector': 'vtr-page-device-updates' },
				{ 'label': 'Device--Smart Assist', 'componentSelector': 'vtr-page-smart-assist' },
				{ 'label': 'Security--My Security', 'componentSelector': 'vtr-page-security' },
				{ 'label': 'Security--Anti-Virus', 'componentSelector': 'vtr-page-security-antivirus' },
				{ 'label': 'Security--Password Health', 'componentSelector': 'vtr-page-security-password'},
				{ 'label': 'Security--WiFi Security', 'componentSelector': 'vtr-page-security-wifi'},
				{ 'label': 'Security--Internet Protection', 'componentSelector': 'vtr-page-security-internet'},
			]
		},
	];

}

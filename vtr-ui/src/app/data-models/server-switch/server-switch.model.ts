import CountryList from "src/assets/server-switch/CountryList.json";
import LanguageList from "src/assets/server-switch/LanguageList.json";
import CountryNames from "src/assets/server-switch/CountryNames.json";
import LanguageNames from "src/assets/server-switch/LanguageNames.json";

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
	public countryNames: {} = CountryNames;
	public languageList: any = LanguageList;
	public languageNames: {} = LanguageNames;
	public defaultCountryIndex: any = 0;

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
			'optgroup': 'Core',
			'opt': [
				{ 'label': 'Dashboard', 'componentSelector': 'vtr-page-dashboard'  },
				{ 'label': 'Device', 'componentSelector': 'vtr-cptpage-my-device' },
				{ 'label': 'Device Settings', 'componentSelector': 'vtr-cptpage-device-settings' },
				{ 'label': 'System Updates', 'componentSelector': 'vtr-page-device-updates' },
				/*{ 'label': 'Smart Assist', 'componentSelector': 'vtr-page-smart-assist' },*/
				{ 'label': 'Security', 'componentSelector': 'vtr-page-security' },
				{ 'label': 'Anti-Virus', 'componentSelector': 'vtr-page-security-antivirus' },
				{ 'label': 'Password Protection', 'componentSelector': 'vtr-page-security-password'},
				{ 'label': 'WiFi Security', 'componentSelector': 'vtr-page-security-wifi'},
				{ 'label': 'Internet Protection', 'componentSelector': 'vtr-page-security-internet'},
				/*{ 'label': 'Windows Hello', 'componentSelector': 'vtr-page-security-windows-hello' },*/
				{ 'label': 'Support', 'componentSelector': 'vtr-page-support'}
			]
		},
		/*gaming*/
		{
			'optgroup': 'Gaming',
			'opt': [
				{ 'label': 'Dashboard', 'componentSelector': 'vtr-page-device-gaming'  },
				{ 'label': 'Macro Key', 'componentSelector': 'vtr-page-macrokey'  },
				{ 'label': 'Lighting', 'componentSelector': 'vtr-page-lightingcustomize'  },
				{ 'label': 'Network Boost', 'componentSelector': 'vtr-page-networkboost'  },
				{ 'label': 'Auto Close', 'componentSelector': 'vtr-page-autoclose'  }
			]
		},
		
	];

	/*CPT cms urls */
	public cmsServerList: any = [
		{'label': 'https://cm.dxp.lenovo.com (Prod Content Management)', 'cmsserver': 'https://cm.dxp.lenovo.com'},
		{'label': 'https://stg.dxp.lenovo.com (Prod Content Staging)', 'cmsserver': 'https://stg.dxp.lenovo.com'},
		{'label': 'https://vantage.dxp.lenovo.com (Prod Content Delivery)', 'cmsserver': 'https://vantage.dxp.lenovo.com'},
		{'label': 'https://vantage.csw.lenovo.com (Prod LIVE/CDN)', 'cmsserver': 'https://vantage.csw.lenovo.com'},
		{'label': 'https://cm.dxp-qa.lenovo.com (QA Content Management)', 'cmsserver': 'https://cm.dxp-qa.lenovo.com'},
		{'label': 'https://vantage.dxp-qa.lenovo.com (QA Content Delivery)', 'cmsserver': 'https://vantage.dxp-qa.lenovo.com'},
		{'label': 'https://vantage-qa.csw.lenovo.com (QA LIVE/CDN)', 'cmsserver': 'https://vantage-qa.csw.lenovo.com'},
	];

	//CPT CountryList & CountryName Mapping
	public getCountryNameList(): any {
		let cList = []; 
		this.countryList.forEach((v,i)=>{
			let name = v.Value+' - '+this.countryNames[v.Value];
			cList.push({"ItemID": v.ItemID,"Value":v.Value,"Label": name});
			if(v.Value=='US') {
				this.defaultCountryIndex = i;
			}
		});
		return cList;
	}

	//CPT LanguageList & LanguageName Mapping
	public getLanguageNameList(): any {
		let lList = []; 
		this.languageList.forEach((v)=>{
			let name = v.Value+' - '+this.languageNames[v.Value];
			lList.push({"ItemID": v.ItemID,"Value": v.Value,"Label": name});
		});
		return lList;
	}

}

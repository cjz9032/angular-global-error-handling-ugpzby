import CountryList from "../../../assets/server-switch/CountryList.json";
import LanguageList from "../../../assets/server-switch/LanguageList.json";
import SegmentList from "../../../assets/server-switch/SegmentList.json";
import ServerList from "../../../assets/server-switch/ServerList.json";
import BrandList from "../../../assets/server-switch/BrandList.json";
import OEMList from "../../../assets/server-switch/OEMList.json";

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

	public countryList: any = CountryList;
	public languageList: any = LanguageList;
	public segmentList: any = SegmentList;
	public serverList: any = ServerList;
	public brandList: any = BrandList;
	public oemList: any = OEMList;
}

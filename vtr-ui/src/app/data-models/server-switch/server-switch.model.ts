import CountryList from "../../../assets/server-switch/CountryList.json";
import LanguageList from "../../../assets/server-switch/LanguageList.json";
import SegmentList from "../../../assets/server-switch/SegmentList.json";

export class ServerSwitch {
        public currentUrl: string;
        public country: any;
        public countryId: string;
        public language: any;
        public languageId: string;
        public segment: any;
        public segmentId: string;
        public countryList: any = CountryList;
        public languageList: any = LanguageList;
        public segmentList: any = SegmentList;
        public serverList: string[] = [
                'https://vantage.csw.lenovo.com/#/dashboard',
                'https://vantage-qa.csw.lenovo.com/#/dashboard',
                'https://vantage-dev.csw.lenovo.com/#/dashboard',
                'https://vantage-stage.csw.lenovo.com/#/dashboard'
        ];
}
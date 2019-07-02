import CountryList from "../../../assets/server-switch/CountryList.json";
import LanguageList from "../../../assets/server-switch/LanguageList.json";
import SegmentList from "../../../assets/server-switch/SegmentList.json";

export class ServerSwitch {
        public country: any;
        public countryId: string;
        public language: any;
        public languageId: string;
        public segment: any;
        public segmentId: string;
        public countryList: any = CountryList;
        public languageList: any = LanguageList;
        public segmentList: any = SegmentList;
}
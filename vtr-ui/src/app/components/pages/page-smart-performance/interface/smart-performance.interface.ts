export interface SPYearPrice {
	code: string;
	price: number;
	formatPrice: string;
	symbol: string;
	isoCode: string;
}

export interface SPLocalPriceData {
	geo: string;
	yearlyPrice: string;
	monthlyPrice: string;
}

export interface SPHistory {
	Tunecount: number;
	Tunesize: number;
	Boostcount: number;
	Boostsize: number;
	Secure: number;
	recentscantime: string;
	lastscanresults: SPLastScanResult[];
}

export interface SPLastScanResult {
	scanruntime: string;
	type: string;
	fixcount: number;
	status: string;
	tune?: number;
	Tune?: number;
	tune_accumulatedjunk: number;
	tune_usabilityissues: number;
	tune_windowssettings: number;
	tune_systemerrors: number;
	tune_registryerrors: number;
	boost?: number;
	Boost?: number;
	boost_ejunk: number;
	boost_networksettings: number;
	boost_browsersettings: number;
	boost_browsersecurity: number;
	boost_wifiperformance: number;
	secure?: number;
	Secure?: number;
	secure_malwarescan: number;
	secure_zerodayinfections: number;
	secure_securitysettings: number;
	secure_errantprograms: number;
	secure_annoyingadware: number;
}

export interface SPHistoryScanResultsDateTime extends SPLastScanResult {
	scanRunDate?: string;
	scanRunTime?: string;
}

export interface SPShowResult {
	show: boolean;
	isLastFix: boolean;
	itemType: string;
	time: string;
}

export interface SPResult {
	id: string;
	header: SPResultHeader;
	activeContentId: string;
	contents: SPResultContent[];
}

export interface SPResultHeader {
	id: string;
	icon: string;
	title: string;
	pId: string;
}

export interface SPResultContent {
	id: string;
	icon: string;
	title: string;
	countId: string;
	sections: string[];
}

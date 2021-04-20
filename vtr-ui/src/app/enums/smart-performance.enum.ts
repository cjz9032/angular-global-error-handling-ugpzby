export enum SPCategory {
	TuneUpPerformance = 'Tune up performance',
	InternetPerformance = 'Internet performance',
	MalwareSecurity = 'Malware & Security',
}

export enum SPSubCategory {
	TunePC = 100,
	TunePCAccumulateJunk = 101,
	TunePCUsabilityIssues = 102,
	TunePCWindowsSettings = 103,
	TunePCSystemErrors = 104,
	TunePCRegistryErrors = 105,
	Boost = 200,
	BoostEJunk = 201,
	BoostNetworkSettings = 202,
	BoostBrowserSettings = 203,
	BoostBrowserSecurity = 204,
	BoostWiFiPerformance = 205,
	Malware = 300,
	MalwareSan = 301,
	MalwareZeroDayInfections = 302,
	MalwareErrantPrograms = 303,
	MalwareAnnoyingAdware = 304,
	MalwareSecuritySettings = 305,
}

export enum EnumScanFrequency {
	OnceAMonth = 'Once a month',
}
export enum EnumSmartPerformance {
	ScheduleScanEndDate = '2020/07/27',
	SummaryWaitingTime = 5,
	OldScheduleScan = 'Lenovo.Vantage.SmartPerformance.ScheduleScan',
	OldScheduleScanAndFix = 'Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix',
	ScheduleScan = 'Lenovo.Vantage.SmartPerformance.SScan',
	ScheduleScanAndFix = 'Lenovo.Vantage.SmartPerformance.SScanAndFix',
}
export enum PaymentPage {
	ApplicationName = 'COMPANION',
	SmartPerformance = '&smartperformance=',
	SerialQueryParameter = 'serial=',
	MTQueryParameter = '&mt=',
	SourceQueryParameter = '&source=',
	Slash = '/',
	True = 'true',
	OrderWaitingTime = 1.5, // MINUTES,
}
export enum SpSubscriptionDetails {
	Month = 31,
	TwoMonths = 60,
}

export enum SPHeaderImageType {
	Normal = 1,
	Scan = 2,
	Issue = 3,
	Well = 4,
}

export const actualScanFrequency: any = ['Once a week', 'Every other week', 'Every month'];
export const actualDays: any = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

export const actualMeridiem = ['AM', 'PM'];

export enum SPPriceCode {
	Year = '5WS0X58671',
	TwoYear = '5WS0X58670',
	ThreeYear = '5WS0X58672',
	FourYear = '5WS0X58669',
}

export enum ScanningState {
	NotStart = 0,
	Running = 1,
	Canceled = 2,
	Completed = 3
}

export enum SubscriptionState {
	Inactive = 0,
	Active = 1,
	Expired = 2
}

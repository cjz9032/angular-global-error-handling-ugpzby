export enum SPCategory{
	TUNEUPPERFORMANCE = 'Tune up performance',
	INTERNETPERFORMANCE = 'Internet performance',
	MALWARESECURITY = 'Malware & Security'
}

export enum SPSubCategory{
	HUNDEREAD = 100,
	HUNDEREADANDONE = 101,
	HUNDEREADANDTWO = 102,
	HUNDEREADANDTHREE = 103,
	HUNDEREADANDFOUR = 104,
	HUNDEREADANDFIVE = 105,
	TWOHUNDEREAD = 200,
	TWOHUNDEREADANDONE = 201,
	TWOHUNDEREADANDTWO = 202,
	TWOHUNDEREADANDTHREE = 203,
	TWOHUNDEREADANDFOUR = 204,
	TWOHUNDEREADANDFIVE = 205,
	THREEHUNDEREAD = 300,
	THREEHUNDEREADANDONE = 301,
	THREEHUNDEREADANDTWO = 302,
	THREEHUNDEREADANDTHREE = 303,
	THREEHUNDEREADANDFOUR = 304,
	THREEHUNDEREADANDFIVE = 305,
}
export enum enumScanFrequency{
	ONCEAMONTH = 'Once a month',
}
export enum enumSmartPerformance{
	SCHEDULESCANENDDATE = '2020/07/27',
	SUMMARYWAITINGTIME = 5,
	OLDSCHEDULESCAN = 'Lenovo.Vantage.SmartPerformance.ScheduleScan',
	OLDSCHEDULESCANANDFIX='Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix',
	SCHEDULESCAN = 'Lenovo.Vantage.SmartPerformance.SScan',
	SCHEDULESCANANDFIX = 'Lenovo.Vantage.SmartPerformance.SScanAndFix'
}
export enum PaymentPage{
	APPLICATIONNAME = 'COMPANION',
	SMARTPERFORMANCE = '&smartperformance=',
	SERIALQUERYPARAMETER='serial=',
	MTQUERYPARAMETER='&mt=',
	SOURCEQUERYPARAMETER='&source=',
	SLASH='/',
	TRUE='true',
	ORDERWAITINGTIME = 15, // MINUTES,
}

export const actualScanFrequency: any = [
	'Once a week',
	'Every other week',
	'Every month'
]
export const actualDays: any = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
]

export const actualMeridiem = ['AM', 'PM']
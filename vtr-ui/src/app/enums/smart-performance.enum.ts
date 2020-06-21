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
}
export enum PaymentPage{
	URL = 'https://uatpcsupport.lenovo.com/',
	APPLICATIONNAME = 'COMPANION',
	URLSTRING = 'upgradewarranty?',
	SMARTPERFORMANCE = '&smartperformance=',
	SERIALQUERYPARAMETER='serial=',
	MTQUERYPARAMETER='&mt=',
	SOURCEQUERYPARAMETER='&source=',
	SLASH='/',
	TRUE='true',
	ORDERDETAILS = 'http://uatpcsupport.lenovo.com/api/v4/upsell/smart/getorders?serialNumber=',
	ORDERWAITINGTIME = 10, // MINUTES,
	PNLIST = 'U2FsdGVkX1+X2TVVOmuZWob7GGBAX0MqhbFG7Py5rjlN9MWpGuBkRkz23xBRr9xZllutntrWS2FDYJ9/CW0JIK8DaxmmShtyQEe+aqm9jYk='
}
export enum enumDaysOfTheWeek {
	sun='Sunday',
	mon='Monday',
	tue='Tuesday',
	wed='Wednesday',
	thurs='Thursday',
	fri='Friday',
	sat='Saturday',
	sunShort='Sun',
	monShort='Mon',
	tueShort='Tue',
	wedShort='Wed',
	thursShort='Thu',
	friShort='Fri',
	satShort='Sat',
	sunLang='smartPerformance.scanSettings.sun',
	monLang='smartPerformance.scanSettings.mon',
	tueLang='smartPerformance.scanSettings.tue',
	wedLang='smartPerformance.scanSettings.wed',
	thursLang='smartPerformance.scanSettings.thu',
	friLang='smartPerformance.scanSettings.fri',
	satLang='smartPerformance.scanSettings.sat'
}

export const actualScanFrequency: any = ["Once a week", "Every other week", "Every month"]
export const actualDays: any = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
]
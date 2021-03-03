export enum WarrantyStatusEnum {
	InWarranty = 'in warranty',
	WarrantyExpired = 'out of warranty',
	WarrantyNotFound = 'warranty not found',
}

export enum WarrantyCodeEnum {
	Depot = 'depot',
	NoWarranty = 'nowarranty',
	Onsite = 'onsite',
	Premier = 'premier',
}

export enum WarrantyLevelEnum {
	Good = 'good',
	Better = 'better',
	Best = 'best',
}

export enum WarrantyRoundEnum {
	Red,
	Green,
	Start,
	End,
	Add,
	Grey
}

export interface WarrantyDataRound {
	index: number;
	mos: number;
	isInUsed?: boolean;
	isToday?: boolean;
	isAlert?: boolean;
	isStart?: boolean;
	startDate?: string;
	isEnd?: boolean;
	endDate?: string;
	isRenew?: boolean;
	isLast?: boolean;
}

export interface WarrantyData {
	isAvailable?: boolean;
	warrantyStatus: WarrantyStatusEnum | string;
	startDate: string;
	endDate: string;
	warrantyLevels: [
		{
			level: string;
			levelText: string;
		},
		{
			level: string;
			levelText: string;
		},
		{
			level: string;
			levelText: string;
		}
	];
	currentWarrantyLevel: string;
	warrantyCode: string | WarrantyCodeEnum;
	warrantyCodeText: string;
	image: string;
	remainingDays: number;
	remainingMonths: number;
	maxDuration: number;
	inUseCircle?: number;
	remainingCircle?: number;
	renewableCircle?: number;
	todayCircleIndex?: number;
	firstRound?: WarrantyDataRound;
	rounds?: WarrantyDataRound[];
	url?: string;
}

export interface WarrantyLevel {
	id: string;
	isRecommended: boolean;
	levelText: string;
	warrantyCode: string | WarrantyCodeEnum;
	warrantyCodeText: string;
	points: string[];
}

export enum BatteryLifeSpan {
	ERROR = -1,
	LT_6 = 1,
	GT_6 = 2,
	GT_12 = 3,
	GT_18= 4,
	GT_24 = 5,
	GT_30 = 6,
	GT_36 = 7
}

export enum BatteryTemperatureStatus {
	/**
	 * -300 is an invalid value, it will be used when plugin does not
	 * return a normal value
	 */
	ERROR = -300
}

export enum BatteryHealthLevel {
	ERROR = -1,
	LEVEL_1 = 1,
	LEVEL_2 = 2,
	LEVEL_3 = 3,
	LEVEL_4 = 4,
	LEVEL_5 = 5,
	LEVEL_6 = 6,
	LEVEL_7 = 7
}

export enum BatteryHealthTip {
	ERROR = -1,
	TIPS_0 = 0,
	TIPS_1 = 1,
	TIPS_2 = 2,
	TIPS_3 = 3,
	TIPS_4 = 4,
	TIPS_5 = 5,
	TIPS_6 = 6,
	TIPS_7 = 7,
	TIPS_8 = 8
}

export enum BatteryCapacityCircleStyle {
	ERROR = 'error',
	GREEN = 'color-green',
	YELLOW = 'color-yellow',
	PINK = 'color-pink',
	RED = 'color-red',
}


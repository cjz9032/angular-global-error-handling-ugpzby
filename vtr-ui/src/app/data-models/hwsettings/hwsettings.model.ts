import { SupportedAppEnum, VoipErrorCodeEnum } from '../../enums/hwsettings.enum';
import {
	CommonErrorCode,
	CommonResponse,
	NumberBoolean,
	StringBoolean,
} from '../../data-models/common/common.interface';
import { BacklightLevelEnum, BacklightStatusEnum } from '../../enums/hwsettings.enum';
export class Microphone {
	constructor(
		public available: boolean,
		public muteDisabled: boolean,
		public volume: number,
		public currentMode: string,
		public keyboardNoiseSuppression: boolean,
		public autoOptimization: boolean,
		public AEC: boolean,
		public disableEffect: boolean,
		public permission: boolean
	) {}
}

export class EyeCareMode {
	public available = false;
	public current = 0;
	public maximum = 100;
	public minimum = 0;
	public status = false;
}

export class SunsetToSunriseStatus {
	constructor(
		public available: boolean,
		public status: boolean,
		public permission: boolean,
		public sunriseTime: string,
		public sunsetTime: string
	) {}
}

export class DolbyModeResponse {
	constructor(
		public available: boolean,
		public supportedModes: string[],
		public currentMode: string,

		public isAudioProfileEnabled: boolean,
		public eCourseStatus: string,
		public voIPStatus: string,
		public entertainmentStatus: string,
		public driverAvailability: boolean
	) {}
}

export class DolbyAudioToggleCapability {
	public available = true;
	public status = false;
	public loader = true;
	public icon = [];
	public dolbyModeResponse: DolbyModeResponse;
}

export class MicrophoneOptimizeModes {
	constructor(public modes: string[], public current: string) {}
}

export class BatteryDetail {
	//#region UI related properties

	public heading: string;

	// #end region

	//#region battery detail properties

	public chargeStatus: number;
	public chargeStatusString: string;
	public remainingPercent: number;
	public remainingTime: number;
	public remainingTimeText: string; // to show label on detail if 2 batteries with different charging status
	public remainingCapacity: number;
	public fullChargeCapacity: number;
	public voltage: number;
	public wattage: number;
	public temperature: number;
	public cycleCount: number;
	public manufacturer: string;
	public manufactureDate: Date;
	public firstUseDate: Date;
	public barCode: string;
	public deviceChemistry: string;
	public designCapacity: number;
	public designVoltage: number;
	public firmwareVersion: string;
	public fruPart: string;
	public batteryHealth: number;
	public batteryCondition: string[];
	public isTemporaryChargeMode: boolean;
	public isDlsPiCapable: boolean;
	public batteryHealthLevel: number;
	public batteryHealthTip: number;
	public predictedLifeSpan: string;
	public lifePercent: number;
	// #end region
}

export class PowerPlan {
	public settingList: PowerPlanSetting[];
	public powerPlanName: string;
	public preDefined: boolean;
	public hddTimeoutAC: number;
	public hiberTimeoutAC: number;
	public suspendTimeoutAC: number;
	public videoTimeoutAC: number;
	public performance: number;
	public temperature: number;
	public powerUsage: number;
	public cpuSpeed: string;
	public brightness: number;
}

export class PowerPlanSetting {
	public key: string;
	public value: string;
}

export class AllPowerPlans {
	activePowerPlan: string;
	powerButtonAction: number;
	passwordOnStandby: number;
	dbcOnLockEvent: number;
	powerMeter: number;
	alsAdaptiveBrightness: number;
	adjustOffset: string;
	powerPlanList: PowerPlan[];
}

export interface VoipApp {
	appName: SupportedAppEnum;
	isAppInstalled: boolean;
	isSelected?: boolean;
}

export interface VoipResponse {
	errorCode: VoipErrorCodeEnum;
	capability: boolean;
	keyboardVersion?: string;
	appList?: VoipApp[];
}

export class AntiTheftResponse {
	constructor(
		public available: boolean,
		public status: boolean,
		public isSupportPhoto: boolean,
		public cameraPrivacyState: boolean,
		public authorizedAccessState: boolean,
		public photoAddress: string = '',
		public alarmOften: number = 10,
		public photoNumber: number = 5
	) {}
}

export class SuperResolutionResponse {
	constructor(public available: boolean, public status: boolean, public players: string) {}
}

export class HsaIntelligentSecurityResponse {
	constructor(
		public capacity: boolean,
		public zeroTouchLockDistanceAutoAdjust: boolean,
		public zeroTouchLockDistance: number = 1,
		public capability: number = 0,
		public sensorType: number = 0,
		public videoAutoPauseResumeVersion: number = 0
	) {}
}

export class ConservationModeStatus {
	constructor(
		public available: boolean,
		public storageToEighty: boolean,
		public status: boolean,
		public isLoading: boolean = true
	) {}
}

export class ChargeThreshold {
	batteryNum = 1;
	isCapable = false;
	isEnabled = false;
	startValue = 40;
	stopValue = 45;
	checkboxValue = false;
}

export interface TopRowFunctionsIdeapad {
	getCapability(): Promise<GetCapabilityResponse>;

	getPrimaryKey(): Promise<GetPrimaryKeyResponse>;

	getFnLockStatus(): Promise<GetFnLockStatusResponse>;

	/**
	 * @param fnLock "True|False" ATTENTION!!!!!  String type truthy or falsy.
	 */
	setFnLockStatus(fnLock: StringBoolean): Promise<CommonResponse<null>>;
}

export interface GetCapabilityResponse {
	errorCode?: CommonErrorCode;
	capabilityList: {
		Items: CapabilityTemp[];
	};
	reservedInformation?: any;
}

export interface GetPrimaryKeyResponse {
	settingList: {
		setting: PrimaryKeySetting[];
	};
}

export interface GetFnLockStatusResponse {
	settingList: {
		setting: FnLockStatus[];
	};
}

export interface CapabilityTemp {
	key: string;
	value: StringBoolean;
}

export interface PrimaryKeySetting {
	key: string;
	value: KeyType;
	enabled: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface FnLockStatus {
	key: string;
	value: StringBoolean;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export interface Backlight {
	getBacklight(): Promise<GetBacklightResponse>;

	setBacklight(status: SetBacklightStatus): Promise<CommonResponse<null>>;

	getBacklightOnSystemChange(
		settings: BacklightOnChangeSettings,
		callback: (response: { payload: GetBacklightResponse }) => void
	): Promise<GetBacklightResponse>;
}

export interface BacklightBase<T = string, K = string> {
	key: T;
	value: K;
	enabled?: NumberBoolean;
	errorCode?: CommonErrorCode;
}

export type BacklightLevel = BacklightBase<'KeyboardBacklightLevel', BacklightLevelEnum>;

export type BacklightStatus = BacklightBase<'KeyboardBacklightStatus', BacklightStatusEnum>;

export interface GetBacklightResponse {
	settingList: {
		setting: Array<BacklightStatus | BacklightLevel>;
	};
}

export interface SetBacklightStatus {
	settingList: [
		{
			setting: Array<BacklightStatus>;
		}
	];
}

export interface BacklightOnChangeSettings {
	settingList: [
		{
			// value: string like '00:01:00'
			setting: Array<BacklightBase<'IntermediateResponseDuration'>>;
		}
	];
}

export interface BacklightMode {
	checked: boolean;
	value: BacklightStatusEnum;
	title: string;
	disabled: boolean;
}

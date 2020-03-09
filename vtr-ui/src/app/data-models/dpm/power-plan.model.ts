import { PowerPlanSetting } from './power-plan-setting.model';

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

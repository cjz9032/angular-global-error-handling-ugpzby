import { PowerPlan } from './power-plan.model';

export class AllPowerPlans{
        activePowerPlan: string;
        powerButtonAction: number;
        passwordOnStandby: number;
        dbcOnLockEvent: number;
        powerMeter: number;
        alsAdaptiveBrightness: number;
        adjustOffset: string;
		powerPlanList: PowerPlan[];
}

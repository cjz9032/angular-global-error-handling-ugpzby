export enum IntelligentPerformanceModes {
        PERFORMANCE = 'MMC_Performance',
        COOL = 'ITS_Auto',
        BATTERYSAVING = 'MMC_Cool'
}

export class IntelligentPerformanceSettings {
        public isIntelligentPerformanceVisible: boolean = false;
        public selectModeTextFlag: string = '';
}
// export enum IntelligentCooling {
// }
export enum IntelligentCoolingHardware {
	ITS = 'ITS',
	Legacy = 'legacy',
}
export enum ICModes {
    Cool = "Cool",
    Performance = "Performance",
    Error = "Error"
}

export interface IntelligentCoolingMode {
	type: string;
	status: boolean;
}

export class IntelligentCoolingModes {
    public static Cool: IntelligentCoolingMode = { type : ICModes.Cool, status: true };
	public static Performance: IntelligentCoolingMode = { type:ICModes.Performance, status: false };
	public static Error: IntelligentCoolingMode = { type:ICModes.Error, status: false };
	public static getMode(val: string): IntelligentCoolingMode {
		if( val.toLocaleLowerCase() == ICModes.Cool.toLocaleLowerCase()) {
			return this.Cool;
		} else if(val.toLocaleLowerCase() == ICModes.Performance.toLocaleLowerCase()) {
			return this.Performance;
		} else {
			return this.Error;
		}
	}
}
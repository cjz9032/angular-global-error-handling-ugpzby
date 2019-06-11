// export enum IntelligentCooling {
// }
export enum IntelligentCoolingHardware {
	ITS = 'ITS',
	Legacy = 'legacy',
	ITS14 = "ITS14"// ideapad 4.0
}
export enum ICModes {
    Cool = "Cool",
    Performance = "Performance",
    Error = "Error"
}

export interface IntelligentCoolingMode {
	type: string;
	status: boolean;
	ideapadType: string;
}

export class IntelligentCoolingModes {
    public static Cool: IntelligentCoolingMode = { type : ICModes.Cool, status: true,  ideapadType: "MMC_Cool"};
	public static Performance: IntelligentCoolingMode = { type:ICModes.Performance, status: false, ideapadType: "MMC_Performance"};
	public static Error: IntelligentCoolingMode = { type:ICModes.Error, status: false, ideapadType: ""};
	public static BatterySaving: IntelligentCoolingMode = { type:"MMC_Auto", status: false, ideapadType: "MMC_Auto"};
	public static getMode(val: string): IntelligentCoolingMode {
		if( val.toLocaleLowerCase() == ICModes.Cool.toLocaleLowerCase() 
			|| val.toLocaleLowerCase() == this.Cool.ideapadType.toLocaleLowerCase()) {
			return this.Cool;
		} else if(val.toLocaleLowerCase() == ICModes.Performance.toLocaleLowerCase()
			|| val.toLocaleLowerCase() == this.Performance.ideapadType.toLocaleLowerCase()) {
			return this.Performance;
		} else if(val.toLocaleLowerCase() == this.BatterySaving.ideapadType.toLocaleLowerCase()) {
			return this.BatterySaving;
		} else {
			return this.Error;
		}
	}
}
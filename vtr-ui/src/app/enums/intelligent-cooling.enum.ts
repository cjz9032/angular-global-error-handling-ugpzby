// export enum IntelligentCooling {
// }
export enum IntelligentCoolingHardware {
	ITS = 'ITS',
	Legacy = 'legacy',
	ITS14 = "ITS14",// ideapad 4.0
	ITS13 = "ITS13"// ideapad 3.0
}
export enum ICModes {
	Cool = "Cool",
	Performance = "Performance",
	Error = "Error"
}

export enum DYTC6Modes {
	Auto = 'autoMode',
	Manual = 'manualMode'
}

export interface IntelligentCoolingMode {
	type: string;
	status: boolean;
	ideapadType4: string;
	ideapadType3: string;
}

export class IntelligentCoolingModes {
	public static Cool: IntelligentCoolingMode = { type: ICModes.Cool, status: true, ideapadType4: "ITS_Auto", ideapadType3: "MMC_Cool" };
	public static Performance: IntelligentCoolingMode = { type: ICModes.Performance, status: false, ideapadType4: "MMC_Performance", ideapadType3: "MMC_Performance" };
	public static Error: IntelligentCoolingMode = { type: ICModes.Error, status: false, ideapadType4: "", ideapadType3: "ITS_Auto" };
	public static BatterySaving: IntelligentCoolingMode = { type: "MMC_Cool", status: false, ideapadType4: "MMC_Cool", ideapadType3: "" };
	public static getMode(val: string): IntelligentCoolingMode {
		if (val.toLocaleLowerCase() === ICModes.Cool.toLocaleLowerCase()
			|| val.toLocaleLowerCase() === this.Cool.ideapadType4.toLocaleLowerCase()) {
			return this.Cool;
		} else if (val.toLocaleLowerCase() === ICModes.Performance.toLocaleLowerCase()
			|| val.toLocaleLowerCase() === this.Performance.ideapadType4.toLocaleLowerCase()) {
			return this.Performance;
		} else if (val.toLocaleLowerCase() === this.BatterySaving.ideapadType4.toLocaleLowerCase()) {
			return this.BatterySaving;
		} else {
			return this.Error;
		}
	}
	public static getModeForIdeaPadITS3(val: string): IntelligentCoolingMode {
		if (val.toLocaleLowerCase() === this.Cool.ideapadType3.toLocaleLowerCase()) {
			return this.Cool;
		} else if (val.toLocaleLowerCase() === this.Performance.ideapadType3.toLocaleLowerCase()) {
			return this.Performance;
		} else if (val.toLocaleLowerCase() === this.Error.ideapadType3.toLocaleLowerCase()) {
			return this.Error;
		}
	}
}

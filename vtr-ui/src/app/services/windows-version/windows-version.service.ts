import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WindowsVersionService {
	private readonly VERSION_19H2 = 18363;
	private readonly VERSION_19H1 = 18362;
	private readonly VERSION_REDSTONE_5 = 17763;
	private readonly VERSION_REDSTONE_4 = 17134;

	private regexp: RegExp = /Edge\/(\d+).(\d+)$/gm;

	public get currentBuildVersion() : number | null {
		const result = this.regexp.exec(navigator.userAgent);

		return Array.isArray(result) ? Number(result[2]) : null;
	}

	public is20H1(): boolean {
		return this.currentBuildVersion > this.VERSION_19H2;
	}

	public isOlderThan20H1(): boolean {
		return this.currentBuildVersion <= this.VERSION_19H2;
	}

	public is19H2(): boolean {
		return this.currentBuildVersion > this.VERSION_19H1
			&& this.currentBuildVersion <= this.VERSION_19H2;
	}

	public is19H1(): boolean {
		return this.currentBuildVersion > this.VERSION_REDSTONE_5
			&& this.currentBuildVersion <= this.VERSION_19H1;
	}

	public isRS5(): boolean {
		return this.currentBuildVersion > this.VERSION_REDSTONE_4
			&& this.currentBuildVersion <= this.VERSION_REDSTONE_5;
	}

	public isRS4(): boolean {
		return this.currentBuildVersion <= this.VERSION_REDSTONE_4;
	}
}

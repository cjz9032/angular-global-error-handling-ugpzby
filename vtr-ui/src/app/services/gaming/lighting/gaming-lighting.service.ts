import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class GamingLightingService {
	private getGamingLighting: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.getGamingLighting = shellService.getGamingLighting();
		if (this.getGamingLighting) {
			this.isShellAvailable = true;
		}
	}

	getLightingProfileById(profile: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.getLightingProfileById(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setLightingProfileId(pageid: number, profileId: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.setLightingProfileId(pageid, profileId);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getLightingProfileId(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.getLightingProfileId();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setLightingProfileEffectColor(profile: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.setLightingProfileEffectColor(profile);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setLightingDefaultProfileById(profileId: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.setLightingDefaultProfileById(profileId);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	setLightingProfileBrightness(profileId: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.setLightingProfileBrightness(profileId);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
	getLightingCapabilities(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.getLightingCapabilities();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

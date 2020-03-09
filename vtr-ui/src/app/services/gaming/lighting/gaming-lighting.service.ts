import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class GamingLightingService {
	public getGamingLighting: any;
	public isShellAvailable = false;

	public cardContentPositionF: any = {
		FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
	};
	public cardContentPositionB: any = {
		FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
	};

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

	// X50 new interface
	regLightingProfileIdChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.getGamingLighting.regLightingProfileIdChangeEvent();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	checkAreaColorFn(listInfo) {
		try {
			const array = listInfo.map(o => o.lightColor);
			if (array.length > 0) {
				return array.some(function(value, index) {
					return value !== array[0];
				});
			} else {
				return false;
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

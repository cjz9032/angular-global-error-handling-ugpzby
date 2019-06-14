import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LightingCapabilities } from 'src/app/data-models/gaming/lighting-capabilities';
import { LightingProfile } from 'src/app/data-models/gaming/lighting-profile';

@Component({
	selector: 'vtr-ui-lighting-profile',
	templateUrl: './ui-lighting-profile.component.html',
	styleUrls: ['./ui-lighting-profile.component.scss']
})
export class UiLightingProfileComponent implements OnInit {
	@Input() currentProfileId: number;
	public lightingCapabilities: LightingCapabilities;
	public profileBrightness: any;
	public options: any;
	public effectData: any;
	public isProfileOff: boolean = true;
	public currentProfile: number = 3;
	public lightingData: any;
	public isOff: number;
	public brightness: any;
	public response: any;
	public defbrgtval: 1;
	public cacheval: number;
	public tempval: number;
	public didSuccess: boolean;
	public lightingProfile: LightingProfile;
	public lightInfo: any;

	public lightingEffectData = {
		drop: [
			{
				curSelected: 1,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						value: 3
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 5
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 6
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 7
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 9
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 10
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 11
					}
				]
			},
			{
				curSelected: 2,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						value: 3
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 5
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 6
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 7
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 9
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 10
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 11
					}
				]
			}

		]
	};

	public panelImageData = [
		{
			'PanelType': 1, 'RGB': 1, 'PanelImage': 'C530@2x.png'
		},
		{
			'PanelType': 2, 'RGB': 255, 'PanelImage': 'T730Front@2x.png'
		},
		{
			'PanelType': 2, 'RGB': 1, 'PanelImage': 'T530@2x.png'
		},
		{
			'PanelType': 4, 'RGB': 255, 'PanelImage': 'renRGBFront@2x.png'
		},
		{
			'PanelType': 4, 'RGB': 1, 'PanelImage': 'renFront@2x.png'
		},
		{
			'PanelType': 8, 'RGB': 255, 'PanelImage': 'T730Side@2x.png'
		},
		{
			'PanelType': 16, 'RGB': 255, 'PanelImage': 'T730Side@2x.png'
		},
		{
			'PanelType': 32, 'RGB': 255, 'PanelImage': 'C730Right@2x.png'
		},
		{
			'PanelType': 64, 'RGB': 255, 'PanelImage': 'C730Left@2x.png'
		},
		{
			'PanelType': 128, 'RGB': 1, 'PanelImage': 'ren@2x.png'
		},
		{
			'PanelType': 256, 'RGB': 1, 'PanelImage': 'T530Perspective@2x.png'
		}

	];
	public imagePath = './../../../../assets/images/gaming/lighting/';
	public panelImage1: string;
	public panelImage2: string;

	constructor(private gamingLightingService: GamingLightingService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService) { }

	ngOnInit() {
		console.log('id----------------------------------', this.currentProfileId);
		this.isProfileOff = false;
		this.getGamingLightingCapabilities();
		this.getLightingProfileById(this.currentProfileId);
		this.getLightingBrightness();
	}
	public optionChanged($event, item) { };

	setDefaultProfile(event) {
		try {
			this.isOff = Number(event.target.value);
			console.log('in profile click event....................................', this.isOff);
			if (this.isOff === 1) {
				this.isProfileOff = true;
			}
			else {
				this.isProfileOff = false;
			}
			console.log('fired.....');
		} catch (error) {
			console.error(error.message);
		}
	}
	setDefaultProfileFromLighting($event) {
		console.log('profile button clicked------------------------');
	}

	public getGamingLightingCapabilities() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.lightingCapabilities = response;
					console.log('gaming Lighting Capabilities js bridge ------------------------>', JSON.stringify(this.lightingCapabilities));
					console.log('led panel type ------------------------------------------', this.lightingCapabilities.RGBfeature);

					const ledRGB = this.lightingCapabilities.RGBfeature;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						const ledPanel = this.lightingCapabilities.LightPanelType[0];
						const resultImg = this.panelImageData.filter(function (v, i) {
							return ((v['PanelType'] === ledPanel && v['RGB'] === ledRGB));
						})
						console.log('panel image-------------------------------------------', + JSON.stringify(resultImg[0]));
						if (resultImg.length > 0) {
							this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
						}

						if (this.lightingCapabilities.LightPanelType.length > 1) {
							const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
							const resultImg2 = this.panelImageData.filter(function (v, i) {
								return ((v['PanelType'] === ledPanel2 && v['RGB'] === ledRGB));
							})
							console.log('panel image 2-------------------------------------------', + JSON.stringify(resultImg2[0]));
							if (resultImg2.length > 0) {
								this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
							}
						}
					}

				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	setLightingBrightness(event) {
		try {
			event = event + 1;
			console.log('in eventval--------------------------------' + event);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.setLightingProfileBrightness(event).then((response: any) => {
					this.didSuccess = response.didSuccess;
					this.brightness = response.brightness;
					//this.didSuccess = false;
					console.log('setLightingProfileBrightness---------------------------->',
						JSON.stringify(response));

					if (!this.didSuccess) {
						this.getLightingBrightness();

					} else {
						this.commonService.setLocalStorageValue(LocalStorageKey.ProfileBrightness, this.brightness);
						//this.getLightingBrightness();
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightingBrightness() {
		try {
			this.tempval = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileBrightness) || 0;
			this.profileBrightness = (this.tempval) - 1;
			console.log('cache value  ----------------', this.profileBrightness);
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightingProfileById(currProfileId) {
		try {
			// 1----profileid
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileById(currProfileId).then((response: any) => {
					console.log('getLightingProfileById------------response---------------->', JSON.stringify(response));
					if (response.didSuccess) {
						console.log('getLightingProfileById------------ ---------------->', JSON.stringify(response.lightInfo));
						this.currentProfile = response.profileId;
						this.profileBrightness = response.brightness;
						if (response.lightInfo.length > 0) {
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (response.lightInfo.length > 1) {
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
							}
						}
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightingProfileId() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileId().then((response: any) => {
					console.log('getLightingProfileId------------response---------------->',
						JSON.stringify(response));
					if (response.didSuccess) {


					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}

	}

	public setLightingProfileId(event) {
		try {

			this.isOff = Number(event.target.value);

			if (this.isOff === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
			}
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.setLightingProfileId(1, this.isOff).then((response: any) => {
					console.log('setLightingProfileId------------response---------------->',
						JSON.stringify(response));
					if (response.didSuccess) {
						if (response.lightInfo.length > 0) {
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (response.lightInfo.length > 1) {
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
							}
						}
						this.profileBrightness = response.brightness;
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}

	}
}


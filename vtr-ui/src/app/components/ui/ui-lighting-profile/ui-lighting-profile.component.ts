import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LightingCapabilities } from 'src/app/data-models/gaming/lighting-capabilities';
import { LightingProfile } from 'src/app/data-models/gaming/lighting-profile';
import { Color } from '../../pages/page-privacy/utils/fl-tracking-map/tracking-map-base/Color';
import { LightingProfileEffectColorNUmber, LightingProfileEffectColorString } from 'src/app/data-models/gaming/lighting-profile-effect-color';
import { isUndefined } from 'util';


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
	public currentProfile: number = 0;
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
	public dropOptions: any;
	public dropDataChanges: any;
	public lightingProfileEffectColorNUmber: LightingProfileEffectColorNUmber;
	public frontSelectedValue: any;
	public sideSelectedValue: any;
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
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 16
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 128
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 256
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 512
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 268435456
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
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 16
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 128
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 256
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 512
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 268435456
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
		if (this.currentProfileId !== 0) {

			this.getLightingProfileById(this.currentProfileId);
			this.getLightingBrightness();
		}
		else {
			this.isProfileOff = true;
		}
	}

	// ngOnChanges(changes) {
	// 	if (!isUndefined(changes)) {
	// 		if (!isUndefined(changes.dropDataChanges)) {
	// 			console.log('sat**********************************', this.dropDataChanges.topdata);
	// 			this.frontSelectedValue = this.dropDataChanges.topdata;
	// 			//this.delaySelectedValue = recordsData.interval;

	// 		}
	// 	}
	// }
	public optionChangedRGBTop($event, item) {
		console.log('event raised for color effect top RGB-------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event.value;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber).then((response: any) => {
				console.log(
					'setLightingProfileEffectColor top------------------------>',
					JSON.stringify(response)
				);
			});
		}

	}
	public optionChangedRGBSide($event, item) {
		console.log('event raised for color effect side RGB-------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[1];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event.value;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber).then((response: any) => {
				console.log(
					'setLightingProfileEffectColor side------------------------>',
					JSON.stringify(response)
				);
			});
		}
	}
	changeSingleCoorEffect($event) {
		console.log('single color option change fired------------------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[1];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber).then((response: any) => {
				console.log(
					'setLightingProfileEffectColor side------------------------>',
					JSON.stringify(response)
				);
			});
		}
	}
	setDefaultProfile(event) {
		try {
			this.isOff = Number(event.target.value);
			console.log('in profile click event....................................', this.isOff);
			if (this.isOff === 0) {
				this.isProfileOff = true;
			}
			else {
				this.isProfileOff = false;

				if (this.gamingLightingService.isShellAvailable) {
					this.gamingLightingService.setLightingDefaultProfileById(this.currentProfileId).then((response: any) => {
						console.log('setLightingDefaultProfileById------------response---------------->', JSON.stringify(response));
						if (response.didSuccess) {

							this.currentProfileId = response.profileId;
							this.currentProfile = response.profileId;
							this.profileBrightness = response.brightness;
							if (response.lightInfo.length > 0) {
								console.log('setLightingDefaultProfileById------------ --------------------------------------------------------->', JSON.stringify(response.lightInfo[0].lightEffectType));
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
								}
							}
						}
						else {
							this.isProfileOff = false;
						}
					});
				}

			}
			console.log('fired.....');
		} catch (error) {
			console.error(error.message);
		}
	}
	setDefaultProfileFromLighting($event) {
		console.log('profile button clicked------------------------');
		const name = $event.name;
	}

	public getGamingLightingCapabilities() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.lightingCapabilities = response;
					console.log('gaming Lighting Capabilities js bridge ------------------------>', JSON.stringify(this.lightingCapabilities));
					this.dropOptions = response.LedType_Complex;

					this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(i => this.dropOptions.includes(i.value));
					this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(i => this.dropOptions.includes(i.value));

					console.log('after drop options filter--------------------------------------------------------------------' +
						JSON.stringify(this.lightingEffectData.drop[0].dropOptions));


					console.log('led panel type ------------------------------------------', this.lightingCapabilities.RGBfeature);

					const ledRGB = this.lightingCapabilities.RGBfeature;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						const ledPanel = this.lightingCapabilities.LightPanelType[0];
						const resultImg = this.panelImageData.filter(function (v, i) {
							return ((v['PanelType'] === ledPanel && v['RGB'] === ledRGB));
						})
						if (resultImg.length > 0) {
							this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
						}

						if (this.lightingCapabilities.LightPanelType.length > 1) {
							const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
							const resultImg2 = this.panelImageData.filter(function (v, i) {
								return ((v['PanelType'] === ledPanel2 && v['RGB'] === ledRGB));
							})
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
			//event = event + 1;
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
						this.getLightingBrightness();
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightingBrightness() {
		try {
			this.profileBrightness = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileBrightness) || 0;
			//this.profileBrightness = (this.tempval) - 1;
			console.log('brightness cache value  ----------------', this.profileBrightness);
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


						this.currentProfileId = response.profileId;
						this.currentProfile = response.profileId;
						this.profileBrightness = response.brightness;
						if (response.lightInfo.length > 0) {
							//	this.dropDataChanges.topdata = response.lightInfo[0].lightEffectType;
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							console.log('sateesh------------------------------------------- ---------------->', this.frontSelectedValue);
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;

							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
							}
						}
					}
					else {
						this.isProfileOff = false;
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
					console.log('getLightingProfileId------------response---------------->', JSON.stringify(response));
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
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
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
	// public color = {
	// 	profileId: 1,
	// 	lightPanelType: 32,
	// 	lightColor: 'FF0000'
	// };
	public setLightingProfileEffectColor() {
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber).then((response: any) => {
				console.log(
					'setLightingProfileEffectColor ------------------------>',
					JSON.stringify(response)
				);
			});
		}
	}
}


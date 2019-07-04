import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LightingCapabilities } from 'src/app/data-models/gaming/lighting-capabilities';
import { LightingProfile } from 'src/app/data-models/gaming/lighting-profile';
import { Color } from '../../pages/page-privacy/utils/fl-tracking-map/tracking-map-base/Color';
import {
	LightingProfileEffectColorNUmber,
	LightingProfileEffectColorString
} from 'src/app/data-models/gaming/lighting-profile-effect-color';
import { isUndefined } from 'util';
import { Options } from 'src/app/data-models/gaming/lighting-options';
import { LightEffectComplexType } from 'src/app/enums/light-effect-complex-type';

@Component({
	selector: 'vtr-ui-lighting-profile',
	templateUrl: './ui-lighting-profile.component.html',
	styleUrls: ['./ui-lighting-profile.component.scss']
})
export class UiLightingProfileComponent implements OnInit {
	@Input() currentProfileId: number;
	public lightingCapabilities: LightingCapabilities;
	public profileBrightness: any;
	public profileRGBFeature: number = 0;
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
	public lightingProfileEffectColorString: LightingProfileEffectColorString;
	public frontSelectedValue: any;
	public sideSelectedValue: any;

	public inHex1: any;
	public inHex2: any;
	public applyBtnStatus1: String = 'apply';
	public applyBtnStatus2: String = 'apply';
	public showHideOverlay: boolean = false;
	public showHideOverlaySide: boolean = false;
	public selectedSingleColorOptionId: number;
	public enableBrightCondition: boolean = false;
	public enableBrightConditionside: boolean = false;
	public apply: 'gaming.lightingProfile.effect.apply.title | translate';
	public lightEffectRGBOptionName: string;
	public lightEffectRGBOptionNameSide: string;
	public simpleOrComplex: number;

	public lightingEffectData = {
		drop: [
			{
				curSelected: 1,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 268435456
					},
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
					// {
					// 	header: 'gaming.lightingProfile.effect.option5.title',
					// 	name: 'gaming.lightingProfile.effect.option5.title',
					// 	value: 16
					// },
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 128
					}
				]
			},
			{
				curSelected: 2,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 268435456
					},
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
					// {
					// 	header: 'gaming.lightingProfile.effect.option5.title',
					// 	name: 'gaming.lightingProfile.effect.option5.title',
					// 	value: 16
					// },
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 128
					}
				]
			}
		],
		btnOpt: [
			{
				apply: 'gaming.lightingProfile.effect.apply.title ',
				applied: 'gaming.lightingProfile.effect.applied.title '
			}
		]
	};

	public panelImageData = [
		{
			PanelType: 1,
			RGB: 1,
			PanelImage: 'C530@2x.png'
		},
		{
			PanelType: 2,
			RGB: 255,
			PanelImage: 'T730Front@2x.png'
		},
		{
			PanelType: 2,
			RGB: 1,
			PanelImage: 'T530@2x.png'
		},
		{
			PanelType: 4,
			RGB: 255,
			PanelImage: 'renRGBFront@2x.png'
		},
		{
			PanelType: 4,
			RGB: 1,
			PanelImage: 'renFront@2x.png'
		},
		{
			PanelType: 8,
			RGB: 255,
			PanelImage: 'T730Side@2x.png'
		},
		{
			PanelType: 16,
			RGB: 255,
			PanelImage: 'T730Side@2x.png'
		},
		{
			PanelType: 32,
			RGB: 255,
			PanelImage: 'C730Left@2x.png'
		},
		{
			PanelType: 64,
			RGB: 255,
			PanelImage: 'C730Right@2x.png'
		},
		{
			PanelType: 128,
			RGB: 1,
			PanelImage: 'ren@2x.png'
		},
		{
			PanelType: 256,
			RGB: 1,
			PanelImage: 'T530Perspective@2x.png'
		},
		{
			PanelType: 32,
			RGB: 1,
			PanelImage: 'C530Left@2x.png'
		},
		{
			PanelType: 64,
			RGB: 1,
			PanelImage: 'C530Right@2x.png'
		}
	];
	// optionsSingleColor = [
	// 	new Options(1, 'Always On'),
	// 	new Options(2, 'Fast Blink'),
	// 	new Options(3, 'Medium Blink'),
	// 	new Options(4, 'Slow Blink')
	// ];
	optionsSingleColor = [
		new Options(1, 'gaming.lightingProfile.lightingSingleLightingOption.option1.title'),
		new Options(2, 'gaming.lightingProfile.lightingSingleLightingOption.option2.title'),
		new Options(3, 'gaming.lightingProfile.lightingSingleLightingOption.option3.title'),
		new Options(4, 'gaming.lightingProfile.lightingSingleLightingOption.option4.title')
	];

	public imagePath = './../../../../assets/images/gaming/lighting';
	public panelImage1: string;
	public panelImage2: string;

	constructor(
		private gamingLightingService: GamingLightingService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		console.log('id----------------------------------', this.currentProfileId);
		this.isProfileOff = false;
		this.getGamingLightingCapabilities();
		if (this.currentProfileId === 0) {
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
	public getGamingLightingCapabilities() {
		try {
			 if (this.gamingLightingService.isShellAvailable) {
				console.log(this.gamingAllCapabilities.isShellAvailable, '----------------<><>><');
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.updateGetGamingLightingCapabilities(response);
				});
			 }
		} catch (error) {
			console.error(error.message);
		}
	}

	public updateGetGamingLightingCapabilities(response: any) {
		try {
			console.log(`RESPONSE for updateGetGamingLightingCapabilities()`, response);
			if (response !== undefined) {
				if (this.lightingCapabilities === undefined) {
					this.lightingCapabilities = new LightingCapabilities();
				}
				this.profileRGBFeature = response.RGBfeature;
				this.lightingCapabilities = response;
			}
			if (response.LightPanelType.length > 0) {
				if (LocalStorageKey.LightingCapabilities !== undefined) {
					this.commonService.setLocalStorageValue(LocalStorageKey.LightingCapabilities, response);
				}

				console.log(
					'gaming Lighting Capabilities js bridge ------------------------>',
					JSON.stringify(this.lightingCapabilities)
				);
				console.log(
					'led panel type ------------------------------------------',
					this.lightingCapabilities.RGBfeature
				);
				if (response.LedType_Complex.length > 1) {
					this.simpleOrComplex = 2;
				} else if (response.LedType_simple.length > 1) {
					this.simpleOrComplex = 1;
				}
				if (response.RGBfeature === 1 && this.simpleOrComplex === 1) {
					this.dropOptions = response.LedType_simple;

					this.optionsSingleColor = this.optionsSingleColor.filter((obj) =>
						this.dropOptions.includes(obj.id)
					);
					console.log(
						'single color options filtered  ------------------------------------------',
						JSON.stringify(this.optionsSingleColor)
					);
				} else if (response.RGBfeature === 255 || this.simpleOrComplex === 2) {
					this.dropOptions = response.LedType_Complex;
					this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(
						(i) => this.dropOptions.includes(i.value)
					);
					this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(
						(i) => this.dropOptions.includes(i.value)
					);
					console.log(
						'after drop options filter--------------------------------------------------------------------' +
						JSON.stringify(this.lightingEffectData.drop[0].dropOptions)
					);
				}
				const ledRGB = this.lightingCapabilities.RGBfeature;
				if (this.lightingCapabilities.LightPanelType.length > 0) {
					const ledPanel = this.lightingCapabilities.LightPanelType[0];
					const resultImg = this.panelImageData.filter(function (v, i) {
						return v['PanelType'] === ledPanel && v['RGB'] === ledRGB;
					});
					if (resultImg.length > 0) {
						this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
						console.log('image path 1...............................................', this.panelImage1);
					}

					if (this.lightingCapabilities.LightPanelType.length > 1) {
						const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
						const resultImg2 = this.panelImageData.filter(function (v, i) {
							return v['PanelType'] === ledPanel2 && v['RGB'] === ledRGB;
						});
						if (resultImg2.length > 0) {
							this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
						}
					}
				}

				this.getLightingProfileById(this.currentProfileId);
				this.getLightingBrightness();
			} else {
				if (LocalStorageKey.LightingCapabilities !== undefined) {
					response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilities);
				}
				if (response.LightPanelType.length > 0) {
					this.lightingCapabilities = response;
					console.log(
						'gaming Lighting Capabilities js bridge ------------------------>',
						JSON.stringify(this.lightingCapabilities)
					);
					console.log(
						'led panel type ------------------------------------------',
						this.lightingCapabilities.RGBfeature
					);
					if (response.LedType_Complex.length > 1) {
						this.simpleOrComplex = 2;
					} else if (response.LedType_simple.length > 1) {
						this.simpleOrComplex = 1;
					}
					if (response.RGBfeature === 1 && this.simpleOrComplex === 1) {
						this.dropOptions = response.LedType_simple;

						this.optionsSingleColor = this.optionsSingleColor.filter((obj) =>
							this.dropOptions.includes(obj.id)
						);
						console.log(
							'single color options filtered  ------------------------------------------',
							JSON.stringify(this.optionsSingleColor)
						);
					} else if (response.RGBfeature === 255 || this.simpleOrComplex === 2) {
						this.dropOptions = response.LedType_Complex;
						this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
						this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
						console.log(
							'after drop options filter--------------------------------------------------------------------' +
							JSON.stringify(this.lightingEffectData.drop[0].dropOptions)
						);
					}
					const ledRGB = this.lightingCapabilities.RGBfeature;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						const ledPanel = this.lightingCapabilities.LightPanelType[0];
						const resultImg = this.panelImageData.filter(function (v, i) {
							return v['PanelType'] === ledPanel && v['RGB'] === ledRGB;
						});
						if (resultImg.length > 0) {
							this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
							console.log('image path 1...............................................', this.panelImage1);
						}

						if (this.lightingCapabilities.LightPanelType.length > 1) {
							const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
							const resultImg2 = this.panelImageData.filter(function (v, i) {
								return v['PanelType'] === ledPanel2 && v['RGB'] === ledRGB;
							});
							if (resultImg2.length > 0) {
								this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
							}
						}
					}
				}
			}
		} catch (err) {
			console.log(`ERROR in updateGetGamingLightingCapabilities()`, err);
		}
	}
	public optionChangedRGBTop($event, item) {
		console.log('event raised for color effect top RGB-------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		if (this.lightingCapabilities.RGBfeature === 255) {
			if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
				this.showHideOverlay = true;
			} else {
				this.showHideOverlay = false;
			}
			if ($event.value === LightEffectComplexType.Breath || $event.value === LightEffectComplexType.Wave) {
				this.enableBrightCondition = true;
			} else {
				this.enableBrightCondition = false;
			}
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event.value;
		console.log(
			'setLightingProfileEffectColor arguments--------------------------------------------------------->',
			JSON.stringify(this.lightingProfileEffectColorNUmber)
		);
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					console.log('setLightingProfileEffectColor top------------------------>', JSON.stringify(response));

					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileEffectColorTop !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileEffectColorTop, response);
						}
						if (response.lightInfo.length > 0) {
							if (this.lightingCapabilities.LedType_Complex.length > 0 && this.simpleOrComplex == 2) {
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								//this.inHex1 = response.lightInfo[0].lightColor;
								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
									if (this.lightingCapabilities.RGBfeature === 255) {
										if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (this.sideSelectedValue === LightEffectComplexType.Breath || this.sideSelectedValue === LightEffectComplexType.Wave) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
									}
									const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
										response.lightInfo[1].lightEffectType
									);
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
								}
							}
						}

						console.log(
							'setLightingProfileEffectColor top-------cache: ',
							JSON.stringify(
								this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColorTop)
							)
						);
					} else {
						if (LocalStorageKey.LightingProfileEffectColorTop !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColorTop);
						}
						if (response.lightInfo.length > 0) {
							if (this.lightingCapabilities.LedType_Complex.length > 0 && this.simpleOrComplex == 2) {
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								//this.inHex1 = response.lightInfo[0].lightColor;
								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
									if (this.lightingCapabilities.RGBfeature === 255) {
										if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (this.sideSelectedValue === LightEffectComplexType.Breath || this.sideSelectedValue === LightEffectComplexType.Wave) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
									}
									const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
										response.lightInfo[1].lightEffectType
									);
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					}
				});
		}
	}
	public optionChangedRGBSide($event, item) {
		console.log('event raised for color effect side RGB-------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		if (this.lightingCapabilities.RGBfeature === 255) {
			if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
				this.showHideOverlaySide = true;

			} else {
				this.showHideOverlaySide = false;

			}
			if ($event.value === LightEffectComplexType.Breath || $event.value === LightEffectComplexType.Wave) {
				this.enableBrightConditionside = true;

			} else {
				this.enableBrightConditionside = false;

			}
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[1];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event.value;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					console.log(
						'setLightingProfileEffectColor side------------------------>',
						JSON.stringify(response)
					);
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileEffectColorSide !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileEffectColorSide, response);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (this.lightingCapabilities.RGBfeature === 255) {
								if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (this.frontSelectedValue === LightEffectComplexType.Breath || this.frontSelectedValue === LightEffectComplexType.Wave) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}
							}
							//this.inHex1 = response.lightInfo[0].lightColor;
							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
								//this.inHex2 = response.lightInfo[1].lightColor;
							}
						}

						console.log(
							'setLightingProfileEffectColor side-------cache: ',
							JSON.stringify(
								this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColorSide)
							)
						);
					} else {
						if (LocalStorageKey.LightingProfileEffectColorSide !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColorSide);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (this.lightingCapabilities.RGBfeature === 255) {
								if ($event.value === LightEffectComplexType.Wave || $event.value === LightEffectComplexType.Smooth || $event.value === LightEffectComplexType.CPU_thermal || $event.value === LightEffectComplexType.CPU_frequency) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (this.frontSelectedValue === LightEffectComplexType.Breath || this.frontSelectedValue === LightEffectComplexType.Wave) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}
							}

							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;

							}
						}
					}
				});
		}
	}
	changeSingleCoorEffect($event) {
		this.selectedSingleColorOptionId = $event;
		console.log('single color option change fired------------------------------', $event);
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event;
		console.log(
			'setLightingProfileEffectColor arguments------------------------>',
			JSON.stringify(this.lightingProfileEffectColorNUmber)
		);
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					console.log(
						'setLightingProfileEffectColor side------------------------>',
						JSON.stringify(response)
					);

				});
		}
	}

	setDefaultProfile(currentProfileId) {
		try {
			if (currentProfileId !== undefined) {
				this.isOff = Number(currentProfileId);
			}

			console.log('in profile click event....................................', this.isOff);
			if (this.isOff === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
				this.currentProfileId = this.isOff;
				console.log('in profile click event....................................', this.isOff, this.currentProfileId);
				if (this.gamingLightingService.isShellAvailable) {
					this.gamingLightingService
						.setLightingDefaultProfileById(this.currentProfileId)
						.then((response: any) => {
							console.log(
								'setLightingDefaultProfileById------------response---------------->',
								JSON.stringify(response)
							);
							if (response.didSuccess) {
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									this.commonService.setLocalStorageValue(LocalStorageKey.LightingSetDefaultProfile, response);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;

									if (this.lightingCapabilities.RGBfeature === 1) {
										console.log(
											'selectedSingleColorOptionId------------single color---------------->',
											JSON.stringify(response.lightInfo[0].lightEffectType)
										);
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											console.log(
												'setLightingDefaultProfileById------------ --------------------------------------------------------->',
												JSON.stringify(response.lightInfo[0].lightEffectType)
											);
											this.frontSelectedValue = response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue === 8 ||
												this.frontSelectedValue === 32 ||
												this.frontSelectedValue === 64 ||
												this.frontSelectedValue === 128
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (this.frontSelectedValue === 4 || this.frontSelectedValue === 8) {
												this.enableBrightCondition = true;
											} else {
												this.enableBrightCondition = false;
											}
											const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
												response.lightInfo[0].lightEffectType
											);
											this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
											// this.lightingEffectData.drop[0].curSelected =
											// 	response.lightInfo[0].lightEffectType;
											this.inHex1 = response.lightInfo[0].lightColor;
											if (response.lightInfo.length > 1) {
												this.sideSelectedValue = response.lightInfo[1].lightEffectType;
												if (
													this.sideSelectedValue === 8 ||
													this.sideSelectedValue === 32 ||
													this.sideSelectedValue === 64 ||
													this.sideSelectedValue === 128
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (this.sideSelectedValue === 4 || this.sideSelectedValue === 8) {
													this.enableBrightConditionside = true;
												} else {
													this.enableBrightConditionside = false;
												}
												const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
													response.lightInfo[1].lightEffectType
												);
												this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
												this.inHex2 = response.lightInfo[1].lightColor;
												this.lightingEffectData.drop[1].curSelected =
													response.lightInfo[1].lightEffectType;
											}
										}
									}
								}
								console.log(
									'setLightingDefaultProfileById---------cache---------->',
									JSON.stringify(
										this.commonService.getLocalStorageValue(LocalStorageKey.LightingSetDefaultProfile)
									)
								);
							}
							else {
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingSetDefaultProfile);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;
									if (this.lightingCapabilities.RGBfeature === 1) {
										console.log(
											'selectedSingleColorOptionId------------single color---------------->',
											JSON.stringify(response.lightInfo[0].lightEffectType)
										);
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											console.log(
												'setLightingDefaultProfileById------------ --------------------------------------------------------->',
												JSON.stringify(response.lightInfo[0].lightEffectType)
											);
											this.frontSelectedValue = response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue === 8 ||
												this.frontSelectedValue === 32 ||
												this.frontSelectedValue === 64 ||
												this.frontSelectedValue === 128
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (this.frontSelectedValue === 4 || this.frontSelectedValue === 8) {
												this.enableBrightCondition = true;
											} else {
												this.enableBrightCondition = false;
											}
											const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
												response.lightInfo[0].lightEffectType
											);
											this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
											this.lightingEffectData.drop[0].curSelected =
												response.lightInfo[0].lightEffectType;
											this.inHex1 = response.lightInfo[0].lightColor;
											if (response.lightInfo.length > 1) {
												this.sideSelectedValue = response.lightInfo[1].lightEffectType;
												if (
													this.sideSelectedValue === 8 ||
													this.sideSelectedValue === 32 ||
													this.sideSelectedValue === 64 ||
													this.sideSelectedValue === 128
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (this.sideSelectedValue === 4 || this.sideSelectedValue === 8) {
													this.enableBrightConditionside = true;
												} else {
													this.enableBrightConditionside = false;
												}
												const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
													response.lightInfo[1].lightEffectType
												);
												this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
												this.inHex2 = response.lightInfo[1].lightColor;
												this.lightingEffectData.drop[1].curSelected =
													response.lightInfo[1].lightEffectType;
											}
										}
									}

								} else {
									this.isProfileOff = false;
								}
							}
						});
				}
			}
			console.log('fired.....');
		} catch (error) {
			console.error(error.message);
		}
	}
	setLightingBrightness(event) {
		try {
			//event = event + 1;
			console.log('in eventval--------------------------------' + event);
			if (
				this.frontSelectedValue !== 8 ||
				this.frontSelectedValue !== 4 ||
				this.sideSelectedValue !== null ||
				this.sideSelectedValue !== 8 ||
				this.sideSelectedValue !== 4
			) {
				if (this.gamingLightingService.isShellAvailable) {
					this.gamingLightingService.setLightingProfileBrightness(event).then((response: any) => {
						this.didSuccess = response.didSuccess;
						this.brightness = response.brightness;
						//this.didSuccess = false;
						console.log(
							'setLightingProfileBrightness---------------------------->',
							JSON.stringify(response)
						);

						if (!this.didSuccess) {
							this.getLightingBrightness();
						} else {
							if (LocalStorageKey.ProfileBrightness !== undefined) {
								this.commonService.setLocalStorageValue(LocalStorageKey.ProfileBrightness, this.brightness);
							}
							this.getLightingBrightness();
						}
					});
				}
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightingBrightness() {
		try {
			if (LocalStorageKey.ProfileBrightness !== undefined) {
				this.profileBrightness = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileBrightness) || 0;
			}
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
					console.log(
						'getLightingProfileById------------response---------------->',
						JSON.stringify(response)
					);
					if (response.didSuccess) {
						console.log('DID SUCCESS,----------------------------------------');
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}


						this.currentProfileId = response.profileId;
						this.currentProfile = response.profileId;
						this.profileBrightness = response.brightness;
						if (response.lightInfo.length > 0) {
							if (this.lightingCapabilities.RGBfeature === 1) {
								console.log(
									'selectedSingleColorOptionId------------single color---------------->',
									JSON.stringify(response.lightInfo[0].lightEffectType)
								);

								if (this.lightingCapabilities.LedType_Complex.length > 1) {
									this.simpleOrComplex = 2;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								} else if (this.lightingCapabilities.LedType_simple.length > 1) {
									this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
								}

							} else {
								//	this.dropDataChanges.topdata = response.lightInfo[0].lightEffectType;
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;

								if (this.frontSelectedValue === LightEffectComplexType.Wave || this.frontSelectedValue === LightEffectComplexType.Smooth || this.frontSelectedValue === LightEffectComplexType.CPU_thermal || this.frontSelectedValue === LightEffectComplexType.CPU_frequency) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (this.frontSelectedValue === LightEffectComplexType.Breath || this.frontSelectedValue === LightEffectComplexType.Wave) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}

								const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
									response.lightInfo[0].lightEffectType
								);
								this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;

								console.log(
									'sateesh------------------------------------------- ---------------->',
									JSON.stringify(lightEffectRGBOptionNameA)
								);
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								this.inHex1 = response.lightInfo[0].lightColor;

								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
										response.lightInfo[1].lightEffectType
									);
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
									if (this.sideSelectedValue === LightEffectComplexType.Wave || this.sideSelectedValue === LightEffectComplexType.Smooth || this.sideSelectedValue === LightEffectComplexType.CPU_thermal || this.sideSelectedValue === LightEffectComplexType.CPU_frequency) {
										this.showHideOverlaySide = true;
									} else {
										this.showHideOverlaySide = false;
									}
									if (this.sideSelectedValue === LightEffectComplexType.Breath || this.sideSelectedValue === LightEffectComplexType.Wave) {
										this.enableBrightConditionside = true;
									} else {
										this.enableBrightConditionside = false;
									}
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
									console.log('in hex2-------------------------------------', this.inHex2);
								}
							}
						}
						//	console.log('getLightingProfileById----------------cache---------->', JSON.stringify(this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById)));
					} else {

						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById) || 0;
						}
						if (response !== undefined) {
							this.currentProfileId = response.profileId;
							this.currentProfile = response.profileId;
							this.profileBrightness = response.brightness;
							if (response.lightInfo.length > 0) {
								if (this.lightingCapabilities.RGBfeature === 1) {
									console.log(
										'selectedSingleColorOptionId------------single color---------------->',
										JSON.stringify(response.lightInfo[0].lightEffectType)
									);

									if (this.lightingCapabilities.LedType_Complex.length > 1) {
										this.simpleOrComplex = 2;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									} else if (this.lightingCapabilities.LedType_simple.length > 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									}

								} else {
									//	this.dropDataChanges.topdata = response.lightInfo[0].lightEffectType;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;

									if (this.frontSelectedValue === LightEffectComplexType.Wave || this.frontSelectedValue === LightEffectComplexType.Smooth || this.frontSelectedValue === LightEffectComplexType.CPU_thermal || this.frontSelectedValue === LightEffectComplexType.CPU_frequency) {
										this.showHideOverlay = true;
									} else {
										this.showHideOverlay = false;
									}
									if (this.frontSelectedValue === LightEffectComplexType.Breath || this.frontSelectedValue === LightEffectComplexType.Wave) {
										this.enableBrightCondition = true;
									} else {
										this.enableBrightCondition = false;
									}

									const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
										response.lightInfo[0].lightEffectType
									);
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;

									console.log(
										'sateesh------------------------------------------- ---------------->',
										JSON.stringify(lightEffectRGBOptionNameA)
									);
									this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
									this.inHex1 = response.lightInfo[0].lightColor;

									if (response.lightInfo.length > 1) {
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
										const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
											response.lightInfo[1].lightEffectType
										);
										this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
										if (this.sideSelectedValue === LightEffectComplexType.Wave || this.sideSelectedValue === LightEffectComplexType.Smooth || this.sideSelectedValue === LightEffectComplexType.CPU_thermal || this.sideSelectedValue === LightEffectComplexType.CPU_frequency) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (this.sideSelectedValue === LightEffectComplexType.Breath || this.sideSelectedValue === LightEffectComplexType.Wave) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
										this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
										this.inHex2 = response.lightInfo[1].lightColor;
										console.log('in hex2-------------------------------------', this.inHex2);
									}
								}
							}
						} else {
							this.isProfileOff = false;
						}
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public getLightEffectOptionName(optionValue: any) {
		const result = this.lightingEffectData.drop[0].dropOptions.filter((obj) => {
			return obj.value === optionValue;
		});
		return result;
	}

	public setLightingProfileId(event) {
		try {
			this.isOff = Number(event.target.value);
			this.currentProfileId = this.isOff;
			if (this.isOff === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
			}
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.setLightingProfileId(1, this.isOff).then((response: any) => {
					console.log('setLightingProfileId------------response---------------->', JSON.stringify(response));
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						if (LocalStorageKey.ProfileId !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
						}

						if (response.profileId > 0) {
							if (this.lightingCapabilities.RGBfeature === 1) {
								console.log(
									'selectedSingleColorOptionId------------single color---------------->',
									JSON.stringify(response.lightInfo[0].lightEffectType)
								);
								//	this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
								if (this.lightingCapabilities.LedType_Complex.length > 1) {
									this.simpleOrComplex = 2;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								} else if (this.lightingCapabilities.LedType_simple.length > 1) {
									this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
								}
							} else {
								if (response.lightInfo.length > 0) {
									this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									if (this.frontSelectedValue === LightEffectComplexType.Wave || this.frontSelectedValue === LightEffectComplexType.Smooth || this.frontSelectedValue === LightEffectComplexType.CPU_thermal || this.frontSelectedValue === LightEffectComplexType.CPU_frequency) {
										this.showHideOverlay = true;
									} else {
										this.showHideOverlay = false;
									}
									if (this.frontSelectedValue === 4 || this.frontSelectedValue === 8) {
										this.enableBrightCondition = true;
									} else {
										this.enableBrightCondition = false;
									}
									const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
										response.lightInfo[0].lightEffectType
									);
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
									this.inHex1 = response.lightInfo[0].lightColor;
									if (response.lightInfo.length > 1) {
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
										const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
											response.lightInfo[1].lightEffectType
										);
										this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
										if (this.sideSelectedValue === LightEffectComplexType.Wave || this.sideSelectedValue === LightEffectComplexType.Smooth || this.sideSelectedValue === LightEffectComplexType.CPU_thermal || this.sideSelectedValue === LightEffectComplexType.CPU_frequency) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (this.sideSelectedValue === 4 || this.sideSelectedValue === 8) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
										this.inHex2 = response.lightInfo[1].lightColor;
										this.lightingEffectData.drop[1].curSelected =
											response.lightInfo[1].lightEffectType;
									}
								}
							}
							this.profileBrightness = response.brightness;
							// end of set functionality
						}
						console.log('setLightingProfileId-----------cache------------------>', JSON.stringify(this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById)));

					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById);
						}
						if (response !== undefined) {
							if (response.profileId > 0) {
								if (this.lightingCapabilities.RGBfeature === 1) {
									console.log(
										'selectedSingleColorOptionId------------single color---------------->',
										JSON.stringify(response.lightInfo[0].lightEffectType)
									);
									//	this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									if (this.lightingCapabilities.LedType_Complex.length > 1) {
										this.simpleOrComplex = 2;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									} else if (this.lightingCapabilities.LedType_simple.length > 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									}
								} else {
									if (response.lightInfo.length > 0) {
										this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										if (this.frontSelectedValue === LightEffectComplexType.Wave || this.frontSelectedValue === LightEffectComplexType.Smooth || this.frontSelectedValue === LightEffectComplexType.CPU_thermal || this.frontSelectedValue === LightEffectComplexType.CPU_frequency) {
											this.showHideOverlay = true;
										} else {
											this.showHideOverlay = false;
										}
										if (this.frontSelectedValue === 4 || this.frontSelectedValue === 8) {
											this.enableBrightCondition = true;
										} else {
											this.enableBrightCondition = false;
										}
										const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
											response.lightInfo[0].lightEffectType
										);
										this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
										this.inHex1 = response.lightInfo[0].lightColor;
										if (response.lightInfo.length > 1) {
											this.sideSelectedValue = response.lightInfo[1].lightEffectType;
											const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
												response.lightInfo[1].lightEffectType
											);
											this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
											if (this.sideSelectedValue === LightEffectComplexType.Wave || this.sideSelectedValue === LightEffectComplexType.Smooth || this.sideSelectedValue === LightEffectComplexType.CPU_thermal || this.sideSelectedValue === LightEffectComplexType.CPU_frequency) {
												this.showHideOverlaySide = true;
											} else {
												this.showHideOverlaySide = false;
											}
											if (this.sideSelectedValue === 4 || this.sideSelectedValue === 8) {
												this.enableBrightConditionside = true;
											} else {
												this.enableBrightConditionside = false;
											}
											this.inHex2 = response.lightInfo[1].lightColor;
											this.lightingEffectData.drop[1].curSelected =
												response.lightInfo[1].lightEffectType;
										}
									}
								}
								this.profileBrightness = response.brightness;
								// end of set functionality
							}
						}
					}
				});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public setLightingProfileEffectColor() {
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					console.log('setLightingProfileEffectColor ------------------------>', JSON.stringify(response));
				});
		}
	}
	colorEffectChangedFront($event) {
		this.applyBtnStatus1 = 'loading';
		$event = $event.substring(1);
		console.log('set color pallet color effect front------------------------>', JSON.stringify($event));

		if (this.lightingProfileEffectColorString === undefined) {
			this.lightingProfileEffectColorString = new LightingProfileEffectColorString();
		}
		console.log('current profile id', this.currentProfileId);
		this.lightingProfileEffectColorString.profileId = this.currentProfileId;
		this.lightingProfileEffectColorString.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorString.lightColor = $event;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorString)
				.then((response: any) => {
					console.log(
						'set color pallet color effect front response------------------------>',
						JSON.stringify(response)
					);

					if (response.didSuccess) {
						this.inHex1 = $event;
						this.applyBtnStatus1 = 'applied';

						//	this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileEffectColor, response);
						/*	console.log(
								'set color pallet color effect front response----------cache---------->',
								JSON.stringify(
									this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColor)
								)
							);*/
					}
					/* else {
						response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileEffectColor);
					}*/
				});
		}
	}
	colorEffectChangedSide($event) {
		this.applyBtnStatus2 = 'loading';
		$event = $event.substring(1);
		console.log('set color pallet color effect side ------------------------>', JSON.stringify($event));
		if (this.lightingProfileEffectColorString === undefined) {
			this.lightingProfileEffectColorString = new LightingProfileEffectColorString();
		}
		console.log('current profile id', this.currentProfileId);
		this.lightingProfileEffectColorString.profileId = this.currentProfileId;
		this.lightingProfileEffectColorString.lightPanelType = this.lightingCapabilities.LightPanelType[1];
		this.lightingProfileEffectColorString.lightColor = $event;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorString)
				.then((response: any) => {
					console.log(
						'set color pallet color effect side response------------------------>',
						JSON.stringify(response)
					);

					if (response.didSuccess) {
						this.inHex2 = $event;
						this.applyBtnStatus2 = 'applied';

					}
				});
		}
	}
	colorChangedFront($event) {
		console.log('colorChangedFront ------------------------>', JSON.stringify($event));
		this.inHex1 = $event.hex;
	}
	colorChangedSide($event) {
		console.log('colorChangedSide------------------------>', JSON.stringify($event));
		this.inHex2 = $event.hex;
	}
}

import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LightingCapabilities } from 'src/app/data-models/gaming/lighting-capabilities';
import { LightingProfile } from 'src/app/data-models/gaming/lighting-profile';
import {
	LightingProfileEffectColorNUmber,
	LightingProfileEffectColorString
} from 'src/app/data-models/gaming/lighting-profile-effect-color';
import { isUndefined } from 'util';
import { Options } from 'src/app/data-models/gaming/lighting-options';
import { LightEffectComplexType } from 'src/app/enums/light-effect-complex-type';
import { LightEffectRGBFeature, LightEffectSingleOrComplex } from 'src/app/enums/light-effect-rgbfeature';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-ui-lighting-profile',
	templateUrl: './ui-lighting-profile.component.html',
	styleUrls: [ './ui-lighting-profile.component.scss' ]
})
export class UiLightingProfileComponent implements OnInit {
	@Input() currentProfileId: number;
	public lightingCapabilities: any;
	public profileBrightness: any;
	public profileRGBFeature = 0;
	public options: any;
	public effectData: any;
	public isProfileOff = true;
	public currentProfile = 0;
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
	public enumLightingRGBFeature = LightEffectRGBFeature;
	public enumLightEffectSingleOrComplex = LightEffectSingleOrComplex;
	public inHex1: any;
	public inHex2: any;
	public applyBtnStatus1: String = 'apply';
	public applyBtnStatus2: String = 'apply';
	public showBrightnessSlider = false;
	public showHideOverlay = false;
	public showHideOverlaySide = false;
	public selectedSingleColorOptionId: number;
	public enableBrightCondition = false;
	public enableBrightConditionside = false;
	public apply: 'gaming.lightingProfile.effect.apply.title | translate';
	public lightEffectRGBOptionName: string;
	public lightEffectRGBOptionNameSide: string;
	public simpleOrComplex: number;
	public showHideDescription = false;
	public lightingEffectData = {
		drop: [
			{
				curSelected: 1,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						id: 'lighting_front_effect_off',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option8.title',
						metricitem: 'lighting_front_effect_off',
						value: 268435456
					},
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						id: 'lighting_front_effect_on',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option1.title',
						metricitem: 'lighting_front_effect_on',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						id: 'lighting_front_effect_flicker',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option2.title',
						metricitem: 'lighting_front_effect_flicker',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						id: 'lighting_front_effect_breath',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option3.title',
						metricitem: 'lighting_front_effect_breath',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						id: 'lighting_front_effect_wave',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option4.title',
						metricitem: 'lighting_front_effect_wave',
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
						id: 'lighting_front_effect_smooth',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option5.title',
						metricitem: 'lighting_front_effect_smooth',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						id: 'lighting_front_effect_cpu_temperature',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option6.title',
						metricitem: 'lighting_front_effect_cpu_temperature',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						id: 'lighting_front_effect_cpu_utilization',
						label: 'gaming.lightingProfile.lightingeffectnarrator.option7.title',
						metricitem: 'lighting_front_effect_cpu_utilization',
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
						id: 'lighting_side_effect_off',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option8.title',
						metricitem: 'lighting_side_effect_off',
						value: 268435456
					},
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						id: 'lighting_side_effect_on',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option1.title',
						metricitem: 'lighting_side_effect_on',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						id: 'lighting_side_effect_flicker',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option2.title',
						metricitem: 'lighting_side_effect_flicker',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						id: 'lighting_side_effect_breath',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option3.title',
						metricitem: 'lighting_side_effect_breath',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						id: 'lighting_side_effect_wave',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option4.title',
						metricitem: 'lighting_side_effect_wave',
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
						id: 'lighting_side_effect_smooth',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option5.title',
						metricitem: 'lighting_side_effect_smooth',
						value: 32
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						id: 'lighting_side_effect_cpu_temperature',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option6.title',
						metricitem: 'lighting_side_effect_cpu_temperature',
						value: 64
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						id: 'lighting_side_effect_cpu_utilization',
						label: 'gaming.lightingProfile.lightingeffectsidenarrator.option7.title',
						metricitem: 'lighting_side_effect_cpu_utilization',
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
	optionsSingleColor = [
		new Options(1, 'gaming.lightingProfile.lightingSingleLightingOption.option1.title', "'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option1.title'"),
		new Options(2, 'gaming.lightingProfile.lightingSingleLightingOption.option2.title',"'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option2.title'"),
		new Options(3, 'gaming.lightingProfile.lightingSingleLightingOption.option3.title', "'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option3.title'"),
		new Options(4, 'gaming.lightingProfile.lightingSingleLightingOption.option4.title', "'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option4.title'")
	];

	public imagePath = './../../../../assets/images/gaming/lighting';
	public panelImage1: string;
	public panelImage2: string;
	defaultLanguage: any;
	constructor(
		private gamingLightingService: GamingLightingService,
		private gamingAllCapabilities: GamingAllCapabilitiesService,
		private commonService: CommonService,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
		});
		this.isProfileOff = false;
		if (LocalStorageKey.LightingCapabilities !== undefined) {
			let response: any;
			response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilities);
			if (response !== undefined) {
				this.getCacheLightingCapabilities(response);
			}
		}
		if (LocalStorageKey.LightingProfileById !== undefined) {
			const res = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById);
			this.getLightingBrightness();
			this.getLightingProfileByIdFromcache(res);
			this.getGamingLightingCapabilities();
		}
		if (this.currentProfileId === 0) {
			this.isProfileOff = true;
		}
	}
	public getGamingLightingCapabilities() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.updateGetGamingLightingCapabilities(response);
				});
			}
		} catch (error) {}
	}
	public getCacheLightingCapabilities(response) {
		try {
			if (response && response.LightPanelType && response.LightPanelType.length > 0) {
				this.profileRGBFeature = response.RGBfeature;
				this.lightingCapabilities = response;
				if (response.BrightAdjustLevel === 0) {
					this.showBrightnessSlider = false;
				} else {
					this.showBrightnessSlider = true;
				}
				if (response.LedType_Complex.length > 1) {
					this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
				} else if (response.LedType_simple.length > 1) {
					this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Simple;
				}
				if (
					response.RGBfeature === this.enumLightingRGBFeature.Simple &&
					this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Simple
				) {
					this.dropOptions = response.LedType_simple;

					this.optionsSingleColor = this.optionsSingleColor.filter((obj) =>
						this.dropOptions.includes(obj.id)
					);
				} else if (
					response.RGBfeature === this.enumLightingRGBFeature.Complex ||
					this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
				) {
					this.dropOptions = response.LedType_Complex;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
					}
					if (this.lightingCapabilities.LightPanelType.length > 1) {
						this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
					}
					if (
						this.lightingCapabilities.LightPanelType.length === 1 &&
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
					) {
						this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
					} else if (
						this.lightingCapabilities.LightPanelType.length > 1 &&
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
					) {
						this.simpleOrComplex = 3;
					}
				}
				const ledRGB = this.lightingCapabilities.RGBfeature;
				if (this.lightingCapabilities.LightPanelType.length > 0) {
					const ledPanel = this.lightingCapabilities.LightPanelType[0];
					const resultImg = this.panelImageData.filter(function(v, i) {
						return v.PanelType === ledPanel && v.RGB === ledRGB;
					});
					if (resultImg.length > 0) {
						this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
					}

					if (this.lightingCapabilities.LightPanelType.length > 1) {
						const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
						const resultImg2 = this.panelImageData.filter(function(v, i) {
							return v.PanelType === ledPanel2 && v.RGB === ledRGB;
						});
						if (resultImg2.length > 0) {
							this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
						}
					}
				}
			}
		} catch (error) {}
	}
	public getLightingProfileByIdFromcache(response: any) {
		try {
			if (response !== undefined) {
				this.currentProfile = this.currentProfileId;
				// this.profileBrightness = response.brightness;
				if (response.lightInfo !== null && response.lightInfo.length > 0) {
					if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple) {
						if (this.lightingCapabilities.LedType_Complex.length > 1) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.sideSelectedValue = response.lightInfo[1].lightEffectType;
						} else if (this.lightingCapabilities.LedType_simple.length > 1) {
							this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
						}
					} else {
						this.frontSelectedValue = response.lightInfo[0].lightEffectType;
						if (
							this.frontSelectedValue === LightEffectComplexType.Wave ||
							this.frontSelectedValue === LightEffectComplexType.Smooth ||
							this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
							this.frontSelectedValue === LightEffectComplexType.CPU_frequency
						) {
							this.showHideOverlay = true;
						} else {
							this.showHideOverlay = false;
						}
						if (
							this.frontSelectedValue === LightEffectComplexType.Breath ||
							this.frontSelectedValue === LightEffectComplexType.Wave
						) {
							this.enableBrightCondition = true;
						} else {
							this.enableBrightCondition = false;
						}

						const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
							response.lightInfo[0].lightEffectType
						);
						this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
						this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
						this.inHex1 = response.lightInfo[0].lightColor;

						if (response.lightInfo.length > 1) {
							this.sideSelectedValue = response.lightInfo[1].lightEffectType;
							const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
								response.lightInfo[1].lightEffectType
							);
							this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
							if (
								this.sideSelectedValue === LightEffectComplexType.Wave ||
								this.sideSelectedValue === LightEffectComplexType.Smooth ||
								this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
								this.sideSelectedValue === LightEffectComplexType.CPU_frequency
							) {
								this.showHideOverlaySide = true;
							} else {
								this.showHideOverlaySide = false;
							}
							if (
								this.sideSelectedValue === LightEffectComplexType.Breath ||
								this.sideSelectedValue === LightEffectComplexType.Wave
							) {
								this.enableBrightConditionside = true;
							} else {
								this.enableBrightConditionside = false;
							}
							this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
							this.inHex2 = response.lightInfo[1].lightColor;
						}
					}
				}
			}
		} catch (err) {}
	}
	public updateGetGamingLightingCapabilities(response: any) {
		try {
			if (response) {
				this.profileRGBFeature = response.RGBfeature;
				this.lightingCapabilities = response;
				if (response.BrightAdjustLevel === 0) {
					this.showBrightnessSlider = false;
				} else {
					this.showBrightnessSlider = true;
				}
				if (
					response.LightPanelType.length !== 0 ||
					response.LedType_Complex.length !== 0 ||
					response.LedType_simple.length !== 0 ||
					response.BrightAdjustLevel !== undefined ||
					response.RGBfeature !== null ||
					response.RGBfeature !== undefined ||
					response.BrightAdjustLevel !== null
				) {
					if (LocalStorageKey.LightingCapabilities !== undefined) {
						this.commonService.setLocalStorageValue(LocalStorageKey.LightingCapabilities, response);
					}
				}
				if (response.LedType_Complex.length > 1) {
					this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
				} else if (response.LedType_simple.length > 1) {
					this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Simple;
				}
				if (
					response.RGBfeature === this.enumLightingRGBFeature.Simple &&
					this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Simple
				) {
					this.dropOptions = response.LedType_simple;

					this.optionsSingleColor = this.optionsSingleColor.filter((obj) =>
						this.dropOptions.includes(obj.id)
					);
				} else if (
					response.RGBfeature === this.enumLightingRGBFeature.Complex ||
					this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
				) {
					this.dropOptions = response.LedType_Complex;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
					}
					if (this.lightingCapabilities.LightPanelType.length > 1) {
						this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(
							(i) => this.dropOptions.includes(i.value)
						);
					}
					if (
						this.lightingCapabilities.LightPanelType.length === 1 &&
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
					) {
						this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
					} else if (
						this.lightingCapabilities.LightPanelType.length > 1 &&
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
					) {
						this.simpleOrComplex = 3;
					}
				}
				const ledRGB = this.lightingCapabilities.RGBfeature;
				if (this.lightingCapabilities.LightPanelType.length > 0) {
					const ledPanel = this.lightingCapabilities.LightPanelType[0];
					const resultImg = this.panelImageData.filter(function(v, i) {
						return v.PanelType === ledPanel && v.RGB === ledRGB;
					});
					if (resultImg.length > 0) {
						this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
					}

					if (this.lightingCapabilities.LightPanelType.length > 1) {
						const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
						const resultImg2 = this.panelImageData.filter(function(v, i) {
							return v.PanelType === ledPanel2 && v.RGB === ledRGB;
						});
						if (resultImg2.length > 0) {
							this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
						}
					}
				}

				this.getLightingProfileById(this.currentProfileId);
				// this.getLightingBrightness();
			} else {
				if (LocalStorageKey.LightingCapabilities !== undefined) {
					response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingCapabilities);
				}
				if (response.LightPanelType.length > 0) {
					this.profileRGBFeature = response.RGBfeature;
					this.lightingCapabilities = response;
					if (response.LedType_Complex.length > 1) {
						this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
					} else if (response.LedType_simple.length > 1) {
						this.simpleOrComplex = 1;
					}
					if (
						response.RGBfeature === this.enumLightingRGBFeature.Simple &&
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Simple
					) {
						this.dropOptions = response.LedType_simple;

						this.optionsSingleColor = this.optionsSingleColor.filter((obj) =>
							this.dropOptions.includes(obj.id)
						);
					} else if (
						response.RGBfeature === this.enumLightingRGBFeature.Complex ||
						this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
					) {
						this.dropOptions = response.LedType_Complex;
						if (this.lightingCapabilities.LightPanelType.length > 0) {
							this.lightingEffectData.drop[0].dropOptions = this.lightingEffectData.drop[0].dropOptions.filter(
								(i) => this.dropOptions.includes(i.value)
							);
						}
						if (this.lightingCapabilities.LightPanelType.length > 1) {
							this.lightingEffectData.drop[1].dropOptions = this.lightingEffectData.drop[1].dropOptions.filter(
								(i) => this.dropOptions.includes(i.value)
							);
						}
						if (
							this.lightingCapabilities.LightPanelType.length === 1 &&
							this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
						) {
							this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
						} else if (
							this.lightingCapabilities.LightPanelType.length > 1 &&
							this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
						) {
							this.simpleOrComplex = 3;
						}
					}
					const ledRGB = this.lightingCapabilities.RGBfeature;
					if (this.lightingCapabilities.LightPanelType.length > 0) {
						const ledPanel = this.lightingCapabilities.LightPanelType[0];
						const resultImg = this.panelImageData.filter(function(v, i) {
							return v.PanelType === ledPanel && v.RGB === ledRGB;
						});
						if (resultImg.length > 0) {
							this.panelImage1 = this.imagePath + '/' + resultImg[0].PanelImage;
						}
						if (this.lightingCapabilities.LightPanelType.length > 1) {
							const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
							const resultImg2 = this.panelImageData.filter(function(v, i) {
								return v.PanelType === ledPanel2 && v.RGB === ledRGB;
							});
							if (resultImg2.length > 0) {
								this.panelImage2 = this.imagePath + '/' + resultImg2[0].PanelImage;
							}
						}
					}
				}
			}
		} catch (err) {}
	}
	public optionChangedRGBTop($event, item) {
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
			if (
				$event.value === LightEffectComplexType.Wave ||
				$event.value === LightEffectComplexType.Smooth ||
				$event.value === LightEffectComplexType.CPU_thermal ||
				$event.value === LightEffectComplexType.CPU_frequency
			) {
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
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
								this.inHex2 = response.lightInfo[1].lightColor;
								if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
									if (
										$event.value === LightEffectComplexType.Wave ||
										$event.value === LightEffectComplexType.Smooth ||
										$event.value === LightEffectComplexType.CPU_thermal ||
										$event.value === LightEffectComplexType.CPU_frequency
									) {
										this.showHideOverlaySide = true;
									} else {
										this.showHideOverlaySide = false;
									}
									if (
										this.sideSelectedValue === LightEffectComplexType.Breath ||
										this.sideSelectedValue === LightEffectComplexType.Wave
									) {
										this.enableBrightConditionside = true;
									} else {
										this.enableBrightConditionside = false;
									}
								}
								const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
									response.lightInfo[1].lightEffectType
								);
								if (
									this.sideSelectedValue === LightEffectComplexType.Breath ||
									this.sideSelectedValue === LightEffectComplexType.Wave
								) {
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById);
						}
						if (response.lightInfo.length > 0) {
							if (
								this.lightingCapabilities.LedType_Complex.length > 0 &&
								this.simpleOrComplex == this.enumLightEffectSingleOrComplex.Complex
							) {
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
									if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
										if (
											$event.value === LightEffectComplexType.Wave ||
											$event.value === LightEffectComplexType.Smooth ||
											$event.value === LightEffectComplexType.CPU_thermal ||
											$event.value === LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (
											this.sideSelectedValue === LightEffectComplexType.Breath ||
											this.sideSelectedValue === LightEffectComplexType.Wave
										) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
									}
									const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
										response.lightInfo[1].lightEffectType
									);
									if (
										this.sideSelectedValue === LightEffectComplexType.Breath ||
										this.sideSelectedValue === LightEffectComplexType.Wave
									) {
										this.lightEffectRGBOptionName = lightEffectRGBOptionNameB[0].name;
										this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
									}
								}
							}
						}
					}
				});
		}
	}
	public optionChangedRGBSide($event, item) {
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
			if (
				$event.value === LightEffectComplexType.Wave ||
				$event.value === LightEffectComplexType.Smooth ||
				$event.value === LightEffectComplexType.CPU_thermal ||
				$event.value === LightEffectComplexType.CPU_frequency
			) {
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
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
								if (
									$event.value === LightEffectComplexType.Wave ||
									$event.value === LightEffectComplexType.Smooth ||
									$event.value === LightEffectComplexType.CPU_thermal ||
									$event.value === LightEffectComplexType.CPU_frequency
								) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (
									this.frontSelectedValue === LightEffectComplexType.Breath ||
									this.frontSelectedValue === LightEffectComplexType.Wave
								) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}
							}
							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
								const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
									response.lightInfo[1].lightEffectType
								);
								if (
									this.sideSelectedValue === LightEffectComplexType.Breath ||
									this.sideSelectedValue === LightEffectComplexType.Wave
								) {
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
							if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Complex) {
								if (
									$event.value === LightEffectComplexType.Wave ||
									$event.value === LightEffectComplexType.Smooth ||
									$event.value === LightEffectComplexType.CPU_thermal ||
									$event.value === LightEffectComplexType.CPU_frequency
								) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (
									this.frontSelectedValue === LightEffectComplexType.Breath ||
									this.frontSelectedValue === LightEffectComplexType.Wave
								) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}
							}

							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
								const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
									response.lightInfo[1].lightEffectType
								);
								if (
									this.sideSelectedValue === LightEffectComplexType.Breath ||
									this.sideSelectedValue === LightEffectComplexType.Wave
								) {
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					}
				});
		}
	}
	changeSingleCoorEffect($event) {
		this.selectedSingleColorOptionId = $event;
		if (this.lightingProfileEffectColorNUmber === undefined) {
			this.lightingProfileEffectColorNUmber = new LightingProfileEffectColorNUmber();
		}
		this.lightingProfileEffectColorNUmber.profileId = this.currentProfileId;
		this.lightingProfileEffectColorNUmber.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorNUmber.lightEffectType = $event;
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorNUmber)
				.then((response: any) => {
					if (LocalStorageKey.LightingProfileById !== undefined) {
						this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
					}
				});
		}
	}

	setDefaultProfile(currentProfileId) {
		try {
			if (currentProfileId !== undefined) {
				this.isOff = Number(currentProfileId);
			}
			if (this.isOff === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
				this.currentProfileId = this.isOff;
				if (this.gamingLightingService.isShellAvailable) {
					this.gamingLightingService
						.setLightingDefaultProfileById(this.currentProfileId)
						.then((response: any) => {
							if (response.didSuccess) {
								if (LocalStorageKey.LightingProfileById !== undefined) {
									this.commonService.setLocalStorageValue(
										LocalStorageKey.LightingProfileById,
										response
									);
								}
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									this.commonService.setLocalStorageValue(
										LocalStorageKey.LightingSetDefaultProfile,
										response
									);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;
									if (LocalStorageKey.ProfileBrightness !== undefined) {
										this.commonService.setLocalStorageValue(
											LocalStorageKey.ProfileBrightness,
											response.brightness
										);
									}
									if (this.lightingCapabilities.RGBfeature === 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											this.frontSelectedValue = response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue === LightEffectComplexType.Wave ||
												this.frontSelectedValue === LightEffectComplexType.Smooth ||
												this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
												this.frontSelectedValue === LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (
												this.frontSelectedValue === LightEffectComplexType.Breath ||
												this.frontSelectedValue === LightEffectComplexType.Wave
											) {
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
												if (
													this.sideSelectedValue === LightEffectComplexType.Wave ||
													this.sideSelectedValue === LightEffectComplexType.Smooth ||
													this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
													this.sideSelectedValue === LightEffectComplexType.CPU_frequency
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (
													this.sideSelectedValue === LightEffectComplexType.Breath ||
													this.sideSelectedValue === LightEffectComplexType.Wave
												) {
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
							} else {
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									response = this.commonService.getLocalStorageValue(
										LocalStorageKey.LightingSetDefaultProfile
									);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;
									if (LocalStorageKey.ProfileBrightness !== undefined) {
										this.commonService.setLocalStorageValue(
											LocalStorageKey.ProfileBrightness,
											response.brightness
										);
									}
									if (this.lightingCapabilities.RGBfeature === 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											this.frontSelectedValue = response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue === LightEffectComplexType.Wave ||
												this.frontSelectedValue === LightEffectComplexType.Smooth ||
												this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
												this.frontSelectedValue === LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (
												this.frontSelectedValue === LightEffectComplexType.Breath ||
												this.frontSelectedValue === LightEffectComplexType.Wave
											) {
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
													this.sideSelectedValue === LightEffectComplexType.Wave ||
													this.sideSelectedValue === LightEffectComplexType.Smooth ||
													this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
													this.sideSelectedValue === LightEffectComplexType.CPU_frequency
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (
													this.sideSelectedValue === LightEffectComplexType.Breath ||
													this.sideSelectedValue === LightEffectComplexType.Wave
												) {
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
		} catch (error) {}
	}
	setLightingBrightness(event) {
		try {
			if (this.sideSelectedValue !== null) {
				if (
					this.frontSelectedValue !== LightEffectComplexType.Wave ||
					this.frontSelectedValue !== LightEffectComplexType.Breath ||
					this.sideSelectedValue !== LightEffectComplexType.Wave ||
					this.sideSelectedValue !== LightEffectComplexType.Breath
				) {
					if (this.gamingLightingService.isShellAvailable) {
						this.gamingLightingService.setLightingProfileBrightness(event).then((response: any) => {
							this.didSuccess = response.didSuccess;
							this.brightness = response.brightness;
							if (!this.didSuccess) {
								this.getLightingBrightness();
							} else {
								if (LocalStorageKey.ProfileBrightness !== undefined) {
									this.commonService.setLocalStorageValue(
										LocalStorageKey.ProfileBrightness,
										this.brightness
									);
								}
								this.getLightingBrightness();
							}
						});
					}
				}
			}
		} catch (error) {}
	}

	public getLightingBrightness() {
		try {
			if (LocalStorageKey.ProfileBrightness !== undefined) {
				this.profileBrightness =
					this.commonService.getLocalStorageValue(LocalStorageKey.ProfileBrightness) || 1;
			}
		} catch (error) {}
	}

	public getLightingProfileById(currProfileId) {
		try {
			// 1----profileid
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileById(currProfileId).then((response: any) => {
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}

						this.currentProfileId = response.profileId;
						this.currentProfile = response.profileId;
						this.profileBrightness = response.brightness;
						if (LocalStorageKey.ProfileBrightness !== undefined) {
							this.commonService.setLocalStorageValue(
								LocalStorageKey.ProfileBrightness,
								response.brightness
							);
						}
						if (response.lightInfo.length > 0) {
							if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple) {
								if (this.lightingCapabilities.LedType_Complex.length > 1) {
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								} else if (this.lightingCapabilities.LedType_simple.length > 1) {
									this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
								}
							} else {
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;

								if (
									this.frontSelectedValue === LightEffectComplexType.Wave ||
									this.frontSelectedValue === LightEffectComplexType.Smooth ||
									this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
									this.frontSelectedValue === LightEffectComplexType.CPU_frequency
								) {
									this.showHideOverlay = true;
								} else {
									this.showHideOverlay = false;
								}
								if (
									this.frontSelectedValue === LightEffectComplexType.Breath ||
									this.frontSelectedValue === LightEffectComplexType.Wave
								) {
									this.enableBrightCondition = true;
								} else {
									this.enableBrightCondition = false;
								}

								const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
									response.lightInfo[0].lightEffectType
								);
								this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
								this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
								this.inHex1 = response.lightInfo[0].lightColor;

								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
										response.lightInfo[1].lightEffectType
									);
									this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
									if (
										this.sideSelectedValue === LightEffectComplexType.Wave ||
										this.sideSelectedValue === LightEffectComplexType.Smooth ||
										this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
										this.sideSelectedValue === LightEffectComplexType.CPU_frequency
									) {
										this.showHideOverlaySide = true;
									} else {
										this.showHideOverlaySide = false;
									}
									if (
										this.sideSelectedValue === LightEffectComplexType.Breath ||
										this.sideSelectedValue === LightEffectComplexType.Wave
									) {
										this.enableBrightConditionside = true;
									} else {
										this.enableBrightConditionside = false;
									}
									this.lightingEffectData.drop[1].curSelected = response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
								}
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.response =
								this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById) || 0;
						}
						if (response !== undefined) {
							this.currentProfileId = response.profileId;
							this.currentProfile = response.profileId;
							this.profileBrightness = response.brightness;
							if (LocalStorageKey.ProfileBrightness !== undefined) {
								this.commonService.setLocalStorageValue(
									LocalStorageKey.ProfileBrightness,
									response.brightness
								);
							}
							if (response.lightInfo.length > 0) {
								if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple) {
									if (this.lightingCapabilities.LightPanelType.length > 1) {
										this.simpleOrComplex = 3;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									} else if (this.lightingCapabilities.LightPanelType.length === 1) {
										this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									} else if (this.lightingCapabilities.LedType_simple.length > 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									}
								} else {
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;

									if (
										this.frontSelectedValue === LightEffectComplexType.Wave ||
										this.frontSelectedValue === LightEffectComplexType.Smooth ||
										this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
										this.frontSelectedValue === LightEffectComplexType.CPU_frequency
									) {
										this.showHideOverlay = true;
									} else {
										this.showHideOverlay = false;
									}
									if (
										this.frontSelectedValue === LightEffectComplexType.Breath ||
										this.frontSelectedValue === LightEffectComplexType.Wave
									) {
										this.enableBrightCondition = true;
									} else {
										this.enableBrightCondition = false;
									}

									const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
										response.lightInfo[0].lightEffectType
									);
									this.lightEffectRGBOptionName = lightEffectRGBOptionNameA[0].name;
									this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
									this.inHex1 = response.lightInfo[0].lightColor;

									if (response.lightInfo.length > 1) {
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
										const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
											response.lightInfo[1].lightEffectType
										);
										this.lightEffectRGBOptionNameSide = lightEffectRGBOptionNameB[0].name;
										if (
											this.sideSelectedValue === LightEffectComplexType.Wave ||
											this.sideSelectedValue === LightEffectComplexType.Smooth ||
											this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
											this.sideSelectedValue === LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (
											this.sideSelectedValue === LightEffectComplexType.Breath ||
											this.sideSelectedValue === LightEffectComplexType.Wave
										) {
											this.enableBrightConditionside = true;
										} else {
											this.enableBrightConditionside = false;
										}
										this.lightingEffectData.drop[1].curSelected =
											response.lightInfo[1].lightEffectType;
										this.inHex2 = response.lightInfo[1].lightColor;
									}
								}
							}
						}
					}
				});
			}
		} catch (error) {}
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
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						if (LocalStorageKey.ProfileId !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
						}

						if (response.profileId > 0) {
							if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple) {
								if (this.lightingCapabilities.LedType_Complex.length > 1) {
									this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									if (this.lightingCapabilities.LightPanelType.length > 1) {
										this.simpleOrComplex = 3;
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									}
								} else if (this.lightingCapabilities.LedType_simple.length > 1) {
									this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
								}
							} else {
								if (response.lightInfo.length > 0) {
									this.lightingEffectData.drop[0].curSelected = response.lightInfo[0].lightEffectType;
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;
									if (
										this.frontSelectedValue === LightEffectComplexType.Wave ||
										this.frontSelectedValue === LightEffectComplexType.Smooth ||
										this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
										this.frontSelectedValue === LightEffectComplexType.CPU_frequency
									) {
										this.showHideOverlay = true;
									} else {
										this.showHideOverlay = false;
									}
									if (
										this.frontSelectedValue === LightEffectComplexType.Breath ||
										this.frontSelectedValue === LightEffectComplexType.Wave
									) {
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
										if (
											this.sideSelectedValue === LightEffectComplexType.Wave ||
											this.sideSelectedValue === LightEffectComplexType.Smooth ||
											this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
											this.sideSelectedValue === LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (
											this.sideSelectedValue === LightEffectComplexType.Breath ||
											this.sideSelectedValue === LightEffectComplexType.Wave
										) {
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
							if (LocalStorageKey.ProfileBrightness !== undefined) {
								this.commonService.setLocalStorageValue(
									LocalStorageKey.ProfileBrightness,
									response.brightness
								);
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.commonService.getLocalStorageValue(LocalStorageKey.LightingProfileById);
						}
						if (response !== undefined) {
							if (response.profileId > 0) {
								if (this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple) {
									if (this.lightingCapabilities.LedType_Complex.length > 1) {
										this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									} else if (this.lightingCapabilities.LedType_simple.length > 1) {
										this.selectedSingleColorOptionId = response.lightInfo[0].lightEffectType;
									}
								} else {
									if (response.lightInfo.length > 0) {
										this.lightingEffectData.drop[0].curSelected =
											response.lightInfo[0].lightEffectType;
										this.frontSelectedValue = response.lightInfo[0].lightEffectType;
										if (
											this.frontSelectedValue === LightEffectComplexType.Wave ||
											this.frontSelectedValue === LightEffectComplexType.Smooth ||
											this.frontSelectedValue === LightEffectComplexType.CPU_thermal ||
											this.frontSelectedValue === LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlay = true;
										} else {
											this.showHideOverlay = false;
										}
										if (
											this.frontSelectedValue === LightEffectComplexType.Breath ||
											this.frontSelectedValue === LightEffectComplexType.Wave
										) {
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
											if (
												this.sideSelectedValue === LightEffectComplexType.Wave ||
												this.sideSelectedValue === LightEffectComplexType.Smooth ||
												this.sideSelectedValue === LightEffectComplexType.CPU_thermal ||
												this.sideSelectedValue === LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlaySide = true;
											} else {
												this.showHideOverlaySide = false;
											}
											if (
												this.sideSelectedValue === LightEffectComplexType.Breath ||
												this.sideSelectedValue === LightEffectComplexType.Wave
											) {
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
								if (LocalStorageKey.ProfileBrightness !== undefined) {
									this.commonService.setLocalStorageValue(
										LocalStorageKey.ProfileBrightness,
										response.brightness
									);
								}
							}
						}
					}
				});
			}
		} catch (error) {}
	}
	colorEffectChangedFront($event) {
		this.applyBtnStatus1 = 'loading';
		$event = $event.substring(1);
		if (this.lightingProfileEffectColorString === undefined) {
			this.lightingProfileEffectColorString = new LightingProfileEffectColorString();
		}
		this.lightingProfileEffectColorString.profileId = this.currentProfileId;
		this.lightingProfileEffectColorString.lightPanelType = this.lightingCapabilities.LightPanelType[0];
		this.lightingProfileEffectColorString.lightColor = $event;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorString)
				.then((response: any) => {
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						this.inHex1 = $event;
						this.applyBtnStatus1 = 'applied';
					}
				});
		}
	}
	colorEffectChangedSide($event) {
		this.applyBtnStatus2 = 'loading';
		$event = $event.substring(1);
		if (this.lightingProfileEffectColorString === undefined) {
			this.lightingProfileEffectColorString = new LightingProfileEffectColorString();
		}
		this.lightingProfileEffectColorString.profileId = this.currentProfileId;
		this.lightingProfileEffectColorString.lightPanelType = this.lightingCapabilities.LightPanelType[1];
		this.lightingProfileEffectColorString.lightColor = $event;

		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService
				.setLightingProfileEffectColor(this.lightingProfileEffectColorString)
				.then((response: any) => {
					if (response.didSuccess) {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.LightingProfileById, response);
						}
						this.inHex2 = $event;
						this.applyBtnStatus2 = 'applied';
					}
				});
		}
	}
	colorChangedFront($event) {
		this.inHex1 = $event.hex;
	}
	colorChangedSide($event) {
		this.inHex2 = $event.hex;
	}
}
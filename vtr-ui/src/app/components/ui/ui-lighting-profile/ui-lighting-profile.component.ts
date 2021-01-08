import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input } from '@angular/core';
import { LightingProfile } from 'src/app/data-models/gaming/lighting-profile';
import {
	LightingProfileEffectColorNUmber,
	LightingProfileEffectColorString,
} from 'src/app/data-models/gaming/lighting-profile-effect-color';
import { Options } from 'src/app/data-models/gaming/lighting-options';
import { LightEffectComplexType } from 'src/app/enums/light-effect-complex-type';
import {
	LightEffectRGBFeature,
	LightEffectSingleOrComplex,
} from 'src/app/enums/light-effect-rgbfeature';
import { DeviceService } from 'src/app/services/device/device.service';
import { ColorWheelStatus } from 'src/app/enums/color-wheel-status.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LightingDataList } from './../../../data-models/gaming/lighting-new-version/lighting-data-list';

@Component({
	selector: 'vtr-ui-lighting-profile',
	templateUrl: './ui-lighting-profile.component.html',
	styleUrls: ['./ui-lighting-profile.component.scss'],
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
	public applyBtnStatus1: string = ColorWheelStatus.apply;
	public applyBtnStatus2: string = ColorWheelStatus.apply;
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
	public lightingEffectData = LightingDataList.lightingEffectData;

	public panelImageData = [
		{
			panelType: 1,
			colorRGB: 1,
			panelImage: 'C530@2x.png',
		},
		{
			panelType: 2,
			colorRGB: 255,
			panelImage: 'T730Front@2x.png',
		},
		{
			panelType: 2,
			colorRGB: 1,
			panelImage: 'T530@2x.png',
		},
		{
			panelType: 4,
			colorRGB: 255,
			panelImage: 'renRGBFront@2x.png',
		},
		{
			panelType: 4,
			colorRGB: 1,
			panelImage: 'renFront@2x.png',
		},
		{
			panelType: 8,
			colorRGB: 255,
			panelImage: 'T730Side@2x.png',
		},
		{
			panelType: 16,
			colorRGB: 255,
			panelImage: 'T730Side@2x.png',
		},
		{
			panelType: 32,
			colorRGB: 255,
			panelImage: 'C730Left@2x.png',
		},
		{
			panelType: 64,
			colorRGB: 255,
			panelImage: 'C730Right@2x.png',
		},
		{
			panelType: 128,
			colorRGB: 1,
			panelImage: 'ren@2x.png',
		},
		{
			panelType: 256,
			colorRGB: 1,
			panelImage: 'T530Perspective@2x.png',
		},
		{
			panelType: 32,
			colorRGB: 1,
			panelImage: 'C530Left@2x.png',
		},
		{
			panelType: 64,
			colorRGB: 1,
			panelImage: 'C530Right@2x.png',
		},
	];
	optionsSingleColor = [
		new Options(
			1,
			'gaming.lightingProfile.lightingSingleLightingOption.option1.title',
			'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option1.title'
		),
		new Options(
			2,
			'gaming.lightingProfile.lightingSingleLightingOption.option2.title',
			'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option2.title'
		),
		new Options(
			3,
			'gaming.lightingProfile.lightingSingleLightingOption.option3.title',
			'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option3.title'
		),
		new Options(
			4,
			'gaming.lightingProfile.lightingSingleLightingOption.option4.title',
			'gaming.lightingProfile.lightingSingleLightingOptionnarrator.option4.title'
		),
	];

	public imagePath = 'assets/images/gaming/lighting';
	public panelImage1: string;
	public panelImage2: string;
	defaultLanguage: any;
	constructor(
		private gamingLightingService: GamingLightingService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((value: any) => {
			//this.defaultLanguage = value.locale;
		});
		this.isProfileOff = false;
		if (LocalStorageKey.LightingCapabilities !== undefined) {
			const response = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingCapabilities
			);
			if (response !== undefined) {
				this.getCacheLightingCapabilities(response);
			}
		}
		if (LocalStorageKey.LightingProfileById !== undefined) {
			const res = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingProfileById
			);
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
					const resultImg = this.panelImageData.filter(
						(v) => v.panelType === ledPanel && v.colorRGB === ledRGB
					);
					if (resultImg.length > 0) {
						this.panelImage1 = this.imagePath + '/' + resultImg[0].panelImage;
					}

					if (this.lightingCapabilities.LightPanelType.length > 1) {
						const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
						const resultImg2 = this.panelImageData.filter(
							(v) => v.panelType === ledPanel2 && v.colorRGB === ledRGB
						);
						if (resultImg2.length > 0) {
							this.panelImage2 = this.imagePath + '/' + resultImg2[0].panelImage;
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
					if (
						this.lightingCapabilities.RGBfeature === this.enumLightingRGBFeature.Simple
					) {
						if (this.lightingCapabilities.LedType_Complex.length > 1) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.sideSelectedValue = response.lightInfo[1].lightEffectType;
						} else if (this.lightingCapabilities.LedType_simple.length > 1) {
							this.selectedSingleColorOptionId =
								response.lightInfo[0].lightEffectType;
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
						this.lightingEffectData.drop[0].curSelected =
							response.lightInfo[0].lightEffectType;
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
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.LightingCapabilities,
							response
						);
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
					const resultImg = this.panelImageData.filter(
						(v) => v.panelType === ledPanel && v.colorRGB === ledRGB
					);
					if (resultImg.length > 0) {
						this.panelImage1 = this.imagePath + '/' + resultImg[0].panelImage;
					}

					if (this.lightingCapabilities.LightPanelType.length > 1) {
						const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
						const resultImg2 = this.panelImageData.filter(
							(v) => v.panelType === ledPanel2 && v.colorRGB === ledRGB
						);
						if (resultImg2.length > 0) {
							this.panelImage2 = this.imagePath + '/' + resultImg2[0].panelImage;
						}
					}
				}

				this.getLightingProfileById(this.currentProfileId);
				// this.getLightingBrightness();
			} else {
				if (LocalStorageKey.LightingCapabilities !== undefined) {
					response = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.LightingCapabilities
					);
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
						const resultImg = this.panelImageData.filter(
							(v) => v.panelType === ledPanel && v.colorRGB === ledRGB
						);
						if (resultImg.length > 0) {
							this.panelImage1 = this.imagePath + '/' + resultImg[0].panelImage;
						}
						if (this.lightingCapabilities.LightPanelType.length > 1) {
							const ledPanel2 = this.lightingCapabilities.LightPanelType[1];
							const resultImg2 = this.panelImageData.filter(
								(v) => v.panelType === ledPanel2 && v.colorRGB === ledRGB
							);
							if (resultImg2.length > 0) {
								this.panelImage2 = this.imagePath + '/' + resultImg2[0].panelImage;
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
				this.showHideOverlaySide = true;
				this.frontSelectedValue = $event.value;
				this.sideSelectedValue = $event.value;
			} else {
				this.showHideOverlay = false;
				this.showHideOverlaySide = false;
				let res: any;
				if (LocalStorageKey.LightingProfileById !== undefined) {
					res = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.LightingProfileById
					);
				}
				if (res.lightInfo.length > 0) {
					if (
						res.lightInfo[0].lightEffectType === LightEffectComplexType.Wave ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.Smooth ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.CPU_thermal ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.CPU_frequency
					) {
						this.frontSelectedValue = $event.value;
						this.sideSelectedValue = $event.value;
					}
				}
			}
			if (
				$event.value === LightEffectComplexType.Breath ||
				$event.value === LightEffectComplexType.Wave
			) {
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
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.LightingProfileById,
								response
							);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected =
								response.lightInfo[0].lightEffectType;
							if (response.lightInfo.length > 1) {
								this.sideSelectedValue = response.lightInfo[1].lightEffectType;
								this.lightingEffectData.drop[1].curSelected =
									response.lightInfo[1].lightEffectType;
								this.inHex2 = response.lightInfo[1].lightColor;
								if (
									this.lightingCapabilities.RGBfeature ===
									this.enumLightingRGBFeature.Complex
								) {
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
									this.lightEffectRGBOptionName =
										lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide =
										lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.LightingProfileById
							);
						}
						if (response.lightInfo.length > 0) {
							if (
								this.lightingCapabilities.LedType_Complex.length > 0 &&
								this.simpleOrComplex === this.enumLightEffectSingleOrComplex.Complex
							) {
								this.frontSelectedValue = response.lightInfo[0].lightEffectType;
								this.lightingEffectData.drop[0].curSelected =
									response.lightInfo[0].lightEffectType;
								if (response.lightInfo.length > 1) {
									this.sideSelectedValue = response.lightInfo[1].lightEffectType;
									this.lightingEffectData.drop[1].curSelected =
										response.lightInfo[1].lightEffectType;
									this.inHex2 = response.lightInfo[1].lightColor;
									if (
										this.lightingCapabilities.RGBfeature ===
										this.enumLightingRGBFeature.Complex
									) {
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
											this.sideSelectedValue ===
												LightEffectComplexType.Breath ||
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
										this.lightEffectRGBOptionName =
											lightEffectRGBOptionNameB[0].name;
										this.lightEffectRGBOptionNameSide =
											lightEffectRGBOptionNameB[0].name;
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
				this.showHideOverlay = true;
				this.frontSelectedValue = $event.value;
				this.sideSelectedValue = $event.value;
			} else {
				this.showHideOverlaySide = false;
				this.showHideOverlay = false;
				let res: any;
				if (LocalStorageKey.LightingProfileById !== undefined) {
					res = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.LightingProfileById
					);
				}
				if (res.lightInfo.length > 0) {
					if (
						res.lightInfo[0].lightEffectType === LightEffectComplexType.Wave ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.Smooth ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.CPU_thermal ||
						res.lightInfo[0].lightEffectType === LightEffectComplexType.CPU_frequency
					) {
						this.frontSelectedValue = $event.value;
						this.sideSelectedValue = $event.value;
					}
				}
			}
			if (
				$event.value === LightEffectComplexType.Breath ||
				$event.value === LightEffectComplexType.Wave
			) {
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
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.LightingProfileById,
								response
							);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected =
								response.lightInfo[0].lightEffectType;
							if (
								this.lightingCapabilities.RGBfeature ===
								this.enumLightingRGBFeature.Complex
							) {
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
								this.lightingEffectData.drop[1].curSelected =
									response.lightInfo[1].lightEffectType;
								const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
									response.lightInfo[1].lightEffectType
								);
								if (
									this.sideSelectedValue === LightEffectComplexType.Breath ||
									this.sideSelectedValue === LightEffectComplexType.Wave
								) {
									this.lightEffectRGBOptionName =
										lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide =
										lightEffectRGBOptionNameB[0].name;
								}
							}
						}
					} else {
						if (LocalStorageKey.LightingProfileById !== undefined) {
							response = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.LightingProfileById
							);
						}
						if (response.lightInfo.length > 0) {
							this.frontSelectedValue = response.lightInfo[0].lightEffectType;
							this.lightingEffectData.drop[0].curSelected =
								response.lightInfo[0].lightEffectType;
							if (
								this.lightingCapabilities.RGBfeature ===
								this.enumLightingRGBFeature.Complex
							) {
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
								this.lightingEffectData.drop[1].curSelected =
									response.lightInfo[1].lightEffectType;
								const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
									response.lightInfo[1].lightEffectType
								);
								if (
									this.sideSelectedValue === LightEffectComplexType.Breath ||
									this.sideSelectedValue === LightEffectComplexType.Wave
								) {
									this.lightEffectRGBOptionName =
										lightEffectRGBOptionNameB[0].name;
									this.lightEffectRGBOptionNameSide =
										lightEffectRGBOptionNameB[0].name;
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
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.LightingProfileById,
							response
						);
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
									this.localCacheService.setLocalCacheValue(
										LocalStorageKey.LightingProfileById,
										response
									);
								}
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									this.localCacheService.setLocalCacheValue(
										LocalStorageKey.LightingSetDefaultProfile,
										response
									);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;
									if (LocalStorageKey.ProfileBrightness !== undefined) {
										this.localCacheService.setLocalCacheValue(
											LocalStorageKey.ProfileBrightness,
											response.brightness
										);
									}
									if (this.lightingCapabilities.RGBfeature === 1) {
										this.selectedSingleColorOptionId =
											response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Wave ||
												this.frontSelectedValue ===
													LightEffectComplexType.Smooth ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_thermal ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Breath ||
												this.frontSelectedValue ===
													LightEffectComplexType.Wave
											) {
												this.enableBrightCondition = true;
											} else {
												this.enableBrightCondition = false;
											}
											const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
												response.lightInfo[0].lightEffectType
											);
											this.lightEffectRGBOptionName =
												lightEffectRGBOptionNameA[0].name;
											this.inHex1 = response.lightInfo[0].lightColor;
											if (response.lightInfo.length > 1) {
												this.sideSelectedValue =
													response.lightInfo[1].lightEffectType;
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Wave ||
													this.sideSelectedValue ===
														LightEffectComplexType.Smooth ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_thermal ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_frequency
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Breath ||
													this.sideSelectedValue ===
														LightEffectComplexType.Wave
												) {
													this.enableBrightConditionside = true;
												} else {
													this.enableBrightConditionside = false;
												}
												const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
													response.lightInfo[1].lightEffectType
												);
												this.lightEffectRGBOptionNameSide =
													lightEffectRGBOptionNameB[0].name;
												this.inHex2 = response.lightInfo[1].lightColor;
												this.lightingEffectData.drop[1].curSelected =
													response.lightInfo[1].lightEffectType;
											}
										}
									}
								}
							} else {
								if (LocalStorageKey.LightingSetDefaultProfile !== undefined) {
									response = this.localCacheService.getLocalCacheValue(
										LocalStorageKey.LightingSetDefaultProfile
									);
								}
								if (response.profileId > 0) {
									this.currentProfileId = response.profileId;
									this.currentProfile = response.profileId;
									this.profileBrightness = response.brightness;
									if (LocalStorageKey.ProfileBrightness !== undefined) {
										this.localCacheService.setLocalCacheValue(
											LocalStorageKey.ProfileBrightness,
											response.brightness
										);
									}
									if (this.lightingCapabilities.RGBfeature === 1) {
										this.selectedSingleColorOptionId =
											response.lightInfo[0].lightEffectType;
									} else {
										if (response.lightInfo.length > 0) {
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Wave ||
												this.frontSelectedValue ===
													LightEffectComplexType.Smooth ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_thermal ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Breath ||
												this.frontSelectedValue ===
													LightEffectComplexType.Wave
											) {
												this.enableBrightCondition = true;
											} else {
												this.enableBrightCondition = false;
											}
											const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
												response.lightInfo[0].lightEffectType
											);
											this.lightEffectRGBOptionName =
												lightEffectRGBOptionNameA[0].name;
											this.lightingEffectData.drop[0].curSelected =
												response.lightInfo[0].lightEffectType;
											this.inHex1 = response.lightInfo[0].lightColor;
											if (response.lightInfo.length > 1) {
												this.sideSelectedValue =
													response.lightInfo[1].lightEffectType;
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Wave ||
													this.sideSelectedValue ===
														LightEffectComplexType.Smooth ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_thermal ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_frequency
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Breath ||
													this.sideSelectedValue ===
														LightEffectComplexType.Wave
												) {
													this.enableBrightConditionside = true;
												} else {
													this.enableBrightConditionside = false;
												}
												const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
													response.lightInfo[1].lightEffectType
												);
												this.lightEffectRGBOptionNameSide =
													lightEffectRGBOptionNameB[0].name;
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
						this.gamingLightingService
							.setLightingProfileBrightness(event)
							.then((response: any) => {
								this.didSuccess = response.didSuccess;
								this.brightness = response.brightness;
								if (!this.didSuccess) {
									this.getLightingBrightness();
								} else {
									if (LocalStorageKey.ProfileBrightness !== undefined) {
										this.localCacheService.setLocalCacheValue(
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
					this.localCacheService.getLocalCacheValue(LocalStorageKey.ProfileBrightness) ||
					1;
			}
		} catch (error) {}
	}

	public getLightingProfileById(currProfileId) {
		try {
			// 1----profileid
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.getLightingProfileById(currProfileId)
					.then((response: any) => {
						if (response.didSuccess) {
							if (LocalStorageKey.LightingProfileById !== undefined) {
								this.localCacheService.setLocalCacheValue(
									LocalStorageKey.LightingProfileById,
									response
								);
							}

							this.currentProfileId = response.profileId;
							this.currentProfile = response.profileId;
							this.profileBrightness = response.brightness;
							if (LocalStorageKey.ProfileBrightness !== undefined) {
								this.localCacheService.setLocalCacheValue(
									LocalStorageKey.ProfileBrightness,
									response.brightness
								);
							}
							if (response.lightInfo.length > 0) {
								if (
									this.lightingCapabilities.RGBfeature ===
									this.enumLightingRGBFeature.Simple
								) {
									if (this.lightingCapabilities.LedType_Complex.length > 1) {
										this.frontSelectedValue =
											response.lightInfo[0].lightEffectType;
										this.sideSelectedValue =
											response.lightInfo[1].lightEffectType;
									} else if (
										this.lightingCapabilities.LedType_simple.length > 1
									) {
										this.selectedSingleColorOptionId =
											response.lightInfo[0].lightEffectType;
									}
								} else {
									this.frontSelectedValue = response.lightInfo[0].lightEffectType;

									if (
										this.frontSelectedValue === LightEffectComplexType.Wave ||
										this.frontSelectedValue === LightEffectComplexType.Smooth ||
										this.frontSelectedValue ===
											LightEffectComplexType.CPU_thermal ||
										this.frontSelectedValue ===
											LightEffectComplexType.CPU_frequency
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
									this.lightEffectRGBOptionName =
										lightEffectRGBOptionNameA[0].name;
									this.lightingEffectData.drop[0].curSelected =
										response.lightInfo[0].lightEffectType;
									this.inHex1 = response.lightInfo[0].lightColor;

									if (response.lightInfo.length > 1) {
										this.sideSelectedValue =
											response.lightInfo[1].lightEffectType;
										const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
											response.lightInfo[1].lightEffectType
										);
										this.lightEffectRGBOptionNameSide =
											lightEffectRGBOptionNameB[0].name;
										if (
											this.sideSelectedValue ===
												LightEffectComplexType.Wave ||
											this.sideSelectedValue ===
												LightEffectComplexType.Smooth ||
											this.sideSelectedValue ===
												LightEffectComplexType.CPU_thermal ||
											this.sideSelectedValue ===
												LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlaySide = true;
										} else {
											this.showHideOverlaySide = false;
										}
										if (
											this.sideSelectedValue ===
												LightEffectComplexType.Breath ||
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
						} else {
							if (LocalStorageKey.LightingProfileById !== undefined) {
								this.response =
									this.localCacheService.getLocalCacheValue(
										LocalStorageKey.LightingProfileById
									) || 0;
							}
							if (response) {
								this.currentProfileId = response.profileId;
								this.currentProfile = response.profileId;
								this.profileBrightness = response.brightness;
								if (LocalStorageKey.ProfileBrightness !== undefined) {
									this.localCacheService.setLocalCacheValue(
										LocalStorageKey.ProfileBrightness,
										response.brightness
									);
								}
								if (response.lightInfo.length > 0) {
									if (
										this.lightingCapabilities.RGBfeature ===
										this.enumLightingRGBFeature.Simple
									) {
										if (this.lightingCapabilities.LightPanelType.length > 1) {
											this.simpleOrComplex = 3;
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
											this.sideSelectedValue =
												response.lightInfo[1].lightEffectType;
										} else if (
											this.lightingCapabilities.LightPanelType.length === 1
										) {
											this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
										} else if (
											this.lightingCapabilities.LedType_simple.length > 1
										) {
											this.selectedSingleColorOptionId =
												response.lightInfo[0].lightEffectType;
										}
									} else {
										this.frontSelectedValue =
											response.lightInfo[0].lightEffectType;

										if (
											this.frontSelectedValue ===
												LightEffectComplexType.Wave ||
											this.frontSelectedValue ===
												LightEffectComplexType.Smooth ||
											this.frontSelectedValue ===
												LightEffectComplexType.CPU_thermal ||
											this.frontSelectedValue ===
												LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlay = true;
										} else {
											this.showHideOverlay = false;
										}
										if (
											this.frontSelectedValue ===
												LightEffectComplexType.Breath ||
											this.frontSelectedValue === LightEffectComplexType.Wave
										) {
											this.enableBrightCondition = true;
										} else {
											this.enableBrightCondition = false;
										}

										const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
											response.lightInfo[0].lightEffectType
										);
										this.lightEffectRGBOptionName =
											lightEffectRGBOptionNameA[0].name;
										this.lightingEffectData.drop[0].curSelected =
											response.lightInfo[0].lightEffectType;
										this.inHex1 = response.lightInfo[0].lightColor;

										if (response.lightInfo.length > 1) {
											this.sideSelectedValue =
												response.lightInfo[1].lightEffectType;
											const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
												response.lightInfo[1].lightEffectType
											);
											this.lightEffectRGBOptionNameSide =
												lightEffectRGBOptionNameB[0].name;
											if (
												this.sideSelectedValue ===
													LightEffectComplexType.Wave ||
												this.sideSelectedValue ===
													LightEffectComplexType.Smooth ||
												this.sideSelectedValue ===
													LightEffectComplexType.CPU_thermal ||
												this.sideSelectedValue ===
													LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlaySide = true;
											} else {
												this.showHideOverlaySide = false;
											}
											if (
												this.sideSelectedValue ===
													LightEffectComplexType.Breath ||
												this.sideSelectedValue ===
													LightEffectComplexType.Wave
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
		const result = this.lightingEffectData.drop[0].dropOptions.filter(
			(obj) => obj.value === optionValue
		);
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
				this.gamingLightingService
					.setLightingProfileId(1, this.isOff)
					.then((response: any) => {
						if (response.didSuccess) {
							if (LocalStorageKey.LightingProfileById !== undefined) {
								this.localCacheService.setLocalCacheValue(
									LocalStorageKey.LightingProfileById,
									response
								);
							}
							if (LocalStorageKey.ProfileId !== undefined) {
								this.localCacheService.setLocalCacheValue(
									LocalStorageKey.ProfileId,
									response.profileId
								);
							}

							if (response.profileId > 0) {
								if (
									this.lightingCapabilities.RGBfeature ===
									this.enumLightingRGBFeature.Simple
								) {
									if (this.lightingCapabilities.LedType_Complex.length > 1) {
										this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
										this.frontSelectedValue =
											response.lightInfo[0].lightEffectType;
										if (this.lightingCapabilities.LightPanelType.length > 1) {
											this.simpleOrComplex = 3;
											this.sideSelectedValue =
												response.lightInfo[1].lightEffectType;
										}
									} else if (
										this.lightingCapabilities.LedType_simple.length > 1
									) {
										this.selectedSingleColorOptionId =
											response.lightInfo[0].lightEffectType;
									}
								} else {
									if (response.lightInfo.length > 0) {
										this.lightingEffectData.drop[0].curSelected =
											response.lightInfo[0].lightEffectType;
										this.frontSelectedValue =
											response.lightInfo[0].lightEffectType;
										if (
											this.frontSelectedValue ===
												LightEffectComplexType.Wave ||
											this.frontSelectedValue ===
												LightEffectComplexType.Smooth ||
											this.frontSelectedValue ===
												LightEffectComplexType.CPU_thermal ||
											this.frontSelectedValue ===
												LightEffectComplexType.CPU_frequency
										) {
											this.showHideOverlay = true;
										} else {
											this.showHideOverlay = false;
										}
										if (
											this.frontSelectedValue ===
												LightEffectComplexType.Breath ||
											this.frontSelectedValue === LightEffectComplexType.Wave
										) {
											this.enableBrightCondition = true;
										} else {
											this.enableBrightCondition = false;
										}
										const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
											response.lightInfo[0].lightEffectType
										);
										this.lightEffectRGBOptionName =
											lightEffectRGBOptionNameA[0].name;
										this.inHex1 = response.lightInfo[0].lightColor;
										if (response.lightInfo.length > 1) {
											this.sideSelectedValue =
												response.lightInfo[1].lightEffectType;
											const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
												response.lightInfo[1].lightEffectType
											);
											this.lightEffectRGBOptionNameSide =
												lightEffectRGBOptionNameB[0].name;
											if (
												this.sideSelectedValue ===
													LightEffectComplexType.Wave ||
												this.sideSelectedValue ===
													LightEffectComplexType.Smooth ||
												this.sideSelectedValue ===
													LightEffectComplexType.CPU_thermal ||
												this.sideSelectedValue ===
													LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlaySide = true;
											} else {
												this.showHideOverlaySide = false;
											}
											if (
												this.sideSelectedValue ===
													LightEffectComplexType.Breath ||
												this.sideSelectedValue ===
													LightEffectComplexType.Wave
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
									this.localCacheService.setLocalCacheValue(
										LocalStorageKey.ProfileBrightness,
										response.brightness
									);
								}
							}
						} else {
							if (LocalStorageKey.LightingProfileById !== undefined) {
								response = this.localCacheService.getLocalCacheValue(
									LocalStorageKey.LightingProfileById
								);
							}
							if (response !== undefined) {
								if (response.profileId > 0) {
									if (
										this.lightingCapabilities.RGBfeature ===
										this.enumLightingRGBFeature.Simple
									) {
										if (this.lightingCapabilities.LedType_Complex.length > 1) {
											this.simpleOrComplex = this.enumLightEffectSingleOrComplex.Complex;
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
											this.sideSelectedValue =
												response.lightInfo[1].lightEffectType;
										} else if (
											this.lightingCapabilities.LedType_simple.length > 1
										) {
											this.selectedSingleColorOptionId =
												response.lightInfo[0].lightEffectType;
										}
									} else {
										if (response.lightInfo.length > 0) {
											this.lightingEffectData.drop[0].curSelected =
												response.lightInfo[0].lightEffectType;
											this.frontSelectedValue =
												response.lightInfo[0].lightEffectType;
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Wave ||
												this.frontSelectedValue ===
													LightEffectComplexType.Smooth ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_thermal ||
												this.frontSelectedValue ===
													LightEffectComplexType.CPU_frequency
											) {
												this.showHideOverlay = true;
											} else {
												this.showHideOverlay = false;
											}
											if (
												this.frontSelectedValue ===
													LightEffectComplexType.Breath ||
												this.frontSelectedValue ===
													LightEffectComplexType.Wave
											) {
												this.enableBrightCondition = true;
											} else {
												this.enableBrightCondition = false;
											}
											const lightEffectRGBOptionNameA = this.getLightEffectOptionName(
												response.lightInfo[0].lightEffectType
											);
											this.lightEffectRGBOptionName =
												lightEffectRGBOptionNameA[0].name;
											this.inHex1 = response.lightInfo[0].lightColor;
											if (response.lightInfo.length > 1) {
												this.sideSelectedValue =
													response.lightInfo[1].lightEffectType;
												const lightEffectRGBOptionNameB = this.getLightEffectOptionName(
													response.lightInfo[1].lightEffectType
												);
												this.lightEffectRGBOptionNameSide =
													lightEffectRGBOptionNameB[0].name;
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Wave ||
													this.sideSelectedValue ===
														LightEffectComplexType.Smooth ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_thermal ||
													this.sideSelectedValue ===
														LightEffectComplexType.CPU_frequency
												) {
													this.showHideOverlaySide = true;
												} else {
													this.showHideOverlaySide = false;
												}
												if (
													this.sideSelectedValue ===
														LightEffectComplexType.Breath ||
													this.sideSelectedValue ===
														LightEffectComplexType.Wave
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
										this.localCacheService.setLocalCacheValue(
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
		this.applyBtnStatus1 = ColorWheelStatus.loading;
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
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.LightingProfileById,
								response
							);
						}
						this.inHex1 = $event;
						this.applyBtnStatus1 = ColorWheelStatus.applied;
					}
				});
		}
	}
	colorEffectChangedSide($event) {
		this.applyBtnStatus2 = ColorWheelStatus.loading;
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
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.LightingProfileById,
								response
							);
						}
						this.inHex2 = $event;
						this.applyBtnStatus2 = ColorWheelStatus.applied;
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

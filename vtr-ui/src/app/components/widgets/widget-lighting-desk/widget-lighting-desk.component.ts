import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from '../../../services/metric/metrics.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-lighting-desk',
	templateUrl: './widget-lighting-desk.component.html',
	styleUrls: ['./widget-lighting-desk.component.scss'],
})
export class WidgetLightingDeskComponent implements OnInit, OnChanges {
	@Input() currentProfileId: number;
	@Input() ledlayoutversion: number;
	public countObj: any = { count1: 0, count2: 0, count3: 0 };
	public isDisabledlef: any = [true, true, true];
	public isDisabledrig: any = [false, false, false];
	public isProfileOff: boolean = false;
	public lightingProfileCurrentDetail: any = new LightingDataList().lightingCurrentDetailDesk;
	public lightingEffectList: any;
	public isColorPicker: boolean = false;
	public isShow: boolean = true;
	public supportSpeed: boolean = true;
	public supportBrightness: boolean = true;
	public supportColor: boolean = true;
	public lightingCapabilities: any = new LightingDataList().lightingCapality;
	public lightingProfileById: any;
	public lightingPanelImage: any = new LightingDataList().lightingPanelImage;
	public lightingPanelImageT750: any = new LightingDataList().lightingPanelImageT750;
	public lightingPanelImageT550AMD: any = new LightingDataList().lightingPanelImageT550AMD;
	public lightingEffectRgbData: any = new LightingDataList().lightingEffectRgbData;
	public lightingEffectSingleData: any = new LightingDataList().lightingEffectSingleData;
	public isEffectChange: boolean;
	public isValChange: boolean = true;

	constructor(
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private gamingLightingService: GamingLightingService,
		private logger: LoggerService,
		private metrics: MetricService
	) {}

	ngOnInit() {
		this.initProfileId();
		this.getCacheList();
		if (
			this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingCapabilitiesNewversionDesk
			) !== undefined
		) {
			this.lightingCapabilities = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingCapabilitiesNewversionDesk
			);
			this.imgDefaultOff();
			this.logger.info('this.lightingCapabilities  cache ', this.lightingCapabilities);
			this.getLightingCapabilitiesFromcache(this.lightingCapabilities);
		}
		if (this.lightingProfileById !== undefined) {
			this.getLightingProfileByIdFromcache(
				this.lightingProfileById,
				this.lightingCapabilities
			);
		}
		this.getLightingCapabilities();
		if (this.currentProfileId === 0) {
			this.isProfileOff = true;
		}
	}

	ngOnChanges(changes) {}

	public getLightingCapabilitiesFromcache(lightingCapabilitiesRes) {
		try {
			if (lightingCapabilitiesRes !== undefined) {
				this.lightingCapabilities = lightingCapabilitiesRes;
			}
		} catch (error) {}
	}

	public getLightingProfileByIdFromcache(lightingProfileByIdRes, lightingCapabilitiesRes) {
		try {
			if (lightingProfileByIdRes !== undefined) {
				let ProfileId = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.ProfileId
				);
				this.logger.info('ProfileId cache ', ProfileId);
				if (ProfileId !== 'undefined') {
					this.currentProfileId = ProfileId;
				}
				if (lightingProfileByIdRes.lightInfo !== null) {
					this.isShowpageInfo(lightingProfileByIdRes);
					this.lightingProfileDetail(
						lightingProfileByIdRes,
						this.countObj['count' + this.currentProfileId],
						lightingCapabilitiesRes
					);
				}
			}
		} catch (error) {}
	}

	public getLightingCapabilities() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.logger.info('lightingCapabilities res ', response);
					if (response) {
						this.lightingCapabilities = response;
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.LightingCapabilitiesNewversionDesk,
							response
						);
						this.imgDefaultOff();
						this.getLightingProfileById(this.currentProfileId);
					}
				});
			}
		} catch (error) {}
	}

	public getLightingProfileById(currProfileId) {
		try {
			//if profileId is 0,no need to use interfae
			if (currProfileId === 0) return;
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.getLightingProfileById(currProfileId)
					.then((response: any) => {
						this.logger.info('LightingProfileById res ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response, 1);
						}
					});
			}
		} catch (error) {}
	}

	public setLightingProfileId(event) {
		try {
			this.isColorPicker = false;
			this.isShow = true;
			let profileId = Number(event.target.value);
			this.currentProfileId = profileId;
			this.imgDefaultOff();
			if (this.currentProfileId === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
				/* Use cache before set    start  */
				this.getCacheList();
				this.lightingProfileDetail(
					this.lightingProfileById,
					this.countObj['count' + this.currentProfileId],
					this.lightingCapabilities
				);
				/* Use cache before set    end */
			}
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileId(1, this.currentProfileId)
					.then((response: any) => {
						this.logger.info('setLightingProfileId res ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response, 1);
						} else {
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							if (this.currentProfileId === 0) {
								this.isProfileOff = true;
							} else {
								this.isProfileOff = false;
								this.getCacheList();
								this.isShowpageInfo(this.lightingProfileById);
								this.lightingProfileDetail(
									this.lightingProfileById,
									this.countObj['count' + this.currentProfileId],
									this.lightingCapabilities
								);
							}
						}
					});
			}
		} catch (error) {}
	}

	public colorPickerFun() {
		try {
			if (this.isShow) {
				this.isColorPicker = true;
				this.isShow = false;
			} else {
				this.isColorPicker = false;
				this.isShow = true;
			}
		} catch (error) {}
	}

	public isToggleColorPicker(event) {
		try {
			this.isColorPicker = event;
			this.isShow = true;
		} catch (error) {}
	}

	public setLightingColor(event) {
		try {
			this.lightingProfileCurrentDetail.lightColor = '#' + event;
			/* Use cache before set    start  */
			this.getCacheList();
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
			/* Use cache before set    end */
			let colorJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingProfileCurrentDetail.lightPanelType,
				lightColor: event,
				lightLayoutVersion: 3,
			};
			this.logger.info('colorJson ', colorJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(colorJson)
					.then((response: any) => {
						this.logger.info('setLightingColor res ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response, 2);
						} else {
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.lightingProfileDetail(
								this.lightingProfileById,
								this.countObj['count' + this.currentProfileId],
								this.lightingCapabilities
							);
						}
					});
			}

			const metricsData = {
				ItemName: 'lighting_color_change',
				ItemValue: `${event}`
			};
			this.sendFeatureClickMetrics(metricsData);
		} catch (error) {}
	}

	public setLightingProfileEffect(event) {
		try {
			this.supportBrightFn(event.value);
			this.supportSpeedFn(event.value);
			this.supportColorFn(event.value);
			/* Use cache before set    start  */
			this.getCacheList();
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
			/* Use cache before set    end */
			let effectJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingProfileCurrentDetail.lightPanelType,
				lightEffectType: event.value,
				lightLayoutVersion: 3,
			};
			this.logger.info('effectJson ', effectJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(effectJson)
					.then((response: any) => {
						this.logger.info('setLightingProfileEffect res ', response);
						if (response.didSuccess) {
							this.isEffectChange = true;
							this.publicPageInfo(response, 2);
						} else {
							this.isEffectChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.isShowpageInfo(this.lightingProfileById);
							this.lightingProfileDetail(
								this.lightingProfileById,
								this.countObj['count' + this.currentProfileId],
								this.lightingCapabilities
							);
						}
					});
			}
		} catch (error) {}
	}

	public setLightingBrightness(event) {
		try {
			/* Use cache before set    start  */
			this.getCacheList();
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
			/* Use cache before set    end */
			let brightJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingProfileCurrentDetail.lightPanelType,
				lightBrightness: event[0],
				lightLayoutVersion: 3,
			};
			this.logger.info('brightJson ', brightJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(brightJson)
					.then((response: any) => {
						this.logger.info('setLightingBrightness res ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response, 2);
						} else {
							// this.getCacheList();
							// this.publicPageInfo(this.lightingProfileById,2);
							this.isValChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.lightingProfileDetail(
								this.lightingProfileById,
								this.countObj['count' + this.currentProfileId],
								this.lightingCapabilities
							);
						}
					});
			}

			const metricsData = {
				ItemName: 'lighting_brightness',
				ItemValue: `${event[0]}`
			};
			this.sendFeatureClickMetrics(metricsData);
		} catch (error) {}
	}

	public setLightingSpeed(event) {
		try {
			this.lightingProfileCurrentDetail.lightSpeed = event[0];
			/* Use cache before set    start  */
			this.getCacheList();
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
			/* Use cache before set    end */
			let speedJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingProfileCurrentDetail.lightPanelType,
				lightSpeed: event[0],
				lightLayoutVersion: 3,
			};
			this.logger.info('speedJson ', speedJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(speedJson)
					.then((response: any) => {
						this.logger.info('setLightingSpeed res ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response, 2);
						} else {
							// this.getCacheList();
							// this.publicPageInfo(this.lightingProfileById,2);
							this.isValChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.lightingProfileDetail(
								this.lightingProfileById,
								this.countObj['count' + this.currentProfileId],
								this.lightingCapabilities
							);
						}
					});
			}

			const metricsData = {
				ItemName: 'lighting_speed',
				ItemValue: `${event[0]}`
			};
			this.sendFeatureClickMetrics(metricsData);
		} catch (error) {}
	}

	public setDefaultProfile(profileId) {
		try {
			this.isColorPicker = false;
			this.isShow = true;
			/* Use cache before set    start  */
			this.getCacheDefaultList();
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
			/* Use cache before set    end */
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingDefaultProfileById(profileId)
					.then((response: any) => {
						this.logger.info('setDefaultProfile res ', response);
						if (response.didSuccess) {
							this.publicDefaultInfo(response);
						} else {
							this.getCacheDefaultList();
							this.publicDefaultInfo(this.lightingProfileById);
						}
					});
			}
		} catch (error) {}
	}

	public panelSwitchLef() {
		this.isColorPicker = false;
		this.isShow = true;
		if (this.countObj['count' + this.currentProfileId] > 0) {
			this.countObj['count' + this.currentProfileId]--;
			this.isDisabledlef[this.currentProfileId - 1] = false;
			this.isDisabledrig[this.currentProfileId - 1] = false;

			this.isShowpageInfo(this.lightingProfileById);
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
		}
		if (this.countObj['count' + this.currentProfileId] <= 0) {
			this.isDisabledlef[this.currentProfileId - 1] = true;
		}
	}

	public panelSwitchRig() {
		this.isColorPicker = false;
		this.isShow = true;
		let lenPanels =
			this.lightingCapabilities && this.lightingCapabilities.LightPanelType
				? this.lightingCapabilities.LightPanelType.length
				: 0;
		if (
			this.lightingCapabilities &&
			this.lightingCapabilities.MemoryPanelType &&
			Array.isArray(this.lightingCapabilities.MemoryPanelType) &&
			this.lightingCapabilities.MemoryPanelType.indexOf(0) === -1
		) {
			lenPanels += this.lightingCapabilities.MemoryPanelType.length;
		}
		if (lenPanels !== 0 && this.countObj['count' + this.currentProfileId] < lenPanels - 1) {
			this.countObj['count' + this.currentProfileId]++;
			this.isDisabledlef[this.currentProfileId - 1] = false;
			this.isDisabledrig[this.currentProfileId - 1] = false;
			this.isShowpageInfo(this.lightingProfileById);
			this.lightingProfileDetail(
				this.lightingProfileById,
				this.countObj['count' + this.currentProfileId],
				this.lightingCapabilities
			);
		}
		if (lenPanels !== 0 && this.countObj['count' + this.currentProfileId] >= lenPanels - 1) {
			this.isDisabledrig[this.currentProfileId - 1] = true;
		}
	}

	public getCurrentName(lightingPanelImage, lightPanelType) {
		let nameObj = lightingPanelImage.filter((element) => {
			return element.value === lightPanelType;
		});
		this.logger.info('nameObj ', nameObj);
		return nameObj;
	}

	public lightingProfileDetail(lightingProfileByIdRes, count, lightingCapabilitiesRes) {
		try {
			this.logger.info(
				`lightingProfileByIdRes:  ${JSON.stringify(
					lightingProfileByIdRes
				)} -------count: ${count} -------lightingCapabilitiesRes: ${JSON.stringify(
					lightingCapabilitiesRes
				)}`
			);
			if (lightingProfileByIdRes !== undefined) {
				if (
					lightingProfileByIdRes.lightInfo !== null &&
					lightingProfileByIdRes.lightInfo.length > 0
				) {
					//show panelImg and panelName
					let currentNameImg;
					let currentEffectName: any;
					this.lightingProfileCurrentDetail = lightingProfileByIdRes.lightInfo[count];
					if (this.lightingProfileCurrentDetail.lightSpeed === null) {
						this.lightingProfileCurrentDetail.lightSpeed = 2;
					}
					if (this.lightingProfileCurrentDetail.lightBrightness === null) {
						this.lightingProfileCurrentDetail.lightBrightness = 3;
					}
					if (this.ledlayoutversion === 3) {
						// X50
						currentNameImg = this.getCurrentName(
							this.lightingPanelImage,
							this.lightingProfileCurrentDetail.lightPanelType
						);
					} else if (this.ledlayoutversion === 5) {
						// x750
						currentNameImg = this.getCurrentName(
							this.lightingPanelImageT750,
							this.lightingProfileCurrentDetail.lightPanelType
						);
					} else if (this.ledlayoutversion === 4) {
						//T550AMD
						currentNameImg = this.getCurrentName(
							this.lightingPanelImageT550AMD,
							this.lightingProfileCurrentDetail.lightPanelType
						);
					}
					if (currentNameImg.length > 0) {
						this.lightingProfileCurrentDetail.panelName = currentNameImg[0].panelName;
						this.lightingProfileCurrentDetail.pathUrl = currentNameImg[0].pathUrl;
						// this.lightingProfileCurrentDetail.panelImage = currentNameImg[0].panelImage;
						this.lightingProfileCurrentDetail.panelImageType =
							currentNameImg[0].panelImageType;
						this.lightingProfileCurrentDetail.length = lightingCapabilitiesRes.MemoryPanelType
							? lightingCapabilitiesRes.LightPanelType.length +
							  lightingCapabilitiesRes.MemoryPanelType.length
							: lightingCapabilitiesRes.LightPanelType.length;
						if (
							lightingCapabilitiesRes.LightPanelType &&
							lightingCapabilitiesRes.LightPanelType.length !== 0 &&
							lightingCapabilitiesRes.LightPanelType.indexOf(
								this.lightingProfileCurrentDetail.lightPanelType
							) > -1
						) {
							if (
								this.ledlayoutversion === 3 &&
								lightingCapabilitiesRes.LightPanelType.indexOf(16) > -1
							) {
								this.lightingProfileCurrentDetail.panelImage =
									'assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png';
							} else if (
								this.ledlayoutversion === 5 &&
								lightingCapabilitiesRes.LightPanelType.indexOf(16) > -1
							) {
								this.lightingProfileCurrentDetail.panelImage =
									'assets/images/gaming/lighting/lighting-ui-new/T750_water.png';
							} else if (
								this.ledlayoutversion === 4 &&
								lightingCapabilitiesRes.LightPanelType.indexOf(16) > -1
							) {
								this.lightingProfileCurrentDetail.panelImage =
									'assets/images/gaming/lighting/lighting-ui-new/T550AMD_water.png';
								if (this.lightingProfileCurrentDetail.lightPanelType === 128) {
									this.lightingProfileCurrentDetail.pathUrl =
										'M112,74.863197 L112.916507,74.8674839 C126.299053,74.9928726 137,77.8531206 137,81.363197 C137,84.9131607 126.054468,87.7984431 112.459257,87.8621223 L112,87.863197 C98.1928813,87.863197 87,84.9530479 87,81.363197 C87,77.7733462 98.1928813,74.863197 112,74.863197 Z M142.080665,63 L142.080665,76.8631566 L141.194164,76.8083655 C130.186845,76.0682405 122,73.2702241 122,69.9315783 C122,66.5039019 130.629298,63.646073 142.080665,63 Z';
									this.lightingProfileCurrentDetail.panelName =
										'gaming.lightingNewversion.machineName.name6';
								} else if (
									this.lightingProfileCurrentDetail.lightPanelType === 32
								) {
									this.lightingProfileCurrentDetail.panelName =
										'gaming.lightingNewversion.machineName.name3';
								}
							} else {
								this.lightingProfileCurrentDetail.panelImage =
									currentNameImg[0].panelImage;
							}
						} else {
							this.lightingProfileCurrentDetail.panelImage =
								currentNameImg[0].panelImage;
						}
					}
					//Gets the returned list of effects
					if (
						lightingCapabilitiesRes.LightPanelType &&
						lightingCapabilitiesRes.LightPanelType.length !== 0 &&
						lightingCapabilitiesRes.LightPanelType.indexOf(
							this.lightingProfileCurrentDetail.lightPanelType
						) > -1
					) {
						// common light
						if (
							lightingCapabilitiesRes.SupportRGBSetList.indexOf(
								this.lightingProfileCurrentDetail.lightPanelType
							) > -1
						) {
							//Rgb effect list
							this.lightingEffectRgbData.dropOptions = this.lightingEffectRgbData.dropOptions.filter(
								(i) => lightingCapabilitiesRes.LedType_Complex.includes(i.value)
							);
							this.lightingEffectList = this.lightingEffectRgbData;
							currentEffectName = this.getCurrentName(
								this.lightingEffectRgbData.dropOptions,
								this.lightingProfileCurrentDetail.lightEffectType
							);
						} else {
							//single effect list
							this.lightingEffectSingleData.dropOptions = this.lightingEffectSingleData.dropOptions.filter(
								(i) => lightingCapabilitiesRes.LedType_simple.includes(i.value)
							);
							this.lightingEffectList = this.lightingEffectSingleData;
							currentEffectName = this.getCurrentName(
								this.lightingEffectSingleData.dropOptions,
								this.lightingProfileCurrentDetail.lightEffectType
							);
						}
						this.lightingProfileCurrentDetail.lightBrightnessMax =
							lightingCapabilitiesRes.BrightAdjustLevel;
						this.lightingProfileCurrentDetail.lightSpeedMax =
							lightingCapabilitiesRes.SpeedSetLevel;
					}
					if (
						lightingCapabilitiesRes.MemoryPanelType &&
						lightingCapabilitiesRes.MemoryPanelType.length !== 0 &&
						lightingCapabilitiesRes.MemoryPanelType.indexOf(
							this.lightingProfileCurrentDetail.lightPanelType
						) > -1
					) {
						// memory light
						const memoryEffect = new LightingDataList().lightingEffectRgbData;
						memoryEffect.dropOptions = memoryEffect.dropOptions.filter((i) =>
							lightingCapabilitiesRes.MemoryEffect.includes(i.value)
						);
						this.lightingEffectList = memoryEffect;
						currentEffectName = this.getCurrentName(
							memoryEffect.dropOptions,
							this.lightingProfileCurrentDetail.lightEffectType
						);
						this.lightingProfileCurrentDetail.lightBrightnessMax =
							lightingCapabilitiesRes.MemoryBrightLevel;
						this.lightingProfileCurrentDetail.lightSpeedMax =
							lightingCapabilitiesRes.MemorySpeedLevel;
					}

					this.logger.info('effectList: ', this.lightingEffectList);
					this.lightingEffectList.curSelected = this.lightingProfileCurrentDetail.lightEffectType;
					if (currentEffectName.length > 0) {
						this.lightingProfileCurrentDetail.currentEffectName =
							currentEffectName[0].name;
					}
				}
				this.logger.info('lightingProfileDetail: ', this.lightingProfileCurrentDetail);
			}
		} catch (error) {}
	}

	public supportBrightFn(val) {
		if (
			this.lightingCapabilities.SupportBrightnessSetList.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			//support bright of panel
			if (
				this.lightingCapabilities.SupportRGBSetList.indexOf(
					this.lightingProfileCurrentDetail.lightPanelType
				) > -1
			) {
				if (val === 268435456) {
					this.supportBrightness = false;
				} else {
					this.supportBrightness = true;
				}
			} else {
				if (val === 1) {
					this.supportBrightness = true;
				} else {
					this.supportBrightness = false;
				}
				if (this.ledlayoutversion === 3) {
					if (this.lightingCapabilities.SupportBrightnessSetList.indexOf(128) > -1) {
						//T550G
						this.supportBrightness = false;
					}
				}
			}
		} else if (
			this.lightingCapabilities.MemoryBrightLevel &&
			this.lightingCapabilities.MemoryBrightLevel !== 0 &&
			this.lightingCapabilities.MemoryPanelType.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			if (val === 268435456 || val === 4 || val === 256) this.supportBrightness = false;
			else this.supportBrightness = true;
		} else {
			this.supportBrightness = false;
		}
	}

	public supportSpeedFn(val) {
		if (
			this.lightingCapabilities.SupportSpeedSetList.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			//support speed of panel
			if (
				this.lightingCapabilities.SupportRGBSetList.indexOf(
					this.lightingProfileCurrentDetail.lightPanelType
				) > -1
			) {
				//Rgb color
				if (val === 1 || val === 64 || val === 268435456) {
					this.supportSpeed = false;
				} else {
					this.supportSpeed = true;
				}
			}
		} else if (
			this.lightingCapabilities.MemorySpeedLevel &&
			this.lightingCapabilities.MemorySpeedLevel !== 0 &&
			this.lightingCapabilities.MemoryPanelType.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			if (val === 268435456 || val === 1 || val === 256) this.supportSpeed = false;
			else this.supportSpeed = true;
		} else {
			this.supportSpeed = false;
		}
	}

	public supportColorFn(val) {
		if (
			this.lightingCapabilities.SupportRGBSetList.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			//rgb color
			if (val === 1 || val === 2 || val === 4 || val === 32) {
				this.supportColor = true;
			} else {
				this.supportColor = false;
			}
		} else if (
			this.lightingCapabilities.MemoryPanelType.indexOf(
				this.lightingProfileCurrentDetail.lightPanelType
			) > -1
		) {
			if (val !== 256 && val !== 268435456) this.supportColor = true;
			else this.supportColor = false;
		} else {
			this.supportColor = false;
		}
	}

	public isShowpageInfo(res) {
		if (res.lightInfo !== null && res.lightInfo.length > 0) {
			this.lightingProfileCurrentDetail =
				res.lightInfo[this.countObj['count' + this.currentProfileId]];
		}
		this.supportBrightFn(this.lightingProfileCurrentDetail.lightEffectType);
		this.supportSpeedFn(this.lightingProfileCurrentDetail.lightEffectType);
		this.supportColorFn(this.lightingProfileCurrentDetail.lightEffectType);
	}

	public getCacheList() {
		if (this.currentProfileId !== 0) {
			if (
				this.localCacheService.getLocalCacheValue(
					LocalStorageKey['LightingProfileByIdDesk' + this.currentProfileId]
				) !== undefined
			) {
				this.lightingProfileById = this.localCacheService.getLocalCacheValue(
					LocalStorageKey['LightingProfileByIdDesk' + this.currentProfileId]
				);
				this.logger.info('this.lightingProfileById  getCache ', this.lightingProfileById);
			}
		}
	}

	public setCacheList() {
		if (this.currentProfileId !== 0) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey['LightingProfileByIdDesk' + this.currentProfileId],
				this.lightingProfileById
			);
		}
	}

	public getCacheDefaultList() {
		if (this.currentProfileId !== 0) {
			if (
				this.localCacheService.getLocalCacheValue(
					LocalStorageKey['LightingProfileDeskDefault' + this.currentProfileId]
				) !== undefined
			) {
				this.lightingProfileById = this.localCacheService.getLocalCacheValue(
					LocalStorageKey['LightingProfileByIdDesk' + this.currentProfileId]
				);
			}
		}
	}

	public setCacheDefaultList() {
		if (this.currentProfileId !== 0) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey['LightingProfileDeskDefault' + this.currentProfileId],
				this.lightingProfileById
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey['LightingProfileByIdDesk' + this.currentProfileId],
				this.lightingProfileById
			);
		}
	}

	public imgDefaultOff() {
		if (this.currentProfileId === 0) {
			if (this.ledlayoutversion === 3) {
				this.getCurrentPanelImg(
					4,
					'assets/images/gaming/lighting/lighting-ui-new/T550_wind_cold.png'
				);
				this.getCurrentPanelImg(
					16,
					'assets/images/gaming/lighting/lighting-ui-new/T550_water_cold.png'
				);
				this.getCurrentPanelImg(
					64,
					'assets/images/gaming/lighting/lighting-ui-new/T550_big_y.png'
				);
				this.getCurrentPanelImg(
					128,
					'assets/images/gaming/lighting/lighting-ui-new/T550G_front_line.png'
				);
				this.getCurrentPanelImg(
					256,
					'assets/images/gaming/lighting/lighting-ui-new/T550_front.png'
				);
			} else if (this.ledlayoutversion === 5) {
				this.getCurrentPanelImg(
					4,
					'assets/images/gaming/lighting/lighting-ui-new/T750_wind.png'
				);
				this.getCurrentPanelImg(
					16,
					'assets/images/gaming/lighting/lighting-ui-new/T750_water.png'
				);
				this.getCurrentPanelImg(
					256,
					'assets/images/gaming/lighting/lighting-ui-new/T750_fct.png'
				);
			} else if (this.ledlayoutversion === 4) {
				this.getCurrentPanelImg(
					8,
					'assets/images/gaming/lighting/lighting-ui-new/T550AMD_wind.png'
				);
				this.getCurrentPanelImg(
					16,
					'assets/images/gaming/lighting/lighting-ui-new/T550AMD_water.png'
				);
				this.getCurrentPanelImg(
					256,
					'assets/images/gaming/lighting/lighting-ui-new/T550AMD_fct.png'
				);
			}
		}
	}

	public getCurrentPanelImg(panelId, imgUrl) {
		if (this.lightingCapabilities.LightPanelType.indexOf(panelId) > -1) {
			this.lightingProfileCurrentDetail.panelImage = imgUrl;
		}
	}

	public publicPageInfo(response, key) {
		this.lightingProfileById = response;
		this.currentProfileId = response.profileId;
		if (key === 1) {
			this.isShowpageInfo(this.lightingProfileById);
		}
		this.lightingProfileDetail(
			response,
			this.countObj['count' + this.currentProfileId],
			this.lightingCapabilities
		);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ProfileId, response.profileId);
		this.setCacheList();
	}

	public initProfileId() {
		this.logger.info('this.currentProfileId  init ', this.currentProfileId);
		if (this.currentProfileId === null || this.currentProfileId === undefined) {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileId().then((response: any) => {
					if (response.didSuccess) {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.ProfileId,
							response.profileId
						);
						this.currentProfileId = response.profileId;
						this.getLightingProfileById(this.currentProfileId);
					}
				});
			}
		} else {
			if (
				this.localCacheService.getLocalCacheValue(LocalStorageKey.ProfileId) !== undefined
			) {
				this.currentProfileId = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.ProfileId
				);
			}
		}
		this.logger.info('this.currentProfileId ', this.currentProfileId);
	}

	public publicDefaultInfo(response) {
		this.lightingProfileById = response;
		this.currentProfileId = response.profileId;
		this.countObj['count' + this.currentProfileId] = 0;
		this.isDisabledrig[this.currentProfileId - 1] = false;
		this.isDisabledlef[this.currentProfileId - 1] = true;
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ProfileId, response.profileId);
		this.isShowpageInfo(this.lightingProfileById);
		this.lightingProfileDetail(
			response,
			this.countObj['count' + this.currentProfileId],
			this.lightingCapabilities
		);
		this.setCacheDefaultList();
	}

	public replaceString(str: any) {
		return str.replace(/ /g, '_');
	}

	/**
	 * metrics collection for lighting feature of desktop machine
	 * @param metricsdata
	 */
	public sendFeatureClickMetrics(metricsdata: any) {
		try {
			const metricData = {
				ItemType: metricsdata.ItemType ? metricsdata.ItemType : 'FeatureClick',
				ItemParent: metricsdata.ItemParent ? metricsdata.ItemParent : 'Gaming.Lighting'
			};
			Object.keys(metricsdata).forEach((key) => {
				if (metricsdata[key]) {
					metricData[key] = metricsdata[key];
				}
			});
			if (this.metrics && this.metrics.sendMetrics) {
				this.metrics.sendMetrics(metricData);
			}
		} catch (error) {}
	}
}

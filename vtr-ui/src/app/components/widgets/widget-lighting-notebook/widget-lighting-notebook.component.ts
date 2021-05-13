import { Component, OnInit, Input, HostListener, NgZone } from '@angular/core';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from '../../../services/metric/metrics.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-lighting-notebook',
	templateUrl: './widget-lighting-notebook.component.html',
	styleUrls: ['./widget-lighting-notebook.component.scss'],
})
export class WidgetLightingNotebookComponent implements OnInit {
	@Input() currentProfileId: number;
	public color: string;
	public isDefault: boolean;
	public isDisabled = false;
	public lightingCapabilities: any = LightingDataList.lightingCapality;
	public lightingProfileById: any;
	public lightingEffectData: any = LightingDataList.lightingEffectNoteData;
	public lightingEffectList: any;
	public lightingCurrentDetail: any = LightingDataList.lightingCurrentDetailNote;
	public isProfileOff = true;
	public isColorPicker = false;
	public isShow = true;
	public lightingArea: any;
	public toggleStatus: any;
	public isSupportSpeed: boolean;
	public ledSwitchButtonFeature: boolean;
	public lightInfo: any;
	public isSetDefault: boolean;
	public isEffectChange: boolean;
	public isValChange = true;
	public showOptions = false;

	constructor(
		private ngZone: NgZone,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private gamingLightingService: GamingLightingService,
		public shellServices: VantageShellService,
		private logger: LoggerService,
		private metrics: MetricService
	) {}

	@HostListener('document:click', ['$event']) onClick(event) {
		this.isSetDefault = false;
	}

	ngOnInit() {
		this.initProfileId();
		this.getCacheList();
		if (
			this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingCapabilitiesNewversionNote
			) !== undefined
		) {
			this.lightingCapabilities = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LightingCapabilitiesNewversionNote
			);
			this.logger.info('this.lightingCapabilities cache ', this.lightingCapabilities);
			this.getLightingCapabilitiesFromcache(this.lightingCapabilities);
		}
		if (this.lightingProfileById !== undefined) {
			this.getLightingProfileByIdFromcache(this.lightingProfileById);
		}
		this.getLightingCapabilities();

		this.ledSwitchButtonFeature = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LedSwitchButtonFeature
		);
		this.logger.info('ledSwitchButtonFeature: ', this.ledSwitchButtonFeature);
		if (this.ledSwitchButtonFeature) {
			this.regLightingProfileIdChangeEvent();
		}
	}

	public getLightingCapabilitiesFromcache(res) {
		try {
			if (res !== undefined) {
				this.lightingCapabilities = res;
				this.getEffectList();
			}
		} catch (error) {}
	}

	public getLightingProfileByIdFromcache(res) {
		try {
			if (res !== undefined) {
				let profileId;
				if (res.lightInfo !== null && res.lightInfo.length > 0) {
					this.ifDisabledKeyboard(res.lightInfo[0].lightEffectType);
				}
				if (
					this.localCacheService.getLocalCacheValue(LocalStorageKey.ProfileId) !==
					undefined
				) {
					profileId = this.localCacheService.getLocalCacheValue(
						LocalStorageKey.ProfileId
					);
					this.currentProfileId = profileId;
				}
				this.getLightingCurrentDetail(res);
			}
		} catch (error) {}
	}

	public getLightingCapabilities() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingCapabilities().then((response: any) => {
					this.logger.info('LightingCapabilities: ', response);
					if (response) {
						this.lightingCapabilities = response;
						this.getEffectList();
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.LightingCapabilitiesNewversionNote,
							response
						);
						this.getLightingProfileById(this.currentProfileId);
					}
				});
			}
		} catch (error) {}
	}

	public getLightingProfileById(currentProfileId) {
		try {
			if (currentProfileId === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
			}
			//if profileId is 0,no need to use interfae
			if (currentProfileId === 0) { return; };
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.getLightingProfileById(currentProfileId)
					.then((response: any) => {
						this.logger.info('getLightingProfileById: ', response);
						this.publicProfileIdInfo(response);
					});
			}
		} catch (error) {}
	}

	public setLightingProfileId(event) {
		try {
			this.isColorPicker = false;
			this.isShow = true;
			const profileId = Number(event.target.value);
			this.currentProfileId = profileId;
			if (this.currentProfileId === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
			}

			/* Use cache before set    start  */
			this.getCacheList();
			if (this.lightingProfileById !== undefined) {
				if (
					this.lightingProfileById.lightInfo !== null &&
					this.lightingProfileById.lightInfo.length > 0
				) {
					this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
				}
				this.getLightingCurrentDetail(this.lightingProfileById);
			}

			/* Use cache before set    end */

			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileId(1, this.currentProfileId)
					.then((response: any) => {
						this.logger.info('setLightingProfileId: ', response);
						if (response.didSuccess) {
							this.publicProfileIdInfo(response);
						} else {
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							if (this.currentProfileId === 0) {
								this.isProfileOff = true;
							} else {
								this.isProfileOff = false;
								this.getCacheList();
								if (this.lightingProfileById !== undefined) {
									if (
										this.lightingProfileById.lightInfo !== null &&
										this.lightingProfileById.lightInfo.length > 0
									) {
										this.ifDisabledKeyboard(
											this.lightingProfileById.lightInfo[0].lightEffectType
										);
									}
									this.getLightingCurrentDetail(this.lightingProfileById);
								}
							}
						}
					});
			}
		} catch (error) {}
	}

	public regLightingProfileIdChangeEvent() {
		this.gamingLightingService.regLightingProfileIdChangeEvent();
		this.shellServices.registerEvent(
			EventTypes.gamingLightingProfileIdChangeEvent,
			this.getProfileEvent.bind(this)
		);
	}

	public getProfileEvent(profileId) {
		this.ngZone.run(() => {
			this.logger.info('profileId event ', profileId);
			if (this.currentProfileId === profileId){ return; };
			this.isColorPicker = false;
			this.showOptions = false;
			this.isShow = true;
			this.currentProfileId = profileId;
			if (this.isSetDefault) {
				this.getCacheDefaultList();
			} else {
				this.getCacheList();
			}
			if (this.lightingProfileById !== undefined) {
				if (
					this.lightingProfileById.lightInfo !== null &&
					this.lightingProfileById.lightInfo.length > 0
				) {
					this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
				}
				this.getLightingCurrentDetail(this.lightingProfileById);
				this.getLightingProfileById(this.currentProfileId);
			} else {
				this.getLightingProfileById(this.currentProfileId);
			}
		});
	}

	public setLightingProfileEffect(event) {
		try {
			this.ifDisabledKeyboard(event.value);
			/* Use cache before set    start  */
			this.getCacheList();
			this.getLightingCurrentDetail(this.lightingProfileById);
			/* Use cache before set    end */
			const effectJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingCurrentDetail.lightPanelType,
				lightEffectType: event.value,
				lightLayoutVersion: 2,
			};
			this.logger.info('effectJson: ', effectJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(effectJson)
					.then((response: any) => {
						this.logger.info('setLightingProfileEffect: ', response);
						if (response.didSuccess) {
							this.isEffectChange = true;
							this.publicPageInfo(response);
						} else {
							this.isEffectChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							if (this.lightingProfileById !== undefined) {
								if (
									this.lightingProfileById.lightInfo !== null &&
									this.lightingProfileById.lightInfo.length > 0
								) {
									this.ifDisabledKeyboard(
										this.lightingProfileById.lightInfo[0].lightEffectType
									);
								}
								this.getLightingCurrentDetail(this.lightingProfileById);
							}
						}
					});
			}
		} catch (error) {}
	}

	public setLightingBrightness(event) {
		try {
			/* Use cache before set    start  */
			this.getCacheList();
			this.getLightingCurrentDetail(this.lightingProfileById);
			/* Use cache before set    end */

			const brightJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingCurrentDetail.lightPanelType,
				lightBrightness: event[0],
				lightLayoutVersion: 2,
			};
			this.logger.info('brightJson: ', brightJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(brightJson)
					.then((response: any) => {
						this.logger.info('setLightingBrightness: ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response);
						} else {
							this.isValChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.getLightingCurrentDetail(this.lightingProfileById);
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
			/* Use cache before set    start  */
			this.getCacheList();
			this.getLightingCurrentDetail(this.lightingProfileById);
			/* Use cache before set    end */

			const speedJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingCurrentDetail.lightPanelType,
				lightSpeed: event[0],
				lightLayoutVersion: 2,
			};
			this.logger.info('speedJson: ', speedJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(speedJson)
					.then((response: any) => {
						this.logger.info('setLightingSpeed: ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response);
						} else {
							this.isValChange = false;
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.getLightingCurrentDetail(this.lightingProfileById);
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
			this.isDefault = true;
			this.isSetDefault = true;
			/* Use cache before set  start*/
			this.getCacheDefaultList();
			this.getLightingCurrentDetail(this.lightingProfileById);
			/* Use cache before set  end*/

			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingDefaultProfileById(profileId)
					.then((response: any) => {
						this.logger.info('setDefaultProfile: ', response);
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

	public changeIsDefaultFn(status) {
		this.isDefault = false;
	}

	public selectLightingArea(event) {
		try {
			this.showOptions = false;
			this.lightingArea = event.area;
			this.color = event.color;
			if (this.isShow) {
				this.isColorPicker = true;
				this.isShow = false;
			} else {
				this.isColorPicker = false;
				this.isShow = true;
			}
		} catch (error) {}
	}

	public isEffectListFn(event) {
		this.showOptions = event;
	}

	public isToggleColorPicker(event) {
		try {
			this.isColorPicker = event;
			this.isShow = true;
		} catch (error) {}
	}

	public setLightingColor(event) {
		try {
			/* Use cache before set    start  */
			this.getCacheList();
			this.getLightingCurrentDetail(this.lightingProfileById);
			/* Use cache before set    end */
			this.color = event;
			const colorJson: any = {
				profileId: this.currentProfileId,
				lightPanelType: this.lightingArea,
				lightColor: event,
				lightLayoutVersion: 2,
			};
			this.logger.info('colorJson: ', colorJson);
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService
					.setLightingProfileEffectColor(colorJson)
					.then((response: any) => {
						this.logger.info('setLightingColor: ', response);
						if (response.didSuccess) {
							this.publicPageInfo(response);
						} else {
							this.currentProfileId = this.localCacheService.getLocalCacheValue(
								LocalStorageKey.ProfileId
							);
							this.getCacheList();
							this.getLightingCurrentDetail(this.lightingProfileById);
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

	public getCurrentName(lightingPanelImage, lightPanelType) {
		const nameObj = lightingPanelImage.filter(
			(element) => element.value === lightPanelType
		);
		this.logger.info('nameObj: ', nameObj);
		return nameObj;
	}

	public getLightingCurrentDetail(res) {
		try {
			this.logger.info('detaile: ', res);
			if (this.currentProfileId === 0) {
				this.isProfileOff = true;
			} else {
				this.isProfileOff = false;
			}
			if (res !== undefined) {
				if (res.lightInfo !== null && res.lightInfo.length > 0) {
					this.lightingCurrentDetail = res.lightInfo[0];
					this.lightInfo = res.lightInfo;
					const currentName = this.getCurrentName(
						this.lightingEffectData.dropOptions,
						this.lightingCurrentDetail.lightEffectType
					);
					if (currentName.length > 0) {
						this.lightingCurrentDetail.lightingEffectName = currentName[0].name;
					}
					this.lightingEffectList.curSelected = this.lightingCurrentDetail.lightEffectType;
					this.effectSupportSpeed(this.lightingCurrentDetail.lightEffectType);
					this.logger.info('this.lightingCurrentDetail: ', this.lightingCurrentDetail);
				}
			}
		} catch (error) {}
	}

	public getEffectList() {
		this.lightingEffectData.dropOptions = this.lightingEffectData.dropOptions.filter((i) =>
			this.lightingCapabilities.LedType_Complex.includes(i.value)
		);
		this.lightingEffectList = this.lightingEffectData;
		this.logger.info('effectList: ', this.lightingEffectList);
	}

	public getCacheList() {
		this.lightingProfileById = undefined;
		this.toggleStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.KeyboardToggleStatusLNBx50
		);
		this.logger.info(
			`this.toggleStatus:  ${this.toggleStatus} ----this.currentProfileId: ${this.currentProfileId}`
		);
		if (this.toggleStatus !== undefined) {
			if (this.currentProfileId !== 0) {
				if (this.toggleStatus['profileId' + this.currentProfileId].status !== 'undefined') {
					if (this.toggleStatus['profileId' + this.currentProfileId].status) {
						if (
							this.localCacheService.getLocalCacheValue(
								LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId]
							) !== undefined
						) {
							this.lightingProfileById = this.localCacheService.getLocalCacheValue(
								LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId]
							);
						}
					} else {
						if (
							this.localCacheService.getLocalCacheValue(
								LocalStorageKey[
									'LightingProfileByIdNoteOff' + this.currentProfileId
								]
							) !== undefined
						) {
							this.lightingProfileById = this.localCacheService.getLocalCacheValue(
								LocalStorageKey[
									'LightingProfileByIdNoteOff' + this.currentProfileId
								]
							);
						}
					}
				}
			}
		}
		this.logger.info('this.lightingProfileById: ', this.lightingProfileById);
	}

	public setCacheList() {
		this.toggleStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.KeyboardToggleStatusLNBx50
		);
		if (this.toggleStatus !== undefined) {
			if (this.currentProfileId !== 0) {
				if (this.toggleStatus['profileId' + this.currentProfileId].status !== 'undefined') {
					if (this.toggleStatus['profileId' + this.currentProfileId].status) {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId],
							this.lightingProfileById
						);
					} else {
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey['LightingProfileByIdNoteOff' + this.currentProfileId],
							this.lightingProfileById
						);
					}
				}
			}
		}
	}

	public setCacheInitList() {
		if (this.currentProfileId !== 0) {
			const isDiffColor = this.gamingLightingService.checkAreaColorFn(
				this.lightingProfileById.lightInfo
			);
			if (isDiffColor) {
				const lightcolorList = this.getColorList(
					JSON.parse(JSON.stringify(this.lightingProfileById))
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId],
					this.lightingProfileById
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey['LightingProfileByIdNoteOff' + this.currentProfileId],
					lightcolorList
				);
			} else {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId],
					this.lightingProfileById
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey['LightingProfileByIdNoteOff' + this.currentProfileId],
					this.lightingProfileById
				);
			}
		}
	}

	public setCacheDafaultList() {
		this.toggleStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.KeyboardToggleStatusLNBx50
		);
		if (this.toggleStatus !== undefined) {
			if (this.currentProfileId !== 0) {
				if (this.toggleStatus['profileId' + this.currentProfileId].status !== 'undefined') {
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey['LightingProfileByIdDefault' + this.currentProfileId],
						this.lightingProfileById
					);
					this.setCacheInitList();
				}
			}
		}
	}

	public getCacheDefaultList() {
		this.lightingProfileById = undefined;
		this.toggleStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.KeyboardToggleStatusLNBx50
		);
		if (this.toggleStatus !== undefined) {
			if (this.currentProfileId !== 0) {
				if (this.toggleStatus['profileId' + this.currentProfileId].status !== 'undefined') {
					if (
						this.localCacheService.getLocalCacheValue(
							LocalStorageKey['LightingProfileByIdDefault' + this.currentProfileId]
						) !== undefined
					) {
						this.lightingProfileById = this.localCacheService.getLocalCacheValue(
							LocalStorageKey['LightingProfileByIdDefault' + this.currentProfileId]
						);
					}
				}
			}
		}
	}

	public getColorList(colorList) {
		if (colorList.lightInfo.length > 0) {
			const newList = colorList.lightInfo.map((_) => colorList.lightInfo[0]);
			return {
				...colorList,
				lightInfo: newList,
			};
		}
	}

	public ifDisabledKeyboard(value) {
		if (value === 1024 || value === 32 || value === 4096 || value === 8192) {
			this.isDisabled = true;
		} else {
			this.isDisabled = false;
		}
	}

	public effectSupportSpeed(value) {
		if (value === 1 || value === 1024) {
			this.isSupportSpeed = false;
		} else {
			this.isSupportSpeed = true;
		}
	}

	public initProfileId() {
		this.logger.info('this.currentProfileId init: ', this.currentProfileId);
		// Version 3.8 protocol
		this.currentProfileId = this.localCacheService.getLocalCacheValue(LocalStorageKey.ProfileId, 0);
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.getLightingProfileId().then((response: any) => {
				if (response.didSuccess) {
					this.currentProfileId = response.profileId;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.ProfileId,
						response.profileId
					);
					this.getLightingProfileById(this.currentProfileId);
				}
			});
		}
		this.logger.info('this.currentProfileId: ', this.currentProfileId);
	}

	public publicPageInfo(response) {
		this.lightingProfileById = response;
		this.currentProfileId = response.profileId;
		this.getLightingCurrentDetail(response);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ProfileId, response.profileId);
		this.setCacheList();
	}

	public publicProfileIdInfo(response) {
		if (response !== undefined) {
			let toggleOnCache: any;
			let toggleOffCache: any;
			this.lightingProfileById = response;
			this.currentProfileId = response.profileId;
			if (
				this.lightingProfileById.lightInfo !== null &&
				this.lightingProfileById.lightInfo.length > 0
			) {
				this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
			}
			this.getLightingCurrentDetail(response);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ProfileId,
				response.profileId
			);
			if (this.currentProfileId !== 0) {
				if (
					this.localCacheService.getLocalCacheValue(
						LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId]
					) !== undefined
				) {
					toggleOnCache = this.localCacheService.getLocalCacheValue(
						LocalStorageKey['LightingProfileByIdNoteOn' + this.currentProfileId]
					);
				}
				if (
					this.localCacheService.getLocalCacheValue(
						LocalStorageKey['LightingProfileByIdNoteOff' + this.currentProfileId]
					) !== undefined
				) {
					toggleOffCache = this.localCacheService.getLocalCacheValue(
						LocalStorageKey['LightingProfileByIdNoteOff' + this.currentProfileId]
					);
				}
			}
			if (toggleOnCache !== undefined && toggleOffCache !== undefined) {
				this.setCacheList();
			} else {
				this.setCacheInitList();
			}
		}
	}

	public publicDefaultInfo(response) {
		if (response !== undefined) {
			this.lightingProfileById = response;
			this.currentProfileId = response.profileId;
			if (
				this.lightingProfileById.lightInfo !== null &&
				this.lightingProfileById.lightInfo.length > 0
			) {
				this.ifDisabledKeyboard(this.lightingProfileById.lightInfo[0].lightEffectType);
			}
			this.getLightingCurrentDetail(response);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ProfileId,
				response.profileId
			);
			this.setCacheDafaultList();
		}
	}

	/**
	 * metrics collection for lighting feature of notebook machine
	 param metricsdata
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

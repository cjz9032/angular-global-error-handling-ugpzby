import { ContainerAppSendMessageType } from '../communication/app-message-type';
import { ContainerAppSendHandler } from '../communication/container-app-send.handler';
import { subAppConfigList } from 'src/sub-app-config/sub-app-config';
import { ISubAppConfig } from 'src/sub-app-config/sub-app-config-base';
import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../logger/logger.service';
import { LocalCacheService } from '../local-cache/local-cache.service';

export class SelfSelectConfig {
	public customtags?: string;
	public segment?: string;
	public smbRole?: string;
}

export enum SegmentConst {
	ConsumerBase = 'Consumer',
	ConsumerGaming = 'Consumer_Gaming',
	ConsumerEducation = 'Consumer_Education',
	SMB = 'SMB',
	Commercial = 'Commercial',
	Gaming = 'Gaming',
}

export class SegmentConstHelper {
	/**
	 * This method used for common Consumer features
	 * Currently the big Consumer changed to ConsumerBase, ConsumerGaming, ConsumerEducation
	 *
	 * @param segment Current segment value
	 */
	public static includedInCommonConsumer(segment): boolean {
		return [
			SegmentConst.ConsumerBase,
			SegmentConst.ConsumerGaming,
			SegmentConst.ConsumerEducation,
		].includes(segment);
	}
}

@Injectable({
	providedIn: 'root',
})
export class SelfSelectService {
	public interests = [
		{ label: 'games', checked: false },
		{ label: 'news', checked: false },
		{ label: 'entertainment', checked: false },
		{ label: 'technology', checked: false },
		{ label: 'sports', checked: false },
		{ label: 'arts', checked: false },
		{ label: 'regionalNews', checked: false },
		{ label: 'politics', checked: false },
		{ label: 'music', checked: false },
		{ label: 'science', checked: false },
	];
	public usageType = null; // for User Profile UI to show selected segment
	public checkedArray: string[] = [];
	public userProfileEnabled = true;
	public userSelectedInFre = false;

	private frePersona = null;
	private frePersonaToSegmentMap = {
		personal: SegmentConst.ConsumerBase,
		gaming: SegmentConst.ConsumerGaming,
		education: SegmentConst.ConsumerEducation,
		work: SegmentConst.SMB,
	};
	private _savedSegment = null; // for feature filter use
	private get savedSegment() {
		return this._savedSegment;
	}
	private set savedSegment(value) {
		if (value && this._savedSegment !== value) {
			this._savedSegment = value;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.LocalInfoSegment,
				this._savedSegment
			);
			this.commonService.sendNotification(SelfSelectEvent.SegmentChange, this.savedSegment);
			this.commonService.sendReplayNotification(
				SelfSelectEvent.SegmentChange,
				this.savedSegment
			);
		}
	}
	private selfSelect: any;
	private vantageStub: any;
	private machineInfo: any;
	private segmentSelected: boolean; // Only for UI to show default segment

	constructor(
		private containerAppSendHandler: ContainerAppSendHandler,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private logger: LoggerService,
		private localCacheService: LocalCacheService,
		public deviceService: DeviceService
	) {
		this.selfSelect = this.vantageShellService.getSelfSelect();
		this.vantageStub = this.vantageShellService.getVantageStub();
		this.initialize();
	}

	/**
	 * This function is exposed to get current segment for feature filter
	 * The possible values of response are:
	 * Consumer, SMB, Commercial, Gaming
	 */
	public async getSegment() {
		if (!this.savedSegment) {
			await this.initialize();
		}
		return this.savedSegment;
	}

	/**
	 * This function is exposed for User Profile UI in Preference Settings page and welcome tutorial page
	 * It will response the profile config for UI to show
	 */
	public async getConfig() {
		if (!this.savedSegment) {
			await this.initialize();
		}
		const config = { usageType: this.usageType, interests: this.interests };
		return config;
	}

	/**
	 * This function is exposed for UI to save User Profile Config
	 *
	 * @param changedConfig Updated config from UI
	 * @param reloadRequired A flag to reload vantage when segment change
	 */
	public saveConfig(changedConfig, reloadRequired?) {
		try {
			const reloadNecessary =
				reloadRequired === true && this.savedSegment !== changedConfig.usageType;
			this.interests = this.commonService.cloneObj(changedConfig.interests);
			this.usageType = changedConfig.usageType;
			this.savedSegment = this.usageType;

			this.interests.forEach((item) => {
				if (item && item.checked && !this.checkedArray.includes(item.label)) {
					this.checkedArray.push(item.label);
				}
				if (item && !item.checked && this.checkedArray.includes(item.label)) {
					this.checkedArray = this.checkedArray.filter((e) => e !== item.label);
				}
			});
			const config = {
				customtags: this.checkedArray.join(','),
				segment: this.usageType,
			};
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ChangedSelfSelectConfig,
				config
			);
			this.syncConfigToService(config);
			if (reloadNecessary) {
				this.reloadVantage();
			}
		} catch (error) {
			this.logger.error('saveConfig failed for error: ', JSON.stringify(error));
		}
		this.setSegmentInAllSubApp();
	}

	private reloadVantage() {
		if (this.vantageStub && typeof this.vantageStub.refresh === 'function') {
			this.vantageStub.refresh();
		} else {
			window.open(window.location.origin, '_self');
		}
	}

	private async initialize() {
		let config = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ChangedSelfSelectConfig
		);
		this.machineInfo = await this.deviceService.getMachineInfo();
		this.userProfileEnabled = this.checkUserProfileEnabled();
		if (
			!config ||
			!config.segment ||
			!this.isSegmentMatchCurrentMachine(config.segment, this.machineInfo)
		) {
			const defaultSegment = this.calcDefaultSegment(this.machineInfo);
			config = {
				customtags: '',
				segment: defaultSegment,
			};
			const freSegment = await this.getPersonaFromLenovoWelcome();
			if (defaultSegment !== SegmentConst.Gaming && freSegment) {
				this.userSelectedInFre = true;
				config.segment = freSegment;
				config.segmentSelectedInFre = this.userSelectedInFre;
			}
			if (defaultSegment === SegmentConst.Gaming || this.userSelectedInFre) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ChangedSelfSelectConfig,
					config
				);
				this.segmentSelected = true;
			} else {
				this.localCacheService.removeLocalCacheValue(
					LocalStorageKey.ChangedSelfSelectConfig
				);
			}
		} else {
			this.segmentSelected = true;
			if (config.segmentSelectedInFre === true) {
				this.userSelectedInFre = true;
			}
		}
		this.initSegmentAndInterest(config);
		this.syncConfigToService(config);
	}

	private checkUserProfileEnabled() {
		return !this.isArm(this.machineInfo);
	}

	private isSegmentMatchCurrentMachine(segment, machineInfo) {
		let result = true;
		if (
			(machineInfo && machineInfo.isGaming && segment !== SegmentConst.Gaming) ||
			(machineInfo && !machineInfo.isGaming && segment === SegmentConst.Gaming)
		) {
			result = false;
		}
		return result;
	}

	private initSegmentAndInterest(config) {
		this.savedSegment = config.segment;
		this.usageType = this.segmentSelected ? this.savedSegment : '';
		if (config && config.customtags) {
			const checkedTags = config.customtags;
			this.checkedArray = checkedTags.split(',');
			this.interests.forEach((item) => {
				item.checked = checkedTags && checkedTags.includes(item.label);
			});
		}
	}

	private syncConfigToService(config) {
		if (this.selfSelect) {
			this.selfSelect.updateConfig(config).catch((error) => {
				this.logger.error(
					'syncConfigToService failed for updateConfig error: ',
					JSON.stringify(error)
				);
			});
		}
	}

	private isArm(machineInfo) {
		return (
			machineInfo &&
			machineInfo.cpuArchitecture &&
			machineInfo.cpuArchitecture.toUpperCase().trim() === 'ARM64'
		);
	}

	private calcDefaultSegment(machineInfo) {
		try {
			let segment = SegmentConst.ConsumerBase;
			if (!machineInfo) {
				this.logger.info(
					'SelfSelectService.calcDefaultSegment failed for machine info undefined. '
				);
			} else if (machineInfo.isGaming) {
				segment = SegmentConst.Gaming;
			} else if (this.isArm(machineInfo)) {
				this.userProfileEnabled = false;
				segment = SegmentConst.ConsumerBase;
			}
			return segment;
		} catch (e) {
			this.logger.error('SelfSelectService.calcDefaultSegment exception: ', e);
			return SegmentConst.ConsumerBase;
		}
	}

	public getPersonaFromLenovoWelcome() {
		if (this.frePersona !== null) {
			return Promise.resolve(this.frePersona);
		}
		if (this.deviceService.isShellAvailable && this.selfSelect.getLenovoWelcomePersona) {
			return this.selfSelect
				.getLenovoWelcomePersona()
				.then((persona) => {
					this.logger.info('getLenovoWelcomePersona result: ', persona);
					if (persona) {
						this.frePersona = this.frePersonaToSegmentMap[persona];
					} else {
						this.frePersona = '';
					}
					return this.frePersona;
				})
				.catch((error) => {
					this.logger.error('getLenovoWelcomePersona error: ', error.message);
					this.frePersona = '';
					return this.frePersona;
				});
		}
		this.frePersona = '';
		return Promise.resolve(this.frePersona);
	}

	private setSegmentInAllSubApp() {
		for (const subAppConfig of subAppConfigList) {
			this.setSegmentInSubApp(subAppConfig);
		}
	}

	public setSegmentInSubApp(subAppConfig: ISubAppConfig) {
		const payload = { segment: this.savedSegment };
		this.containerAppSendHandler.handle(
			subAppConfig,
			ContainerAppSendMessageType.setSegment,
			payload
		);
	}
}

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
	Consumer = 'Consumer',
	SMB = 'SMB',
	Commercial = 'Commercial',
	Gaming = 'Gaming'
}

@Injectable({
	providedIn: 'root'
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
	public usageType = null;
	public checkedArray: string[] = [];
	public userProfileEnabled = true;

	private _savedSegment = null;
	private get savedSegment() {
		return this._savedSegment;
	}
	private set savedSegment(value) {
		if (value && this._savedSegment !== value) {
			this._savedSegment = value;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.LocalInfoSegment, this._savedSegment);
			this.commonService.sendNotification(SelfSelectEvent.SegmentChange, this.savedSegment);
			this.commonService.sendReplayNotification(SelfSelectEvent.SegmentChange, this.savedSegment);
		}
	}
	private selfSelect: any;
	private vantageStub: any;
	private machineInfo: any;
	private DefaultSelectSegmentMap = [
		{ brand: 'think', familyPattern: { pattern: /thinkpad e/i, result: false }, defaultSegment: SegmentConst.Commercial },
		{ brand: 'think', familyPattern: { pattern: /thinkpad e/i, result: true }, defaultSegment: SegmentConst.SMB },
		{ brand: 'lenovo', familyPattern: { pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: false }, defaultSegment: SegmentConst.Consumer },
		{ brand: 'lenovo', familyPattern: { pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: true }, defaultSegment: SegmentConst.SMB },
		{ brand: 'idea', familyPattern: { pattern: /^V|thinkbook|ideapad v/i, result: false }, defaultSegment: SegmentConst.Consumer },
		{ brand: 'idea', familyPattern: { pattern: /^V|thinkbook|ideapad v/i, result: true }, defaultSegment: SegmentConst.SMB },
	];

	constructor(
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

	public async getSegment() {
		if (!this.savedSegment) {
			await this.initialize();
		}
		return this.savedSegment;
	}

	public async getConfig() {
		if (!this.usageType) {
			await this.initialize();
		}
		const config = { usageType: this.usageType, interests: this.interests };
		return config;
	}

	public saveConfig(changedConfig, reloadRequired?) {
		try {
			this.interests = this.commonService.cloneObj(changedConfig.interests);
			this.usageType = changedConfig.usageType;
			this.interests.forEach((item) => {
				if (item && item.checked && !this.checkedArray.includes(item.label)) {
					this.checkedArray.push(item.label);
				}
				if (item && !item.checked && this.checkedArray.includes(item.label)) {
					this.checkedArray = this.checkedArray.filter(e => e !== item.label);
				}
			});
			const config = {
				customtags: this.checkedArray.join(','),
				segment: this.usageType
			};
			const reloadNecessary = reloadRequired === true && this.savedSegment !== this.usageType;
			this.savedSegment = this.usageType;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.ChangedSelfSelectConfig, config);
			this.syncConfigToService(config);
			if (reloadNecessary) {
				if (this.vantageStub && typeof this.vantageStub.refresh === 'function') {
					this.vantageStub.refresh();
				} else {
					window.open(window.location.origin, '_self');
				}
			}
		} catch (error) {
			this.logger.error('saveConfig failed for error: ', JSON.stringify(error));
		}
	}

	private async initialize() {
		let config = this.localCacheService.getLocalCacheValue(LocalStorageKey.ChangedSelfSelectConfig);
		this.machineInfo = await this.deviceService.getMachineInfo();
		this.userProfileEnabled = this.checkUserProfileEnabled();
		if (!config
			|| !config.segment
			|| !this.isSegmentMatchCurrentMachine(config.segment, this.machineInfo)) {
			const defaultSegment = this.calcDefaultSegment(this.machineInfo);
			config = {
				customtags: '',
				segment: defaultSegment
			};
			this.localCacheService.setLocalCacheValue(LocalStorageKey.ChangedSelfSelectConfig, config);
		}
		this.setSegmentAndInterest(config);
		this.syncConfigToService(config);
	}

	private checkUserProfileEnabled() {
		return !this.isArm(this.machineInfo);
	}

	private isSegmentMatchCurrentMachine(segment, machineInfo) {
		let result = true;
		if ((machineInfo && machineInfo.isGaming && segment !== SegmentConst.Gaming)
		|| (machineInfo && !machineInfo.isGaming && segment === SegmentConst.Gaming)) {
			result = false;
		}
		return result;
	}

	private setSegmentAndInterest(config) {
		this.usageType = config.segment;
		this.savedSegment = this.usageType;
		if (config && config.customtags) {
			const checkedTags = config.customtags;
			this.checkedArray = checkedTags.split(',');
			this.interests.forEach(item => {
				item.checked = checkedTags && checkedTags.includes(item.label);
			});
		}
	}

	private syncConfigToService(config) {
		if (this.selfSelect) {
			this.selfSelect.updateConfig(config).catch((error) => {
				this.logger.error('syncConfigToService failed for updateConfig error: ', JSON.stringify(error));
			});
		}
	}

	private isArm(machineInfo) {
		return machineInfo && machineInfo.cpuArchitecture
		&& machineInfo.cpuArchitecture.toUpperCase().trim() === 'ARM64';
	}

	private calcDefaultSegment(machineInfo) {
		try {
			let segment = SegmentConst.Consumer;
			if (!machineInfo) {
				this.logger.info('SelfSelectService.calcDefaultSegment failed for machine info undefined. ');
			} else if (machineInfo.isGaming) {
				segment = SegmentConst.Gaming;
			} else if (this.isArm(machineInfo)) {
				this.userProfileEnabled = false;
				segment = SegmentConst.Consumer;
			} else {
				const brand = machineInfo.brand;
				const family = machineInfo.family;
				for (let i = 0; i < this.DefaultSelectSegmentMap.length; i++) {
					const rule = this.DefaultSelectSegmentMap[i];
					if (brand && brand.toLowerCase() === rule.brand
						&& family && this.IsMatch(rule.familyPattern.pattern, family) === rule.familyPattern.result) {
						segment = rule.defaultSegment;
						break;
					}
				}
			}
			return segment;
		} catch (e) {
			this.logger.error('SelfSelectService.calcDefaultSegment exception: ', e);
			return SegmentConst.Consumer;
		}
	}

	public IsMatch(pattern, source) {
		let result = false;
		const matchedResult = source.match(pattern);
		result = matchedResult !== null;
		return result;
	}
}


import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

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
			this.commonService.setLocalStorageValue(LocalStorageKey.LocalInfoSegment, this._savedSegment);
			this.commonService.sendNotification(SelfSelectEvent.SegmentChange, this.savedSegment);
			this.commonService.sendReplayNotification(SelfSelectEvent.SegmentChange, this.savedSegment);
		}
	}
	public savedInterests: string[] = [];
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
		public deviceService: DeviceService
	) {
		this.selfSelect = this.vantageShellService.getSelfSelect();
		this.vantageStub = this.vantageShellService.getVantageStub();
		const changedConfig = this.commonService.getLocalStorageValue(LocalStorageKey.ChangedSelfSelectConfig);
		if (changedConfig && changedConfig.segment) {
			this.logger.info(`SelfSelectService update segment. ${changedConfig.segment}`);
			this.commonService.setLocalStorageValue(LocalStorageKey.LocalInfoSegment, changedConfig.segment);
			if (this.selfSelect) {
				this.selfSelect.updateConfig(changedConfig).catch((error) => {});
			}
		} else {
			this.commonService.setLocalStorageValue(LocalStorageKey.LocalInfoSegment, SegmentConst.Consumer);
		}
		this.getConfig();
	}

	public async getSegment() {
		if (!this.savedSegment) {
			await this.getConfig();
		}
		return this.savedSegment;
	}

	public async getConfig() {
		try {
			this.userProfileEnabled = true;
			this.machineInfo = await this.deviceService.getMachineInfo();
			const config = this.commonService.getLocalStorageValue(LocalStorageKey.ChangedSelfSelectConfig);
			if (config && config.customtags) {
				const checkedTags = config.customtags;
				this.checkedArray = checkedTags.split(',');
				this.savedInterests = [];
				Object.assign(this.savedInterests, this.checkedArray);
				this.interests.forEach(item => {
					item.checked = checkedTags && checkedTags.includes(item.label);
				});
			}
			if (!this.machineInfo && (!config || !config.segment)) {
				this.usageType = SegmentConst.Consumer;
				this.savedSegment = this.usageType;
				this.saveConfig();
			}
			else if (this.machineInfo && (!config || !config.segment)) {
				this.usageType = this.calcDefaultSegment(this.machineInfo);
				this.savedSegment = this.usageType;
				this.saveConfig();
			}
			else if (this.machineInfo && config && config.segment) {
				if (this.machineInfo.isGaming ||
					this.isArm(this.machineInfo)){
					this.usageType = this.calcDefaultSegment(this.machineInfo);
					this.savedSegment = this.usageType;
					this.saveConfig();
				}
				else {
					this.usageType = config.segment;
					this.savedSegment = this.usageType;
				}
			}
			else if (!this.machineInfo && config && config.segment){
				this.usageType = config.segment;
				this.savedSegment = this.usageType;
			}
		} catch (error) {
			this.logger.error('SelfSelectService.getConfig failed. ', error);
			this.usageType = this.calcDefaultSegment(this.machineInfo);
			this.savedSegment = this.usageType;
			this.saveConfig();
		}
		return { usageType: this.usageType, interests: this.interests };
	}

	public saveConfig(reloadRequired?) {
		try {
			const config = {
				customtags: this.checkedArray.join(','),
				segment: this.usageType
			};
			const reloadNecessary = reloadRequired === true && this.savedSegment !== this.usageType;
			this.savedSegment = this.usageType;
			this.savedInterests = [];
			Object.assign(this.savedInterests, this.checkedArray);
			this.commonService.setLocalStorageValue(LocalStorageKey.ChangedSelfSelectConfig, config);
			if (this.selfSelect) {
				this.selfSelect.updateConfig(config).catch((error) => { });
			}
			if (reloadNecessary) {
				if (this.vantageStub && typeof this.vantageStub.refresh === 'function') {
					this.vantageStub.refresh();
				} else {
					window.open(window.location.origin, '_self');
				}
			}
		} catch (error) { }
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

	public selectionChanged() {
		const savedIs = JSON.stringify(this.savedInterests.sort());
		const currentIs = JSON.stringify(this.checkedArray.sort());
		return this.usageType !== this.savedSegment || savedIs !== currentIs;
	}
}


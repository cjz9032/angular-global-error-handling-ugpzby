import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';

@Injectable({
  providedIn: 'root'
})
export class SelfSelectService {
	public interests = [
		{label: 'games', checked: false},
		{label: 'news', checked: false},
		{label: 'entertainment', checked: false},
		{label: 'technology', checked: false},
		{label: 'sports', checked: false},
		{label: 'arts', checked: false},
		{label: 'regionalNews', checked: false},
		{label: 'politics', checked: false},
		{label: 'music', checked: false},
		{label: 'science', checked: false},
	];
	public usageType = null;
	public checkedArray: string[] = [];
	public userProfileEnabled = true;
	public userSelectionChanged = false;
	private selfSelect: any;
	private machineInfo: any;
	private DefaultSelectSegmentMap = [
		{ brand: 'think', familyPattern: {pattern: /thinkpad e/i, result: false}, defaultSegment: SegmentConst.Commercial},
		{ brand: 'think', familyPattern: {pattern: /thinkpad e/i, result: true }, defaultSegment: SegmentConst.SMB},
		{ brand: 'lenovo', familyPattern: {pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: false} ,defaultSegment: SegmentConst.Consumer},
		{ brand: 'lenovo', familyPattern: {pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: true} , defaultSegment: SegmentConst.SMB},
		{ brand: 'idea', familyPattern: {pattern: /^V/i, result: false}, defaultSegment: SegmentConst.Consumer},
		{ brand: 'idea', familyPattern: {pattern: /^V/i, result: true}, defaultSegment: SegmentConst.SMB},
	]

	constructor(private vantageShellService: VantageShellService,
		public deviceService: DeviceService) {
		this.selfSelect = this.vantageShellService.getSelfSelect();
		this.getConfig();
	}

	public async getSegment() {
		if (!this.usageType) {
			await this.getConfig();
		}
		return this.usageType;
	}

	public async getConfig() {
		if (this.selfSelect) {
			this.userProfileEnabled = true;
			try {
				const config = await this.selfSelect.getConfig();
				if (config && config.customtags) {
					const checkedTags = config.customtags;
					this.checkedArray = checkedTags.split(',');
					this.interests.forEach(item => {
						item.checked = checkedTags && checkedTags.includes(item.label);
					});
				}
				if (config && config.segment) {
					this.usageType = config.segment;
				} else {
					this.usageType = await this.getDefaultSegment();
					this.saveConfig();
				}
			} catch (error) {
				console.log('SelfSelectService.getConfig failed. ', error);
				this.usageType = this.getDefaultSegment();
				// this.userProfileEnabled = false;
			}
		} else {
			this.userProfileEnabled = false;
			this.usageType = this.getDefaultSegment();
		}
	}

	public saveConfig() {
		const config = {
			customtags: this.checkedArray.join(','),
			segment: this.usageType
		}
		return this.selfSelect.updateConfig(config);
	}

	private async getDefaultSegment() {
		this.machineInfo = this.deviceService.machineInfo;
		if (!this.machineInfo) {
			const info = await this.deviceService.getMachineInfo()
			this.machineInfo = info;
			return this.calcDefaultSegment(this.machineInfo);
		}
		else {
			return this.calcDefaultSegment(this.machineInfo);
		}
	}

	private calcDefaultSegment(machineInfo) {
		if (machineInfo.isGaming) {
			return SegmentConst.Gaming;
		}
		let segment = SegmentConst.Consumer;
		try	{
			const brand = machineInfo.brand;
			const family = machineInfo.family;
			for (var i = 0; i < this.DefaultSelectSegmentMap.length; i++) {
				const rule = this.DefaultSelectSegmentMap[i];
				if (brand && brand.toLowerCase() === rule.brand
				&& family && this.IsMatch(rule.familyPattern.pattern, family) === rule.familyPattern.result)
				{
					segment = rule.defaultSegment;
					break;
				}
			}
		} catch(e){
			console.log('SelfSelectService.calcDefaultSegment exception: ', e);
		}
		return segment;
	}

	public IsMatch(pattern, source) {
		let result = false;
		const matchedResult = source.match(pattern);
		result = matchedResult !== null;
		return result;
	}
}

export class SelfSelectConfig {
	public customtags?: string;
	public segment?: string;
	public smbRole?: string;
}

export class SegmentConst {
	public static readonly Consumer = 'Consumer';
	public static readonly SMB = 'SMB';
	public static readonly Commercial = 'Commercial';
	public static readonly Gaming = 'Gaming';
}

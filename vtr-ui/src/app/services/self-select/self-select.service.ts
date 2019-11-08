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
	private selfSelect: any;
	private machineInfo: any;
	private DefaultSelectSegmentMap = [
		{ brand: 'think', familyPattern: {pattern: /thinkpad e/i, result: false}, defaultSegment: SegmentConst.professional},
		{ brand: 'think', familyPattern: {pattern: /thinkpad e/i, result: true }, defaultSegment: SegmentConst.business},
		{ brand: 'lenovo', familyPattern: {pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: false} ,defaultSegment: SegmentConst.personal},
		{ brand: 'lenovo', familyPattern: {pattern: /thinkbook|lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: true} , defaultSegment: SegmentConst.business},
		// { brand: 'idea', familyPattern: {pattern: /lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: false}, defaultSegment: SegmentConst.personal},
		// { brand: 'idea', familyPattern: {pattern: /lenovo V|lenovoV|lenovo_V|lenovo-V/i, result: true}, defaultSegment: SegmentConst.business},
	]

	constructor(private vantageShellService: VantageShellService,
		public deviceService: DeviceService) {
		this.selfSelect = this.vantageShellService.getSelfSelect();
	}

	public getConfig() {
		if (this.selfSelect) {
			this.userProfileEnabled = true;
			this.selfSelect.getConfig().then((config) => {
				if (config && config.segment) {
					this.usageType = config.segment;
				} else if (!this.deviceService.isGaming) {
					this.usageType = this.getDefaultSegment();
				}
				if (config && config.customtags) {
					const checkedTags = config.customtags;
					this.checkedArray = checkedTags.split(',');
					this.interests.forEach(item => {
						item.checked = checkedTags && checkedTags.includes(item.label);
					});
				}
			}).catch((error) => {
				console.log('SelfSelectService.getConfig failed. ', error);
				this.userProfileEnabled = false;
			});;
		}
	}

	public saveConfig() {
		if (this.deviceService.isGaming) {
			this.usageType = null;
		}
		const config = {
			customtags: this.checkedArray.join(','),
			segment: this.usageType
		}
		return this.selfSelect.updateConfig(config);
	}

	private getDefaultSegment() {
		this.machineInfo = this.deviceService.machineInfo;
		if (!this.machineInfo) {
			this.deviceService.getMachineInfo().then((info) => {
				this.machineInfo = info;
				return this.calcDefaultSegment(this.machineInfo);
			});
		}
		else {
			return this.calcDefaultSegment(this.machineInfo);
		}
	}

	private calcDefaultSegment(machineInfo) {
		let segment = SegmentConst.personal;
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
	public static readonly personal = 'Consumer';
	public static readonly business = 'SMB';
	public static readonly professional = 'Commercial';
}

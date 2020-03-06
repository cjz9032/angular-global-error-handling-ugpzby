import { Injectable } from '@angular/core';
import { CommsService } from '../comms/comms.service';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DevService } from '../dev/dev.service';
import { EssentialHelper } from './helper/essential.helper';
import { IUpeEssential, IGetContentParam, IActionResult } from './model/definitions';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { SelfSelectService, SegmentConst } from '../self-select/self-select.service';
import { TranslateService } from '@ngx-translate/core';
import { UPEHelper } from './helper/upe.helper';
import { LocalInfoService } from '../local-info/local-info.service';

@Injectable({
	providedIn: 'root'
})

export class UPEService {
	private channelTags: any;
	private upeHelper: UPEHelper;
	private essentialHelper: EssentialHelper;
	private upeEssential: IUpeEssential;
	private localInfo: any;
	constructor(
		private commsService: CommsService,
		private commonService: CommonService,
		private selfSelectService: SelfSelectService,
		private deviceService: DeviceService,
		private localInfoService: LocalInfoService,
		vantageShellService: VantageShellService,
		devService: DevService,
		translate: TranslateService
	) {
		this.essentialHelper = new EssentialHelper(commsService, deviceService, vantageShellService, devService);
		this.upeHelper = new UPEHelper(vantageShellService, devService, translate);
		this.channelTags = this.commonService.getLocalStorageValue(LocalStorageKey.UPEChannelTags);
	}

	public filterItems(results, template, position) {
		return results.filter((record) => {
			return record.Template === template && record.Position === position;
		}).sort((a, b) => a.Priority.localeCompare(b.Priority));
	}

	public async fetchUPEContent(params: IGetContentParam) {
		if (!params.positions) {
			throw new Error('invaild positions for fetching upe content');
		}

		const result = await this.sendAndRetry(params);
		if (result.success) {
			return await this.upeHelper.filterUPEContent(result.content);
		} else {
			throw new Error(result.content);
		}
	}

	private async sendAndRetry(params: IGetContentParam): Promise<IActionResult> {
		let result = await this.requestUpeContent(params);

		if (result.errorCode === 401) {	// unathenrized, need to registerDevice
			this.upeEssential = await this.essentialHelper.registerDevice(this.upeEssential);

			if (this.upeEssential && this.upeEssential.apiKey) {
				result = await this.requestUpeContent(params);
			} else {
				result = {
					success: false,
					content: 'register device failed'
				};
			}
		}

		return result;
	}

	private async requestUpeContent(params: IGetContentParam): Promise<IActionResult> {
		let essential = this.upeEssential ? this.upeEssential : await this.essentialHelper.getUpeEssential();
		if (!essential) {
			return {
				success: false,
				content: 'upe not support in current version'
			};
		}

		if (!essential.anonUserId || !essential.apiKey) {
			essential = await this.essentialHelper.registerDevice(essential);
		}

		this.upeEssential = essential;
		if (!essential) {
			return {
				success: false,
				content: 'registry upe device failed'
			};
		}

		return await this.httpRequestForUpeContent(essential, params);
	}

	private async httpRequestForUpeContent(upeEssential: IUpeEssential, params: IGetContentParam): Promise<IActionResult> {
		const queryParam = await this.makeQueryParam(upeEssential, params);
		let content = '';
		let errorCode = '';
		try {
			const httpResponse = await this.commsService.callUpeApi(
				`${upeEssential.upeUrlBase}/upe/recommendation/v2/recommends`, queryParam
			).toPromise() as any;

			if (httpResponse.status === 200 && httpResponse.body) {
				return {
					success: true,
					content: httpResponse.body.results
				};
			} else {
				content = `get article failed upon http request(unknown)`;
			}
		} catch (ex) {
			content = `get article failed upon http request`;
			errorCode = ex.status;
		}

		return {
			success: false,
			content,
			errorCode
		};
	}

	private async requestUpeTags(upeEssential: IUpeEssential) {
		if (this.channelTags) {
			return this.channelTags;
		}

		const result = await this.httpRequestForTags(upeEssential);
		if (result.success) {
			if (result.content && result.content.length > 0) {
				this.channelTags = result.content.map(item => item.toString());	// VAN-15331 The API does not return string array as spec, but another api need string array
			} else {
				this.channelTags = [];
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.UPEChannelTags, this.channelTags);
		}

		return this.channelTags;
	}

	private async httpRequestForTags(upeEssential: IUpeEssential): Promise<IActionResult> {
		const { anonUserId, clientAgentId, apiKey, deviceId } = upeEssential;
		const header = { anonUserId, clientAgentId, apiKey, anonDeviceId: deviceId };
		let content = '';
		let errorCode = '';
		try {
			const httpResponse = await this.commsService.makeTagRequest(
				`${upeEssential.upeUrlBase}/upe/tag/api/row/tag/user_tags/sn/${upeEssential.deviceId}?type=c_tag`, header
			) as any;

			const jsonResponse = JSON.parse(httpResponse);
			return {
				success: true,
				content: jsonResponse.tags
			};
		} catch (ex) {
			content = `get  upe tags  failed upon http request`;
			errorCode = ex.status;
		}

		return {
			success: false,
			content,
			errorCode
		};
	}

	private async makeQueryParam(upeEssential: IUpeEssential, upeParams: IGetContentParam) {
		let channelTags = null;

		if (!this.localInfo) {
			this.localInfo = await this.localInfoService.getLocalInfo();
		}
		const systeminfo = await this.deviceService.getMachineInfo();
		const segment = await this.selfSelectService.getSegment();
		if (segment === SegmentConst.SMB) {
			channelTags = await this.requestUpeTags(upeEssential);
		}

		const lang = this.localInfo.Lang ? this.localInfo.Lang.toUpperCase() : 'EN';
		const queryParam = {
			identity: {
				anonUserId: upeEssential.anonUserId,
				anonDeviceId: upeEssential.deviceId,
				clientAgentId: upeEssential.clientAgentId,
				APIKey: upeEssential.apiKey,
			},
			dId: upeEssential.deviceId,
			context: {
				lang,
				Brand: systeminfo.brand,
				GEO: systeminfo.country.toUpperCase(),
				Family: systeminfo.family,
				MTM: systeminfo.mtm,
				OEM: systeminfo.manufacturer,
				OperationSystem: systeminfo.os,
				Processor: systeminfo.cpuinfo ? systeminfo.cpuinfo.name : null,
				Segment: segment,
				// SmbRole: null,
				EnclosureType: systeminfo.enclosureType,
				UpeTags: channelTags
			},
			// filterItemSize: 3,
			positions: upeParams.positions
		};
		return queryParam;
	}
}

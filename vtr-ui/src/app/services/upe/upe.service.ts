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
import { MetricService } from '../metric/metrics.service';
import { MetricEventName as EventName, PerformanceCategory as PCategory } from 'src/app/enums/metrics.enum';
import { MetricPerformance } from '../metric/metrics.model';

interface PerformanceParam {
	api: string;
	apiParam: string;
	success: boolean;
	httpStart: number;
	httpEnd: number;
	filterStart: number;
	filterEnd: number;
	elipsedFromStart: number;
}

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
		translate: TranslateService,
		private metricsService: MetricService
	) {
		this.essentialHelper = new EssentialHelper(commsService, deviceService, vantageShellService, devService);
		this.upeHelper = new UPEHelper(vantageShellService, devService, translate);
		this.channelTags = this.commonService.getLocalStorageValue(LocalStorageKey.UPEChannelTags);
	}

	private sendPerformanceMetric(param: PerformanceParam) {
		const {api, success, httpStart, httpEnd, filterStart, filterEnd, elipsedFromStart} = param;
		const httpDuration = httpEnd - httpStart;
		const filterDuration = filterEnd - filterStart;
		const performanceData: MetricPerformance = {
			ItemType: EventName.performance,
			Category: PCategory.UPE,
			Host: this.upeEssential?.upeUrlBase,
			Api: api,
			Param: param.apiParam,
			Success: success,
			HttpDuration: httpDuration,
			FilterDuration: filterDuration,
			ElipsedFromStart: elipsedFromStart
		};
		this.metricsService.sendMetrics(performanceData);
	}

	public async fetchUPEContent(params: IGetContentParam) {
		if (!params.positions) {
			throw new Error('invaild positions for fetching upe content');
		}

		let content;

		let requestStart = 0;
		let requestEnd = 0;
		let filterStart = 0;
		let filterEnd = 0;
		let success = false;
		const elipsedFromStart = Date.now() - this.metricsService.serviceStartup;

		try {
			requestStart = Date.now();
			const result = await this.sendAndRetry(params);
			requestEnd = Date.now();

			if (result.success) {
				filterStart = requestEnd;
				content = await this.upeHelper.filterUPEContent(result.content);
				filterEnd = Date.now();
				success = true;
			} else {
				throw new Error(result.content);
			}
		} finally {
			this.sendPerformanceMetric({
				api: 'fetchUPEContent',
				apiParam: null,
				success,
				httpStart: requestStart,
				httpEnd: requestEnd,
				filterStart,
				filterEnd,
				elipsedFromStart
			});
		}

		return content;
	}

	private async sendAndRetry(params: IGetContentParam): Promise<IActionResult> {
		let result = await this.requestUpeContent(params);

		let httpStart = 0;
		let httpEnd = 0;
		let regResult = false;
		const elipsedFromStart = Date.now() - this.metricsService.serviceStartup;

		if (result.errorCode === 401) {	// unathenrized, need to registerDevice
			httpStart = Date.now();
			this.upeEssential = await this.essentialHelper.registerDevice(this.upeEssential);
			httpEnd = Date.now();

			if (this.upeEssential && this.upeEssential.apiKey) {
				regResult = true;
				result = await this.requestUpeContent(params);
			} else {
				result = {
					success: regResult,
					content: 'register device failed'
				};
			}

			this.sendPerformanceMetric({
				api: 'registerDevice',
				apiParam: null,
				success: regResult,
				httpStart,
				httpEnd,
				filterStart: 0,
				filterEnd: 0,
				elipsedFromStart
			});
		}

		return result;
	}

	private async requestUpeContent(params: IGetContentParam): Promise<IActionResult> {
		const essential = this.upeEssential ? this.upeEssential : await this.essentialHelper.getUpeEssential();
		if (!essential) {
			return {
				success: false,
				content: 'upe not support in current version'
			};
		}

		if (!essential.anonUserId || !essential.apiKey) {
			return {
				success: false,
				errorCode: 401, // need registor device
				content: 'upe not support in current version'
			};
		}

		return await this.httpRequestForUpeContent(essential, params);
	}

	private async httpRequestForUpeContent(upeEssential: IUpeEssential, params: IGetContentParam): Promise<IActionResult> {
		const queryParam = await this.makeQueryParam(upeEssential, params);
		let content = '';
		let errorCode = '';

		let httpStart = 0;
		let httpEnd = 0;
		let success = false;
		const elipsedFromStart = Date.now() - this.metricsService.serviceStartup;

		try {
			httpStart = Date.now();
			const httpResponse = await this.commsService.callUpeApi(
				`${upeEssential.upeUrlBase}/upe/recommendation/v2/recommends`, queryParam
			) as any;
			httpEnd = Date.now();

			if (httpResponse.status === 200 && httpResponse.body.results) {
				success = true;
				return {
					success,
					content: httpResponse.body.results
				};
			} else {
				content = `get article failed upon http request(unknown)`;
				errorCode = httpResponse.status;
			}
		} catch (ex) {
			content = ex.message;
			errorCode = ex.status;
		} finally {
			this.sendPerformanceMetric({
				api: '/upe/recommendation/v2/recommends',
				apiParam: null,
				success,
				httpStart,
				httpEnd,
				filterStart: 0,
				filterEnd: 0,
				elipsedFromStart
			});
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
		let httpStart = 0;
		let httpEnd = 0;
		let success = false;
		const elipsedFromStart = Date.now() - this.metricsService.serviceStartup;

		try {
			httpStart = Date.now();
			const httpResponse = await this.commsService.makeTagRequest(
				`${upeEssential.upeUrlBase}/upe/tag/api/row/tag/user_tags/sn/${upeEssential.deviceId}?type=c_tag`, header
			) as any;
			httpEnd = Date.now();

			const jsonResponse = JSON.parse(httpResponse);
			success = true;
			return {
				success,
				content: jsonResponse.tags
			};
		} catch (ex) {
			content = `get  upe tags  failed upon http request`;
			errorCode = ex.status;
			return {
				success,
				content,
				errorCode
			};
		} finally {
			this.sendPerformanceMetric({
				api: '/upe/tag/api/row/tag/user_tags/sn/',
				apiParam: upeEssential.deviceId,
				success,
				httpStart,
				httpEnd,
				filterStart: 0,
				filterEnd: 0,
				elipsedFromStart
			});
		}
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

import { Injectable } from '@angular/core';
import { CommsService } from '../comms/comms.service';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { Observable } from 'rxjs';
import { DevService } from '../dev/dev.service';
import { UpeHelper } from './helper/upe.helper';
import { IUpeEssential, IGetContentParam, IActionResult } from './model/definitions';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { SelfSelectService, SegmentConst } from '../self-select/self-select.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
	providedIn: 'root'
})

export class UPEService {
	private upeEssential: IUpeEssential;
	private channelTags: any;
	private upeHelper: UpeHelper;
	private requestCache = {};
	constructor(
		private commsService: CommsService,
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService,
		private devService: DevService,
		private commonService: CommonService,
		private selfSelectService: SelfSelectService,
		private translate: TranslateService
	) {
		this.upeHelper = new UpeHelper(commsService, deviceService, vantageShellService, devService);
		this.channelTags = this.commonService.getLocalStorageValue(LocalStorageKey.UPEChannelTags);
	}

	public getOneUPEContent(results, template, position) {
		return results.filter((record) => {
			return record.Template === template && record.Position === position;
		}).sort((a, b) => a.Priority.localeCompare(b.Priority));
	}

	public fetchUPEContent(params: IGetContentParam): Observable<any> {
		if (!params.position) {
			throw new Error('invaild param for fetching upe content');
		}

		if (!this.requestCache[params.position]) {
			this.requestCache[params.position] = new Observable(subscriber => {	// cache request
				this.startFetchUpeContentAndRetry(params).then(result => {
					if (result.success) {
						const articles = this.filterUPEContent(result.content);
						subscriber.next(articles);
						subscriber.complete();
					} else {
						subscriber.error(result);
					}
				}).finally(() => {
					this.requestCache[params.position] = null;	// release request
				});
			});
		}

		return this.requestCache[params.position];
	}

	private async startFetchUpeContentAndRetry(params: IGetContentParam): Promise<IActionResult> {
		const systeminfo = await this.deviceService.getMachineInfo();
		let result = await this.startFetchUpeContent(params);

		if (result.errorCode === 401) {	// unathenrized, need to registerDevice
			this.upeEssential = await this.upeHelper.registerDevice(this.upeEssential);

			if (this.upeEssential && this.upeEssential.apiKey) {
				result = await this.startFetchUpeContent(params);
			} else {
				result = {
					success: false,
					content: 'register device failed'
				};
			}
		}

		return result;
	}

	private async startFetchUpeContent(params: IGetContentParam): Promise<IActionResult> {
		let essential = this.upeEssential ? this.upeEssential : await this.upeHelper.getUpeEssential();
		if (!essential) {
			return {
				success: false,
				content: 'upe not support by shell'
			};
		}

		if (!essential.anonUserId || !essential.apiKey) {
			essential = await this.upeHelper.registerDevice(essential);
		}

		this.upeEssential = essential;
		if (!essential) {
			return {
				success: false,
				content: 'registry upe device failed'
			};
		}

		return await this.httpGetContentRequest(essential, params);
	}

	private async httpGetContentRequest(upeEssential: IUpeEssential, params: IGetContentParam): Promise<IActionResult> {
		const queryParam = await this.makeQueryParam(upeEssential, params);
		let content = '';
		let errorCode = '';
		try {
			const httpResponse = await this.commsService.callUpeApi(
				`${upeEssential.upeUrlBase}/upe/recommendation/v2/recommends`, queryParam, {}
			).toPromise() as any;

			if (httpResponse.status === 200) {
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

	private async getUpeTags(upeEssential: IUpeEssential) {
		if (this.channelTags) {
			return this.channelTags;
		}

		const result = await this.httpGetTagsRequest(upeEssential);
		if (result.success) {
			this.channelTags = result.content;
			this.commonService.setLocalStorageValue(LocalStorageKey.UPEChannelTags, this.channelTags);
		}

		return this.channelTags;
	}

	private async httpGetTagsRequest(upeEssential: IUpeEssential): Promise<IActionResult> {
		const { anonUserId, clientAgentId, apiKey, deviceId } = upeEssential;
		const header = { anonUserId, clientAgentId, apiKey, anonDeviceId: deviceId };
		let content = '';
		let errorCode = '';
		try {
			const httpResponse = await this.commsService.callUpeApi(
				`${upeEssential.upeUrlBase}/row/tag/user_tags/sn/${upeEssential.deviceId}?type=c_tag`, null, header
			).toPromise() as any;

			if (httpResponse.status === 200) {
				return {
					success: true,
					content: httpResponse.body.results
				};
			} else {
				content = `get upe tags failed upon http request(unknown)`;
			}
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
		const systeminfo = await this.deviceService.getMachineInfo();
		const segment = await this.selfSelectService.getSegment();
		if (segment === SegmentConst.SMB) {
			channelTags = await this.getUpeTags(upeEssential);
		}

		const queryParam = {
			identity: {
				anonUserId: upeEssential.anonUserId,
				anonDeviceId: upeEssential.deviceId,
				clientAgentId: upeEssential.clientAgentId,
				APIKey: upeEssential.apiKey,
			},
			dId: upeEssential.deviceId,
			context: {
				lang: this.getLang(),
				Brand: systeminfo.brand,
				GEO: systeminfo.os,
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
			filterItemSize: 1,
			positions: [upeParams.position]
		};
		return queryParam;
	}

	private filterUPEContent(results) {
		return new Promise((resolve, reject) => {
			const promises = [];

			results.forEach((result) => {
				promises.push(this.deviceFilter(result.Filters));
			});

			Promise.all(promises).then((deviceFilterValues) => {
				const filteredResults = results.filter((result, index) => {
					return deviceFilterValues[index];
				});

				resolve(filteredResults);
			});
		});
	}

	private deviceFilter(filters) {
		return new Promise((resolve, reject) => {
			if (!filters) {
				this.devService.writeLog('vantageShellService.deviceFilter skipped filter call due to empty filter.');
				return resolve(true);
			}

			return this.vantageShellService.deviceFilter(filters).then(
				(result) => {
					this.devService.writeLog('vantageShellService.deviceFilter ', JSON.stringify(result));
					resolve(result);
				},
				(reason) => {
					this.devService.writeLog('vantageShellService.deviceFilter error', reason);
					resolve(false);
				}
			);
		});
	}

	private getLang() {
		return this.translate.currentLang
			? this.translate.currentLang.toLowerCase()
			: this.translate.defaultLang.toLowerCase();
	}
}

import { Injectable } from '@angular/core';
import { DeviceService } from '../device/device.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { WarrantyCodeEnum, WarrantyData, WarrantyDataRound, WarrantyLevel, WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';
import { LoggerService } from '../logger/logger.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { CommonService } from '../common/common.service';

declare let Windows: any;

@Injectable({
	providedIn: 'root',
})
export class WarrantyService {
	constructor(
		private commonService: CommonService,
		private logger: LoggerService,
		private localCacheService: LocalCacheService,
		private translate: TranslateService,
		private localInfoService: LocalInfoService,
		private deviceService: DeviceService
	) {
	}

	warrantyUrl = 'https://pcsupport.lenovo.com/warrantylookup';

	warrantyData: WarrantyData = {
		isAvailable: false,
		warrantyStatus: WarrantyStatusEnum.WarrantyNotFound,
		startDate: '',
		endDate: '',
		warrantyLevels: [
			{
				level: 'GOOD',
				levelText: 'GOOD',
			},
			{
				level: 'GOOD',
				levelText: 'GOOD',
			},
			{
				level: 'GOOD',
				levelText: 'GOOD',
			}
		],
		currentWarrantyLevel: '',
		warrantyCode: '',
		warrantyCodeText: '',
		image: '',
		remainingDays: 0,
		remainingMonths: 0,
		maxDuration: 0,
	};

	hasFetchWarranty = false;
	isOnlineWarrantyLevelsAvailable = false;
	hasFetchWarrantyLevels = false;

	warrantyLevels: WarrantyLevel[] = [];

	offlineWarrantyLevels: WarrantyLevel[] = [
		{
			id: 'good',
			isRecommended: false,
			levelText: this.translate.instant('warranty.upgradeLevels.good.levelText'),
			warrantyCode: WarrantyCodeEnum.Depot,
			warrantyCodeText: this.translate.instant('warranty.upgradeLevels.good.warrantyCodeText'),
			points: [
				this.translate.instant('warranty.upgradeLevels.good.point1'),
				this.translate.instant('warranty.upgradeLevels.good.point2'),
				this.translate.instant('warranty.upgradeLevels.good.point3'),
			],
		},
		{
			id: 'better',
			isRecommended: false,
			levelText: this.translate.instant('warranty.upgradeLevels.better.levelText'),
			warrantyCode: WarrantyCodeEnum.Onsite,
			warrantyCodeText: this.translate.instant('warranty.upgradeLevels.better.warrantyCodeText'),
			points: [
				this.translate.instant('warranty.upgradeLevels.better.point1'),
				this.translate.instant('warranty.upgradeLevels.better.point2'),
				this.translate.instant('warranty.upgradeLevels.better.point3'),
			],
		},
		{
			id: 'best',
			isRecommended: true,
			levelText: this.translate.instant('warranty.upgradeLevels.best.levelText'),
			warrantyCode: WarrantyCodeEnum.Premier,
			warrantyCodeText: this.translate.instant('warranty.upgradeLevels.best.warrantyCodeText'),
			points: [
				this.translate.instant('warranty.upgradeLevels.best.point1'),
				this.translate.instant('warranty.upgradeLevels.best.point2'),
				this.translate.instant('warranty.upgradeLevels.best.point3'),
				this.translate.instant('warranty.upgradeLevels.best.point4'),
			],
		},
	];

	convertWarrantyData(data: WarrantyData) {
		if (data.warrantyStatus === WarrantyStatusEnum.WarrantyNotFound) {
			return data;
		}
		data.isAvailable = true;
		data.warrantyStatus = data.warrantyStatus?.toLowerCase();
		data.currentWarrantyLevel = data.currentWarrantyLevel?.toLowerCase();
		if (data.warrantyCode?.includes(',')) {
			data.warrantyCode = data.warrantyCode.split(',')[0];
		}
		data.warrantyCode = data.warrantyCode?.toLowerCase();

		if (data.warrantyLevels.length > 0) {
			data.warrantyLevels.forEach(w => {
				w.level = w.level?.toLowerCase();
			});
		}
		data.firstRound = {
			index: 0, mos: 0, isInUsed: true, isStart: true, startDate: data.startDate,
		};
		const startDate = Date.parse(data.startDate);
		const endDate = Date.parse(data.endDate);
		const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
		const warrantyYear = Math.round(days / 365);
		let maxCircle = Math.round(data.maxDuration / 12) + 1;
		let inWarrantyCircleCount = warrantyYear + 1;

		if (!data.remainingDays) { data.remainingDays = 0; }
		if (!data.remainingMonths) {
			data.remainingMonths = this.getMonthDiff(data.remainingDays, endDate);
			if (!Boolean(data.remainingMonths && data.remainingMonths >= 0)) { data.remainingMonths = 0; }
		}

		if (data.warrantyStatus === WarrantyStatusEnum.InWarranty) {
			maxCircle += 1;
			inWarrantyCircleCount += 1;
			data.todayCircleIndex = warrantyYear - Math.floor(data.remainingMonths / 12) - 1;
			data.inUseCircle = data.todayCircleIndex;
			data.remainingCircle = inWarrantyCircleCount - data.todayCircleIndex - 1;
			data.renewableCircle = maxCircle - inWarrantyCircleCount;
		}
		else if (data.warrantyStatus === WarrantyStatusEnum.WarrantyExpired) {
			data.warrantyCode = WarrantyCodeEnum.NoWarranty;
			data.todayCircleIndex = -1;
			data.inUseCircle = warrantyYear;
			data.remainingCircle = 0;
			data.renewableCircle = maxCircle - data.inUseCircle - 1;
		}
		data.rounds = [];
		if (data.inUseCircle > 0) {
			for (let i = 0; i < data.inUseCircle; i++) {
				const round: WarrantyDataRound = {
					index: i, mos: (i + 1) * 12, isInUsed: true
				};
				if (i + 1 === data.inUseCircle && data.remainingCircle === 0) {
					round.isEnd = true;
					round.endDate = data.endDate;
				}
				data.rounds.push(round);
			}
		}
		if (data.remainingCircle > 0) {
			for (let i = data.inUseCircle; i < data.inUseCircle + data.remainingCircle; i++) {
				const round: WarrantyDataRound = { index: i, mos: (i + 1) * 12 };
				if (i === data.todayCircleIndex) {
					round.isToday = true;
					if (data.remainingMonths < 6 ||
						data.warrantyCode === WarrantyCodeEnum.Depot ||
						data.warrantyCode === WarrantyCodeEnum.NoWarranty) {
						round.isAlert = true;
					}
				}
				if (i + 1 === data.inUseCircle + data.remainingCircle) {
					round.isEnd = true;
					round.endDate = data.endDate;
				}
				data.rounds.push(round);
			}
		}
		if (data.renewableCircle > 0) {
			for (let i = 0; i < data.renewableCircle; i++) {
				const j = i + data.inUseCircle + data.remainingCircle;
				const round = { index: j, mos: (j + 1) * 12, isRenew: true };
				data.rounds.push(round);
			}
		}
		if (data.warrantyStatus === WarrantyStatusEnum.InWarranty) {
			data.rounds.forEach(((r, i) => {
				if (r.index >= data.todayCircleIndex) {
					r.mos -= 12;
				}
				if (i === data.rounds.length - 1) {
					r.isLast = true;
				}
			}));
		} else if (data.warrantyStatus === WarrantyStatusEnum.WarrantyExpired && data.renewableCircle === 0) {
			data.rounds[data.rounds.length - 1].isLast = true;
		}
		return data;
	}

	setWarrantyNotFound() {
		if (!this.warrantyData.isAvailable) {
			this.warrantyData.warrantyStatus = WarrantyStatusEnum.WarrantyNotFound;
			this.hasFetchWarranty = true;
			this.commonService.sendNotification(LocalStorageKey.LastWarrantyData, this.warrantyData);
		}
	}

	convertWarrantyLevels(data: any): WarrantyLevel[] {
		if (!data && !data.good) {
			return this.offlineWarrantyLevels;
		}
		const levels: WarrantyLevel[] = [];
		const dataLevels = [
			{ id: 'good', item: data?.good, },
			{ id: 'better', item: data?.better, },
			{ id: 'best', item: data?.best, },
		];
		dataLevels.forEach((level) => {
			const levelItem = level.item;
			if (levelItem) {
				levels.push({
					id: levelItem.id,
					isRecommended: levelItem.isRecommended,
					levelText: levelItem.warrantyLevelTitle || levelItem.id,
					warrantyCode: levelItem.warrantyLevelCode?.toLowerCase() || WarrantyCodeEnum.Depot,
					warrantyCodeText: levelItem.warrantyLevelCodeText || '',
					points: levelItem.describe,
				});
			}
		});
		return levels;
	}

	setWarrantyLevelsNotFound() {
		if (!this.isOnlineWarrantyLevelsAvailable) {
			this.warrantyLevels = this.offlineWarrantyLevels;
			this.hasFetchWarrantyLevels = true;
		}
	}

	fetchWarranty() {
		this.deviceService.getMachineInfo().then(async (machineInfo) => {
			if (machineInfo && machineInfo.serialnumber) {
				const localInfo = await this.localInfoService.getLocalInfo();
				// machineInfo.serialnumber = 'PF1HVYM5'; // for test 'PC0G9X77' 'R9T6M3E' 'R90HTPEU' 'MP1FCJBF' 'MP1NW0D2' 'PF1HVYM5'
				const sn = machineInfo.serialnumber;
				const mtm = machineInfo.mtm;
				this.setWarrantyUrl(sn, mtm);
				const geo = localInfo.GEO || 'us';
				const lang = localInfo.Lang?.substr(0, 2) || 'en';

				const warrantyUrl = `${environment.pcsupportApiRoot}/api/v4/upsellAggregation/vantage/warrantySummaryInfo?sn=${sn}&mtm=${mtm}&geo=${geo}&language=${lang}&clientId=vantage`;

				const warrantyDataCache: WarrantyData = this.localCacheService.getLocalCacheValue(LocalStorageKey.LastWarrantyData);
				if (warrantyDataCache && warrantyDataCache.isAvailable) {
					this.warrantyData = warrantyDataCache;
					this.commonService.sendNotification(LocalStorageKey.LastWarrantyData, this.warrantyData);
					this.hasFetchWarranty = true;
				}

				const uri = new Windows.Foundation.Uri(warrantyUrl);
				const request = new Windows.Web.Http.HttpRequestMessage(
					Windows.Web.Http.HttpMethod.get,
					uri
				);
				const httpClient = new Windows.Web.Http.HttpClient();
				(async () => {
					try {
						const response = await httpClient.sendRequestAsync(request);
						const result = await response.content.readAsStringAsync();
						if (result) {
							const resultJson = JSON.parse(result);
							if (resultJson.code === 0 && resultJson.msg?.desc?.toLowerCase() === 'success') {
								this.logger.info('Fetch warranty result: ', resultJson);
								this.warrantyData = this.convertWarrantyData(resultJson.data);
								this.localCacheService.setLocalCacheValue(LocalStorageKey.LastWarrantyData, this.warrantyData);
								this.hasFetchWarranty = true;
							} else {
								this.setWarrantyNotFound();
								this.logger.info('Fetch warranty no success response: ', resultJson);
							}
						} else {
							this.setWarrantyNotFound();
							this.logger.info('Fetch warranty no result ', result);
						}
					} catch (e) {
						this.setWarrantyNotFound();
						this.logger.info('Fetch warranty catch error error: ', e);
					}
					httpClient.close();
				})();
			}
		});
	}

	fetchWarrantyLevels() {
		this.deviceService.getMachineInfo().then(async (machineInfo) => {
			if (machineInfo && machineInfo.serialnumber) {
				const localInfo = await this.localInfoService.getLocalInfo();
				const sn = machineInfo.serialnumber;
				const mtm = machineInfo.mtm;
				this.setWarrantyUrl(sn, mtm);
				const geo = localInfo.GEO || 'us';
				const lang = localInfo.Lang?.substr(0, 2) || 'en';

				const warrantyLevelUrl = `${environment.pcsupportApiRoot}/api/v4/upsellaggregation/vantage/warrantyupgradeinfo?sn=${sn}&mtm=${mtm}&geo=${geo}&language=${lang}&clientId=vantage`;

				const warrantyLevelsCache: WarrantyLevel[] = this.localCacheService.getLocalCacheValue(LocalStorageKey.LastWarrantyLevels);
				if (warrantyLevelsCache && warrantyLevelsCache.length > 0) {
					this.warrantyLevels = warrantyLevelsCache;
					this.hasFetchWarrantyLevels = true;
					this.isOnlineWarrantyLevelsAvailable = true;
				}

				const uri = new Windows.Foundation.Uri(warrantyLevelUrl);
				const request = new Windows.Web.Http.HttpRequestMessage(
					Windows.Web.Http.HttpMethod.get,
					uri
				);
				const httpClient = new Windows.Web.Http.HttpClient();
				(async () => {
					try {
						const response = await httpClient.sendRequestAsync(request);
						const result = await response.content.readAsStringAsync();
						if (result) {
							const resultJson = JSON.parse(result);
							if (resultJson.code === 0 && resultJson.msg?.desc?.toLowerCase() === 'success') {
								this.logger.info('Fetch warranty levels result: ', resultJson);
								this.warrantyLevels = this.convertWarrantyLevels(resultJson.data.recommendation);
								this.localCacheService.setLocalCacheValue(LocalStorageKey.LastWarrantyLevels, this.warrantyLevels);
								this.hasFetchWarrantyLevels = true;
							} else {
								this.setWarrantyLevelsNotFound();
								this.logger.info('Fetch warranty levels no success response: ', resultJson);
							}
						} else {
							this.setWarrantyLevelsNotFound();
							this.logger.info('Fetch warranty levels no result ', result);
						}
					} catch (e) {
						this.setWarrantyLevelsNotFound();
						this.logger.info('Fetch warranty levels catch error error: ', e);
					}
					httpClient.close();
				})();
			}
		});
	}

	setWarrantyUrl(sn: string, mtm = '') {
		this.warrantyUrl = `https://pcsupport.lenovo.com/warrantylookup?sn=${sn}&mtm=${mtm}&upgrade&cid=ww:apps:pikjhe&utm_source=Companion&utm_medium=Native&utm_campaign=Warranty`;
	}

	getWarrantyUrl(): string {
		return this.warrantyUrl;
	}

	getRoundYear(dayDiff: number) {
		return dayDiff > 0 ? Math.round(dayDiff / 365) : 0;
	}

	getMonthDiff(dayDiff: any, endTime: any) {
		const startTime = endTime - dayDiff * 24 * 3600 * 1000;
		const monthDiff = moment(endTime).diff(moment(startTime), 'months');
		return monthDiff;
	}
}

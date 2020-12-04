import { BatteryHealthLevel, BatteryLifeSpan } from '../battery-health.enum';
import { Component, OnInit } from '@angular/core';

import { BatteryHealthService } from '../battery-health.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Subscription } from 'rxjs';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'vtr-battery-rank-lifespan',
	templateUrl: './battery-rank-lifespan.component.html',
	styleUrls: ['./battery-rank-lifespan.component.scss'],
})
export class BatteryRankLifespanComponent implements OnInit {
	private totalStarCount = 5;
	capability = false;
	activatedRouteSubscription: Subscription;
	items: boolean[] = [];
	currentHealthLevel = 7;
	lifeSpanSymbol = '>';
	lifeSpan = '36';
	rankStarMap = new Map([
		[BatteryHealthLevel.ERROR, -1],
		[BatteryHealthLevel.LEVEL_1, 0],
		[BatteryHealthLevel.LEVEL_2, 1],
		[BatteryHealthLevel.LEVEL_3, 2],
		[BatteryHealthLevel.LEVEL_4, 3],
		[BatteryHealthLevel.LEVEL_5, 4],
		[BatteryHealthLevel.LEVEL_6, 5],
		[BatteryHealthLevel.LEVEL_7, 5],
	]);
	lifeSpanMapMonth = new Map([
		[BatteryLifeSpan.LT_6, '6'],
		[BatteryLifeSpan.GT_6, '6'],
		[BatteryLifeSpan.GT_12, '12'],
		[BatteryLifeSpan.GT_18, '18'],
		[BatteryLifeSpan.GT_24, '24'],
		[BatteryLifeSpan.GT_30, '30'],
		[BatteryLifeSpan.GT_36, '36'],
		[BatteryLifeSpan.ERROR, ''],
	]);
	lifeSpanMapSymbol = new Map([
		[BatteryLifeSpan.LT_6, '<'],
		[BatteryLifeSpan.GT_6, '>'],
		[BatteryLifeSpan.GT_12, '>'],
		[BatteryLifeSpan.GT_18, '>'],
		[BatteryLifeSpan.GT_24, '>'],
		[BatteryLifeSpan.GT_30, '>'],
		[BatteryLifeSpan.GT_36, '>'],
		[BatteryLifeSpan.ERROR, ''],
	]);
	constructor(
		private batteryHealthService: BatteryHealthService,
		public shellServices: VantageShellService,
		private logger: LoggerService
	) {}

	ngOnInit() {
		this.initStars();
		this.getBatteryDetails();
	}

	initStars() {
		this.items = [];
		for (let index = 0; index < this.totalStarCount; index++) {
			this.items.push(true);
		}
	}

	getBatteryDetails() {
		this.logger.info('BatteryLifespan: getBatteryDetails ==> start');
		this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
			this.capability = batteryInfo.isSupportSmartBatteryV2;
			this.currentHealthLevel = this.getActualRank(batteryInfo.batteryHealthLevel);
			this.lifeSpanSymbol = this.getLifeSpanSymbolStr(batteryInfo.predictedLifeSpan);
			this.lifeSpan = this.getLifeSpanStr(batteryInfo.predictedLifeSpan);
			this.logger.info(
				`BatteryLifespan: getBatteryHealth-lifespan  ==> currentHealthLevel ${this.currentHealthLevel}`
			);
			this.logger.info(
				'BatteryLifespan: getBatteryHealth-lifespan  ==> lifeSpan ' + this.lifeSpan
			);
		});
	}

	getActualRank(level: BatteryHealthLevel): number {
		const val = this.rankStarMap.get(level);
		this.logger.info(`BatteryLifespan: rankStarMap ==> val ${val}`);
		return val !== undefined ? val : -1;
	}

	getLifeSpanStr(index: number): string {
		const val = this.lifeSpanMapMonth.get(index);
		this.logger.info(`BatteryLifespan: lifeSpanMap ==> res ${val}`);
		return val ? val : '';
	}

	getLifeSpanSymbolStr(index: number): string {
		const val = this.lifeSpanMapSymbol.get(index);
		this.logger.info(`BatteryLifespan: lifeSpanMap_symbol ==> res ${val}`);
		return val ? val : '';
	}
}

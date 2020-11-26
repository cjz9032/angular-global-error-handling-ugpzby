import { Component, OnInit } from '@angular/core';
import { BatteryHealthService } from '../battery-health.service';
import { Conditions } from './condition-class.enum';
import { BatteryTemperatureStatus } from '../battery-health.enum';
import { partition } from 'rxjs';
import { pluck, skip } from 'rxjs/operators';

@Component({
	selector: 'vtr-battery-temperature',
	templateUrl: './battery-temperature.component.html',
	styleUrls: ['./battery-temperature.component.scss'],
})
export class BatteryTemperatureComponent implements OnInit {
	private conditionBreakpoints = [15, 35, 50];
	temperature = 25;
	condition = 'fine';

	constructor(private batteryHealthService: BatteryHealthService) {}

	ngOnInit(): void {
		const [error$, temperature$] = partition(
			this.batteryHealthService.batteryInfo.pipe(pluck('temperature')),
			(temperature) =>
				typeof temperature !== 'number' || temperature === BatteryTemperatureStatus.ERROR
		);
		error$.pipe(skip(1)).subscribe(() => {
			/**
			 * When something went wrong and return unexpected error, including,
			 * but not limited to plugin, js-bridge. Force to show error status.
			 */
			this.temperature = BatteryTemperatureStatus.ERROR;
			this.condition = Conditions[BatteryTemperatureStatus.ERROR];
		});
		temperature$.subscribe((temperature) => {
			this.temperature = temperature;
			this.condition = Conditions[this._condition(temperature)];
		});
	}

	private _condition(temperature) {
		return this.conditionBreakpoints.reduce(
			(previousValue, currentValue, currentIndex) =>
				temperature > currentValue ? currentIndex + 1 : previousValue,
			0
		);
	}
}

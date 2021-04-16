import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BatteryHealthService } from '../battery-health.service';
import { BatteryCapacityConditions } from '../battery-health.enum';

@Component({
	selector: 'vtr-battery-capacity',
	templateUrl: './battery-capacity.component.html',
	styleUrls: ['./battery-capacity.component.scss'],
})
export class BatteryCapacityComponent implements OnInit {
	@ViewChild('OverCircle') overCircle: ElementRef;
	capacity = 100;
	fullChargeCapacity: string;
	originalDesignCapacity: string;
	capacityError = false;
	condition = BatteryCapacityConditions.ERROR;
	constructor(private batteryHealthService: BatteryHealthService) {}

	ngOnInit(): void {
		this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
			if (batteryInfo) {
				this.isCapacityError(batteryInfo);
			}
			this.setCircleInformation(batteryInfo);
		});
	}

	setCircleInformation(batteryInfo) {
		switch (true) {
			case this.capacityError:
				this.condition = BatteryCapacityConditions.ERROR;
				break;
			case this.capacity >= 40:
				this.condition = BatteryCapacityConditions.GOOD;
				break;
			case this.capacity < 40 && !(batteryInfo.batteryHealthTip === 7 || batteryInfo.batteryHealthTip === 8):
				this.condition = BatteryCapacityConditions.POOR;
				break;
			case this.capacity < 40 && (batteryInfo.batteryHealthTip === 7 || batteryInfo.batteryHealthTip === 8):
				this.condition = BatteryCapacityConditions.AGING;
				break;
			default:
				break;
		}
	}

	onRightIconClick(tooltip: any, $event: any) {
		this.toggleToolTip(tooltip, true);
	}

	toggleToolTip(tooltip: any, canOpen = false) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else if (canOpen) {
				tooltip.open();
			}
		}
	}

	isCapacityError(batteryInfo) {
		this.capacity = batteryInfo.lifePercent > 100 ? 100 : batteryInfo.lifePercent;
		this.fullChargeCapacity =
			batteryInfo.fullChargeCapacity >= 0 ? batteryInfo.fullChargeCapacity : undefined;
		this.originalDesignCapacity =
			batteryInfo.designCapacity > 0 ? batteryInfo.designCapacity : undefined;
		if (
			this.capacity < 0 ||
			this.capacity === undefined ||
			this.fullChargeCapacity === undefined ||
			this.originalDesignCapacity === undefined
		) {
			this.capacityError = true;
		} else {
			this.capacityError = false;
		}
	}

	removeHTMLFormatting(source: string) {
		try {
			return source.replace(/<\/?.+?\/?>/g, ' ').replace(/  +/g, ' ');
		} catch (error) {
			return source;
		}
	}
}

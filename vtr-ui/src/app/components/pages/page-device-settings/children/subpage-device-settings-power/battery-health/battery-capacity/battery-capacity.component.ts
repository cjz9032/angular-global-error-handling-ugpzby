import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BatteryHealthService } from '../battery-health.service';
import { BatteryCapacityCircleStyle } from '../battery-health.enum';

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
	overCircleLength = 264;
	circleStyle = BatteryCapacityCircleStyle.GREEN;
	constructor(private batteryHealthService: BatteryHealthService) {}

	ngOnInit(): void {
		this.batteryHealthService.batteryInfo.subscribe((batteryInfo) => {
			if (batteryInfo) {
				this.isCapacityError(batteryInfo);
			}
			this.setCircleInformation();
		});
	}

	setCircleInformation() {
		if (this.capacity) {
			switch (true) {
				case this.capacityError:
					this.circleStyle = BatteryCapacityCircleStyle.ERROR;
					break;
				case this.capacity < 40:
					this.circleStyle = BatteryCapacityCircleStyle.RED;
					break;
				case this.capacity >= 40 && this.capacity < 60:
					this.circleStyle = BatteryCapacityCircleStyle.PINK;
					break;
				case this.capacity >= 60 && this.capacity < 70:
					this.circleStyle = BatteryCapacityCircleStyle.YELLOW;
					break;
				case this.capacity >= 70:
					this.circleStyle = BatteryCapacityCircleStyle.GREEN;
					break;
				default:
					break;
			}
		} else {
			this.circleStyle =
				this.capacity === 0
					? BatteryCapacityCircleStyle.GREEN
					: BatteryCapacityCircleStyle.ERROR;
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
		// circle perimeter : 2 * Math.PI * r = 2 * π * 42 ≈ 264
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
			this.overCircleLength = 0;
		} else {
			this.capacityError = false;
			this.overCircleLength = (264 / 100) * this.capacity;
		}
	}
}

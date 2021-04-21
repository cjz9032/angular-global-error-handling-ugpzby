import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { AllDays } from 'src/app/data-models/device/all-days.model';
import { KeyCode } from 'src/app/enums/key-code.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';

export const DaysPickerNotificationType = 'standby-days-picker';

@Component({
	selector: 'vtr-ui-days-picker',
	templateUrl: './ui-days-picker.component.html',
	styleUrls: ['./ui-days-picker.component.scss'],
})
export class UiDaysPickerComponent implements OnInit, OnChanges {
	@Input() subHeadingText: string;
	@Input() daysId: string;
	@Input() linkId: string;
	@Input() showDropDown: boolean;
	@Output() setDays = new EventEmitter<string>();

	public scheduleLongForm: string;
	public schedule: string;
	public allDays: AllDays[];
	public checkedLength: number;

	constructor(
		public translate: TranslateService,
		public commonService: CommonService,
		public smartStandbyService: SmartStandbyService,
		private logger: LoggerService
	) {
		this.commonService.notification.subscribe(this.onNotification.bind(this));
	}

	ngOnInit() {
		this.splitDays();
		this.log('ngOnInit');
	}

	private log(event: string) {
		const { schedule, allDays, scheduleLongForm, checkedLength } = this.smartStandbyService;
		this.logger.info(`UiDaysPickerComponent - ${event}`, { schedule, allDays, scheduleLongForm, checkedLength });
	}

	onNotification(appNotification: AppNotification) {
		const { type } = appNotification;
		if (type === DaysPickerNotificationType) {
			this.splitDays();
			this.log('onNotification');
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.splitDays();
		this.log('ngOnChanges');
	}

	clearSettings(listbox: HTMLElement) {
		this.splitDays();
		this.sendToggleNotification(false);
		if (listbox) {
			listbox.focus();
		}
	}

	onToggleDropDown() {
		this.splitDays();
		const { schedule, allDays, scheduleLongForm, checkedLength } = this.smartStandbyService;
		this.logger.info('UiDaysPickerComponent - onToggleDropDown', { schedule, allDays, scheduleLongForm, checkedLength });
		this.sendToggleNotification(!this.showDropDown);
	}

	sendToggleNotification(dropDown: boolean) {
		this.commonService.sendNotification('smartStandbyToggles', { id: 2, value: dropDown });
	}

	setOffDays(listbox: HTMLElement) {
		const setSelectedDays = this.smartStandbyService.selectedDays.join();
		this.setDays.emit(setSelectedDays);
		this.sendToggleNotification(false);
		if (listbox) {
			listbox.focus();
		}
	}

	selectDay($event: boolean, shortName: string) {
		const value = $event;
		if (value) {
			this.smartStandbyService.selectedDays.push(shortName);
		} else {
			const index = this.smartStandbyService.selectedDays.indexOf(shortName);
			this.smartStandbyService.selectedDays.splice(index, 1);
		}
		this.smartStandbyService.checkedLength = this.smartStandbyService.selectedDays.length;
		this.checkedLength = this.smartStandbyService.selectedDays.length;
	}

	navigateByKeys($event, index) {
		switch ($event.keyCode) {
			case KeyCode.UP:
			case KeyCode.LEFT:
				const previousDay = this.smartStandbyService.allDays[index - 1].shortName;
				const previousDayHtml = document.querySelector(
					'div[aria-labelledby="' + previousDay + '"]'
				) as HTMLElement;
				previousDayHtml.focus();
				$event.preventDefault();
				$event.stopPropagation();
				break;
			case KeyCode.DOWN:
			case KeyCode.RIGHT:
				const nextDay = this.smartStandbyService.allDays[index + 1].shortName;
				const nextDayHtml = document.querySelector(
					'div[aria-labelledby="' + nextDay + '"]'
				) as HTMLElement;
				nextDayHtml.focus();
				$event.preventDefault();
				$event.stopPropagation();
				break;
			default:
				break;
		}
	}

	private splitDays() {
		this.smartStandbyService.splitDays();
		this.scheduleLongForm = this.smartStandbyService.scheduleLongForm;
		this.schedule = this.smartStandbyService.schedule;
		this.allDays = this.smartStandbyService.allDays;
		this.checkedLength = this.smartStandbyService.checkedLength;
	}
}

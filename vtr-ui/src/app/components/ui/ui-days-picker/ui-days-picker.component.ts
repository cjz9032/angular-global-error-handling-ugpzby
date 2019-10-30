import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DaysOfWeek } from 'src/app/enums/days-of-week.enum';
import { AllDays } from 'src/app/data-models/device/all-days.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';

@Component({
	selector: 'vtr-ui-days-picker',
	templateUrl: './ui-days-picker.component.html',
	styleUrls: ['./ui-days-picker.component.scss']
})
export class UiDaysPickerComponent implements OnInit, OnChanges {
	@Input() subHeadingText: string;
	@Input() daysId: string;
	@Input() showDropDown: boolean;
	@Output() setDays = new EventEmitter<string>();

	constructor(
		public translate: TranslateService,
		public commonService: CommonService,
		public smartStandbyService: SmartStandbyService) { }

	ngOnInit() {
		this.smartStandbyService.splitDays();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.smartStandbyService.splitDays();
	}

	clearSettings(listbox: HTMLElement) {
		this.smartStandbyService.splitDays();
		this.sendToggleNotification(false);
		listbox.focus();
	}

	onToggleDropDown() {
		this.smartStandbyService.splitDays();
		this.sendToggleNotification(!this.showDropDown);
	}

	sendToggleNotification(dropDown: boolean) {
		this.commonService.sendNotification('smartStandbyToggles', { id: 2, value: dropDown });
	}

	setOffDays(listbox: HTMLElement) {
		const setSelectedDays = this.smartStandbyService.selectedDays.join();
		this.setDays.emit(setSelectedDays);
		this.sendToggleNotification(false);
		listbox.focus();
	}

	selectDay(event) {
		console.log(event);
		console.log(event.target.checked);
		console.log(event.target.value);
		if (event.target.checked) {
			this.smartStandbyService.selectedDays.push(event.target.value);
		} else {
			const index = this.smartStandbyService.selectedDays.indexOf(event.target.value);
			this.smartStandbyService.selectedDays.splice(index, 1);
		}
		this.smartStandbyService.checkedLength = this.smartStandbyService.selectedDays.length;
	}
}

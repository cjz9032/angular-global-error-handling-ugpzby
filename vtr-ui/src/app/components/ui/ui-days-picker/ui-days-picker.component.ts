import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { KeyCode } from 'src/app/enums/key-code.enum';
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
	@Input() linkId: string;
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
		if (listbox) {
			listbox.focus();
		}

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
	}

	navigateByKeys($event, index) {
		switch ($event.keyCode) {
			case KeyCode.UP:
			case KeyCode.LEFT:
				const previousDay = this.smartStandbyService.allDays[index - 1].shortName;
				const previousDayHtml = document.querySelector('div[aria-labelledby="' + previousDay + '"]') as HTMLElement;
				previousDayHtml.focus();
				$event.preventDefault();
				$event.stopPropagation();
				break;
			case KeyCode.DOWN:
			case KeyCode.RIGHT:
				const nextDay = this.smartStandbyService.allDays[index + 1].shortName;
				const nextDayHtml = document.querySelector('div[aria-labelledby="' + nextDay + '"]') as HTMLElement;
				nextDayHtml.focus();
				$event.preventDefault();
				$event.stopPropagation();
				break;
			default:
				break;
		}

	}

}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'vtr-modal-schedule-new-scan',
	templateUrl: './modal-schedule-new-scan.component.html',
	styleUrls: ['./modal-schedule-new-scan.component.scss']
})
export class ModalScheduleNewScanComponent implements OnInit, OnChanges {

	@Output() scheduleScanClick = new EventEmitter<any>();
	@Input() title = this.translate.instant('hardwareScan.recurrence');
	@Input() buttonText = this.translate.instant('hardwareScan.scheduledScan.schedule');
	@Input() editMode: boolean;
	@Input() editScan: any;

	public editScanOptions: any;
	public scheduleNewScanButtonText: string;
	public option: string;
	public date: any;
	public optionsAMPM: any[] = [];
	public optionsInterval: any[] = [];
	public optionsHours: any[] = [];
	public optionsMinute: any[] = [];

	public recurrence: string = this.translate.instant('hardwareScan.recurrence');
	public interval: string = this.translate.instant('hardwareScan.interval');
	public dateToken: string = this.translate.instant('hardwareScan.scheduledScan.date');
	public pickDate: string = this.translate.instant('hardwareScan.scheduledScan.pickDate');
	public time: string = this.translate.instant('hardwareScan.time');
	public hours: string = this.translate.instant('hardwareScan.hours');
	public minutes: string = this.translate.instant('hardwareScan.minutes');
	public ampm: string = this.translate.instant('hardwareScan.am') + ' / ' + this.translate.instant('hardwareScan.pm');
	public delete: string = this.translate.instant('hardwareScan.scheduledScan.delete');
	public warning: string = this.translate.instant('hardwareScan.scheduledScan.warningBatterySaver');
	public typeOfScan = this.translate.instant('hardwareScan.type');
	public quickScan = this.translate.instant('hardwareScan.quickScan');
	public fullScan = this.translate.instant('hardwareScan.scheduledScan.fullScan');

	public timeScan: string;
	public selectedInterval: any;
	public hour: string;
	public minute: string;
	public amPm: string;
	public intervalOption: number;
	public disable: boolean;

	constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {
		this.optionsAMPM = [{ name: this.translate.instant('hardwareScan.am'), id: 1 }, { name: this.translate.instant('hardwareScan.pm'), id: 2 }];

		this.optionsInterval = [{ name: this.translate.instant('hardwareScan.scheduledScan.onlyOnce'), id: 1 }, { name: this.translate.instant('hardwareScan.scheduledScan.eachDay'), id: 2 },
		{ name: this.translate.instant('hardwareScan.scheduledScan.eachWeek'), id: 3 }, { name: this.translate.instant('hardwareScan.scheduledScan.eachMonth'), id: 4 }];

		for (let i = 0; i < 12; i++) {
			this.optionsHours.push({ name: (i + 1).toString(), id: i });
		}

		for (let i = 0; i < 60; i++) {
			this.optionsMinute.push({ name: i.toString(), id: i });
		}
	}

	ngOnChanges() {
		this.ngOnInit();
	}

	ngOnInit() {
		this.scheduleNewScanButtonText = this.buttonText;
		if (this.editScan && this.editMode) {
            const scanTime = this.editScan.time.split(':');

            this.pickDate = this.editScan.date;

            const dateSplitted = this.editScan.name.split('/');

            this.date = {
				year: parseInt(dateSplitted[0], 10),
				month: parseInt(dateSplitted[1], 10),
				day: parseInt(dateSplitted[2], 10)
			};

            switch (this.editScan.frequency) {
				case 0:
					this.selectedInterval = this.optionsInterval[0].name;
					this.intervalOption = 0;
					break;
				case 1:
					this.selectedInterval = this.optionsInterval[1].name;
					this.intervalOption = 1;
					break;
				case 2:
					this.selectedInterval = this.optionsInterval[2].name;
					this.intervalOption = 2;
					break;
				case 3:
					this.selectedInterval = this.optionsInterval[3].name;
					this.intervalOption = 3;
					break;
				default:
					this.intervalOption = 0;
			}

            if (this.editScan.scanType === this.quickScan) {
				(<HTMLInputElement>document.getElementById('quick')).checked = true;
				this.option = '0';
			} else {
				this.option = '1';
				(<HTMLInputElement>document.getElementById('full')).checked = true;
			}
            this.hour = JSON.stringify(parseInt(scanTime[0], 10));
            if (parseInt(scanTime[0], 10) === 0) {
				this.hour = '12';
				this.amPm = this.translate.instant('hardwareScan.am');
			} else if (parseInt(scanTime[0], 10) === 12) {
				this.hour = '12';
				this.amPm = this.translate.instant('hardwareScan.pm');
			} else {
				if (parseInt(scanTime[0], 10) > 12) {
					this.hour = JSON.stringify(parseInt(scanTime[0], 10) - 12);
					this.amPm = this.translate.instant('hardwareScan.pm');
				} else {
					this.hour = JSON.stringify(parseInt(scanTime[0], 10));
					this.amPm = this.translate.instant('hardwareScan.am');
				}
			}
            this.minute = scanTime[1];
            if (this.minute[0] === '0') {
				this.minute = this.minute[1];
			}


            this.editScanOptions = this.buildScanOptions();
            this.editScanOptions.taskID = this.editScan.deleteReq.taskID;
        } else {
			this.option = '0';

			const currentDate = new Date();
			this.hour = String(currentDate.getHours() % 12);
			if (this.hour === '0') {
				this.hour = '12';
			}
			this.minute = String(currentDate.getMinutes());

			if (currentDate.getHours() >= 12) {
				this.amPm = this.translate.instant('hardwareScan.pm');
			} else {
				this.amPm = this.translate.instant('hardwareScan.am');
			}

			(<HTMLInputElement>document.getElementById('quick')).checked = true;
			this.disable = true;
		}
	}

	public onScanOptionChange(entry) {
        this.option = entry;
    }

	public updateSelectedFrequency(data) {
        this.selectedInterval = data;
        switch (data) {
			case this.optionsInterval[0].name:
				this.intervalOption = 0;
				break;
			case this.optionsInterval[1].name:
				this.intervalOption = 1;
				break;
			case this.optionsInterval[2].name:
				this.intervalOption = 2;
				break;
			case this.optionsInterval[3].name:
				this.intervalOption = 3;
				break;
			default:
				this.intervalOption = 0;
		}
        this.checkParameters();
    }

	public updateSelectedHour(data) {
		this.hour = data;
		this.checkParameters();
	}

	public updateSelectedMinute(data) {
		this.minute = data;
		this.checkParameters();
	}

	public updateSelectedAMPM(data) {
		this.amPm = data;
		this.checkParameters();
	}

	public onDateSelect(data) {
        this.checkParameters();
    }

	public checkParameters() {

		if (this.hour && this.minute && this.amPm && this.selectedInterval && this.date) {

			if (this.hour && this.minute && this.amPm && this.selectedInterval && this.date) {
                let h = '';

                if (this.hour === '12' && this.amPm === this.translate.instant('hardwareScan.am')) {
					h = '0';
				} else if (this.hour !== '12' && this.amPm === this.translate.instant('hardwareScan.pm')) {
					h = String((parseInt(this.hour, 10) + 12));
				} else {
					h = this.hour;
				}

                const chosenDate = new Date(this.date.year, this.date.month - 1, this.date.day, parseInt(h, 10), parseInt(this.minute, 10));

                const currentDate = new Date();

                if (chosenDate > currentDate) {
					this.disable = false;
				} else {
					this.disable = true;
				}
            }
		}
	}

	public buildScanOptions() {
        let correctedHour = '';

        if (this.amPm === this.translate.instant('hardwareScan.pm')) {
			let h = (parseInt(this.hour, 10) + 12) % 24;
			if (h === 0) {
				h = 12;
			}
			correctedHour = JSON.stringify(h);
		} else {
			let h = (parseInt(this.hour, 10));
			if (h === 12) {
				h = 0;
			}
			correctedHour = JSON.stringify(h);
		}

        this.timeScan = '';
        if (correctedHour.length === 1) {
			this.timeScan += '0';
		}
        this.timeScan += correctedHour + ':';

        if (this.minute.length === 1) {
			this.timeScan += '0';
		}
        this.timeScan += this.minute;

        const dateFormats = [];

        let month = '';
        let day = '';

        if (this.date.month < 10) {
			month = '0';
		}
        month += JSON.stringify(this.date.month);

        if (this.date.day < 10) {
			day = '0';
		}
        day += JSON.stringify(this.date.day);

        dateFormats.push(month + '/' + day + '/' + JSON.stringify(this.date.year));
        dateFormats.push(day + '/' + month + '/' + JSON.stringify(this.date.year));

        let options: any;

        if (typeof this.timeScan !== 'undefined' && typeof this.intervalOption !== 'undefined' && typeof this.option !== 'undefined') {
            options = {
				interval: this.intervalOption,
				date: dateFormats,
				time: this.timeScan,
				scanOption: this.option,
			};
        } else {}

        return options;
    }

	public onDeleteScan(): void {

		const scheduleResult = {
			mode: 2,
			deleteRequest: this.editScan.deleteReq
		};

		this.activeModal.close(scheduleResult);
	}

	public onNewScanScheduling(): void {
        const scheduleScanOptions = this.buildScanOptions();

        this.scheduleNewScanButtonText = this.translate.instant('hardwareScan.scheduledScan.scanScheduled');

        const scheduleResult = {
			mode: 0,
			newScan: scheduleScanOptions,
			oldScan: null
		};

        if (this.editMode) {
			scheduleResult.mode = 1;
			scheduleResult.oldScan = this.editScanOptions;
		}

        this.activeModal.close(scheduleResult);
    }
}

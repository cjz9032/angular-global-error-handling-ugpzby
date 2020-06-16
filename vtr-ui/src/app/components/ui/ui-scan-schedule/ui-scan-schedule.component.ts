import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
} from "@angular/core";
import { CommonService } from "src/app/services/common/common.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { SmartPerformanceService } from "src/app/services/smart-performance/smart-performance.service";
import { LocalStorageKey } from "src/app/enums/local-storage-key.enum";
import moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { enumScanFrequency } from "src/app/enums/smart-performance.enum";

@Component({
	selector: "vtr-ui-scan-schedule",
	templateUrl: "./ui-scan-schedule.component.html",
	styleUrls: ["./ui-scan-schedule.component.scss"],
})
export class UiScanScheduleComponent implements OnInit {
	constructor(
		private commonService: CommonService,
		private logger: LoggerService,
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService
	) {}
		
	// scan settings
	@Output() scanDatekValueChange = new EventEmitter();
	selectedDate: any;
	isSubscribed: any;
	scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	selectedNumber: any;
	scanFrequency: any = [
		"smartPerformance.scanSettings.scanFrequencyWeek",
		"smartPerformance.scanSettings.scanFrequencyEveryWeek",
		"smartPerformance.scanSettings.scanFrequencyMonth"
	];
	days: any = [
		"smartPerformance.scanSettings.sun",
		"smartPerformance.scanSettings.mon",
		"smartPerformance.scanSettings.tue",
		"smartPerformance.scanSettings.wed",
		"smartPerformance.scanSettings.thu",
		"smartPerformance.scanSettings.fri",
		"smartPerformance.scanSettings.sat",
	];
	dates: any = ["1", "2", "3", "4", "5", "6", "7",
		"8", "9", "10", "11", "12", "13", "14", "15",
		"16", "17", "18", "19", "20", "21", "22", "23",
		"24", "25", "26", "27", "28",];
	hours: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	mins: any = ["00", "05", "10", "15", "20", "25", "30",
		"35", "40", "45", "50", "55",];
	amPm: any = ["AM", "PM"];
	isDaySelectionEnable: boolean;
	scanToggleValue = true;
	frequencyValue = 0;
	dayValue = 0;
	dateValue = 0;
	scanTime: any = {
		hour: this.hours[11],
		hourId: 11,
		min: this.mins[0],
		minId: 0,
		amPm: this.amPm[0],
		amPmId: 0,
	};
	copyScanTime: any = {
		hour: this.hours[11],
		hourId: 11,
		min: this.mins[0],
		minId: 0,
		amPm: this.amPm[0],
		amPmId: 0,
	};
	// scanScheduleDate: any;
	IsScheduleScanEnabled: any;
	IsSmartPerformanceFirstRun: any;
	selectedFrequencyCopy: any;
	// public scanData: any = {};
	scheduleScanFrequency: any;
	nextScheduleScanDate: any;
	public enumLocalScanFrequncy: any;
	requestScanData = {};
	type: string;
	isFirstVisit: boolean

	ngOnInit() {
		this.scanFrequency.forEach(sf => {
			this.translate.stream(sf).subscribe((value) => {
				sf = value;
			});
		});

		this.days.forEach(d => {
			this.translate.stream(d).subscribe((value) => {
				d = value;
			});
		});
		this.isDaySelectionEnable = false;
		this.enumLocalScanFrequncy = enumScanFrequency;

		// fetching values from local storage, if saved.
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);		
		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);
		this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun);
		this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
				
		// setting scan frequency when no value returned from local storage else using as selectedFrequency
		if (this.scheduleScanFrequency === undefined) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.scanFrequency[0]);
			this.selectedFrequency = this.scanFrequency[0]
			this.frequencyValue = this.scanFrequency.indexOf(this.selectedFrequency);
		} else {
			this.selectedFrequency = this.scheduleScanFrequency;
			this.frequencyValue = this.scanFrequency.indexOf(this.selectedFrequency);
		}

		// when it is SP first run setting type and also formatted payload for backend as prescribed in confluence page.
		if (this.IsSmartPerformanceFirstRun) {
			this.isFirstVisit = true;
			this.type = "firstRun";
			this.payloadData(this.type);
		}

		if (this.IsScheduleScanEnabled) {
			this.scanToggleValue = true;
		} else {
			this.scanToggleValue = false;
			// when no record is present and scan is disabled setting default day.
			this.selectedDay = this.days[0]
		}

		if (this.IsSmartPerformanceFirstRun === true &&	this.isSubscribed == true) {
			this.unregisterScheduleScan("Lenovo.Vantage.SmartPerformance.ScheduleScan");
			// this.scheduleScan(this.requestScanData);
			// this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			// this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.scanFrequency[0]);
		}

		if (this.IsSmartPerformanceFirstRun === true && this.isSubscribed == false) {
			this.scheduleScan(this.requestScanData);
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.scanFrequency[0]);
		}

		// fetching next schedule date and time from task scheduler
		if (this.scheduleScanFrequency !== undefined && this.IsScheduleScanEnabled && !this.IsSmartPerformanceFirstRun) {
			if (this.isSubscribed) {
				this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix");
			} else {
				this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScan");
			}
		}
	}

	// scan settings
	changeScanSchedule() {
		if (this.scanToggleValue) {
			this.isChangeSchedule = true;
		}
	}
	openScanScheduleDropDown(value) {
		if (value === this.scheduleTab) {
			this.scheduleTab = "";
		} else {
			this.scheduleTab = value;
		}
	}

	@HostListener("window:click", ["$event"])
	onClick(event: Event): void {
		if (this.scheduleTab === "") {
			return;
		}
		if (
			event.target["classList"][1] !== "fa-chevron-down" &&
			event.target["classList"][0] !== "freq-dropdown" &&
			event.target["classList"][0] !== "day-dropdown" &&
			event.target["classList"][0] !== "date-dropdown" &&
			event.target["classList"][0] !== "time-dropdown" &&
			event.target["classList"][1] !== "hour-block" &&
			event.target["classList"][1] !== "minutes-block" &&
			event.target["classList"][1] !== "amPm-block" &&
			event.target["classList"][0] !== "hour-text" &&
			event.target["classList"][0] !== "min-text" &&
			event.target["classList"][0] !== "amPm-text" &&
			event.target["classList"][0] !== "status" &&
			event.target["classList"][0] !== "ml-3"
		) {
			this.scheduleTab = "";
		}
	}

	changeScanFrequency(value) {
		this.scheduleTab = "";
		this.frequencyValue = value;
		this.selectedFrequency = this.scanFrequency[value];
		this.isDaySelectionEnable = true;
		if(this.selectedFrequency === this.scanFrequency[0]) {
			this.selectedDay = this.days[value];
			this.dayValue = value;
		}
		if(this.selectedFrequency === this.scanFrequency[1]) {
			this.selectedDay = this.days[0];
			this.dayValue = this.days.indexOf(this.selectedDay)
		}
		if(this.selectedFrequency === this.scanFrequency[2]) {
			this.selectedNumber = this.dates[0]
			this.dateValue = this.dates.indexOf(this.selectedNumber)
		}
	}
	changeScanDay(value) {
		this.dayValue = value;
		this.scheduleTab = "";
		this.selectedDay = this.days[value];
	}
	changeScanDate(value) {
		this.dateValue = value;
		this.scheduleTab = "";
		this.selectedNumber = this.dates[value];
	}

	cancelChangedScanSchedule() {
		this.scheduleTab = "";
		this.isChangeSchedule = false;
		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);
		this.changeScanFrequency(this.scanFrequency.indexOf(this.scheduleScanFrequency));
		if (this.isSubscribed) {
			this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix");
		} else {
			this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScan");
		}
	}

	saveChangeScanTime() {
		this.scheduleTab = "";
		this.scanTime = {...this.copyScanTime}
	}
	cancelChangeScanTime() {
		this.scheduleTab = "";
		this.copyScanTime = {...this.scanTime}
	}
	changeHoursTime(value) {
		this.copyScanTime.hour = this.hours[value];
		this.copyScanTime.hourId = value;
	}
	changeMinutesTime(value) {
		this.copyScanTime.min = this.mins[value];
		this.copyScanTime.minId = value;
	}
	changeAmPm(value) {
		this.copyScanTime.amPm = this.amPm[value];
		this.copyScanTime.amPmId = value;
	}
	changeScanScheduleDate() {
		this.scheduleTab = "";
	}

	// setting type based on the frequency.
	setTypeOfFrequency() {
		if (this.selectedFrequency === this.scanFrequency[0]) {
			this.type = "weekly";
		}
		if (this.selectedFrequency === this.scanFrequency[1]) {
			this.type = "otherweek";
		}
		if (this.selectedFrequency === this.scanFrequency[2]) {
			this.type = "monthly";
		}
	}

	// this method is called when clicked on Save schedule scan
	saveChangedScanSchedule() {
		try {
			this.scheduleTab = "";
			this.isChangeSchedule = false;
			this.setTypeOfFrequency()

			// if (!this.isSubscribed) {
			// 	this.unregisterScheduleScan("Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix");
			// }
			this.payloadData(this.type);
			this.scheduleScan(this.requestScanData);
			this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
			this.logger.info('ui-scan-schedule.component.saveChangedScanSchedule', JSON.stringify(this.requestScanData))
		} catch (err) {
			this.logger.error("ui-scan-schedule.component.saveChangedScanSchedule", err);
		}
	}

	// deletes records from task scheduler
	async unregisterScheduleScan(scantype) {
		const payload = {scantype};
		this.logger.info("ui-smart-performance.unregisterScheduleScan", JSON.stringify(payload));
		try {
			const res: any = await this.smartPerformanceService.unregisterScanSchedule(payload);
			// when unregisterScheduleScan is successful and scheduledScan is enabled, sending request to set schedule scan
			if(res.state && this.scanToggleValue) {
				this.scheduleScan(this.requestScanData);
				this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartPerformanceFirstRun, false);
				this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.scanFrequency[0]);
			}
			this.logger.info("ui-smart-performance.unregisterScheduleScan.then", JSON.stringify(res));
		} catch (err) {
			this.logger.error("ui-smart-performance.unregisterScheduleScan.then", err);
		}
	}

	//toggle button event schedule scan
	setEnableScanStatus(event: any) {
		this.logger.info("setEnableScanStatus", event.switchValue);
		this.scanToggleValue = event.switchValue;

		if (!event.switchValue) {
			if (this.isSubscribed) {
				this.unregisterScheduleScan("Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix");
				this.setDefaultValWhenDisabled()
				// hiding Next Schedule Scan in SP scan-summary
				this.scanDatekValueChange.emit({ nextEnable: event.switchValue });
			} else {
				this.unregisterScheduleScan("Lenovo.Vantage.SmartPerformance.ScheduleScan");
				this.setDefaultValWhenDisabled()
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, false);
			this.commonService.removeLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency);
		} else {
			this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled);
			if (!this.IsScheduleScanEnabled) {
				this.selectedFrequency = this.scanFrequency[0]
				this.frequencyValue = this.scanFrequency.indexOf(this.selectedFrequency)
				this.isFirstVisit = false;
				this.type = "firstRun";
				this.payloadData(this.type);
				this.scheduleScan(this.requestScanData);
				this.commonService.setLocalStorageValue(LocalStorageKey.IsSPScheduleScanEnabled, true);
				this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
			}
		}
	}

	async scheduleScan(payload) {
		try {
			const res: any = await this.smartPerformanceService.setScanSchedule(payload);
			// when saving schedule scan is successful, fetching next scan runtime from backend and updating respective fields
			if (res.state) {
				if (this.isSubscribed) {
					this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix");
				} else {
					this.getNextScanRunTime("Lenovo.Vantage.SmartPerformance.ScheduleScan");
				}
			}
		} catch (err) {
			this.logger.error("ui-smart-performance.scheduleScan.then", err);
		}
	}

	async getNextScanRunTime(scantype: string) {
		const payload = { scantype };
		let nextScanEvent = {};
		this.logger.info("ui-smart-performance.getNextScanRunTime",	JSON.stringify(payload)	);
		try {
			const res: any = await this.smartPerformanceService.getNextScanRunTime(payload);
			this.logger.info("ui-smart-performance.getNextScanRunTime.then", JSON.stringify(res));
			// checking next scan run time fetched from api and when present emitting to sp scan summary component and also updating respective fields
			if (res.nextruntime) {
				const dt = moment(res.nextruntime).format("dddd, MM, D, YYYY, h, mm, A");
				if (this.selectedFrequency === this.scanFrequency[0] || this.selectedFrequency === this.scanFrequency[1]) {
					this.selectedDay = dt.split(",")[0];
					this.dayValue = this.days.indexOf(this.selectedDay);
				}
				if (this.selectedFrequency === this.scanFrequency[2]) {
					this.selectedNumber = dt.split(",")[2];
					this.selectedDate = dt.split(",")[2];
					this.dateValue = this.dates.indexOf(this.selectedNumber.trim());
				}
				this.copyScanTime.hour = dt.split(",")[4];
				this.copyScanTime.min = dt.split(",")[5].trim();
				this.copyScanTime.amPm = dt.split(",")[6].trim();
				this.copyScanTime.hourId = this.hours.indexOf(+this.copyScanTime.hour);
				this.copyScanTime.minId = this.mins.indexOf(this.copyScanTime.min);
				this.copyScanTime.amPmId = this.amPm.indexOf(this.copyScanTime.amPm);
				this.scanTime = {...this.copyScanTime}
				nextScanEvent = {
					nextEnable: true,
					nextScanDate: dt.split(",")[1]+'/'+dt.split(",")[2].trim(),
					nextScanHour: this.scanTime.hour,
					nextScanMin: this.scanTime.min,
					nextScanAMPM: this.scanTime.amPm,
					nextScanDateWithYear: dt.split(",")[1]+'/'+dt.split(",")[2].trim()+'/'+dt.split(",")[3]
				};
				this.scanDatekValueChange.emit(nextScanEvent);
				return;
			}

			// when vantage service is uninstalled and reinstalled this conditions executes
			if(!res.state) {
				this.selectedFrequency = this.scanFrequency[0]
				this.frequencyValue = this.scanFrequency.indexOf(this.selectedFrequency)
				this.isFirstVisit = false;
				this.type = "firstRun";
				this.payloadData(this.type);
				this.scheduleScan(this.requestScanData);
				this.commonService.setLocalStorageValue(LocalStorageKey.SPScheduleScanFrequency, this.selectedFrequency);
				return
			}
			
		} catch (err) {
			this.logger.error("ui-smart-performance.getNextScanRunTime.then", err);
		}
	}

	setDefaultValWhenDisabled() {
		this.selectedFrequency = this.scanFrequency[0]
		this.selectedDay = this.days[0]
		this.scanTime = {
			hour: this.hours[11],
			hourId: 11,
			min: this.mins[0],
			minId: 0,
			amPm: this.amPm[0],
			amPmId: 0,
		}
	}

	// setting payload for scanSchedule method
	payloadData(typeRun: string) {
		let currentMom;
		switch (typeRun) {
			case "firstRun":
				let roundOffMin;
				const roundOffSecToZero = '00';
				if(this.isFirstVisit) {
					if(moment().minute() > 55) {
						currentMom = moment().add(2, 'hours').format("dddd, YYYY, MM, D, HH, mm, ss");
						roundOffMin = '00'
					} else {
						currentMom = moment().add(1, 'hours').format("dddd, YYYY, MM, D, HH, mm, ss");
						roundOffMin = (Math.ceil(+currentMom.split(",")[5] / 5) * 5).toString()
					}
				}
				if(!this.isFirstVisit) {
					// roundingoff minutes to hour when minutes greater than 55 else to multiples of 5 when minutes less than 55 - intermittent issue fix
					if(moment().minute() > 55) {
						currentMom = moment().add(1, 'hours').format("dddd, YYYY, MM, D, HH, mm, ss");
						roundOffMin = '00'
					} else {
						currentMom = moment().format("dddd, YYYY, MM, D, HH, mm, ss");
						roundOffMin = (Math.ceil(+currentMom.split(",")[5] / 5) * 5).toString()
					}
				}
				const data = {
					frequency: "onceaweek",
					day: currentMom.split(",")[0],
					time: moment([
						currentMom.split(",")[1],
						(+currentMom.split(",")[2]-1).toString(),
						currentMom.split(",")[3],
						currentMom.split(",")[4],
						roundOffMin,
						roundOffSecToZero,
					]).format('YYYY-MM-DDTHH:mm:ss'),
					date: [],
				};
				if (this.isSubscribed) {
					this.requestScanData = {scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix",	...data,};
				}
				if (!this.isSubscribed) {
					this.requestScanData = {scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScan", ...data,};
				}
				break;

			case "weekly":
				if (moment().day() <= this.dayValue) {
					currentMom = moment().day(this.dayValue).format("YYYY, MM, D, ss");
				} else {
					currentMom = moment().day(this.dayValue).add(1, "weeks").format("YYYY, MM, D, ss");
				}
				this.commonLines(currentMom, this.selectedFrequency);
				break;

			case "otherweek":
				if (moment().day() <= this.dayValue) {
					currentMom = moment().day(this.dayValue).format("YYYY, MM, D, ss");
				} else {
					currentMom = moment().day(this.dayValue).add(2, "weeks").format("YYYY, MM, D, ss");
				}
				this.commonLines(currentMom, this.selectedFrequency);
				break;

			case "monthly":
				if (+this.selectedNumber < moment().date()) {
					currentMom = moment().date(+this.selectedNumber).add(1, "months").format("YYYY, MM, D, ss");
				} else {
					currentMom = moment().date(+this.selectedNumber).format("YYYY, MM, D, ss");
				}
				this.commonLines(currentMom, this.selectedFrequency);
				break;
		}
	}

	// repeating code in payload kept as method.
	commonLines(currentMoment, frequency) {
		const freq =
			frequency === "Every month"
				? frequency.replace("Every", "oncea").replace(" ", "")
				: frequency.replace(" ", "").replace(" ", "");
		const roundOffSecToZero = '00'
		const tme = this.scanTime.hour + " " + this.scanTime.amPm;
		const roundedhours = moment(tme, ["h A"]).format("HH");
		const data = {
			frequency: freq.toLowerCase(),
			day: freq !== "onceamonth" ? this.selectedDay : "",
			time: moment([
				currentMoment.split(",")[0],
				(+currentMoment.split(",")[1]-1).toString(),
				currentMoment.split(",")[2],
				roundedhours,
				this.scanTime.min,
				roundOffSecToZero,
			]).format('YYYY-MM-DDTHH:mm:ss'),
			date: freq === "onceamonth" ? [+this.selectedNumber] : [],
		};
		if (this.isSubscribed) {
			this.requestScanData = {scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix", ...data,};
		}
		if (!this.isSubscribed) {
			this.requestScanData = {scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScan", ...data,};
		}
	}
}

import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
} from "@angular/core";
import { NgbModal, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
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
		private calendar: NgbCalendar,
		private logger: LoggerService,
		public smartPerformanceService: SmartPerformanceService,
		private translate: TranslateService
	) {}
	public machineFamilyName: string;
	public today = new Date();
	public items: any = [];
	isSubscribed: any;
	title = "smartPerformance.title";
	public menuItems: any = [
		{ itemName: "Annual", itemKey: "ANNUAL" },
		{ itemName: "Quarterly", itemKey: "QUARTERLY" },
		{ itemName: "Custom", itemKey: "CUSTOM" },
	];
	leftAnimator: any;
	@Input() isScanning = false;
	@Input() isScanningCompleted = false;
	@Input() tune = 0;
	@Input() boost = 0;
	@Input() secure = 0;
	@Input() rating = 0;
	@Output() scanDatekValueChange = new EventEmitter();
	public tabIndex: number;
	public toggleValue: number;
	public currentYear: any;
	public lastYear: any;
	// historyRes: any = {};
	// historyScanResults = [];
	menuStatus = true;
	selectedResult: any;
	annualYear: any;
	quarterlyMonth: any;
	isDropDownOpen: boolean;
	dropDownToggle: boolean;
	currentDate: any;
	fromDate: any;
	toDate: any;
	selectedDate: any;
	isFromDate: boolean;
	selectedfromDate: any;
	selectedTodate: any;
	displayFromDate: any;
	displayToDate: any;
	customDate: any;
	@Output() backToScan = new EventEmitter();

	// scan settings
	scheduleTab;
	isChangeSchedule = false;
	selectedFrequency: any;
	selectedDay: any;
	selectedNumber: any;

	scanFrequency: any = [
		this.translate.instant(
			"smartPerformance.scanSettings.scanFrequencyWeek"
		),
		this.translate.instant(
			"smartPerformance.scanSettings.scanFrequencyEveryWeek"
		),
		this.translate.instant(
			"smartPerformance.scanSettings.scanFrequencyMonth"
		),
	];
	days: any = [
		this.translate.instant("smartPerformance.scanSettings.sun"),
		this.translate.instant("smartPerformance.scanSettings.mon"),
		this.translate.instant("smartPerformance.scanSettings.tue"),
		this.translate.instant("smartPerformance.scanSettings.wed"),
		this.translate.instant("smartPerformance.scanSettings.thu"),
		this.translate.instant("smartPerformance.scanSettings.fri"),
		this.translate.instant("smartPerformance.scanSettings.sat"),
	];
	dates: any = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
	];
	hours: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	mins: any = [
		"00",
		"05",
		"10",
		"15",
		"20",
		"25",
		"30",
		"35",
		"40",
		"45",
		"50",
		"55",
	];
	amPm: any = ["AM", "PM"];
	isDaySelectionEnable = true;
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
	scanScheduleDate: any;
	IsScheduleScanEnabled: any;
	IsSmartPerformanceFirstRun: any;
	selectedFrequencyCopy: any;
	public scanData: any = {};
	scheduleScanFrequency: any;
	nextScheduleScanDate: any;
	public enumLocalScanFrequncy: any;
	firstScheduleTime: any;
	firstScheduleDay: any;
	requestScanData = {};
	type: string;

	ngOnInit() {
		this.isSubscribed = this.commonService.getLocalStorageValue(LocalStorageKey.IsFreeFullFeatureEnabled);
		// this.currentDate = new Date();
		this.selectedDate = this.calendar.getToday();
		// this.toDate = this.selectedDate;
		// this.fromDate = this.selectedDate;
		// this.selectedFrequency = this.scanFrequency[0];
		// this.selectedDay = this.days[0];
		// this.selectedNumber = this.dates[0];
		this.isDaySelectionEnable = false;
		this.scanScheduleDate = this.selectedDate;
		this.enumLocalScanFrequncy = enumScanFrequency;
		//this.scanSummaryTime(0);

		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(
			LocalStorageKey.SPScheduleScanFrequency
		);

		if (this.scheduleScanFrequency === undefined) {
			this.commonService.setLocalStorageValue(
				LocalStorageKey.SPScheduleScanFrequency,
				this.selectedFrequency
			);
		} else {
			this.selectedFrequency = this.scheduleScanFrequency;
			this.frequencyValue = this.scanFrequency.indexOf(
				this.selectedFrequency
			);
		}

		this.IsSmartPerformanceFirstRun = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSmartPerformanceFirstRun
		);
		if (this.IsSmartPerformanceFirstRun) {
			this.type = "firstRun";
			this.payloadData(this.type);
		}
		if (
			this.IsSmartPerformanceFirstRun === true &&
			this.isSubscribed == true
		) {
			this.unregisterScheduleScan(
				"Lenovo.Vantage.SmartPerformance.ScheduleScan"
			);
			this.scheduleScan(this.requestScanData);
			this.commonService.setLocalStorageValue(
				LocalStorageKey.IsSmartPerformanceFirstRun,
				false
			);
			this.commonService.setLocalStorageValue(
				LocalStorageKey.SPScheduleScanFrequency,
				this.selectedFrequency
			);
		}

		if (
			this.IsSmartPerformanceFirstRun === true &&
			this.isSubscribed == false
		) {
			this.scheduleScan(this.requestScanData);
			this.commonService.setLocalStorageValue(
				LocalStorageKey.IsSmartPerformanceFirstRun,
				false
			);
			this.commonService.setLocalStorageValue(
				LocalStorageKey.SPScheduleScanFrequency,
				this.selectedFrequency
			);
		}
		this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(
			LocalStorageKey.IsSPScheduleScanEnabled
		);

		if (this.IsScheduleScanEnabled) {
			this.scanToggleValue = true;
		} else {
			const scheduleScanEvent = { nextEnable: false };
			this.scanToggleValue = false;
			this.scanDatekValueChange.emit(scheduleScanEvent);
		}

		// fetching next schedule date and time from task scheduler
		if (this.scheduleScanFrequency !== undefined) {
			if (this.isSubscribed) {
				this.getNextScanRunTime(
					"Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix"
				);
			} else {
				this.getNextScanRunTime(
					"Lenovo.Vantage.SmartPerformance.ScheduleScan"
				);
			}
		}
	}
	// tslint:disable-next-line: use-lifecycle-interface

	expandRow(value) {
		if (this.toggleValue === value) {
			this.toggleValue = null;
		} else {
			this.toggleValue = value;
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
		this.frequencyValue = value;
		this.scheduleTab = "";
		this.isDaySelectionEnable = true;
		this.selectedDay = this.days[value];
		this.dayValue = value;
		this.selectedFrequency = this.scanFrequency[value];
		this.changeScanDay(value);
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
		this.scheduleScanFrequency = this.commonService.getLocalStorageValue(
			LocalStorageKey.SPScheduleScanFrequency
		);
		this.changeScanFrequency(
			this.scanFrequency.indexOf(this.scheduleScanFrequency)
		);
		if (this.isSubscribed) {
			this.getNextScanRunTime(
				"Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix"
			);
			// this.getNextScanScheduleTime(this.nextScheduleScanDate);
		} else {
			this.getNextScanRunTime(
				"Lenovo.Vantage.SmartPerformance.ScheduleScan"
			);
			// this.getNextScanScheduleTime(this.nextScheduleScanDate);
		}
	}

	saveChangeScanTime() {
		this.scheduleTab = "";
		this.scanTime.hour = this.copyScanTime.hour;
		this.scanTime.min = this.copyScanTime.min;
		this.scanTime.amPm = this.copyScanTime.amPm;
		this.scanTime.hourId = this.copyScanTime.hourId;
		this.scanTime.minId = this.copyScanTime.minId;
		this.scanTime.amPmId = this.copyScanTime.amPmId;
	}
	cancelChangeScanTime() {
		this.scheduleTab = "";
		this.copyScanTime.hour = this.scanTime.hour;
		this.copyScanTime.min = this.scanTime.min;
		this.copyScanTime.amPm = this.scanTime.amPm;
		this.copyScanTime.hourId = this.scanTime.hourId;
		this.copyScanTime.minId = this.scanTime.minId;
		this.copyScanTime.amPmId = this.scanTime.amPmId;
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

	setTypeOfFrequency() {
		if (this.selectedFrequency === "Once a week") {
			this.type = "weekly";
		}
		if (this.selectedFrequency === "Every other week") {
			this.type = "otherweek";
		}
		if (this.selectedFrequency === "Every month") {
			this.type = "monthly";
		}
	}

	saveChangedScanSchedule() {
		try {
			this.scheduleTab = "";
			this.isChangeSchedule = false;
			this.setTypeOfFrequency()

			if (!this.isSubscribed) {
				this.unregisterScheduleScan(
					"Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix"
				);
			}
			this.payloadData(this.type);
			this.scheduleScan(this.requestScanData);
			this.commonService.setLocalStorageValue(
				LocalStorageKey.SPScheduleScanFrequency,
				this.selectedFrequency
			);
		} catch (err) {
			this.logger.error(
				"ui-scan-schedule.component.saveChangedScanSchedule",
				err
			);
		}
	}

	async unregisterScheduleScan(scantype) {
		const payload = {
			scantype,
		};
		this.logger.info(
			"ui-smart-performance.unregisterScheduleScan",
			JSON.stringify(payload)
		);
		try {
			const res: any = await this.smartPerformanceService.unregisterScanSchedule(
				payload
			);
			this.logger.info(
				"ui-smart-performance.unregisterScheduleScan.then",
				JSON.stringify(res)
			);
		} catch (err) {
			this.logger.error(
				"ui-smart-performance.unregisterScheduleScan.then",
				err
			);
		}
	}
	//toggle button event schedule scan

	setEnableScanStatus(event: any) {
		const nextScanEvent = { nextEnable: event.switchValue };

		this.logger.info("setEnableScanStatus", event.switchValue);
		this.scanToggleValue = event.switchValue;

		if (!event.switchValue) {
			if (this.isSubscribed) {
				this.unregisterScheduleScan(
					"Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix"
				);
				this.sendNextScheduleDate(nextScanEvent);
			} else {
				this.unregisterScheduleScan(
					"Lenovo.Vantage.SmartPerformance.ScheduleScan"
				);
			}
			this.commonService.setLocalStorageValue(
				LocalStorageKey.IsSPScheduleScanEnabled,
				false
			);
			this.commonService.removeLocalStorageValue(
				LocalStorageKey.SPScheduleScanFrequency
			);
		} else {
			this.IsScheduleScanEnabled = this.commonService.getLocalStorageValue(
				LocalStorageKey.IsSPScheduleScanEnabled
			);
			if (!this.IsScheduleScanEnabled) {
				this.type = "firstRun";
				this.payloadData(this.type);
				this.scheduleScan(this.requestScanData);
				this.commonService.setLocalStorageValue(
					LocalStorageKey.IsSPScheduleScanEnabled,
					true
				);
				this.commonService.setLocalStorageValue(
					LocalStorageKey.SPScheduleScanFrequency,
					this.scanFrequency[0]
				);
			}
		}
	}

	async scheduleScan(payload) {
		try {
			const res: any = await this.smartPerformanceService.setScanSchedule(
				payload
			);
			if (res.state) {
				const savedTime = moment(payload.time).format("LT");
				let nextScanEvent = {};
				switch (payload.frequency) {
					case "onceaweek":
						this.selectedFrequency = this.scanFrequency[0];
						break;
					case "everyotherweek":
						this.selectedFrequency = this.scanFrequency[1];
						break;
					case "onceamonth":
						this.selectedFrequency = this.scanFrequency[2];
						break;
				}
				this.frequencyValue = this.scanFrequency.indexOf(
					this.selectedFrequency
				);
				if (payload.day !== "") {
					this.selectedDay = payload.day;
					this.dayValue = this.days.indexOf(this.selectedDay);
				}
				if (payload.date.length !== 0) {
					this.selectedDate = payload.date[0];
					this.dateValue = payload.date[0] - 1;
					this.selectedNumber = this.dates[this.dateValue];
				}
				this.scanTime.hour = savedTime.split(" ")[0].split(":")[0];
				this.scanTime.min = savedTime.split(" ")[0].split(":")[1];
				this.scanTime.amPm = savedTime.split(" ")[1];
				nextScanEvent = {
					nextEnable: true,
					nextScanDate: "",
					nextScanHour: this.scanTime.hour,
					nextScanMin: this.scanTime.min,
					nextScanAMPM: this.scanTime.amPm,
				};
				this.sendNextScheduleDate(nextScanEvent);
			}
		} catch (err) {
			this.logger.error("ui-smart-performance.scheduleScan.then", err);
		}
	}

	async getNextScanRunTime(scantype: string) {
		const payload = { scantype };
		let nextScanEvent = {};
		this.logger.info(
			"ui-smart-performance.getNextScanRunTime",
			JSON.stringify(payload)
		);
		try {
			const res: any = await this.smartPerformanceService.getNextScanRunTime(
				payload
			);
			// checking next scan run time fetched from api and when present passing th sendNextScheduleDate method.
			if (res.nextruntime) {
				const dt = moment(res.nextruntime).format("LLLL");
				if (
					this.selectedFrequency === this.scanFrequency[0] ||
					this.selectedFrequency === this.scanFrequency[1]
				) {
					this.selectedDay = dt.split(",")[0];
					this.dayValue = this.days.indexOf(this.selectedDay);
				}
				if (this.selectedFrequency === this.scanFrequency[2]) {
					this.selectedNumber = dt.split(",")[1].split(" ")[2];
					this.selectedDate = dt.split(",")[1].split(" ")[2];
					this.dateValue = this.dates.indexOf(this.selectedNumber);
				}
				this.scanTime.hour = dt.split(" ")[4].split(":")[0];
				this.scanTime.min = dt.split(" ")[4].split(":")[1];
				this.scanTime.amPm = dt.split(" ")[5];
				nextScanEvent = {
					nextEnable: true,
					nextScanDate: "",
					nextScanHour: this.scanTime.hour,
					nextScanMin: this.scanTime.min,
					nextScanAMPM: this.scanTime.amPm,
				};
				this.sendNextScheduleDate(nextScanEvent);
			} else {
				// if no res than setting default values
				this.selectedFrequency = this.scanFrequency[0];
				this.selectedDay = this.days[0];
				this.selectedNumber = this.dates[0];
			}
			this.logger.info(
				"ui-smart-performance.getNextScanRunTime.then",
				JSON.stringify(res)
			);
		} catch (err) {
			this.logger.error(
				"ui-smart-performance.getNextScanRunTime.then",
				err
			);
		}
	}

	getNextScanScheduleTime(scandate) {
		try {
			if (scandate !== undefined) {
				var dateObj = new Date(scandate);
				var momentObj = moment(dateObj);
				var momentString = momentObj.format("YYYY-MM-DD");
				const now = new Intl.DateTimeFormat("default", {
					hour12: true,
					hour: "numeric",
					minute: "numeric",
				}).format(dateObj);
				//| slice:0:3
				var weekDayName = moment(momentObj).format("dddd");
				this.selectedFrequency = this.scheduleScanFrequency;
				if (
					this.selectedFrequency ===
					this.enumLocalScanFrequncy.ONCEAMONTH
				) {
					this.selectedDay = moment(momentObj).format("D");
					this.dateValue =
						parseInt(moment(momentObj).format("D")) - 1;
					this.selectedNumber = parseInt(
						moment(momentObj).format("D")
					);
				} else {
					this.selectedDay = weekDayName;
					this.dayValue = this.days.indexOf(this.selectedDay);
				}
				this.scanTime.hour = moment(momentObj).format("h");
				this.scanTime.min = moment(momentObj).format("mm");
				this.scanTime.amPm = moment(momentObj).format("A");
				this.copyScanTime.hour = this.hours[
					parseInt(moment(momentObj).format("h")) - 1
				];
				this.copyScanTime.hourId =
					parseInt(moment(momentObj).format("h")) - 1;
				const minIndex = this.mins.indexOf(
					moment(momentObj).format("mm").toString()
				);
				this.copyScanTime.min = this.mins[minIndex];
				this.copyScanTime.minId = parseInt(minIndex);
				const amPmIndex = this.amPm.indexOf(
					moment(momentObj).format("A").toString()
				);
				this.copyScanTime.amPm = this.amPm[amPmIndex];
				this.copyScanTime.amPmId = parseInt(amPmIndex);
			}
		} catch (err) {
			this.logger.error(
				"ui-smart-performance-scan-summary.getNextScanScheduleTime.then",
				err
			);
		}
	}

	// emitting Next Scheduled Scan date and time
	sendNextScheduleDate(nextScheduleScanEvent) {
		if (!nextScheduleScanEvent["nextEnable"]) {
			this.scanDatekValueChange.emit(nextScheduleScanEvent);
			return;
		}
		switch (this.selectedFrequency) {
			case this.scanFrequency[0]:
				if (moment().day() <= this.dayValue) {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.day(this.dayValue)
						.format("L")
				} else {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.add(1, "weeks")
						.day(this.dayValue)
						.format("L")
				}
				break;
			case this.scanFrequency[1]:
				if (moment().day() <= this.dayValue) {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.day(this.dayValue)
						.format("L")
				} else {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.add(2, "weeks")
						.day(this.dayValue)
						.format("L")
				}
				break;
			case this.scanFrequency[2]:
				if (+this.selectedNumber < moment().date()) {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.date(+this.selectedNumber)
						.add(1, "month")
				} else {
					nextScheduleScanEvent["nextScanDate"] = moment()
						.date(+this.selectedNumber)
				}
				break;
		}
		this.scanDatekValueChange.emit(nextScheduleScanEvent);
	}

	// setting paload for scanSchedule method
	payloadData(typeRun: string) {
		let currentMom;
		switch (typeRun) {
			case "firstRun":
				const currentMoment = moment().format(
					"dddd, YYYY, MM, D, HH, mm, ss"
				);
				const roundOffMin = (
					Math.ceil(+currentMoment.split(",")[5] / 5) * 5
				).toString();
				const data = {
					frequency: "onceaweek",
					day: currentMoment.split(",")[0],
					time: moment([
						currentMoment.split(",")[1],
						currentMoment.split(",")[2],
						currentMoment.split(",")[3],
						currentMoment.split(",")[4],
						roundOffMin,
						currentMoment.split(",")[6],
					]).format(),
					date: [],
				};
				if (this.isSubscribed) {
					this.requestScanData = {
						scantype:
							"Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix",
						...data,
					};
				}
				if (!this.isSubscribed) {
					this.requestScanData = {
						scantype:
							"Lenovo.Vantage.SmartPerformance.ScheduleScan",
						...data,
					};
				}
				break;

			case "weekly":
				if (moment().day() <= this.dayValue) {
					currentMom = moment()
						.day(this.dayValue)
						.format("YYYY, MM, D, ss");
				} else {
					currentMom = moment()
						.day(this.dayValue)
						.add(1, "weeks")
						.format("YYYY, MM, D, ss");
				}
				this.commonLines(currentMom, this.selectedFrequency);
				break;

			case "otherweek":
				if (moment().day() <= this.dayValue) {
					currentMom = moment()
						.day(this.dayValue)
						.format("YYYY, MM, D, ss");
				} else {
					currentMom = moment()
						.day(this.dayValue)
						.add(2, "weeks")
						.format("YYYY, MM, D, ss");
				}
				this.commonLines(currentMom, this.selectedFrequency);
				break;

			case "monthly":
				if (+this.selectedNumber < moment().date()) {
					currentMom = moment()
						.date(+this.selectedNumber)
						.add(1, "month")
						.format("YYYY, MM, D, ss");
				} else {
					currentMom = moment()
						.date(+this.selectedNumber)
						.format("YYYY, MM, D, ss");
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
		const roundOffMin = (Math.ceil(+this.scanTime.min / 5) * 5).toString();
		const tme = this.scanTime.hour + " " + this.scanTime.amPm;
		const hours = moment(tme, ["h A"]).format("HH");
		const data = {
			frequency: freq.toLowerCase(),
			day: freq !== "onceamonth" ? this.selectedDay : "",
			time: moment([
				currentMoment.split(",")[0],
				currentMoment.split(",")[1],
				currentMoment.split(",")[2],
				hours,
				roundOffMin,
				currentMoment.split(",")[3],
			]).format(),
			date: freq === "onceamonth" ? [this.dateValue + 1] : [],
		};
		if (this.isSubscribed) {
			this.requestScanData = {
				scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScanAndFix",
				...data,
			};
		}
		if (!this.isSubscribed) {
			this.requestScanData = {
				scantype: "Lenovo.Vantage.SmartPerformance.ScheduleScan",
				...data,
			};
		}
	}
}

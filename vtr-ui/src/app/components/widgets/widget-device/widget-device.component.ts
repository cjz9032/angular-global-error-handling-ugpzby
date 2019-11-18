import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metric.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { map, mergeMap } from 'rxjs/operators';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { LanguageService } from 'src/app/services/language/language.service';
@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss'],
	providers: [TimerService]
})
export class WidgetDeviceComponent implements OnInit, OnDestroy {
	public myDevice: MyDevice;
	public deviceStatus: Status[] = [];
	public direction = 'ltr';

	// subtitle = 'My device status';

	virusImage = '//vtr-ui//src//assets//Device_antivirus.png';

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private systemUpdateService: SystemUpdateService,
		private translate: TranslateService,
		private timer: TimerService,
		private metrics: MetricService,
		private dashboardService: DashboardService,
		private adPolicyService: AdPolicyService,
		private languageService: LanguageService
	) {
		this.myDevice = new MyDevice();
		if (this.languageService.currentLanguage.toLowerCase() === 'ar') {
			this.direction = 'rtl';
		}
	}

	ngOnInit() {
		this.setDefaultInfo();
		this.timer.start();
		this.getDeviceInfo();
	}

	ngOnDestroy() {
		const pageDuration = this.timer.stop();
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: 'Page.MyDevice',
			PageContext: 'My device status',
			PageDuration: pageDuration
		};
		this.metrics.sendMetrics(pageViewMetrics);
	}

	private setDefaultInfo() {
		let index = 0;

		const systemStatus = this.deviceStatus;
		const processor = new Status();
		processor.id = 'processor';
		this.translate.stream('device.myDevice.processor.notFound').subscribe((value) => {
			processor.title = value;
		});
		processor.path = 'ms-settings:about';
		processor.asLink = false;
		processor.isSystemLink = true;
		systemStatus[index++] = processor;

		const memory = new Status();
		memory.id = 'memory';
		this.translate.stream('device.myDevice.memory.notFound').subscribe((value) => {
			memory.title = value;
		});
		memory.path = 'ms-settings:about';
		memory.asLink = false;
		memory.isSystemLink = true;
		systemStatus[index++] = memory;

		const disk = new Status();
		disk.id = 'disk';
		this.translate.stream('device.myDevice.diskspace.notFound').subscribe((value) => {
			disk.title = value;
		});
		disk.path = 'ms-settings:storagesense';
		disk.asLink = false;
		disk.isSystemLink = true;
		systemStatus[index++] = disk;

		this.translate.stream('device.myDevice.learnMore').subscribe((value) => {
			processor.detail = value;
			memory.detail = value;
			disk.detail = value;
		});

		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			const systemUpdate = new Status();
			systemUpdate.id = 'systemupdate';
			this.translate.stream('device.myDevice.systemUpdate.notFound').subscribe((value) => {
				systemUpdate.title = value;
			});
			this.translate.stream('device.myDevice.systemUpdate.title').subscribe((value) => {
				systemUpdate.detail = value;
			});
			systemUpdate.path = 'device/system-updates';
			systemUpdate.asLink = true;
			systemUpdate.isSystemLink = false;
			systemStatus[index++] = systemUpdate;
		}

		const warranty = new Status();
		warranty.id = 'warranty';
		this.translate.stream('device.myDevice.warranty.notFound').subscribe((value) => {
			warranty.title = value;
		});
		this.translate.stream('device.myDevice.warranty.detail.title').subscribe((value) => {
			warranty.detail = value;
		});
		warranty.path = '/support';
		warranty.asLink = true;
		warranty.isSystemLink = false;
		systemStatus[index] = warranty;
	}

	private getDeviceInfo() {
		// machineinfo
		this.deviceService.getMachineInfo().then((data) => {
			this.myDevice.family = data.family;
			this.myDevice.sn = data.serialnumber;
			this.myDevice.bios = data.biosVersion;
			this.myDevice.subBrand = data.subBrand;
			this.myDevice.productNo = data.mtm;
		});

		// processor memory disk
		this.deviceService.getHardwareInfo().then(data => {
			if (data) {
				const processor = this.deviceStatus[0];
				processor.status = 0;
				this.translate.stream('device.myDevice.processor.title').subscribe((value) => {
					processor.title = value;
				});
				processor.systemDetails = `${data.processor.name}`;

				const memory = this.deviceStatus[1];
				const { total, used } = data.memory;
				let type = data.memory.type;
				this.translate.stream('device.myDevice.memory.title').subscribe((value) => {
					memory.title = value;
				});

				if (type.toLowerCase() === 'unknown') {
					type = '';
				}

				this.translate.stream('device.myDevice.of').pipe(map(val => {
					return `${this.commonService.formatBytes(total)} ${val} ${type}`;
				}), mergeMap(val => {
					return this.translate.stream('device.myDevice.memory.ram').pipe(map(ram => {
						return `${val} ${ram}`;
					}));
				})).subscribe((value) => {
					memory.systemDetails = value;
				});

				const percent = parseInt(((used / total) * 100).toFixed(0), 10);
				if (percent > 70) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}

				const disk = this.deviceStatus[2];
				const totalDisk = data.disk.total;
				const usedDisk = data.disk.used;
				this.translate.stream('device.myDevice.diskspace.title').subscribe((value) => {
					disk.title = value;
				});

				this.translate.stream('device.myDevice.of').subscribe((value) => {
					disk.systemDetails = `${this.commonService.formatBytes(usedDisk)} ${value} ${this.commonService.formatBytes(totalDisk)}`;
				});

				const percentDisk = parseInt(((usedDisk / totalDisk) * 100).toFixed(0), 10);
				if (percentDisk > 90) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}

			}
		});

		// sysupdate
		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			this.dashboardService.getRecentUpdateInfo().subscribe(data => {
				if (data) {
					const systemUpdate = this.deviceStatus[3];

					const updateStatus = data.status;
					const lastUpdate = data.lastupdate;
					const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);

					if (updateStatus === 1) {
						this.translate.stream('device.myDevice.systemUpdate.detail.uptoDate').subscribe((value) => {
							systemUpdate.title = value;
						});
						// `Software up to date `;
						this.translate.stream('device.myDevice.systemUpdate.detail.updatedOn').subscribe((value) => {
							systemUpdate.systemDetails = `${value} ${this.commonService.formatLocalDate(lastUpdate)}`;
						});

						if (diffInDays > 30) {
							this.translate.stream('device.myDevice.systemUpdate.detail.outdated').subscribe((value) => {
								systemUpdate.title = value;
							});
							// `Software outdated `;
							systemUpdate.status = 1;
						} else {
							systemUpdate.status = 0;
						}
					} else {
						this.translate.stream('device.myDevice.systemUpdate.detail.outdated').subscribe((value) => {
							systemUpdate.title = value;
						});

						this.translate.stream('device.myDevice.systemUpdate.detail.neverRanUpdate').subscribe((value) => {
							systemUpdate.systemDetails = value;
						});
						// `never ran update`;
						systemUpdate.status = 1;
					}
				}
			});
		}

		// warranty
		this.dashboardService.getWarrantyInfo().subscribe(data => {
			if (data) {
				let warranty;
				if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
					warranty = this.deviceStatus[4];
				} else {
					warranty = this.deviceStatus[3];
				}
				const warrantyDate = this.commonService.formatDate(data.endDate);
				// in warranty
				if (data.status === 0) {
					const today = new Date();
					const endDate = new Date(data.endDate);
					const warrantyInDays = this.commonService.getDaysBetweenDates(today, endDate);

					this.translate.stream('device.myDevice.warranty.detail.inWarranty').subscribe((value) => {
						warranty.title = value;
					});
					this.translate.stream('device.myDevice.warranty.detail.daysRemaining').subscribe((value) => {
						warranty.systemDetails = `${warrantyInDays} ${value}`;
					});

					// days remaining`;
					warranty.status = 0;
				} else if (data.status === 1) {
					this.translate.stream('device.myDevice.warranty.detail.outOfWarranty').subscribe((value) => {
						warranty.title = value;
					});
					this.translate.stream('device.myDevice.warranty.detail.expiredOn').subscribe((value) => {
						warranty.detail = `${value} ${warrantyDate}`;
					});
					// `Expired on ${warrantyDate}`;
					warranty.status = 1;
				} else {
					this.translate.stream('device.myDevice.warranty.detail.notAvailable').subscribe((value) => {
						warranty.title = value;
					});
					this.translate.stream('device.myDevice.warranty.detail.support').subscribe((value) => {
						warranty.detail = value;
					});
					warranty.status = 1;
				}
				warranty.isHidden = !this.deviceService.showWarranty;
			}
		});
	}
}

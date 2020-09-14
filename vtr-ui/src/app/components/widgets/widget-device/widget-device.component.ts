import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { DeviceStatus, DeviceCondition } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from 'src/app/services/timer/timer.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
@Component({
	selector: 'vtr-widget-device',
	templateUrl: './widget-device.component.html',
	styleUrls: ['./widget-device.component.scss'],
	providers: [TimerService]
})
export class WidgetDeviceComponent implements OnInit, OnDestroy {
	public myDevice: MyDevice;
	public hwStatus: DeviceStatus[] = [];
	public swStatus: DeviceStatus[] = [];
	public deviceStatus: DeviceCondition = DeviceCondition.Loading;

	processorIcon = 'assets/icons/hardware-scan/icon_hardware_processor.svg';
	memoryIcon = '/assets/icons/hardware-scan/icon_hardware_memory.svg';
	storageIcon = '/assets/icons/hardware-scan/icon_hardware_hdd.svg';
	systemUpdateIcon = 'assets/icons/Icon_Optional_Update.svg';
	smartPerformanceIcon = 'assets/icons/Icon-smartperformance.svg';
	warrantyIcon = 'assets/icons/Icon-warranty.svg';

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private formatLocaleDate: FormatLocaleDatePipe,
		private systemUpdateService: SystemUpdateService,
		private translate: TranslateService,
		private dashboardService: DashboardService,
		private warrantyService: WarrantyService,
		private adPolicyService: AdPolicyService,
	) {
		this.myDevice = new MyDevice();
	}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((machineInfo) => {
			this.setDefaultInfo();
			this.myDevice.family = machineInfo.family;
			this.myDevice.sn = machineInfo.serialnumber;
			this.myDevice.bios = machineInfo.biosVersion;
			this.myDevice.subBrand = machineInfo.subBrand;
			this.myDevice.productNo = machineInfo.mtm;
			this.getDeviceInfo();
		});
	}

	ngOnDestroy() {
	}

	private setDefaultInfo() {
		let index = 0;

		const processor = new DeviceStatus();
		this.translate.stream('device.myDevice.processor.title').subscribe((value) => {
			processor.title = value;
			processor.showCover = true;
			processor.icon = this.processorIcon;
			this.hwStatus[index++] = processor;
		});

		const memory = new DeviceStatus();
		this.translate.stream('device.myDevice.memory.title').subscribe((value) => {
			memory.title = value;
			memory.showCover = false;
			memory.icon = this.memoryIcon;
			this.hwStatus[index++] = memory;
		});

		const disk = new DeviceStatus();
		this.translate.stream('device.myDevice.diskspace.title').subscribe((value) => {
			disk.title = 'Storage';
			disk.icon = this.storageIcon;
			disk.showCover = false;
			this.hwStatus[index++] = disk;
		});
	}

	public refreshClicked(){
		this.getDeviceInfo();
	}

	public async copyClicked(info){
		const listener = (e: ClipboardEvent) => {
			const clipboard = e.clipboardData;
			clipboard.setData('text', info);
			e.preventDefault();
		};

		document.addEventListener('copy', listener, false);
		document.execCommand('copy');
		document.removeEventListener('copy', listener, false);
	}

	private getDeviceInfo() {
		this.getHWStatus();
		this.getSUStatus();
		this.getSmartPerformanceStatus();
		this.getWarrantyStatus();

		// todo: decide condtion
		this.deviceStatus = DeviceCondition.NeedRunHWScan;
	}

	private getHWStatus(){
		this.deviceService.getHardwareInfo().then(data => {
			if (data) {
				// processor
				const processor = new DeviceStatus();
				this.translate.stream('device.myDevice.processor.title').subscribe((value) => {
					processor.title = value;
				});
				processor.link = 'ms-settings:about';
				processor.icon = this.processorIcon;
				processor.subtitle = `${data.processor.name}`;
				this.hwStatus[0] = processor;
				// memory
				const memory = new DeviceStatus();
				const { total, used } = data.memory;
				let type = data.memory.type;
				this.translate.stream('device.myDevice.memory.title').subscribe((value) => {
					memory.title = value;
				});
				if (type.toLowerCase() === 'unknown') {
					type = '';
				}
				memory.link = 'ms-settings:about';
				memory.subtitle = `Physical Memory ${type}`;
				memory.icon = this.memoryIcon;
				memory.used = this.commonService.formatBytes(used);
				memory.total = this.commonService.formatBytes(total);
				memory.percent = used / total * 100;
				this.hwStatus[1] = memory;
				// disk
				const disks = data.disk.disks;
				this.translate.stream('device.myDevice.diskspace.title').subscribe((value) => {
					let statusIndex = 2;
					for (let i = 0, len  = disks.length; i < len; i++) {
						const disk = new DeviceStatus();
						disk.title = 'Storage';
						disk.icon = this.storageIcon;
						disk.link = 'ms-settings:storagesense';
						disk.subtitle = `${disks[i].manufacturer || ''} ${disks[i].model}`;
						disk.used = this.commonService.formatBytes( disks[i].avaliableSize);
						disk.total = this.commonService.formatBytes( disks[i].sizeInBytes);
						disk.percent = used / total * 100;
						this.hwStatus[statusIndex++] = disk;
					}
				});
			}
		});
	}

	private getSUStatus(){
		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			this.dashboardService.getRecentUpdateInfo().subscribe(data => {
				if (data) {
					const systemUpdate = new DeviceStatus();
					const updateStatus = data.status;
					const lastUpdate = data.lastupdate;
					const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);
					systemUpdate.title = 'System Update';
					systemUpdate.link = 'device/system-updates';
					systemUpdate.icon = this.systemUpdateIcon;
					if (updateStatus === 1) {
						this.translate.stream('device.myDevice.systemUpdate.detail.uptoDate').subscribe((value) => {
							systemUpdate.subtitle = value;
						});
						systemUpdate.checkedDate = this.commonService.formatLocalDate(lastUpdate);

						if (diffInDays > 30) {
							this.translate.stream('device.myDevice.systemUpdate.detail.outdated').subscribe((value) => {
								systemUpdate.subtitle = value;
							});
						}
					} else {
						this.translate.stream('device.myDevice.systemUpdate.detail.neverRanUpdate').subscribe((value) => {
							systemUpdate.subtitle = value;
						});
					}
					this.swStatus[0] = systemUpdate;
				}
			});
		}
	}

	private getSmartPerformanceStatus(){
		const smartPerform = new DeviceStatus();
		smartPerform.title = 'Smart Performance';
		smartPerform.subtitle = 'Updates checked';
		smartPerform.checkedDate = '7/12/2020';
		smartPerform.icon = this.smartPerformanceIcon;
		smartPerform.link = 'smart';
		this.swStatus[1] = smartPerform;
	}

	private getWarrantyStatus(){
		this.warrantyService.getWarrantyInfo().subscribe(data => {
			if (data) {
				if (!(this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled)
					|| !this.deviceService.showWarranty) {
					return;
				}
				const warranty = new DeviceStatus();
				warranty.link =  '/support';
				warranty.icon = this.warrantyIcon;
				const warrantyDate = this.formatLocaleDate.transform(data.endDate);
				// in warranty
				if (data.status === 0) {
					const today = new Date();
					const endDate = new Date(data.endDate);
					const warrantyInDays = this.commonService.getDaysBetweenDates(today, endDate);
					this.translate.stream('device.myDevice.warranty.detail.inWarranty').subscribe((value) => {
						warranty.title = value;
					});
					this.translate.stream('device.myDevice.warranty.detail.daysRemaining').subscribe((value) => {
						warranty.subtitle = `${warrantyInDays} ${value}`;
					});
				} else if (data.status === 1) {
					this.translate.stream('device.myDevice.warranty.detail.outOfWarranty').subscribe((value) => {
						warranty.title = value;
					});
					this.translate.stream('device.myDevice.warranty.detail.expiredOn').subscribe((value) => {
						warranty.subtitle = `${value} ${warrantyDate}`;
					});
				} else {
					this.translate.stream('device.myDevice.warranty.detail.notAvailable').subscribe((value) => {
						warranty.title = value;
					});
				}
				this.swStatus[2] = warranty;
			}
		});
	}
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { MyDevice } from 'src/app/data-models/device/my-device.model';
import { DeviceStatus, DeviceCondition } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from 'src/app/services/timer/timer.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { Observable, Subject } from 'rxjs';
import { PreviousResultService } from 'src/app/modules/hardware-scan/services/previous-result.service';
import { SmartPerformanceService } from 'src/app/services/smart-performance/smart-performance.service';
import { ConfigService } from 'src/app/services/config/config.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { FeatureClick } from 'src/app/services/metric/metrics.model';
import { SystemHealthDates } from 'src/app/enums/system-state.enum';

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
	hwscanIcon = 'assets/icons/hardware-scan/icon_hardware_motherboard.svg';
	isSMPSubscripted: Promise<boolean>;
	hwInfo: Promise<any>;
	ngUnsubscribe: Subject<any> = new Subject();
	sysinfo: any;

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private systemUpdateService: SystemUpdateService,
		private translate: TranslateService,
		private dashboardService: DashboardService,
		private adPolicyService: AdPolicyService,
		private previousResultService: PreviousResultService,
		private smartPerformanceService: SmartPerformanceService,
		private configService: ConfigService,
		private hwScanService: HardwareScanService,
		private router: Router,
		private shellService: VantageShellService,
		private metric: MetricService
	) {
		this.myDevice = new MyDevice();
		this.sysinfo =  this.shellService.getSysinfo();
	}

	ngOnInit() {
		this.deviceService.getMachineInfo().then((machineInfo) => {
			this.hwInfo = this.deviceService.getHardwareInfo();
			this.loadDeviceInfo();
			this.myDevice.family = machineInfo?.family;
			this.myDevice.sn = machineInfo?.serialnumber;
			this.myDevice.bios = machineInfo?.biosVersion;
			this.myDevice.subBrand = machineInfo?.subBrand;
			this.myDevice.productNo = machineInfo?.mtm;
			this.startMonitorPerformance();
		});
	}

	ngOnDestroy() {
		this.sysinfo?.stopMonitorPerformance();
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	trackByFn(index, item) {
		return index;
	}

	public refreshClicked(){
		this.hwInfo = this.deviceService.getHardwareInfo();
		this.updateMemoryInfo(this.hwStatus[1]);
		this.updateDiskInfo();
	}

	public async copyClicked(info){
		const listener = (e: ClipboardEvent) => {
			const clipboard = e.clipboardData;
			clipboard.setData('text', info);
			e.preventDefault();
		};
		const copyCmd = 'copy';
		document.addEventListener(copyCmd, listener, false);
		document.execCommand(copyCmd);
		document.removeEventListener(copyCmd, listener, false);
	}

	public onMaintanceClicked(){
		if (this.deviceStatus !== DeviceCondition.Loading && this.deviceStatus !== DeviceCondition.Good){
			const metricData = new FeatureClick(`Device-Overall-Status-${this.deviceStatus}`, 'Device.MyDevice');
			this.metric.sendMetrics(metricData);
		}

		switch (this.deviceStatus){
			case DeviceCondition.NeedRunHWScan:
				this.deviceService.launchUri('lenovo-vantage3:hardware-scan?scan=quickscan&module=cpu');
				break;
			case DeviceCondition.NeedRunSMPScan:
				this.router.navigate(['support/smart-performance']);
				break;
			case DeviceCondition.NeedRunSU:
				this.router.navigate(['/device/system-updates'], { queryParams: { action: 'start' } });
				break;
		}
	}

	private async loadDeviceInfo() {
		this.loadOverAllStatus();
		const processor = new DeviceStatus();
		this.getNLSString('device.myDevice.processor.title').subscribe((value) => {
			processor.id = 'processor';
			processor.title = value;
			processor.icon = this.processorIcon;
			this.hwStatus[0] = processor;
			this.updateProssorInfo(processor);
		});
		const memory = new DeviceStatus();
		this.getNLSString('device.myDevice.memory.title').subscribe((value) => {
			memory.id = 'memory';
			memory.title = value;
			memory.icon = this.memoryIcon;
			this.hwStatus[1] = memory;
			this.updateMemoryInfo(memory);
		});
		const disk = new DeviceStatus();
		this.getNLSString('device.myDevice.storage').subscribe((value) => {
			disk.id = 'disk';
			disk.title = value;
			disk.icon = this.storageIcon;
			this.hwStatus[2] = disk;
			this.updateDiskInfo();
		});
		let index = 0;
		if (this.configService.isSystemUpdateEnabled()){
			const systemUpdate = new DeviceStatus();
			systemUpdate.id = 'systemUpdate';
			this.getNLSString('device.myDevice.systemUpdate.title').subscribe((value) => {
				systemUpdate.title = value;
			});
			systemUpdate.icon = this.systemUpdateIcon;
			this.swStatus[index++] = systemUpdate;
			this.updateSUStatus(systemUpdate);
		}
		if (await this.configService.showSmartPerformance()){
			const smartPerformance = new DeviceStatus();
			smartPerformance.id = 'smartperformance';
			this.getNLSString('smartPerformance.title').subscribe((value) => {
				smartPerformance.title = value;
			});
			smartPerformance.icon = this.smartPerformanceIcon;
			this.swStatus[index++] = smartPerformance;
			this.updateSmartPerformanceStatus(smartPerformance);
		}

		if (await this.hwScanService.isAvailable()){
			const hwscan = new DeviceStatus();
			hwscan.id = 'hwscan';
			this.getNLSString('hardwareScan.name').subscribe((value) => {
				hwscan.title = value;
			});
			hwscan.icon = this.hwscanIcon;
			this.swStatus[index++] = hwscan;
			this.updateHwScanStatus(hwscan);
		}
	}
	async loadOverAllStatus() {
		this.deviceStatus = await this.dashboardService.getDeviceStatus();
	}

	startMonitorPerformance(){
		this.sysinfo?.startMonitorPerformance((data) => {
			const processor = this.hwStatus[0];
			processor.percent = data?.cpuLoad;
			processor.used =  data?.cpuLoad?.toFixed(2) + '%';
			processor.total = data?.cpuGhz?.toFixed(2) + ' GHz';
			this.hwStatus[0] =  {...processor};
			const ram = this.hwStatus[1];
			const used = data?.memoryUsage?.totalSizeInBytes - data?.memoryUsage?.avaliableSize;
			ram.percent = used / data?.memoryUsage?.totalSizeInBytes * 100;
			ram.used = this.commonService.formatBytes(used);
			ram.total = this.commonService.formatBytes(data?.memoryUsage?.totalSizeInBytes);
			this.hwStatus[1] = {...ram};
		}, 1500);
	}

	private async updateProssorInfo(processor: DeviceStatus){
		const data = await this.hwInfo;
		if (data){
			processor.link = 'ms-settings:about';
			processor.icon = this.processorIcon;
			processor.subtitle = `${data.processor.name}`;
			processor.percent = 0;
			processor.used =  '--';
			processor.total = '-- ';
			this.hwStatus[0] = processor;
		}
	}

	private async updateMemoryInfo(memory: DeviceStatus){
		const data = await this.hwInfo;
		if (data){
			const { total, used } = data.memory;
			let type = data.memory.type;
			if (type.toLowerCase() === 'unknown') {
				type = '';
			}
			memory.link = 'ms-settings:about';
			this.getNLSString('device.myDevice.physicalMemory').subscribe((value) => {
				memory.subtitle = `${value} ${type}`;
			});
			memory.icon = this.memoryIcon;
			memory.used = this.commonService.formatBytes(used);
			memory.total = this.commonService.formatBytes(total);
			memory.percent = used / total * 100;
			this.hwStatus[1] = {...memory};
		}
	}

	private async updateDiskInfo(){
		const data = await this.hwInfo;
		if (data){
			const disks = data.disk.disks;
			this.getNLSString('device.myDevice.storage').subscribe((value) => {
				let statusIndex = 2;
				for (let i = 0, len  = disks.length; i < len; i++) {
					if (!disks[i].partitions || disks[i].partitions.length === 0){
						continue;
					}
					const disk = new DeviceStatus();
					disk.id = 'disk' + i;
					disk.title = value;
					disk.icon = this.storageIcon;
					disk.link = 'ms-settings:storagesense';
					disk.subtitle = `${disks[i].manufacturer || ''} ${disks[i].model}`;
					const usedBytes = disks[i].sizeInBytes - disks[i].avaliableSize;
					disk.used = this.commonService.formatBytes(usedBytes);
					disk.total = this.commonService.formatBytes( disks[i].sizeInBytes);
					disk.percent = usedBytes / disks[i].sizeInBytes * 100;
					this.hwStatus[statusIndex++] = disk;
				}
			});
		}
	}

	private async updateSUStatus(systemUpdate: DeviceStatus){
		if (this.deviceService && !this.deviceService.isSMode && this.adPolicyService && this.adPolicyService.IsSystemUpdateEnabled) {
			this.dashboardService.getRecentUpdateInfo().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
					if (data) {
						const updateStatus = data.status;
						const lastUpdate = data.lastupdate;
						const diffInDays = this.systemUpdateService.dateDiffInDays(lastUpdate);
						systemUpdate.link = 'device/system-updates';
						if (updateStatus === 1) {
							this.getNLSString('device.myDevice.systemUpdate.detail.uptoDate').subscribe((value) => {
								systemUpdate.subtitle = value;
							});
							systemUpdate.checkedDate = this.commonService.formatLocalDate(lastUpdate);
							systemUpdate.showSepline = true;
							if (diffInDays > 30) {
								this.getNLSString('device.myDevice.systemUpdate.detail.outdated').subscribe((value) => {
									systemUpdate.subtitle = value;
								});
							}
						} else {
							this.getNLSString('device.myDevice.systemUpdate.detail.neverRanUpdate').subscribe((value) => {
								systemUpdate.subtitle = value;
							});
						}
					}
				});
		}
	}

	private async updateSmartPerformanceStatus(smartPerform: DeviceStatus){
		try{
			if (await this.dashboardService.isSmartPerformanceSuscripted()){
				this.getNLSString('device.myDevice.entitled').subscribe((value) => {
					smartPerform.subtitle = value;
				});
			}
			else{
				this.getNLSString('device.myDevice.subscribeNow').subscribe((value) => {
					smartPerform.subtitle = value;
				});
			}

			const lastScanResultRequest = {
				scanType: await this.isSMPSubscripted ? 'ScanAndFix' : 'Scan'
			};
			const response = await this.smartPerformanceService.getLastScanResult(lastScanResultRequest);
			if (response?.scanruntime){
				smartPerform.checkedDate = moment(response.scanruntime).format('l');
				smartPerform.showSepline = true;
			}
		}catch {
			this.getNLSString('hardwareScan.notScanned').subscribe((value) => {
				smartPerform.subtitle = value;
			});
		}
		smartPerform.link = 'support/smart-performance';
	}

	private async updateHwScanStatus(hwscan: DeviceStatus){
		await this.previousResultService.getLastResults();
		const lastSacnInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
		const oobeDate = this.deviceService.getMachineInfoSync()?.firstRunDate || Date.now();
		const scanLangKey = 'device.myDevice.scanNow';
		const scanedLangKey = 'device.myDevice.scanned';
		const notScannedKey = 'hardwareScan.notScanned';
		if (lastSacnInfo.date){
			hwscan.checkedDate = moment(lastSacnInfo.date).format('l');
			hwscan.showSepline = true;
			if (this.systemUpdateService.dateDiffInDays(lastSacnInfo.date) > SystemHealthDates.HardwareScan){
				this.getNLSString(scanLangKey).subscribe((value) => {
					hwscan.subtitle = value;
				});
			}
			else{
				this.getNLSString(scanedLangKey).subscribe((value) => {
					hwscan.subtitle = value;
				});
			}
		}
		else if (this.systemUpdateService.dateDiffInDays(oobeDate) > SystemHealthDates.HardwareScan){
			this.getNLSString(scanLangKey).subscribe((value) => {
				hwscan.subtitle = value;
			});
		}
		else{
			this.getNLSString(notScannedKey).subscribe((value) => {
				hwscan.subtitle = value;
			});
		}
		hwscan.link = '/hardware-scan';
	}

	private getNLSString(key: string): Observable<string> {
		return this.translate.stream(key).pipe(takeUntil(this.ngUnsubscribe));
	}

}

import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalSnapshotComponent } from '../../modal/modal-snapshot/modal-snapshot.component';
import { SnapshotService } from '../../../services/snapshot.service';
import { ProcessorDevice } from '../../../models/ProcessorDevice';
import { constant } from 'lodash';

@Component({
  selector: 'vtr-widget-snapshot',
  templateUrl: './widget-snapshot.component.html',
  styleUrls: ['./widget-snapshot.component.scss']
})
export class WidgetSnapshotComponent implements OnInit {
	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() tooltipText: string;

	public snapshots: Array<any> = [];

	constructor(
		private translate: TranslateService,
		private modalService: NgbModal,
		private snapshotService: SnapshotService) { }

	ngOnInit(): void {
	}

	private openSnapshotModal() {
		const modal: NgbModalRef = this.modalService.open(ModalSnapshotComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true
		});

		( modal.componentInstance as ModalSnapshotComponent).snapshotInfo = this.snapshots;

		return modal;
	}

	public getSnapshotInfo() {
		if (this.snapshotService) {
			this.snapshotService.getLoadInstalledProgramsInfo().then((response) => {
				this.snapshots.push({
					id: 1,
					title: 'LoadInstalledProgramsInfoCommand',
					info: response.installedProgramsList,
					collapsed: false
				});
			});


			this.snapshotService.getLoadProcessorsInfo().then((response) => {
				const devicesList: Array<ProcessorDevice> = response.processorDevicesList;
				let deviceInfo;

				deviceInfo = {
					id: 2,
					title: 'LoadProcessorInfoCommand',
					collapsed: false,
					info: [{
					}]
				};

				devicesList.forEach(item => {
					deviceInfo.info.push({
						name: item.name
					});
				});

				deviceInfo.info.splice(0, 1);

				this.snapshots.push(deviceInfo);
			});

			this.snapshotService.getLoadMemoryInfo().then((response) => {
				this.snapshots.push({
					id: 3,
					title: 'LoadMemoryInfoCommand',
					info: response.memoryDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadVideoCardsInfo().then((response) => {
				this.snapshots.push({
					id: 4,
					title: 'LoadVideoCardsInfoCommand',
					info: response.videoCardDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadMotherboardInfo().then((response) => {
				this.snapshots.push({
					id: 5,
					title: 'LoadMotherboardInfoCommand',
					info: response,
					collapsed: false
				});
			});

			this.snapshotService.getLoadSoundCardsInfo().then((response) => {
				this.snapshots.push({
					id: 6,
					title: 'LoadSoundCardsInfoCommand',
					info: response.soundCardDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadStartupProgramsInfo().then((response) => {
				this.snapshots.push({
					id: 7,
					title: 'LoadStartupProgramsInfoCommand',
					info: response.startupProgramsList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadDisplayDevicesInfo().then((response) => {
				this.snapshots.push({
					id: 8,
					title: 'LoadDisplayDevicesInfoCommand',
					info: response.displayDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadKeyboardsInfo().then((response) => {
				this.snapshots.push({
					id: 9,
					title: 'LoadKeyboardDevicesInfoCommand',
					info: response.keyboardDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadPrintersInfo().then((response) => {
				this.snapshots.push({
					id: 10,
					title: 'LoadPrinterDevicesInfoCommand',
					info: response.printerDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadMouseDevicesInfo().then((response) => {
				this.snapshots.push({
					id: 11,
					title: 'LoadMouseDevicesInfoCommand',
					info: response.mouseDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadWebBrowsersInfo().then((response) => {
				this.snapshots.push({
					id: 12,
					title: 'LoadWebBrowsersInfoCommand',
					info: response.webBrowsersList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadCdRomDrivesInfo().then((response) => {
				this.snapshots.push({
					id: 13,
					title: 'LoadCdRomDrivesInfoCommand',
					info: response.cdRomDriveDevicesList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadOperatingSystemsInfo().then((response) => {
				this.snapshots.push({
					id: 14,
					title: 'LoadOperatingSystemsInfoCommand',
					info: response.operatingSystemsList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadStorageDevicesInfo().then((response) => {
				this.snapshots.push({
					id: 15,
					title: 'LoadStorageDevicesInfoCommand',
					info: response.storageDeviceList,
					collapsed: false
				});
			});

			this.snapshotService.getLoadNetworkDevicesInfo().then((response) => {
				this.snapshots.push({
					id: 16,
					title: 'LoadNetworkDevicesInfoCommand',
					info: response.networkDeviceList,
					collapsed: false
				});
			});

			this.openSnapshotModal();
		}
	}

	public onSnapshotInfo() {
		this.snapshots = [];
		this.getSnapshotInfo();
	}
}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { disableBackgroundNavigation, reEnableBackgroundNavigation } from '../../../services/hardware-scan/utils/ModalBackgroundNavigationUtils';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HardwareScanProgress } from 'src/app/enums/hw-scan-progress.enum';
import { Router } from '@angular/router';
import { RecoverBadSectorsService } from 'src/app/services/hardware-scan/recover-bad-sectors.service';

@Component({
	selector: 'vtr-modal-scan-failure',
	templateUrl: './modal-scan-failure.component.html',
	styleUrls: ['./modal-scan-failure.component.scss']
})
export class ModalScanFailureComponent implements OnInit, OnDestroy {

	@Input() supportUrl: string;
	@Input() hasFailedRbsDevice: boolean;

	failedModules: any;
	rbsDevices: any;
	private failedRbsDevices: Array<string>;
	public testResultEnum = HardwareScanTestResult;

	constructor(
		public activeModal: NgbActiveModal,
		private hardwareScanService: HardwareScanService,
		private commonService: CommonService,
		private router: Router,
		private rbsService: RecoverBadSectorsService) {
		this.failedRbsDevices = [];
	}

	ngOnInit(){
		disableBackgroundNavigation(document);
	}

	ngOnDestroy(){
		reEnableBackgroundNavigation(document);
	}

	// closes modal
	closeModal() {
		this.activeModal.close('close');
	}

	// Opens Lenovo's support page and closes the modal
	openSupportPage() {
		window.open(this.supportUrl);
		this.closeModal();
	}

	// Sets the lists of failed modules and RBS devices, and then creates the list of RBS devices that failed
	configureDevicesLists(failedModules, rbsDevices) {
		this.failedModules = failedModules;
		this.rbsDevices = rbsDevices;
		this.failedRbsDevices = this.createListFailedRbsDevices();
		this.hasFailedRbsDevice = this.failedRbsDevices.length > 0;
	}

	// Checks the any storage device from failedModules has support for RBS (according to rbsDevices list)
	private createListFailedRbsDevices() {
		// First, getting a list of Ids of storage devices
		const hasFailedStorage = this.failedModules.find(m => m.moduleId === 'storage');

		// Second, Return empty if no storage has failed
		if (hasFailedStorage === undefined) {
			return [];
		}

		// Third, if it has failed storage, get a list of Ids of storage devices with failure
		const failedStorageIds = hasFailedStorage.devices.reduce(
				(result, device) => {
					result.push(device.deviceId);
					return result;
				}, []);

		// Fourth, getting a list of Ids of storage devices that support RBS
		const rbsDeviceIds = this.rbsDevices.groupList.reduce(
			(result, device) => {
				result.push(device.id);
				return result;
			}, []);

		// Finally, getting the list of Ids contained in both lists
		// If any value is returned, it means that a storage device that supports RBS failed, meaning that
		// a RBS test will be suggested to the user
		return failedStorageIds.filter(storageId => rbsDeviceIds.includes(storageId));
	}

	// Goes to RBS page, passing defective device list to be selected when RBS page loads
	openRbsModal() {
		// Using absolute URL, since the user could be outside HWScan when this popup is shown.
		this.router.navigate(['/hardware-scan']);
		this.closeModal();
		this.rbsService.openRecoverBadSectorsModal(this.failedRbsDevices);
		this.hardwareScanService.clearLastResponse();
		this.commonService.sendNotification(HardwareScanProgress.BackEvent);
	}
}

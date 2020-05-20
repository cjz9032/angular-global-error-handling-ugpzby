import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'vtr-modal-scan-failure',
	templateUrl: './modal-scan-failure.component.html',
	styleUrls: ['./modal-scan-failure.component.scss']
})
export class ModalScanFailureComponent implements OnInit {

	@Input() supportUrl: string;
	@Input() hasFailedRbsDevice: boolean;

	failedModules: any;
	rbsDevices: any;
	private failedRbsDevices: Array<string>;

	constructor(public activeModal: NgbActiveModal, private translate: TranslateService,
		private route: ActivatedRoute,
		private router: Router) {
		this.failedRbsDevices = [];
	}

	ngOnInit() { }

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
		// First, getting a list of Ids of storage devices with failure
		let failedStorageIds = this.failedModules.find(m => m.moduleId == 'storage')
			.devices.reduce(
				(result, device) => {
					result.push(device.deviceId);
					return result;
				}, []);

		// Second, getting a list of Ids of storage devices that support RBS
		let rbsDeviceIds = this.rbsDevices.groupList.reduce(
			(result, device) => {
				result.push(device.id);
				return result;
			}, []);

		// Finally, getting the list of Ids contained in both lists
		// If any value is returned, it means that a storage device that supports RBS failed, meaning that
		// a RBS test will be suggested to the user
		return failedStorageIds.filter(storageId => rbsDeviceIds.includes(storageId))
	}

	// Goes to RBS page, passing defective device list to be selected when RBS page loads
	goToRBSPage() {
		this.router.navigate(['recover-bad-sectors'], {
			relativeTo: this.route,
			queryParams: {
				failedDevices: this.failedRbsDevices
			},
			queryParamsHandling: 'merge'
		});
		this.closeModal();
	}
}
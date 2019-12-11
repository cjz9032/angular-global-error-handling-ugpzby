import {
	Component,
	OnInit
} from '@angular/core';
import {
	NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit {
	switchPage = 1;
	url = 'ms-settings:privacy-location';
	showPageLocation = false;
	isLocationServiceOn: boolean;
	chs: ConnectedHomeSecurity;
	permission: any;
	locationPermission: DeviceLocationPermission;
	metricsParent = 'HomeSecurity';
	welcomeDesc = [{
		icon: 'personalDevice',
		desc: 'homeSecurity.tour.welcomeDesc1'
	}, {
		icon: 'places',
		desc: 'homeSecurity.tour.welcomeDesc2'
	}];
	constructor(
		public activeModal: NgbActiveModal,
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {	}

	ngOnInit() {
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		this.permission = this.vantageShellService.getPermission();

		if (this.switchPage === 2) {
			this.showPageLocation = true;
		}
		this.refreshPage();

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.isLocationServiceOn = data;
			if (data) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
				if (this.switchPage === 2) {
					this.closeModal();
				}
			} else {
				this.showPageLocation = !this.isLocationServiceOn;
			}
		});
	}

	refreshPage() {
		if (this.locationPermission && this.locationPermission.hasSystemPermissionShowed) {
			this.isLocationServiceOn = this.locationPermission.isLocationServiceOn;
			if (this.isLocationServiceOn) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		} else {
			this.isLocationServiceOn = false;
		}
	}

	closeModal() {
		this.activeModal.close();
	}

	next() {
		this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
		if (this.isLocationServiceOn) {
			this.closeModal();
		} else {
			this.switchPage = 2;
			this.showPageLocation = true;
		}
	}

	public openLocation($event: any) {
		this.closeModal();
		if (this.locationPermission
				&& this.locationPermission.isAllAppsServiceOn
				&& this.locationPermission.isDeviceServiceOn
				&& !this.locationPermission.hasSystemPermissionShowed) {
			this.requestVantagePermission();
		} else {
			this.permission.openSettingsApp(this.url);
		}
	}

	requestVantagePermission() {
		this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
			this.isLocationServiceOn = status;
			if (status) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		});
	}
}

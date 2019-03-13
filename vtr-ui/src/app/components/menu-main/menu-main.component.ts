import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLenovoIdComponent } from '../modal/modal-lenovo-id/modal-lenovo-id.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {
	public deviceModel: string;

	items = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			path: 'dashboard',
			icon: 'columns',
			subitems: []
		}, {
			id: 'device',
			label: 'Device',
			path: 'device',
			icon: 'laptop',
			subitems: [{
				id: 'device',
				label: 'My device',
				path: 'device',
				icon: '',
				subitems: []
			}, {
				id: 'device-settings',
				label: 'My device settings',
				path: 'device-settings',
				icon: '',
				subitems: []
			}, {
				id: 'system-updates',
				label: 'System updates',
				path: 'system-updates',
				icon: '',
				subitems: []
			}]
		}, {
			id: 'security',
			label: 'Security',
			path: 'security',
			icon: 'lock',
			subitems: [{
				id: 'security',
				label: 'My Security',
				path: 'security',
				icon: '',
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'Anti-Virus',
				path: 'anti-virus',
				icon: '',
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'WiFi Security',
				path: 'wifi-security',
				icon: '',
				subitems: []
			}, {
				id: 'password-protection',
				label: 'Password Protection',
				path: 'password-protection',
				icon: '',
				subitems: []
			}, {
				id: 'internet-protection',
				label: 'Internet Protection',
				path: 'internet-protection',
				icon: '',
				subitems: []
			}, {
				id: 'windows-hello',
				label: 'Windows Hello',
				path: 'windows-hello',
				icon: '',
				subitems: []
			}]
		}, {
			id: 'support',
			label: 'Support',
			path: 'support',
			icon: 'wrench',
			subitems: []
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			subitems: []
		}
	];

	constructor(
		private router: Router,
		public configService: ConfigService,
		private commonService: CommonService,
		public userService: UserService,
		private modalService: NgbModal
	) { }

	ngOnInit() {

		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	menuItemClick(event, path) {
		this.router.navigateByUrl(path);
	}

	//  to popup Lenovo ID modal dialog
	OpenLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true
		});
	}

	onLogout() {
		this.userService.removeAuth();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case LocalStorageKey.MachineInfo:
					this.deviceModel = notification.payload.family;
					break;

				default:
					break;
			}
		}
	}

}

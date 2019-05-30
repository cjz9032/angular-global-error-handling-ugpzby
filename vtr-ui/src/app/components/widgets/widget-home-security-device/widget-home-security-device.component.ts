import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLenovoIdComponent } from '../../modal/modal-lenovo-id/modal-lenovo-id.component';
import { UserService } from 'src/app/services/user/user.service';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';

@Component({
	selector: 'vtr-widget-home-security-device',
	templateUrl: './widget-home-security-device.component.html',
	styleUrls: ['./widget-home-security-device.component.scss']
})

export class WidgetHomeSecurityDeviceComponent implements OnInit {
	@Input() subscription;
	url = 'https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows';
	device = [{
		title: 'homeSecurity.thisDevice',
		status: 'protected',
		badge: {
			lidBadge: {
				status: 'loading',
				text: 'loading'
			},
			trialBadge: {
				status: 'loading',
				text: 'loading'
			},
			accountBadge: {
				status: 'loading',
				text: 'loading'
			},
			clickEvent() {}
		},
		expiredUrl: 'javascript:void(0);'
	}];
	allDevice = [{
		title: 'homeSecurity.allDevices',
		status: 'not-protected',
		badge: {
			lidBadge: {
				status: 'loading',
				text: 'loading'
			},
			trialBadge: {
				status: 'loading',
				text: 'loading'
			},
			accountBadge: {
				status: 'loading',
				text: 'loading'
			},
			clickEvent() {}
		},
		expiredUrl: 'javascript:void(0);'
	}];
	constructor(public modalService: NgbModal,
				public userService: UserService,
				public homeSecurityMockService: HomeSecurityMockService) {
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.creatViewModel();
	}

	ngOnInit() {
		this.creatViewModel();
	}

	creatViewModel() {
		const deviceBadge = this.device[0].badge;
		const allDevice = this.allDevice[0];
		switch (this.subscription) {
			case 'trial':
				Object.assign(deviceBadge, {
					lidBadge: {
						status: 'enabled',
						text: 'In Ecosystem'
					},
					trialBadge: {
						status: undefined,
					},
					accountBadge: {
						status: undefined,
					},
					clickEvent() {}
				});
				Object.assign(allDevice, {
					status: 'protected',
					badge: {
						lidBadge: {
							status: 'enabled',
							text: 'Ecosystem Enabled'
						},
						trialBadge: {
							status: 'enabled',
							text: 'In Trial'
						},
						accountBadge: {
							status: 'disabled',
							text: 'Upgrade'
						},
						clickEvent() {}
					},
					expiredUrl: this.url
				});
				break;
			case 'trialExpired':
				Object.assign(deviceBadge, {
					lidBadge: {
						status: 'enabled',
						text: 'In Ecosystem'
					},
					trialBadge: {
						status: undefined,
					},
					accountBadge: {
						status: undefined,
					},
					clickEvent() {}
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: {
						lidBadge: {
							status: 'enabled',
							text: 'Ecosystem Enabled'
						},
						trialBadge: {
							status: 'disabled',
							text: 'Trial Expired'
						},
						accountBadge: {
							status: 'disabled',
							text: 'Upgrade'
						},
						clickEvent() {}
					},
					expiredUrl: this.url
				});
				break;
			case 'upgraded':
				Object.assign(deviceBadge, {
					lidBadge: {
						status: 'enabled',
						text: 'In Ecosystem'
					},
					trialBadge: {
						status: undefined,
					},
					accountBadge: {
						status: undefined,
					},
					clickEvent() {}
				});
				Object.assign(allDevice, {
					status: 'protected',
					badge: {
						lidBadge: {
							status: 'enabled',
							text: 'Ecosystem Enabled'
						},
						trialBadge: {
							status: undefined,
						},
						accountBadge: {
							status: 'enabled',
							text: 'Full Access'
						},
						clickEvent() {}
					},
					expiredUrl: 'javascript:void(0);',
				});
				break;
			case 'upgradedExpired':
				Object.assign(deviceBadge, {
					lidBadge: {
						status: 'enabled',
						text: 'In Ecosystem'
					},
					trialBadge: {
						status: undefined,
					},
					accountBadge: {
						status: undefined,
					},
					clickEvent() {}
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: {
						lidBadge: {
							status: 'enabled',
							text: 'Ecosystem Enabled'
						},
						trialBadge: {
							status: undefined,
						},
						accountBadge: {
							status: 'disabled',
							text: 'Upgrade'
						},
						clickEvent() {}
					},
					expiredUrl: this.url
				});
				break;
			case 'localAccount':
				Object.assign(deviceBadge, {
					lidBadge: {
						status: 'disabled',
						text: 'Add to Ecosystem'
					},
					trialBadge: {
						status: undefined,
					},
					accountBadge: {
						status: undefined,
					},
					clickEvent: this.launchLenovoId.bind(this),
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: {
						lidBadge: {
							status: 'disabled',
							text: 'Enable Ecosystem'
						},
						trialBadge: {
							status: undefined,
						},
						accountBadge: {
							status: undefined,
						},
						clickEvent: this.launchLenovoId.bind(this),
					}
				});
				break;
		}
		// if (this.userService.auth) {
		// 	deviceBadge.lidBadge.status = 'enabled';
		// 	deviceBadge.lidBadge.text = 'In Ecosystem';
		// 	allDevice.badge.lidBadge.status = 'enabled';
		// 	allDevice.badge.lidBadge.text = 'Ecosystem Enabled';
		// } else {
		// 	deviceBadge.lidBadge.status = 'disabled';
		// 	deviceBadge.lidBadge.text = 'Add to Ecosystem';
		// 	allDevice.badge.lidBadge.status = 'disabled';
		// 	allDevice.badge.lidBadge.text = 'Enable Ecosystem';
		// }
	}

	launchLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}

	switchMock() {
		const subscription = ['upgraded', 'upgradedExpired', 'trial', 'trialExpired', 'localAccount'];
		const i = this.homeSecurityMockService.id;
		console.log(this.homeSecurityMockService.id);
		if (this.homeSecurityMockService.id < 4) {
			this.homeSecurityMockService.id++;
		} else { this.homeSecurityMockService.id = 0; }
		this.homeSecurityMockService.account.subscription = subscription[i];
		this.creatViewModel();
	}
}

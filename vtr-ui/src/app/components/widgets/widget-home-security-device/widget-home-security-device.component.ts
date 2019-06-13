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
		badge: [
			{
				type: 'lidBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				clickEvent() { },
				expiredUrl: 'javascript:void(0);'
			},
			{
				type: 'accountBadge',
				status: undefined,
			},
			{
				type: 'trialBadge',
				status: undefined
			}
		],
	}];
	allDevice = [{
		title: 'homeSecurity.allDevices',
		status: 'not-protected',
		badge: [
			{
				type: 'lidBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				clickEvent() { },
				expiredUrl: 'javascript:void(0);'
			},
			{
				type: 'accountBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				clickEvent() { },
				expiredUrl: 'javascript:void(0);'
			},
			{
				type: 'trialBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				clickEvent() { },
				expiredUrl: 'javascript:void(0);'
			}
		],
	}];
	constructor(public modalService: NgbModal,
		public userService: UserService,
		public homeSecurityMockService: HomeSecurityMockService) {
	}

	// @HostListener('window:focus')
	// onFocus(): void {
	// 	this.creatViewModel();
	// }

	ngOnInit() {
		this.creatViewModel();
	}

	creatViewModel() {
		const deviceBadge = this.device[0];
		const allDevice = this.allDevice[0];
		switch (this.subscription) {
			case 'trial':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystemEnable',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.upgrade',
							clickEvent() { },
							expiredUrl: this.url
						},
						{
							type: 'trialBadge',
							status: 'enabled',
							text: 'homeSecurity.inTrial',
							clickEvent() { },
							expiredUrl: this.url
						}
					],
				});
				break;
			case 'trialExpired':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystemEnable',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.upgrade',
							clickEvent() { },
							expiredUrl: this.url
						},
						{
							type: 'trialBadge',
							status: 'disabled',
							text: 'homeSecurity.trialExpired',
							clickEvent() { },
							expiredUrl: this.url
						}
					],
				});
				break;
			case 'upgraded':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystemEnable',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);',
						},
						{
							type: 'accountBadge',
							status: 'enabled',
							text: 'homeSecurity.fullAccess',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);',
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case 'upgradedExpired':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystemEnable',
							expiredUrl: 'javascript:void(0);',
							clickEvent() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.renew',
							expiredUrl: this.url,
							clickEvent() { },
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case 'localAccount':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'disabled',
							text: 'homeSecurity.addEcosystem',
							clickEvent: this.launchLenovoId.bind(this),
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'disabled',
							text: 'homeSecurity.enableEcosystem',
							clickEvent: this.launchLenovoId.bind(this),
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case 'localWithLid':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				Object.assign(allDevice, {
					status: 'not-protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystemEnable',
							clickEvent() { },
							expiredUrl: 'javascript:void(0);'
						},
						{
							type: 'accountBadge',
							status: undefined,
						},
						{
							type: 'trialBadge',
							status: 'disabled',
							text: 'homeSecurity.startTrial',
							clickEvent: this.startTrial.bind(this),
							expiredUrl: 'javascript:void(0);'
						}
					],
				});
		}
	}

	launchLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}

	switchMock() {
		const subscription = ['upgraded', 'upgradedExpired', 'trial', 'trialExpired', 'localAccount', 'localWithLid'];
		const i = this.homeSecurityMockService.id;
		console.log(this.homeSecurityMockService.id);
		if (this.homeSecurityMockService.id < 5) {
			this.homeSecurityMockService.id++;
		} else { this.homeSecurityMockService.id = 0; }
		this.homeSecurityMockService.account.subscription = subscription[i];
		this.creatViewModel();
	}

	startTrial() {
		this.subscription = 'trial';
		this.creatViewModel();
	}
}

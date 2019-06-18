import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLenovoIdComponent } from '../../modal/modal-lenovo-id/modal-lenovo-id.component';
import { UserService } from 'src/app/services/user/user.service';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { CHSAccountState, ConnectedHomeSecurity, EventTypes } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-widget-home-security-device',
	templateUrl: './widget-home-security-device.component.html',
	styleUrls: ['./widget-home-security-device.component.scss']
})

export class WidgetHomeSecurityDeviceComponent implements OnInit {
	@Input() state;
	@Input() login: Boolean;
	@Output() upgradeAccount = new EventEmitter<boolean>();
	@Output() startTrial = new EventEmitter<boolean>();

	connectedHomeSecurity: ConnectedHomeSecurity;
	device = {
		title: 'homeSecurity.thisDevice',
		status: 'protected',
		badge: [
			{
				type: 'lidBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				onClick() { },
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
	};
	allDevice = {
		title: 'homeSecurity.allDevices',
		status: 'not-protected',
		badge: [
			{
				type: 'lidBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				onClick() { },
			},
			{
				type: 'accountBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				onClick() { },
			},
			{
				type: 'trialBadge',
				status: 'loading',
				text: 'common.securityAdvisor.loading',
				onClick() { },
			}
		],
	};
	constructor(public modalService: NgbModal,
		public userService: UserService,
		public homeSecurityMockService: HomeSecurityMockService) {
		this.connectedHomeSecurity = homeSecurityMockService.getConnectedHomeSecurity();
	}

	@HostListener('window:focus')
	onFocus(): void {
		this.creatViewModel();
	}

	ngOnInit() {
		this.creatViewModel();
		this.connectedHomeSecurity.on(EventTypes.chsEvent, (data) => {
			this.state = data.account.state;
			this.creatViewModel();
		});
	}

	creatViewModel() {
		const deviceBadge = this.device;
		const allDevice = this.allDevice;
		switch (this.state) {
			case 'trial':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							onClick() { },
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
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.upgrade',
							onClick: this.emitUpgradeAccount.bind(this),
						},
						{
							type: 'trialBadge',
							status: 'enabled',
							text: 'homeSecurity.inTrial',
							onClick: this.emitUpgradeAccount.bind(this),
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
							onClick() { },
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
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.upgrade',
							onClick: this.emitUpgradeAccount.bind(this),
						},
						{
							type: 'trialBadge',
							status: 'disabled',
							text: 'homeSecurity.trialExpired',
							onClick: this.emitUpgradeAccount.bind(this),
						}
					],
				});
				break;
			case 'standard':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							onClick() { },
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
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'enabled',
							text: 'homeSecurity.fullAccess',
							onClick() { },
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case 'standardExpired':
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.inEcosystem',
							onClick() { },
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
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.renew',
							onClick: this.emitUpgradeAccount.bind(this),
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case 'local':
				if (this.login) {
					Object.assign(deviceBadge, {
						badge: [
							{
								type: 'lidBadge',
								status: 'enabled',
								text: 'homeSecurity.inEcosystem',
								onClick() { },
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
								onClick() { },
							},
							{
								type: 'accountBadge',
								status: undefined,
							},
							{
								type: 'trialBadge',
								status: 'disabled',
								text: 'homeSecurity.startTrial',
								onClick: this.emitStartTrial.bind(this),
							}
						],
					});
				} else {
					Object.assign(deviceBadge, {
						badge: [
							{
								type: 'lidBadge',
								status: 'disabled',
								text: 'homeSecurity.addEcosystem',
								onClick: this.launchLenovoId.bind(this),
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
								onClick: this.launchLenovoId.bind(this),
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
				}
				break;
			default:
				Object.assign(allDevice, {
					status: 'protected',
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'just use to tests',
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'enabled',
							text: 'just use to test for',
							onClick() { },
						},
						{
							type: 'trialBadge',
							status: 'enabled',
							text: 'just use to test for character',
							onClick() { },
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

	emitUpgradeAccount() {
		this.upgradeAccount.emit();
	}

	emitStartTrial() {
		this.startTrial.emit();
	}

	switchMock() {
		const state = [CHSAccountState.standard, CHSAccountState.standardExpired, CHSAccountState.trial, CHSAccountState.trialExpired, CHSAccountState.local, 'character'];
		const i = this.homeSecurityMockService.id;
		if (this.homeSecurityMockService.id < 5) {
			this.homeSecurityMockService.id++;
		} else { this.homeSecurityMockService.id = 0; }
		const connectedHomeSecurity: any = this.homeSecurityMockService.getConnectedHomeSecurity();
		connectedHomeSecurity.account.state = <CHSAccountState>state[i];
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
		this.creatViewModel();
	}

	logout() {
		const connectedHomeSecurity: any = this.homeSecurityMockService.getConnectedHomeSecurity();
		connectedHomeSecurity.account.lenovoId.loggedIn = !connectedHomeSecurity.account.lenovoId.loggedIn;
		connectedHomeSecurity.mitt.emit(EventTypes.chsEvent, connectedHomeSecurity);
		this.creatViewModel();
	}


}

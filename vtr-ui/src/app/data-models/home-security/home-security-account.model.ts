import { CHSAccountState, CHSAccount } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';

export class HomeSecurityAccount {

	state: CHSAccountState;
	expiration: Date;
	standardTime: Date;
	lenovoIdLoggedIn: boolean;
	device = {
		title: 'homeSecurity.ecosystem.thisDevice',
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
		title: 'homeSecurity.ecosystem.allDevices',
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
	createAccount() {}
	purchase() {}

	constructor(chsAccount: any,
		private modalService: NgbModal) {
		this.state = chsAccount.state;
		this.expiration = chsAccount.expiration;
		this.standardTime = chsAccount.serverTimeUTC;
		this.lenovoIdLoggedIn = chsAccount.lenovoId.loggedIn;
		this.createAccount = chsAccount.createAccount;
		this.purchase = chsAccount.purchase;
		this.creatViewModel();
	}

	creatViewModel() {
		const deviceBadge = this.device;
		const allDevice = this.allDevice;
		switch (this.state) {
			case CHSAccountState.trial:
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inEcosystem',
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
							text: 'homeSecurity.ecosystem.ecosystemEnable',
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.ecosystem.upgrade',
							onClick: this.purchase.bind(this),
						},
						{
							type: 'trialBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inTrial',
							onClick: this.purchase.bind(this),
						}
					],
				});
				break;
			case CHSAccountState.trialExpired:
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inEcosystem',
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
							text: 'homeSecurity.ecosystem.ecosystemEnable',
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.ecosystem.upgrade',
							onClick: this.purchase.bind(this),
						},
						{
							type: 'trialBadge',
							status: 'disabled',
							text: 'homeSecurity.ecosystem.trialExpired',
							onClick: this.purchase.bind(this),
						}
					],
				});
				break;
			case CHSAccountState.standard:
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inEcosystem',
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
							text: 'homeSecurity.ecosystem.ecosystemEnable',
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.fullAccess',
							onClick() { },
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case CHSAccountState.standardExpired:
				Object.assign(deviceBadge, {
					badge: [
						{
							type: 'lidBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inEcosystem',
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
							text: 'homeSecurity.ecosystem.ecosystemEnable',
							onClick() { },
						},
						{
							type: 'accountBadge',
							status: 'disabled',
							text: 'homeSecurity.ecosystem.renew',
							onClick: this.purchase.bind(this),
						},
						{
							type: 'trialBadge',
							status: undefined,
						}
					],
				});
				break;
			case CHSAccountState.local:
				if (this.lenovoIdLoggedIn) {
					Object.assign(deviceBadge, {
						badge: [
							{
								type: 'lidBadge',
								status: 'enabled',
								text: 'homeSecurity.ecosystem.inEcosystem',
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
								text: 'homeSecurity.ecosystem.ecosystemEnable',
								onClick() { },
							},
							{
								type: 'accountBadge',
								status: 'disabled',
								text: 'homeSecurity.ecosystem.upgrade',
								onClick: this.purchase.bind(this),
							},
							{
								type: 'trialBadge',
								status: 'disabled',
								text: 'homeSecurity.ecosystem.startTrial',
								onClick: this.createAccount.bind(this),
							}
						],
					});
				} else {
					Object.assign(deviceBadge, {
						badge: [
							{
								type: 'lidBadge',
								status: 'disabled',
								text: 'homeSecurity.ecosystem.addEcosystem',
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
								text: 'homeSecurity.ecosystem.enableEcosystem',
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
		}
	}

	launchLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}
}

import { CHSAccountState } from '@lenovo/tan-client-bridge';
import { HomeSecurityCommon } from './home-security-common.model';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';

export class HomeSecurityAccount {

	state: CHSAccountState;
	expiration: Date;
	standardTime: Date;
	lenovoIdLoggedIn: boolean;
	dialogService: LenovoIdDialogService;
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

	constructor(chs?: any, common?: HomeSecurityCommon, dialogService?: LenovoIdDialogService) {
		if (dialogService) {
			this.dialogService = dialogService;
		}
		if (chs && chs.account) {
			this.state = chs.account.state;
			this.expiration = chs.account.expiration;
			this.standardTime = chs.account.serverTimeUTC;
			if (chs.account.lenovoId) {
				this.lenovoIdLoggedIn = chs.account.lenovoId.loggedIn;
			}
			if (common) {
				this.createAccount = common.startTrial.bind(common);
				this.purchase = common.upgrade.bind(common);
			}
			this.createViewModel();
		}
	}

	createViewModel() {
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
							onClick: this.purchase,
							id: 'chs-ecosystem-btn-upgradeAccount',
							metricsItem: 'upgradeAccount',
						},
						{
							type: 'trialBadge',
							status: 'enabled',
							text: 'homeSecurity.ecosystem.inTrial',
							onClick: this.purchase,
							id: 'chs-ecosystem-btn-inTrialAccount',
							metricsItem: 'upgradeAccount',
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
							onClick: this.purchase,
							id: 'chs-ecosystem-btn-upgradeAccount',
							metricsItem: 'upgradeAccount',
						},
						{
							type: 'trialBadge',
							status: 'disabled',
							text: 'homeSecurity.ecosystem.trialExpired',
							onClick: this.purchase,
							id: 'chs-ecosystem-btn-trialExpiredAccount',
							metricsItem: 'upgradeAccount',
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
							onClick: this.purchase,
							id: 'chs-ecosystem-btn-upgradeAccount',
							metricsItem: 'upgradeAccount',
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
								onClick: this.purchase,
								id: 'chs-ecosystem-btn-upgradeAccount',
								metricsItem: 'upgradeAccount',
							},
							{
								type: 'trialBadge',
								status: 'disabled',
								text: 'homeSecurity.ecosystem.startTrial',
								onClick: this.createAccount,
								id: 'chs-ecosystem-btn-createAccount',
								metricsItem: 'createAccount',
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
								id: 'chs-ecosystem-btn-addToEcosystem',
								metricsItem: 'loginLenovoId',
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
								id: 'chs-ecosystem-btn-enableEcosystem',
								metricsItem: 'loginLenovoId',
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
		this.dialogService.openLenovoIdDialog('ConnectedHomeSecurity');
	}
}

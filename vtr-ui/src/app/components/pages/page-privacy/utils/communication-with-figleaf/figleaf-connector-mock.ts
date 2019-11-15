import { of } from 'rxjs';

export interface MessageToFigleaf {
	type: string;
	payload?: string;
}

const onConnectListeners = [];
const onDisconnectListeners = [];

const CONNECTION = false;

class FigleafConnector {

	onConnect(cb) {
		onConnectListeners.push(cb);
	}

	onDisconnect(cb) {
		onDisconnectListeners.push(cb);
	}

	async sendMessageToFigleaf(messageToFigleaf: MessageToFigleaf) {
		if (CONNECTION) {
			onConnectListeners.forEach((cb) => {
				cb();
			});

			return new Promise((resolve, reject) => {
					switch (messageToFigleaf.type) {
						case 'testfigleafStatus':
							return resolve({
								payload: {},
								status: 0,
								type: 'testfigleafStatus'
							});
						case 'getFigleafSettings':
							return resolve({
								payload: {
									isAntitrackingEnabled: true,
									isBreachMonitoringEnabled: true
								},
								status: 0,
								type: 'getFigleafSettings'
							});
						case 'getFigleafDashboard':
							return resolve({
								payload: {
									blockedTrackers: 0,
									maskedAccounts: 0,
									monitoredAccounts: 1,
									totalAccounts: 1,
									websitesConnectedPrivately: 0
								},
								status: 0,
								type: 'getFigleafDashboard'
							});
						case 'getFigleafBreachedAccounts':
							return resolve({
								payload: {
									breaches: [
										{
											date: '29/10/2016',
											details: 'Popular Russian social networking platform VKontakte was breached in late 2012. Over 100 million clear-text passwords were compromised in the breach. Breached credential sets included victims\' e-mail addresses, passwords, dates of birth, phone numbers and location details. The credential set was advertised on a dark web marketplace as of June 2016 for a price of one bitcoin. ',
											domain: 'vk.com',
											email: 'ren***@i.ua',
											image: 'https://static.figleafapp.com/knowledgebase/f5e7fb3a-7ca5-404a-8d34-e1f07a931dd2',
											isEmailConfirmed: true,
											isFixed: false,
											link: 'lenovoprivacy:website_info?domain=vk.com',
											password: '123123113321'
										},
										{
											date: '22/12/2017',
											details: 'The proliferation of stolen or leaked databases has given rise to credential stuffing, a fairly simple technique in which criminals load lists of stolen credentials, called combo lists, into automated brute-forcing tools to test credentials en masse. These tools test stolen passwords against thousands of targeted websites and applications until there is a match. This particular combo list was likely compiled over time from a variety of public and private breaches. It contains approximately 1.4 billion email and password records. Criminals are actively leveraging this list, along with credential stuffing tools, to gain unauthorized access to targeted websites. This list has been made public on a number of hacking forums and paste sites.',
											domain: 'n/a',
											email: 'ren***@i.ua',
											image: null,
											isEmailConfirmed: true,
											isFixed: false,
											link: 'lenovoprivacy:group_page',
											password: '12313213131'
										}
									]
								},
								status: 0,
								type: 'getFigleafBreachedAccounts'
							});
						case 'getFigleafLinks':
							return resolve(true);
						case 'getFigleafStatus':
							return resolve({
								payload: {
									appVersion: '2.1.43622.0',
									daysToNotifyTrialExpired: 1,
									expirationDate: 1,
									licenseType: 4,
								},
								status: 0,
								type: 'getFigleafStatus'
							});
					}
				}
			);
		}
	}

	private async connect() {
	}

	disconnect() {
	}

	private disconnectFromFigleaf() {
		onDisconnectListeners.forEach((cb) => {
			cb();
		});
	}

	private serviceClosed() {
		this.disconnectFromFigleaf();
	}
}

export const FigleafConnectorInstance = new FigleafConnector();

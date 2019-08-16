import { MockWindows } from '../moked-api';

const Windows = window['Windows'] || MockWindows; // this is mocked data for browser

export interface MessageToFigleaf {
	type: string;
	payload?: string;
}

const APP_SERVICE_NAME = 'figleaf.lenovoCompanion';
const PACKAGE_FAMILY_NAME = 'Lenovo.FigLeaf_e83k4pgknp69a';

var onConnectListeners = [];
var onDisconnectListeners = [];
var reconnectTimer = null;
var RECONNECT_TIMEOUT = 300;
var connection = null;
var serviceClosedCount = 0;

class FigleafConnector {
	private serviceClosedCallback = this.serviceClosed.bind(this);
	private requestReceivedCallback = this.requestReceived.bind(this);

	onConnect(cb) {
		onConnectListeners.push(cb);
	}

	onDisconnect(cb) {
		onDisconnectListeners.push(cb);
	}

	sendMessageToFigleaf(messageToFigleaf: MessageToFigleaf) {
		var message = new Windows.Foundation.Collections.ValueSet();
		for (const messageKey in messageToFigleaf) {
			message.insert(messageKey.toString(), messageToFigleaf[messageKey]);
		}
		return new Promise((resolve, reject) => {
			connection.sendMessageAsync(message).then((response) => {
				if (response.status === Windows.ApplicationModel.AppService.AppServiceResponseStatus.success) {
					const responseMessage = JSON.parse(response.message.result);
					resolve(responseMessage);
				} else {
					connection = null;
					this.disconnectFromFigleaf();
					reject('request message to figleaf failed');
				}
			});
		});
	}

	connect() {
		if (connection) {
			connection.close();
		}
		connection = new Windows.ApplicationModel.AppService.AppServiceConnection();
		connection.appServiceName = APP_SERVICE_NAME;
		connection.packageFamilyName = PACKAGE_FAMILY_NAME;

		connection.openAsync().then((connectionStatus) => {
			if (connectionStatus === Windows.ApplicationModel.AppService.AppServiceConnectionStatus.success) {
				connection.onserviceclosed = this.serviceClosedCallback;
				connection.onrequestreceived = this.requestReceivedCallback;
				onConnectListeners.forEach((cb) => {
					cb();
				});
				serviceClosedCount = 0;
				RECONNECT_TIMEOUT = 300;
			} else {
				connection = null;
				this.disconnectFromFigleaf();
			}
		});
	}

	disconnect() {
		if (connection) {
			connection.close();
		}
	}

	private disconnectFromFigleaf() {
		onDisconnectListeners.forEach((cb) => {
			cb();
		});
		this.reconnect();
	}

	private reconnect() {
		if (connection) {
			return;
		}
		clearTimeout(reconnectTimer);
		reconnectTimer = setTimeout(() => {
			if (RECONNECT_TIMEOUT < 10000) {
				RECONNECT_TIMEOUT += 3000;
			}
			this.connect();
		}, RECONNECT_TIMEOUT);
	}

	private serviceClosed() {
		connection = null;
		this.connect();
		if (serviceClosedCount >= 1) {
			this.disconnectFromFigleaf();
		}
		serviceClosedCount++;
	}

	private requestReceived(service, args) {
	}
}

export const FigleafConnectorInstance = new FigleafConnector();

import { MockWindows } from '../moked-api';

const Windows = window['Windows'] || MockWindows; // this is mocked data for browser

export interface MessageToFigleaf {
	type: string;
	payload?: string;
}

const APP_SERVICE_NAME = 'figleaf.lenovoCompanion';
const PACKAGE_FAMILY_NAME = 'FigLeaf.626177A9E4282_0wysm1pfwxg2e';

var onConnectListeners = [];
var onDisconnectListeners = [];
var reconnectTimer = null;
const RECONNECT_TIMEOUT = 3000;
var connection = null;

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
					console.log('responseMessage from FigLeaf', response.message.result);
					const responseMessage = JSON.parse(response.message.result);
					resolve(responseMessage);
				} else {
					this.disconnectFromFigleaf();
					reject('request message to figleaf failed');
				}
			});
		});
	}

	connect() {
		console.log('CONNECT');
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
				console.log('connection established');
				onConnectListeners.forEach((cb) => {
					cb();
				});
				onConnectListeners = [];
			} else {
				this.disconnectFromFigleaf();
			}
		});
	}

	disconnect() {
		console.log('connection', connection);
		connection.close();
	}

	private disconnectFromFigleaf() {
		onDisconnectListeners.forEach((cb) => {
			cb();
		});
		onDisconnectListeners = [];
		this.reconnect();
	}

	private reconnect() {
		clearTimeout(reconnectTimer);
		reconnectTimer = setTimeout(() => {
			this.connect();
		}, RECONNECT_TIMEOUT);
	}

	private serviceClosed() {
		this.reconnect();
	}

	private requestReceived(service, args) {
	}
}

export const FigleafConnectorInstance = new FigleafConnector();

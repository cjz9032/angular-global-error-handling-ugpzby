import { MockWindows } from '../moked-api';
import { throwError } from 'rxjs';

const Windows = window['Windows'] || MockWindows; // this is mocked data for browser

export interface MessageToFigleaf {
	type: string;
	payload?: string;
}

const APP_SERVICE_NAME = 'figleaf.lenovoCompanion';
const PACKAGE_FAMILY_NAME = 'Lenovo.FigLeaf_e83k4pgknp69a';

const onConnectListeners = [];
const onDisconnectListeners = [];
let connection = null;

class FigleafConnector {
	private serviceClosedCallback = this.serviceClosed.bind(this);

	onConnect(cb) {
		onConnectListeners.push(cb);
	}

	onDisconnect(cb) {
		onDisconnectListeners.push(cb);
	}

	async sendMessageToFigleaf(messageToFigleaf: MessageToFigleaf) {
		const currentConnection = await this.connect();
		const message = new Windows.Foundation.Collections.ValueSet();

		for (const messageKey in messageToFigleaf) {
			if (messageToFigleaf.hasOwnProperty(messageKey)) {
				message.insert(messageKey.toString(), messageToFigleaf[messageKey]);
			}
		}

		const response = await currentConnection.sendMessageAsync(message);

		if (response && response.status === Windows.ApplicationModel.AppService.AppServiceResponseStatus.success) {
			return JSON.parse(response.message.result);
		} else {
			this.disconnect();
			return throwError('Something went wrong with connection');
		}
	}

	private async connect() {
		let newConnection = connection;

		if (newConnection === null) {
			console.log('create connection');
			newConnection = new Windows.ApplicationModel.AppService.AppServiceConnection();
			newConnection.appServiceName = APP_SERVICE_NAME;
			newConnection.packageFamilyName = PACKAGE_FAMILY_NAME;
			newConnection.onserviceclosed = this.serviceClosedCallback;

			const connectionStatus = await newConnection.openAsync();

			if (connectionStatus === Windows.ApplicationModel.AppService.AppServiceConnectionStatus.success) {
				connection = newConnection;

				onConnectListeners.forEach((cb) => {
					cb();
				});
			}
		}

		return newConnection;
	}

	disconnect() {
		if (connection) {
			connection.close();
			connection = null;
		}
	}

	private disconnectFromFigleaf() {
		onDisconnectListeners.forEach((cb) => {
			cb();
		});
	}

	private serviceClosed() {
		console.log('serviceClosed');
		connection = null;
		this.disconnectFromFigleaf();
	}
}

export const FigleafConnectorInstance = new FigleafConnector();

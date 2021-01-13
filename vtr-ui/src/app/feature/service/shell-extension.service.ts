import { Injectable } from '@angular/core';
import { attempt } from 'lodash';

import { CancelHandler } from '../types/shell-extension';


// tslint:disable-next-line: prefer-const
let vantageShellExtension: any;

@Injectable({
	providedIn: 'root',
})
export class ShellExtensionService {
	async sendContract(
		plainObject: any,
		callback?: (res: any) => void,
		cancelHandler?: CancelHandler
	): Promise<any> {
		const client = new vantageShellExtension.VantageRpcClientEx();
		if (plainObject.payload && typeof plainObject.payload !== 'string') {
			plainObject.payload = attempt(JSON.stringify, plainObject.payload);
		}
		client.onprogress = (progress: any) => {
			if (callback) {
				const responseObject = attempt(JSON.parse, progress);
				if (responseObject.payload) {
					responseObject.payload = attempt(JSON.parse, responseObject.payload);
				}
				callback(responseObject);
			}
		};

		client.oncomplete = (response: any) => {
			if (cancelHandler) {
				cancelHandler.cancel = () => false;
			}

			const responseObject = attempt(JSON.parse, response);
			if (responseObject.errorcode !== 0) {
				return Promise.reject({
					errorcode: responseObject.errorcode,
					description: responseObject.errordesc,
				});
			}
			if (responseObject.payload) {
				responseObject.payload = attempt(JSON.parse, responseObject.payload);
			}
			return responseObject.payload;
		};

		client.onerror = (error: any) => {
			if (cancelHandler) {
				cancelHandler.cancel = () => false;
			}
			return error;
		};

		if (cancelHandler) {
			cancelHandler.cancel = () => {
				client.cancel();
				return true;
			};
		}

		client.makeRequestAsync(attempt(JSON.stringify, plainObject));
	}

	sendContractSync(plainObject: any): any {
		try {
			const client = new vantageShellExtension.VantageRpcClientEx();
			if (plainObject.payload && typeof plainObject.payload !== 'string') {
				plainObject.payload = attempt(JSON.stringify, plainObject.payload);
			}
			const responseJson = client.makeRequest(attempt(JSON.stringify, plainObject), null);
			const response = attempt(JSON.parse, responseJson);
			if (response.payload) {
				response.payload = attempt(JSON.parse, response.payload);
			}
			return response.payload;
		} catch (e) {
			return null;
		}
	}
}

import { Injectable } from '@angular/core';
import { attempt } from 'lodash';

import { CancelHandler } from '../types/shell-extension';
@Injectable({
	providedIn: 'root',
})
export class ShellExtensionService {
	sendContract(
		plainObject: any,
		callback?: (res: any) => void,
		cancelHandler?: CancelHandler
	): Promise<any> {
		if (plainObject.payload && typeof plainObject.payload !== 'string') {
			plainObject.payload = attempt(JSON.stringify, plainObject.payload);
		}

		return new Promise((resolve, reject) => {
			const client = new (window as any).VantageShellExtension.VantageRpcClientEx();
			client.onprogress = (progress: any) => {
				try {
					if (callback) {
						const responseObject = this.safeJsonParse(progress);
						if (responseObject.payload) {
							responseObject.payload = this.safeJsonParse(responseObject.payload);
						}
						callback(responseObject);
					}
				} catch (exception) {
					//do nothing
				}
			};

			client.oncomplete = (response: any) => {
				try {
					if (cancelHandler) {
						cancelHandler.cancel = () => false;
					}

					const responseObject = this.safeJsonParse(response);
					if (responseObject.errorcode !== 0) {
						return reject({
							errorcode: responseObject.errorcode,
							description: responseObject.errordesc,
						});
					}
					if (responseObject.payload) {
						responseObject.payload = this.safeJsonParse(responseObject.payload);
					}
					resolve(responseObject.payload);
				} catch (exception) {
					//do nothing
				}
			};

			client.onerror = (error: any) => {
				try {
					if (cancelHandler) {
						cancelHandler.cancel = () => false;
					}
					reject(error);
				} catch (exception) {
					//do nothing
				}
			};

			if (cancelHandler) {
				cancelHandler.cancel = () => {
					client.cancel();
					return true;
				};
			}

			client.makeRequestAsync(attempt(JSON.stringify, plainObject));
		});
	}

	sendContractSync(plainObject: any): any {
		try {
			const client = new (window as any).VantageShellExtension.VantageRpcClientEx();
			if (plainObject.payload && typeof plainObject.payload !== 'string') {
				plainObject.payload = attempt(JSON.stringify, plainObject.payload);
			}
			const responseJson = client.makeRequest(attempt(JSON.stringify, plainObject), null);
			const response = this.safeJsonParse(responseJson);
			if (response.payload) {
				response.payload = this.safeJsonParse(response.payload);
			}
			return response.payload;
		} catch (e) {
			return null;
		}
	}

	private safeJsonParse(item: string): any {
		try {
			return JSON.parse(item);
		} catch (e) {
			return item;
		}
	}
}

/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />

import { Injectable } from '@angular/core';
import * as inversify from 'inversify';
import bootstrap from '@lenovo/tan-client-bridge/src/index';

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {

	private phoenix: any;
	constructor() {
		const shell = this.getVantageShell();
		if (shell) {
			this.phoenix = bootstrap(
				new inversify.Container(),
				new shell.VantageRpcClient()
			);
		}
	}

	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
	}

	public getLenovoId(): any {
		if (this.phoenix && this.phoenix.lid) {
			return this.phoenix.lid;
		}
		return undefined;
	}
	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDashboard(): any {
		if (this.phoenix) {
			return this.phoenix.dashboard;
		}
		return undefined;
	}

	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDevice(): any {
		if (this.phoenix) {
			return this.phoenix.device;
		}
		return undefined;
	}
}

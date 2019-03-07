/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />

import { Injectable } from '@angular/core';
import * as inversify from 'inversify';
import bootstrap from '@lenovo/tan-client-bridge/src/index';

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {

	private phoenixShell: any;
	constructor() {
		const shell = this.getVantageShell();
		if (shell) {
			this.phoenixShell = bootstrap(
				new inversify.Container(),
				new shell.VantageRpcClient()
			);
		}
	}

	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
	}

	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDashboard(): any {
		if (this.phoenixShell) {
			return this.phoenixShell.dashboard;
		}
		return undefined;
	}
}

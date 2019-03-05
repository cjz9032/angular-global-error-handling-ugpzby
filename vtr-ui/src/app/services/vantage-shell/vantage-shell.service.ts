/// <reference path='../../../../node_modules/@lenovo/tan-client-bridge/src/index.js' />

import { Injectable } from '@angular/core';
import * as inversify from 'inversify';

import bootstrap from '@lenovo/tan-client-bridge'

@Injectable({
    providedIn: 'root'
})
export class VantageShellService {

    private phoenix: any;
    constructor() {
        console.log('VantageShellService');

        const shell = this.getVantageShell();
        if (shell) {
            this.phoenix = bootstrap(
                new inversify.Container(),
                new shell.VantageRpcClient()
            );
            console.log('VantageRpcClient', JSON.stringify(this.phoenix));
        }
    }

    private getVantageShell(): any {
        const win: any = window;
        return win.VantageShellExtension;
    }

    public getLoginUrl(): any {
        if (this.phoenix && this.phoenix.lid) {
            return this.phoenix.lid.getLoginUrl();
        }
        return undefined;
    }

    public enableSSO(useruad, username, userid, userguid): any {
        if (this.phoenix && this.phoenix.lid) {
            return this.phoenix.lid.enableSSO(useruad, username, userid, userguid);
        }
        return undefined;
    }
    
    public logout(): any {
        if (this.phoenix && this.phoenix.lid) {
            return this.phoenix.lid.logout();
        }
        return undefined;
    }
}
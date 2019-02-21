import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    // selector: 'app-admin',
    templateUrl: './breached-accounts.component.html',
    styleUrls: ['./breached-accounts.component.scss']
})
export class BreachedAccountsComponent {
    constructor(private _location: Location) {
    }
    backClicked() {
        this._location.back();
    }
}

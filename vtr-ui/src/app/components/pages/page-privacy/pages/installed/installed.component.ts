import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
    // selector: 'app-admin',
    templateUrl: './installed.component.html',
    styleUrls: ['./installed.component.scss']
})
export class InstalledComponent {
    constructor(private _location: Location) {
    }
    backClicked() {
        this._location.back();
    }
}

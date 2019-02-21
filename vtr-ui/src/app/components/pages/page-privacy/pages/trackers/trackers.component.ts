import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
    // selector: 'app-admin',
    templateUrl: './trackers.component.html',
    styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
    constructor(private _location: Location) {
    }
    backClicked() {
        this._location.back();
    }
}

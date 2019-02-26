import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    // selector: 'app-admin',
    templateUrl: './browser-accounts.component.html',
    styleUrls: ['./browser-accounts.component.scss']
})
export class BrowserAccountsComponent {
	// static Data for html
	public browserStoredAccountsData = {showDetailAction: 'expand', showBanner: true};
	public pageBannerData = {
		title: 'Lenovo Privacy by FigLeaf — free for 14 days',
		text: 'Lenovo Privacy by FigLeaf lets you share what you want or keep things private for each site you visit or transact with. Your email. Payment and billing info. Your location. Even your personal interests. No matter what you do er where you go, you decide your level of privacy.',
		image_url: '/assets/images/privacy-tab/banner.png',
        read_more_link: 'https://figleafapp.com/',
    };

    constructor(private _location: Location) {
    }

    backClicked() {
        this._location.back();
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'main-header',
	templateUrl: './main-header.component.html',
	styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

    title = 'Lenovo Privacy';

	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];

	constructor(public router: Router) {
        let routerPage = '';
        router.events.forEach((event) => {
        	if (event instanceof NavigationEnd) {
        		routerPage = event.url.split('/')[2];
				switch (routerPage) {
					case '':
                        return this.title = 'Hardware scan';
                    case 'scan':
                        return this.title = 'Hardware scan';
                    case 'result':
                        return this.title = 'Lenovo Privacy';
                    case 'trackers':
                        return this.title = 'Am I being tracked?';
                    case 'installed':
                        return this.title = 'Lenovo Privacy';
                    case 'breaches':
                        return this.title = 'Breached accounts';
                    case 'browser-accounts':
                        return this.title = 'Accounts stored in Browsers';
					default:
						return '';
                }
			}
        });
	}

	ngOnInit() {
	}

}

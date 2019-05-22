import {
	Component,
	OnInit,
    Input
} from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Component({
	selector: 'vtr-widget-home-security-account-status',
	templateUrl: './widget-home-security-account-status.component.html',
	styleUrls: ['./widget-home-security-account-status.component.scss']
})
export class WidgetHomeSecurityAccountStatusComponent extends BaseComponent implements OnInit {
	@Input() title: string = this.title || '';
	@Input() description: string = this.description || '';
	constructor() {
        super();
    }

	ngOnInit() {}

}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from '../../../services/common/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-ui-switch-onoff',
	templateUrl: './ui-switch-onoff.component.html',
	styleUrls: ['./ui-switch-onoff.component.scss'],
})
export class UiSwitchOnoffComponent implements OnInit, OnDestroy {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value: boolean;
	@Input() onOffSwitchId: string;
	@Input() onOffSwitchParam: string;
	@Input() disabled = false;
	@Input() showLoader = false;
	@Input() theme = 'white';
	@Input() readonly = false;
	@Input() tabIndex = 0;
	@Input() isSwitchDisable = false;
	@Input() ariaLabel: string;
	uiSubscription: Subscription;

	size = 'switch-xs';

	switchOnText = this.tranlateService.instant('common.ui.on');
	switchOffText = this.tranlateService.instant('common.ui.off');

	constructor(public commonService: CommonService, public tranlateService: TranslateService) {}

	ngOnInit() {
		this.readonly = this.readonly || false;
		this.uiSubscription = this.commonService.notification.subscribe((response) => {
			if (response.type === this.onOffSwitchId) {
				this.value = response.payload;
			}
		});
	}

	ngOnDestroy() {
		if (this.uiSubscription) {
			this.uiSubscription.unsubscribe();
		}
	}

	/**
	 *
	 * @param $event the toggle button info.
	 * this function is to send the change event for readonly = false types.
	 */
	onChange($event) {
		setTimeout(() => {
			if (!this.readonly) {
				this.disabled = true;
				if (this.onOffSwitchId === 'recommended-updates') {
					this.disabled = this.isSwitchDisable;
					this.value = !this.value;
				} else if (this.onOffSwitchId !== 'sa-ws-switch') {
					this.disabled = false;
					this.value = !this.value;
				}
				$event.switchValue = this.value;
				this.toggle.emit($event);
			}
		}, 0);
	}

	/**
	 *
	 * @param $event the toggle button info.
	 * this function is to send the change event for the readonly = true types.
	 */
	sendChangeEvent($event) {
		if (this.readonly) {
			$event.switchValue = !this.value;
			this.toggle.emit($event);
		}
	}

	stopPropagation(event) {
		event.stopPropagation();
	}
}

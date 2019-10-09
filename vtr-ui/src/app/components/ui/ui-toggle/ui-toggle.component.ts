import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from '../../../services/common/common.service';
import { faSellcast } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'vtr-ui-toggle',
	templateUrl: './ui-toggle.component.html',
	styleUrls: ['./ui-toggle.component.scss']
})
export class UiToggleComponent implements OnInit, OnDestroy, OnChanges {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value = true;
	@Input() onOffSwitchId: string;
	@Input() notChange = false;
	@Input() toggleId: any;
	@Input() focus = false;
	public currentEvent: any;
	public disabled = true;
	public timer = 0;
	uiSubscription: Subscription;



	constructor(
		public commonService: CommonService
	) { }

	ngOnInit() {
		this.notChange = this.notChange || false;
		this.commonService.notification.subscribe((response) => {
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

	ngOnChanges(changes: SimpleChanges) {
		// Note: commenting for now need to discuss on it. please check the requirement given for VAN-9331 before uncomment the line.

		/* if (changes && changes.focus && Boolean(changes.focus.previousValue) !== this.focus && this.focus) {
			document.getElementById(this.onOffSwitchId + '_checkbox').focus();
		}
		*/
	}

	/**
	 *
	 * @param $event the toggle button info.
	 * this function is to send the change event for the notChange = true types.
	 */
	sendChangeEvent($event) {
		this.currentEvent = $event;
		if (!this.disabled) { return; }
		const setIntervalTimer = setInterval(() => {
			this.disabled = false;
			this.timer++;
			if (this.timer >= 50) {
				this.disabled = true;
				this.timer = 0;
				clearInterval(setIntervalTimer);
			}
		}, 1);
		if (!this.notChange) {
			this.value = !this.value;
		}
		$event.target.value = this.value;
		$event.target.checked = $event.target.value === 'false' ? false : true;
		$event.switchValue = $event.target.value === 'false' ? false : true;
		this.toggle.emit($event);
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

}

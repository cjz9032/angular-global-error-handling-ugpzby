import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from '../../../services/common/common.service';
import { faSellcast } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'vtr-ui-toggle',
	templateUrl: './ui-toggle.component.html',
	styleUrls: ['./ui-toggle.component.scss'],
})
export class UiToggleComponent implements OnInit, OnDestroy {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Output() toggleStatus: EventEmitter<any> = new EventEmitter();
	@Output() hideColordisk: EventEmitter<any> = new EventEmitter();
	@Input() value = true;
	@Input() onOffSwitchId: string;
	@Input() notChange = false;
	@Input() toggleId: any;
	@Input() focus = false;
	@Input() tabIndexNum = 1;
	@Input() parentId: string;
	public currentEvent: any;
	public disabled = true;
	public timer = 0;
	uiSubscription: Subscription;

	constructor(public commonService: CommonService) {}

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

	/**
	 *
	 * @param $event the toggle button info.
	 * this function is to send the change event for the notChange = true types.
	 */
	sendChangeEvent($event) {
		this.currentEvent = $event;
		if (!this.disabled) {
			return;
		}
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
		this.toggleStatus.emit(this.value);
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	public hideColorPicker() {
		if (document.getElementById('colorPicker')) {
			document.getElementById('colorPicker').style.display = 'none';
			this.hideColordisk.emit();
		}
	}
}

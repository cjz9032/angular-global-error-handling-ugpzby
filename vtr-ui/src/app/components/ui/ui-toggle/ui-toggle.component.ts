import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from '../../../services/common/common.service';
import { faSellcast } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'vtr-ui-toggle',
	templateUrl: './ui-toggle.component.html',
	styleUrls: ['./ui-toggle.component.scss']
})
export class UiToggleComponent implements OnInit, OnDestroy  {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value: boolean=true;
	@Input() onOffSwitchId: string;
	@Input() notChange = false;
	@Input() toggleId :any;
	public currentEvent:any;
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


	/**
	 *
	 * @param $event the toggle button info.
	 * this function is to send the change event for the notChange = true types.
	 */
	sendChangeEvent($event) {
		this.currentEvent = $event;
		if(!this.disabled) {return;}
		
		let setIntervalTimer = setInterval(()=> {
			this.disabled = false;
			this.timer++;
			if(this.timer >= 50){
				this.disabled = true;
				this.timer = 0;
				clearInterval(setIntervalTimer);
			}
		},1)
		console.log('this.value-----------------------',$event,$event.target,$event.target.value);
		if (!this.notChange) {
			this.value = !this.value;
		}
		
		$event.target.value = this.value;
		console.log('this.value-----------------------222',$event.target.value);
		this.toggle.emit($event);
		return false;
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

}

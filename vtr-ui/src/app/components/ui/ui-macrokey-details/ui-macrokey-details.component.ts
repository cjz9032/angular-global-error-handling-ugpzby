import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vtr-ui-macrokey-details',
	templateUrl: './ui-macrokey-details.component.html',
	styleUrls: [ './ui-macrokey-details.component.scss' ]
})
export class UiMacrokeyDetailsComponent implements OnInit {
	@Input() number;
	@Input() isNumberpad = false;
	@Output() isRecording = new EventEmitter<any>();
	@Input() recordedData: any = [];
	recording = false;

	constructor() {}

	ngOnInit() {}

	onStartClicked(event) {
		this.toggleRecording();
	}

	onStopClicked(event) {
		this.toggleRecording();
	}

	toggleRecording() {
		this.recording = !this.recording;
		this.isRecording.emit(this.recording);
	}
}

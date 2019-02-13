import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-power',
	templateUrl: './subpage-device-settings-power.component.html',
	styleUrls: ['./subpage-device-settings-power.component.scss']
})
export class SubpageDeviceSettingsPowerComponent implements OnInit {

	title = 'Power Settings';
	dummyCollapsibleContainerItemArray = [
		{
			'rightIcon': ['far', 'question-circle'],
			'leftIcon': ['fas', 'power-off'],
			'title': 'Always on USB',
			'caption': 'Charge USB devices through the Always on USB connector on the computer orem ipsum dolor sit amet del Lorem ipsum dolor sit amet delorem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'isSwitchVisible': false
		},
		{
			'rightIcon': ['far', 'question-circle'],
			'leftIcon': ['fas', 'plug'],
			'title': 'Easy Resume',
			'caption': 'orem ipsum dolor sit amet del Lorem ipsum dolor sit amet del',
			'isSwitchVisible': false
		}		
	];
	constructor() { }

	ngOnInit() {
	}

}

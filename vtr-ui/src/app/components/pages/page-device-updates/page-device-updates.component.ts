import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit {
	title = 'System Updates';
	back = 'BACK';
	backarrow = '< ';
	lastUpdatedDate = '8/10/2018 at 9:34 AM';
	nextUpdatedDate = '11/12/2018 at 10:00 AM';
	installationHistory = 'Installation History';
	installationHistoryList = [
		{
			status: 'fail',
			icon: 'times',
			installationDate: '14 FEB 2018',
			path: '/'
		},
		{
			status: 'pause',
			icon: 'minus',
			installationDate: '16 MAR 2018',
			path: '/'
		},
		{
			status: 'success',
			icon: 'check',
			installationDate: '21 JUL 2018',
			path: '/'
		}
	];

	dummyUpdates = [
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Critical Updates',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			tooltipText: "Critical updates can prevent significant problem, major malfunctions, hardware failure, or data corruption."
		},
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Recommended Updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: true,
			tooltipText: "Recommended driver updates keep your computer running at optimal performance."
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Windows Updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			linkText: 'Windows Settings',
			linkPath: ''
		}
	];

	constructor() { }

	ngOnInit() { }
}

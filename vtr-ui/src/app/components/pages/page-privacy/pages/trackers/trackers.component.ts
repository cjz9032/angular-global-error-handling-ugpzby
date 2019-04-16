import { Component } from '@angular/core';

@Component({
	// selector: 'app-admin',
	templateUrl: './trackers.component.html',
	styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent {
	commonTexts = {
		title: 'Am I being tracked?',
		text: 'While your online activity, interests, and habits help advertisers make money, sometimes the info they collect ends up on the dark web.'
	};

	tryProductText = {
		title: 'Block online trackers with lenovo privacy by figleaf',
		text: 'Do what you love online without being tracked by advertisers and others. Start your 14-day free trial. No credit card required.',
		buttonText: 'Try Lenovo Privacy',
		link: {
			text: 'Learn more',
			url: '/#/privacy/landing'
		},

	};

	tryProductBlockButtonClick(event) {
		console.log('try figleaf');
	}
}


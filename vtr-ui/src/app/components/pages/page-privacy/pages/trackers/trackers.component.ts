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
}


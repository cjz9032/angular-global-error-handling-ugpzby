import { Injectable } from '@angular/core';
import { RoutersName } from '../../../privacy-routing-name';

export interface InstallWidgetPageSettings {
	visible: boolean;
	title: string;
	text: string;
	image: string;
}

@Injectable({
	providedIn: 'root'
})
export class SidebarInstallWidgetService {

	pagesSettings: {
		[path in RoutersName]: InstallWidgetPageSettings
	} = {
		[RoutersName.MAIN]: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Now you decide when to share and when to be private online. Trial duration 14-day. No credit card required.',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.LANDING]: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.PRIVACY]: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Now you decide when to share and when to be private online. Trial duration 14-day. No credit card required.',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.BREACHES]: {
			visible: true,
			title: 'Make sure no one gets your private information',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Breach',
		},
		[RoutersName.TRACKERS]: {
			visible: true,
			title: 'Block tracking tools with Lenovo Privacy Essentials',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Trackers',
		},
		[RoutersName.BROWSERACCOUNTS]: {
			visible: true,
			title: 'Make your passwords private',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Passwords',
		},
		[RoutersName.ARTICLES]: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.ARTICLEDETAILS]: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Start your 14-day trial. No credit card required.',
			image: 'pitch-block/Img_Pith_Main',
		}
	};

	generalizedSettings: InstallWidgetPageSettings = {
		visible: true,
		title: 'The choice to be private is here',
		text: 'Now you decide when to share and when to be private online. Trial duration 14-day. No credit card required.',
		image: 'pitch-block/Img_Pith_Main',
	};
}


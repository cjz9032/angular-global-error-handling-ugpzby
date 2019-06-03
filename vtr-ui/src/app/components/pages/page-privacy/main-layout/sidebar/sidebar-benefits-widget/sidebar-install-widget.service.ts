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
			text: 'Trial duration 14-day. No credit card required.',
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
			title: 'Fix breaches and watch for future ones',
			text: 'Trial duration 14-day. No credit card required.',
			image: 'pitch-block/Img_Pith_Breach',
		},
		[RoutersName.TRACKERS]: {
			visible: true,
			title: 'Block trackers and stay private with Lenovo Privacy',
			text: 'Trial duration 14-day. No credit card required.',
			image: 'pitch-block/Img_Pith_Trackers',
		},
		[RoutersName.BROWSERACCOUNTS]: {
			visible: true,
			title: 'Take back control over your data with Lenovo Privacy',
			text: 'Trial duration 14-day. No credit card required.',
			image: 'pitch-block/Img_Pith_Passwords',
		},
		[RoutersName.ARTICLES]: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Trial duration 14-day. No credit card required.',
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


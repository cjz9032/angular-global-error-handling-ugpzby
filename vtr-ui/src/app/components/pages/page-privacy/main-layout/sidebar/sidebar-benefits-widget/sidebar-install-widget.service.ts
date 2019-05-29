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
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.LANDING]: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.PRIVACY]: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'pitch-block/Img_Pith_Main',
		},
		[RoutersName.BREACHES]: {
			visible: true,
			title: 'Fix breaches and watch for future ones',
			text: '',
			image: 'pitch-block/Img_Pith_Breach',
		},
		[RoutersName.TRACKERS]: {
			visible: true,
			title: 'Block trackers and stay private with Lenovo Privacy',
			text: '',
			image: 'pitch-block/Img_Pith_Trackers',
		},
		[RoutersName.BROWSERACCOUNTS]: {
			visible: true,
			title: 'Take back control over your data with Lenovo Privacy',
			text: '',
			image: 'pitch-block/Img_Pith_Passwords',
		},
		[RoutersName.ARTICLES]: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		}
	};
}

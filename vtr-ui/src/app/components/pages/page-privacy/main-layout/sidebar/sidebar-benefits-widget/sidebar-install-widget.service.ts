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
		tips: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		},
		news: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		},
		landing: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		},
		privacy: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'pitch-block/Img_Pith_Main',
		},
		breaches: {
			visible: true,
			title: 'Fix breaches and watch for future ones',
			text: '',
			image: 'pitch-block/Img_Pith_Breach',
		},
		trackers: {
			visible: true,
			title: 'Block trackers and stay private with Lenovo Privacy',
			text: '',
			image: 'pitch-block/Img_Pith_Trackers',
		},
		'browser-accounts': {
			visible: true,
			title: 'Take back control over your data with Lenovo Privacy',
			text: '',
			image: 'pitch-block/Img_Pith_Passwords',
		},
		faq: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		},
		articles: {
			visible: false,
			title: 'The choice to be private is here',
			text: '',
			image: 'pitch-block/Img_Pith_Main',
		}
	};
}

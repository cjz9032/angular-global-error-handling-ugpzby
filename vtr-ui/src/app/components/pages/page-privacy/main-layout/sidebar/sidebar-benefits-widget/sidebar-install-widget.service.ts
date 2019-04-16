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
			image: 'privacy-search',
		},
		tips: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		news: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		landing: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		privacy: {
			visible: true,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		scan: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		breaches: {
			visible: true,
			title: 'Fix breaches and watch for future ones',
			text: '',
			image: 'gray-safe',
		},
		trackers: {
			visible: true,
			title: 'Block trackers and stay private with Lenovo Privacy',
			text: '',
			image: 'privacy-search',
		},
		installed: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		},
		'browser-accounts': {
			visible: true,
			title: 'Take back control over your data with Lenovo Privacy',
			text: '',
			image: 'take-bake-control',
		},
		faq: {
			visible: false,
			title: 'The choice to be private is here',
			text: 'Get the app that lets you decide when to share \n' +
				'and when to be private, wherever you go online.\n',
			image: 'privacy-search',
		}
	};
}

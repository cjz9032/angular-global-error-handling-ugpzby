import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FaqService {

	constructor() {
	}

	categories = {
		'general-questions': {
			id: 'general-questions',
			title: 'General questions',
			questions: [
				{
					id: 'privacy-score',
					title: 'What is a privacy score?',
					iconPath: '/assets/icons/privacy-tab/icon-score.svg',
					texts: [
						`Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly.
						But these passwords are usually not well encrypted, making your accounts vulnerable to hacking.
						Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts.
						Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts
						vulnerable to hacking. Major web browsers let you store your usernames and passwords for your
						favorite sites, so you can log in quickly. But these passwords are usually not well encrypted,
						making your accounts.`,
						`Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts
						vulnerable to hacking. Major web browsers let you store your usernames and passwords for your
						favorite sites, so you can log in quickly. But these passwords are usually not well encrypted,
						making your accounts.`
					]
				},
				{
					id: 'password-management',
					title: 'Is it browser password management safe?',
					iconPath: '/assets/icons/privacy-tab/icon-browser.svg',
					texts: [
						'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly.'
					]
				},
				{
					id: 'privacy-as-security',
					title: 'Is privacy the same as security?',
					iconPath: '/assets/icons/privacy-tab/icon-privacy-vs-security-user.svg',
					texts: [
						'Is privacy the same as security?'
					]
				},
				{
					id: 'trackers',
					title: 'What are trackers?',
					iconPath: '/assets/icons/privacy-tab/icon-trackers.svg',
					texts: [
						'Is privacy the same as security?'
					]
				},
			]
		},

		'other-questions': {
			id: 'other-questions',
			title: 'Other question',
			questions: [
				{
					id: 'privacy-score2',
					title: 'What is a privacy score?',
					iconPath: '',
					texts: [
						`Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly.
						But these passwords are usually not well encrypted, making your accounts vulnerable to hacking.
						Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts.
						Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts
						vulnerable to hacking. Major web browsers let you store your usernames and passwords for your
						favorite sites, so you can log in quickly. But these passwords are usually not well encrypted,
						making your accounts.`,
						`Major web browsers let you store your usernames and passwords for your favorite sites, so you
						can log in quickly. But these passwords are usually not well encrypted, making your accounts
						vulnerable to hacking. Major web browsers let you store your usernames and passwords for your
						favorite sites, so you can log in quickly. But these passwords are usually not well encrypted,
						making your accounts.`
					]
				},
				{
					id: 'password-management2',
					title: `Is it browser password management safe? Is it browser password management safe?
					Is it browser password management safe? Is it browser password management safe?`,
					iconPath: '',
					texts: [
						'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly.'
					]
				},
				{
					id: 'privacy-as-security2',
					title: 'Is privacy the same as security?',
					iconPath: '',
					texts: [
						'Is privacy the same as security?'
					]
				},
				{
					id: 'trackers2',
					title: 'What are trackers?',
					iconPath: '',
					texts: [
						'Is privacy the same as security?'
					]
				},
			]
		}
	};
}

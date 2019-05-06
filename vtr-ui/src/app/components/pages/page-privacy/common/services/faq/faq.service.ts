import { Injectable } from '@angular/core';
import { RoutersName } from '../../../privacy-routing-name';

interface Question {
	id: string;
	title: string;
	texts: string[];
}

interface PageSettings {
	visible: boolean;
	questions: {
		id: string,
		title: string,
		questions: Question[]
	};
}

@Injectable({
	providedIn: 'root'
})
export class FaqService {

	constructor() {
	}

	questionCategories = {
		dataBreaches: {
			id: 'dataBreaches',
			title: 'Data Breaches',
			questions: [
				{
					id: 'data-come-from',
					title: 'Where does this data come from?',
					texts: [
						`When a company is the victim of a data breach (usually due to weak security on their end)
						 emails and passwords end up floating around online for others to see. In some cases, this
						  information ends up on the dark web where it’s sold and traded.`,
					]
				},
				{
					id: 'should-do-with-this-information',
					title: 'What should I do with this information?',
					texts: [
						`You should change your passwords for these accounts right now.
						 Lenovo Privacy by FigLeaf can help you do that,
						  and then let you know if any of your stored accounts come up in a future privacy breach.`
					]
				},
				{
					id: 'unknown-website',
					title: 'What is an "unknown website"?',
					texts: [
						`Sometimes, we uncover a data breach but don’t know exactly which service the credentials are tied to.
						 It’s also possible that we’re investigating the source and can’t disclose the details yet.`
					]
				},
				{
					id: 'how-fix-breached-accounts',
					title: 'How will Lenovo Privacy fix my breached accounts?',
					texts: [
						`Lenovo Privacy by FigLeaf will help you by changing your breached passwords,
						 actively monitoring for future breaches, and masking your email address when signing up somewhere new.`
					]
				},
				{
					id: 'hashed-password',
					title: 'What is a hashed password?',
					texts: [
						`Some data breaches contain passwords that are still encrypted, so they aren’t visible at first glance.
						 But eventually, these passwords will be decrypted — it could take someone a couple of hours or months,
						  depending on the strength. You should change your password right now.`
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

		trackingMap: {
			id: 'trackingMap',
			title: 'Tracking Map',
			questions: [
				{
					id: 'data-come-from',
					title: 'Where does this data come from?',
					texts: [
						`We’ve analyzed a number of popular online sites and put together this graphic to show you how and where tracking is being used.`,
					]
				},
				{
					id: 'how-block-online-trackers',
					title: 'How does Lenovo Privacy block online trackers?',
					texts: [
						`FigLeaf has anti-tracking technology built right in. Simply put, it detects trackers and then stops them from starting up, ultimately protecting you from being tracked. `,
					]
				},
				{
					id: 'what-risk',
					title: 'What’s the risk?',
					texts: [
						`Companies collect information about you, completely in the background and without your knowledge.
						 They later sell this information to others. Sometimes, this information ends up on the dark web.`,
					]
				},
			]
		},

		accesiblePasswords: {
			id: 'accesiblePasswords',
			title: 'Accesible Passwords',
			questions: [
				{
					id: 'unsafe-passwords',
					title: 'Why is it unsafe to store my passwords in my browser?',
					texts: [
						`While convenient, storing login details for your favorite sites in your browser isn’t a good idea.
						 This data can be read by any program on your PC without your knowledge, which means that almost anyone can see this info — and you won’t know about it.`,
					]
				},
				{
					id: 'remove-all-accounts',
					title: 'Should I remove all accounts my my browser?',
					texts: [
						`That’s definitely a good start. Ideally, you should store your passwords in a strong password manager or something designed with your privacy in mind, like Lenovo Privacy by FigLeaf.`,
					]
				},
				{
					id: 'what-risk',
					title: 'What’s the risk?',
					texts: [
						`Emails and passwords saved in your browser could end up in a data breach. That’s because any app, trusted or malicious, can gain access to these credentials.`,
					]
				},
			]
		},

		otherQuestions: {
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

	pagesSettings: {
		[path in RoutersName]: PageSettings
	} = {
		[RoutersName.MAIN]: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		tips: {
			visible: false,
			questions: this.questionCategories.dataBreaches
		},
		news: {
			visible: false,
			questions: this.questionCategories.dataBreaches
		},
		landing: {
			visible: false,
			questions: this.questionCategories.dataBreaches
		},
		privacy: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		scan: {
			visible: true,
			questions: this.questionCategories.otherQuestions
		},
		breaches: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		trackers: {
			visible: true,
			questions: this.questionCategories.trackingMap
		},
		installed: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		'browser-accounts': {
			visible: true,
			questions: this.questionCategories.accesiblePasswords
		},
		faq: {
			visible: false,
			questions: this.questionCategories.dataBreaches
		}
	};
}

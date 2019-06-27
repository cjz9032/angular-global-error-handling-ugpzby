import { Injectable } from '@angular/core';
import { RoutersName } from '../../../privacy-routing-name';

export interface Questions {
	id: string;
	title: string;
	questions: Question[];
}

export interface Question {
	id: string;
	title: string;
	texts: string[];
	icon: string;
}

interface PageSettings {
	visible: boolean;
	questions: Questions;
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
					],
					icon: 'database',
				},
				{
					id: 'should-do-with-this-information',
					title: 'What should I do with this information?',
					texts: [
						`You should change your passwords for these accounts right now.
						 Lenovo Privacy by FigLeaf can help you do that,
						  and then let you know if any of your stored accounts come up in a future privacy breach.`
					],
					icon: 'question-circle',
				},
				{
					id: 'unknown-website',
					title: 'What is an "unknown website"?',
					texts: [
						`Sometimes, we uncover a data breach but don’t know exactly which service the credentials are tied to.
						 It’s also possible that we’re investigating the source and can’t disclose the details yet.`
					],
					icon: 'browser',
				},
				{
					id: 'how-fix-breached-accounts',
					title: 'How will Lenovo Privacy fix my breached accounts?',
					texts: [
						`Lenovo Privacy by FigLeaf will help you by changing your breached passwords,
						 actively monitoring for future breaches, and masking your email address when signing up somewhere new.`
					],
					icon: 'tools',
				},
				{
					id: 'hashed-password',
					title: 'What is a hashed password?',
					texts: [
						`Some data breaches contain passwords that are still encrypted, so they aren’t visible at first glance.
						 But eventually, these passwords will be decrypted — it could take someone a couple of hours or months,
						  depending on the strength. You should change your password right now.`
					],
					icon: 'key',
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
					],
					icon: 'database',
				},
				{
					id: 'how-block-online-trackers',
					title: 'How does Lenovo Privacy block online tracking tools?',
					texts: [
						`FigLeaf has anti-tracking technology built right in. Simply put, it detects tracking tools and then stops them from starting up, ultimately protecting you from being tracked. `,
					],
					icon: 'debug',
				},
				{
					id: 'what-risk',
					title: 'What’s the risk?',
					texts: [
						`Companies collect information about you, completely in the background and without your knowledge.
						 They later sell this information to others. Sometimes, this information ends up on the dark web.`,
					],
					icon: 'exclamation-circle',
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
					],
					icon: 'lock-open-alt',
				},
				{
					id: 'remove-all-accounts',
					title: 'Should I remove all accounts my my browser?',
					texts: [
						`That’s definitely a good start. Ideally, you should store your passwords in a strong password manager or something designed with your privacy in mind, like Lenovo Privacy by FigLeaf.`,
					],
					icon: 'trash',
				},
				{
					id: 'what-risk',
					title: 'What’s the risk?',
					texts: [
						`Emails and passwords saved in your browser could end up in a data breach. That’s because any app, trusted or malicious, can gain access to these credentials.`,
					],
					icon: 'exclamation-circle',
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
					],
					icon: 'database',
				},
				{
					id: 'password-management2',
					title: `Is it browser password management safe? Is it browser password management safe?
					Is it browser password management safe? Is it browser password management safe?`,
					iconPath: '',
					texts: [
						'Major web browsers let you store your usernames and passwords for your favorite sites, so you can log in quickly.'
					],
					icon: 'database',
				},
				{
					id: 'privacy-as-security2',
					title: 'Is privacy the same as security?',
					iconPath: '',
					texts: [
						'Is privacy the same as security?'
					],
					icon: 'database',
				},
				{
					id: 'trackers2',
					title: 'What are trackers?',
					iconPath: '',
					texts: [
						'Is privacy the same as security?'
					],
					icon: 'database',
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
		landing: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		privacy: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		breaches: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		trackers: {
			visible: true,
			questions: this.questionCategories.trackingMap
		},
		'browser-accounts': {
			visible: true,
			questions: this.questionCategories.accesiblePasswords
		},
		articles: {
			visible: true,
			questions: this.questionCategories.dataBreaches
		},
		'article-details': {
			visible: true,
			questions: this.questionCategories.dataBreaches
		}
	};
}

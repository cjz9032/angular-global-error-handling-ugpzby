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
						 Lenovo Privacy Essentials by FigLeaf can help you do that,
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
					title: 'How will Lenovo Privacy Essentials fix my breached accounts?',
					texts: [
						`Lenovo Privacy Essentials by FigLeaf will help you by changing your breached passwords,
						 actively monitoring for future breaches, and masking your email address when signing up somewhere new.`
					],
					icon: 'tools',
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
					title: 'How does Lenovo Privacy Essentials block online tracking tools?',
					texts: [
						'Lenovo Privacy Essentials by FigLeaf has anti-tracking technology built right in. ' +
						'Simply put, it detects tracking tools and then stops them from starting up, ' +
						'ultimately protecting you from being tracked. ',
					],
					icon: 'debug',
				},
				{
					id: 'what-risk',
					title: 'What’s the risk of being tracked?',
					texts: [
						`Companies collect information about you, completely in the background and without your knowledge. They later may sell this information to others. Sometimes, this information ends up on the dark web.`,
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
						 This data can be read by any program on your PC without your knowledge, which means that almost anyone can see this information — and you won’t know about it.`,
					],
					icon: 'lock-open-alt',
				},
				{
					id: 'remove-all-accounts',
					title: 'Should I remove all accounts my my browser?',
					texts: [
						`That’s definitely a good start. Ideally, you should store your passwords in a strong password manager or something designed with your privacy in mind, like Lenovo Privacy Essentials by FigLeaf.`,
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
					id: 'see-all-my-passwords',
					title: 'I see all my passwords in the Privacy tab. How did they get there?',
					iconPath: '',
					texts: [
						`You allowed us to search for your email in all known data breaches.
						The passwords you’re seeing are compromised passwords for accounts tied to your email address.
						We also discovered that you’re storing passwords in your browsers after you let us run a quick scan.
						We can't see any of the information we're showing you, and we'll never share it.`
					],
					icon: 'key',
				},
				{
					id: 'many-emails',
					title: `How many emails can I monitor for breaches?`,
					iconPath: '',
					texts: [
						'You can monitor one email in the Privacy tab. If you want to keep tabs on your privacy for your other email addresses, install Lenovo Privacy Essentials by FigLeaf.'
					],
					icon: 'envelope',
				},
				{
					id: 'still-use-free-services',
					title: 'Can I still use free services like Google, Facebook, Amazon while blocking tracking tools?',
					iconPath: '',
					texts: [
						'You can browse your favorite sites as before. The only difference is that you\'ll see non-customized ads and content.'
					],
					icon: 'browser',
				},
				{
					id: 'trackers2',
					title: 'Why is it unsafe to store my passwords in my browser?',
					iconPath: '',
					texts: [
						'While convenient, storing login details for your favorite sites in your browser isn’t a good idea. This data can be read by any program on your PC without your knowledge, which means that almost anyone can see this info — and you won’t know about it.'
					],
					icon: 'lock-open-alt',
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
			questions: this.questionCategories.otherQuestions
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
			questions: this.questionCategories.otherQuestions
		},
		'article-details': {
			visible: true,
			questions: this.questionCategories.otherQuestions
		}
	};
}

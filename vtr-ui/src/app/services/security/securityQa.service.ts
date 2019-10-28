import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})

export class SecurityQaService {
	question = [
		{
			id: 'uac',
			title: 'security.landing.uacTitle',
			text: 'security.landing.uacText',
			icon: 'database'
		},
		{
			id: 'active-windows',
			title: 'security.landing.windowsTitle',
			text: 'security.landing.windowsText',
			icon: 'question-circle'
		},
		{
			id: 'encryption',
			title: 'security.landing.encryptionTitle',
			text: 'security.landing.encryptionText',
			icon: 'tools'
		},
		{
			id: 'password',
			title: 'security.landing.passwordTitle',
			text: 'security.landing.passwordText',
			icon: 'key'
		},
		{
			id: 'security-protection',
			title: 'security.landing.enhanceTitle',
			text: 'security.landing.enhanceText',
			icon: 'lock-alt'
		}
	];
}

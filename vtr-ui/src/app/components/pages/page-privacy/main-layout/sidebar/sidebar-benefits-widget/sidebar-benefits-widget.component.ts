import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'vtr-sidebar-benefits-widget',
	templateUrl: './sidebar-benefits-widget.component.html',
	styleUrls: ['./sidebar-benefits-widget.component.scss']
})
export class SidebarBenefitsWidgetComponent implements OnInit {
	mainImageAlt = 'Stop trackers!';
	mainImportantText = 'Stop trackers in their tracks';
	mainText = 'Get the app that lets you choose who sees your info';
	primaryButtonText = 'Try Lenovo Privacy';

	isOpen = false;
	linkButtonText = this.isOpen ? 'Hide details' : 'Tell me more';

	needToShow = false;

	benefitsItems = [
		{
			image: '/assets/images/privacy-tab/default.svg',
			subtitle: 'Scan for breaches',
			text: 'Start by finding out if any of your accounts have been part of a data breach.',
		},
		{
			image: '/assets/images/privacy-tab/default.svg',
			subtitle: 'Monitor future breaches',
			text: 'If any of your accounts stored in Lenovo Privacy by FigLeaf are part of a breach, you’ll know about it',
		},
		{
			image: '/assets/images/privacy-tab/default.svg',
			subtitle: 'Blocks online trackers',
			text: 'We’ll keep you private from online trackers, by blocking them on website you visit.',
		},
		{
			image: '/assets/images/privacy-tab/default.svg',
			subtitle: 'Mask your email',
			text: 'Sign up at new sites without giving out your real email address.',
		},
	];

	constructor(private router: Router) {
		console.log(this.router.url);
		router.events.forEach((event) => {
			if (event instanceof NavigationEnd ) {
				if (event.url === '/privacy/result') {
					this.needToShow = true;
				} else {
					this.needToShow = false;
				}
			}
		});
	}

	ngOnInit() {
	}

	handleClick(ev) {
		this.isOpen = !this.isOpen;
		this.linkButtonText = this.isOpen ? 'Hide details' : 'Tell me more';
	}
}

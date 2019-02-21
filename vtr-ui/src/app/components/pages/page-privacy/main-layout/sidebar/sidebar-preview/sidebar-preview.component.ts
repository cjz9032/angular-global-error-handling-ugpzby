import { Component, Input, OnInit } from '@angular/core';

interface Props {
	mainTitle: string;
	allArticlesText: string;
	allArticlesLink: string;
	items: Array<{
		articleLink: string,
		title: string,
		imagePath: string,
		articleType: string,
		modifyMode?: string
	}>;
}

@Component({
	selector: 'vtr-sidebar-preview',
	templateUrl: './sidebar-preview.component.html',
	styleUrls: ['./sidebar-preview.component.scss']
})

export class SidebarPreviewComponent implements OnInit {

	@Input() data: Props;

	constructor() {
	}

	ngOnInit() {
	}

}

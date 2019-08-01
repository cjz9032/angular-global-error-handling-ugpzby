import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../common/services/storage.service';

export const VIDEO_WATCHED = 'videoWatched';

@Component({
	selector: 'vtr-side-bar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	videoWatched = JSON.parse(this.storageService.getItem(VIDEO_WATCHED)) || false;

	constructor(private storageService: StorageService) {
	}

	ngOnInit() {
	}

	saveToStorage() {
		this.storageService.setItem(VIDEO_WATCHED, JSON.stringify(true));
		this.videoWatched = true;
	}
}

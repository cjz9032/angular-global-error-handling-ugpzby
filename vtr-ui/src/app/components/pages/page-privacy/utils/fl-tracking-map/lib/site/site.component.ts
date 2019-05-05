import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Site} from '../../tracking-map-base/SiteCloudCore/Site';
import { ImageComponent } from '../image/image.component';

@Component({
	selector: '[fl-site]',
	templateUrl: './site.component.html',
	styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

	@Input() p: Site;

	@Output() loadError = new EventEmitter<ImageComponent>();

	constructor(
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	update() {
		if (this.p.opacity === 0) {
			return;
		}
		this.cdr.detectChanges();
	}

	imageLoadError(event) {
		this.loadError.emit(event);
	}

}

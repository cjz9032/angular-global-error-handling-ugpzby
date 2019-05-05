import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy,
	Output,
	EventEmitter,
	ViewChild,
	OnChanges,
	ChangeDetectorRef
} from '@angular/core';
import {Site} from '../../tracking-map-base/SiteCloudCore/Site';

@Component({
	selector: '[fl-image]',
	templateUrl: './image.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnChanges {

	@Input() src: string;

	@Input() width: number | string;
	@Input() height: number | string;

	@Input() x: number | string;
	@Input() y: number | string;

	@Output() loadError = new EventEmitter<ImageComponent>();

	imageBase64: string;

	constructor(
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
	}

	ngOnChanges() {
		const checkImaeg = new Image();
		checkImaeg.src = this.src;
		checkImaeg.onerror = this.imageLoadError.bind(this);
		this.imageBase64 = this.src;
	}

	updateImage(src) {
		this.imageBase64 = src;
		this.cdr.detectChanges();
	}

	imageLoadError() {
		this.loadError.emit(this);
	}

}

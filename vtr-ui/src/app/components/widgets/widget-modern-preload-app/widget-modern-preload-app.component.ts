import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
} from '@angular/core';
import {
	AppItem,
	DownloadButtonStatusEnum,
	ModernPreloadService,
} from 'src/app/services/modern-preload/modern-preload.service';
import { ModernPreloadStatusEnum } from 'src/app/enums/modern-preload.enum';
import { ClipboardService } from 'ngx-clipboard';

@Component({
	selector: 'vtr-widget-modern-preload-app',
	templateUrl: './widget-modern-preload-app.component.html',
	styleUrls: ['./widget-modern-preload-app.component.scss'],
})
export class WidgetModernPreloadAppComponent implements OnInit {
	@Input() appItem: AppItem = new AppItem();
	@Input() redemptionSupport = false;
	@Input() successIconBase64 = '';
	@Input() errorIconBase64 = '';
	@Input() downloadIconBase64 = '';
	@Output() setAppCheckStatusEmitter: EventEmitter<any> = new EventEmitter();
	@Output() setRedeemStatusEmitter: EventEmitter<any> = new EventEmitter();
	@Output() launchURLEmitter: EventEmitter<any> = new EventEmitter();
	@Output() checkedAppEmitter: EventEmitter<any> = new EventEmitter();
	@ViewChild('redeemUrlCopy', { static: false }) redeemUrlCopy: ElementRef;
	@ViewChild('redeemCodeCopy', { static: false }) redeemCodeCopy: ElementRef;

	DownloadButtonStatusEnum = DownloadButtonStatusEnum;
	ModernPreloadStatusEnum = ModernPreloadStatusEnum;

	constructor(
		public modernPreloadService: ModernPreloadService,
		private clipboardService: ClipboardService
	) {}

	ngOnInit() {}

	copy(text: string, id: string) {
		this.clipboardService.copyFromContent(text);
		this[id].nativeElement.focus();
	}

	setAppCheckStatus() {
		this.setAppCheckStatusEmitter.emit();
	}

	setRedeemStatus() {
		this.setRedeemStatusEmitter.emit();
	}

	launchURL() {
		this.launchURLEmitter.emit();
	}

	checkedApp() {
		this.checkedAppEmitter.emit();
	}
}

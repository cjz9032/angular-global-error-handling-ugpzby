import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-article-preview',
	templateUrl: './article-preview.component.html',
	styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit, OnDestroy {
	@Input() article;
	@Output() openArticle = new EventEmitter<string>();

	defaultSrc = '/assets/images/privacy-tab/offline-widget/article-offline.png';
	isOnline = this.commonService.isOnline;

	constructor(
		private commonService: CommonService,
	) {
	}

	ngOnInit() {
		this.checkOnline();
	}

	ngOnDestroy() {
	}

	private checkOnline() {
		this.commonService.notification.pipe(
			filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline),
			map((notification) => notification.payload),
			takeUntil(instanceDestroyed(this))
		).subscribe((payload) => {
			this.isOnline = payload.isOnline;
		});
	}
}

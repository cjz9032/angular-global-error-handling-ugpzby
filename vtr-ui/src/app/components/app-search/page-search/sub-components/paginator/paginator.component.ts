import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
	@Input() pageSize: number;
	@Input() totalItemsCount: number;
	@Input() hidden: boolean;
	@Input() idPrefix: string;
	@Output() pageIndexChange = new EventEmitter();

	pageIndex = 0;
	pageArray = [];
	currentPageStartOffset = 0;
	currentPageEndIndex = 0;

	ngOnChanges() {
		this.pageIndex = 0;
		this.currentPageStartOffset = 0;
		this.currentPageEndIndex = 0;

		if (this.pageSize === 0 || this.totalItemsCount === 0) {
			this.pageArray = [];
			return;
		}

		this.pageArray = [].constructor(Math.ceil(this.totalItemsCount / this.pageSize));
		this.handlePageChange();
	}

	onGoToPreResultPage() {
		this.pageIndex -= 1;
		this.handlePageChange();
	}

	onGoToResultPage(pageIdx: number) {
		this.pageIndex = pageIdx;
		this.handlePageChange();
	}

	onGoToNextResultPage() {
		this.pageIndex += 1;
		this.handlePageChange();
	}

	getCurrentRangeLabel() {
		return `${this.getPageStartOffSet() + 1} - ${this.getPageEndOffSet() + 1}`;
	}

	getTotalItemCount() {
		return this.totalItemsCount;
	}

	getPageStartOffSet() {
		return this.currentPageStartOffset;
	}

	getPageEndOffSet() {
		return this.currentPageEndIndex;
	}

	private handlePageChange(emitEvent: boolean = true) {
		this.currentPageStartOffset = this.pageIndex * this.pageSize;
		this.currentPageEndIndex = Math.min((this.pageIndex + 1) * this.pageSize, this.totalItemsCount) -1;
		if (emitEvent) {
			this.pageIndexChange.emit(this.pageIndex);
		}
	}
}

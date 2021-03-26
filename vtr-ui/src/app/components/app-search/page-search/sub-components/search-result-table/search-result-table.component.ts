import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@lenovo/material/table';
import { IFeature } from 'src/app/services/app-search/model/interface.model';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
	selector: 'vtr-search-result-table',
	templateUrl: './search-result-table.component.html',
	styleUrls: ['./search-result-table.component.scss'],
})
export class SearchResultTableComponent {
	@ViewChild('paginator', { static: true }) paginator: PaginatorComponent;
	@Input() dataSource: IFeature[];
	@Input() idPrefix: string;
	@Output() itemClick = new EventEmitter();

	public displayData: MatTableDataSource<IFeature>;
	public readonly pageSize = 10;

	constructor() {}

	onPageIndexChange(pageIndex: number) {
		const startIndex = this.paginator.getPageStartOffSet();
		const endIndex = this.paginator.getPageEndOffSet();
		const dataRange = this.dataSource.slice(startIndex, endIndex + 1);
		this.displayData = new MatTableDataSource(dataRange);
	}
}

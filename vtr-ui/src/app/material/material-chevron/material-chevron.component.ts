import { Component, Input, OnInit } from '@angular/core';
import { Status } from 'src/app/data-models/widgets/status.model';

@Component({
	selector: 'vtr-material-chevron',
	templateUrl: './material-chevron.component.html',
	styleUrls: ['./material-chevron.component.scss'],
})
export class MaterialChevronComponent implements OnInit {
	@Input() title: string;
	@Input() subtitle: string;
	@Input() id: string;
	@Input() widgetData: Status[];
	@Input() isLeftIcon: boolean;

	ngOnInit(): void {}
}

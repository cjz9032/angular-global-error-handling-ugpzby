import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vtr-snapshot-header',
  templateUrl: './snapshot-header.component.html',
  styleUrls: ['./snapshot-header.component.scss']
})
export class SnapshotHeaderComponent implements OnInit {

	@Input() programList: any;

	constructor() { }

	ngOnInit(): void {
	}

}

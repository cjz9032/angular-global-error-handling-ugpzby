import {
	Component,
	OnInit,
	Input,
	ViewChild,
	Output,
	EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';


@Component({
  selector: 'vtr-ui-list-scheduled-scan',
  templateUrl: './ui-list-scheduled-scan.component.html',
  styleUrls: ['./ui-list-scheduled-scan.component.scss']
})
export class UiListScheduledScanComponent implements OnInit {

	@Input() title = '';
	@Input() caption = '';
	@Input() theme = 'white';
	@Input() typeScan = '';
	@Input() name = '';
	@Input() type = undefined;
	@Input() scanID;

	@Output() editClick = new EventEmitter();

	// private tooltip: NgbTooltip;

	constructor(
		public modalService: NgbModal, private deviceService: DeviceService
	) {}


	ngOnInit() {
	}

	public onEdit() {
		console.log("[Click] Delete Scan ",this.title);
		this.editClick.emit({scanID: this.scanID});
	}
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceStatus } from 'src/app/data-models/widgets/status.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'vtr-ui-deviceinfo-item',
  templateUrl: './ui-deviceinfo-item.component.html',
  styleUrls: ['./ui-deviceinfo-item.component.scss']
})
export class UiDeviceinfoItemComponent implements OnInit {
  @Input() dataModel: DeviceStatus;
  @Output() ItemClicked = new EventEmitter();

  constructor(
	private deviceService: DeviceService,
	private router: Router) { }

  ngOnInit(): void {
  }

  learnMoreClicked(){
	const link = this.dataModel.link;
	if (/.*:.*/.test(link)){
		this.deviceService.launchUri(this.dataModel.link);
		return;
	}
	this.router.navigate([link]);
  }

  itemClicked(){
	  this.ItemClicked.emit();
  }
}

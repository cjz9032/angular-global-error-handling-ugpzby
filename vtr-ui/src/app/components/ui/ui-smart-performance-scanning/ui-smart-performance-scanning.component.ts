import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { WidgetSpeedometerComponent } from '../../widgets/widget-speedometer/widget-speedometer.component';

@Component({
  selector: 'vtr-ui-smart-performance-scanning',
  templateUrl: './ui-smart-performance-scanning.component.html',
  styleUrls: ['./ui-smart-performance-scanning.component.scss']
})
export class UiSmartPerformanceScanningComponent implements OnInit {
	// @ViewChild('speedometer') speedometer: WidgetSpeedometerComponent;
	@ViewChild('speedometer', { static: false }) speedometer: WidgetSpeedometerComponent;

	loop;
	delay;
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
	@Output() sendScanStatus = new EventEmitter();

	index = 0;
	@Input() activegroup = "Tune up performance";
	public vdata=[
		{
			"percentage":0,
			"status":{
			   "category":"Tune Pc Performance",
			   "subcategory":"Accumilated junk",
			   "final":"completed"
			},
			"result":{
			   "Tune":34,
			   "Boost":14,
			   "Secure":12
			},
			"rating":7
		 },
		{
			"percentage":25,
			"status":{
			   "category":"Tune Pc Performance",
			   "subcategory":"Registry Errors",
			   "final":"completed"
			},
			"result":{
			   "Tune":34,
			   "Boost":14,
			   "Secure":12
			},
			"rating":7
		 },
	 {
		"percentage":50,
		"status":{
		   "category":"Malware & Security",
		   "subcategory":"Malware Scan",
		   "final":"completed"
		},
		"result":{
		   "Tune":34,
		   "Boost":14,
		   "Secure":12
		},
		"rating":7
	 },
	 {
		"percentage":60,
		"status":{
		   "category":"Malware & Security",
		   "subcategory":"Annoying adware",
		   "final":"completed"
		},
		"result":{
		   "Tune":34,
		   "Boost":14,
		   "Secure":12
		},
		"rating":7
	 },
	 {
		"percentage":75,
		"status":{
		   "category":"internetperformance",
		   "subcategory":"Network Settings",
		   "final":"completed"
		},
		"result":{
		   "Tune":34,
		   "Boost":14,
		   "Secure":12
		},
		"rating":7
	 },
	 {
		"percentage":100,
		"status":{
		   "category":"internetperformance",
		   "subcategory":"e-junk",
		   "final":"completed"
		},
		"result":{
		   "Tune":34,
		   "Boost":14,
		   "Secure":12
		},
		"rating":7
	 }
	 
	]
	 public scanData : any = {};
	 public timer: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
	this.scanData = this.vdata[0];
	this.initSpeed();
	this.GetScanStatus();	 
  }
  openCancelScanModel() {
	  this.modalService.open(ModalSmartPerformanceCancelComponent, {
		backdrop: 'static',
		centered: true,
		windowClass: 'cancel-modal'
	});
  }
  GetScanStatus() {		 
	if(this.percent!==100)
	{
		this.timer = setInterval(() => {
			if(this.index < this.vdata.length){
			 this.GetScanData(this.index)
			 this.index++;
			 if(this.index==2)
			 {
				this.activegroup = "Malware & Security";
			 }
			 if(this.index==4)
			 {
				this.activegroup = "Internet performance";
			 }
			}	
		 }, 20000);
	
	}
}
GetScanData(i: number) {
	this.scanData = {};
	console.log('************',i);
	this.scanData =  this.vdata[i];
	this.percent = this.scanData.percentage;
	console.log('************',this.scanData);
	if(this.percent ==  100){
		this.sendScanStatus.emit()
	}

}
initSpeed() {
		
	const self = this;
	self.loop = setInterval(function(){
		self.speedometer.speedCurrent = Math.floor(Math.random() * (self.speedometer.speedMax/2)) + 1;
	}, 200);

	self.delay = setTimeout(function(){
		clearInterval(self.loop);
		self.speedometer.speedCurrent = self.speedometer.speedMax * .9;
	}, 3000);
}
}

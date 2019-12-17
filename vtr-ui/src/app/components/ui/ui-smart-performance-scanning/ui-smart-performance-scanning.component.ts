import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSmartPerformanceCancelComponent } from '../../modal/modal-smart-performance-cancel/modal-smart-performance-cancel.component';
import { WidgetSpeedometerComponent } from '../../widgets/widget-speedometer/widget-speedometer.component';
import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vtr-ui-smart-performance-scanning',
  templateUrl: './ui-smart-performance-scanning.component.html',
  styleUrls: ['./ui-smart-performance-scanning.component.scss']
})
export class UiSmartPerformanceScanningComponent implements OnInit {
	// @ViewChild('speedometer') speedometer: WidgetSpeedometerComponent;
	@ViewChild('speedometer', { static: false }) speedometer: WidgetSpeedometerComponent;
	@ViewChild('acc', {static:false}) accordionComponent: NgbAccordion;
	loop;
	delay;
	title = 'smartPerformance.title';
	@Input() showProgress = true;
	@Input() percent = 0;
	@Input() isCheckingStatus = false;
	@Output() sendScanStatus = new EventEmitter();
	
	sampleDesc = 'This is a brief description of what Accumulated Junk means to a user and why they should know more about it. What is it, why is it important, how is it affecting my computer performance, how will I benifit from the junk being cleaned up';
	index = 0;
	@Input() activegroup = "Tune up performance";
	currentCategory = 1;
	subItems: any = {};
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
			"percentage":45,
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
			"percentage":60,
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
		 },
	 {
		"percentage":75,
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
		"percentage":100,
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
	 }
	 
	]
	 public scanData : any = {};
	 public timer: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
	this.scanData = this.vdata[0];
	this.initSpeed();
	this.GetScanStatus();	
	this.updateTuneUpPerformanceSubItems('Performance', this.sampleDesc); 
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
			 if(this.index<=1){
				this.toggle(this.activegroup);
			 }
			 if(this.index==2)
			 {
				this.activegroup = "Internet performance";
				this.currentCategory=2;
				this.updateInternetPerformanceSubItems('Internet performance', this.sampleDesc);
				this.toggle(this.activegroup);
				this.initSpeed();
			 }
			 if(this.index==4)
			 {
				this.activegroup = "Malware & Security";
				this.currentCategory=3;
				this.updateMalwareSubItems('Malware', this.sampleDesc);
				this.toggle(this.activegroup);
				this.initSpeed();
			 }
			
			}
		 }, 2000);
	
	}
}
toggle(id:string): void {
	console.log(id);
 this.accordionComponent.expand(id);
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
	}, 1000);

	self.delay = setTimeout(function(){
		clearInterval(self.loop);
		self.speedometer.speedCurrent = self.speedometer.speedMax * .9;
	}, 10000);
}
updateTuneUpPerformanceSubItems(name, desc) {
	this.subItems = {
		name,
		desc,
		items: [
			{key: 'Tune Pc Performance Dummy Data 1', isCurrent: true},
			{key: 'Tune Pc Performance Dummy Data 2'},
			{key: 'Tune Pc Performance Dummy Data 3'},
			{key: 'Tune Pc Performance Dummy Data 4'}
		]};
	//this.subItemsList.emit(this.subItems);
}
updateMalwareSubItems(name, desc) {
	this.subItems = {
		name,
		desc,
		items: [
			{key: 'Malware & Security Dummy Data 1', isCurrent: true},
			{key: 'Malware & Security Dummy Data 2'},
			{key: 'Malware & Security Dummy Data 3'},
			{key: 'Malware & Security Dummy Data 4'},
	]};
	//this.subItemsList.emit(this.subItems);
}

updateInternetPerformanceSubItems(name, desc) {
	this.subItems = {
		name,
		desc,
		items: [
			{key: 'Internet performance Dummy Data 1', isCurrent: true},
			{key: 'Internet performance Dummy Data 2'},
			{key: 'Internet performance Dummy Data 3'},
			{key: 'Internet performance Dummy Data 4'}
	]};
	//this.subItemsList.emit(this.subItems);
}
}

import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
	selector: 'vtr-widget-mcafee-graphic-introduction',
	templateUrl: './widget-mcafee-graphic-introduction.component.html',
	styleUrls: ['./widget-mcafee-graphic-introduction.component.scss']
})
export class WidgetMcafeeGraphicIntroductionComponent implements OnInit {
	@ViewChild('introduction') introductionView: ElementRef;
	viewHeight: number;
  	constructor() { }

	ngOnInit(): void {
		// this.calcViewHeight();
		// console.log(this.viewHeight);
	}

  	// @HostListener('window:resize', ['$event'])
	// onResize() {
	// 	this.calcViewHeight();
	// 	console.log(this.viewHeight);
	// }


	calcViewHeight() {
		// this.viewHeight = this.introductionView.nativeElement.offsetHeight;
		// this.viewHeight = document.getElementById('introduction').clientHeight;
		// const activeImagView = document.getElementById('activeImag');
		// activeImagView.setAttribute('height', `${this.viewHeight}px`);
	}
}

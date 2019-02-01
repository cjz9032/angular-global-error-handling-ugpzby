import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit, AfterViewInit {

	@ViewChild('containerCard') containerCard;

	@Input() img: string = '';
	@Input() caption: string = '';
	@Input() title: string = '';
	@Input() logo: string = '';
	@Input() logoText: string = '';
	@Input() readMore: string = '';
	@Input() type: string = '';
	@Input() ratioX: number = 1;
	@Input() ratioY: number = 1;
	@Input() cornerShift: String = '';

	ratio = 1;
	containerHeight = 100;

	constructor() { }

	ngOnInit() {
		this.ratio = this.ratioY / this.ratioX;
		const self = this;
		window.onresize = function () {
			self.calcHeight(self.containerCard);
		};
	}

	ngAfterViewInit() {
		const self = this;
		const delay = setTimeout(function(){
			self.calcHeight(self.containerCard);
		},500)
	}

	calcHeight(containerCard){
		// console.log('RESIZE CONTAINER CARD', this.title, this.ratio, containerCard, containerCard.nativeElement.clientWidth);
		if(containerCard){
			this.containerHeight = containerCard.nativeElement.clientWidth * this.ratio;
		}
	}

}

import { Component, Self, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { DisplayService } from '../../services/display/display.service';

@Component({
	selector: 'vtr-container-card',
	templateUrl: './container-card.component.html',
	styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit, AfterViewInit {

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

	resizeListener;

	constructor(
		@Self() private element: ElementRef,
		private displayService: DisplayService
	) { }

	ngOnInit() {
		this.ratio = this.ratioY / this.ratioX;
		const self = this;
		this.resizeListener = this.displayService.windowResizeListener().subscribe((event) => {
			self.calcHeight(self.element);
		});
	}

	ngAfterViewInit() {
		const self = this;
		const delay = setTimeout(function(){
			self.calcHeight(self.element);
		},500)
	}

	calcHeight(containerCard){
		if(containerCard){
			this.containerHeight = containerCard.nativeElement.firstElementChild.clientWidth * this.ratio;
			console.log('RESIZE CONTAINER CARD', this.title, this.ratio, containerCard, this.containerHeight);
		}
	}

}

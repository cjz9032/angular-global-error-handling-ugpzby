import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'vtr-container-card',
  templateUrl: './container-card.component.html',
  styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit {

  @Input() img: string = this.img || '';
  @Input() caption: string = this.caption || '';
  @Input() title: string = this.title || '';
  @Input() logo: string = this.logo || '';
  @Input() logoText: string = this.logoText || '';
  @Input() readMore: string = this.readMore || '';
  @Input() type: string = this.type || '';

  constructor() { }

  getType() {
    let cardType = 1;
    switch (this.type) {
      case '4X4': {
        cardType = 1;
         break;
      }
      case '8X4': {
         cardType = 2;
         break;
	  }
	  case '4X4': {
		cardType = 3;
		break;
	 }
      default: {
        cardType = 1;
         break;
      }
   }

    return cardType;

  }

  ngOnInit() {
  }

}

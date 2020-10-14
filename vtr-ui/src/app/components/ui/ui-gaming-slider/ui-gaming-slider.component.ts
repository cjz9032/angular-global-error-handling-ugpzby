import { Component, OnInit,ElementRef } from '@angular/core';

@Component({
  selector: 'vtr-ui-gaming-slider',
  templateUrl: './ui-gaming-slider.component.html',
  styleUrls: ['./ui-gaming-slider.component.scss']
})
export class UiGamingSliderComponent implements OnInit {
  constructor(private el: ElementRef) { }

  ngOnInit() {

  }
  public userChange(val){
  }

}

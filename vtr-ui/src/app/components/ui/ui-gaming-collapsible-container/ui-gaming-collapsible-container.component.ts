import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'vtr-ui-gaming-collapsible-container',
  templateUrl: './ui-gaming-collapsible-container.component.html',
  styleUrls: ['./ui-gaming-collapsible-container.component.scss']
})
export class UiGamingCollapsibleContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(".select-box").click(function(){
      $(".select-box .dropdown-menu").toggleClass("show");
    });

    $(".select-box .dropdown-item").click(function(){
      var selected_item = $(this).text();
      $(".select-box .dropdown-toggle span").text(selected_item);
      $(".select-box .dropdown-menu li").removeClass("selected");
      $(this).parent().addClass("selected");
    });
  }

}

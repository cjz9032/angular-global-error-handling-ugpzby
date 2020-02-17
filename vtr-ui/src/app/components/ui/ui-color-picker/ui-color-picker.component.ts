import { Component, OnInit, Input, Output,	EventEmitter, OnChanges, ElementRef, HostListener } from '@angular/core';
import { LightingDataList } from 'src/app/data-models/gaming/lighting-new-version/lighting-data-list';

@Component({
  selector: 'vtr-ui-color-picker',
  templateUrl: './ui-color-picker.component.html',
  styleUrls: ['./ui-color-picker.component.scss'],
  host: {
		'(document:click)': 'generalClick($event)'
	}
})
export class UiColorPickerComponent implements OnInit , OnChanges {
  @Input() isColorPicker:boolean;
  @Input() color:any;
  @Output() isToggleColorPicker = new EventEmitter<any>();
  @Output() setColor = new EventEmitter<any>();
  public isTogglePresetColor:boolean = true;
  public isToggleMoreColor:boolean = false;
  public presetColorList:any = new LightingDataList().presetColorListData;
  public isSliderOut:boolean;
  public clickEvent:any = {target:""};
  public isFirstTrigger:boolean;

  @HostListener('window:resize', ['$event']) onResize($event) {
    console.log("resize--------------------")
    this.isColorPicker = false;
    this.isToggleColorPicker.emit(this.isColorPicker);
  }
  
  constructor(private elementRef: ElementRef,) { 
    if (document.getElementById('menu-main-btn-navbar-toggler')) {
			document.getElementById('menu-main-btn-navbar-toggler').addEventListener('click', (event) => {
				this.generalClick(event);
			});
		}
  }

  ngOnInit() {
    this.presetColorList.forEach((element,index) => {
      if(this.color === element.color){
        this.presetColorList[index].isChecked = true;
      }
    });
  }
  
  ngOnChanges(changes){
     console.log("changes----------------->",changes);
  }

  public colorChange(index){
    this.presetColorList.forEach(element => {
        element.isChecked = false;
    });
    this.presetColorList[index].isChecked = true;
    this.isColorPicker = false;
    this.isToggleColorPicker.emit(this.isColorPicker);
    this.setColor.emit(this.presetColorList[index].color);
  }

  //apply
  public colorPickerSelectFun(){
     console.log("apply--------------------->");
     this.setColor.emit(this.color);
     this.isColorPicker = false;
     this.isToggleColorPicker.emit(this.isColorPicker);
  }

  //cancel
  public colorPickerCancelFun(){
    console.log("COLOR CANCEL------------------>");
    this.isColorPicker = false;
    this.isToggleColorPicker.emit(this.isColorPicker);
  }

  public moreColorFun(){
    this.isTogglePresetColor = false;
    this.isToggleMoreColor = true;
  }

  public colorPickerChangeFun(event){
    this.color = this.rgbToHex(event);
  }
 
  public colorPresetFun(){
    this.isColorPicker = true;
  }
  
  public rgbToHex(color){
      let value;
      let arr = color.split(',');
      let r = +arr[0].split('(')[1];
      let g = +arr[1];
      let b = +arr[2].split(')')[0];
      value = (1 << 24) + r * (1 << 16) + g * (1 << 8) + b;
      value = value.toString(16);
      return value.slice(1);
  }

  public cpSliderDragEndFun(event){
    console.log("event=--===============",event);
    if(this.clickEvent.target !== ""){
      if(this.elementRef.nativeElement){
        if(!this.elementRef.nativeElement.contains(this.clickEvent.target) && this.isFirstTrigger){
          this.isSliderOut = true;
          this.isFirstTrigger = false;
        }
      }
    }
  }

  public generalClick(event: Event) {
    console.log("%%%%%%%%%%%%%%%-------------",event);
    this.clickEvent = event;
    this.isFirstTrigger = true;
		if (this.elementRef.nativeElement) {
			if (!this.elementRef.nativeElement.contains(event.target)) {
        setTimeout(() => {
          if(this.isSliderOut){
            console.log("yes -------------- yes --------")
            this.isColorPicker = true;
            this.isSliderOut = false;
          }else{
            console.log("no-----------------no --------")
            this.isColorPicker = false;
            this.isToggleColorPicker.emit(this.isColorPicker);
          }
        },50)
			}
		}
	}

}

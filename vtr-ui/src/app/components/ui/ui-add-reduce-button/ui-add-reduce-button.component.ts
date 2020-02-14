import { Component, OnInit, Input, Output,	EventEmitter, } from '@angular/core';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'vtr-ui-add-reduce-button',
  templateUrl: './ui-add-reduce-button.component.html',
  styleUrls: ['./ui-add-reduce-button.component.scss']
})
export class UiAddReduceButtonComponent implements OnInit {
  @Input() value:number;
  @Input() minData:number;
  @Input() maxData:number;
  @Input() step:number;
  @Input() unit:string;
  @Input() btnWidth:string = '33.3%';
  @Input() isValChange:boolean = true;
  @Output() setVal = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.value = Number(this.value);
    this.minData = Number(this.minData);
    this.maxData = Number(this.maxData);
    this.step = Number(this.step);
  }
  public calculate(num1,num2,type){
      let sq1,sq2,m;
      try {
          sq1 = num1.toString().split(".")[1].length;
      }
      catch (e) {
          sq1 = 0;
      }
      try {
          sq2 = num2.toString().split(".")[1].length;
      }
      catch (e) {
          sq2 = 0;
      }
      m = Math.pow(10,Math.max(sq1, sq2));
      
      if(type){
        console.log('this.value---add----------------------',this.value,this.step, this.value * m,this.step * m,(this.value * m + this.step * m),(this.value * m - this.step * m) / m)
        console.log('this.value---add----------------------',this.value,this.step, Math.round(this.value * m),Math.round(num2 * m),(Math.round(num1 * m) + Math.round(num2 * m)),(Math.round(num1 * m) + Math.round(num2 * m)) / m)
          return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
      }else{
        console.log('this.value---reduce----------------------',this.value,this.step, this.value * m,this.step * m,(this.value * m - this.step * m),(this.value * m - this.step * m) / m)
        console.log('this.value---add----------------------',this.value,this.step, Math.round(this.value * m),Math.round(num2 * m),(Math.round(num1 * m) - Math.round(num2 * m)),(Math.round(num1 * m) - Math.round(num2 * m)) / m)
          return (Math.round(num1 * m) - Math.round(num2 * m)) / m;
      }
      
  }
  public reduceFn(){
      if(this.value == this.minData){
          return;
      }
      if(this.isValChange){
        this.value = this.calculate(this.value,this.step,false);
      }
    //   this.value = this.calculate(this.value,this.step,false);
      if(this.value <= this.minData){
          this.value = this.minData;
      }
      this.setVal.emit([this.value,1]);
      console.log('this.value-------------------------',this.value)
  }
  public addFn(){
      if(this.value == this.maxData){
          return;
      }
      if(this.isValChange){
        this.value = this.calculate(this.value,this.step,true);
      }
    //   this.value = this.calculate(this.value,this.step,true);
      if(this.value >= this.maxData){
          this.value = this.maxData;
      }
      this.setVal.emit([this.value,2]);
      console.log('this.value-------------------------',this.value)
  }
}


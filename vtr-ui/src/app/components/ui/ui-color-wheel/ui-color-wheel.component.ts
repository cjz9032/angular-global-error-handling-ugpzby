import { Component, OnInit } from '@angular/core';
import ReinventedColorWheel from "reinvented-color-wheel";
import "reinvented-color-wheel/css/reinvented-color-wheel.css";

@Component({
  selector: 'vtr-ui-color-wheel',
  templateUrl: './ui-color-wheel.component.html',
  styleUrls: ['./ui-color-wheel.component.scss']
})
export class UiColorWheelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var rgbInputs = [document.getElementById('rgb-r'), document.getElementById('rgb-g'), document.getElementById('rgb-b')]
    function set(input, value) {
      if (input !== document.activeElement) {
        input.value = value
      }
    }
    // create a new color picker
    var colorWheel = new ReinventedColorWheel({
      // appendTo is the only required property. specify the parent element of the color wheel.
      appendTo: document.getElementById("color-wheel"),

      // followings are optional properties and their default values.

      // initial color (can be specified in hsv / hsl / rgb / hex)
      //hsv: [0, 100, 100],
      // hsl: [0, 100, 50],
      rgb: [255, 0, 0],
      // hex: "#ff0000",

      // appearance
      wheelDiameter: 200,
      wheelThickness: 20,
      handleDiameter: 16,
      wheelReflectsSaturation: false,

      // handler
      onChange: function (color) {
        // the only argument is the ReinventedColorWheel instance itself.
        console.log("rgb:", color.rgb[0], color.rgb[1], color.rgb[2]);
      },
    });

    // set color in HSV / HSL / RGB / HEX
    colorWheel.rgb = [255, 128, 64];
    colorWheel.hsl = [120, 100, 50];
    colorWheel.hsv = [240, 100, 100];
    colorWheel.hex = '#888888';

    // get color in HSV / HSL / RGB / HEX
    console.log("hsv:", colorWheel.hsv[0], colorWheel.hsv[1], colorWheel.hsv[2]);
    console.log("hsl:", colorWheel.hsl[0], colorWheel.hsl[1], colorWheel.hsl[2]);
    console.log("rgb:", colorWheel.rgb[0], colorWheel.rgb[1], colorWheel.rgb[2]);
    console.log("hex:", colorWheel.hex);

    // please call redraw() after changing some appearance properties.
    colorWheel.wheelDiameter = 240;
    colorWheel.wheelThickness = 30;
    colorWheel.redraw();
  }

}

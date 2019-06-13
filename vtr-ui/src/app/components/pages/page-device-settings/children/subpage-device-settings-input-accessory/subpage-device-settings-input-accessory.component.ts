import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'vtr-subpage-device-settings-input-accessory',
  templateUrl: './subpage-device-settings-input-accessory.component.html',
  styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit {

  title = 'device.deviceSettings.inputAccessories.title';
 public keyboardShortcuts: any []= [
   {tittle:  'Fn + Tab' , description: 'enable zoom feature on high resolution displays'},
   {tittle:  'Fn + 4' , description: 'enter sleep mode'},
   {tittle:  'Fn + D' , description: 'turn on and off Privacy Guard'},
   {tittle:  'Fn + Q' , description: 'change between Performance mode and Quiet mode'},
   {tittle:  'Fn + Space' , description: 'change keyboard backlight states'}
  ];


	constructor() {	}

	ngOnInit() {}



	

}

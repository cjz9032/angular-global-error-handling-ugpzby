import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'vtr-subpage-device-settings-input-accessory',
  templateUrl: './subpage-device-settings-input-accessory.component.html',
  styleUrls: ['./subpage-device-settings-input-accessory.component.scss']
})
export class SubpageDeviceSettingsInputAccessoryComponent implements OnInit {

  title = 'device.deviceSettings.inputAccessories.title';
  public shortcutKeys: any[] = ['device.deviceSettings.inputAccessories.inputAccessory.firstKeyObj',
  'device.deviceSettings.inputAccessories.inputAccessory.secondKeyObj',
  'device.deviceSettings.inputAccessories.inputAccessory.thirdKeyObj',
  'device.deviceSettings.inputAccessories.inputAccessory.fourthKeyObj',
  'device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj',];
  

	constructor() {	}

	ngOnInit() {
  }
}

import { Component, OnInit} from '@angular/core';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';

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
  'device.deviceSettings.inputAccessories.inputAccessory.fifthKeyObj'];

  userDefinedKeyOptions: any[] = [{
	'title': 'Launch Lenovo',
	'value': 1
},
{
  'title': 'Open website',
  'value': 2
},
{
  'title': 'Enter text',
  'value': 3
}
];

public selectedValue: any;
public image = '';
public kbdLayoutName: any;

	constructor(private keyboardService: InputAccessoriesService) {	}

	ngOnInit() {
    this.getKeyboardCompatability();
		this.selectedValue = this.userDefinedKeyOptions[0];
  }
  public onChange(item){
	    this.selectedValue = item;
    }
    
    public getKeyboardCompatability(){
      try {
        console.log('keyboard manager entered', this.keyboardService.isShellAvailable);
        if (this.keyboardService.isShellAvailable) {
          this.keyboardService.GetKeyboardMapCapability().then((value: any) => {
              console.log('keyboard compatability here -------------.>', value);
              if(value){
                  this.getKBDLayoutName();
              }
            })
            .catch(error => {
              console.error('keyboard compatability error here', error);
            });			
        }
      } catch (error) {
        console.error(error.message);
      }      
    }


    public getKBDLayoutName(){
      try {
        if (this.keyboardService.isShellAvailable) {
          this.keyboardService.GetKBDLayoutName().then((value: any) => {
            this.kbdLayoutName = value;
              //console.log('keyboard Layout name here @@@@@@@@@@@@@@.>', value);  
              if(value){
                this.getKBDMachineType(value);
            }            
            })
            .catch(error => {
              console.error('keyboard Layout name error here', error);
            });			
        }
      } catch (error) {
        console.error(error.message);
      }      
    }

    public getKBDMachineType(layOutName){
      try {
        if (this.keyboardService.isShellAvailable) {
          this.keyboardService.GetKBDMachineType().then((value: any) => {
              //console.log('keyboard Layout name here ************.>', value); 
                    this.getKeyboardMap(layOutName, value);
                    this.getAdditionalCapabilities();
            })
            .catch(error => {
              console.error('keyboard Layout name error here', error);
            });			
        }
      } catch (error) {
        console.error(error.message);
      }      
    }
    
    public getKeyboardMap(layOutName, machineType){
      //console.log('---------------->',layOutName, machineType);
      let type = machineType.toLowerCase( );
      //console.log('---------------->',type);

      this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
      switch (layOutName) {
        case "Standered":
          if(type == 'other'){

            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
            return this.image
          }else{
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Standered.png';
            return this.image
          }
          break;
        case "Belgium":
          if(type == 'other'){
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Belgium.png';
            return this.image
          }else{
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Belgium.png';
            return this.image
          }         
           break;
        case "French":
          if(type == 'other'){

            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French.png';
            return this.image
          }else{
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French.png';
            return this.image
          }         
           break;
        case "French_Canadian":
          if(type == 'other'){
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/French_Canadian.png';
            return this.image
          }else{
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/French_Canadian.png';
            return this.image
          }     
               break;
        case "German":
          if(type == 'other'){
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/German.png';
            return this.image
          }else{
            this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/German.png';
            return this.image
          }          
          break;
          case "Italian":
            if(type == 'other'){
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Italian.png';
            return this.image
            }else{
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Italian.png';
            return this.image
            }            
            break;
          case "Spanish":
            if(type == 'other'){
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Spanish.png';
              return this.image
            }else{
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Spanish.png';
              return this.image
            }            
            break;
          case "Turkish_":
            if(type == 'other'){
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Turkish_F.png';
              return this.image
            }else{
              this.image = 'assets/images/keyboard-images/KeyboardMap_Images/GrafEvo/Turkish_F.png';
              return this.image
            }            
              break;
        default:
          this.image = 'assets/images/keyboard-images/KeyboardMap_Images/Standered.png';
      }
    }

    public getAdditionalCapabilities(){

      try {
        if (this.keyboardService.isShellAvailable) {
          this.keyboardService.GetKbdHiddenKeyPrivacyFilterCapability().then((value: any) => {
           // console.log('privacy value  here -------------.>', value);
             }); 
          this.keyboardService.GetKbdHiddenKeyBackLightCapability().then((value: any) => { 
            //console.log('Backlight value  here -------------.>', value);
            });
          this.keyboardService.GetKbdHiddenKeyMagnifierCapability().then((value: any) => { 
           // console.log('Magnifier value  here -------------.>', value);
            });
          this.keyboardService.GetKbdHiddenKeyPerformanceModeCapability().then((value: any) => {
           // console.log('Performance mode here -------------.>', value);
             });          	
        }
      } catch (error) {
        console.error(error.message);
      }  

    }
}

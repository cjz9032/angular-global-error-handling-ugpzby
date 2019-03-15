import { Injectable } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private microphone: any;
  private dolby: any;
  private smartSettings: any;
  public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
    this.microphone = shellService.getMicrophoneSettings();
    this.dolby = shellService.getDolbySettings();
    this.smartSettings = shellService.getSmartSettings();
    //&& this.dolby && this.smartSettings
		if (this.microphone ) {
			this.isShellAvailable = true;
		}
  }

  setMicrophoneVolume(volumn: number): Promise<boolean> {
    if (this.isShellAvailable) {
      return this.microphone.setMicrophoneVolume(volumn);
    }
    return undefined;
  }

  //TODO: We need to remove this as we have to use dashboard.setMicphoneStatus
  setMicophoneOnMute(isAvailable: boolean): Promise<boolean> {
    if (this.isShellAvailable) {
      return this.microphone.setMicophoneMute(isAvailable);
    }
    return undefined;
  }

  setDolbyOnOff(onOff: boolean): Promise<boolean> {
    if (this.isShellAvailable) {
      return this.microphone.setDolbyFeatureStatus(onOff);
    }
    return undefined;
  }

  setSuppressKeyboardNoise(onOff: boolean): Promise<boolean> {
    if (this.isShellAvailable) {
      return this.microphone.setMicrophoneKeyboardNoiseSuppression(onOff);
    }
    return undefined;
  }

  setMicrophoneAEC(onOff: boolean): Promise<boolean> {
    if (this.isShellAvailable) {
      return this.microphone.setMicrophoneAEC(onOff);
    }
    return undefined;
  }

}

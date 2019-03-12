import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AndroidService {

  private android = (<any> window).Android;

  constructor() { }

  private showToast(message: string) {
    this.android.showToast(message);
  }

  public getAndroidDeviceLanguage(): string {
    return this.android.getDeviceLanguage();
  }

  public getAndroidVersion(): string {
    return this.android.getVersion();
  }
}

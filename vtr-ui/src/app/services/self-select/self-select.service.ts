import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
  providedIn: 'root'
})
export class SelfSelectService {
	public interests = [
		{label: 'games', checked: false},
		{label: 'news', checked: false},
		{label: 'entertainment', checked: false},
		{label: 'technology', checked: false},
		{label: 'sports', checked: false},
		{label: 'arts', checked: false},
		{label: 'regionalNews', checked: false},
		{label: 'politics', checked: false},
		{label: 'music', checked: false},
		{label: 'science', checked: false},
	];

  private selfSelect: any;

  constructor(private vantageShellService: VantageShellService,) {
	this.selfSelect = this.vantageShellService.getSelfSelect();
  }

  public getConfig() {
	if (this.selfSelect) {
	return this.selfSelect.getConfig();
	}
  }

  public updateConfig(config: SelfSelectConfig) {
	if (this.updateConfig) {
	return this.selfSelect.updateConfig(config);
	}
  }
}

export class SelfSelectConfig {
	public customtags?: string;
	public segment?: string;
	public smbRole?: string;
}

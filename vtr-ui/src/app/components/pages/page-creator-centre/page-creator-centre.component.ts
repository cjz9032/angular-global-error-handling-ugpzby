import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'vtr-page-creator-centre',
  templateUrl: './page-creator-centre.component.html',
  styleUrls: ['./page-creator-centre.component.scss']
})
export class PageCreatorCentreComponent implements OnInit {

  @ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;

  constructor(
	  private translate: TranslateService,
	  private commonService: CommonService,
	  private deviceService: DeviceService
  ) {}

  routerSubscription: Subscription;
  activeElement: HTMLElement;
  title = 'Creator Centre';
  back = 'BACK';
  backarrow = '< ';
  parentPath = 'smb/creator-centre';
  private router: Router;
  menuItems = [];

  ngOnInit(): void {
	this.getMachineInfo();
    this.routerSubscription = this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
		});
  }

  getMachineInfo(){
	  this.deviceService.getMachineInfo().then(()=>{
		if(this.deviceService.supportCreatorSettings){
			this.menuItems = this.commonService.addToObjectsList(this.menuItems,
				{
					id: 'creator-settings',
					label: 'smb.creatorCentre.creatorSettings.title',
					path: 'creator-settings',
					subitems: [],
					active: false,
					}
				);
		}
		if(this.deviceService.supportEasyRendering){
			this.menuItems = this.commonService.addToObjectsList(this.menuItems,
				{
					id: 'easy-rendering',
					label: 'smb.creatorCentre.easyRendering.title',
					path: 'easy-rendering',
					subitems: [],
					active: false,
				}
			);
		}
		if(this.deviceService.supportColorCalibration){
			this.menuItems = this.commonService.addToObjectsList(this.menuItems,
				{
					id: 'color-calibration',
					label: 'smb.creatorCentre.colorCalibration.title',
					path: 'color-calibration',
					subitems: [],
					active: false,
				}
			);
		}
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
		});
	});
  }

  onRouteActivate($event, hsRouterOutlet: HTMLElement) {
		// On route change , change foucs to immediate next below first tabindex on route change response
		this.activeElement = document.activeElement as HTMLElement;
	}

}

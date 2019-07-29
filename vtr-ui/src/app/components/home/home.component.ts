import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor(public deviceService: DeviceService, private router: Router) { }

	ngOnInit() {
		this.deviceService.getMachineInfo().then(info => {
			this.vantageLaunch(info);
		});
	}

	/**
	  * @param info: The machine info object.
	  * @summary will launch the application based on the machine info
	  */
	public vantageLaunch(info: any) {
		try {
			console.log(`INFO of the machine ====>`, info);
			if (info && info.isGaming) {
				this.router.navigate(['/device-gaming']);
			} else {
				this.router.navigate(['/dashboard']);
			}
		} catch (err) {
			console.log(`ERROR in vantageLaunch() of home.component`, err);
		}
	}
}

import {
	Component,
	OnInit,
	Input,
	HostListener
} from '@angular/core';
import {
	NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	CommonService
} from 'src/app/services/common/common.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, WinRT } from '@lenovo/tan-client-bridge';
import * as Phoenix from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit {
	containerPage: number;
	switchPage: number;
	isLenovoIdLogin: boolean;
	indicatorList: Array<any>;
	url = 'ms-settings:privacy-location';
	showPageFour: boolean = false;
	hasSystemPermissionShowed: boolean;
	isLocationServiceOn: boolean;
	chs: Phoenix.ConnectedHomeSecurity;
	permission: any;
	constructor(
		public activeModal: NgbActiveModal,
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshPage();
	}

	ngOnInit() {
		this.refreshPage();
	}

	refreshPage() {
		if (this.hasSystemPermissionShowed) {
			this.permission.requestPermission('geoLocatorStatus').then((status) => {
				this.isLocationServiceOn = status;
			});
		}
		if (this.switchPage === 4) {
			this.showPageFour = true;
		} else {
			this.showPageFour = this.isLocationServiceOn ? false : true;
		}
		this.indicatorList = new Array(this.containerPage);
	}

	closeModal() {
		this.activeModal.close('close');
	}

	next(switchPage) {
		if (switchPage < this.containerPage) {
			this.switchPage = switchPage + 1;
		}
	}

	prev(switchPage) {
		if (switchPage > 0) {
			this.switchPage = switchPage - 1;
		}
	}

	selected(num) {
		this.switchPage = num + 1;
	}

	public onOkClick($event: any) {
		if (!this.hasSystemPermissionShowed) {
			this.permission.requestPermission('geoLocatorStatus').then((status) => {
				this.isLocationServiceOn = status;
			});
		} else {
			WinRT.launchUri(this.url);
			this.permission.requestPermission('geoLocatorStatus').then((status) => {
				this.isLocationServiceOn = status;
			});
		}
	}
}

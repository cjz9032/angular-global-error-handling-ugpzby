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
	LocalStorageKey
} from 'src/app/enums/local-storage-key.enum';
import {
	CommonService
} from 'src/app/services/common/common.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, WinRT } from '@lenovo/tan-client-bridge';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit {
	containerPage: number;
	isLocationServiceOn: boolean = false;
	switchPage = 1;
	idLenovoIdLogin: boolean = false;
	itemsList: Array<any>;
	url: string = 'ms-settings:privacy-location';
	// wfData: phoenix.WifiSecurity;
	constructor(
		public activeModal: NgbActiveModal,
		private vantageShellService: VantageShellService,
		private commonService: CommonService
	) {	}

	@HostListener('window: focus')
	onFocus(): void {
		// this.wfData.refresh();
	}

	ngOnInit() {
		this.getSwitchPage();
		this.itemsList = new Array(this.containerPage);
	}

	closeModal() {
		this.activeModal.close('close');
	}

	next(switchPage) {
		if (switchPage < this.containerPage) {
			this.switchPage = switchPage + 1;
		}
	}

	getContainerPage(isLocationServiceOn, idLenovoIdLogin) {
		if (!isLocationServiceOn && !idLenovoIdLogin) {
			this.containerPage = 4;
		} else if (!isLocationServiceOn || !this.idLenovoIdLogin) {
			this.containerPage = 3;
		} else {
			this.containerPage = 2;
		}
	}

	getSwitchPage() {
		const showW: number = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome);
		this.getContainerPage(this.isLocationServiceOn, this.idLenovoIdLogin);
		if (showW < 3) {
			this.switchPage = 1;
		} else {
			if (!this.isLocationServiceOn) {
				this.switchPage = 4;
			} else {
				this.closeModal();
			}
		}
	}

	selected(num) {
		this.switchPage = num + 1;
	}

	public onOkClick($event: any) {
		this.activeModal.close(true);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'yes');
		WinRT.launchUri(this.url);
		// this.okHandler();
	}
}

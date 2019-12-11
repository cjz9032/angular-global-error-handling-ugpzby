import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { MetricService } from 'src/app/services/metric/metric.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';

@Component({
	selector: 'vtr-modal-wifi-security-invitation',
	templateUrl: './modal-wifi-security-invitation.component.html',
	styleUrls: ['./modal-Wifi-security-invitation.component.scss']
})
export class ModalWifiSecurityInvitationComponent implements OnInit {

	chs: ConnectedHomeSecurity;

	header = 'security.homeprotection.invitationcode.joinFamilyAccount';
	headerDescription = 'security.homeprotection.invitationcode.joinChs';
	description = 'security.homeprotection.invitationcode.enterCode';

	OkText = 'security.homeprotection.invitationcode.continue';
	CancelText = 'security.homeprotection.invitationcode.cancel';
	metricsParent = 'HomeSecurity';

	startJoin = false;
	joinSuccess = false;
	joinFailed = false;
	isFocusIn = false;

	constructor(
		public activeModal: NgbActiveModal,
		vantageShellService: VantageShellService,
		public metrics: MetricService,
		public metricsTranslateService: MetricsTranslateService) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
	}

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}

	KeyPress(e) {
		const value = e.target.value.replace(/[^0-9a-zA-Z]+/ig, '');
		e.target.value = value;
	}

	joinGroupBy(code: any) {
		if (!(code.length === 6)) {
			return;
		}
		code = code.toUpperCase();
		this.startJoin = true;
		this.joinSuccess = false;
		this.joinFailed = false;
		const metricsData = {
			ItemParent: this.metricsParent,
			ItemName: this.metricsTranslateService.translate('CHSInvitationConnectFailed'),
			ItemType: 'FeatureClick'
		};
		if (this.chs) {
			this.chs.joinAccount(code)
				.then((response) => {
					this.startJoin = false;
					if (response.result === 'Success') {
						this.joinSuccess = true;
						metricsData.ItemName = this.metricsTranslateService.translate('CHSInvitationConnectSuccess');
						setTimeout(() => {
							this.closeModal();
						}, 3000);
					} else {
						this.joinFailed = true;
					}
				}).catch((err) => {
					this.startJoin = false;
					this.joinFailed = true;
				}).finally(() => {
					this.metrics.sendMetrics(metricsData);
				});
		} else {
			this.startJoin = false;
			this.joinFailed = true;
			this.metrics.sendMetrics(metricsData);
		}
	}

	onCancelClick($event: any) {
		this.activeModal.close(false);
	}

	show() {
		const show: HTMLElement = document.querySelector('.activation');
		show.style.visibility = 'visible';
	}

	focusIn() {
		if (!this.joinFailed) {
			this.isFocusIn = true;
		}
	}

	focusOut() {
		this.isFocusIn = false;
	}


	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.wifi-security-location-modal') as HTMLElement;
		modal.focus();
	}
}

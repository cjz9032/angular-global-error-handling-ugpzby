import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { MetricsTranslateService } from 'src/app/services/mertics-traslate/metrics-translate.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from 'src/app/services/common/common.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';

@Component({
	selector: 'vtr-modal-wifi-security-invitation',
	templateUrl: './modal-wifi-security-invitation.component.html',
	styleUrls: ['./modal-wifi-security-invitation.component.scss']
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
	disabledInput = false;
	isOnline = true;
	notificationSubscription: Subscription;

	@ViewChild('domInput') domInput: ElementRef;
	@ViewChild('connectingMsg') connectingMsg: ElementRef;
	@ViewChild('successMsg') successMsg: ElementRef;

	constructor(
		public activeModal: NgbActiveModal,
		private vantageShellService: VantageShellService,
		public metrics: MetricService,
		public metricsTranslateService: MetricsTranslateService,
		private commonService: CommonService) {
	}

	ngOnInit() {
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
			if (this.isOnline == false) {
				this.domInput.nativeElement.value = '';
				this.disabledInput = true;
				this.focusOut();
			}
		});
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
		setTimeout(() => {
			this.connectingMsg.nativeElement.focus();
		}, 0)
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
							this.successMsg.nativeElement.focus();
						}, 0);
						setTimeout(() => {
							this.closeModal();
						}, 3000);
					} else {
						this.joinFailed = true;
					}
				}).catch((err) => {
					this.startJoin = false;
					this.joinFailed = true;
					setTimeout(()=>{
						this.domInput.nativeElement.focus();
					}, 0)
				}).finally(() => {
					this.metrics.sendMetrics(metricsData);
				});
		} else {
			this.startJoin = false;
			this.joinFailed = true;
			this.metrics.sendMetrics(metricsData);
			setTimeout(()=>{
				this.domInput.nativeElement.focus();
			}, 0)
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

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

	ngOnDestroy() {
		this.notificationSubscription.unsubscribe();
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.wifi-security-location-modal') as HTMLElement;
		modal.focus();
	}
}

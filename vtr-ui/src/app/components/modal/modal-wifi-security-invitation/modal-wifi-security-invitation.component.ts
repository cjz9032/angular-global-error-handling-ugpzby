import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { MatDialogRef } from '@lenovo/material/dialog';
import { FormControl, ValidatorFn } from '@angular/forms';

@Component({
	selector: 'vtr-modal-wifi-security-invitation',
	templateUrl: './modal-wifi-security-invitation.component.html',
	styleUrls: ['./modal-wifi-security-invitation.component.scss'],
})
export class ModalWifiSecurityInvitationComponent implements OnInit {
	@ViewChild('domInput') domInput: ElementRef;
	@ViewChild('connectingMsg') connectingMsg: ElementRef;
	@ViewChild('successMsg') successMsg: ElementRef;

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

	failedInfo = 'security.homeprotection.invitationcode.fail';
	invitationCode = '';
	invitationForm = new FormControl('', this.validateCode());

	constructor(
		private vantageShellService: VantageShellService,
		public metrics: MetricService,
		public dialogRef: MatDialogRef<ModalWifiSecurityInvitationComponent>
	) {}

	ngOnInit() {
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
	}

	KeyPress(e) {
		const value = e.target.value.replace(/[^0-9a-zA-Z]+/gi, '');
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
		}, 0);
		this.joinSuccess = false;
		this.joinFailed = false;
		const metricsData = {
			ItemParent: this.metricsParent,
			ItemName: 'CHSInvitationConnectFailed',
			ItemType: 'FeatureClick',
		};
		if (this.chs) {
			this.chs
				.joinAccount(code)
				.then((response) => {
					this.startJoin = false;
					if (response.result === 'Success') {
						this.joinSuccess = true;
						metricsData.ItemName = 'CHSInvitationConnectSuccess';
						setTimeout(() => {
							this.successMsg.nativeElement.focus();
						}, 0);
						setTimeout(() => {
							this.dialogRef.close();
						}, 3000);
					} else {
						this.joinFailed = true;
					}
				})
				.catch((err) => {
					this.startJoin = false;
					this.joinFailed = true;
					setTimeout(() => {
						this.domInput.nativeElement.focus();
					}, 0);
				})
				.finally(() => {
					this.metrics.sendMetrics(metricsData);
				});
		} else {
			this.startJoin = false;
			this.joinFailed = true;
			this.metrics.sendMetrics(metricsData);
			setTimeout(() => {
				this.domInput.nativeElement.focus();
			}, 0);
		}
	}

	validateCode(): ValidatorFn {
		return (): { [key: string]: boolean } | null => {
			if (!this.joinFailed) {
				return null;
			}
			return {
				invalidateCode: true,
			};
		};
	}
}

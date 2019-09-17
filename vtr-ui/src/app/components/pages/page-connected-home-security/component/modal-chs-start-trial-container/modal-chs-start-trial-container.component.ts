import { Component,	OnInit,	OnDestroy } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { CHSTrialModalPage } from 'src/app/enums/home-security-modal-trial-page.enum';

@Component({
	selector: 'vtr-modal-chs-start-trial-container',
	templateUrl: './modal-chs-start-trial-container.component.html',
	styleUrls: ['./modal-chs-start-trial-container.component.scss']
})
export class ModalChsStartTrialContainerComponent implements OnInit, OnDestroy {
	chs: Phoenix.ConnectedHomeSecurity;
	metricsParent = 'ConnectedHomeSecurity';
	countdownNumber = 3;
	subscribe: Subscription;
	consoleUrlCallback;
	showWhichPage: CHSTrialModalPage;
	loadingText: string;

	constructor(
		public activeModal: NgbActiveModal,
		private vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService,
	) {	}

	ngOnInit() {
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.consoleUrlCallback = (data) => {
			if (data.account.consoleUrl) {
				this.showWhichPage = CHSTrialModalPage.trial;
				this.countdown();
			}
		};
		if (this.showWhichPage === CHSTrialModalPage.loading) {
			this.loadingText = 'security.homeprotection.invitationcode.connecting';
			if (this.chs.account.consoleUrl) {
				this.showWhichPage = CHSTrialModalPage.trial;
				this.countdown();
			} else {
				this.chs.on(EventTypes.chsEvent, this.consoleUrlCallback);
			}
		}
	}

	closeModal() {
		this.activeModal.close();
	}

	disconnect() {
		this.showWhichPage = CHSTrialModalPage.loading;
		this.loadingText = 'homeSecurity.modal.disconnecting';
		this.chs.quitAccount().then((response) => {
			if (response === 'success') {
				this.closeModal();
			}
		}).catch((err) => {
			console.log(`disconnected error: ${err}`);
		});
	}

	ngOnDestroy() {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
		this.chs.off(EventTypes.chsEvent, this.consoleUrlCallback);
	}

	openCornet() {
		this.chs.visitWebConsole();
		this.closeModal();
	}

	countdown() {
		const numbers = interval(1000);
		const takeNumbers = numbers.pipe(take(3));
		this.subscribe = takeNumbers.subscribe( x => {
			this.countdownNumber = (3 - x - 1);
			if (this.countdownNumber === 0) {
				this.openCornet();
			}
		});
	}

}

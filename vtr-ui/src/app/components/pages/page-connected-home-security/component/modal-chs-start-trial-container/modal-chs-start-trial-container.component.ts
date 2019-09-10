import { Component,	OnInit,	OnDestroy } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
	selector: 'vtr-modal-chs-start-trial-container',
	templateUrl: './modal-chs-start-trial-container.component.html',
	styleUrls: ['./modal-chs-start-trial-container.component.scss']
})
export class ModalChsStartTrialContainerComponent implements OnInit, OnDestroy {
	chs: Phoenix.ConnectedHomeSecurity;
	metricsParent = 'ConnectedHomeSecurity';
	switchPage = 1;
	countdownNumber = 3;
	subscribe: Subscription;

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

		if (this.switchPage === 1) {
			this.countdown();
		}
	}

	closeModal() {
		this.activeModal.close();
	}

	disconnect() {

	}

	ngOnDestroy() {
		if (this.subscribe) {
			this.subscribe.unsubscribe();
		}
	}

	openCornet(feature?: string) {
		this.chs.visitWebConsole(feature);
		this.closeModal();
	}

	countdown() {
		const numbers = interval(1000);
		const takeNumbers = numbers.pipe(take(3));
		this.subscribe = takeNumbers.subscribe( x => {
			this.countdownNumber = (3 - x - 1);
			if (this.countdownNumber === 0) {
				this.openCornet('login');
				this.closeModal();
			}
		});
	}

}

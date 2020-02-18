import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Component({
	selector: 'vtr-modal-gaming-legionedge',
	templateUrl: './modal-gaming-legionedge.component.html',
	styleUrls: ['./modal-gaming-legionedge.component.scss']
})
export class ModalGamingLegionedgeComponent implements OnInit {

	liteGaming = false;
	desktopMachine = false;
	constructor(
		public activeModal: NgbActiveModal,
		private commonService: CommonService,
	) { 
		this.desktopMachine = this.commonService.getLocalStorageValue( LocalStorageKey.desktopType);
		this.liteGaming = this.commonService.getLocalStorageValue( LocalStorageKey.liteGaming);
	}

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('window: focus')
	onFocus(): void {
		const modal = document.querySelector('.gaming-help-modal') as HTMLElement;
		modal.focus();
	}
}

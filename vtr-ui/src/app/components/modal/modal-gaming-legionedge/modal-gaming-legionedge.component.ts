import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-modal-gaming-legionedge',
	templateUrl: './modal-gaming-legionedge.component.html',
	styleUrls: ['./modal-gaming-legionedge.component.scss'],
})
export class ModalGamingLegionedgeComponent implements OnInit {
	liteGaming = false;
	desktopMachine = false;
	constructor(public activeModal: NgbActiveModal, private localCacheService: LocalCacheService) {
		this.desktopMachine = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.desktopType
		);
		this.liteGaming = this.localCacheService.getLocalCacheValue(LocalStorageKey.liteGaming);
	}

	@HostListener('window: focus') onFocus(): void {
		const modal = document.querySelector('.gaming-help-modal') as HTMLElement;
		modal.focus();
	}

	ngOnInit() {}

	closeModal() {
		this.activeModal.close('close');
	}
}

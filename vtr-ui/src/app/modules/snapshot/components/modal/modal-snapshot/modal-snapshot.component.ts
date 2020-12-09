import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-modal-snapshot',
	templateUrl: './modal-snapshot.component.html',
	styleUrls: ['./modal-snapshot.component.scss'],
})
export class ModalSnapshotComponent implements OnInit {
	@Input() componentId: string;
	@Input() snapshotInfo: any;

	public snapshotModulesInfo: any = [];

	public errorMessage: boolean = false;
	private isSuccessful = false;

	@Output() passEntry: EventEmitter<any> = new EventEmitter();

	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	constructor(public activeModal: NgbActiveModal) {}

	// Used to close modal when press 'ESC' key
	@HostListener('document:keydown', ['$event'])
	onKeyDownHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	}

	ngOnInit(): void {
		Object.entries(this.snapshotInfo).forEach(([key, value]) => {
			const environment = {
				name: key,
				modules: (name == 'hardwareListTitle') ? this.getHardwareListModules(value) : this.getSoftwareListModules(value),
				collapsed: false,
				selected: false,
				indeterminate: false
			}

			this.snapshotModulesInfo.push(environment);
		});
	}

	private getHardwareListModules(modules: any) : any {
		let hardwareListModules: any = [];

		Object.entries(modules).forEach(([key, value]) => {
			const module = {
				name: key,
				selected: false
			}

			hardwareListModules.push(module);
		});

		return hardwareListModules;
	}

	private getSoftwareListModules(modules: any) : any {
		let softwareListModules: any = [];

		Object.entries(modules).forEach(([key, value]) => {
			const module = {
				name: key,
				selected: false
			}

			softwareListModules.push(module);
		});

		return softwareListModules;
	}

	public ngOnDestroy() {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		const leastOneSelected = this.snapshotModulesInfo.find((x) => x.selected || x.indeterminate);
		if (leastOneSelected !== undefined) {
			this.isSuccessful = true;
			this.closeModal();
			this.passEntry.emit(this.snapshotModulesInfo);
		} else {
			this.errorMessage = true;
		}
	}

	public receiveSelect() {
		if (this.errorMessage) {
			this.errorMessage = false;
		}
	}
}

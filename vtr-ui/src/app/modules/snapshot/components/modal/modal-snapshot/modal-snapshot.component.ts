import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
	OnDestroy,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SnapshotInfo } from '../../../models/snapshot.interface';

@Component({
	selector: 'vtr-modal-snapshot',
	templateUrl: './modal-snapshot.component.html',
	styleUrls: ['./modal-snapshot.component.scss'],
})
export class ModalSnapshotComponent implements OnInit, OnDestroy {
	@Input() componentId: string;
	@Input() snapshotInfo: any;

	@Output() passEntry: EventEmitter<Array<string>> = new EventEmitter();
	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	public snapshotComponentsInfo: any = [];
	public errorMessage = false;
	private isSuccessful = false;

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
				components:
					name === 'hardwareListTitle'
						? this.getHardwareListComponents(value)
						: this.getSoftwareListComponents(value),
				collapsed: false,
				selected: false,
				indeterminate: false,
			};

			this.snapshotComponentsInfo.push(environment);
		});
	}

	ngOnDestroy(): void {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		const leastOneSelected = this.snapshotComponentsInfo.find(
			(x) => x.selected || x.indeterminate
		);
		if (leastOneSelected !== undefined) {
			this.isSuccessful = true;
			this.closeModal();
			const snapshotInfoPayload = this.getSelectedSnapshotInfoComponents(
				this.snapshotComponentsInfo
			);
			this.passEntry.emit(snapshotInfoPayload);
		} else {
			this.errorMessage = true;
		}
	}

	public receiveSelect() {
		if (this.errorMessage) {
			this.errorMessage = false;
		}
	}

	private getHardwareListComponents(components: any): any {
		const hardwareListComponents: any = [];

		components.forEach((name) => {
			const component = {
				name,
				selected: false,
			};

			hardwareListComponents.push(component);
		});

		return hardwareListComponents;
	}

	private getSoftwareListComponents(components: any): any {
		const softwareListComponents: any = [];

		components.forEach((name) => {
			const component = {
				name,
				selected: false,
			};

			softwareListComponents.push(component);
		});

		return softwareListComponents;
	}

	private getSelectedSnapshotInfoComponents(selectedModules: Array<any>): Array<string> {
		const selectedSnapshotInfoComponents: Array<string> = [];

		selectedModules.map((componentType) => {
			const componentList: Array<any> = componentType.components;

			componentList.map((component) => {
				if (component.selected) {
					const componentName = component.name;
					selectedSnapshotInfoComponents.push(componentName);
				}
			});
		});

		return selectedSnapshotInfoComponents;
	}
}

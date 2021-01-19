import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
	OnDestroy,
} from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import {
	SnapshotComponentsListByType,
	ModalSnapshotComponentItem,
} from '../../../models/snapshot.interface';

@Component({
	selector: 'vtr-modal-snapshot',
	templateUrl: './modal-snapshot.component.html',
	styleUrls: ['./modal-snapshot.component.scss'],
})
export class ModalSnapshotComponent implements OnInit {
	@Input() componentId: string;
	@Input() snapshotComponentsByType: SnapshotComponentsListByType;

	@Output() passEntry: EventEmitter<Array<string>> = new EventEmitter();

	public componentItemList: Array<ModalSnapshotComponentItem> = [];
	public errorMessage = false;
	private isSuccessful = false;

	constructor(
		private dialogRef: MatDialogRef<ModalSnapshotComponent>,
	) { }

	// Used to close modal when press 'ESC' key
	@HostListener('document:keydown', ['$event'])
	onKeyDownHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	}

	ngOnInit(): void {
		Object.entries(this.snapshotComponentsByType).forEach(([key, value]) => {
			const environment: ModalSnapshotComponentItem = {
				name: key,
				components:
					name === 'hardwareListTitle'
						? this.getHardwareListItems(value)
						: this.getSoftwareListItems(value),
				collapsed: false,
				selected: false,
				indeterminate: false,
			};

			this.componentItemList.push(environment);
		});
	}

	public closeModal() {
		this.dialogRef.close('close');
	}

	public onClickRun() {
		const leastOneSelected = this.componentItemList.some(
			(x: ModalSnapshotComponentItem) => x.selected || x.indeterminate
		);
		if (leastOneSelected) {
			this.isSuccessful = true;
			this.closeModal();
			const selectedComponents = this.getSelectedItems(this.componentItemList);
			this.passEntry.emit(selectedComponents);
		} else {
			this.errorMessage = true;
		}
	}

	public receiveSelect() {
		if (this.errorMessage) {
			this.errorMessage = false;
		}
	}

	private getHardwareListItems(components: Array<string>): Array<ModalSnapshotComponentItem> {
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

	private getSoftwareListItems(components: Array<string>): Array<ModalSnapshotComponentItem> {
		const softwareListItems: any = [];

		components.forEach((name) => {
			const component = {
				name,
				selected: false,
			};

			softwareListItems.push(component);
		});

		return softwareListItems;
	}

	private getSelectedItems(selectedItems: Array<ModalSnapshotComponentItem>): Array<string> {
		const selectedItemsList = [];

		selectedItems.forEach((componentType: ModalSnapshotComponentItem) => {
			// Get item names from items that are selected in the array
			const selectedComponents = componentType.components
				.filter((component) => component.selected)
				.map((component) => component.name);

			selectedItemsList.push(...selectedComponents);
		});

		return selectedItemsList;
	}
}

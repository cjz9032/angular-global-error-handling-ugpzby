export class UiRoundedRectangleRadioListModel {
	constructor(
		public groupName: string,
		public radioDetails: UiRoundedRectangleRadioModel[]
	){}
}

export class UiRoundedRectangleRadioModel {
	constructor(
		public componentId: string,
		public isReadOnly: boolean,
		public isChecked: boolean,
		public label: string,
	){}
}
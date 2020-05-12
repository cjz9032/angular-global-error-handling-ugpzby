export class UiRoundedRectangleRadioListModel {
	constructor(
		public groupName: string,
		public radioDetails: UiRoundedRectangleRadioModel[]
	){}
}

export class UiRoundedRectangleRadioModel {
	constructor(
		public componentId: string,
		public label: string,
		public value: string,
		public isChecked: boolean,
		public isDisabled: boolean,
	){}
}
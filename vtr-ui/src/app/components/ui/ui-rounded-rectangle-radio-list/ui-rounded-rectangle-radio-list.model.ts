export class UiRoundedRectangleRadioListModel {
	constructor(
		public groupName: string,
		public radioDetails: UiRoundedRectangleRadioModel[]
	){}
}

export class UiRoundedRectangleRadioModel {
	constructor(
		public id: number, // id is similar to primary key in DB
		public componentId: string,
		public isReadOnly: boolean,
		public isChecked: boolean
	){}
}
export class UiCircleRadioWithCheckBoxListModel {
	constructor(
		public componentId: string,
		public label: string,
		public value: string,
		public isChecked: boolean,
		public isDisabled: boolean,
		public processIcon: boolean,
		public processLabel: boolean,
		public hideIcon: boolean,
		public customIcon = '',
		public metricsItem: string,
	) { }
	public ariaLabel?: string;
}
export interface DropDownInterval {
	/**
	 * value to below placeholder when drop-down is collapsed
	 */
	name: string;
	/**
	 * actual value associated with selected item
	 */
	value: number;
	/**
	 * placeholder value to show as title when value is selected from drop-down
	 */
	placeholder: string;
	/**
	 * value to show in list when drop down is open
	 */
	text: string;
	/**
	 * value to sent in Metrics
	 */
	metricsValue: any;

}

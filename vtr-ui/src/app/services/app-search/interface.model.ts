export interface IFeatureAction {
	type: string;
}

export interface INavigationAction {
	type: string;
	menuId: string;
	route: string;
	params: string [];
}

export interface IProtocolAction {
	type: string;
	url: string;
	params: string [];
}

export interface ICustomAction {
	type: string;
	fn: (featureId: string) => void;
}

export interface IFeature {
	id: string;
	featureName: string;
	category: string;
	icon: any;
	action: IFeatureAction;
}

export enum SearchActionType {
	navigation = 'navigation',
	protocol = 'protocol',
	custom = 'customAction'
}

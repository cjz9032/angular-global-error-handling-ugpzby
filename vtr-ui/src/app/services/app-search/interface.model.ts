export interface IFeatureAction {
	type: string;
}

export interface INavigationAction extends IFeatureAction {
	menuId: string | string[];
	route: string;
	params: string[];
}

export interface IProtocolAction {
	url: string;
	params: string[];
}

export interface ICustomAction {
	fn: (featureId: string) => void;
}

export interface IFeature {
	id: string;
	categoryId: string;
	featureName: string;
	category: string;
	icon: any;
	action: IFeatureAction;
}

export enum SearchActionType {
	navigation = 'navigation',
	protocol = 'protocol',
	custom = 'customAction',
}

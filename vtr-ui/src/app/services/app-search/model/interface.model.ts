export interface INavigationAction {
	menuId?: string;
	route?: string;
	params?: object;
}
export class IProtocolAction {
	url: string;
	params?: object;
}

export interface ICustomAction {
	(feature: IFeature): void;
}

export interface IAvailableDetection {
	featureId: string;
	isAvailable: () => boolean;
}

export interface IFeature {
	id: string;
	categoryId: string;
	featureName: string;
	categoryName: string;
	highRelevantKeywords: string;
	lowRelevantKeywords: string;
	icon: any; // should be string array like ['fal', 'gem']
	action: INavigationAction | IProtocolAction | ICustomAction;
	isAvailable?: () => boolean;
}

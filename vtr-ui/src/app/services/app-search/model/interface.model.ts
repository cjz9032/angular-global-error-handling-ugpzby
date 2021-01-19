export interface INavigationAction {
	menuId?: string;
	route?: string;
	params?: Record<string, string>;
}
export class IProtocolAction {
	url: string;
	params?: Record<string, string>;
}
export interface IApplicableDetector {
	featureId: string;
	isApplicable: () => Promise<boolean>;
}

export interface IFeature {
	id: string;
	categoryId: string;
	featureName: string;
	categoryName: string;
	highRelevantKeywords: string;
	lowRelevantKeywords: string;
	icon: any; // should be string array like ['fal', 'gem']
	action: INavigationAction | IProtocolAction | ((feature: IFeature) => void);
	isApplicable?: () => Promise<boolean>;
	applicable: boolean;
}

export enum SearchResultType {
	complete = 'complete',
	timeout = 'timeout',
}

export class SearchResult {
	constructor(result: SearchResultType, features: IFeature[]) {
		this.result = result;
		this.features = features;
	}

	public result: SearchResultType;
	public features: IFeature[];
}

export const enum typeData {
	General = 'general',
	Users = 'users',
}

export interface TrackingDataSiteDescription {
	domain: string;
	favicon_url: string;
	trackers: number[];

}

export interface TrackingDataDescription {
	sites: Array<TrackingDataSiteDescription>;
	trackers: {
		[key: string]: {
			company_name: string;
			company_url: string;
			logo_url: string;
		}
	};
}

export interface TrackingData {
	typeData: typeData;
	trackingData: TrackingDataDescription;
	error: string | null;
}

export interface TrackerDetail {
	company_name: string;
	company_url: string;
	logo_url: string;
	metadata?: {
		id: number;
		name: string;
		hash: string;
		mobileCompliance: boolean;
		description: string;
		websiteURL: string;
		policyURL: string;
		adIdRotationUrl: string;
		cookieSupport: boolean;
		statIdSupport: boolean;
		endPoints: {
			id: number;
			name: string;
			url: string;
			memberId: number;
			legacy: boolean;
			csfrTokenRequired: boolean;
			nonCookieTechnology: boolean;
		}
	};
	categories: string[];
}

export interface TrackersInfo {
	sites: {
		[key: string]: {
			domain: string;
			icon: string;
			trackers: number[]
		};
	};
	trackers: {
		[key: string]: TrackerDetail;
	};
}

export interface SingleTrackersInfo {
	sites: Array<{
		domain: string;
		icon: string;
		trackers: string[]
	}>;
	tracker: TrackerDetail;
}

import { Injectable } from '@angular/core';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

interface RightCard {
	cardContent: FeatureContent;
	id: string;
	ariaLabel: string;
	type: string;
	order: number;
	show: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class ProductivityService {

	rightCards: RightCard[] = [
		{
			cardContent: {
				FeatureImage: 'assets/images/smb/lenovo-pro.jpg',
			},
			id: 'meeting-manager-card-content-A',
			ariaLabel: 'meeting-manager-card-content-A',
			type: 'subpage-corner',
			order: 1,
			show: false,
		},
		{
			cardContent: {
				FeatureImage: 'assets/images/smb/ai-meeting.jpg',
			},
			id: 'meeting-manager-card-content-B',
			ariaLabel: 'meeting-manager-card-content-B',
			type: 'subpage-corner',
			order: 2,
			show: false,
		},
	];

	constructor() { }
}

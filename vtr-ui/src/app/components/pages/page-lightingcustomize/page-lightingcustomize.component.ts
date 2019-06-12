import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';


@Component({
	selector: 'vtr-page-lightingcustomize',
	templateUrl: './page-lightingcustomize.component.html',
	styleUrls: ['./page-lightingcustomize.component.scss']
})
export class PageLightingcustomizeComponent implements OnInit {
	public currentProfileData: any;
	[x: string]: any;
	public homePage = {
		didSuccess: [
			{
				status: true
			},
			{
				status: false
			}
		],
		profileId: [
			{
				id: 0
			},
			{
				id: 1
			},
			{
				id: 2
			},
			{
				id: 3
			}
		]
	};

	public lightingPage = {
		didSuccess: [
			{
				status: true
			},
			{
				status: false
			}
		],
		profileId: 1,
		brightness: 3,
		lightInfo: [
			{
				lightPanelType: 32,
				lightEffectType: 4,
				lightColor: 'FFFFFF'
			},
			{
				lightPanelType: 64,
				lightEffectType: 2,
				lightColor: 'FF0000'
			}

		]
	};

	public lightingProfileById = {
		profileId: 1, //this value will be equal to the parameter if this function returns successfully
		brightness: 2, //the multiple profiles use the same brightness value
		lightInfo: [
			{
				lightPanelType: 32, // this value will determine the image showed for Light1,please refer the enumeration LightPanelType
				lightEffectType: 2, // the effect of specific panel, please refer the enumeration LightEffectComplexType/LightEffectSimpleType
				lightColor: 'FFFFFF' //color value, hexadecimal RGB value
			},
			{
				lightPanelType: 64, // this value will determine the image showed for Light2
				lightEffectType: 3,
				lightColor: 'FF0000'
			}
		]
	};
	public lightingProfileById2 = {
		profileId: 1, //this value will be equal to the parameter if this function returns successfully
		brightness: 4, //the multiple profiles use the same brightness value
		lightInfo: [
			{
				lightPanelType: 32, // this value will determine the image showed for Light1,please refer the enumeration LightPanelType
				lightEffectType: 4, // the effect of specific panel, please refer the enumeration LightEffectComplexType/LightEffectSimpleType
				lightColor: 'FFFFFF' //color value, hexadecimal RGB value
			},
			{
				lightPanelType: 64, // this value will determine the image showed for Light2
				lightEffectType: 2,
				lightColor: 'FF0000'
			}
		]
	};

	public lightingEffectData = {
		drop: [
			{
				curSelected: 1,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						value: 3
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 5
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 6
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 7
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 9
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 10
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 11
					}
				]
			},
			{
				curSelected: 2,
				modeType: 1,
				dropOptions: [
					{
						header: 'gaming.lightingProfile.effect.option1.title',
						name: 'gaming.lightingProfile.effect.option1.title',
						value: 1
					},
					{
						header: 'gaming.lightingProfile.effect.option2.title',
						name: 'gaming.lightingProfile.effect.option2.title',
						value: 2
					},
					{
						header: 'gaming.lightingProfile.effect.option3.title',
						name: 'gaming.lightingProfile.effect.option3.title',
						value: 3
					},
					{
						header: 'gaming.lightingProfile.effect.option4.title',
						name: 'gaming.lightingProfile.effect.option4.title',
						value: 4
					},
					{
						header: 'gaming.lightingProfile.effect.option5.title',
						name: 'gaming.lightingProfile.effect.option5.title',
						value: 5
					},
					{
						header: 'gaming.lightingProfile.effect.option6.title',
						name: 'gaming.lightingProfile.effect.option6.title',
						value: 6
					},
					{
						header: 'gaming.lightingProfile.effect.option7.title',
						name: 'gaming.lightingProfile.effect.option7.title',
						value: 7
					},
					{
						header: 'gaming.lightingProfile.effect.option8.title',
						name: 'gaming.lightingProfile.effect.option8.title',
						value: 8
					},
					{
						header: 'gaming.lightingProfile.effect.option9.title',
						name: 'gaming.lightingProfile.effect.option9.title',
						value: 9
					},
					{
						header: 'gaming.lightingProfile.effect.option10.title',
						name: 'gaming.lightingProfile.effect.option10.title',
						value: 10
					},
					{
						header: 'gaming.lightingProfile.effect.option11.title',
						name: 'gaming.lightingProfile.effect.option11.title',
						value: 11
					}
				]
			}

		]
	};

	public drop = {
		curSelected: 1,
		modeType: 1,
		dropOptions: [
			{
				header: 'gaming.lightingProfile.effect.option1.title',
				name: 'gaming.lightingProfile.effect.option1.title',
				value: 1
			},
			{
				header: 'gaming.lightingProfile.effect.option2.title',
				name: 'gaming.lightingProfile.effect.option2.title',
				value: 2
			},
			{
				header: 'gaming.lightingProfile.effect.option3.title',
				name: 'gaming.lightingProfile.effect.option3.title',
				value: 3
			},
			{
				header: 'gaming.lightingProfile.effect.option4.title',
				name: 'gaming.lightingProfile.effect.option4.title',
				value: 4
			},
			{
				header: 'gaming.lightingProfile.effect.option5.title',
				name: 'gaming.lightingProfile.effect.option5.title',
				value: 5
			},
			{
				header: 'gaming.lightingProfile.effect.option6.title',
				name: 'gaming.lightingProfile.effect.option6.title',
				value: 6
			},
			{
				header: 'gaming.lightingProfile.effect.option7.title',
				name: 'gaming.lightingProfile.effect.option7.title',
				value: 7
			},
			{
				header: 'gaming.lightingProfile.effect.option8.title',
				name: 'gaming.lightingProfile.effect.option8.title',
				value: 8
			},
			{
				header: 'gaming.lightingProfile.effect.option9.title',
				name: 'gaming.lightingProfile.effect.option9.title',
				value: 9
			},
			{
				header: 'gaming.lightingProfile.effect.option10.title',
				name: 'gaming.lightingProfile.effect.option10.title',
				value: 10
			},
			{
				header: 'gaming.lightingProfile.effect.option11.title',
				name: 'gaming.lightingProfile.effect.option11.title',
				value: 11
			}
		]
	};
	public drop1 = {
		curSelected: 1,
		modeType: 1,
		dropOptions: [
			{
				header: 'gaming.lightingProfile.effect.option1.title',
				name: 'gaming.lightingProfile.effect.option1.title',
				value: 1
			},
			{
				header: 'gaming.lightingProfile.effect.option2.title',
				name: 'gaming.lightingProfile.effect.option2.title',
				value: 2
			},
			{
				header: 'gaming.lightingProfile.effect.option3.title',
				name: 'gaming.lightingProfile.effect.option3.title',
				value: 3
			},
			{
				header: 'gaming.lightingProfile.effect.option4.title',
				name: 'gaming.lightingProfile.effect.option4.title',
				value: 4
			},
			{
				header: 'gaming.lightingProfile.effect.option5.title',
				name: 'gaming.lightingProfile.effect.option5.title',
				value: 5
			},
			{
				header: 'gaming.lightingProfile.effect.option6.title',
				name: 'gaming.lightingProfile.effect.option6.title',
				value: 6
			},
			{
				header: 'gaming.lightingProfile.effect.option7.title',
				name: 'gaming.lightingProfile.effect.option7.title',
				value: 7
			},
			{
				header: 'gaming.lightingProfile.effect.option8.title',
				name: 'gaming.lightingProfile.effect.option8.title',
				value: 8
			},
			{
				header: 'gaming.lightingProfile.effect.option9.title',
				name: 'gaming.lightingProfile.effect.option9.title',
				value: 9
			},
			{
				header: 'gaming.lightingProfile.effect.option10.title',
				name: 'gaming.lightingProfile.effect.option10.title',
				value: 10
			},
			{
				header: 'gaming.lightingProfile.effect.option11.title',
				name: 'gaming.lightingProfile.effect.option11.title',
				value: 11
			}
		]
	};
	public setProfile: any;
	// public lightingProfileById = {
	// 	profile1: {
	// 		didSuccess: [
	// 			{
	// 				status: true
	// 			},
	// 			{
	// 				status: false
	// 			}
	// 		],
	// 		profileId: 1, //this value will be equal to the parameter if this function returns successfully
	// 		brightness: 3, //the multiple profiles use the same brightness value
	// 		lightInfo: [
	// 			{
	// 				lightPanelType: 32, // this value will determine the image showed for Light1,please refer the enumeration LightPanelType
	// 				lightEffectType: 4, // the effect of specific panel, please refer the enumeration LightEffectComplexType/LightEffectSimpleType
	// 				lightColor: 'FFFFFF' //color value, hexadecimal RGB value
	// 			},
	// 			{
	// 				lightPanelType: 64, // this value will determine the image showed for Light2
	// 				lightEffectType: 2,
	// 				lightColor: 'FF0000'
	// 			}
	// 		]
	// 	 }
	// profile2: {
	// 	didSuccess: [
	// 		{
	// 			status: true
	// 		},
	// 		{
	// 			status: false
	// 		}
	// 	],
	// 	profileId: 1, //this value will be equal to the parameter if this function returns successfully
	// 	brightness: 3, //the multiple profiles use the same brightness value
	// 	lightInfo: [
	// 		{
	// 			lightPanelType: 32, // this value will determine the image showed for Light1,please refer the enumeration LightPanelType
	// 			lightEffectType: 4, // the effect of specific panel, please refer the enumeration LightEffectComplexType/LightEffectSimpleType
	// 			lightColor: 'FFFFFF' //color value, hexadecimal RGB value
	// 		},
	// 		{
	// 			lightPanelType: 64, // this value will determine the image showed for Light2
	// 			lightEffectType: 2,
	// 			lightColor: 'FF0000'
	// 		}
	// 	]
	// }
	//	};
	constructor(private cmsService: CMSService) {}

	ngOnInit() {
		this.setProfile = this.lightingProfileById;
		const queryOptions = {
			Page: 'dashboard',
			Lang: 'EN',
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then((response: any) => {
			const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-F')[0];
			if (cardContentPositionA) {
				this.cardContentPositionA = cardContentPositionA;
			}

			const cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-B')[0];
			if (cardContentPositionB) {
				this.cardContentPositionB = cardContentPositionB;
				if (this.cardContentPositionB.BrandName) {
					this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
				}
			}
		});
	}
	setDefaultProfile($event) {
		console.log('fired.....');
		this.setProfile = this.lightingProfileById2;
		this.lightingEffectData.drop[0].curSelected = this.setProfile.lightInfo[0].lightEffectType;
		this.lightingEffectData.drop[1].curSelected = this.setProfile.lightInfo[1].lightEffectType;
		this.currentProfileData = 3;
		this.lightingPage.brightness = this.setProfile.brightness;
	}
	setDefaultProfileFromLighting($event) {
		console.log('profile button clicked------------------------');
	}
}

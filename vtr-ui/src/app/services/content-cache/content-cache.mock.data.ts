import {Md5} from "ts-md5";
export class MockContentLocalCacheTest {
	public get(par) : any{

		if(par.Key === Md5.hashStr(JSON.stringify({PAGE:'normalContents'}))) {
			par.Value = JSON.stringify(NORMAL_CONTENTS);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({PAGE:'expiredDateWithPoistionB'}))){
			par.Value = JSON.stringify(EXPIRED_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({PAGE:'NotReachDisplayDateWithPoistionB'}))){
			par.Value = JSON.stringify(DISPALY_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({PAGE:'multi-ItemsInPoistionB'}))){
			par.Value = JSON.stringify(MULITI_ITEM_INPOISTIONB);
		}
		return par;
	}
}

export const NORMAL_CONTENTS = {
	"positionA": [
		{
			"Title": "Build-in article A1",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "Build-in article A2",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	],
	"positionB": [
		{
			"Title": "Build-in article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	],
	"welcome-text": [
		{
			"Id": "6cb73ba2f3914d3295467c41e7330922",
			"Title": "Looking energized today! ||| What a pleasant surprise ||| Knock, knock ||| You're off to great places! ||| Today is your day! ||| Who likes happy little trees? ||| Party on! ||| Keep calm and Vantage on ||| A bigger Vantage for your buck ||| Bring home the Vantage ||| Eat, sleep, Vantage, repeat ||| Every moment is a fresh Vantage ||| Vantage to the fullest",
			"Description": "",
			"FeatureImage": "",
			"Action": "",
			"ActionType": null,
			"ActionLink": null,
			"BrandName": "",
			"BrandImage": "",
			"Priority": null,
			"OverlayTheme": "",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	]
};

export const EXPIRED_DATE_INPOISTIONB = {
	"positionA": [
		{
			"Title": "Build-in article A1",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "Build-in article A2",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	],
	"positionB": [
		{
			"Title": "Build-in article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": "08-10-2020 04:57:20 PM"
		}
	]
};


export const DISPALY_DATE_INPOISTIONB = {
	"positionA": [
		{
			"Title": "Build-in article A1",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "Build-in article A2",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	],
	"positionB": [
		{
			"Title": "Build-in article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": "08-10-2030 04:57:20 PM",
			"ExpirationDate": null
		}
	]
};


export const MULITI_ITEM_INPOISTIONB = {
	"positionA": [
		{
			"Title": "Build-in article A1",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "Build-in article A2",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	],
	"positionB": [
		{
			"Title": "Build-in article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "local-cache article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		},
		{
			"Title": "local-cache article B",
			"Description": "",
			"FeatureImage": "assets/build-in-contents/images/Default-SMB-Device-Settings.jpg",
			"Action": "",
			"ActionType": "Build-in",
			"ActionLink": "13cada49d4274587a80e26b00dff59a5",
			"BrandName": "",
			"BrandImage": "",
			"Priority": "P1",
			"OverlayTheme": "dark",
			"DisplayStartDate": null,
			"ExpirationDate": null
		}
	]
};

import { Injectable } from '@angular/core';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import * as X2JS from 'x2js';
import { DeviceService } from '../device/device.service';
import { environment } from '../../../environments/environment';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import {v4 as uuidv4 } from 'uuid';

declare var Windows;

const SOURCE_NAME = 'windows:Lenovo:id.uap.';
const DEVICE_ID_TYPE = 'imei';
const LIDUserSettingsXml = 'LenovoID_User_Settings.xml';
const LIDOobeResponseXml = 'UAPOOBEDataResponse.xml';
const STARTER_ACCOUNT_TOKEN = 'ZAgAAAAAAA_STARTER_1.0_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

/**	LenovoIDUserSettingsXml this file is create by vantage
	{
		'Settings': {
			'SettingsVersion': '1.1',
			'Metrics': {
				'IsMetricsEnabled': 'False'
			},
			'Behaviors': {
				'DateFirstSignin': '2019-03-29T10:59:44'
			},
			'IsLenovoIDFeatureEnabled': 'True',
			'_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
		}
	}
 */
class LenovoIDUserSettingsXml {
	public Settings: Settings;
}

class Settings {
	public SettingsVersion = '1.1';
	public Metrics: any;
	public Behaviors: any;
	public IsLenovoIDFeatureEnabled: string;
	public '_xmlns:xsi' = 'http://www.w3.org/2001/XMLSchema-instance';
	public '_xmlns:xsd' = 'http://www.w3.org/2001/XMLSchema';
}

/**	UAPOOBEDataResponse.Xml this file is created by oobe plugin, please don't update it
 	{
		"UAPOOBEDataResponse": {
			"SettingList": {
				"Setting": [
					{
						"_key": "locationGeoId",
						"__text": "244"
					},
					{
						"_key": "starterAccount",
						"__text": "userffaf0a2ce35bdee9f954db3f84127aee5@lenovoid.com"
					}
					... other keys
				]
			},
			"_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"_xmlns:xsd": "http://www.w3.org/2001/XMLSchema"
		}
	}
*/

class UAPOOBEDataResponse {
	public SettingList: SettingList;
}

class SettingList {
	public Setting: any;
}

class UserSettingsPayload {
	staterAccount: string = null;
	lastSignIndate: string = null;
}

export class LIDStarterHelper {
	private static signinDateFromSSO;
	private lid: any;

	constructor(
		private devService: DevService,
		private commonService: CommonService,
		private deviceService: DeviceService,
		vantageShellService: VantageShellService,
	) {
		// DUMMY
		this.lid = vantageShellService.getLenovoId();

		if (!this.lid) {
			this.devService.writeLog('LIDStarterHelper constructor: LID object is undefined');
		}
	}

	generateSourceName(api) {
		const version = environment.appVersion.replace(/\./g, '');
		return (!api) ?
			SOURCE_NAME + version :
			SOURCE_NAME + api + '.' + version;
	}

	getDeviceId() {
		let deviceId = this.commonService.getLocalStorageValue(LocalStorageKey.LidFakeDeviceID);
		if (!deviceId) {
			deviceId = uuidv4().replace(/-/g, '');
			this.commonService.setLocalStorageValue(LocalStorageKey.LidFakeDeviceID, deviceId);
		}
		return deviceId;
	}

	generateStarterAccountToken(account: string) {
		let tokenInfo = null;
		if (account) {
			tokenInfo += '|Format=ST|' + STARTER_ACCOUNT_TOKEN;
		}
		return tokenInfo;
	}

	async getDataFromOOBE() {
		const response: any = await this.readXmlFile(LIDOobeResponseXml);
		const oobeData = {
			email: null,
			starterAccount: null
		};

		if (response == null) {
			return oobeData;
		}

		const tempResult = response.UAPOOBEDataResponse as UAPOOBEDataResponse;
		if (!tempResult
			|| !tempResult.SettingList
			|| !tempResult.SettingList.Setting) {
			return oobeData;
		}

		tempResult.SettingList.Setting.forEach(item => {
			if (item._key && item._key.toLowerCase() === 'email') {
				oobeData.email = item.__text;
			}

			if (item._key && item._key.toLowerCase() === 'starteraccount') {
				oobeData.starterAccount = item.__text;
			}
		});

		return oobeData;
	}


	async postAsync(strUrl, postData) {
		try {
			const httpContent = new Windows.Web.Http.HttpFormUrlEncodedContent(postData);
			const url = new Windows.Foundation.Uri(strUrl);
			const client = new Windows.Web.Http.HttpClient();
			const response = await client.postAsync(url, httpContent);
			return await response.content.readAsStringAsync();
		} catch (ex) {
			this.devService.writeLog('Getting starter id info', ex.message);
		}

		return '';
	}


	async getStaterAccountFromOOBEServer() {
		const url = 'https://www.lenovoid.com/lps/win10/oobe/2.0/';
		const languageDic = {
			'en_us': 'en_us', // 'English',
			'da_dk': 'da_dk', // 'Dansk',
			'nl_nl': 'nl_nl', // 'Nederlands',
			'fi_fi': 'fi_fi', // 'Suomi',  //Finnish
			'fr_fr': 'fr_fr', // 'Français', //French
			'de_de': 'de_de', // 'Deutsch',  //German
			'it_it': 'it_it', // 'Italiano',  //Italian
			'ja_jp': 'ja_jp', // '日本語',
			'ko_kr': 'ko_kr', // '한국어',
			'pt_br': 'pt_br', // 'Português(Brasil)',
			'pt_pt': 'pt_pt', // 'Português(Portugal)', //no need
			'es_es': 'es_es', // 'Español',  //Spanish
			'sv_se': 'sv_se', // 'Svenska',  //Swedish
			'zh_cn': 'zh_cn', // '中文（简体)',
			'ru': 'ru', // 'Pусский',
			'nb': 'no_NO', // 'Norsk',
			'zh_tw': 'zh_Hant' // '中文（繁體)'
		};

		const mathineInfo = await this.deviceService.getMachineInfo();
		if (!mathineInfo || !mathineInfo.locale) {
			return null;
		}

		const language = mathineInfo.locale.toLowerCase().replace('-', '_');
		let lanName = languageDic[language];
		if (!lanName) {
			lanName = languageDic['en_us'];
		}

		const payload = new Windows.Foundation.Collections.StringMap();
		try {
			payload.insert('oobeversion', 'W10_WW_1.0_A');
			payload.insert('optins', '00:00:00:00');
			payload.insert('liduid', 'STARTER');
			payload.insert('email', '');
			payload.insert('name', '');
			payload.insert('lang', lanName);
			payload.insert('source', this.generateSourceName('starterid'));
			payload.insert('deviceid', this.getDeviceId());
			payload.insert('deviceidtype', DEVICE_ID_TYPE);
			payload.insert('model', mathineInfo.mtm);
			payload.insert('serial', mathineInfo.serialnumber);
			payload.insert('date', new Date().toISOString().substring(0, 19));
		} catch (ex) {
			console.log(ex.message);
		}

		const result = await this.postAsync(url, payload);
		const accountUIDPatten = /<LenovoID>[\w|\W]*<AccountUID>([\w\s]+)<\/AccountUID>[\w|\W]*<\/LenovoID>/;
		const rexAccountUID = accountUIDPatten.exec(result);
		return rexAccountUID ?  rexAccountUID[1] : '';
	}

	async getFromUserSetting() {
		const response = await this.readXmlFile(LIDUserSettingsXml);
		let userSettingsXml = response as LenovoIDUserSettingsXml;
		if (!userSettingsXml) {
			userSettingsXml = new LenovoIDUserSettingsXml();
		}

		return userSettingsXml;
	}

	async hadEverSignIn() {
		try {
			// get signin date from local
			let signinDate = this.commonService.getLocalStorageValue(LocalStorageKey.LidFirstSignInDate);
			if (signinDate) {
				return true;
			}

			// get sigin date from sso GetLastLoginTime
			if (!LIDStarterHelper.signinDateFromSSO) {
				LIDStarterHelper.signinDateFromSSO = this.lid.getLastLoginTime();
			}
			signinDate = await LIDStarterHelper.signinDateFromSSO;
			if (signinDate && signinDate.lastLoginTime) {
				signinDate = new Date(signinDate.lastLoginTime).toISOString().substring(0, 19);
				this.commonService.setLocalStorageValue(LocalStorageKey.LidFirstSignInDate, signinDate);
				this.updateUserSettingXml({ lastSignIndate: signinDate, staterAccount: null });
				return true;
			}
		} catch (ex) {
			this.devService.writeLog('Testing ever sign in lid', ex.message);
			return false;
		}

		return false;
	}

	async isStarterAccountScenario() {
		try {
			// get signin date from local
			let signinDate = this.commonService.getLocalStorageValue(LocalStorageKey.LidFirstSignInDate);
			if (signinDate) {
				return false;
			}

			// get sigin date from sso GetLastLoginTime
			if (!LIDStarterHelper.signinDateFromSSO) {
				LIDStarterHelper.signinDateFromSSO = this.lid.getLastLoginTime();
			}
			signinDate = await LIDStarterHelper.signinDateFromSSO;
			if (signinDate && signinDate.lastLoginTime) {
				signinDate = new Date(signinDate.lastLoginTime).toISOString().substring(0, 19);
				this.commonService.setLocalStorageValue(LocalStorageKey.LidFirstSignInDate, signinDate);
				this.updateUserSettingXml({ lastSignIndate: signinDate, staterAccount: null });
				return false;
			}

			// get newAccount = CheckOOBEData.GetInstance().GetEmail();
			const oobeData = await this.getDataFromOOBE();
			if (oobeData && oobeData.email) {
				return false;
			}
		} catch (ex) {
			this.devService.writeLog('Testing starter scenirio', ex.message);
			return false;
		}

		return true;
	}

	async getStarterAccountToken() {
		try {
			// option1: get from oobe xml
			const oobeData = await this.getDataFromOOBE();
			let starterAccount = oobeData ? oobeData.starterAccount : null;
			if (this.isStarterAccount(starterAccount)) {
				return this.generateStarterAccountToken(starterAccount);
			}

			// option2: get from web-localstorage
			starterAccount = this.commonService.getLocalStorageValue(LocalStorageKey.LidStarterAccount);
			if (this.isStarterAccount(starterAccount)) {
				return this.generateStarterAccountToken(starterAccount);
			}

			// option3: get from oobe service and save to web-localstorage and lenovo_user_settings.xml
			starterAccount = await this.getStaterAccountFromOOBEServer();
			if (!this.isStarterAccount(starterAccount)) {
				return null;
			}

			this.commonService.setLocalStorageValue(LocalStorageKey.LidStarterAccount, starterAccount);
			this.updateUserSettingXml({ lastSignIndate: null, staterAccount: starterAccount });
			return this.generateStarterAccountToken(starterAccount);
		} catch (ex) {
			this.devService.writeLog('Getting starter id info', ex.message);
			return null;
		}
	}

	isValidEmail(email) {
		if (!email || typeof email !== 'string') {
			return false;
		}

		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	isStarterAccount(email: string) {
		if (!email || typeof email !== 'string') {
			return false;
		}

		return email.toLocaleLowerCase().endsWith('@lenovoid.com');
	}

	async hasCreateStarterAccount() {
		// option1: get from web-localstorage
		let starterAccount = this.commonService.getLocalStorageValue(LocalStorageKey.LidStarterAccount);
		if (this.isStarterAccount(starterAccount)) {
			return true;
		}

		const LidHasCreateStarterAccount = this.commonService.getLocalStorageValue(LocalStorageKey.LidHasCreateStarterAccount);
		if (LidHasCreateStarterAccount) {
			return true;
		}

		// option2: get from oobe xml
		const oobeData = await this.getDataFromOOBE();
		starterAccount = oobeData ? oobeData.starterAccount : null;
		if (this.isStarterAccount(starterAccount)) {
			this.commonService.setLocalStorageValue(LocalStorageKey.LidHasCreateStarterAccount, true);
			return true;
		}

		return false;
	}

	async updateUserSettingXml(payload: UserSettingsPayload, userSettingsXml: Promise<{}> = null) {
		let needUpdate = false;
		if (!userSettingsXml) {
			userSettingsXml = this.readXmlFile(LIDUserSettingsXml);
		}

		let userSettings = await userSettingsXml as LenovoIDUserSettingsXml;
		if (!userSettings) {
			userSettings = new LenovoIDUserSettingsXml();
		}

		if (payload.staterAccount
			&& userSettings.Settings.Behaviors.starterAccount !== payload.staterAccount) {
			needUpdate = true;
			userSettings.Settings.Behaviors.starterAccount = payload.staterAccount;
		}

		if (payload.lastSignIndate
			&& userSettings.Settings.Behaviors[0].DateFirstSignin !== payload.lastSignIndate) {
			needUpdate = true;
			userSettings.Settings.Behaviors[0].DateFirstSignin = payload.lastSignIndate;
		}

		if (!needUpdate) {
			return true;
		}

		const xmlHeader = '<?xml version="1.0" encoding="utf-16"?>';
		await this.writeXmlFile(LIDUserSettingsXml, userSettings, xmlHeader);
	}

	xml2Json(xmlStr: string) {
		const x2js = new X2JS();
		return x2js.xml2js(xmlStr);
	}

	json2xml(jsObj: object) {
		const x2js = new X2JS();
		return x2js.js2xml(jsObj);
	}

	async readXmlFile(fileName: String) {
		let fileObj;
		try {
			fileObj = await Windows.Storage.ApplicationData.current.localFolder.getFileAsync(fileName);
			if (fileObj === null) {
				return {};
			}
		} catch (ex) {
			this.devService.writeLog('get xml file', ex.message);
			return {}; 	// file not exist
		}

		const contents = await Windows.Storage.FileIO.readTextAsync(fileObj);
		if (!contents) {
			return {};
		} else {
			return this.xml2Json(contents);
		}
	}

	async writeXmlFile(fileName: string, jsObj: object, xmlHeader: string) {
		let xmlString = this.json2xml(jsObj);
		if (!xmlString) {
			xmlString = '';
		}

		if (xmlHeader) {
			xmlString = xmlHeader + xmlString;
		}

		const targetFile = await Windows.Storage.ApplicationData.current.localFolder
			.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting);

		await Windows.Storage.FileIO.writeTextAsync(targetFile, xmlString);
	}
}

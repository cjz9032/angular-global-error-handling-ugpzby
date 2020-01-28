import { Injectable } from '@angular/core';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { MetricHelper } from 'src/app/data-models/metrics/metric-helper.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Container, BindingScopeEnum } from 'inversify';
import { HardwareScanShellMock } from 'src/app/beta/hardware-scan/mock/hardware-scan-shell-mock';
import { WinRT, CHSAccountState, EventTypes } from '@lenovo/tan-client-bridge';
import { of } from 'rxjs';
import { TopRowFunctionsIdeapad, KeyType } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.interface';
import { VoipErrorCodeEnum } from 'src/app/enums/voip.enum';
import { CommonErrorCode } from 'src/app/data-models/common/common.interface';
import { BacklightStatusEnum, BacklightLevelEnum } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.enum';

declare var Windows;

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {
	public readonly isShellAvailable: boolean;
	public phoenix: any;
	private shell: any;
	private isGamingDevice = false;
	constructor(private commonService: CommonService, private http: HttpClient) {
		this.isShellAvailable = true;
		this.shell = this.getVantageShell();
		if (this.shell) {
			this.setConsoleLogProxy();
			const metricClient = this.shell.MetricsClient ? new this.shell.MetricsClient() : null;
			const powerClient = this.shell.PowerClient ? this.shell.PowerClient() : null;
			this.phoenix = Phoenix.default(
				new Container({
					defaultScope: BindingScopeEnum.Singleton
				}),
				{
					metricsBroker: metricClient,
					hsaPowerBroker: powerClient,
					hsaDolbyBroker: this.shell.DolbyRpcClient ? this.shell.DolbyRpcClient.instance : null,
					hsaForteBroker: this.shell.ForteRpcClient ? this.shell.ForteRpcClient.getInstance() : null
				}
			);

			this.phoenix.loadFeatures([
				Phoenix.Features.Dashboard,
				Phoenix.Features.Device,
				Phoenix.Features.LenovoId,
				Phoenix.Features.SecurityAdvisor,
				Phoenix.Features.SystemInformation,
				Phoenix.Features.HwSettings,
				Phoenix.Features.SystemUpdate,
				Phoenix.Features.Warranty,
				Phoenix.Features.Permissions,
				Phoenix.Features.UserGuide,
				Phoenix.Features.DeviceFilter,
				Phoenix.Features.Metrics,
				Phoenix.Features.ModernPreload,
				Phoenix.Features.Privacy,
				Phoenix.Features.LenovoVoiceFeature,
				Phoenix.Features.GenericMetricsPreference,
				Phoenix.Features.PreferenceSettings,
				Phoenix.Features.ConnectedHomeSecurity,
				Phoenix.Features.HardwareScan,
				Phoenix.Features.DevicePosture,
				Phoenix.Features.AdPolicy
			]);
		}
	}

	private getPromise(returnValue: any, param?: any): any {
		const promise = () => new Promise((resolve) => resolve(returnValue));
		return promise;
	}

	public registerEvent(eventType: any, handler: any) {
		switch (eventType) {
			case EventTypes.gamingMacroKeyInitializeEvent:
				setTimeout(() => {
					const keyTypeResponse = { MacroKeyType: 0, MacroKeyStatus: 1 };
					handler(keyTypeResponse);
				}, 1000);
				break;
			case EventTypes.gamingMacroKeyRecordedChangeEvent:
				const recordChangeResponse = [
					{ key: '7', status: false },
					{ key: '8', status: false },
					{ key: '9', status: false },
					{ key: '4', status: false },
					{ key: '5', status: false },
					{ key: '6', status: false },
					{ key: '1', status: false },
					{ key: '2', status: false },
					{ key: '3', status: false },
					{ key: '0', status: true }
				];
				setTimeout(() => {
					handler(recordChangeResponse);
				}, 1000);
				break;
			case EventTypes.gamingMacroKeyKeyChangeEvent:
				const keyEventChangeResponse = {
					key: '0',
					macro: {
						repeat: 1,
						interval: 1,
						inputs: [
							{ status: 1, key: '1', interval: 0 },
							{ status: 0, key: '1', interval: 267 },
							{ status: 1, key: '2', interval: 146 },
							{ status: 1, key: '3', interval: 270 },
							{ status: 0, key: '2', interval: 46 },
							{ status: 0, key: '3', interval: 89 },
							{ status: 1, key: 'W', interval: 177 },
							{ status: 1, key: 'A', interval: 39 },
							{ status: 0, key: 'W', interval: 44 },
							{ status: 1, key: 'S', interval: 227 },
							{ status: 1, key: 'D', interval: 47 },
							{ status: 0, key: 'A', interval: 67 },
							{ status: 0, key: 'S', interval: 49 },
							{ status: 0, key: 'D', interval: 94 },
							{ status: 1, key: 'A', interval: 39 },
							{ status: 1, key: 'S', interval: 44 },
							{ status: 1, key: 'D', interval: 69 },
							{ status: 0, key: 'A', interval: 83 },
							{ status: 0, key: 'S', interval: 35 },
							{ status: 0, key: 'D', interval: 67 }
						]
					}
				};
				setTimeout(() => {
					handler(keyEventChangeResponse);
				}, 1000);
				break;
			default:
				if (this.phoenix) {
					this.phoenix.on(eventType, (val) => {
						handler(val);
					});
				}
		}
	}

	public unRegisterEvent(eventType: any, handler: any) {
		if (this.phoenix) {
			this.phoenix.off(eventType, handler);
		}
	}
	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
	}

	private setConsoleLogProxy() {
		const consoleProxy = Object.assign({}, console);
		const logger = this.getLogger();
		console.log = (msg, ...args) => {
			const message = this.getMessage(msg);
			consoleProxy.log(message, args);
			if (logger) {
				logger.info(message);
			}
		};

		console.error = (msg, ...args) => {
			const message = this.getMessage(msg);
			consoleProxy.error(message, args);
			if (logger) {
				logger.error(message);
			}
		};

		console.warn = (msg, ...args) => {
			const message = this.getMessage(msg);
			consoleProxy.warn(message, args);
			if (logger) {
				logger.warn(message);
			}
		};
	}

	private getMessage(message: string, data: any = {}) {
		return `v${environment.appVersion}:- ${message}`;
	}

	public getLenovoId(): any {
		if (this.phoenix && this.phoenix.lid) {
			return this.phoenix.lid;
		}
		return undefined;
	}
	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDashboard(): any {
		const dashboard: any = {};
		const obj = {
			available: true,
			status: true,
			permission: true
		};
		const sysInfoObj: any = {
			disk: {
				total: 1015723810816,
				used: 885390389248
			},
			memory: {
				total: 12533723136,
				used: 10677587968
			}
		};

		const systemInfo = {
			memory: { total: 8261181440, used: 7720923136 },
			disk: { total: 256060514304, used: 93606965248 },
			warranty: { expired: '2017-10-16T00:00:00.000Z', status: 1 },
			systemupdate: { lastupdate: '2019-10-25T17:27:51', status: 1 }
		};

		const today = new Date().toISOString();
		const warrantyObj: any = {
			endDate: today,
			status: 0
		};
		const sysUpdateObj: any = {
			lastScanTime: today,
			status: 1
		};
		dashboard.getMicphoneStatus = this.getPromise(obj);
		dashboard.getCameraStatus = this.getPromise(obj);
		dashboard.getEyeCareModeState = this.getPromise(obj);
		dashboard.getSystemInfo = this.getPromise(systemInfo);
		dashboard.warranty = {};
		dashboard.sysupdate = {};
		dashboard.warranty.getWarrantyInformation = this.getPromise(warrantyObj);
		dashboard.sysupdate.getMostRecentUpdateInfo = this.getPromise(sysUpdateObj);
		dashboard.sysinfo = this.getSysinfo();
		dashboard.sysinfo.getMemAndDiskUsage = this.getPromise(sysInfoObj);

		return dashboard;
	}
	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDevice(): any {
		const device: any = {};
		const obj = {
			biosDate: '08292018',
			biosVersion: 'R0PET47W 1.24 ',
			brand: 'Lenovo',
			country: 'us',
			cpuAddressWidth: '64',
			cpuArchitecture: 'AMD64',
			cpuinfo: {
				addressWidth: '64',
				name: 'Intel(R) Core(TM) i3-7020U CPU @ 2.30GHz',
				type: 'AMD64',
				vendor: 'GenuineIntel'
			},
			deviceId: '0879eb1af41243f0af686ffe29eff508f6d1eb99fef906b2417be2ea0f5787fc',
			eCVersion: '1.24',
			enclosureType: 'notebook',
			family: 'ThinkPad E480',
			firstRunDate: '2019-06-18T00:54:24',
			isGaming: this.isGamingDevice, // change value to true for gaming machine
			isSMode: false,
			locale: 'en',
			manufacturer: 'LENOVO',
			memorys: [
				{
					serialNumber: '8B264B0A',
					sizeInBytes: 4194304,
					type: 'DDR4'
				},
				{
					serialNumber: '4A7D0400',
					sizeInBytes: 8388608,
					type: 'DDR4'
				}
			],
			mt: '20KN',
			mtm: '20KNS0DD00',
			os: 'Windows',
			osBitness: '64',
			osName: 'Windows 10 Pro',
			osVersionString: '10.0.18362.356',
			serialnumber: 'PG01EBJS',
			sku: 'LENOVO_MT_20KN_BU_Think_FM_ThinkPad E480',
			subBrand: 'ThinkPad'
		};

		device.getMachineInfo = this.getPromise(obj);
		device.getMachineInfoSync = this.getPromise(obj);
		return device;
	}

	/**
	 * returns sysinfo object from VantageShellService of JS Bridge
	 */
	public getSysinfo(): any {
		const sysInfo: any = {};
		const machineInfo = {
			biosDate: '08292018',
			biosVersion: 'R0PET47W 1.24 ',
			brand: 'Lenovo',
			country: 'us',
			cpuAddressWidth: '64',
			cpuArchitecture: 'AMD64',
			cpuinfo: {
				addressWidth: '64',
				name: 'Intel(R) Core(TM) i3-7020U CPU @ 2.30GHz',
				type: 'AMD64',
				vendor: 'GenuineIntel'
			},
			deviceId: '0879eb1af41243f0af686ffe29eff508f6d1eb99fef906b2417be2ea0f5787fc',
			eCVersion: '1.24',
			enclosureType: 'notebook',
			family: 'ThinkPad E480',
			firstRunDate: '2019-06-18T00:54:24',
			isGaming: this.isGamingDevice, // change value to true for gaming machine
			isSMode: false,
			locale: 'en',
			manufacturer: 'LENOVO',
			memorys: [
				{
					serialNumber: '8B264B0A',
					sizeInBytes: 4194304,
					type: 'DDR4'
				},
				{
					serialNumber: '4A7D0400',
					sizeInBytes: 8388608,
					type: 'DDR4'
				}
			],
			mt: '20KN',
			mtm: '20KNS0DD00',
			os: 'Windows',
			osBitness: '64',
			osName: 'Windows',
			osVersionString: '10.0.18362.356',
			serialnumber: 'PG01EBJS',
			sku: 'LENOVO_MT_20KN_BU_Think_FM_ThinkPad E480',
			subBrand: 'ThinkPad'
		};

		const hardwareInfo = {
			processor: {
				name: 'Intel(R) Core(TM) i7-6600U CPU @ 2.60GHz',
				type: 'i386',
				addressWidth: '64',
				vendor: 'Intel'
			},
			memory: {
				total: 16943040000,
				used: 8943040000,
				type: 'DDR4'
			},
			disk: {
				total: 419430400000,
				used: 219430400000
			}
		};
		sysInfo.getMachineInfo = this.getPromise(machineInfo);
		sysInfo.getMachineInfoSync = this.getPromise(machineInfo);
		sysInfo.getMachineType = this.getPromise(1); // 1 = ThinkPad
		sysInfo.getHardwareInfo = this.getPromise(hardwareInfo);
		return sysInfo;
	}

	/**
	 * returns warranty object from VantageShellService of JS Bridge
	 */
	public getWarranty(): any {
		// {lastupdate: null, status: 0}

		if (this.phoenix) {
			return this.phoenix.warranty;
		}
		return undefined;
	}

	public getShellVersion() {
		if (Windows) {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			return `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}

		return '';
	}

	private normalizeEventName(eventName) {
		eventName = eventName.toLowerCase();
		switch (eventName) {
			case 'firstrun':
				eventName = 'FirstRun';
				break;
			case 'apploaded':
				eventName = 'AppLoaded';
				break;
			case 'articledisplay':
				eventName = 'ArticleDisplay';
				break;
			case 'appaction':
				eventName = 'AppAction';
				break;
			case 'getenvinfo':
				eventName = 'GetEnvInfo';
				break;
			case 'pageview':
				eventName = 'PageView';
				break;
			case 'featureclick':
			case 'itemclick':
				eventName = 'FeatureClick';
				break;
			case 'itemview':
				eventName = 'ItemView';
				break;
			case 'articleclick':
			case 'docclick':
				eventName = 'ArticleClick';
				break;
			case 'articleview':
				eventName = 'ArticleView';
				break;
			case 'docview':
				eventName = 'DocView';
				break;
			case 'taskaction':
				eventName = 'TaskAction';
				break;
			case 'settingupdate':
				eventName = 'SettingUpdate';
				break;
			case 'userfeedback':
				eventName = 'UserFeedback';
				break;
		}

		return eventName;
	}

	/**
	 * returns metric object from VantageShellService of JS Bridge
	 */
	public getMetrics(): any {
		if (this.phoenix && this.phoenix.metrics) {
			const metricClient = this.phoenix.metrics;
			if (!metricClient.isInit) {
				const jsBridgeVesion = this.getVersion() || '';
				const shellVersion = this.getShellVersion();
				metricClient.init({
					appVersion: `Web:${environment.appVersion};Bridge:${jsBridgeVesion};Shell:${shellVersion}`,
					appId: MetricHelper.getAppId('dß'),
					appName: 'vantage3',
					channel: '',
					ludpUrl: 'https://chifsr.lenovomm.com/PCJson'
				});
				const that = this;
				metricClient.isInit = true;
				metricClient.sendAsyncOrignally = metricClient.sendAsync;
				metricClient.commonService = this.commonService;
				metricClient.sendAsync = async function sendAsync(data) {
					try {
						// automatically fill the OnlineStatus for page view event
						if (!data.OnlineStatus) {
							data.OnlineStatus = that.commonService.isOnline ? 1 : 0;
						}

						const isBeta = that.commonService.getLocalStorageValue(LocalStorageKey.BetaTag, false);
						if (isBeta) {
							data.IsBetaUser = true;
						}

						data.ItemType = that.normalizeEventName(data.ItemType);
						return await this.sendAsyncOrignally(data);
					} catch (ex) {
						return Promise.resolve({
							status: 0,
							desc: 'ok'
						});
					}
				};
			}

			return metricClient;
		}

		const defaultMetricsClient = {
			sendAsync() {
				return Promise.resolve({
					status: 0,
					desc: 'ok'
				});
			},
			sendAsyncEx() {
				return Promise.resolve({
					status: 0,
					desc: 'ok'
				});
			},
			metricsEnabled: false
		};

		return defaultMetricsClient;
	}

	public getMetricsPolicy(callback) {
		const self = this;
		this.downloadMetricsPolicy().subscribe((response) => {
			self.deviceFilter(JSON.stringify(response)).then((result) => {
				const userDeterminePrivacy = self.commonService.getLocalStorageValue(
					LocalStorageKey.UserDeterminePrivacy
				);
				if (!userDeterminePrivacy) {
					callback(result);
				}
			});
		});
	}

	private downloadMetricsPolicy() {
		return this.http.get<string>('/assets/privacy-json/metrics.json');
	}

	/**
	 * returns modern preload object from VantageShellService of JS Bridge
	 */
	public getModernPreload(): any {
		const modernPreload: any = {};
		const entitledAppListResult = {
			appList: [
				{
					appID: '07f5e8aaa07d836e817f35847f39cf88',
					partNum: 'SBB0U39800', // id for get details from CMS entitled apps
					name: 'X-Rite royalty for UHD panel',
					status: 'installed',
					progress: '0',
					version: '2.1.9'
				},
				{
					appID: 'c233e07661739ce19e604ebdcc832f7b',
					partNum: 'SBB0K63291', // id for get details from CMS entitled apps
					name: 'McAfee LiveSafe 36 Months Subscription Win7 Win10 ',
					status: 'not installed',
					progress: '0',
					version: '16.0.14'
				},
				{
					appID: '5715374c216f6f89acd63902f5834980',
					partNum: 'SBB0U39801', // id for get details from CMS entitled apps
					name: 'Chroma Tune royalty for UHD panel',
					status: 'not installed',
					progress: '0',
					version: '2'
				}
			]
		};
		modernPreload.initialize = (serialNumber) => ({
			if(sn) {
				return true;
			}
		});
		modernPreload.getIsEntitled = () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({ result: true });
				}, 1000);
			});
		};
		modernPreload.getEntitledAppList = () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(entitledAppListResult);
				}, 2000);
			});
		};
		modernPreload.downloadOrInstallEntitledApps = (appList, callback, cancelHandler) => {
			return new Promise((resolve) => {
				const progressResponseList = [];
				let cancelled = false;
				cancelHandler.cancel = () => {
					cancelled = true;
				};
				appList.forEach((app) => {
					progressResponseList.push([{ appID: app.appID, status: 'downloading', progress: '0' }]);
					progressResponseList.push([{ appID: app.appID, status: 'downloading', progress: '10' }]);
					progressResponseList.push([{ appID: app.appID, status: 'downloading', progress: '50' }]);
					progressResponseList.push([{ appID: app.appID, status: 'downloading', progress: '90' }]);
					progressResponseList.push([{ appID: app.appID, status: 'downloaded', progress: '100' }]);
					progressResponseList.push([{ appID: app.appID, status: 'installing', progress: '0' }]);
					progressResponseList.push([{ appID: app.appID, status: 'installing', progress: '0' }]);
					progressResponseList.push([{ appID: app.appID, status: 'installing', progress: '0' }]);
					progressResponseList.push([{ appID: app.appID, status: 'installed', progress: '100' }]);
				});
				const downloadAndInstallResult = { appList };
				downloadAndInstallResult.appList.forEach((app) => {
					app.status = 'installed';
					app.progress = '100';
				});

				let i = 0;
				const downloadInterval = setInterval(() => {
					if (i < progressResponseList.length && !cancelled) {
						callback(progressResponseList[i]);
						i++;
					} else {
						resolve(downloadAndInstallResult);
						clearInterval(downloadInterval);
					}
				}, 1000);
			});
		};
		return modernPreload;
	}

	/**
	 * returns ad policy object from VantageShellService of JS Bridge
	 */
	public getAdPolicy(): any {
		if (this.phoenix) {
			return this.phoenix.adPolicy;
		}
		return undefined;
	}

	/**
	 * returns sysinfo object from VantageShellService of JS Bridge
	 */
	public getSystemUpdate(): any {
		if (this.phoenix) {
			return this.phoenix.systemUpdate;
		}
		return undefined;
	}

	public getSecurityAdvisor(): Phoenix.SecurityAdvisor {
		const securityAdvisor: Phoenix.SecurityAdvisor = {
			antivirus: {
				status: 'success',
				mitt: null,
				mcafeeDownloadUrl:
					'https://www.mcafee.com/consumer/en-us/promos/expiry/l714/mls_430/trial/ab/wb.html?cid=239128&culture=en-us&affid=714&pir=1',
				mcafee: null,
				others: null,
				windowsDefender: {
					firewallStatus: true,
					status: true,
					enabled: true
				},
				on(type, handler) {
					return this;
				},
				off(type, handler) {
					return this;
				},
				refresh() {
					return Promise.resolve();
				},
				launch() {
					return Promise.resolve(true);
				},
				openMcAfeeRegistry() {
					return Promise.resolve(true);
				}
			},
			passwordManager: {
				status: 'not-installed',
				mitt: null,
				downloadUrl: 'https://www.dashlane.com/lenovo/',
				loginUrl: 'https://app.dashlane.com',
				appUrl: 'https://app.dashlane.com',
				isDashLaneEdgeVersion: false,
				download() {
					this.status = 'installed';
					return Promise.resolve(true);
				},
				launch() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off(type, handler) {
					return this;
				},
				refresh() {
					return Promise.resolve();
				}
			},
			vpn: {
				status: 'not-installed',
				mitt: null,
				downloadUrl: 'https://www.surfeasy.com/lenovo/',
				download() {
					this.status = 'installed';
					return Promise.resolve(true);
				},
				launch() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off(type, handler) {
					return this;
				},
				refresh() {
					return Promise.resolve();
				}
			},
			windowsHello: {
				fingerPrintStatus: 'active',
				facialIdStatus: 'inactive',
				systemPasswordStatus: 'active',
				mitt: null,
				supportUrl: 'https://support.microsoft.com/en-us/help/17215/windows-10-what-is-hello',
				windowsHelloProtocol: 'ms-settings:signinoptions',
				launch() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off(type, handler) {
					return this;
				},
				refresh() {
					return Promise.resolve();
				}
			},
			wifiSecurity: {
				mitt: null,
				state: 'enabled',
				wifiHistory: [
					{
						ssid: 'lenovo',
						info: '2019/7/1 13:15:32',
						good: '0'
					}
				],
				isLocationServiceOn: true,
				isAllAppsPermissionOn: true,
				isDevicePermissionOn: true,
				isLWSPluginInstalled: true,
				hasSystemPermissionShowed: true,
				isSupported: true,
				launchLocationPrivacy() {
					return Promise.resolve(true);
				},
				enableWifiSecurity() {
					this.state = 'enabled';
					return Promise.resolve(true);
				},
				disableWifiSecurity() {
					this.state = 'disabled';
					return Promise.resolve(true);
				},
				getWifiSecurityStateOnce(): Promise<any> {
					return Promise.resolve();
				},
				updateWifiSecurityState(): void { },
				getWifiSecurityState(): Promise<any> {
					return Promise.resolve();
				},
				getWifiState() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off(type, handler) {
					return this;
				},
				refresh() {
					const p1 = new Promise((resolve) => { });
					const p2 = new Promise((resolve) => { });
					return Promise.all([p1, p2]);
				},
				cancelGetWifiSecurityState() { },
				getWifiHistory() { },
				cancelGetWifiHistory() { }
			},
			windowsActivation: {
				mitt: null,
				status: 'disable',
				windowsActivationProtocol: '',
				launch() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off() {
					return this;
				},
				refresh() {
					return Promise.resolve();
				}
			},
			uac: {
				mitt: null,
				status: 'disable',
				on(type, handler) {
					return this;
				},
				off() {
					return this;
				},
				launch() {
					return Promise.resolve(true);
				},
				refresh() {
					return Promise.resolve();
				}
			},
			bitLocker: {
				mitt: null,
				status: 'disable',
				launch() {
					return Promise.resolve(true);
				},
				on(type, handler) {
					return this;
				},
				off() {
					return this;
				},
				refresh() {
					return Promise.resolve();
				}
			},
			setScoreRegistry() {
				return Promise.resolve(true);
			},
			on(type, handler) {
				return this;
			},
			off(type, handler) {
				return this;
			},
			refresh() {
				return Promise.resolve();
			}
		};
		return securityAdvisor;
	}

	public getPermission(): any {
		if (this.phoenix) {
			return this.phoenix.permissions;
		}
		return undefined;
	}

	public getConnectedHomeSecurity(): Phoenix.ConnectedHomeSecurity {
		const homeSecurity: Phoenix.ConnectedHomeSecurity = {
			account: {
				state: CHSAccountState.trial,
				role: undefined,
				lenovoId: 'lenovo@lenovo.com',
				serverTimeUTC: new Date(),
				expiration: new Date('sep 15, 2019'),
				consoleUrl: 'https://chs.lenovo.com',
				getCHSConsoleUrl() {
					return Promise.resolve('https://chs.lenovo.com/');
				}
			},
			deviceOverview: {
				allDevicesCount: 0,
				allDevicesProtected: true,
				familyMembersCount: 2,
				placesCount: 2,
				personalDevicesCount: 1,
				wifiNetworkCount: 3,
				homeDevicesCount: 0
			},
			on(type, handler) {
				return this;
			},
			off(type, handler) {
				return this;
			},
			refresh() {
				return Promise.resolve([true]);
			},
			joinAccount(code: string) {
				return Promise.resolve('success');
			},
			quitAccount() {
				return Promise.resolve('success');
			},
			purchase() {
				WinRT.launchUri(
					'https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows'
				);
				this.account.state =
					this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
			},
			visitWebConsole(feature: string) {
				WinRT.launchUri(`https://homesecurity.coro.net/`);
				this.account.state =
					this.state === CHSAccountState.trial ? CHSAccountState.trialExpired : CHSAccountState.standard;
			}
		};

		return homeSecurity;
	}

	public getDevicePosture(): Phoenix.DevicePosture {
		const devicePosture: Phoenix.DevicePosture = {
			value: [
				{ name: 'PasswordProtection', vulnerable: false },
				{ name: 'HardDriveEncryption', vulnerable: true },
				{ name: 'AntiVirusAvailability', vulnerable: false },
				{ name: 'FirewallAvailability', vulnerable: false },
				{ name: 'AppsFromUnknownSources', vulnerable: true },
				{ name: 'DeveloperMode', vulnerable: true },
				{ name: 'NotActivatedWindows', vulnerable: false },
				{ name: 'UacNotification', vulnerable: false }
			],
			getDevicePosture() {
				return Promise.resolve();
			},
			cancelGetDevicePosture() { },
			on(type, handler) {
				return this;
			},
			off(type, handler) {
				return this;
			},
			refresh() {
				return Promise.resolve([true]);
			}
		};
		return devicePosture;
	}

	/**
	 * returns hardware settings object from VantageShellService of JS Bridge
	 */
	public getHwSettings(): any {
		if (this.phoenix && this.phoenix.hwsettings) {
			return this.phoenix.hwsettings;
		}
		return undefined;
	}

	/**
	 * returns audio settings object from VantageShellService of JS Bridge
	 */
	private getAudioSettings(): any {
		if (this.getHwSettings() && this.getHwSettings().audio) {
			return this.getHwSettings().audio;
		}
		return undefined;
	}

	/**
	 * returns dolby settings object from VantageShellService of JS Bridge
	 */
	public getDolbySettings(): any {
		const dolby: any = {};
		const obj: any = {
			available: true,
			currentMode: 'Dynamic',
			supporedModes: ['Dynamic', 'Movie', 'Music', 'Games', 'Voip']
		};

		dolby.getDolbyMode = this.getPromise(obj);
		dolby.setDolbyMode = this.getPromise(true);
		dolby.stopMonitor = this.getPromise(true);
		dolby.startMonitor = this.getPromise(true);
		return dolby;
	}

	/**
	 * returns microphone settings object from VantageShellService of JS Bridge
	 */
	public getMicrophoneSettings(): any {
		const microphone: any = {};
		const micSupportedModes: any = {
			current: 'MultipleVoices',
			modes: ['VoiceRecognition', 'OnlyMyVoice', 'Normal', 'MultipleVoices']
		};

		const micSettings = {
			AEC: false,
			autoOptimization: true,
			available: true,
			currentMode: 'MultipleVoices',
			disableEffect: false,
			keyboardNoiseSuppression: true,
			muteDisabled: true,
			permission: true,
			volume: 100
		};
		microphone.getSupportedModes = this.getPromise(micSupportedModes);
		microphone.getMicrophoneSettings = this.getPromise(micSettings);
		microphone.setMicrophoneVolume = this.getPromise(true);
		microphone.setMicophoneMute = this.getPromise(true);
		microphone.setMicrophoneAutoOptimization = this.getPromise(true);
		microphone.setMicrophoneKeyboardNoiseSuppression = this.getPromise(true);
		microphone.setMicrophoneAEC = this.getPromise(true);
		microphone.setMicrophoneOpitimaztion = this.getPromise(true);
		microphone.startMonitor = this.getPromise(true);
		microphone.stopMonitor = this.getPromise(true);

		return microphone;
	}

	/**
	 * returns smart settings object from VantageShellService of JS Bridge
	 */
	public getSmartSettings(): any {
		const smartSettings: any = {
			absFeature: {
				getDolbyFeatureStatus: this.getPromise({ available: true, status: false }),
				setDolbyFeatureStatus: this.getPromise(true)

			}
		};

		return smartSettings;
	}

	/**
	 * returns power object from VantageShellService of JS Bridge
	 */
	private getPowerSettings(): any {
		if (this.getHwSettings() && this.getHwSettings().power) {
			return this.getHwSettings().power;
		}
		return undefined;
	}

	/**
	 * returns power's common object from VantageShellService of JS Bridge
	 */
	private getPowerCommonSettings(): any {
		if (this.getPowerSettings() && this.getPowerSettings().common) {
			return this.getPowerSettings().common;
		}
		return undefined;
	}

	/**
	 * returns battery info object from VantageShellService of JS Bridge
	 */
	public getBatteryInfo(): any {
		const battery: any = {
			batteryInformation: [
				{
					barCode: 'X2XP888JB1S',
					batteryCondition: ['Normal'],
					batteryHealth: 0,
					chargeStatus: 2,
					cycleCount: 98,
					designCapacity: 45.28,
					designVoltage: 11.1,
					deviceChemistry: 'Li-Polymer',
					firmwareVersion: '0005-0232-0100-0005',
					fruPart: '01AV446',
					fullChargeCapacity: 46.69,
					manufacturer: 'SMP',
					remainingCapacity: 23.84,
					remainingChargeCapacity: 0,
					remainingPercent: 52,
					remainingTime: 99,
					temperature: 32,
					voltage: 11.222,
					wattage: 10.57
				}
			],
			batteryIndicatorInfo: {
				acAdapterStatus: 'Supported',
				acAdapterType: 'Legacy',
				acWattage: 0,
				isAirplaneModeEnabled: false,
				isAttached: false,
				isExpressCharging: false,
				isPowerDriverMissing: false,
				percentage: 61,
				time: 111,
				timeType: 'timeRemaining'
			}
		};
		battery.getBatteryInformation = this.getPromise(battery);
		battery.startBatteryMonitor = this.getPromise(true);
		battery.stopBatteryMonitor = this.getPromise(true);
		return battery;
	}
	/**
	 * returns EyecareMode object from VantageShellService of JS Bridge
	 */
	public getEyeCareMode(): any {
		const obj = {
			available: true,
			status: true,
			permission: true,
			isLoading: false
		};
		const dayTimeObj = {
			available: true,
			current: 6500,
			eyemodestate: false,
			maximum: 6500,
			minimum: 1200
		};
		const eyeCareObj = {
			available: true,
			current: 4500,
			default: 4500,
			eyecaremode: 4500,
			maximum: 6500,
			minimum: 1200,
			status: false
		};
		const displayEyeCareMode: any = {
			getDaytimeColorTemperature: this.getPromise(dayTimeObj),
			setDaytimeColorTemperature: this.getPromise(true),
			resetDaytimeColorTemperature: this.getPromise(true),
			getDisplayColortemperature: this.getPromise(eyeCareObj),
			setDisplayColortemperature: this.getPromise(true),
			getEyeCareModeState: this.getPromise(obj),
			getEyeCareAutoModeState: this.getPromise(obj),
			initEyecaremodeSettings: this.getPromise(true),
			startMonitor: this.getPromise(true),
			stopMonitor: this.getPromise(true),
			setEyeCareMode: this.getPromise(true),
			setEyeCareAutoMode: this.getPromise(true),
			resetEyeCareMode: this.getPromise(true),
			statusChangedLocationPermission: this.getPromise(true)
		};
		return displayEyeCareMode;
	}
	/**
	 * returns Privacy Guard object from VantageShellService of JS Bridge
	 */
	public getPrivacyGuardObject(): any {
		const privacyGuardSettings: any = {
			getPrivacyGuardCapability: this.getPromise(true),
			getPrivacyGuardOnPasswordCapability: this.getPromise(true),
			getPrivacyGuardStatus: this.getPromise(true),
			getPrivacyGuardOnPasswordStatus: this.getPromise(true),
			setPrivacyGuardStatus: this.getPromise(true),
			setPrivacyGuardOnPasswordStatus: this.getPromise(true),

		};

		return privacyGuardSettings;
	}

	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public getCameraPrivacy(): any {
		const cameraPrivacyStatus: any = {
			getCameraPrivacyStatus: this.getPromise({ available: true, status: true }),
			setCameraPrivacyStatus: this.getPromise(true),
			startMonitor: this.getPromise(true),
			stopMonitor: this.getPromise(true),
		};
		return cameraPrivacyStatus;
	}
	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public setCameraPrivacy(): any {
		const cameraPrivacyStatus: any = {
			setCameraPrivacyStatus: this.getPromise({ available: true, status: true }),
		};
		return cameraPrivacyStatus;
	}
	/**
	 * returns cameraSettings object from VantageShellService of JS Bridge
	 */
	public getCameraSettings(): any {
		const cameraSettings: any = {
			getCameraSettings: this.getPromise(true),
			setCameraBrightness: this.getPromise(true),
			setCameraContrast: this.getPromise(true),
			setCameraAutoExposure: this.getPromise(true),
			setCameraExposure: this.getPromise(true),
			setCameraAutoFocus: this.getPromise(true),
			resetCameraSettings: this.getPromise(true),
			startMonitor: this.getPromise(true),
			stopMonitor: this.getPromise(true),
		};

		return cameraSettings;
	}
	public getVantageToolBar(): any {
		const devicePower: any = {};
		const toolbarObj: any = {
			available: true,
			status: true
		};

		devicePower.getVantageToolBarStatus = this.getPromise(toolbarObj);
		devicePower.setVantageToolBarStatus = this.getPromise(toolbarObj);
		devicePower.startMonitor = this.getPromise(toolbarObj);
		devicePower.stopMonitor = this.getPromise(true);
		return devicePower;
	}
	public getPowerIdeaNoteBook(): any {
		const obj = {
			available: true,
			status: true
		};
		const devicePowerIdeaNoteBook = {
			rapidChargeMode: {
				getRapidChargeModeStatus: this.getPromise(obj),
				setRapidChargeModeStatus: this.getPromise(obj)
			},
			conservationMode: {
				getConservationModeStatus: this.getPromise(obj),
				setConservationModeStatus: this.getPromise(obj)
			},
			intelligentCoolingForIdeaPad: {
				getITSSettings: this.getPromise(true),
				setITSSettings: this.getPromise(true),
				startMonitor: this.getPromise(true),
				stopMonitor: this.getPromise(true)
			},

			alwaysOnUSB: {
				getAlwaysOnUSBStatus: this.getPromise(obj),
				getUSBChargingInBatteryModeStatus: this.getPromise(obj),
				setAlwaysOnUSBStatus: this.getPromise(obj),
				setUSBChargingInBatteryModeStatus: this.getPromise(obj)
			},
			flipToBoot: {
				getFlipToBootCapability: this.getPromise({ ErrorCode: 0, Supported: 1, CurrentMode: 1 }),
				setFlipToBootSettings: this.getPromise({ ErrorCode: 0, Supported: 1, CurrentMode: 1 })
			}
		};
		return devicePowerIdeaNoteBook;
	}
	// public getPowerThinkPad(): any {
	// 	if (this.phoenix) {
	// 		return this.phoenix.hwsettings.power.thinkpad ;
	// 	}
	// 	return undefined;
	// }

	public getPowerThinkPad(): any {
		const batteryThresholdInfo: any = [
			{
				batteryNumber: 1,
				checkboxValue: false,
				isCapable: true,
				isEnabled: false,
				startValue: 75,
				stopValue: 80
			},
			{
				batteryNumber: 2,
				checkboxValue: false,
				isCapable: true,
				isEnabled: false,
				startValue: 75,
				stopValue: 80
			}
		];
		const devicePowerThinkPad: any = {
			sectionBatteryGaugeReset: {
				getGaugeResetCapability: this.getPromise(true),
				startBatteryGaugeReset: this.getPromise(true),
				stopBatteryGaugeReset: this.getPromise(true)
			},
			sectionChargeThreshold: {
				getChargeThresholdInfo: this.getPromise(batteryThresholdInfo),
				setChargeThresholdValue: this.getPromise(batteryThresholdInfo),
				setCtAutoCheckbox: this.getPromise(batteryThresholdInfo),
				setToggleOff: this.getPromise(batteryThresholdInfo)
			},
			sectionAirplaneMode: {
				getAirplaneModeCapability: this.getPromise(true),
				getAirplaneMode: this.getPromise(true),
				setAirplaneMode: this.getPromise(true),
				setAirplaneModeAutoDetection: this.getPromise(true),
				getAirplaneModeAutoDetection: this.getPromise(true)
			},
			sectionAlwaysOnUsb: {
				getAlwaysOnUsbCapability: this.getPromise(true),
				setAlwaysOnUsb: this.getPromise(true),
				getAlwaysOnUsb: this.getPromise(true)
			},
			sectionEasyResume: {
				getEasyResumeCapability: this.getPromise(true),
				getEasyResume: this.getPromise(true),
				setEasyResume: this.getPromise(true)
			},
			sectionSmartStandby: {
				getSmartStandbyCapability: this.getPromise(true),
				getSmartStandbyEnabled: this.getPromise(true),
				getSmartStandbyActiveStartEnd: this.getPromise(true),
				getSmartStandbyDaysOfWeekOff: this.getPromise(true),
				setSmartStandbyEnabled: this.getPromise(true),
				setSmartStandbyActiveStartEnd: this.getPromise(true),
				setSmartStandbyDaysOfWeekOff: this.getPromise(true),
				getIsAutonomicCapability: this.getPromise(true),
				getSmartStandbyIsAutonomic: this.getPromise(true),
				getSmartStandbyPresenceData: this.getPromise(true),
				getSmartStandbyActiveHours: this.getPromise(true),
				setSmartStandbyIsAutonomic: this.getPromise(true)
			}
		};
		return devicePowerThinkPad;
	}

	// public getPowerItsIntelligentCooling(): any {
	// 	if(this.phoenix){
	// 		return this.phoenix.hwsettings.power.its.IntelligentCooling ;
	// 	}
	// }
	public getPowerItsIntelligentCooling(): any {
		const devicePowerItsIntelligentCooling = {
			intelligentCooling: {
				getPMDriverStatus: this.getPromise(true),
				getITSServiceStatus: this.getPromise(true),
				getDYTCRevision: this.getPromise(true),
				getCQLCapability: this.getPromise(true),
				getTIOCapability: this.getPromise(true),
				setAutoModeSetting: this.getPromise(true),
				setManualModeSetting: this.getPromise(true),
				getManualModeSetting: this.getPromise(true),
				getAPSState: this.getPromise(true),
				getLegacyCQLCapability: this.getPromise(true),
				getLegacyTIOCapability: this.getPromise(true),
				getLegacyManualModeCapability: this.getPromise(true),
				getLegacyAutoModeState: this.getPromise(true),
				getLegacyManualModeState: this.getPromise(true),
				setLegacyAutoModeState: this.getPromise(true),
				setLegacyManualModeState: this.getPromise(true)

			}
		};
		// if (this.getPowerSettings() && this.getPowerSettings().its) {
		// 	return this.getPowerSettings().its;
		// }
		// return undefined;
		return devicePowerItsIntelligentCooling;
	}

	public getSmartPerformance() {
		return undefined;
	}

	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public async deviceFilter(filter) {
		if (this.phoenix) {
			try {
				const deviceFilterResult = await this.phoenix.deviceFilter.eval(filter);
				// console.log('In VantageShellService.deviceFilter. Filter: ', JSON.stringify(filter), deviceFilterResult);
				return deviceFilterResult;
			} catch (error) {
				console.log('In VantageShellService.deviceFilter. Error:', error);
				console.log('In VantageShellService.deviceFilter. returning mock true due to error.');
			}
			return true;
			// return await this.phoenix.deviceFilter(filter);
		}
		console.log('In VantageShellService.deviceFilter. returning mock true');
		return true;
	}
	public calcDeviceFilter(filter) {
		return Promise.resolve({
			ConnectedHomeSecurity: true,
			PrivacyTab: 'enabled',
			FeatureSearch: null,
			TileBSource: 'UPE'
		});
	}
	public getLogger(): any {
		if (this.shell) {
			return this.shell.Logger;
		}
		return undefined;
	}

	public getWindows(): any {
		const win: any = window;
		if (win.Windows) {
			return win.Windows;
		}
		return undefined;
	}

	public getPrivacyCore() {
		return {
			openInstaller: () => of(true),
			openUriInDefaultBrowser: (uri) => of(true),
			openFigleafByUrl: (uri) => of(true),
			sendContractToPlugin: (contract): any => {
				switch (contract.command) {
					case 'Get-InstalledBrowsers':
						return of({ browsers: ['chrome', 'firefox', 'edge'] });
					case 'Get-AccessiblePasswords':
						return of({ chrome: 11, firefox: 1, edge: 1 });
					case 'Get-MaskedPasswords':
						return of({
							edge: [
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								}
							],
							chrome: [
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								},
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								}
							],
							firefox: [
								{
									url: 'https://test.test.com/my.policy',
									domain: 'test.com',
									login: 't****',
									password: 't*************)'
								}
							]
						});
					case 'Get-VisitedWebsites':
						return of({
							visitedWebsites: [
								{
									domain: 'google.com',
									totalVisitsCount: 26871,
									lastVisitTimeUtc: '2019-10-24T10:50:28Z'
								},
								{
									domain: 'facebook.com',
									totalVisitsCount: 3715,
									lastVisitTimeUtc: '2019-10-24T08:16:21Z'
								}
							]
						});
				}
			}
		};
	}

	public getUserGuide() {
		if (this.phoenix && this.phoenix.userGuide) {
			return this.phoenix.userGuide;
		}
		return undefined;
	}

	public generateGuid() {
		if (this.phoenix && this.phoenix.metrics) {
			return this.phoenix.metrics.metricsComposer.getGuid();
		}

		return undefined;
	}

	public getCameraBlur(): any {
		const obj = {
			available: true,
			currentMode: 'Blur',
			enabled: true,
			errorCode: 0,
			supportedModes: ['Blur', 'Comic', 'Sketch']
		};
		const cameraBlur: any = {
			getCameraBlurSettings: this.getPromise(obj),
			setCameraBlurSettings: this.getPromise(obj)
		};
		return cameraBlur;
	}

	public getCPUOCStatus(): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingOverclock.getCpuOCStatus();
		}
		return undefined;
	}

	public setCPUOCStatus(CpuOCStatus: CPUOCStatus): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingOverclock.setCpuOCStatus(CpuOCStatus.cpuOCStatus);
		}
		return undefined;
	}

	public getGamingAllCapabilities(): any {
		const gamingAllCapabilities: any = {};
		const capablityObj = {
			fbnetFilter: true,
			networkBoostFeature: true,
			hybridModeFeature: true,
			optimizationFeature: true,
			xtuService: true,
			ledDriver: true,
			smartFanFeature: true,
			cpuInfoFeature: true,
			gpuInfoFeature: true,
			memoryInfoFeature: true,
			hddInfoFeature: true,
			winKeyLockFeature: true,
			touchpadLockFeature: true,
			cpuOCFeature: true,
			memOCFeature: true,
			ledSetFeature: true,
			macroKeyFeature: true
		};

		gamingAllCapabilities.getCapabilities = this.getPromise(capablityObj);
		return gamingAllCapabilities;
		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([ Phoenix.Features.Gaming ]);
		// 	}
		// 	console.log('CAP ############################', this.phoenix.gaming.gamingAllCapabilities);
		// 	return this.phoenix.gaming.gamingAllCapabilities;
		// }
		// return undefined;
	}

	public getGamingLighting(): any {
		const lightingObj = {
			LightPanelType: [32, 64],
			LedType_Complex: [268435456, 1, 2, 4, 8, 32, 64, 128],
			LedType_simple: [0],
			BrightAdjustLevel: 4,
			RGBfeature: 255
		};
		const obj = {
			biosDate: '08292018',
			biosVersion: 'R0PET47W 1.24 ',
			brand: 'Lenovo',
			country: 'us',
			cpuAddressWidth: '64',
			cpuArchitecture: 'AMD64',
			cpuinfo: {
				addressWidth: '64',
				name: 'Intel(R) Core(TM) i3-7020U CPU @ 2.30GHz',
				type: 'AMD64',
				vendor: 'GenuineIntel'
			},
			deviceId: '0879eb1af41243f0af686ffe29eff508f6d1eb99fef906b2417be2ea0f5787fc',
			eCVersion: '1.24',
			enclosureType: 'notebook',
			family: 'ThinkPad E480',
			firstRunDate: '2019-06-18T00:54:24',
			isGaming: this.isGamingDevice, // change value to true for gaming machine
			isSMode: false,
			locale: 'en',
			manufacturer: 'LENOVO',
			memorys: [
				{
					serialNumber: '8B264B0A',
					sizeInBytes: 4194304,
					type: 'DDR4'
				},
				{
					serialNumber: '4A7D0400',
					sizeInBytes: 8388608,
					type: 'DDR4'
				}
			],
			mt: '20KN',
			mtm: '20KNS0DD00',
			os: 'Windows',
			osBitness: '64',
			osName: 'Windows 10 Pro',
			osVersionString: '10.0.18362.356',
			serialnumber: 'PG01EBJS',
			sku: 'LENOVO_MT_20KN_BU_Think_FM_ThinkPad E480',
			subBrand: 'ThinkPad'
		};

		const profileObj = { didSuccess: true, profileId: 1, brightness: 2, lightInfo: [{ lightPanelType: 32, lightEffectType: 1, lightColor: 'FF0000' }, { lightPanelType: 64, lightEffectType: 1, lightColor: 'FF0000' }] };
		const gamingLighting: any = {
			getLightingProfileById: this.getPromise(profileObj),
			getLightingCapabilities: this.getPromise(lightingObj),
			getMachineInfo: this.getPromise(obj)
		};
		return gamingLighting;
	}
	public getGamingOverClock(): any {
		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
		// 	}
		// 	return this.phoenix.gaming.gamingOverclock;
		// }
		// return undefined;
		const gamingOverClock = {
			getCpuOCStatus: this.getPromise(true),
			getRamOCStatus: this.getPromise(true),
			setCpuOCStatus: this.getPromise(true),
			setRamOCStatus: this.getPromise(true),
		};
		return gamingOverClock;

	}

	public getIntelligentSensing(): any {
		const intelligentSensing = {
			GetHPDCapability: this.getPromise(true),
			GetHPDGlobalSetting: this.getPromise(true),
			SetHPDGlobalSetting: this.getPromise(true),
			GetHPDLeaveCapability: this.getPromise(true),
			GetHPDPresentLeaveSetting: this.getPromise(true),
			SetHPDPresentLeaveSetting: this.getPromise(true),
			GetHPDApproachCapability: this.getPromise(true),
			GetHPDApproachSetting: this.getPromise(true),
			GetHPDApproachDistance: this.getPromise(2),
			SetHPDApproachSetting: this.getPromise(true),
			GetHPDAutoAdjustCapability: this.getPromise(true),
			GetHPDAutoAdjustSetting: this.getPromise(true),
			SetHPDAutoAdjustSetting: this.getPromise(true),
			SetHPDApproachDistanceSetting: this.getPromise(true),
			GetHPDLeaveWait: this.getPromise(2),
			SetHPDLeaveWaitSetting: this.getPromise(true),
			HPDSettingReset: this.getPromise(true),
			GetFacialFeatureRegistered: this.getPromise(true),
			GetSmartSensecapability: this.getPromise(true),
			GetWalkingCapability: this.getPromise(true),
			GetWalkingSetting: this.getPromise(true),
			GetHPDSensorType: this.getPromise(true),
			GetWalkingCautionVisibility: this.getPromise(true),
			GetBrowsingCapability: this.getPromise(true),
			GetBrowsingSetting: this.getPromise(true),
			GetBrowsingTime: this.getPromise(30),
			SetWalkingMode: this.getPromise(true),
			setBrowsingMode: this.getPromise(true),
			SetBrowsingTime: this.getPromise(true),
			GetHPDLeaveSensitivityVisibility: this.getPromise(true),
			GetHPDLeaveSensitivity: this.getPromise(true),
			SetHPDLeaveSensitivitySetting: this.getPromise(true),
			getLockFacialRecognitionSettings: this.getPromise(true),
			setLockFacialRecognitionSettings: this.getPromise(true)
		};
		return intelligentSensing;
	}

	public getMetricPreferencePlugin() {
		if (this.phoenix) {
			return this.phoenix.genericMetricsPreference;
		}
	}

	public getGamingKeyLock() {

		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
		// 	}

		// 	return this.phoenix.gaming.gamingKeyLock;
		// }
		const gamingKeyLock: any = {
			getKeyLockStatus: this.getPromise(true),
			setKeyLockStatus: this.getPromise(true)
		};
		return gamingKeyLock;
		//return undefined;
	}

	public getGamingHybridMode() {

		const gamingHybridMode: any = {
			getHybridModeStatus: this.getPromise(true),
			setHybridModeStatus: this.getPromise(true)
		};
		return gamingHybridMode;

	}

	public getGamingHwInfo() {
		const gamingHwInfo: any = {
			getDynamicInformation: this.getPromise(true),
			getMachineInfomation: this.getPromise(true)
		};

		const hwINFOObj = {
			cpuBaseFrequence: '1.80GHz',
			cpuModuleName: 'Intel(R) Core(TM) i10-8250U CPU @ 1.60GHz',
			gpuMemorySize: '4GB',
			gpuModuleName: 'Intel(R) UHD Graphics 620',
			memorySize: '8.0GB',
			memoryModuleName: 'Samsung'
		};
		gamingHwInfo.getMachineInfomation = this.getPromise(hwINFOObj);
		return gamingHwInfo;
		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([ Phoenix.Features.Gaming ]);
		// 	}
		// 	return this.phoenix.gaming.gamingHwInfo;
		// }
		// return undefined;
	}




	public getIntelligentMedia(): any {
		const media = {
			getVideoPauseResumeStatus: this.getPromise({ available: true, status: true }),
			setVideoPauseResumeStatus: this.getPromise(true)
		};
		return media;
	}

	public getPreferenceSettings() {
		if (this.phoenix) {
			return this.phoenix.preferenceSettings;
		}
	}
	public getNetworkBoost() {
		const runningList: any = {
			processList: [{
				processDescription: 'Google Chrome',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,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'
			}, {
				processDescription: 'InputApp',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft Teams',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVFhHYxiyoLz+uUJ10+v+ysaX+0EYxAaJQaVpC6qaXiZUN7/+jw2D5KDKaAPAPsdiMTKmaUiAghqbpSgYqAaqHAwCIk/2A/F/JIwiTxIAxzc2S5EwSA1UOTbLKXMEGQ7AZjkYQ5WQBvJKL/XnlV3+j4wLKm6gOgIpCrBZDMP+4ccVGLyD9pz3Dt7znxzsFbTpv1/wVLAjkB2AnAixWQzDYAXYDCYFu3m3ozgAPRsCLcKfBrAZSgp29Wzdn1t6EW9BBLIMq+UggG4gIYCuHmoM+QDdQEIAXT16FKDj4uqnyD5HxeHHz+ONAhjAJgfDhBwAwlgth+JRB4w6YNQBg9sBxOCh7oD7FFXH7v5rKXKAf+TJBmiNgB9Y2OT8x4at7Qv/e/r3kueA8JProcYTBhGxK/dHxK38jwtjtIiQcFHlk/dAC+8jWX6faJ/DQFLWnoSkzD3/seH0vKNYLYZhqvUTgA2O89gswIuBeqDaKQeg1k5l88v3WC3CgkFqqd5BARlIVEgA1VDdcmQAilds/QOQGM37htQFDAwAyVPg8+K1GtYAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.MicrosoftEdge',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHVSURBVFhHxZc9SgRBEIX3CB7BI3gEj+ARPIKpmaZGYmoiGJoYGBqYGAomsiDiD8iCCLogogjSzrdMDzW9r6d7enR98Jidmq6uV9W/Oxptjt2/UhoXSWmMcHX/wR1cTN3l5NMpnN2+u42TJ7e8cyP9JaUx4Nrho7t//arD5AGhWUKksebS9rU7vnqru+yP6ce3Wz+ayL4bSmNFgsdK3RedIpTxN4N7REUo4+75S+02D+YCw7J1+tyQyZcCwyHnRGhgpofAGVEre3ez6sDQj85TVUN46DcnIMyGDH1Qn23o40kbxHZhrgr2hY8eZEPG2Hn67FJLC5FdoJItH/vCJgII5stMcJ+VLGFANYQW9N3ysS+U1wbn6TMHCLTtFfFJoeVjX2xwGJaT74hMMQWq1MRtflS0HxCSmlCliAqwZOP4K2QJGHIGpJAlIGcsS5ElQCF3Eqbo95cZbVBLBVaFajuI0lgRpSGwqbaDKI0VY5OQ25FqX0xprBhbhuwNfURwdnA9iw6fNFZMbUQMR0wIQUnADmNvATB1snnY1RETXSQgPIyGoEgAtMfxEBQLgPZCUopBAiDDQSd9q0H7zj8p0thBhHAxsTM8BNUiaNZylcZFUhoXxrH7AZdMAv2haziRAAAAAElFTkSuQmCC'
			}, {
				processDescription: 'Microsoft.MicrosoftEdgeDevToolsPreview',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.WindowsMaps',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.WindowsStore',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.ZuneVideo',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Skype for Business(UcMapi)',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP8SURBVFhHzZfPb4xBGMdHEUIlLiQSwcGdIyeOTvgLcHMQIQ4cuTg5cBAhIbhK9t1VNHFRURGHSmmIixAHpK28O20X/bHb8XzmnVnzvp33bSsOnuSb3e7M82Oe31X/J9VaW1Siz6u6HlI1PSmfRjAl35+pevO0ujfaq26Y1fJ9ozJmheP6R5Q0z4iillMaRU8jnQn/XpnoVk9Dv1ZJel010oPWuGUTL6nrWwhccz/tnHzz0wx+nzOj0x0zJngyPmtOjfw0Gx5M5IyJYWUjHZPPc+q2WeukL4HqzbMwb+3Xc28n28aY+Sgwpv511ryXO83ZjsWHVtvUvsyYE2L05v4/BvYk+qNKJvY6DRXUl25TtXSal1cpXwpmOvPm2sdps8kZIuFqS2iOOk0llDQvchm3x4T+DcZnOubAi1bXG9VG1PQwl4h5TFiITz/a5vKHaXP+/S+zb3DK5gXfh/VC3vb8vDky9CPwRFk46uksl0i4ohAPYn30VSasDNsfT9r8CPkwwnvC5kQ0MZ0AEixk9kD5ridTOWVVwEMhP+HwOSE457QGRJORQ0otZPRAoGO22D/YMg156dPxOYvTEobwHBCqUAaJye9SoqML+4TtcNrGM2TyINZe8MaHE9YjxTvkAGf+XjEnqI6uF2hWOaK9ygFNBneFjCA0gDgXzz1QekESspgHHvQJK4eOmSPp7b69JhHmQy+DchKQDyiJeaIKNCv4bdvOkR0smfB3kUZ0+3PGGAPGEDruLGYQHRMeZofT7Iip5gSWCYklWgyUapkMfu/ezU3RbBDZg6pXDEiVHBMFYbLFgFdicnIG8OiQrFvkADcVGWMg4a5IeR6W/IgZhCeKPIS3e2fArHKqM7KJIQckSpFxKcCYrnBBrFpIcM5swrPU5IjSkENKpchIknFW5lqPHaLUGwCK53Ta3u4+IaWfI5qDHNAsaBohYygUI8Izj3x8tdldcs8/xja/HEkp2jYph7TNkGmxPkAJ4vLwDhMylOFBu3d3ppzmgBgUcogXwo5IX18s80OUvR4Qhu7dBSSj0o5MOWSEMko9I6+lBLvMJaBfVOUJI9/eraVzTmuBZGmwy4NcYpkIjQB44464nJ6PQZQh3/mtOAFjYOnJDNAjTmOEWJ/ci/BEbED9LVj7rOxEX3LaSkiM8J4gJ0jMYnUsFyy8LL6ygbXVfb3TaaogwuFywhtCn6BZ0TGJNWBFpyrKNiqAclb+TFbzqtOwBGKHk+rwJVoF9gnqnFLDGBKOmOP27OXcaz5X/WaNk74MYmTTrKRj0rb97PDw+0QlEn1X9X1Z5yT+A7JTVKYaxj3+tl6UHJf/MR7Jb98ypbJt1/QnwU1Vm9jjuP4nUuo3Rc+6UWVSJz8AAAAASUVORK5CYII='
			}, {
				processDescription: 'Skype for Business(lync)',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP8SURBVFhHzZfPb4xBGMdHEUIlLiQSwcGdIyeOTvgLcHMQIQ4cuTg5cBAhIbhK9t1VNHFRURGHSmmIixAHpK28O20X/bHb8XzmnVnzvp33bSsOnuSb3e7M82Oe31X/J9VaW1Siz6u6HlI1PSmfRjAl35+pevO0ujfaq26Y1fJ9ozJmheP6R5Q0z4iillMaRU8jnQn/XpnoVk9Dv1ZJel010oPWuGUTL6nrWwhccz/tnHzz0wx+nzOj0x0zJngyPmtOjfw0Gx5M5IyJYWUjHZPPc+q2WeukL4HqzbMwb+3Xc28n28aY+Sgwpv511ryXO83ZjsWHVtvUvsyYE2L05v4/BvYk+qNKJvY6DRXUl25TtXSal1cpXwpmOvPm2sdps8kZIuFqS2iOOk0llDQvchm3x4T+DcZnOubAi1bXG9VG1PQwl4h5TFiITz/a5vKHaXP+/S+zb3DK5gXfh/VC3vb8vDky9CPwRFk46uksl0i4ohAPYn30VSasDNsfT9r8CPkwwnvC5kQ0MZ0AEixk9kD5ridTOWVVwEMhP+HwOSE457QGRJORQ0otZPRAoGO22D/YMg156dPxOYvTEobwHBCqUAaJye9SoqML+4TtcNrGM2TyINZe8MaHE9YjxTvkAGf+XjEnqI6uF2hWOaK9ygFNBneFjCA0gDgXzz1QekESspgHHvQJK4eOmSPp7b69JhHmQy+DchKQDyiJeaIKNCv4bdvOkR0smfB3kUZ0+3PGGAPGEDruLGYQHRMeZofT7Iip5gSWCYklWgyUapkMfu/ezU3RbBDZg6pXDEiVHBMFYbLFgFdicnIG8OiQrFvkADcVGWMg4a5IeR6W/IgZhCeKPIS3e2fArHKqM7KJIQckSpFxKcCYrnBBrFpIcM5swrPU5IjSkENKpchIknFW5lqPHaLUGwCK53Ta3u4+IaWfI5qDHNAsaBohYygUI8Izj3x8tdldcs8/xja/HEkp2jYph7TNkGmxPkAJ4vLwDhMylOFBu3d3ppzmgBgUcogXwo5IX18s80OUvR4Qhu7dBSSj0o5MOWSEMko9I6+lBLvMJaBfVOUJI9/eraVzTmuBZGmwy4NcYpkIjQB44464nJ6PQZQh3/mtOAFjYOnJDNAjTmOEWJ/ci/BEbED9LVj7rOxEX3LaSkiM8J4gJ0jMYnUsFyy8LL6ygbXVfb3TaaogwuFywhtCn6BZ0TGJNWBFpyrKNiqAclb+TFbzqtOwBGKHk+rwJVoF9gnqnFLDGBKOmOP27OXcaz5X/WaNk74MYmTTrKRj0rb97PDw+0QlEn1X9X1Z5yT+A7JTVKYaxj3+tl6UHJf/MR7Jb98ypbJt1/QnwU1Vm9jjuP4nUuo3Rc+6UWVSJz8AAAAASUVORK5CYII='
			}, {
				processDescription: 'Visual Studio Code',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP0SURBVFhHtZfbT5tlHMd/9GCh21JZp9kFSA8DF73RaHZh4oWLXnjpf2C80CxCB7JyWimHHhiwUsQZo/M4HIcNKNC1UMs2k7m4LaNd25dyYUxGkHioF2u7u7E8/t6nz7aCb5+Xw/pNPlfv8/w+3/d52iaFYuRlx+U3qkdWblcO3/236txqynBm2cseFT+iXGVbyIL9ClG7r5MXL92nmCdT66YvfjvPlhUnLzmvvq86Gc5C+2XyiBr//Q2YJ1LrhmIUMXSELGBD6SZq/FlJTBdT62ZP4i22fXd5wR6ug5MLRIqaWRQWwDT29xobsfPo20OT0BYmhaiZQRkHNmZnedYWmpCS5lM9neXCRm0vh1vCel1rKAytPxE5qn0o4kAH6geEr+HTJBHZM7h08/BnST19IBFRXtocWoaWENkKUtJ8QO8VzsLgEslHObCUrfIuvcucj0PlTcFlaMbhMiitwewh50J99RSKOIDWE78BXhRLcMAj9DM3GNvmj6ha5tagaZ7IIZYU1xNC9hyazBIesPe0EIIBgRRC05f4tbJr4R1F01wGrHNEDl1L4IJ4UmJpWmAiQ3iAeN+afiEJHhQWoj/6EFrxe20NFkTRGMw81xw8Ro+LBQtopaT50IW5ErEknEYZD/s1AidQuAlNYyBZ0eQ/QoflhRa4iCIObGku+3oT49CfwDfm4LiFUjzuxgBlnzUwXtEwv5+N2BAsUGa+kCE82NIn2dsXG4M+FPHoieInPUx0jTPNbJtkaIFxFHFgS59Ee2J2FDquE+iNy6LricsVKDWPoYgDW5qL9hOUN/gJpe0qgVMokkHrjo9WeIRCV7C1AuIdKhtmBaifJRtovYLHjSIZlO64oO+Nv06H5QULaEyjGcIjJ7f4BDiOQims+JvuWnwI7hjhUeKOpfFKPmRuGlpgBEUcQFM/EwDLDCmE2uL7Ree4cbTEFUuDC2UylLmiI4+uBAs8YzqfJjxAFIBlGmX/p+z4tIu+CkbXHX9N6YyugvMOkUPhiCTE9VsqUFo39TnUoTCPko+n0rr66beZ+3HwiMsV3ZEEOFAkQ4nzTrr8VPQj449pwoMOVtf6zkCtj4goan3XdMculdMHEtlOCRHjMIo4sLHbi1hC3RXxQzf+IMlgPIciDmzkzqLqjAxDF4o4GH9AEQc2audR2bFEZ4QUwoASHmzM7qLuWPwAOlAogeF7FBWg8qt/VtiI3UdtwxJ2lG7C8N09SSrPph4cGPj9Tbb96UTZfvs9aF+8h+DfshyGb1GYB771A/3gyjdsy9OP2nbrVbBhCdsiUXXGSRVKRSq+LLJ4Q9puvvL80B8/64dW/zo4tPbnfu/dHvZkUwD+A8E98pKW4pfHAAAAAElFTkSuQmCC'
			}, {
				processDescription: 'windows.immersivecontrolpanel',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHMSURBVFhHxZUxSgRBEEX3CB7Bo3gEj2O4qZG5ieA5DA0FwwURRBATQc0UQcZ96xbW/v5TM4swU/Bg+3d1dXdVTe9icbLqZsWKU2LFKbFiD8eXT93y6qU7PL1v5tCYw0fnSqwoEPTh9asLO7t+bXzYPAzf0QexonBx874N/WtvH9+ND1o21qiPxYrC0fnjNuyfsQG3Bj0gxhoXq8GKhtvnz23oYaMELobFigINlntgyPA9WN7ZWA0q0DykNFJIIK1vGHo1F18LsYhpG1OFfFN+680JTN3zDfmNpodhbS4d47zXhjzghJURrEotc0O90mQhD/K3rMbtqs0DfPrKgrHHzpo8iNfMBWgWFriLEJMHrHlFdwYJ/bbH3D7ANxuxnN8GK67Jt+D0zqciZ7HMnhXXzH6AWUpAg9Ao+fRh5S2EnL0wYqKXTegWhhFgTBbwcRcIay6SB7M/RJCfXoL99ynO6wefYuCENE38GVGzvpSiV3NxyL3+jBwE0kxUhm/OUIkVDfscgNK5GBYrCqRQjZRSd9A3A4sSDmJFQTegvuqjvcAa9bFYUaB5cgmab3kND1gYvrbhHFbsgaD6CQbxVz5648CKU2LFKbHiZKy6H/tgIDQUAVyRAAAAAElFTkSuQmCC'
			}]
		};

		const networkBoostList: any = {
			processList: [{
				processDescription: 'Google Chrome',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,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'
			}, {
				processDescription: 'InputApp',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft Teams',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVFhHYxiyoLz+uUJ10+v+ysaX+0EYxAaJQaVpC6qaXiZUN7/+jw2D5KDKaAPAPsdiMTKmaUiAghqbpSgYqAaqHAwCIk/2A/F/JIwiTxIAxzc2S5EwSA1UOTbLKXMEGQ7AZjkYQ5WQBvJKL/XnlV3+j4wLKm6gOgIpCrBZDMP+4ccVGLyD9pz3Dt7znxzsFbTpv1/wVLAjkB2AnAixWQzDYAXYDCYFu3m3ozgAPRsCLcKfBrAZSgp29Wzdn1t6EW9BBLIMq+UggG4gIYCuHmoM+QDdQEIAXT16FKDj4uqnyD5HxeHHz+ONAhjAJgfDhBwAwlgth+JRB4w6YNQBg9sBxOCh7oD7FFXH7v5rKXKAf+TJBmiNgB9Y2OT8x4at7Qv/e/r3kueA8JProcYTBhGxK/dHxK38jwtjtIiQcFHlk/dAC+8jWX6faJ/DQFLWnoSkzD3/seH0vKNYLYZhqvUTgA2O89gswIuBeqDaKQeg1k5l88v3WC3CgkFqqd5BARlIVEgA1VDdcmQAilds/QOQGM37htQFDAwAyVPg8+K1GtYAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.MicrosoftEdge',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHVSURBVFhHxZc9SgRBEIX3CB7BI3gEj+ARPIKpmaZGYmoiGJoYGBqYGAomsiDiD8iCCLogogjSzrdMDzW9r6d7enR98Jidmq6uV9W/Oxptjt2/UhoXSWmMcHX/wR1cTN3l5NMpnN2+u42TJ7e8cyP9JaUx4Nrho7t//arD5AGhWUKksebS9rU7vnqru+yP6ce3Wz+ayL4bSmNFgsdK3RedIpTxN4N7REUo4+75S+02D+YCw7J1+tyQyZcCwyHnRGhgpofAGVEre3ez6sDQj85TVUN46DcnIMyGDH1Qn23o40kbxHZhrgr2hY8eZEPG2Hn67FJLC5FdoJItH/vCJgII5stMcJ+VLGFANYQW9N3ysS+U1wbn6TMHCLTtFfFJoeVjX2xwGJaT74hMMQWq1MRtflS0HxCSmlCliAqwZOP4K2QJGHIGpJAlIGcsS5ElQCF3Eqbo95cZbVBLBVaFajuI0lgRpSGwqbaDKI0VY5OQ25FqX0xprBhbhuwNfURwdnA9iw6fNFZMbUQMR0wIQUnADmNvATB1snnY1RETXSQgPIyGoEgAtMfxEBQLgPZCUopBAiDDQSd9q0H7zj8p0thBhHAxsTM8BNUiaNZylcZFUhoXxrH7AZdMAv2haziRAAAAAElFTkSuQmCC'
			}]
		};

		const gamingNetworkBoost: any = {
			getProcessesInNetworkBoost: this.getPromise(networkBoostList),
			getNetUsingProcesses: this.getPromise(runningList),
			getStatus: this.getPromise(true),
			setStatus: this.getPromise(true),
			addProcessToNetBoost: this.getPromise(true)
		};
		return gamingNetworkBoost;
	}

	public getGamingAutoClose() {
		const runningList: any = {
			processList: [{
				processDescription: 'Google Chrome',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,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'
			}, {
				processDescription: 'InputApp',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft Teams',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVFhHYxiyoLz+uUJ10+v+ysaX+0EYxAaJQaVpC6qaXiZUN7/+jw2D5KDKaAPAPsdiMTKmaUiAghqbpSgYqAaqHAwCIk/2A/F/JIwiTxIAxzc2S5EwSA1UOTbLKXMEGQ7AZjkYQ5WQBvJKL/XnlV3+j4wLKm6gOgIpCrBZDMP+4ccVGLyD9pz3Dt7znxzsFbTpv1/wVLAjkB2AnAixWQzDYAXYDCYFu3m3ozgAPRsCLcKfBrAZSgp29Wzdn1t6EW9BBLIMq+UggG4gIYCuHmoM+QDdQEIAXT16FKDj4uqnyD5HxeHHz+ONAhjAJgfDhBwAwlgth+JRB4w6YNQBg9sBxOCh7oD7FFXH7v5rKXKAf+TJBmiNgB9Y2OT8x4at7Qv/e/r3kueA8JProcYTBhGxK/dHxK38jwtjtIiQcFHlk/dAC+8jWX6faJ/DQFLWnoSkzD3/seH0vKNYLYZhqvUTgA2O89gswIuBeqDaKQeg1k5l88v3WC3CgkFqqd5BARlIVEgA1VDdcmQAilds/QOQGM37htQFDAwAyVPg8+K1GtYAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.MicrosoftEdge',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHVSURBVFhHxZc9SgRBEIX3CB7BI3gEj+ARPIKpmaZGYmoiGJoYGBqYGAomsiDiD8iCCLogogjSzrdMDzW9r6d7enR98Jidmq6uV9W/Oxptjt2/UhoXSWmMcHX/wR1cTN3l5NMpnN2+u42TJ7e8cyP9JaUx4Nrho7t//arD5AGhWUKksebS9rU7vnqru+yP6ce3Wz+ayL4bSmNFgsdK3RedIpTxN4N7REUo4+75S+02D+YCw7J1+tyQyZcCwyHnRGhgpofAGVEre3ez6sDQj85TVUN46DcnIMyGDH1Qn23o40kbxHZhrgr2hY8eZEPG2Hn67FJLC5FdoJItH/vCJgII5stMcJ+VLGFANYQW9N3ysS+U1wbn6TMHCLTtFfFJoeVjX2xwGJaT74hMMQWq1MRtflS0HxCSmlCliAqwZOP4K2QJGHIGpJAlIGcsS5ElQCF3Eqbo95cZbVBLBVaFajuI0lgRpSGwqbaDKI0VY5OQ25FqX0xprBhbhuwNfURwdnA9iw6fNFZMbUQMR0wIQUnADmNvATB1snnY1RETXSQgPIyGoEgAtMfxEBQLgPZCUopBAiDDQSd9q0H7zj8p0thBhHAxsTM8BNUiaNZylcZFUhoXxrH7AZdMAv2haziRAAAAAElFTkSuQmCC'
			}, {
				processDescription: 'Microsoft.MicrosoftEdgeDevToolsPreview',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.WindowsMaps',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.WindowsStore',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.ZuneVideo',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Skype for Business(UcMapi)',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP8SURBVFhHzZfPb4xBGMdHEUIlLiQSwcGdIyeOTvgLcHMQIQ4cuTg5cBAhIbhK9t1VNHFRURGHSmmIixAHpK28O20X/bHb8XzmnVnzvp33bSsOnuSb3e7M82Oe31X/J9VaW1Siz6u6HlI1PSmfRjAl35+pevO0ujfaq26Y1fJ9ozJmheP6R5Q0z4iillMaRU8jnQn/XpnoVk9Dv1ZJel010oPWuGUTL6nrWwhccz/tnHzz0wx+nzOj0x0zJngyPmtOjfw0Gx5M5IyJYWUjHZPPc+q2WeukL4HqzbMwb+3Xc28n28aY+Sgwpv511ryXO83ZjsWHVtvUvsyYE2L05v4/BvYk+qNKJvY6DRXUl25TtXSal1cpXwpmOvPm2sdps8kZIuFqS2iOOk0llDQvchm3x4T+DcZnOubAi1bXG9VG1PQwl4h5TFiITz/a5vKHaXP+/S+zb3DK5gXfh/VC3vb8vDky9CPwRFk46uksl0i4ohAPYn30VSasDNsfT9r8CPkwwnvC5kQ0MZ0AEixk9kD5ridTOWVVwEMhP+HwOSE457QGRJORQ0otZPRAoGO22D/YMg156dPxOYvTEobwHBCqUAaJye9SoqML+4TtcNrGM2TyINZe8MaHE9YjxTvkAGf+XjEnqI6uF2hWOaK9ygFNBneFjCA0gDgXzz1QekESspgHHvQJK4eOmSPp7b69JhHmQy+DchKQDyiJeaIKNCv4bdvOkR0smfB3kUZ0+3PGGAPGEDruLGYQHRMeZofT7Iip5gSWCYklWgyUapkMfu/ezU3RbBDZg6pXDEiVHBMFYbLFgFdicnIG8OiQrFvkADcVGWMg4a5IeR6W/IgZhCeKPIS3e2fArHKqM7KJIQckSpFxKcCYrnBBrFpIcM5swrPU5IjSkENKpchIknFW5lqPHaLUGwCK53Ta3u4+IaWfI5qDHNAsaBohYygUI8Izj3x8tdldcs8/xja/HEkp2jYph7TNkGmxPkAJ4vLwDhMylOFBu3d3ppzmgBgUcogXwo5IX18s80OUvR4Qhu7dBSSj0o5MOWSEMko9I6+lBLvMJaBfVOUJI9/eraVzTmuBZGmwy4NcYpkIjQB44464nJ6PQZQh3/mtOAFjYOnJDNAjTmOEWJ/ci/BEbED9LVj7rOxEX3LaSkiM8J4gJ0jMYnUsFyy8LL6ygbXVfb3TaaogwuFywhtCn6BZ0TGJNWBFpyrKNiqAclb+TFbzqtOwBGKHk+rwJVoF9gnqnFLDGBKOmOP27OXcaz5X/WaNk74MYmTTrKRj0rb97PDw+0QlEn1X9X1Z5yT+A7JTVKYaxj3+tl6UHJf/MR7Jb98ypbJt1/QnwU1Vm9jjuP4nUuo3Rc+6UWVSJz8AAAAASUVORK5CYII='
			}, {
				processDescription: 'Skype for Business(lync)',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP8SURBVFhHzZfPb4xBGMdHEUIlLiQSwcGdIyeOTvgLcHMQIQ4cuTg5cBAhIbhK9t1VNHFRURGHSmmIixAHpK28O20X/bHb8XzmnVnzvp33bSsOnuSb3e7M82Oe31X/J9VaW1Siz6u6HlI1PSmfRjAl35+pevO0ujfaq26Y1fJ9ozJmheP6R5Q0z4iillMaRU8jnQn/XpnoVk9Dv1ZJel010oPWuGUTL6nrWwhccz/tnHzz0wx+nzOj0x0zJngyPmtOjfw0Gx5M5IyJYWUjHZPPc+q2WeukL4HqzbMwb+3Xc28n28aY+Sgwpv511ryXO83ZjsWHVtvUvsyYE2L05v4/BvYk+qNKJvY6DRXUl25TtXSal1cpXwpmOvPm2sdps8kZIuFqS2iOOk0llDQvchm3x4T+DcZnOubAi1bXG9VG1PQwl4h5TFiITz/a5vKHaXP+/S+zb3DK5gXfh/VC3vb8vDky9CPwRFk46uksl0i4ohAPYn30VSasDNsfT9r8CPkwwnvC5kQ0MZ0AEixk9kD5ridTOWVVwEMhP+HwOSE457QGRJORQ0otZPRAoGO22D/YMg156dPxOYvTEobwHBCqUAaJye9SoqML+4TtcNrGM2TyINZe8MaHE9YjxTvkAGf+XjEnqI6uF2hWOaK9ygFNBneFjCA0gDgXzz1QekESspgHHvQJK4eOmSPp7b69JhHmQy+DchKQDyiJeaIKNCv4bdvOkR0smfB3kUZ0+3PGGAPGEDruLGYQHRMeZofT7Iip5gSWCYklWgyUapkMfu/ezU3RbBDZg6pXDEiVHBMFYbLFgFdicnIG8OiQrFvkADcVGWMg4a5IeR6W/IgZhCeKPIS3e2fArHKqM7KJIQckSpFxKcCYrnBBrFpIcM5swrPU5IjSkENKpchIknFW5lqPHaLUGwCK53Ta3u4+IaWfI5qDHNAsaBohYygUI8Izj3x8tdldcs8/xja/HEkp2jYph7TNkGmxPkAJ4vLwDhMylOFBu3d3ppzmgBgUcogXwo5IX18s80OUvR4Qhu7dBSSj0o5MOWSEMko9I6+lBLvMJaBfVOUJI9/eraVzTmuBZGmwy4NcYpkIjQB44464nJ6PQZQh3/mtOAFjYOnJDNAjTmOEWJ/ci/BEbED9LVj7rOxEX3LaSkiM8J4gJ0jMYnUsFyy8LL6ygbXVfb3TaaogwuFywhtCn6BZ0TGJNWBFpyrKNiqAclb+TFbzqtOwBGKHk+rwJVoF9gnqnFLDGBKOmOP27OXcaz5X/WaNk74MYmTTrKRj0rb97PDw+0QlEn1X9X1Z5yT+A7JTVKYaxj3+tl6UHJf/MR7Jb98ypbJt1/QnwU1Vm9jjuP4nUuo3Rc+6UWVSJz8AAAAASUVORK5CYII='
			}, {
				processDescription: 'Visual Studio Code',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP0SURBVFhHtZfbT5tlHMd/9GCh21JZp9kFSA8DF73RaHZh4oWLXnjpf2C80CxCB7JyWimHHhiwUsQZo/M4HIcNKNC1UMs2k7m4LaNd25dyYUxGkHioF2u7u7E8/t6nz7aCb5+Xw/pNPlfv8/w+3/d52iaFYuRlx+U3qkdWblcO3/236txqynBm2cseFT+iXGVbyIL9ClG7r5MXL92nmCdT66YvfjvPlhUnLzmvvq86Gc5C+2XyiBr//Q2YJ1LrhmIUMXSELGBD6SZq/FlJTBdT62ZP4i22fXd5wR6ug5MLRIqaWRQWwDT29xobsfPo20OT0BYmhaiZQRkHNmZnedYWmpCS5lM9neXCRm0vh1vCel1rKAytPxE5qn0o4kAH6geEr+HTJBHZM7h08/BnST19IBFRXtocWoaWENkKUtJ8QO8VzsLgEslHObCUrfIuvcucj0PlTcFlaMbhMiitwewh50J99RSKOIDWE78BXhRLcMAj9DM3GNvmj6ha5tagaZ7IIZYU1xNC9hyazBIesPe0EIIBgRRC05f4tbJr4R1F01wGrHNEDl1L4IJ4UmJpWmAiQ3iAeN+afiEJHhQWoj/6EFrxe20NFkTRGMw81xw8Ro+LBQtopaT50IW5ErEknEYZD/s1AidQuAlNYyBZ0eQ/QoflhRa4iCIObGku+3oT49CfwDfm4LiFUjzuxgBlnzUwXtEwv5+N2BAsUGa+kCE82NIn2dsXG4M+FPHoieInPUx0jTPNbJtkaIFxFHFgS59Ee2J2FDquE+iNy6LricsVKDWPoYgDW5qL9hOUN/gJpe0qgVMokkHrjo9WeIRCV7C1AuIdKhtmBaifJRtovYLHjSIZlO64oO+Nv06H5QULaEyjGcIjJ7f4BDiOQims+JvuWnwI7hjhUeKOpfFKPmRuGlpgBEUcQFM/EwDLDCmE2uL7Ree4cbTEFUuDC2UylLmiI4+uBAs8YzqfJjxAFIBlGmX/p+z4tIu+CkbXHX9N6YyugvMOkUPhiCTE9VsqUFo39TnUoTCPko+n0rr66beZ+3HwiMsV3ZEEOFAkQ4nzTrr8VPQj449pwoMOVtf6zkCtj4goan3XdMculdMHEtlOCRHjMIo4sLHbi1hC3RXxQzf+IMlgPIciDmzkzqLqjAxDF4o4GH9AEQc2audR2bFEZ4QUwoASHmzM7qLuWPwAOlAogeF7FBWg8qt/VtiI3UdtwxJ2lG7C8N09SSrPph4cGPj9Tbb96UTZfvs9aF+8h+DfshyGb1GYB771A/3gyjdsy9OP2nbrVbBhCdsiUXXGSRVKRSq+LLJ4Q9puvvL80B8/64dW/zo4tPbnfu/dHvZkUwD+A8E98pKW4pfHAAAAAElFTkSuQmCC'
			}, {
				processDescription: 'windows.immersivecontrolpanel',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHMSURBVFhHxZUxSgRBEEX3CB7Bo3gEj2O4qZG5ieA5DA0FwwURRBATQc0UQcZ96xbW/v5TM4swU/Bg+3d1dXdVTe9icbLqZsWKU2LFKbFiD8eXT93y6qU7PL1v5tCYw0fnSqwoEPTh9asLO7t+bXzYPAzf0QexonBx874N/WtvH9+ND1o21qiPxYrC0fnjNuyfsQG3Bj0gxhoXq8GKhtvnz23oYaMELobFigINlntgyPA9WN7ZWA0q0DykNFJIIK1vGHo1F18LsYhpG1OFfFN+680JTN3zDfmNpodhbS4d47zXhjzghJURrEotc0O90mQhD/K3rMbtqs0DfPrKgrHHzpo8iNfMBWgWFriLEJMHrHlFdwYJ/bbH3D7ANxuxnN8GK67Jt+D0zqciZ7HMnhXXzH6AWUpAg9Ao+fRh5S2EnL0wYqKXTegWhhFgTBbwcRcIay6SB7M/RJCfXoL99ynO6wefYuCENE38GVGzvpSiV3NxyL3+jBwE0kxUhm/OUIkVDfscgNK5GBYrCqRQjZRSd9A3A4sSDmJFQTegvuqjvcAa9bFYUaB5cgmab3kND1gYvrbhHFbsgaD6CQbxVz5648CKU2LFKbHiZKy6H/tgIDQUAVyRAAAAAElFTkSuQmCC'
			}]
		};

		const autoCloseList: any = {
			processList: [{
				processDescription: 'Google Chrome',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,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'
			}, {
				processDescription: 'InputApp',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft Teams',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVFhHYxiyoLz+uUJ10+v+ysaX+0EYxAaJQaVpC6qaXiZUN7/+jw2D5KDKaAPAPsdiMTKmaUiAghqbpSgYqAaqHAwCIk/2A/F/JIwiTxIAxzc2S5EwSA1UOTbLKXMEGQ7AZjkYQ5WQBvJKL/XnlV3+j4wLKm6gOgIpCrBZDMP+4ccVGLyD9pz3Dt7znxzsFbTpv1/wVLAjkB2AnAixWQzDYAXYDCYFu3m3ozgAPRsCLcKfBrAZSgp29Wzdn1t6EW9BBLIMq+UggG4gIYCuHmoM+QDdQEIAXT16FKDj4uqnyD5HxeHHz+ONAhjAJgfDhBwAwlgth+JRB4w6YNQBg9sBxOCh7oD7FFXH7v5rKXKAf+TJBmiNgB9Y2OT8x4at7Qv/e/r3kueA8JProcYTBhGxK/dHxK38jwtjtIiQcFHlk/dAC+8jWX6faJ/DQFLWnoSkzD3/seH0vKNYLYZhqvUTgA2O89gswIuBeqDaKQeg1k5l88v3WC3CgkFqqd5BARlIVEgA1VDdcmQAilds/QOQGM37htQFDAwAyVPg8+K1GtYAAAAASUVORK5CYII='
			}, {
				processDescription: 'Microsoft.MicrosoftEdge',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHVSURBVFhHxZc9SgRBEIX3CB7BI3gEj+ARPIKpmaZGYmoiGJoYGBqYGAomsiDiD8iCCLogogjSzrdMDzW9r6d7enR98Jidmq6uV9W/Oxptjt2/UhoXSWmMcHX/wR1cTN3l5NMpnN2+u42TJ7e8cyP9JaUx4Nrho7t//arD5AGhWUKksebS9rU7vnqru+yP6ce3Wz+ayL4bSmNFgsdK3RedIpTxN4N7REUo4+75S+02D+YCw7J1+tyQyZcCwyHnRGhgpofAGVEre3ez6sDQj85TVUN46DcnIMyGDH1Qn23o40kbxHZhrgr2hY8eZEPG2Hn67FJLC5FdoJItH/vCJgII5stMcJ+VLGFANYQW9N3ysS+U1wbn6TMHCLTtFfFJoeVjX2xwGJaT74hMMQWq1MRtflS0HxCSmlCliAqwZOP4K2QJGHIGpJAlIGcsS5ElQCF3Eqbo95cZbVBLBVaFajuI0lgRpSGwqbaDKI0VY5OQ25FqX0xprBhbhuwNfURwdnA9iw6fNFZMbUQMR0wIQUnADmNvATB1snnY1RETXSQgPIyGoEgAtMfxEBQLgPZCUopBAiDDQSd9q0H7zj8p0thBhHAxsTM8BNUiaNZylcZFUhoXxrH7AZdMAv2haziRAAAAAElFTkSuQmCC'
			}, {
				processDescription: 'Microsoft.MicrosoftEdgeDevToolsPreview',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEaSURBVFhH7ZTbCoJAEIaFCCKCCKJnLTpQVBdB14HQ00T0CqUP4AN41puJAVe92F3HRZegHfgQFvH7/1nQMmPmZ+Z8uYJOCm01vJe64PF8cZ+Ftho89DxPC8IAeZ73QpZlJWmattsAfsBavsk0yRsD3Ox7ST3A4uTC/OjC7ODCdO/AZOfAeOvAaPOB4foDg1UVwLZtIUmSqG2AIq9vgNcc5coBKHIWgNec0RhAdAUUOSJrjsRxrLYBihxBMa85QzkARY7ImjOkAURXQJEjKOY1Z0RRpLYBihyRNUe5cgCKHEEprzmjMYDoCqjImiNhGKptgApvA3V57wFkzbUGEMmDIGgfAKH84ShypQBdyn3fFwfQSaE1Y+bvx7K+efsbU5+Ow3MAAAAASUVORK5CYII='
			}, {
				processDescription: 'Skype for Business(UcMapi)',
				// tslint:disable-next-line:max-line-length
				iconName: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAP8SURBVFhHzZfPb4xBGMdHEUIlLiQSwcGdIyeOTvgLcHMQIQ4cuTg5cBAhIbhK9t1VNHFRURGHSmmIixAHpK28O20X/bHb8XzmnVnzvp33bSsOnuSb3e7M82Oe31X/J9VaW1Siz6u6HlI1PSmfRjAl35+pevO0ujfaq26Y1fJ9ozJmheP6R5Q0z4iillMaRU8jnQn/XpnoVk9Dv1ZJel010oPWuGUTL6nrWwhccz/tnHzz0wx+nzOj0x0zJngyPmtOjfw0Gx5M5IyJYWUjHZPPc+q2WeukL4HqzbMwb+3Xc28n28aY+Sgwpv511ryXO83ZjsWHVtvUvsyYE2L05v4/BvYk+qNKJvY6DRXUl25TtXSal1cpXwpmOvPm2sdps8kZIuFqS2iOOk0llDQvchm3x4T+DcZnOubAi1bXG9VG1PQwl4h5TFiITz/a5vKHaXP+/S+zb3DK5gXfh/VC3vb8vDky9CPwRFk46uksl0i4ohAPYn30VSasDNsfT9r8CPkwwnvC5kQ0MZ0AEixk9kD5ridTOWVVwEMhP+HwOSE457QGRJORQ0otZPRAoGO22D/YMg156dPxOYvTEobwHBCqUAaJye9SoqML+4TtcNrGM2TyINZe8MaHE9YjxTvkAGf+XjEnqI6uF2hWOaK9ygFNBneFjCA0gDgXzz1QekESspgHHvQJK4eOmSPp7b69JhHmQy+DchKQDyiJeaIKNCv4bdvOkR0smfB3kUZ0+3PGGAPGEDruLGYQHRMeZofT7Iip5gSWCYklWgyUapkMfu/ezU3RbBDZg6pXDEiVHBMFYbLFgFdicnIG8OiQrFvkADcVGWMg4a5IeR6W/IgZhCeKPIS3e2fArHKqM7KJIQckSpFxKcCYrnBBrFpIcM5swrPU5IjSkENKpchIknFW5lqPHaLUGwCK53Ta3u4+IaWfI5qDHNAsaBohYygUI8Izj3x8tdldcs8/xja/HEkp2jYph7TNkGmxPkAJ4vLwDhMylOFBu3d3ppzmgBgUcogXwo5IX18s80OUvR4Qhu7dBSSj0o5MOWSEMko9I6+lBLvMJaBfVOUJI9/eraVzTmuBZGmwy4NcYpkIjQB44464nJ6PQZQh3/mtOAFjYOnJDNAjTmOEWJ/ci/BEbED9LVj7rOxEX3LaSkiM8J4gJ0jMYnUsFyy8LL6ygbXVfb3TaaogwuFywhtCn6BZ0TGJNWBFpyrKNiqAclb+TFbzqtOwBGKHk+rwJVoF9gnqnFLDGBKOmOP27OXcaz5X/WaNk74MYmTTrKRj0rb97PDw+0QlEn1X9X1Z5yT+A7JTVKYaxj3+tl6UHJf/MR7Jb98ypbJt1/QnwU1Vm9jjuP4nUuo3Rc+6UWVSJz8AAAAASUVORK5CYII='
			}]
		};

		const gamingAutoClose: any = {
			getAutoCloseList: this.getPromise(autoCloseList),
			getRunningList: this.getPromise(runningList),
			getStatus: this.getPromise(true),
			setStatus: this.getPromise(true),
			addAutoCloseList: this.getPromise(true),
			delAutoCloseList: this.getPromise(true),
			getNeedToAsk: this.getPromise(true),
			setNeedToAsk: this.getPromise(true)
		};
		return gamingAutoClose;
	}

	/***
     * returns macroKeyClearInfo object from VantageShellService of JS Bridge
     ***/
	public setMacroKeyClear(macroKey: string): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setClear(macroKey);
		}
		return undefined;
	}

	public getGamingMacroKey(): any {
		const gamingMacroKey = {
			mitt: {},
			composer: { total: null, registryComposer: {} },
			mapping: null,
			key: null,
			recorded: [],
			isRecording: false,
			inputs: null,
			start: null
		};
		return gamingMacroKey;
		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([ Phoenix.Features.Gaming ]);
		// 	}
		// 	console.log('MACROKEY ', JSON.stringify(this.phoenix.gaming.gamingMacroKey));
		// 	return this.phoenix.gaming.gamingMacroKey;
		// }
	}

	public getIntelligentCoolingForIdeaPad(): any {
		if (this.getPowerIdeaNoteBook()) {
			return this.getPowerIdeaNoteBook().its;
		}
		return undefined;
	}

	public macroKeyInitializeEvent(): any {
		// const initRes = true;
		// const macrokeyInit.then = this.getPromise(initRes);
		// return macrokeyInit;
		return Promise.resolve(true);
	}

	public macroKeySetApplyStatus(key): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setApplyStatus(key);
		}
		return undefined;
	}

	public macroKeySetStartRecording(key): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setStartRecording(key);
		}
		return undefined;
	}

	public macroKeySetStopRecording(key, isSuccess, message): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setStopRecording(key, isSuccess, message);
		}
		return undefined;
	}

	public macroKeySetKey(key): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setKey(key);
		}
		return undefined;
	}

	public macroKeyClearKey(key): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setClear(key);
		}
		return undefined;
	}

	public macroKeySetRepeat(key, repeat): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setRepeat(key, repeat);
		}
		return undefined;
	}

	public macroKeySetInterval(key, interval): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setInterval(key, interval);
		}
		return undefined;
	}

	public macroKeySetMacroKey(key, inputs): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.setMacroKey(key, inputs);
		}
		return undefined;
	}

	public getGamingThermalMode() {
		// if (this.phoenix) {
		// 	if (!this.phoenix.gaming) {
		// 		this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
		// 	}
		// 	return this.phoenix.gaming.gamingThermalmode;
		// }

		const gamingThermalMode = {
			getThermalModeStatus: this.getPromise(true),
			setThermalModeStatus: this.getPromise(true),
			regThermalModeEvent: this.getPromise(true),
		};
		return gamingThermalMode;
	}

	public getImcHelper(): any {
		const imcHelper: any = { getIsEnergyStarCapability: this.getPromise(true) };

		return imcHelper;
	}

	// Active Protection System
	public getActiveProtectionSystem(): any {
		const aps = {
			getSensorStatus: this.getPromise(true),
			getAPSCapability: this.getPromise(true),
			getHDDStatus: this.getPromise(true),
			getAPSMode: this.getPromise(true),
			getPenCapability: this.getPromise(true),
			getTouchCapability: this.getPromise(true),
			getPSensorCapability: this.getPromise(true),
			getAPSSensitivityLevel: this.getPromise(1),
			getAutoDisableSetting: this.getPromise(true),
			getSnoozeSetting: this.getPromise(true),
			getSnoozeTime: this.getPromise(1),
			getPenSetting: this.getPromise(true),
			getPenDelayTime: this.getPromise(5),
			getTouchInputSetting: this.getPromise(true),
			getPSensorSetting: this.getPromise(true),
			setAPSMode: this.getPromise(true),
			setAPSSensitivityLevel: this.getPromise(true),
			setAutoDisableSetting: this.getPromise(true),
			setSnoozeSetting: this.getPromise(true),
			setSnoozeTime: this.getPromise(true),
			setPenSetting: this.getPromise(true),
			setPenDelayTime: this.getPromise(true),
			setTouchInputSetting: this.getPromise(true),
			setPSensorSetting: this.getPromise(true),
			sendSnoozeCommand: this.getPromise(true)
		};
		return aps;
	}

	/**
	 * returns Keyboard manager object  from VantageShellService of JS Bridge
	 */
	public getKeyboardManagerObject(): any {
		const kbdManager: any = {
			GetAllCapability: this.getPromise({ uDKCapability: true, keyboardMapCapability: true }),
			GetKBDLayoutName: this.getPromise('Standered'),
			GetKBDMachineType: this.getPromise('Other'),
			GetKbdHiddenKeyPerformanceModeCapability: this.getPromise(false),
			GetKbdHiddenKeyPrivacyFilterCapability: this.getPromise(true),
			GetKbdHiddenKeyMagnifierCapability: this.getPromise(false),
			GetKbdHiddenKeyBackLightCapability: this.getPromise(true),
			GetTopRowFnLockCapability: this.getPromise(true),
			GetTopRowFnStickKeyCapability: this.getPromise(true),
			GetTopRowPrimaryFunctionCapability: this.getPromise(true),
			GetFnLockStatus: this.getPromise(true),
			GetFnStickKeyStatus: this.getPromise(true),
			GetPrimaryFunctionStatus: this.getPromise(true)
		};

		return kbdManager;
	}

	// =================== Start Lenovo Voice
	public getLenovoVoice(): any {
		const voice = {
			getCapability: this.getPromise(true),
			getInstallStatus: this.getPromise(true),
			downloadAndInstallVoiceApp: this.getPromise('InstallDone'),
			launchVoiceApp: this.getPromise(true)
		};
		return voice;
	}
	// ==================== End Lenovo Voice

	/** returns OledSettings object from VantageShellService of JS Bridge */
	public getOledSettings(): any {
		const oledSettings = {
			getOLEDPowerControlCapability: this.getPromise(true),
			getTaskbarDimmerSetting: this.getPromise(true),
			getBackgroundDimmerSetting: this.getPromise(true),
			getDisplayDimmerSetting: this.getPromise(true),
			setTaskbarDimmerSetting: this.getPromise(true),
			setBackgroundDimmerSetting: this.getPromise(true),
			setDisplayDimmerSetting: this.getPromise(true),

		};
		return oledSettings;
	}

	public getPriorityControl(): any {
		const priorityControl = {
			getPriorityControlCapability: this.getPromise(true),
			getPriorityControlSetting: this.getPromise(true),
			setPriorityControlSetting: this.getPromise(true),
		};

		return priorityControl;
	}

	public getKeyboardObject(): any {
		const keyboard = {
			getAutoKBDBacklightCapability: this.getPromise(true),
			getKBDBacklightCapability: this.getPromise(true),
			getAutoKBDStatus: this.getPromise(true),
			getKBDBacklightStatus: this.getPromise(true),
			getKBDBacklightLevel: this.getPromise(true),
			setKBDBacklightStatus: this.getPromise(true),
			setAutomaticKBDBacklight: this.getPromise(true)
		};

		return keyboard;
	}

	public getVersion(): any {
		if (this.phoenix && this.phoenix.version) {
			return this.phoenix.version;
		}
		return undefined;
	}

	public getVantageStub(): any {
		const win = window as any;
		return (
			win.VantageStub || {
				appStartTime: 0,
				navigateTime: 0,
				domloadedTime: 0,
				launchParms: null,
				launchType: null
			}
		);
	}

	public getBetaUser(): any {
		return {
			setBetaUser() {
				return Promise.resolve();
			},
			getBetaUser() {
				return Promise.resolve(true);
			}
		};
	}

	// =================== Start Hardware Scan
	public getHardwareScan(): any {
		if (HardwareScanShellMock) {
			return {
				getPluginInformation: this.getPromise(HardwareScanShellMock.pluginInfo),
				getItemsToRecoverBadSectors: this.getPromise(HardwareScanShellMock.itemsToRecoverBadSectors),
				getScheduleScan: this.getPromise(HardwareScanShellMock.scheduleScan),
				getItemsToScan: this.getPromise(HardwareScanShellMock.itemsToScan),
				getPreScanInformation: this.getPromise(HardwareScanShellMock.preScanInformation),
				getDoScan: HardwareScanShellMock.doScan,
				deleteScan: this.getPromise(HardwareScanShellMock.deleteScan),
				editScan: this.getPromise(HardwareScanShellMock.editScan),
				getNextScans: this.getPromise(HardwareScanShellMock.nextScans),
				getRecoverBadSectors: HardwareScanShellMock.recoverBadSectors,
				cancelScan: HardwareScanShellMock.cancelScan,
				getPreviousResults: this.getPromise(HardwareScanShellMock.previousResults),
				checkItemsForRecoverBadSectors: this.getPromise(HardwareScanShellMock.checkItemsForRecoverBadSectors),
				getFinalDoScanResponse: this.getPromise(HardwareScanShellMock.finalDoScanResponse)
			};
		}

		return undefined;
	}
	// ==================== End Hardware Scan

	public getMouseAndTouchPad(): any {
		const inputControlLinks: any = {
			GetMouseCapability: this.getPromise(true),
			GetTouchpadCapability: this.getPromise(true)
		};

		return inputControlLinks;
	}

	public getVoipHotkeysObject(): any {
		return {
			getVOIPHotkeysSettings: () => Promise.resolve({
				errorCode: VoipErrorCodeEnum.SUCCEED,
				capability: true,
				appList: [
					{
						isAppInstalled: true,
						isSelected: true
					}
				]
			})
		};
	}

	public getSuperResolution(): any {
		const superResolution: any = {
			getSuperResolutionStatus: this.getPromise({ available: true, status: false }),
			setSuperResolutionStatus: this.getPromise(true)
		};

		return superResolution;
	}

	getTopRowFunctionsIdeapad(): any {
		// return this.phoenix.hwsettings.input.topRowFunctionsIdeapad;
		return {
			getCapability: () => Promise.resolve({
				capabilityList: {
					Items: [
						{
							key: 'fnLock',
							value: 'True',
						}
					]
				}
			}),
			getPrimaryKey: () => Promise.resolve({
				settingList: {
					setting: [
						{
							key: 'PrimeKey',
							value: KeyType.FNKEY,
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						}
					]
				}
			}),
			getFnLockStatus: () => Promise.resolve({
				settingList: {
					setting: [
						{
							key: 'FnLock',
							value: 'True',
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						}
					],
				}
			}),
			// setFnLockStatus(fnLock: StringBoolean): Promise<CommonResponse<null>>
		};
	}

	getBacklight(): any {
		return {
			getBacklight: () => Promise.resolve({
				settingList: {
					setting: [
						{
							key: 'KeyboardBacklightLevel',
							value: BacklightLevelEnum.ONE_LEVEL,
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						},
						{
							key: 'KeyboardBacklightStatus',
							value: BacklightStatusEnum.LEVEL_1,
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						}
					]
				}
			}),
			setBacklight: (status) => Promise.resolve({
				errorcode: CommonErrorCode.SUCCEED
			}),
			GetBacklightOnSystemChange: (settings) => Promise.resolve({
				settingList: {
					setting: [
						{
							key: 'KeyboardBacklightLevel',
							value: BacklightLevelEnum.ONE_LEVEL,
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						},
						{
							key: 'KeyboardBacklightStatus',
							value: BacklightStatusEnum.LEVEL_1,
							enabled: 0,
							errorCode: CommonErrorCode.SUCCEED
						}
					]
				}
			})
		};
	}

	public getRegistryUtil(): Phoenix.RegistryFeature {
		if (this.phoenix) {
			return this.phoenix.registry;
		}
		return undefined;
	}

	getToolbarToastFeature(): any {
		return this.phoenix.hwsettings.toolbar.ToolbarToast;
	}

	public getUpeAgent(): any {
		if (this.phoenix) {
			return this.phoenix.upeAgent;
		}
		return undefined;
	}

	public getSelfSelect() {
		if (this.phoenix) {
			return this.phoenix.selfSelect;
		}
		return undefined;
	}
}

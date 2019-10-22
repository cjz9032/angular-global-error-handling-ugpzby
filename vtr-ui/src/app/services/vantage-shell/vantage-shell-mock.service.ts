import { Injectable } from '@angular/core';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { MetricHelper } from 'src/app/data-models/metrics/metric-helper.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Container, BindingScopeEnum } from 'inversify';
import { resolve } from 'q';

declare var Windows;

@Injectable({
	providedIn: 'root'
})

export class VantageShellService {
	public readonly isShellAvailable: boolean;
	private phoenix: any;
	private shell: any;
	constructor(private commonService: CommonService, private http: HttpClient) {
		this.isShellAvailable = true;
		this.shell = this.getVantageShell();
		if (this.shell) {
			this.setConsoleLogProxy();
			const metricClient = this.shell.MetricsClient ? new this.shell.MetricsClient() : null;
			const powerClient = this.shell.PowerClient ? this.shell.PowerClient() : null;
			this.phoenix = Phoenix.default(new Container({
				defaultScope: BindingScopeEnum.Singleton
			}), {
				metricsBroker: metricClient,
				hsaPowerBroker: powerClient,
				hsaDolbyBroker: this.shell.DolbyRpcClient ? this.shell.DolbyRpcClient.instance : null,
				hsaForteBroker: this.shell.ForteRpcClient ? this.shell.ForteRpcClient.getInstance() : null
			});

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
				Phoenix.Features.BetaUser,
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
		if (this.phoenix) {
			this.phoenix.on(eventType, (val) => {
				handler(val);
			});
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

		const today = (new Date()).toISOString();
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
				vendor: 'GenuineIntel',
			},
			deviceId: '0879eb1af41243f0af686ffe29eff508f6d1eb99fef906b2417be2ea0f5787fc',
			eCVersion: '1.24',
			enclosureType: 'notebook',
			family: 'ThinkPad E480',
			firstRunDate: '2019-06-18T00:54:24',
			isGaming: false,
			isSMode: false,
			locale: 'en',
			manufacturer: 'LENOVO',
			memorys: [{
				serialNumber: '8B264B0A',
				sizeInBytes: 4194304,
				type: 'DDR4'
			}, {
				serialNumber: '4A7D0400',
				sizeInBytes: 8388608,
				type: 'DDR4'
			},
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
				vendor: 'GenuineIntel',
			},
			deviceId: '0879eb1af41243f0af686ffe29eff508f6d1eb99fef906b2417be2ea0f5787fc',
			eCVersion: '1.24',
			enclosureType: 'notebook',
			family: 'ThinkPad E480',
			firstRunDate: '2019-06-18T00:54:24',
			isGaming: false,
			isSMode: false,
			locale: 'en',
			manufacturer: 'LENOVO',
			memorys: [{
				serialNumber: '8B264B0A',
				sizeInBytes: 4194304,
				type: 'DDR4'
			}, {
				serialNumber: '4A7D0400',
				sizeInBytes: 8388608,
				type: 'DDR4'
			},
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
				used: 219430400000,
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
				eventName = 'FeatureClick';
				break;
			case 'itemclick':
				eventName = 'ItemClick';
				break;
			case 'itemview':
				eventName = 'ItemView';
				break;
			case 'articleclick':
				eventName = 'ArticleClick';
				break;
			case 'docclick':
				eventName = 'DocClick';
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

						const isBeta = that.commonService.getLocalStorageValue(
							LocalStorageKey.BetaUser
						);
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
				}, {
					appID: 'c233e07661739ce19e604ebdcc832f7b',
					partNum: 'SBB0K63291', // id for get details from CMS entitled apps
					name: 'McAfee LiveSafe 36 Months Subscription Win7 Win10 ',
					status: 'not installed',
					progress: '0',
					version: '16.0.14'
				}, {
					appID: '5715374c216f6f89acd63902f5834980',
					partNum: 'SBB0U39801', // id for get details from CMS entitled apps
					name: 'Chroma Tune royalty for UHD panel',
					status: 'not installed',
					progress: '0',
					version: '2'
				}]
		};
		modernPreload.initialize = (serialNumber) => ({
			if (serialNumber) {
				return true;
			}
		});
		modernPreload.getIsEntitled = () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({result: true});
				}, 1000);
			})
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
				var cancelled = false;
				cancelHandler.cancel = () => {
					cancelled = true;
				}
				appList.forEach(app => {
					progressResponseList.push([{appID: app.appID, status: 'downloading', progress: '0'}]);
					progressResponseList.push([{appID: app.appID, status: 'downloading', progress: '10'}]);
					progressResponseList.push([{appID: app.appID, status: 'downloading', progress: '50'}]);
					progressResponseList.push([{appID: app.appID, status: 'downloading', progress: '90'}]);
					progressResponseList.push([{appID: app.appID, status: 'downloaded', progress: '100'}]);
					progressResponseList.push([{appID: app.appID, status: 'installing', progress: '0'}]);
					progressResponseList.push([{appID: app.appID, status: 'installing', progress: '0'}]);
					progressResponseList.push([{appID: app.appID, status: 'installing', progress: '0'}]);
					progressResponseList.push([{appID: app.appID, status: 'installed', progress: '100'}]);
				});
				const downloadAndInstallResult = {appList};
				downloadAndInstallResult.appList.forEach(app => {
					app.status = 'installed';
					app.progress = '100';
				});

				var i = 0;
				var downloadInterval = setInterval(() => {
					if (i < progressResponseList.length && !cancelled) {
						callback(progressResponseList[i]);
						i++;
					} else {
						resolve(downloadAndInstallResult);
						clearInterval(downloadInterval);
					}
				}, 1000);
			});
		}
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
		if (this.phoenix) {
			return this.phoenix.securityAdvisor;
		}
		return undefined;
	}

	public getPermission(): any {
		if (this.phoenix) {
			return this.phoenix.permissions;
		}
		return undefined;
	}

	public getConnectedHomeSecurity(): Phoenix.ConnectedHomeSecurity {
		if (this.phoenix) {
			return this.phoenix.connectedHomeSecurity;
		}
		return undefined;
	}

	public getDevicePosture(): Phoenix.DevicePosture {
		if (this.phoenix) {
			return this.phoenix.devicePosture;
		}
		return undefined;
	}

	/**
	 * returns hardware settings object from VantageShellService of JS Bridge
	 */
	private getHwSettings(): any {
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
			volume: 100,
		};
		microphone.getSupportedModes = this.getPromise(micSupportedModes);
		microphone.getMicrophoneSettings = this.getPromise(micSettings);

		return microphone;
	}

	/**
	 * returns smart settings object from VantageShellService of JS Bridge
	 */
	public getSmartSettings(): any {
		const smartSettings: any = {
			absFeature: { getDolbyFeatureStatus: this.getPromise({ available: true, status: false }) }
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
			batteryInformation: [{
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
				wattage: 10.57,
			}],
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
			},
		};
		battery.getBatteryInformation = this.getPromise(battery);
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
			minimum: 1200,
		};
		const eyeCareObj = {
			available: true,
			current: 4500,
			default: 4500,
			eyecaremode: 4500,
			maximum: 6500,
			minimum: 1200,
			status: false,
		};
		const displayEyeCareMode: any = {
			getDaytimeColorTemperature: this.getPromise(dayTimeObj),
			getDisplayColortemperature: this.getPromise(eyeCareObj),
			getEyeCareModeState: this.getPromise(obj),
			initEyecaremodeSettings: this.getPromise(true),
			startMonitor: this.getPromise(true),
			stopMonitor: this.getPromise(true),
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
			getPrivacyGuardOnPasswordCapability: this.getPromise(true)
		};

		return privacyGuardSettings;
	}

	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public getCameraPrivacy(): any {
		const cameraPrivacyStatus: any = {
			getCameraPrivacyStatus: this.getPromise({ available: true, status: true }),
			startMonitor: this.getPromise(true)
		};
		return cameraPrivacyStatus;
	}
	/**
	 * returns cameraSettings object from VantageShellService of JS Bridge
	 */
	public getCameraSettings(): any {
	 const cameraSettings: any = {
		startMonitor: this.getPromise(true),
		getCameraSettings: this.getPromise(true)
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
		devicePower.stopMonitor = this.getPromise((true));
		return devicePower;
	}
	public getPowerIdeaNoteBook(): any {
		const obj = {
			available: true,
			status: true
		};
		const devicePowerIdeaNoteBook = {
			rapidChargeMode: { getRapidChargeModeStatus: this.getPromise(obj) },
			conservationMode: { getConservationModeStatus: this.getPromise(obj) },
			alwaysOnUSB: { getAlwaysOnUSBStatus: this.getPromise(obj), getUSBChargingInBatteryModeStatus: this.getPromise(obj) },
			flipToBoot: { getFlipToBootCapability: this.getPromise({ ErrorCode: 0, Supported: 1, CurrentMode: 1 }) }
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
		const batteryThresholdInfo: any = [{
			batteryNum: 1,
			checkBoxValue: false,
			isCapable: true,
			isOn: false,
			startValue: 75,
			stopValue: 80
		},
		{
			batteryNum: 2,
			checkBoxValue: false,
			isCapable: true,
			isOn: false,
			startValue: 75,
			stopValue: 80
		}];
		const devicePowerThinkPad: any = {
			sectionChargeThreshold: { getChargeThresholdInfo: this.getPromise(batteryThresholdInfo) },
			sectionAirplaneMode: { getAirplaneModeCapability: this.getPromise(true) },
			sectionAlwaysOnUsb: { getAlwaysOnUsbCapability: this.getPromise(true) },
			sectionEasyResume: { getEasyResumeCapability: this.getPromise(true) },
			sectionSmartStandby: { getSmartStandbyCapability: this.getPromise(true), getSmartStandbyEnabled: this.getPromise(true) }
		};
		return devicePowerThinkPad;
	}

	// public getPowerItsIntelligentCooling(): any {
	// 	if(this.phoenix){
	// 		return this.phoenix.hwsettings.power.its.IntelligentCooling ;
	// 	}
	// }
	public getPowerItsIntelligentCooling(): any {
		if (this.getPowerSettings() && this.getPowerSettings().its) {
			return this.getPowerSettings().its;
		}
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
		if (this.phoenix) {
			return this.phoenix.deviceFilter.calc(filter);
		}
		return undefined;
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
		if (this.phoenix && this.phoenix.privacy) {
			return this.phoenix.privacy;
		}
		return undefined;
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
			supportedModes: [
				'Blur',
				'Comic',
				'Sketch',
			]
		};
		const cameraBlur: any = {getCameraBlurSettings: this.getPromise(obj) };
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
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingAllCapabilities;
		}
		return undefined;
	}

	public getGamingLighting(): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingLighting;
		}
		return undefined;
	}
	public getGamingOverClock(): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingOverclock;
		}
		return undefined;
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
		};
		return intelligentSensing;
	}

	public getMetricPreferencePlugin() {
		if (this.phoenix) {
			return this.phoenix.genericMetricsPreference;
		}
	}

	public getGamingKeyLock() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingKeyLock;
		}
		return undefined;
	}

	public getGamingHybridMode() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingHybridMode;
		}
		return undefined;
	}

	public getGamingHwInfo() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingHwInfo;
		}
		return undefined;
	}

	public getIntelligentMedia(): any {
		const media = {
			getVideoPauseResumeStatus: this.getPromise({ available: true, status: true }),
			setVideoPauseResumeStatus: this.getPromise(true),
		};
		return media;
	}

	public getPreferenceSettings() {
		if (this.phoenix) {
			return this.phoenix.preferenceSettings;
		}
	}
	public getNetworkBoost() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingNetworkBoost;
		}
		return undefined;
	}

	public getGamingAutoClose() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingAutoClose;
		}
		return undefined;
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
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey;
		}
	}

	public getIntelligentCoolingForIdeaPad(): any {
		if (this.getPowerIdeaNoteBook()) {
			return this.getPowerIdeaNoteBook().its;
		}
		return undefined;
	}

	public macroKeyInitializeEvent(): any {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingMacroKey.initMacroKey();
		}
		return undefined;
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
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingThermalmode;
		}
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
			GetKeyboardMapCapability: this.getPromise(true),
			GetUDKCapability: this.getPromise(true),
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
		const oledSettings = { getOLEDPowerControlCapability: this.getPromise(true) };

		return oledSettings;
	}

	public getVersion(): any {
		if (this.phoenix && this.phoenix.version) {
			return this.phoenix.version;
		}
		return undefined;
	}

	public getVantageStub(): any {
		const win = window as any;
		return win.VantageStub || {
			appStartTime: 0,
			navigateTime: 0,
			domloadedTime: 0,
			launchParms: null,
			launchType: null
		};
	}

	public getBetaUser(): any {
		if (this.phoenix) {
			return this.phoenix.betaUser;
		}
		return undefined;
	}

	// =================== Start Hardware Scan
	public getHardwareScan(): any {
		const pluginInfo: any = {
			LegacyPlugin: false,
			PluginVersion: "1.0.41"
		}

		const itemsToScan: any = {
			"mapContractNameList": [
				{
					"Key": "cpu",
					"Value": "SystemManagement.HardwareScan.CPU"
				},
				{
					"Key": "memory",
					"Value": "SystemManagement.HardwareScan.Memory"
				},
				{
					"Key": "motherboard",
					"Value": "SystemManagement.HardwareScan.Motherboard"
				},
				{
					"Key": "pci_express",
					"Value": "SystemManagement.HardwareScan.PCIExpress"
				},
				{
					"Key": "wireless",
					"Value": "SystemManagement.HardwareScan.Wireless"
				},
				{
					"Key": "storage",
					"Value": "SystemManagement.HardwareScan.Storage"
				}
			],
			"categoryList": [
				{
					"name": "Processor",
					"id": "cpu",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "0",
							"name": "AMD Ryzen 7 3700U with Radeon Vega Mobile Gfx",
							"Udi": null,
							"metaInformation": [
								{
									"name": "Model",
									"index": "",
									"value": "AMD Ryzen 7 3700U with Radeon Vega Mobile Gfx"
								},
								{
									"name": "Vendor",
									"index": "",
									"value": "AuthenticAMD"
								},
								{
									"name": "Number of Cores",
									"index": "",
									"value": "4"
								},
								{
									"name": "Number of Threads",
									"index": "",
									"value": "8"
								},
								{
									"name": "Signature",
									"index": "",
									"value": "810F81h"
								},
								{
									"name": "Current Speed",
									"index": "",
									"value": "2.299780 GHz"
								},
								{
									"name": "Features",
									"index": "",
									"value": "MMX, SSE, SSE2, SSE3, SSSE3, SSE4.1, SSE4.2, AES, AVX, CLMUL, FMA, XOP, PSE, PSE-36"
								},
								{
									"name": "Cache L1",
									"index": "",
									"value": "4 x 32 KB CPU_DATA_CACHE, 4 x 64 KB CPU_INSTRUCTION_CACHE"
								},
								{
									"name": "Cache L2",
									"index": "",
									"value": "4 x 512 KB CPU_UNIFIED_CACHE"
								},
								{
									"name": "Cache L3",
									"index": "",
									"value": "4 MB CPU_UNIFIED_CACHE"
								},
								{
									"name": "Driver version",
									"index": "",
									"value": "10.0.17763.503"
								}
							],
							"testList": [
								{
									"id": "TEST_CPU_BT_INSTRUCTION_TEST:::13.1.2:::bt:::1",
									"name": "BT Instruction Test",
									"description": "The test checks the processor support for BT instruction.",
									"groupId": "1"
								},
								{
									"id": "TEST_CPU_X87_FLOATING_POINT_TEST:::13.1.3:::x87:::1",
									"name": "x87 Floating Point Test",
									"description": "The test checks the processor support for x87 Floating Point instructions. If the processor does not support such feature, the test returns unsupported.",
									"groupId": "1"
								},
								{
									"id": "TEST_CPU_MMX_TEST:::13.1.4:::mmx:::1",
									"name": "MMX Test",
									"description": "The test checks the processor support for MMX instructions. If the processor does not support such feature, the test returns unsupported.",
									"groupId": "1"
								},
								{
									"id": "TEST_CPU_SSE_FAMILY_TEST:::13.1.6:::sse:::1",
									"name": "SSE Test",
									"description": "The test checks the processor support for SSE Family (SSE, SSE2, SSE3, SSSE3, SSE4.1, SSE4.2) instructions. If the processor does not support such feature, the test returns unsupported.",
									"groupId": "1"
								},
								{
									"id": "TEST_CPU_AES_TEST:::13.1.7:::aes:::1",
									"name": "AES Test",
									"description": "The test checks the processor support for AES instructions. If the processor does not support such feature, the test returns unsupported",
									"groupId": "1"
								},
								{
									"id": "TEST_CPU_STRESS_TEST:::13.2.12:::s:::1",
									"name": "Stress Test",
									"description": "The stress test performs a sequence of continuous check on all processor cores for 10 minutes. While running this test, the CPU temperature can increase considerably",
									"groupId": "2"
								}
							]
						}
					]
				},
				{
					"name": "Memory",
					"id": "memory",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "0",
							"name": "Physical Memory",
							"Udi": null,
							"metaInformation": [
								{
									"name": "Physical Memory",
									"index": "",
									"value": "8.000 GB"
								},
								{
									"name": "Manufacturer",
									"index": "0",
									"value": "Samsung"
								},
								{
									"name": "Speed",
									"index": "0",
									"value": "2667 MHz"
								},
								{
									"name": "Size",
									"index": "0",
									"value": "4.000 GB"
								},
								{
									"name": "Part number",
									"index": "0",
									"value": "M471A5244CB0-CTD"
								},
								{
									"name": "Serial",
									"index": "0",
									"value": "00000000"
								},
								{
									"name": "Type",
									"index": "0",
									"value": "DDR4"
								},
								{
									"name": "Manufacturer",
									"index": "1",
									"value": "Ramaxel Technology"
								},
								{
									"name": "Speed",
									"index": "1",
									"value": "2667 MHz"
								},
								{
									"name": "Size",
									"index": "1",
									"value": "4.000 GB"
								},
								{
									"name": "Part number",
									"index": "1",
									"value": "RMSA3270ME86H9F-2666"
								},
								{
									"name": "Serial",
									"index": "1",
									"value": "122A185E"
								},
								{
									"name": "Type",
									"index": "1",
									"value": "DDR4"
								}
							],
							"testList": [
								{
									"id": "TEST_QUICK_RANDOM_PATTERN_TEST:::0.1.14:::q:::1",
									"name": "Quick Random Pattern Test",
									"description": "The test consists of filling the memory with a random generated pattern and then checking that the pattern was correctly written. When checking, it writes the pattern's binary complement and checks again. The test is repeated twice. By default, 15 random patterns are used, therefore, the test runs once for each of these patterns.",
									"groupId": "1"
								},
								{
									"id": "TEST_ADVANCED_INTEGRITY_TEST:::0.2.1:::a:::1",
									"name": "Advanced Integrity Test",
									"description": "The test is based on the March C- enhanced algorithm. This test consists of filling the accessible memory with a pattern, checking it,  and writing its complement in a 8 bytes block size (64 bits) and then checking it again. This procedure is repeated twice, being the first one addressing the accessible memory from the highest position to the lowest and the second time by doing the inverse path. This test is intended to cover Stuck-At Faults and some Coupling Faults and Transition Faults.",
									"groupId": "2"
								},
								{
									"id": "TEST_ADDRESS_TEST:::0.2.2:::d:::1",
									"name": "Address Test",
									"description": "This test consists of writing in each memory address the numerical value of its own address. After that, the algorithm reads every memory location previously written and checks if they still store their own address. This test is intended to cover any addressing fault in the accessible memory range.",
									"groupId": "2"
								},
								{
									"id": "TEST_BIT_LOW_TEST:::0.2.4:::l:::1",
									"name": "Bit Low Test",
									"description": "This test consists of filling the memory buffer with a pattern where all bits are 0 and then checking it. When checking for this pattern, it writes its binary complement, and finally checks if the complement was stored accordingly. Such process is repeated 4 times. This test is intended to identify the most serious Stuck-At Faults, some cases of Transition Faults and some cases of Read Random Faults.",
									"groupId": "2"
								},
								{
									"id": "TEST_BIT_HIGH_TEST:::0.2.3:::h:::1",
									"name": "Bit High Test",
									"description": "This test consists of filling the memory buffer with a pattern where all bits are 1 and then checking it. When checking for this pattern, it writes its binary complement, and finally checks if the complement was stored accordingly. Such process is repeated 4 times. This test is intended to identify the most serious Stuck-At Faults, some cases of Transition Faults and some cases of Read Random Faults.",
									"groupId": "2"
								},
								{
									"id": "TEST_WALKING_ONES_LEFT_TEST:::0.2.6:::w:::1",
									"name": "Walking Ones Left Test",
									"description": "The Walking Ones Left Test consists of writing a pattern where only the rightmost bit is set (e.g. 00000001), then shift this pattern to the left (e.g. 00000010) until the end of the size of a byte, writing it again at the same memory address each time such pattern is shifted. Therefore, the test is intended to cover most of the Stuck-At Faults and some cases of Coupling Faults, and also testing the data bus by confirming that every bit can be written.",
									"groupId": "2"
								},
								{
									"id": "TEST_WALKING_ONES_RIGHT_TEST:::0.2.5:::k:::1",
									"name": "Walking Ones Right Test",
									"description": "The Walking Ones Right Test consists of writing a pattern where only the leftmost bit is set (e.g. 10000000), then shift this pattern to the right (e.g. 01000000) until the end of the size of a byte, writing it again at the same memory address each time such pattern is shifted. Therefore, such test is intended to cover most of the Stuck-At Faults and and some cases of Coupling Faults, and also testing the data bus by confirming that every bit can be written.",
									"groupId": "2"
								},
								{
									"id": "TEST_MODULO_20_TEST:::0.2.7:::t:::1",
									"name": "Modulo-20 Test",
									"description": "The test consists of writing into an interval of 20 memory locations for each block with a pattern and filling all other locations with its complement 6 times. Unlike the other tests, the Modulo-20 test is not affected by buffering or caching, so it is able to detect most of the Stuck-At Faults, Coupling Faults, Transition Faults and Read Random Faults that are not detected by other testing approaches.",
									"groupId": "2"
								},
								{
									"id": "TEST_MOVING_INVERSIONS_8_BIT_TEST:::0.2.8:::n:::1",
									"name": "Moving Inversions 8bit Test",
									"description": "The test consists of filling the memory with the 8 bit wide pattern: 10000000 and then checking that the pattern was correctly written. When checking, it writes the pattern's binary complement (01111111) and checks it again. The procedure described earlier is repeated 8 times, one for each pattern right shifted: 10000000, 01000000, 00100000, 00010000, 00001000, 00000100, 00000010, 00000001.",
									"groupId": "2"
								},
								{
									"id": "TEST_MOVING_INVERSIONS_32_BIT_TEST:::0.2.9:::m:::1",
									"name": "Moving Inversions 32bit Test",
									"description": "This test fills all the accessible memory with a shifting pattern, that is, a value which is binary left shifted as it is written out through the accessible memory of every memory block. Once the pattern reaches 0x80000000 (a value with the left most bit set to 1 only) then the pattern is reset to 0x00000001. After that, it checks the written values and writes their binary complements, starting from the first memory address to the last one.  Finally, the algorithm checks the memory for the complements written in the previous step, being this checking starting from the last element down to the first one. Such process is repeated 2 times. This test presents a more thorough approach intended to cover most of the Stuck-At Faults and Transition Faults and some cases of Coupling Faults and Read Random Faults.",
									"groupId": "2"
								},
								{
									"id": "TEST_RANDOM_PATTERN_TEST:::0.2.10:::r:::1",
									"name": "Random Pattern Test",
									"description": "The test consists of filling the memory with a random generated pattern and then checking that the pattern was correctly written. When checking, it writes the pattern's binary complement and checks it again. This process is repeated twice. By default, 50 random patterns are used, therefore the test runs once for each of these patterns.",
									"groupId": "2"
								},
								{
									"id": "TEST_RANDOM_NUMBER_SEQUENCE_TEST:::0.2.11:::s:::1",
									"name": "Random Number Sequence Test",
									"description": "The test consists of filling the memory with one different  random generated pattern for each memory address and then checking that the pattern was correctly written. In order to check it, the test must generate these numbers based on a seed that may be reset to reproduce the sequence. When checking, it writes the pattern's binary complement and it checks again. Such process is repeated several times. This test is intended to cover most of the Stuck-At Faults. Coupling Faults, and some cases of Transition Faults and Read Random Faults.",
									"groupId": "2"
								},
								{
									"id": "TEST_BLOCK_MOVE_TEST:::0.2.12:::b:::1",
									"name": "Block Move Test",
									"description": "The test consists of moving memory data around within memory blocks. It repeats the movements described above 80 times. Finally, the test checks every memory address to verify if it is consistent.",
									"groupId": "2"
								},
								{
									"id": "TEST_NIBBLE_MOVE_TEST:::0.2.15:::i:::1",
									"name": "Nibble Move Test",
									"description": "This test consists of writing to a nibble (a nibble is a group of four bits) a pattern value in each memory address, then it validates every nibble individually. It repeats this process until all nibbles in every address are checked.",
									"groupId": "2"
								}
							]
						}
					]
				},
				{
					"name": "Motherboard",
					"id": "motherboard",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "0",
							"name": "Motherboard",
							"Udi": null,
							"metaInformation": [
								{
									"name": "Number of USB Host Controllers:",
									"index": "",
									"value": "2"
								},
								{
									"name": "Number of PCI:",
									"index": "",
									"value": "28"
								},
								{
									"name": "RTC presence:",
									"index": "",
									"value": "Yes"
								},
								{
									"name": "Slot",
									"index": "1",
									"value": "00:00.0"
								},
								{
									"name": "Class name",
									"index": "1",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "1",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "2",
									"value": "00:00.2"
								},
								{
									"name": "Class name",
									"index": "2",
									"value": "Generic system peripheral"
								},
								{
									"name": "Subclass name",
									"index": "2",
									"value": "IOMMU"
								},
								{
									"name": "Slot",
									"index": "3",
									"value": "00:01.0"
								},
								{
									"name": "Class name",
									"index": "3",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "3",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "4",
									"value": "00:01.2"
								},
								{
									"name": "Class name",
									"index": "4",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "4",
									"value": "PCI bridge"
								},
								{
									"name": "Slot",
									"index": "5",
									"value": "00:01.3"
								},
								{
									"name": "Class name",
									"index": "5",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "5",
									"value": "PCI bridge"
								},
								{
									"name": "Slot",
									"index": "6",
									"value": "00:01.7"
								},
								{
									"name": "Class name",
									"index": "6",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "6",
									"value": "PCI bridge"
								},
								{
									"name": "Slot",
									"index": "7",
									"value": "00:08.0"
								},
								{
									"name": "Class name",
									"index": "7",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "7",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "8",
									"value": "00:08.1"
								},
								{
									"name": "Class name",
									"index": "8",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "8",
									"value": "PCI bridge"
								},
								{
									"name": "Slot",
									"index": "9",
									"value": "00:14.0"
								},
								{
									"name": "Class name",
									"index": "9",
									"value": "Serial bus controller"
								},
								{
									"name": "Subclass name",
									"index": "9",
									"value": "SMBus"
								},
								{
									"name": "Slot",
									"index": "10",
									"value": "00:14.3"
								},
								{
									"name": "Class name",
									"index": "10",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "10",
									"value": "ISA bridge"
								},
								{
									"name": "Slot",
									"index": "11",
									"value": "00:18.0"
								},
								{
									"name": "Class name",
									"index": "11",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "11",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "12",
									"value": "00:18.1"
								},
								{
									"name": "Class name",
									"index": "12",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "12",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "13",
									"value": "00:18.2"
								},
								{
									"name": "Class name",
									"index": "13",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "13",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "14",
									"value": "00:18.3"
								},
								{
									"name": "Class name",
									"index": "14",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "14",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "15",
									"value": "00:18.4"
								},
								{
									"name": "Class name",
									"index": "15",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "15",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "16",
									"value": "00:18.5"
								},
								{
									"name": "Class name",
									"index": "16",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "16",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "17",
									"value": "00:18.6"
								},
								{
									"name": "Class name",
									"index": "17",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "17",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "18",
									"value": "00:18.7"
								},
								{
									"name": "Class name",
									"index": "18",
									"value": "Bridge"
								},
								{
									"name": "Subclass name",
									"index": "18",
									"value": "Host bridge"
								},
								{
									"name": "Slot",
									"index": "19",
									"value": "01:00.0"
								},
								{
									"name": "Class name",
									"index": "19",
									"value": "Generic system peripheral"
								},
								{
									"name": "Subclass name",
									"index": "19",
									"value": "SD Host controller"
								},
								{
									"name": "Slot",
									"index": "20",
									"value": "02:00.0"
								},
								{
									"name": "Class name",
									"index": "20",
									"value": "Network controller"
								},
								{
									"name": "Subclass name",
									"index": "20",
									"value": "Network controller"
								},
								{
									"name": "Slot",
									"index": "21",
									"value": "03:00.0"
								},
								{
									"name": "Class name",
									"index": "21",
									"value": "Mass storage controller"
								},
								{
									"name": "Subclass name",
									"index": "21",
									"value": "Non-Volatile memory controller"
								},
								{
									"name": "Slot",
									"index": "22",
									"value": "04:00.0"
								},
								{
									"name": "Class name",
									"index": "22",
									"value": "Display controller"
								},
								{
									"name": "Subclass name",
									"index": "22",
									"value": "VGA compatible controller"
								},
								{
									"name": "Slot",
									"index": "23",
									"value": "04:00.1"
								},
								{
									"name": "Class name",
									"index": "23",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass name",
									"index": "23",
									"value": "Audio device"
								},
								{
									"name": "Slot",
									"index": "24",
									"value": "04:00.2"
								},
								{
									"name": "Class name",
									"index": "24",
									"value": "Encryption controller"
								},
								{
									"name": "Subclass name",
									"index": "24",
									"value": "Encryption controller"
								},
								{
									"name": "Slot",
									"index": "25",
									"value": "04:00.3"
								},
								{
									"name": "Class name",
									"index": "25",
									"value": "Serial bus controller"
								},
								{
									"name": "Subclass name",
									"index": "25",
									"value": "USB controller"
								},
								{
									"name": "Slot",
									"index": "26",
									"value": "04:00.4"
								},
								{
									"name": "Class name",
									"index": "26",
									"value": "Serial bus controller"
								},
								{
									"name": "Subclass name",
									"index": "26",
									"value": "USB controller"
								},
								{
									"name": "Slot",
									"index": "27",
									"value": "04:00.5"
								},
								{
									"name": "Class name",
									"index": "27",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass name",
									"index": "27",
									"value": "Multimedia controller"
								},
								{
									"name": "Slot",
									"index": "28",
									"value": "04:00.6"
								},
								{
									"name": "Class name",
									"index": "28",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass name",
									"index": "28",
									"value": "Audio device"
								},
								{
									"name": "USB Version",
									"index": "29",
									"value": "2.0"
								},
								{
									"name": "Class name",
									"index": "29",
									"value": "Miscellaneous device"
								},
								{
									"name": "Subclass name",
									"index": "29",
									"value": "Not available"
								},
								{
									"name": "Vendor ID",
									"index": "29",
									"value": "0x27C6"
								},
								{
									"name": "Product ID",
									"index": "29",
									"value": "0x55B4"
								},
								{
									"name": "Vendor",
									"index": "29",
									"value": "Not available"
								},
								{
									"name": "Product",
									"index": "29",
									"value": "Not available"
								},
								{
									"name": "USB Version",
									"index": "30",
									"value": "1.1"
								},
								{
									"name": "Class name",
									"index": "30",
									"value": "Wireless"
								},
								{
									"name": "Subclass name",
									"index": "30",
									"value": "Radio frequency"
								},
								{
									"name": "Vendor ID",
									"index": "30",
									"value": "0x0BDA"
								},
								{
									"name": "Product ID",
									"index": "30",
									"value": "0xB023"
								},
								{
									"name": "Vendor",
									"index": "30",
									"value": "Not available"
								},
								{
									"name": "Product",
									"index": "30",
									"value": "Not available"
								},
								{
									"name": "USB Version",
									"index": "31",
									"value": "2.0"
								},
								{
									"name": "Class name",
									"index": "31",
									"value": "Miscellaneous device"
								},
								{
									"name": "Subclass name",
									"index": "31",
									"value": "Not available"
								},
								{
									"name": "Vendor ID",
									"index": "31",
									"value": "0x13D3"
								},
								{
									"name": "Product ID",
									"index": "31",
									"value": "0x56B2"
								},
								{
									"name": "Vendor",
									"index": "31",
									"value": "SunplusIT Inc"
								},
								{
									"name": "Product",
									"index": "31",
									"value": "Integrated Camera"
								}
							],
							"testList": [
								{
									"id": "TEST_MOTHERBOARD_CHIPSET_TEST:::2.1.1:::c:::1",
									"name": "Chipset Test",
									"description": "The test checks the status registers of the controllers that form the foundation of the motherboard chipset. These controllers are: EHCI, OHCI, xHCI and SATA.",
									"groupId": "1"
								},
								{
									"id": "TEST_MOTHERBOARD_PCI_/_PCI-E_TEST:::2.1.2:::p:::1",
									"name": "PCI/PCI-e Test",
									"description": "The PCI/PCI-e Test checks the status registers of the PCI Express onboard devices for unexpected errors or power failure.",
									"groupId": "1"
								},
								{
									"id": "TEST_MOTHERBOARD_RTC_TEST:::2.1.3:::r:::1",
									"name": "RTC Test",
									"description": "The test checks the following RTC (Real Time Clock) properties: accuracy and rollover. The test attempts to guarantee the correct operation of these properties.",
									"groupId": "1"
								},
								{
									"id": "TEST_MOTHERBOARD_USB_TEST:::2.1.4:::u:::1",
									"name": "USB Test",
									"description": "Initially, the test checks the status of onboard USB devices. If any errors are indicated, the test fails. Then, a test is run for any storage device connected to the motherboard via USB, which can be done through read and write operations, depending on the permissions of the storage device. If the communication speed does not reach the desired values, the test writes warning messages to the log indicating malfunction in a particular USB port.",
									"groupId": "1"
								}
							]
						}
					]
				},
				{
					"name": "PCI Express",
					"id": "pci_express",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "PCI_DEV",
							"name": "Pci Express System",
							"Udi": null,
							"metaInformation": [
								{
									"name": "PCI0",
									"index": "",
									"value": "1:0.0"
								},
								{
									"name": "PCI1",
									"index": "",
									"value": "2:0.0"
								},
								{
									"name": "PCI2",
									"index": "",
									"value": "3:0.0"
								},
								{
									"name": "PCI3",
									"index": "",
									"value": "4:0.0"
								},
								{
									"name": "PCI4",
									"index": "",
									"value": "4:0.1"
								},
								{
									"name": "PCI5",
									"index": "",
									"value": "4:0.2"
								},
								{
									"name": "PCI6",
									"index": "",
									"value": "4:0.3"
								},
								{
									"name": "PCI7",
									"index": "",
									"value": "4:0.4"
								},
								{
									"name": "PCI8",
									"index": "",
									"value": "4:0.5"
								},
								{
									"name": "PCI9",
									"index": "",
									"value": "4:0.6"
								},
								{
									"name": "Bus:",
									"index": "0",
									"value": "0x1"
								},
								{
									"name": "Device:",
									"index": "0",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "0",
									"value": "0x0"
								},
								{
									"name": "Device Connected:",
									"index": "0",
									"value": "Yes"
								},
								{
									"name": "Vendor Id:",
									"index": "0",
									"value": "0x1217"
								},
								{
									"name": "Vendor Name:",
									"index": "0",
									"value": "O2 Micro, Inc."
								},
								{
									"name": "Class:",
									"index": "0",
									"value": "0x8"
								},
								{
									"name": "Class Name:",
									"index": "0",
									"value": "Generic system peripheral"
								},
								{
									"name": "Subclass:",
									"index": "0",
									"value": "0x5"
								},
								{
									"name": "Subclass name:",
									"index": "0",
									"value": "SD Host controller"
								},
								{
									"name": "Bus:",
									"index": "1",
									"value": "0x2"
								},
								{
									"name": "Device:",
									"index": "1",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "1",
									"value": "0x0"
								},
								{
									"name": "Device Connected:",
									"index": "1",
									"value": "Yes"
								},
								{
									"name": "Vendor Id:",
									"index": "1",
									"value": "0x10ec"
								},
								{
									"name": "Vendor Name:",
									"index": "1",
									"value": "Realtek Semiconductor Co., Ltd."
								},
								{
									"name": "Class:",
									"index": "1",
									"value": "0x2"
								},
								{
									"name": "Class Name:",
									"index": "1",
									"value": "Network controller"
								},
								{
									"name": "Subclass:",
									"index": "1",
									"value": "0x80"
								},
								{
									"name": "Subclass name:",
									"index": "1",
									"value": "Network controller"
								},
								{
									"name": "Bus:",
									"index": "2",
									"value": "0x3"
								},
								{
									"name": "Device:",
									"index": "2",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "2",
									"value": "0x0"
								},
								{
									"name": "Device Connected:",
									"index": "2",
									"value": "Yes"
								},
								{
									"name": "Vendor Id:",
									"index": "2",
									"value": "0x15b7"
								},
								{
									"name": "Vendor Name:",
									"index": "2",
									"value": "Sandisk Corp"
								},
								{
									"name": "Class:",
									"index": "2",
									"value": "0x1"
								},
								{
									"name": "Class Name:",
									"index": "2",
									"value": "Mass storage controller"
								},
								{
									"name": "Subclass:",
									"index": "2",
									"value": "0x8"
								},
								{
									"name": "Subclass name:",
									"index": "2",
									"value": "Non-Volatile memory controller"
								},
								{
									"name": "Bus:",
									"index": "3",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "3",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "3",
									"value": "0x0"
								},
								{
									"name": "Device Connected:",
									"index": "3",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "3",
									"value": "0x1002"
								},
								{
									"name": "Vendor Name:",
									"index": "3",
									"value": "Advanced Micro Devices [AMD] nee ATI"
								},
								{
									"name": "Class:",
									"index": "3",
									"value": "0x3"
								},
								{
									"name": "Class Name:",
									"index": "3",
									"value": "Display controller"
								},
								{
									"name": "Subclass:",
									"index": "3",
									"value": "0x0"
								},
								{
									"name": "Subclass name:",
									"index": "3",
									"value": "VGA compatible controller"
								},
								{
									"name": "Bus:",
									"index": "4",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "4",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "4",
									"value": "0x1"
								},
								{
									"name": "Device Connected:",
									"index": "4",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "4",
									"value": "0x1002"
								},
								{
									"name": "Vendor Name:",
									"index": "4",
									"value": "Advanced Micro Devices [AMD] nee ATI"
								},
								{
									"name": "Class:",
									"index": "4",
									"value": "0x4"
								},
								{
									"name": "Class Name:",
									"index": "4",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass:",
									"index": "4",
									"value": "0x3"
								},
								{
									"name": "Subclass name:",
									"index": "4",
									"value": "Audio device"
								},
								{
									"name": "Bus:",
									"index": "5",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "5",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "5",
									"value": "0x2"
								},
								{
									"name": "Device Connected:",
									"index": "5",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "5",
									"value": "0x1022"
								},
								{
									"name": "Vendor Name:",
									"index": "5",
									"value": "Advanced Micro Devices [AMD]"
								},
								{
									"name": "Class:",
									"index": "5",
									"value": "0x10"
								},
								{
									"name": "Class Name:",
									"index": "5",
									"value": "Encryption controller"
								},
								{
									"name": "Subclass:",
									"index": "5",
									"value": "0x80"
								},
								{
									"name": "Subclass name:",
									"index": "5",
									"value": "Encryption controller"
								},
								{
									"name": "Bus:",
									"index": "6",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "6",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "6",
									"value": "0x3"
								},
								{
									"name": "Device Connected:",
									"index": "6",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "6",
									"value": "0x1022"
								},
								{
									"name": "Vendor Name:",
									"index": "6",
									"value": "Advanced Micro Devices [AMD]"
								},
								{
									"name": "Class:",
									"index": "6",
									"value": "0xc"
								},
								{
									"name": "Class Name:",
									"index": "6",
									"value": "Serial bus controller"
								},
								{
									"name": "Subclass:",
									"index": "6",
									"value": "0x3"
								},
								{
									"name": "Subclass name:",
									"index": "6",
									"value": "USB controller"
								},
								{
									"name": "Bus:",
									"index": "7",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "7",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "7",
									"value": "0x4"
								},
								{
									"name": "Device Connected:",
									"index": "7",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "7",
									"value": "0x1022"
								},
								{
									"name": "Vendor Name:",
									"index": "7",
									"value": "Advanced Micro Devices [AMD]"
								},
								{
									"name": "Class:",
									"index": "7",
									"value": "0xc"
								},
								{
									"name": "Class Name:",
									"index": "7",
									"value": "Serial bus controller"
								},
								{
									"name": "Subclass:",
									"index": "7",
									"value": "0x3"
								},
								{
									"name": "Subclass name:",
									"index": "7",
									"value": "USB controller"
								},
								{
									"name": "Bus:",
									"index": "8",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "8",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "8",
									"value": "0x5"
								},
								{
									"name": "Device Connected:",
									"index": "8",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "8",
									"value": "0x1022"
								},
								{
									"name": "Vendor Name:",
									"index": "8",
									"value": "Advanced Micro Devices [AMD]"
								},
								{
									"name": "Class:",
									"index": "8",
									"value": "0x4"
								},
								{
									"name": "Class Name:",
									"index": "8",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass:",
									"index": "8",
									"value": "0x80"
								},
								{
									"name": "Subclass name:",
									"index": "8",
									"value": "Multimedia controller"
								},
								{
									"name": "Bus:",
									"index": "9",
									"value": "0x4"
								},
								{
									"name": "Device:",
									"index": "9",
									"value": "0x0"
								},
								{
									"name": "Function:",
									"index": "9",
									"value": "0x6"
								},
								{
									"name": "Device Connected:",
									"index": "9",
									"value": "No"
								},
								{
									"name": "Vendor Id:",
									"index": "9",
									"value": "0x1022"
								},
								{
									"name": "Vendor Name:",
									"index": "9",
									"value": "Advanced Micro Devices [AMD]"
								},
								{
									"name": "Class:",
									"index": "9",
									"value": "0x4"
								},
								{
									"name": "Class Name:",
									"index": "9",
									"value": "Multimedia controller"
								},
								{
									"name": "Subclass:",
									"index": "9",
									"value": "0x3"
								},
								{
									"name": "Subclass name:",
									"index": "9",
									"value": "Audio device"
								}
							],
							"testList": [
								{
									"id": "TEST_PCI_EXPRESS_STATUS_TEST:::5.1.1:::s:::1",
									"name": "Status Test",
									"description": "Verifies that all of the PCI Express devices are recognized and communicating with the system.",
									"groupId": "1"
								}
							]
						}
					]
				},
				{
					"name": "Wireless",
					"id": "wireless",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "0",
							"name": "Realtek 8822BE Wireless LAN 802.11ac PCI-E NIC",
							"Udi": null,
							"metaInformation": [
								{
									"name": "Driver version",
									"index": "",
									"value": "2024.0.4.102"
								},
								{
									"name": "MAC Address",
									"index": "",
									"value": "28:3A:4D:4A:7F:C3"
								},
								{
									"name": "Manufacturer",
									"index": "",
									"value": "Realtek Semiconductor Corp."
								},
								{
									"name": "Name",
									"index": "",
									"value": "{095E5F66-3A3A-40DD-874F-995B455349F1}"
								},
								{
									"name": "Product Name",
									"index": "",
									"value": "Realtek 8822BE Wireless LAN 802.11ac PCI-E NIC"
								}
							],
							"testList": [
								{
									"id": "TEST_RADIO_ENABLED_TEST:::4.1.1:::r:::1",
									"name": "Radio Enabled Test",
									"description": "Verifies that the wireless is turned on.",
									"groupId": "1"
								},
								{
									"id": "TEST_NETWORK_SCAN_TEST:::4.1.2:::n:::1",
									"name": "Network Scan Test",
									"description": "Verifies that the wireless adapter can detect available networks.  Make sure that there is a properly configured router or access point nearby before running this test.",
									"groupId": "1"
								},
								{
									"id": "TEST_SIGNAL_STRENGTH_TEST:::4.1.3:::s:::1",
									"name": "Signal Strength Test",
									"description": "Tests the wireless connection quality for the wireless adapter. Make sure that there is a properly configured router or access point nearby before running this test.",
									"groupId": "1"
								}
							]
						}
					]
				},
				{
					"name": "Storage",
					"id": "storage",
					"description": null,
					"version": "Version",
					"imageData": "TDB",
					"groupList": [
						{
							"id": "0",
							"name": "WDC PC SN720 SDAPNTW-256G-1101 - 238.47 GBs",
							"Udi": null,
							"metaInformation": [
								{
									"name": "Model",
									"index": "",
									"value": "WDC PC SN720 SDAPNTW-256G-1101"
								},
								{
									"name": "Serial",
									"index": "",
									"value": "184302800829"
								},
								{
									"name": "Firmware",
									"index": "",
									"value": "10130001"
								},
								{
									"name": "Size",
									"index": "",
									"value": "238.47 GBs"
								},
								{
									"name": "Temperature",
									"index": "",
									"value": "45 °C"
								},
								{
									"name": "Logical Sector Size",
									"index": "",
									"value": "512"
								},
								{
									"name": "Logical Sectors",
									"index": "",
									"value": "500118192"
								},
								{
									"name": "Partition Schema",
									"index": "",
									"value": "GPT"
								},
								{
									"name": "Unallocated",
									"index": "",
									"value": "1.34 MBs"
								},
								{
									"name": "Driver version",
									"index": "",
									"value": "10.0.17763.1"
								},
								{
									"name": "Partition Type",
									"index": "1",
									"value": "EFI System Partition"
								},
								{
									"name": "Size",
									"index": "1",
									"value": "260.00 MBs"
								},
								{
									"name": "Partition Type",
									"index": "2",
									"value": "Microsoft Reserved Partition"
								},
								{
									"name": "Size",
									"index": "2",
									"value": "16.00 MBs"
								},
								{
									"name": "Partition Type",
									"index": "3",
									"value": "Windows Basic Data Partition"
								},
								{
									"name": "File system",
									"index": "3",
									"value": "ntfs"
								},
								{
									"name": "Label",
									"index": "3",
									"value": "Windows-SSD"
								},
								{
									"name": "Mount Point",
									"index": "3",
									"value": "C:\\"
								},
								{
									"name": "Serial",
									"index": "3",
									"value": "1C7DE623"
								},
								{
									"name": "Size",
									"index": "3",
									"value": "237.23 GBs"
								},
								{
									"name": "Used",
									"index": "3",
									"value": "74.43 GBs"
								},
								{
									"name": "Free",
									"index": "3",
									"value": "162.80 GBs"
								},
								{
									"name": "Partition Type",
									"index": "4",
									"value": "Windows Recovery Environment"
								},
								{
									"name": "Size",
									"index": "4",
									"value": "1000.00 MBs"
								}
							],
							"testList": [
								{
									"id": "TEST_SMART_WEAROUT_TEST:::1.1.14:::o:::1",
									"name": "SMART Wearout Test",
									"description": "SMART Wearout Test checks the wearout level of the attached SSD device by reading SMART attributes and informs whether the device is in good condition or has reached its wearout limit.",
									"groupId": "1"
								},
								{
									"id": "TEST_NVME_CONTROLLER_STATUS_TEST:::1.1.22:::g:::1",
									"name": "NVME Controller Status Test",
									"description": "This test detects if the device behaves as expected.",
									"groupId": "1"
								},
								{
									"id": "TEST_NVME_SMART_TEMPERATURE_TEST:::1.1.20:::a:::1",
									"name": "NVME SMART Temperature Test",
									"description": "This test detects if the current temperature for the device is in critical state.",
									"groupId": "1"
								},
								{
									"id": "TEST_NVME_SMART_RELIABILITY_TEST:::1.1.21:::b:::1",
									"name": "NVME SMART Reliability Test",
									"description": "This test detects if the device is still reliable based on SMART metrics.",
									"groupId": "1"
								},
								{
									"id": "TEST_NVME_SMART_SPARE_SPACE_TEST:::1.1.19:::i:::1",
									"name": "NVME SMART Spare Space Test",
									"description": "This test detects if the spare space in the device is critically low.",
									"groupId": "1"
								},
								{
									"id": "TEST_DEVICE_WRITE_TEST:::1.2.12:::w:::1",
									"name": "Device Write Test",
									"description": "The Storage Device Write Test will verify if it is possible to write data on different areas of the device and then read the data correctly.",
									"groupId": "2"
								},
								{
									"id": "TEST_FULL_DISK_SCAN_TEST:::1.2.13:::n:::1",
									"name": "Full Disk Scan Test",
									"description": "This test performs a full verification of the disk.",
									"groupId": "2"
								}
							]
						}
					]
				}
			]
		}

		const hardwareScan: any = {
			getPluginInformation: this.getPromise(pluginInfo),
			getItemsToRecoverBadSectors: this.getPromise(undefined),
			getScheduleScan: this.getPromise(undefined),
			getItemsToScan: this.getPromise(itemsToScan),
			getPreScanInformation: this.getPromise(undefined),
			getDoScan: this.getPromise(undefined),
			deleteScan: this.getPromise(undefined),
			editScan: this.getPromise(undefined),
			getNextScans: this.getPromise(undefined),
			getRecoverBadSectors: this.getPromise(undefined),
			cancelScan: this.getPromise(undefined),
			getPreviousResults: this.getPromise(undefined),
			checkItemsForRecoverBadSectors: this.getPromise(undefined),
			getFinalDoScanResponse: this.getPromise(undefined)
		}

		return hardwareScan;
	}
	// ==================== End Hardware Scan

	public getMouseAndTouchPad(): any {
		const inputControlLinks: any = {
			GetMouseCapability: this.getPromise(true),
			GetTouchpadCapability: this.getPromise(true)
		};

		return inputControlLinks;
	}

	public getVoipHotkeysObject() {
		throw new Error('Method not implemented.');
	}
}

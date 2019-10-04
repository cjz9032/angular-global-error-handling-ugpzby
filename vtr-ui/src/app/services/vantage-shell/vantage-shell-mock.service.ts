import { Injectable } from '@angular/core';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { BaseVantageShellService } from './base-vantage-shell.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { MetricHelper } from 'src/app/data-models/metrics/metric-helper.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Container, BindingScopeEnum } from 'inversify';

declare var Windows;

@Injectable({
	providedIn: 'root'
})

export class VantageShellMockService implements BaseVantageShellService {
	public readonly isShellAvailable = true;
	private phoenix: any;
	private shell: any;
	constructor(private commonService: CommonService, private http: HttpClient) {
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
				// Phoenix.Features.Gaming,
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

	private getPromise(value: any) {
		const promise = () => new Promise((resolve) => resolve(value));
		return promise;
	}

	public registerEvent(eventType: any, handler: any) {
		if (this.phoenix) {
			this.phoenix.on(eventType, (val) => {
				// 	console.log('Event fired: ', eventType, val);
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
				// msg = JSON.stringify(msg);
				logger.info(message);
			}
		};

		console.error = (msg, ...args) => {
			const message = this.getMessage(msg);
			consoleProxy.error(message, args);
			if (logger) {
				// msg = JSON.stringify(msg);
				logger.error(message);
			}
		};

		console.warn = (msg, ...args) => {
			const message = this.getMessage(msg);
			consoleProxy.warn(message, args);
			if (logger) {
				// msg = JSON.stringify(msg);
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
		const warrantyObj: any = {
			expired: new Date('Sat Apr 04 2020 05:30:00 GMT+0530 (India Standard Time)'),
			status: 0
		};
		const sysUpdateObj: any = {
			lastupdate: null,
			status: 0
		};
		dashboard.getMicphoneStatus = this.getPromise(obj);
		dashboard.getCameraStatus = this.getPromise(obj);
		// dashboard.getEyeCareModeState = this.getPromise(obj);
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
			brand: 'think',
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
			os: 'Windows 10 Pro',
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
			brand: 'think',
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
			os: 'Windows 10 Pro',
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
		if (this.phoenix) {
			return this.phoenix.modernPreload;
		}
		return undefined;
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
		if (this.getAudioSettings() && this.getAudioSettings().dolby) {
			return this.getAudioSettings().dolby;
		}
		return undefined;
	}

	/**
	 * returns microphone settings object from VantageShellService of JS Bridge
	 */
	public getMicrophoneSettings(): any {
		if (this.getAudioSettings() && this.getAudioSettings().microphone) {
			return this.getAudioSettings().microphone;
		}
		return undefined;
	}

	/**
	 * returns smart settings object from VantageShellService of JS Bridge
	 */
	public getSmartSettings(): any {
		if (this.getHwSettings() && this.getHwSettings().smartsettings) {
			return this.getHwSettings().smartsettings;
		}
		return undefined;
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
		if (this.getPowerCommonSettings() && this.getPowerCommonSettings().batteryInfo) {
			return this.getPowerCommonSettings().batteryInfo;
		}
		return undefined;
	}
	/**
	 * returns EyecareMode object from VantageShellService of JS Bridge
	 */
	public getEyeCareMode(): any {
		const eyeCareMode: any = {};
		const displayEyeCareMode: any = {};
		const obj = {
			available: true,
			status: true,
			permission: true,
			isLoading: false
		};

		eyeCareMode.getEyeCareModeState = this.getPromise(obj);
		displayEyeCareMode.initEyecaremodeSettings = this.getPromise(false);

		return eyeCareMode;
	}

	/**
	 * returns Privacy Guard object from VantageShellService of JS Bridge
	 */
	public getPrivacyGuardObject(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.display.privacyGuard;
		}
		return undefined;
	}

	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public getCameraPrivacy(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.camera.cameraPrivacy;
		}
		return undefined;
	}
	/**
	 * returns cameraSettings object from VantageShellService of JS Bridge
	 */
	public getCameraSettings(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.camera.cameraSettings;
		}
		return undefined;
	}
	public getVantageToolBar(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.power.common.vantageToolBar;
		}
		return undefined;
	}
	public getPowerIdeaNoteBook(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.power.ideaNotebook;
		}
		return undefined;
	}
	// public getPowerThinkPad(): any {
	// 	if (this.phoenix) {
	// 		return this.phoenix.hwsettings.power.thinkpad ;
	// 	}
	// 	return undefined;
	// }

	public getPowerThinkPad(): any {
		if (this.getPowerSettings() && this.getPowerSettings().thinkpad) {
			return this.getPowerSettings().thinkpad;
		}
		return undefined;
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
		if (this.phoenix && this.phoenix.hwsettings.camera.cameraBlur) {
			return this.phoenix.hwsettings.camera.cameraBlur;
		}
		return undefined;
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
		if (this.phoenix) {
			return this.phoenix.hwsettings.lis.intelligentSensing;
		}
		return undefined;
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
		if (this.phoenix) {
			return this.phoenix.hwsettings.lis.intelligentMedia;
		}
		return undefined;
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
		if (this.phoenix && this.phoenix.hwsettings.power.thinkpad.sectionImcHelper) {
			return this.phoenix.hwsettings.power.thinkpad.sectionImcHelper;
		}
		return undefined;
	}

	// Active Protection System
	public getActiveProtectionSystem(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.aps.ActiveProtectionSystem; // returning APS Object with methods
		}
		return undefined;
	}

	/**
	 * returns Keyboard manager object  from VantageShellService of JS Bridge
	 */
	public getKeyboardManagerObject(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.kbdManager;
		}
		return undefined;
	}
	// =================== Start Lenovo Voice
	public getLenovoVoice(): any {
		if (this.phoenix) {
			return this.phoenix.lenovovoice;
		}
		return undefined;
	}
	// ==================== End Lenovo Voice

	/** returns OledSettings object from VantageShellService of JS Bridge */
	public getOledSettings(): any {
		if (this.getHwSettings()) {
			return this.getHwSettings().display.OLEDSettings;
		}
		return undefined;
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
		if (this.phoenix) {
			return this.phoenix.hardwareScan;
		}
		return undefined;
	}
	// ==================== End Hardware Scan

	public getMouseAndTouchPad(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.inputControlLinks;
		}
		return undefined;
	}
}

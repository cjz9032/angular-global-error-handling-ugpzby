import { Injectable } from '@angular/core';
import * as Phoenix from '@lenovo/tan-client-bridge';
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

export class VantageShellMockService {
	public readonly isShellAvailable: boolean;
	private phoenix: any;
	private shell: any;
	constructor(
		private commonService: CommonService,
		private http: HttpClient
	) {
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
						let isBeta = false;
						const beta = that.getBetaUser();
						if (beta) {
							await beta.getBetaUser().then((result) => {
								isBeta = result;
							}).catch(() => {
								isBeta = false;
							});
						}
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
		return battery;
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
		const devicePower: any = {};
		const toolbarObj: any = {
			available: true,
			status: true
		};

		devicePower.getVantageToolBarStatus = this.getPromise(toolbarObj);
		devicePower.stopMonitor = this.getPromise(true);
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
		const kbdManager: any = {GetKeyboardMapCapability: this.getPromise(true),
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
		const inputControlLinks: any = {
			GetMouseCapability: this.getPromise(true),
			GetTouchpadCapability: this.getPromise(true)
		};

		return inputControlLinks;
	}
}

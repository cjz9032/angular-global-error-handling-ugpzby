import { Injectable } from '@angular/core';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Container, BindingScopeEnum } from 'inversify';
import { Backlight } from '../../components/pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.interface';
import { MetricHelper } from 'src/app/services/metric/metrics.helper';

declare var window;

@Injectable({
	providedIn: 'root'
})

export class VantageShellService {
	public readonly isShellAvailable: boolean;
	private phoenix: any;
	private shell: any;
	constructor(
		private commonService: CommonService,
		private http: HttpClient
	) {
		this.shell = this.getVantageShell();
		if (this.shell) {
			this.isShellAvailable = true;
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
				Phoenix.Features.Device,
				Phoenix.Features.LenovoId,
				Phoenix.Features.HwSettings,
				// Phoenix.Features.Gaming,
				Phoenix.Features.SystemUpdate,
				Phoenix.Features.Warranty,
				Phoenix.Features.UserGuide,
				Phoenix.Features.DeviceFilter,
				Phoenix.Features.Metrics,
				Phoenix.Features.ModernPreload,
				Phoenix.Features.LenovoVoiceFeature,
				Phoenix.Features.GenericMetricsPreference,
				Phoenix.Features.PreferenceSettings,
				Phoenix.Features.HardwareScan,
				Phoenix.Features.DevicePosture,
				Phoenix.Features.AdPolicy,
				Phoenix.Features.Registry,
				Phoenix.Features.SelfSelect,
				Phoenix.Features.UpeAgent,
				Phoenix.Features.SmartPerformance,
			]);
		} else {
			this.isShellAvailable = false;
		}
	}

	public registerEvent(eventType: any, handler: any) {
		if (this.phoenix) {
			this.phoenix.on(eventType, handler);
		}
	}

	public getSelfSelect() {
		if (this.phoenix) {
			return this.phoenix.selfSelect;
		}
		return undefined;
	}

	public unRegisterEvent(eventType: any, handler: any) {
		if (this.phoenix) {
			this.phoenix.off(eventType, handler);
		}
	}
	private getVantageShell(): any {
		return window.VantageShellExtension;
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
		if (this.phoenix) {
			return this.phoenix.dashboard;
		}
		return undefined;
	}

	/**
	 * returns dashboard object from VantageShellService of JS Bridge
	 */
	public getDevice(): any {
		if (this.phoenix) {
			return this.phoenix.device;
		}
	}

	/**
	 * returns sysinfo object from VantageShellService of JS Bridge
	 */
	public getSysinfo(): any {
		if (this.phoenix) {
			return this.phoenix.sysinfo;
		}
		return undefined;
	}

	/**
	 * returns warranty object from VantageShellService of JS Bridge
	 */
	public getWarranty(): any {
		if (this.phoenix) {
			return this.phoenix.warranty;
		}
		return undefined;
	}

	public getShellVersion() {
		if (window.Windows) {
			const packageVersion = window.Windows.ApplicationModel.Package.current.id.version;
			return `${packageVersion.major}.${packageVersion.minor}.${packageVersion.build}`;
		}

		return '';
	}

	/**
	 * returns metric object from VantageShellService of JS Bridge
	 */
	public getMetrics(): any {
		if (this.phoenix && this.phoenix.metrics) {
			return this.phoenix.metrics;
		}

		return MetricHelper.createSimulateObj();
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
			if (!this.phoenix.securityAdvisor) {
				this.phoenix.loadFeatures([Phoenix.Features.SecurityAdvisor]);
			}
			return this.phoenix.securityAdvisor;
		}
		return undefined;
	}

	public getPermission(): any {
		if (this.phoenix) {
			if (!this.phoenix.permissions) {
				this.phoenix.loadFeatures([Phoenix.Features.Permissions]);
			}
			return this.phoenix.permissions;
		}
		return undefined;
	}

	public getConnectedHomeSecurity(): Phoenix.ConnectedHomeSecurity {
		if (this.phoenix) {
			if (!this.phoenix.connectedHomeSecurity) {
				this.phoenix.loadFeatures([Phoenix.Features.ConnectedHomeSecurity]);
			}
			return this.phoenix.connectedHomeSecurity;
		}
		return undefined;
	}

	public getDevicePosture(): Phoenix.DevicePosture {
		if (this.phoenix) {
			if (!this.phoenix.devicePosture) {
				this.phoenix.loadFeatures([Phoenix.Features.DevicePosture]);
			}
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
		if (this.phoenix) {
			return this.phoenix.hwsettings.display.eyeCareMode;
		}
		return undefined;
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

	public getPowerDPM(): any {
		if (this.getPowerSettings() && this.getPowerSettings().dpm) {
			return this.getPowerSettings().dpm;
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

	public getSmartPerformance() {
		if (this.phoenix) {
			if (!this.phoenix.smartPerformance) {
				return this.phoenix.loadFeatures([Phoenix.Features.SmartPerformance]);
			}
			return this.phoenix.smartPerformance;
		}
		return undefined;
	}

	// public getSmartPerformance() {
	// 	console.log('----------CALLING');
	// 	if (this.phoenix) {
	// 		if (!this.phoenix.smartPerformance) {
	// 			return this.phoenix.loadFeatures([Phoenix.Features.HwSettings]);
	// 		}
	// 		console.log(this.phoenix.hwsettings.smartPerformance);
	// 		console.log('----------DONE');
	// 	}
	// 	return undefined;
	// }

	/**
	 * returns CameraPrivacy object from VantageShellService of JS Bridge
	 */
	public async deviceFilter(filter) {
        if (this.phoenix) {
			try {
				const deviceFilterResult = await this.phoenix.deviceFilter.eval(filter);
				// console.log('In VantageShellService.deviceFilter. Filter: ', JSON.stringify(filter), deviceFilterResult);
				return deviceFilterResult;
			} catch (error) {}
			return true;
			// return await this.phoenix.deviceFilter(filter);
		}
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

	public getSuperResolution(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.ai.superResolution;
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
	public getGamingAdvancedOC() {
		if (this.phoenix) {
			if (!this.phoenix.gaming) {
				this.phoenix.loadFeatures([Phoenix.Features.Gaming]);
			}
			return this.phoenix.gaming.gamingAdvancedOC;
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

	/**
	 * returns Keyboard object  from VantageShellService of JS Bridge
	 */
	public getKeyboardObject(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.keyboard;
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

	public getPriorityControl(): any {
		if (this.getHwSettings()) {
			return this.getHwSettings().display.priorityControl;
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
	// shellService
	public getVoipHotkeysObject(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.voipHotkeys;
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

	getTopRowFunctionsIdeapad(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.topRowFunctionsIdeapad;
		}
		return undefined;
	}

	getBacklight(): Backlight {
		if (this.phoenix) {
			return this.phoenix.hwsettings.input.backlight;
		}
		return undefined;
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
}

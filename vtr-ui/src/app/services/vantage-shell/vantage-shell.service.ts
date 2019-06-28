import { Injectable } from '@angular/core';
import * as inversify from 'inversify';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { HybridModeStatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadLockStatus } from 'src/app/data-models/gaming/touchpad-lock-status.model';
import { SystemStatus } from 'src/app/data-models/gaming/system-status.model';
import { MetricHelper } from 'src/app/data-models/metrics/metric-helper.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {
	private phoenix: any;
	private shell: any;
	constructor(private commonService: CommonService,
		private http: HttpClient) {
		this.shell = this.getVantageShell();
		if (this.shell) {
			const metricClient = this.shell.MetricsClient ? new this.shell.MetricsClient() : null;
			const powerClient = this.shell.PowerClient ? this.shell.PowerClient() : null;
			this.phoenix = Phoenix.default(new inversify.Container(), {
				metricsBroker: metricClient,
				hsaPowerBroker: powerClient,
				hsaDolbyBroker: this.shell.DolbyRpcClient ? this.shell.DolbyRpcClient.instance : null,
				hsaForteBroker: this.shell.ForteRpcClient ? this.shell.ForteRpcClient.getInstance() : null
			});
		}
	}

	public registerEvent(eventType: any, handler: any) {
		this.phoenix.on(eventType, (val) => {
			console.log('Event fired: ', eventType, val);
			handler(val);
		});
	}

	public unRegisterEvent(eventType: any, handler: any) {
		this.phoenix.off(eventType, handler);
	}
	private getVantageShell(): any {
		const win: any = window;
		return win.VantageShellExtension;
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

	/**
	 * returns metric object from VantageShellService of JS Bridge
	 */
	public getMetrics(): any {
		if (this.phoenix && this.phoenix.metrics) {
			const metricClient = this.phoenix.metrics;
			if (!metricClient.isInit) {
				metricClient.init({
					appVersion: environment.appVersion,
					appId: MetricHelper.getAppId('dß'),
					appName: 'vantage3',
					channel: '',
					ludpUrl: 'https://chifsr.lenovomm.com/PCJson'
				});
				metricClient.isInit = true;
				metricClient.sendAsyncOrignally = metricClient.sendAsync;
				metricClient.commonService = this.commonService;
				metricClient.sendAsync = async function sendAsync(data) {
					try {
						// automatically fill the OnlineStatus for page view event
						if (!data.OnlineStatus) {
							data.OnlineStatus = this.commonService.isOnline ? 1 : 0;
						}
						return await this.sendAsyncOrignally(data);
					} catch (ex) {
						console.log('an error ocurr when sending metrics event', ex);
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

	public getMetricsPolicy(callback){
		const self = this;
		this.downloadMetricsPolicy().subscribe((response)=>{
			self.deviceFilter(JSON.stringify(response)).then((result)=>{
				const userDeterminePrivacy = self.commonService.getLocalStorageValue(LocalStorageKey.UserDeterminePrivacy);
				if(!userDeterminePrivacy){
					callback(result);
				}
			});	
		});
	}

	private downloadMetricsPolicy() {
		return this.http.get<string>('/assets/privacy-json/metrics.json');
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

	public launchUserGuide(launchPDF?: boolean) {
		if (this.phoenix && this.phoenix.userGuide) {
			this.phoenix.userGuide.launch(launchPDF);
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
			return this.phoenix.gaming.gamingOverclock.getCpuOCStatus();
		}
		return undefined;
	}

	public setCPUOCStatus(CpuOCStatus: CPUOCStatus): any {
		if (this.phoenix) {
			return this.phoenix.gaming.gamingOverclock.setCpuOCStatus(CpuOCStatus.cpuOCStatus);
		}
		return false;
	}

	public getGamingAllCapabilities(): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingAllCapabilities;
		}
		return undefined;
	}

	public getGamingLighting(): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingLighting;
		}
		return undefined;
	}
	public getGamingOverClock(): any {
		if (this.phoenix && this.phoenix.gaming) {
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
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingKeyLock;
		}
		return undefined;
	}

	public getGamingHybridMode() {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingHybridMode;
		}
		return undefined;
	}

	public getGamingHwInfo() {
		if (this.phoenix && this.phoenix.gaming) {
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
		if (this.phoenix && this.phoenix.gaming) {
			console.log('aparna network boost service call' + this.phoenix.gaming.gamingNetworkBoost);
			return this.phoenix.gaming.gamingNetworkBoost;
		}
		return undefined;
	}
	/**
     * returns macroKeyClearInfo object from VantageShellService of JS Bridge
     */
	public setMacroKeyClear(macroKey: string): any {
		if (this.phoenix) {
			console.log('Deleting the following macro key ---->', macroKey);
			return this.phoenix.gaming.gamingMacroKey.setClear(macroKey);
		}
		return undefined;
	}

	public getGamingMacroKey(): any {
		if (this.phoenix && this.phoenix.gaming) {
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
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.initMacroKey();
		}
		return undefined;
	}

	public macroKeySetApplyStatus(key): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setApplyStatus(key);
		}
		return undefined;
	}

	public macroKeySetStartRecording(key): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setStartRecording(key);
		}
		return undefined;
	}

	public macroKeySetStopRecording(key, isSuccess, message): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setStopRecording(key, isSuccess, message);
		}
		return undefined;
	}

	public macroKeySetKey(key): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setKey(key);
		}
		return undefined;
	}

	public macroKeyClearKey(key): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setClear(key);
		}
		return undefined;
	}

	public macroKeySetRepeat(key, repeat): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setRepeat(key, repeat);
		}
		return undefined;
	}

	public macroKeySetInterval(key, interval): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setInterval(key, interval);
		}
		return undefined;
	}

	public macroKeySetMacroKey(key, inputs): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingMacroKey.setMacroKey(key, inputs);
		}
		return undefined;
	}

	public getGamingThermalMode() {
		if (this.phoenix && this.phoenix.gaming) {
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
			console.log('PHOENIX AVAILABLE - vantage shell');
			return this.phoenix.hwsettings.aps.ActiveProtectionSystem; // returning APS Object with methods
		}
		console.log('NO PHOENIX AVAILABLE - vantage shell');
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
			console.log('PHOENIX AVAILABLE - vantage shell');
			return this.phoenix.lenovovoice;
		}
		console.log('NO PHOENIX AVAILABLE - vantage shell');
		return undefined;
	}
	// ==================== End Lenovo Voice
}

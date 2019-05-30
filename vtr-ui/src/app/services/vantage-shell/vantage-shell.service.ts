import { Injectable } from '@angular/core';
import * as inversify from 'inversify';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common/common.service';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { ThermalModeStatus } from 'src/app/data-models/gaming/thermal-mode-status.model';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';

@Injectable({
	providedIn: 'root'
})
export class VantageShellService {
	private phoenix: any;
	private shell: any;
	constructor(private commonService: CommonService) {
		this.shell = this.getVantageShell();
		if (this.shell) {
			const metricClient = this.shell.MetricsClient ? new this.shell.MetricsClient() : null;
			const powerClient = this.shell.PowerClient ? this.shell.PowerClient() : null;
			this.phoenix = Phoenix.default(
				new inversify.Container(),
				{
					metricsBroker: metricClient,
					hsaPowerBroker: powerClient,
					hsaDolbyBroker: this.shell.DolbyRpcClient ? this.shell.DolbyRpcClient.instance : null,
					hsaForteBroker: this.shell.ForteRpcClient ? this.shell.ForteRpcClient.getInstance() : null
				}
			);
		}
	}

	public registerEvent(eventType: any, handler: any) {
		this.phoenix.on(eventType, (val) => {
			console.log('Event fired: ', eventType);
			console.log('Event value: ', val);
			handler(val);
		});
	}

	public unRegisterEvent(eventType: any) {
		this.phoenix.off(eventType, (val) => {
			console.log('unRegister Event: ', eventType);
		});
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
					appId: 'ZN8F02EQU628',
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
						const eventType = data.ItemType.toLowerCase();
						if (eventType === 'pageview') {
							if (!data.OnlineStatus) {
								data.OnlineStatus = this.commonService.isOnline ? 1 : 0;
							}
						}

						return await this.sendAsyncOrignally(data);
					} catch (ex) {
						console.log('an error ocurr when sending metrics event');
						return Promise.resolve({
							status: 0,
							desc: 'ok'
						});
					}
				};
			}

			return metricClient;
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
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingOverclock.GetCpuOCStatus();
			this.phoenix.gaming.gamingOverclock.GetCpuOCStatus().then((cpuOCStatus) => {
				console.log('get cpu oc status js bridge ->', cpuOCStatus);
				return cpuOCStatus;
			});
		}
		return undefined;
	}

	public setCPUOCStatus(CpuOCStatus: CPUOCStatus): any {
		if (this.phoenix) {
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingOverclock.SetCpuOCStatus(CpuOCStatus.cpuOCStatus);
			this.phoenix.gaming.gamingOverclock.setCpuOCStatus(CpuOCStatus.cpuOCStatus).then((response) => {
				console.log('set cpu oc status js bridge ->', response);
				return response;
			});
		}
		return false;
	}

	public getThermalModeStatus(): any {
		if (this.phoenix) {
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingThermal.getThermalModeStatus();
			return undefined;
		}
		return undefined;
	}

	public setThermalModeStatus(ThermalModeStatusObj: ThermalModeStatus): Boolean {
		if (this.phoenix) {
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingThermal.setThermalModeStatus(ThermalModeStatusObj.thermalModeStatus);
			return true;
		}
		return true;
	}

	public getRAMOCStatus(): any {
		if (this.phoenix) {
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingOverclock.GetRamOCStatus();
			this.phoenix.gaming.gamingOverclock.getRamOCStatus().then((ramOCStatus) => {
				console.log('get ram oc status js bridge ->', ramOCStatus);
				return ramOCStatus;
			});
		}
		return undefined;
	}

	public setRAMOCStatus(ramOCStausObj: RamOCSatus): any {
		if (this.phoenix) {
			// TODO Un comment below line when JSBridge is ready for integration.
			// return this.phoenix.gaming.gamingOverclock.SetRamOCStatus(ramOCStausObj.ramOcStatuss);
			this.phoenix.gaming.gamingOverclock.setRamOCStatus(ramOCStausObj.ramOcStatus).then((response) => {
				console.log('set ram oc status js bridge ->', response);
				return response;
			});
		}
		return false;
	}

	public getGamingAllCapabilities(): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingAllCapabilities();
		}
		return undefined;
	}

	public getGamingLighting(): any {
		if (this.phoenix && this.phoenix.gaming) {
			return this.phoenix.gaming.gamingLighting();
		}
		return undefined;
	}

	public getIntelligentSensing(): any {
		if (this.phoenix) {
			return this.phoenix.hwsettings.lis.intelligentSensing;
		} return undefined;
	}

	public getMetricPreferencePlugin() {
		if (this.phoenix) {
			return this.phoenix.genericMetricsPreference;
		}
	}
}

import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { CommonService } from 'src/app/services/common/common.service';
import { Injectable } from '@angular/core';
import { ShellExtensionService } from './shell-extension.service';
import { Subscription } from 'rxjs';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Injectable({
	providedIn: 'root',
})
export class BoostService {
	subscription: Subscription;

	constructor(
		private shellExtension: ShellExtensionService,
		private commonService: CommonService,
		private selfSelectService: SelfSelectService,
		private logger: LoggerService,
		public deviceService: DeviceService
	) {
		this.subscription = this.commonService.replayNotification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
	}

	getProfileName(): Promise<string> {
		const contract = {
			contract: 'Vantage.BoostAddin.Profile',
			command: 'Get-Profile',
		};

		return this.shellExtension.sendContract(contract);
	}

	switchProfile(profileName: string): Promise<void> {
		const contract = {
			contract: 'Vantage.BoostAddin.Profile',
			command: 'Switch-Profile',
			payload: {
				profileName,
			},
		};

		return this.shellExtension.sendContract(contract);
	}

	lazySwitchProfile(profileName: string): Promise<void> {
		const contract = {
			contract: 'Vantage.BoostAddin.Profile',
			command: 'LazySwitch-Profile',
			payload: {
				profileName,
			},
		};

		return this.shellExtension.sendContract(contract);
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case SelfSelectEvent.SegmentChange:
					const profile = this.convertToProfileName(notification.payload);
					if (profile && !this.deviceService.isGaming) {
						this.switchProfile(profile);
					}
					break;
				default:
					break;
			}
		}
	}

	private convertToProfileName(segment: string): string | undefined {
		if (!segment) {
			return undefined;
		}

		if (segment.toLowerCase() === 'smb') {
			return 'smb';
		}

		return 'gaming';
	}
}

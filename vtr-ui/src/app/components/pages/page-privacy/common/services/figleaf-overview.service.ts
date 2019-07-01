import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { ReplaySubject, timer, zip } from 'rxjs';
import { filter, switchMapTo, take, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';

interface FigleafSettingsMessageResponse {
	type: 'getFigleafSettings';
	status: number;
	payload: FigleafSettings;
}

interface FigleafStatusResponse {
	type: 'getFigleafStatus';
	status: number;
	payload: FigleafStatus;
}

export interface FigleafStatus {
	appVersion: string;
	licenseType: licenseTypes;
	expirationDate: number;
}

interface FigleafSettings {
	isAntitrackingEnabled: boolean;
	isBreachMonitoringEnabled: boolean;
}

interface FigleafDashboardMessageResponse {
	type: 'getFigleafDashboard';
	status: number;
	payload: FigleafDashboard;
}

export interface FigleafDashboard {
	totalAccounts: number;
	maskedAccounts: number;
	blockedTrackers: number;
	websitesConnectedPrivately: number;
}

export enum licenseTypes {
	Unknown,
	Free,
	Trial,
	Subscription,
	NonInstalled
}

@Injectable()
export class FigleafOverviewService implements OnDestroy {

	figleafSettings$ = new ReplaySubject<FigleafSettings>(1);
	figleafDashboard$ = new ReplaySubject<FigleafDashboard>(1);
	figleafStatus$ = new ReplaySubject<FigleafStatus>(1);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$
			.pipe(
				filter(isFigleafReadyForCommunication => !!isFigleafReadyForCommunication),
				switchMapTo(timer(0, 30000)),
				switchMapTo(zip(
					this.getFigleafData<FigleafSettingsMessageResponse>('getFigleafSettings'),
					this.getFigleafData<FigleafDashboardMessageResponse>('getFigleafDashboard'),
					this.getFigleafData<FigleafStatusResponse>('getFigleafStatus'),
					)
				),
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe(([settings, dashboard, status]) => {
				this.figleafSettings$.next(settings.payload);
				this.figleafDashboard$.next(dashboard.payload);
				this.figleafStatus$.next(status.payload);
			});
	}

	ngOnDestroy() {
	}

	getFigleafData<T>(type: string) {
		return this.communicationWithFigleafService
			.sendMessageToFigleaf<T>({type})
			.pipe(take(1));
	}

	private transformLicenseType(payload: FigleafStatus) {
		return {...payload, licenseType: licenseTypes[payload.licenseType]};
	}
}

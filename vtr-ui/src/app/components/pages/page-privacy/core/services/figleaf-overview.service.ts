import { Injectable, OnDestroy } from '@angular/core';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { merge, ReplaySubject, zip } from 'rxjs';
import { filter, switchMapTo, take, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { UpdateTriggersService } from './update-triggers.service';

interface MessageResponse<T> {
	type: string;
	status: number;
	payload: T;
}

interface FigleafSettingsMessageResponse extends MessageResponse<FigleafSettings> {
	type: 'getFigleafSettings';
}

interface FigleafStatusResponse extends MessageResponse<FigleafStatus> {
	type: 'getFigleafStatus';
}

interface FigleafDashboardMessageResponse extends MessageResponse<FigleafDashboard> {
	type: 'getFigleafDashboard';
}

export interface FigleafStatus {
	appVersion: string;
	licenseType: licenseTypes;
	expirationDate: number;
	daysToExpiration: number;
}

export interface FigleafSettings {
	isAntitrackingEnabled: boolean;
	isBreachMonitoringEnabled: boolean;
}

export interface FigleafDashboard {
	totalAccounts: number;
	maskedAccounts: number;
	monitoredAccounts: number;
	blockedTrackers: number;
	websitesConnectedPrivately: number;
}

export enum licenseTypes {
	Unknown,
	Free,
	Trial,
	Subscription,
	TrialExpired,
	SubscriptionExpired,
	NonInstalled
}

@Injectable({
	providedIn: 'root'
})
export class FigleafOverviewService implements OnDestroy {
	figleafSettings$ = new ReplaySubject<FigleafSettings>(1);
	figleafDashboard$ = new ReplaySubject<FigleafDashboard>(1);
	figleafStatus$ = new ReplaySubject<FigleafStatus>(1);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private updateTriggersService: UpdateTriggersService
	) {
		this.isFigleafClosed$();
		this.isFigleafReady$();
	}

	ngOnDestroy() {
	}

	getFigleafData<T>(type: string) {
		return this.communicationWithFigleafService
			.sendMessageToFigleaf<T>({type})
			.pipe(take(1));
	}

	private transformLicenseType(payload: FigleafStatus) {
		let licenseType = payload.licenseType;
		const isTrialLicense = payload.licenseType === licenseTypes.Trial;
		const isSubscriptionLicense = payload.licenseType === licenseTypes.Subscription;
		const isExpired = payload.expirationDate < Math.floor(Date.now() / 1000);

		if (isTrialLicense && isExpired) {
			licenseType = licenseTypes.TrialExpired;
		}

		if (isSubscriptionLicense && isExpired) {
			licenseType = licenseTypes.SubscriptionExpired;
		}

		return {...payload, licenseType};
	}

	private isFigleafClosed$() {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
			filter(isFigleafReadyForCommunication => !isFigleafReadyForCommunication),
			takeUntil(instanceDestroyed(this)),
		).subscribe(() => {
			this.figleafSettings$.next({
				isAntitrackingEnabled: false,
				isBreachMonitoringEnabled: false
			});
		});
	}

	private isFigleafReady$() {
		merge(
			this.communicationWithFigleafService.isFigleafReadyForCommunication$,
			this.updateTriggersService.shouldUpdate$
		).pipe(
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$),
			filter(isFigleafReadyForCommunication => !!isFigleafReadyForCommunication),
			switchMapTo(zip(
				this.getFigleafData<FigleafSettingsMessageResponse>('getFigleafSettings'),
				this.getFigleafData<FigleafDashboardMessageResponse>('getFigleafDashboard'),
				this.getFigleafData<FigleafStatusResponse>('getFigleafStatus'),
				)
			),
			takeUntil(instanceDestroyed(this)),
		).subscribe(([settings, dashboard, status]) => {
			this.figleafSettings$.next(settings.payload);
			this.figleafDashboard$.next(dashboard.payload);
			this.figleafStatus$.next(this.transformLicenseType(status.payload));
		});
	}
}

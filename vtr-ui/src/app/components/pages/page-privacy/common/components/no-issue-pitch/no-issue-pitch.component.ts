import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { combineLatest, Observable, of } from 'rxjs';
import { RoutersName } from '../../../privacy-routing-name';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { UserDataGetStateService } from '../../services/user-data-get-state.service';

@Component({
	selector: 'vtr-no-issue-pitch',
	templateUrl: './no-issue-pitch.component.html',
	styleUrls: ['./no-issue-pitch.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoIssuePitchComponent implements OnInit, OnDestroy {
	isShowPitch$ = of(false);
	currentPath: RoutersName;

	@ViewChild('breachAccount', { static: true }) private breachAccount: ElementRef;
	@ViewChild('trackers', { static: true }) private trackers: ElementRef;
	@ViewChild('nonPrivatePassword', { static: true }) private nonPrivatePassword: ElementRef;

	private templateForPitch: { [path in RoutersName]?: ElementRef };

	private textForPitch = {
		[RoutersName.BREACHES]: {
			title: 'How do I prevent this?',
			text: 'Lenovo Privacy Essentials by FigLeaf monitors online accounts in real time and notifies you when your private information is at risk.'
		},
		[RoutersName.TRACKERS]: {
			title: 'How do I prevent this?',
			text: 'Lenovo Privacy Essentials by FigLeaf lets you visit your favorite websites without sharing your private information.'
		},
		[RoutersName.BROWSERACCOUNTS]: {
			title: 'How do I prevent this?',
			text: 'Avoid reusing and storing your passwords in your browsers. ' +
				'Create strong, unique passwords for every account with Lenovo Privacy Essentials by FigLeaf and store them in encrypted form on your PC.'
		}
	};

	private isFigleafReadyForCommunication$ = this.communicationWithFigleafService.isFigleafReadyForCommunication$;
	private breachedAccountsCount$ = this.countNumberOfIssuesService.breachedAccountsCount;
	private breachedAccountsWasScanned$ = this.getState('breachedAccountsResult');

	private trackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount;
	private trackersWasScanned$ = this.getState('websiteTrackersResult');

	private nonPrivatePasswordCount$ = this.countNumberOfIssuesService.nonPrivatePasswordCount;
	private nonPrivatePasswordWasScanned$ = this.getState('nonPrivatePasswordResult');

	private breachesNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.breachedAccountsCount$,
		this.breachedAccountsWasScanned$
	);

	private trackersNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.trackersCount$,
		this.trackersWasScanned$
	);

	private nonPrivatePasswordNoIssues$ = this.generateState(
		this.isFigleafReadyForCommunication$,
		this.nonPrivatePasswordCount$,
		this.nonPrivatePasswordWasScanned$
	);

	private noIssues: { [path in RoutersName]?: Observable<boolean> } = {
		[RoutersName.TRACKERS]: this.trackersNoIssues$,
		[RoutersName.BREACHES]: this.breachesNoIssues$,
		[RoutersName.BROWSERACCOUNTS]: this.nonPrivatePasswordNoIssues$,
	};

	constructor(
		private routerChangeHandlerService: RouterChangeHandlerService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private userDataGetStateService: UserDataGetStateService,
		private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.templateForPitch = {
			[RoutersName.BREACHES]: this.breachAccount,
			[RoutersName.TRACKERS]: this.trackers,
			[RoutersName.BROWSERACCOUNTS]: this.nonPrivatePassword
		};

		this.routerChangeHandlerService.onChange$
			.pipe(takeUntil(instanceDestroyed(this)))
			.subscribe(
				(currentPath: RoutersName) => {
					this.isShowPitch$ = this.noIssues[currentPath];
					this.currentPath = currentPath;
					this.cdr.detectChanges();
				}
			);
	}

	ngOnDestroy() { }

	getText() {
		return this.textForPitch[this.currentPath];
	}

	getTemplate() {
		return this.templateForPitch[this.currentPath];
	}

	private getState(userStatuses: string) {
		return this.userDataGetStateService.userDataStatus$.pipe(
			map((userDataStatus) =>
				userDataStatus[userStatuses] !== FeaturesStatuses.undefined &&
				userDataStatus[userStatuses] !== FeaturesStatuses.error),
			distinctUntilChanged(),
		);
	}

	private generateState(
		isFigleafReadyForCommunication$: Observable<boolean>,
		countOfIssue$: Observable<number>,
		wasScanned$: Observable<boolean>
	) {
		return combineLatest([
			isFigleafReadyForCommunication$,
			countOfIssue$,
			wasScanned$
		]).pipe(
			map(([isFigleafReadyForCommunication, countOfIssue, wasScanned]) =>
				!isFigleafReadyForCommunication && countOfIssue === 0 && wasScanned),
			distinctUntilChanged(),
		);
	}
}

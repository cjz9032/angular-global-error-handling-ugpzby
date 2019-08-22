import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { RouterChangeHandlerService } from '../../services/router-change-handler.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { CountNumberOfIssuesService } from '../../services/count-number-of-issues.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { RoutersName } from '../../../privacy-routing-name';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { AppStatusesService } from '../../services/app-statuses/app-statuses.service';

@Component({
	selector: 'vtr-did-you-know',
	templateUrl: './did-you-know.component.html',
	styleUrls: ['./did-you-know.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DidYouKnowComponent implements OnInit, OnDestroy {
	isShowPitch$ = of(false);
	currentPath: RoutersName;

	@ViewChild('breachAccount', { static: true }) private breachAccount: ElementRef;
	@ViewChild('trackers', { static: true }) private trackers: ElementRef;
	@ViewChild('nonPrivatePassword', { static: true }) private nonPrivatePassword: ElementRef;

	private templateForPitch: { [path in RoutersName]?: ElementRef };

	private textForPitch = {
		[RoutersName.BREACHES]: {
			title: 'How do I prevent this?',
			text: 'Lenovo Privacy Essentials by FigLeaf will continuously scan the dark web and notify you if find your private information in data breaches.'
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
	private breachedAccountsWasScanned$ = this.getWasScannedState('breachedAccountsResult');

	private trackersCount$ = this.countNumberOfIssuesService.websiteTrackersCount;
	private trackersWasScanned$ = this.getWasScannedState('websiteTrackersResult');

	private nonPrivatePasswordCount$ = this.countNumberOfIssuesService.nonPrivatePasswordCount;
	private nonPrivatePasswordWasScanned$ = this.getWasScannedState('nonPrivatePasswordResult');

	private shouldShowDidYouKnowBlockSubj = new BehaviorSubject(false);
	shouldShowDidYouKnowBlock$ = this.shouldShowDidYouKnowBlockSubj.asObservable();

	private breachesNoIssues$ = this.generateNoIssueState(
		this.isFigleafReadyForCommunication$,
		this.breachedAccountsCount$,
		this.breachedAccountsWasScanned$
	);

	private trackersNoIssues$ = this.generateNoIssueState(
		this.isFigleafReadyForCommunication$,
		this.trackersCount$,
		this.trackersWasScanned$
	);

	private nonPrivatePasswordNoIssues$ = this.generateNoIssueState(
		this.isFigleafReadyForCommunication$,
		this.nonPrivatePasswordCount$,
		this.nonPrivatePasswordWasScanned$
	);

	private noIssues: { [path in RoutersName]?: Observable<boolean> } = {
		[RoutersName.TRACKERS]: this.trackersNoIssues$,
		[RoutersName.BREACHES]: this.breachesNoIssues$,
		[RoutersName.BROWSERACCOUNTS]: this.nonPrivatePasswordNoIssues$,
	};

	private didYouKnowBlockShowConditions: { [path in RoutersName]?: Observable<boolean> } = {
		[RoutersName.BREACHES]: this.getShowCondition(this.breachedAccountsWasScanned$, this.breachesNoIssues$),
		[RoutersName.TRACKERS]: this.getShowCondition(this.trackersWasScanned$, this.trackersNoIssues$),
		[RoutersName.BROWSERACCOUNTS]: this.getShowCondition(this.nonPrivatePasswordWasScanned$, this.nonPrivatePasswordNoIssues$),
	};

	constructor(
		private routerChangeHandlerService: RouterChangeHandlerService,
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private countNumberOfIssuesService: CountNumberOfIssuesService,
		private appStatusesService: AppStatusesService,
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

		this.routerChangeHandlerService.onChange$.pipe(
			switchMap(() => this.didYouKnowBlockShowConditions[this.currentPath] || of(false)),
			takeUntil(instanceDestroyed(this))
		).subscribe((val: boolean) => {
			this.shouldShowDidYouKnowBlockSubj.next(val);
		});
	}

	ngOnDestroy() {}

	getText() {
		return this.textForPitch[this.currentPath];
	}

	getTemplate() {
		return this.templateForPitch[this.currentPath];
	}

	private getWasScannedState(userStatuses: string) {
		return this.appStatusesService.globalStatus$.pipe(
			map((userDataStatus) =>
				userDataStatus[userStatuses] !== FeaturesStatuses.undefined &&
				userDataStatus[userStatuses] !== FeaturesStatuses.error),
			distinctUntilChanged(),
		);
	}

	private generateNoIssueState(
		isFigleafReadyForCommunication$: Observable<boolean>,
		countOfIssue$: Observable<number>,
		wasScanned$: Observable<boolean>
	): Observable<boolean> {
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

	private getShowCondition(wasScannedState: Observable<boolean>, noIssuesState: Observable<boolean>): Observable<boolean> {
		return combineLatest(
			wasScannedState.pipe(map(value => !value)),
			noIssuesState,
		).pipe(
			map((val) => val.includes(true))
		);
	}
}

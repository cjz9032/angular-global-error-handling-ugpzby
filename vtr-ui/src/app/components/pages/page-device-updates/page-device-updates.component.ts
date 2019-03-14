import { Component, OnInit, NgZone } from '@angular/core';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-page-device-updates',
	templateUrl: './page-device-updates.component.html',
	styleUrls: ['./page-device-updates.component.scss']
})
export class PageDeviceUpdatesComponent implements OnInit {
	title = 'System Updates';
	back = 'BACK';
	backarrow = '< ';
	private lastUpdatedText = 'Last update was on';
	private nextScanText = 'Next update scan is scheduled on';
	private lastInstallTime = new Date('1970-01-01T01:00:00');
	// private lastScanTime = new Date('1970-01-01T01:00:00');
	private nextScheduleScanTime = new Date('1970-01-01T01:00:00');
	public percentCompleted = 0;
	public updateInfo;
	public criticalUpdates: any;
	public recommendedUpdates: any;
	public optionalUpdates: any;
	public isUpdatesAvailable = false;
	public canShowProgress = false;

	nextUpdatedDate = '11/12/2018 at 10:00 AM';
	installationHistory = 'Installation History';

	installationHistoryList = [
		{
			status: 'fail',
			icon: 'times',
			installationDate: '14 FEB 2018',
			path: '/'
		},
		{
			status: 'pause',
			icon: 'minus',
			installationDate: '16 MAR 2018',
			path: '/'
		},
		{
			status: 'success',
			icon: 'check',
			installationDate: '21 JUL 2018',
			path: '/'
		}
	];

	dummyUpdates = [
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Critical Updates',
			subHeader: '',
			isCheckBoxVisible: true,
			isSwitchVisible: true,
			tooltipText: 'Critical updates can prevent significant problem, major malfunctions, hardware failure, or data corruption.'
		},
		{
			readMoreText: '',
			rightImageSource: ['far', 'question-circle'],
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Recommended Updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: true,
			tooltipText: 'Recommended driver updates keep your computer running at optimal performance.'
		},
		{
			readMoreText: '',
			rightImageSource: '',
			leftImageSource: ['fas', 'battery-three-quarters'],
			header: 'Windows Updates',
			subHeader: '',
			isCheckBoxVisible: false,
			isSwitchVisible: false,
			linkText: 'Windows Settings',
			linkPath: ''
		}
	];

	constructor(
		private systemUpdateService: SystemUpdateService
		, private commonService: CommonService
		, private ngZone: NgZone
	) { }

	ngOnInit() {
		this.getLastUpdateScanDetail();
	}

	private getLastUpdateScanDetail() {
		if (this.systemUpdateService.isShellAvailable) {
			this.systemUpdateService.getMostRecentUpdateInfo()
				.then((value: any) => {
					console.log('getLastUpdateScanDetail.then', value);
					this.lastInstallTime = new Date(value.lastInstallTime);
					// this.lastScanTime = new Date(value.lastScanTime);
					this.nextScheduleScanTime = new Date(value.nextScheduleScanTime);

					// lastInstallTime: "2019-03-01T10:09:53"
					// lastScanTime: "2019-03-12T18:24:03"
					// nextScheduleScanTime: "2019-03-15T10:07:42"
					// scheduleScanEnabled: true
				}).catch(error => {
					console.error('getLastUpdateScanDetail', error);
				});
		}
	}

	public getLastUpdatedText() {
		const installDate = this.commonService.formatDate(this.lastInstallTime.toISOString());
		const installTime = this.commonService.formatTime(this.lastInstallTime.toISOString());

		return `${this.lastUpdatedText} ${installDate} at ${installTime}`;
	}

	public getNextUpdatedScanText() {
		const scanDate = this.commonService.formatDate(this.nextScheduleScanTime.toISOString());
		const scanTime = this.commonService.formatTime(this.nextScheduleScanTime.toISOString());

		return `${this.nextScanText} ${scanDate} at ${scanTime}`;
	}

	onCheckForUpdates() {

		if (this.systemUpdateService.isShellAvailable) {
			this.canShowProgress = true;
			this.isUpdatesAvailable = false;
			const that = this;

			this.systemUpdateService.checkForUpdates((percent: number) => {
				console.log('update percent', percent);
				this.ngZone.run(() =>
					that.percentCompleted = percent
				);
			})
				.then((value: any) => {
					console.log('onCheckForUpdates.then', value);
					this.updateInfo = value;
					this.setUpdateByCategory(value.updateList);
					this.isUpdatesAvailable = (value && value.updateList.length > 0);
					this.canShowProgress = false;
				}).catch(error => {
					console.error('onCheckForUpdates', error);
				});

			console.log('isUpdatesAvailable ', this.isUpdatesAvailable);

		}
	}

	private setUpdateByCategory(updateList: Array<any>) {
		if (updateList) {
			this.optionalUpdates = this.filterUpdate(updateList, 'optional');
			this.recommendedUpdates = this.filterUpdate(updateList, 'recommended');
			this.criticalUpdates = this.filterUpdate(updateList, 'critical');

			console.log('update categories', this.optionalUpdates, this.criticalUpdates, this.recommendedUpdates);
		}
	}

	private filterUpdate(updateList: Array<any>, packageSeverity: string) {
		const updates = updateList.filter((value: any) => {
			return value.packageSeverity.toLowerCase() === packageSeverity.toLowerCase();
		});
		return updates;
	}
}

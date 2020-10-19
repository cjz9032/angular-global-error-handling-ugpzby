import { Component, OnInit, NgZone, OnDestroy, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ModalHardwareScanCustomizeComponent } from '../../../components/modal/modal-hardware-scan-customize/modal-hardware-scan-customize.component';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { ModalWaitComponent } from '../../../components/modal/modal-wait/modal-wait.component';
import { TaskType, TaskStep, HardwareScanProgress, HardwareScanFinishedHeaderType } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { ScanExecutionService } from '../../../services/scan-execution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolExecutionService } from '../../../services/protocol-execution.service';
import { HardwareScanMetricsService } from 'src/app/modules/hardware-scan/services/hardware-scan-metrics.service';
import { HardwareScanFeaturesService } from '../../../services/hardware-scan-features.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ExportResultsService } from '../../../services/export-results.service';
import { TimerService } from 'src/app/services/timer/timer.service';

const RootParent = 'HardwareScan';
const ViewResultsButton = 'ViewResults';

@Component({
	selector: 'vtr-hardware-components',
	templateUrl: './hardware-components.component.html',
	styleUrls: ['./hardware-components.component.scss']
})

export class HardwareComponentsComponent implements OnInit, OnDestroy {

	public viewResultsPath = '';
	public resultItems: any;
	public hardwareTitle = '';
	public isScanDone = false;
	public progress = 0;
	public tooltipInformation: any;

	public itemParentSummary: string;
	public itemNameSummary: string;

	public set deviceInRecover(value: string) {
		this.hardwareScanService.setDeviceInRecover(value);
	}
	public get deviceInRecover(): string {
		return this.hardwareScanService.getDeviceInRecover();
	}

	private notificationSubscription: Subscription;
	private customizeModal = ModalHardwareScanCustomizeComponent;
	public itemsNextScan: any = [];
	private cancelHandler = {
		cancel: undefined
	};
	private batteryMessage: string;
	private culture: any;
	private metrics: any;

	public isOnline = true;

	public get isFeatureExportAvailable(): boolean {
		if (this.hardwareScanService.isScanOrRBSFinished() && this.hardwareScanService.getEnableViewResults()) {
			return this.hwscanFeaturesService.isExportLogAvailable;
		}

		return false;
	}

	// "Wrapper" value to be accessed from the HTML
	public taskTypeEnum = TaskType;

	public set modules(value: any) {
		this.scanExecutionService.modules = value;
	}

	public get modules(): any {
		return this.scanExecutionService.modules;
	}

	public get completedStatus(): boolean | undefined {
		return this.hardwareScanService.getCompletedStatus();
	}

	constructor(
		public deviceService: DeviceService,
		private commonService: CommonService,
		private hardwareScanService: HardwareScanService,
		private ngZone: NgZone,
		private modalService: NgbModal,
		config: NgbModalConfig,
		private translate: TranslateService,
		private shellService: VantageShellService,
		private scanExecutionService: ScanExecutionService,
		private protocolExecutionService: ProtocolExecutionService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private hwscanFeaturesService: HardwareScanFeaturesService,
		private exportService: ExportResultsService,
		private logger: LoggerService,
		private hardwareScanMetricsService: HardwareScanMetricsService,
		private timerService: TimerService
	) {
		this.viewResultsPath = '/hardware-scan/view-results';
		this.isOnline = this.commonService.isOnline;
		this.metrics = this.shellService.getMetrics();
	}

	@HostListener('document: visibilitychange')
	onVisibilityChange(): void {
		const visibility = document.visibilityState;
		if (visibility === 'visible') {
			if (this.hardwareScanService.hasLastResponse()) {
				this.hardwareScanService.renderLastResponse();
			}
		}
	}

	ngOnInit() {
		this.culture = this.hardwareScanService.getCulture();

		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});

		this.hardwareScanService.startRecover.subscribe(() => {
			this.initComponent();
		});

		this.setPageTitle();
		this.initComponent();

		// Entry point to validate if runs a scan by protocol
		this.activatedRoute.queryParams.subscribe(params => {
			if (this.protocolExecutionService.validateParams(params) &&
				!this.hardwareScanService.isScanOrRBSExecuting()){
				// Validate loading module
				if (!this.hardwareScanService.isLoadingDone()){
					this.openWaitHardwareComponentsModal().result.then(() => {
						// Close all modals to avoid a scan to be started from HardwareScanPage
						this.modalService.dismissAll();
						this.protocolExecutionService.protocolExecution(params.scan, params.module);
					});
				} else {
					// Close all modals to avoid a scan to be started from HardwareScanPage
					this.modalService.dismissAll();
					this.protocolExecutionService.protocolExecution(params.scan, params.module);
				}
				// Back button doesn't work properly when using protocol, due to additional URL params.
				// So I'm removing these parameters here to fix it.
				this.router.navigate(['/hardware-scan'], { replaceUrl: true });
			}
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	public initComponent() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverInit()) {
				this.scanExecutionService.doRecoverBadSectors();
				this.hardwareScanService.setRecoverInit(false);
			}

			if (this.hardwareScanService.hasLastResponse()) {
				// Here we're executing a scan or RBS and the screen must reflect the running state
				this.hardwareScanService.renderLastResponse();
			} else if (!this.hardwareScanService.isScanOrRBSFinished()) {
				if (this.hardwareScanService.isScanDoneExecuting()) {
					this.hardwareScanService.setIsScanDone(false);
					this.hardwareScanService.setScanExecutionStatus(false);
					this.hardwareScanService.setRecoverExecutionStatus(false);
				}

				// Here we "initialize" the homepage, but only if a scan or RBS isn't running or just finished.
				// In that case, we'll keep the screen with the last state, which is already stored in "this.modules"
				if (!this.hardwareScanService.isScanExecuting() &&
					!this.hardwareScanService.isRecoverExecuting() &&
					!this.hardwareScanService.isScanOrRBSFinished()) {
					this.modules = this.scanExecutionService.getItemToDisplay();
				}

				if (!this.hardwareScanService.isLoadingDone()) {
					this.hardwareScanService.initLoadingModules(this.culture);
				}

				this.hardwareScanService.setFinalResponse(null);
				this.hardwareScanService.setEnableViewResults(false);
			}
		}
	}

	public disableRefreshAnchor() {
		return this.scanExecutionService.scanClicked || !this.isModulesRetrieved();
	}

	public isModulesRetrieved() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getModulesRetrieved() !== undefined;
		}
	}

	public isLoadingDone() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isLoadingDone();
		}
	}

	public isScanExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isScanExecuting();
		}
	}

	public isRecoverExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isRecoverExecuting();
		}
	}

	public exportResults() {
		if (this.exportService) {
			if (this.hardwareScanService.getScanFinishedHeaderType() === HardwareScanFinishedHeaderType.Scan) {
				this.timerService.start();
				let result = HardwareScanMetricsService.FAIL_RESULT;
				this.exportService.exportScanResults().then(() => {
					result = HardwareScanMetricsService.SUCCESS_RESULT;
					// TODO, probably open modal
				}).catch(() => {
					this.logger.error('Export Scan Results rejected');
				}).finally(() => {
					this.hardwareScanMetricsService.sendTaskActionMetrics(
						HardwareScanMetricsService.EXPORT_LOG_TASK_NAME,
						result === HardwareScanMetricsService.SUCCESS_RESULT ? 1 : 0,
						'',
						result,
						this.timerService.stop());
				});
			} else if (this.hardwareScanService.getScanFinishedHeaderType() === HardwareScanFinishedHeaderType.RecoverBadSectors) {
				// TODO
			}
		}
	}

	public getEnableViewResults() {
		const isEnableViewResults = this.hardwareScanService.getEnableViewResults();
		if (isEnableViewResults) {
			this.hardwareScanService.setCurrentTaskStep(TaskStep.Summary);
			this.itemParentSummary = this.getMetricsParentValue();
			this.itemNameSummary = this.getMetricsItemNameSummary();
		}
		return isEnableViewResults;
	}

	public getComponentsTitle() {
		if (this.hardwareScanService) {
			// Component List title when refreshing components
			if (this.isRefreshingModules()) {
				return this.translate.instant('hardwareScan.loadingComponents');
			}

			// Component List title when executing a RBS operation
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.localDevices');
			}

			// Component List title used for all other cases
			return this.translate.instant('hardwareScan.hardwareComponents');
		}
	}

	public getDeviceTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.deviceInRecover;
			} else {
				return this.translate.instant('hardwareScan.title');
			}
		}
	}

	public getDeviceSubTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.moreInfo');
			} else {
				return this.translate.instant('hardwareScan.subtitle');
			}
		}
	}

	private setPageTitle(title?: string) {
		if (title) {
			this.hardwareTitle = title;
		} else {
			this.hardwareTitle = this.translate.instant('hardwareScan.title');
		}
	}

	public onCancelScan() {
		if (this.scanExecutionService) {
			this.scanExecutionService.onCancelScan();
		}
	}

	public refreshModules() {
		if (this.scanExecutionService) {
			this.scanExecutionService.refreshModules();
		}
	}

	public getProgress() {
		if (this.scanExecutionService) {
			return this.scanExecutionService.executionProgress;
		}
	}

	public getItemParentCancelScan() {
		if (this.scanExecutionService) {
			return this.scanExecutionService.itemParentCancelScanMetrics;
		}
	}

	public getItemNameCancelScan() {
		if (this.scanExecutionService) {
			return this.scanExecutionService.itemNameCancelScanMetrics;
		}
	}

	private onCustomizeScan() {
		const modalRef = this.modalService.open(this.customizeModal, {
			size: 'lg',
			centered: true,
			windowClass: 'custom-modal-size'
		});
		modalRef.componentInstance.items = this.hardwareScanService.getCustomScanModules();
		modalRef.componentInstance.passEntry.subscribe(() => {
			this.hardwareScanService.filterCustomTests(this.culture);
			this.scanExecutionService.checkPreScanInfo(TaskType.CustomScan); // custom scan
		});

		modalRef.componentInstance.modalClosing.subscribe(success => {
			// Re-enabling the button, once the modal has been closed in a way
			// the user didn't started the Scan proccess.
			if (!success) {
				this.scanExecutionService.scanClicked = false;
			}
		});
	}

	private openWaitHardwareComponentsModal() {
		const modal: NgbModalRef = this.modalService.open(ModalWaitComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'hardware-scan-modal-size'
		});

		( modal.componentInstance as ModalWaitComponent).modalTitle = this.translate.instant('hardwareScan.loadingComponents');
		( modal.componentInstance as ModalWaitComponent).modalDescription = this.translate.instant('hardwareScan.retrievingHardwareInformation');
		( modal.componentInstance as ModalWaitComponent).shouldCloseModal = this.hardwareScanService.isHardwareModulesLoaded();
		( modal.componentInstance as ModalWaitComponent).ItemParent = 'HardwareScan.LoadingComponents';
		( modal.componentInstance as ModalWaitComponent).CancelItemName = 'LoadingComponents.Close';

		return modal;
	}

	public startScanWaitingModules(taskType: TaskType) {
		this.scanExecutionService.scanClicked = true; // Disable button, preventing multiple clicks by the user

		this.hardwareScanService.setLastTaskType(taskType);

		if (!this.hardwareScanService.isLoadingDone()) {
			const modalWait = this.openWaitHardwareComponentsModal();
			modalWait.result.then((result) => {
				// Hardware modules have been retrieved, so let's continue with the Scan process
				if (taskType === TaskType.QuickScan) {
					this.scanExecutionService.checkPreScanInfo(taskType);
				} else if (taskType === TaskType.CustomScan) {
					this.onCustomizeScan();
				}
			}, (reason) => {
				// User has clicked in the 'X' button, so we need to re-enable the Quick/Custom scan button here.
				this.scanExecutionService.scanClicked = false;
			});
		} else {
			// Hardware modules is already retrieved, so let's continue with the Scan process
			if (taskType === TaskType.QuickScan) {
				this.scanExecutionService.checkPreScanInfo(taskType);
			} else if (taskType === TaskType.CustomScan) {
				this.onCustomizeScan();
			}
		}
	}

	public scanAgain(){
		this.hardwareScanService.setEnableViewResults(false);
		this.hardwareScanService.setIsScanDone(false);
		this.hardwareScanService.setScanExecutionStatus(true);
		this.scanExecutionService.checkPreScanInfo(this.hardwareScanService.getLastTaskType(), true, this.scanExecutionService.getLastModules());
	}

	public isDisableCancel() {
		return this.hardwareScanService.isDisableCancel();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case HardwareScanProgress.ScanProgress:
					this.ngZone.run(() => {
						if (!this.hardwareScanService.isCancelRequested()) {
							this.scanExecutionService.executionProgress = payload;
						}
					});
					break;
				case HardwareScanProgress.ScanResponse:
					this.modules = payload;
					break;
				case HardwareScanProgress.RecoverProgress:
					this.ngZone.run(() => {
						this.scanExecutionService.executionProgress = payload;
					});
					break;
				case HardwareScanProgress.RecoverResponse:
					this.scanExecutionService.devicesToRecoverBadSectors = payload.devices;
					this.scanExecutionService.standardizeRbsResponse();
					if (payload.deviceInRecover) {
						this.deviceInRecover = payload.deviceInRecover;
					}
					break;
				case HardwareScanProgress.HasDevicesToRecoverBadSectors:
					break;
				case NetworkStatus.Online:
					this.isOnline = notification.payload.isOnline;
					break;
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				case HardwareScanProgress.BackEvent:
					// User has pressed the back button, so we need to redirect them to the homepage instead of
					// the scan or RBS result screen
					this.hardwareScanService.setScanOrRBSFinished(false);
					this.initComponent();
					break;
				default:
					break;
			}
		}
	}

	private getMetricsParentValue() {
		let taskTypeMetrics = TaskType[this.hardwareScanService.getCurrentTaskType()];
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		if (currentTaskStep === TaskStep.Summary) {
			// For summary metrics, it was defined that only the word "Scan" will be sent, so we should remove "Custom" or "Quick" from it
			taskTypeMetrics = taskTypeMetrics.replace('Custom', '').replace('Quick', '');
		}
		return RootParent + '.' + TaskStep[currentTaskStep] + taskTypeMetrics;
	}

	private getMetricsItemNameSummary() {
		const currentTaskStep = this.hardwareScanService.getCurrentTaskStep();
		const currentTaskType = this.hardwareScanService.getCurrentTaskType();
		// For summary metrics, it was defined that only the word "Scan" will be sent, so we should remove "Custom" or "Quick" from it
		const taskTypeMetrics = TaskType[currentTaskType].replace('Custom', '').replace('Quick', '');
		return TaskStep[currentTaskStep] + taskTypeMetrics + '.' + ViewResultsButton;
	}

	public isRefreshingModules() {
		return this.hardwareScanService.isRefreshingModules();
	}

	public isStartScanClicked() {
		return this.scanExecutionService.scanClicked;
	}
}

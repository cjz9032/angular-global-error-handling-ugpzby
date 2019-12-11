import { Component, OnInit, Input, Output, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScheduleScanType } from 'src/app/beta/hardware-scan/enums/hardware-schedule-scan-type.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalScheduleNewScanComponent } from '../../modal/modal-schedule-new-scan/modal-schedule-new-scan.component';
import { ModalScheduleScanCollisionComponent } from '../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { HardwareScanService } from '../../services/hardware-scan/hardware-scan.service';
import { timeInterval } from 'rxjs/operators';

@Component({
	selector: 'vtr-widget-schedule-scan',
	templateUrl: './widget-schedule-scan.component.html',
	styleUrls: ['./widget-schedule-scan.component.scss']
})

export class WidgetScheduleScanComponent implements OnInit {

	public title = this.translate.instant('hardwareScan.scheduledScan.title');
	public description: string;
	public buttonText = this.translate.instant('hardwareScan.scheduledScan.newScan');
	public items: any = [];
	public editing: any;

	constructor(
		public deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private modalService: NgbModal,
		private translate: TranslateService,
	) { }

	ngOnInit() {
		if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting()) {
			this.hardwareScanService.getNextScans().then((response) => {
				for (const req of response.scheduleRequests) {
					const scheduleScanDelete = {
						taskID: req.taskID
					};

					const date = req.scheduleDate[0].split('/');

					const dateString = date[2] + '-' + date[0] + '-' + date[1];

					let type = '';
					if (req.scheduleType === HardwareScheduleScanType.Quick) {
						type = this.translate.instant('hardwareScan.quickScan');
					} else {
						type = this.translate.instant('hardwareScan.scheduledScan.fullScan');
					}
					this.items.push({ name: req.nextExecutionDate, scanType: type, frequency: req.scheduleFrequency, date: dateString, time: req.scheduleTime, deleteReq: scheduleScanDelete });
				}
			});
		}
	}

	editScanFromList($event) {
		console.log('Page: ', $event.scanDateTime);
		let i = 0;
		for (const scan of this.items) {
			console.log('SCAN ITEMS SCHEDULE ', scan);
			if (scan.deleteReq.taskID === $event.scanID) {
				this.editing = scan;
				this.onScheduleScanModal(true);

				break;
			}
			i++;
		}
	}

	onScheduleScanModal(edit: boolean) {
		const modal: NgbModalRef = this.modalService.open(ModalScheduleNewScanComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'schedule-new-modal-size'
		});

		(<ModalScheduleNewScanComponent>modal.componentInstance).editMode = edit;

		if (edit) {
			(<ModalScheduleNewScanComponent>modal.componentInstance).editScan = this.editing;
		} else {
			(<ModalScheduleNewScanComponent>modal.componentInstance).editScan = undefined;
		}

		modal.result.then(
			result => {
				if (result) {
					console.log('Result ', result);

					switch (result.mode) {
						case 0:
							this.getScheduleScan(this.buildScheduleScanRequest(result.newScan));
							break;
						case 1:
							this.editScan(this.buildScheduleScanRequest(result.newScan), this.buildScheduleScanRequest(result.oldScan));
							break;
						case 2:
							this.deleteScheduledScan(result.deleteRequest);
							break;
					}
				} else {
					console.log('Result undefined');
				}
			},
			reason => {

			}
		);
	}

	public deleteScheduledScan(payload) {

		let i = 0;
		for (const scan of this.items) {
			if (scan.deleteReq.taskID === payload.taskID) {
				console.log('SCAN TO BE DELETED ', scan.deleteReq);
				break;
			}
			i++;
		}

		if (this.hardwareScanService) {
			this.hardwareScanService.deleteScan(payload)
				.then((response) => {
					console.log('[DELETE SCAN RESPONSE] ', response);
					this.items.splice(i, 1);
				});
		}
	}

	public editScan(newScanRequest, oldScanRequest) {
		const payload = {
			newScan: newScanRequest,
			oldScan: oldScanRequest.taskID
		};

		if (this.hardwareScanService) {
			this.hardwareScanService.editScheduledScan(payload)
				.then((response) => {
					if (response.status === 'COLLISION') {
						console.log('Scan Collision Detected');
						// const error = this.translate.instant('hardwareScan.scheduleScan.error');
						// const description = this.translate.instant('hardwareScan.scheduleScan.description');
						this.OnCollisionModal();
					} else {
						this.hardwareScanService.getNextScans().then((response) => {
							this.items = [];
							for (const req of response.scheduleRequests) {
								const scheduleScanDelete = {
									taskID: req.taskID
								};

								const date = req.scheduleDate[0].split('/');
								const dateString = date[2] + '-' + date[0] + '-' + date[1];

								let type = '';
								if (req.scheduleType === HardwareScheduleScanType.Quick) {
									type = this.translate.instant('hardwareScan.quickScan');
								} else {
									type = this.translate.instant('hardwareScan.scheduledScan.fullScan');
								}

								this.items.push({ name: req.nextExecutionDate, scanType: type, frequency: req.scheduleFrequency, date: dateString, time: req.scheduleTime, deleteReq: scheduleScanDelete });
							}
						});
					}
				});
		}
	}

	async OnCollisionModal(error = null, description = null, size: string = 'lg') {
		let modal;
		if (size === 'sm') {
			modal = this.modalService
			.open(ModalScheduleScanCollisionComponent, {
				backdrop: 'static',
				size: 'sm',
				centered: true,
				windowClass: 'schedule-new-modal-size'
			});
		} else {
			modal = this.modalService
				.open(ModalScheduleScanCollisionComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'schedule-new-modal-size'
			});
		}

		if (error != null) {
			modal.componentInstance.error = error;
		}
		if (description != null) {
			modal.componentInstance.description = description;
		}

		modal.result.then(
			result => {
				if (result) {
					console.log('Result');
				} else {
					console.log('Result undefined');
				}
			},
			reason => {
			}
		);
	}

	public buildScheduleScanRequest(data: any) {
		const doScanRequest = {
			requests: null,
			categories: this.hardwareScanService.getCategoryInformation()
		};

		if (data.scanOption === '0') {
			doScanRequest.requests = this.hardwareScanService.getQuickScanRequest();
		} else {
			doScanRequest.requests = this.hardwareScanService.getCustomScanRequest();
		}

		const option = data.interval;

		let scheduleScanRequest: any;

		scheduleScanRequest = {
			scheduleFrequency: option,
			scheduleDate: data.date,
			scheduleTime: data.time,
			scanRequest: doScanRequest,
			scheduleType: data.scanOption,
		};

		if (data.taskID) {
			scheduleScanRequest.taskID = data.taskID;
		}

		return scheduleScanRequest;
	}

	public getScheduleScan(scheduleScanRequest) {
		if (scheduleScanRequest) {
			console.log('[REQUEST] ScheduleScanRequest:');
			console.log(JSON.stringify(scheduleScanRequest));
			if (this.hardwareScanService) {
				this.hardwareScanService.getScheduleScan(scheduleScanRequest)
					.then((response) => {
						if (response.status === 'COLLISION') {
							console.log('Scan Collision Detected');
							// const error = this.translate.instant('hardwareScan.scheduleScan.error');
							// const description = this.translate.instant('hardwareScan.scheduleScan.description');
							this.OnCollisionModal();
						} else {
							this.hardwareScanService.getNextScans().then((response) => {
								this.items = [];
								let dateString;
								let time;
								for (const req of response.scheduleRequests) {
									const scheduleScanDelete = {
										taskID: req.taskID
									};

									const date = req.scheduleDate[0].split('/');
									dateString = date[2] + '-' + date[0] + '-' + date[1];
									time = this.formatTime(req.scheduleTime);

									let type = '';
									if (req.scheduleType === HardwareScheduleScanType.Quick) {
										type = this.translate.instant('hardwareScan.quickScan');
									} else {
										type = this.translate.instant('hardwareScan.scheduledScan.fullScan');
									}

									this.items.push({ name: req.nextExecutionDate, scanType: type, frequency: req.scheduleFrequency, date: dateString, time: req.scheduleTime, deleteReq: scheduleScanDelete });

								}
								const dateSplit = scheduleScanRequest.scheduleDate[0].split('/');
								const dateSchedule = dateSplit[2] + '-' + dateSplit[0] + '-' + dateSplit[1];
								const timeSchedule = this.formatTime(scheduleScanRequest.scheduleTime);
								const desc = this.translate.instant('hardwareScan.scheduledScan.information') + ' ' + dateSchedule + ' ' + timeSchedule;
								const title = this.translate.instant('hardwareScan.scheduledScan.name');
								this.OnCollisionModal(title, desc);
							});
						}
					});
			}
		} else {
			console.log('Data Undefined');
		}
		console.log('[END] getSchedule (Page-hwscan)!');
	}

	public disable() {
		const isExecuting = !this.hardwareScanService.isScanDoneExecuting() && (this.hardwareScanService.isScanExecuting() || this.hardwareScanService.isRecoverExecuting());
		return isExecuting;
	}

	public formatTime(time: string) {
		const hourMinute = time.split(':');
		const minute = hourMinute[1];
		let hours = hourMinute[0];
		let ampm = this.translate.instant('hardwareScan.pm');

		if (parseInt(hours, 10) === 0) {
			hours = '12';
			ampm = this.translate.instant('hardwareScan.am');
		} else if (parseInt(hours, 10) > 12) {
			const temp = '0' + (parseInt(hours, 10) - 12);
			hours = temp.substring(temp.length - 2, temp.length);
		} else {
			if(parseInt(hours,10) === 12){
				ampm = this.translate.instant('hardwareScan.pm');
			}else{
				ampm = this.translate.instant('hardwareScan.am');
			}	
		}

		return hours + ':' + minute + ' ' + ampm;
	}
}


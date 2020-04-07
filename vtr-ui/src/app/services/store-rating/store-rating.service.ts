import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';
import { ModalStoreRatingComponent } from 'src/app/components/modal/modal-store-rating/modal-store-rating.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
	providedIn: 'root'
})
export class StoreRatingService {

	private storeRatingPromptMaxCountKey = 'StoreRatingMaxCount';
	private storeRatingTargetUserKey = 'StoreRatingFeature';
	private storeRatingDaysBetween = 'StoreRatingDaysBetween';

	constructor(
		private commonService: CommonService,
		private hypothesis: HypothesisService,
		private logger: LoggerService,
		private ngModal: NgbModal,
	) { }

	public async showRatingAsync() {
		if (await this.canPromptRating()) {
			this.ngModal.open(ModalStoreRatingComponent, {
				backdrop: 'static',
				centered: true,
			});

			this.commonService.setLocalStorageValue(LocalStorageKey.RatingLastPromptTime, new Date());
			this.addRatingPromptCount();
			this.markPromptRatingNextLaunch(false);
		}
	}

	public markPromptRatingNextLaunch(needPrompt: boolean): boolean {
		this.commonService.setLocalStorageValue(LocalStorageKey.RatingConditionMet, needPrompt)
		return true;
	}

	private getRatingPromptCount(): number {
		let currentPromptCount = this.commonService.getLocalStorageValue(LocalStorageKey.RatingPromptCount);
		currentPromptCount = currentPromptCount ? currentPromptCount : 0;
		currentPromptCount = parseInt(currentPromptCount, 10);
		return currentPromptCount;
	}

	private addRatingPromptCount(): void {
		let currentPromptCount = this.getRatingPromptCount();
		if (isNaN(currentPromptCount)) currentPromptCount = 0;
		currentPromptCount += 1;
		this.commonService.setLocalStorageValue(LocalStorageKey.RatingPromptCount, currentPromptCount);
	}

	private async canPromptRating() {
		if(!navigator.onLine){
			return false;
		}

		if (!this.commonService.getLocalStorageValue(LocalStorageKey.RatingConditionMet)) {
			this.logger.info(`Rating won't show, no key action triggered.`)
			return false;
		}

		const hypSettings = await this.hypothesis.getAllSettings();
		const isTargetUserToPrompt = hypSettings[this.storeRatingTargetUserKey];
		if ((isTargetUserToPrompt || '').toLowerCase() !== 'true') {
			this.logger.info(`Rating won't show, not a target user`)
			return false;
		}

		let daysBetween = hypSettings[this.storeRatingDaysBetween];
		daysBetween = parseInt(daysBetween, 10);

		let promptMaxCount = hypSettings[this.storeRatingPromptMaxCountKey];
		promptMaxCount = parseInt(promptMaxCount, 10);

		const currentPromptCount = this.getRatingPromptCount();

		if (isNaN(promptMaxCount) || isNaN(currentPromptCount) || isNaN(daysBetween) || currentPromptCount >= promptMaxCount) {
			this.logger.info(`promptMaxCount is ${promptMaxCount}, currentPromptCount is ${currentPromptCount},daysBetween is ${daysBetween}, rating won't show.`)
			return false;
		}

		const lastPromptDate = this.commonService.getLocalStorageValue(LocalStorageKey.RatingLastPromptTime);
		if (lastPromptDate) {
			const date = new Date(lastPromptDate);
			const lastPromptMillionSeconds = date.getTime();
			if (!isNaN(lastPromptMillionSeconds)) {
				const millionSecGap = Date.now() - lastPromptMillionSeconds;
				const dayGap = millionSecGap / 1000 / 60 / 60 / 24;
				if (dayGap < daysBetween) {
					this.logger.info(`Rating won't show, last promt date is ${lastPromptDate}`);
					return false;
				}
			}
		}

		return true;
	}
}


import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslationService } from 'src/app/services/translation/translation.service';
import Translation from 'src/app/data-models/translation/translation';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslationSection } from 'src/app/enums/translation-section.enum';
import { CommonService } from '../../../services/common/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-ui-switch-onoff',
	templateUrl: './ui-switch-onoff.component.html',
	styleUrls: [ './ui-switch-onoff.component.scss' ]
})
export class UiSwitchOnoffComponent implements OnInit, OnDestroy {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value: boolean;
	@Input() name: string;
	@Input() disabled = false;
	@Input() showLoader = false;
	@Input() theme = 'white';

	@Input() isSwitchDisable = false;

	uiSubscription: Subscription;

	onLabel = 'on';
	offLabel = 'off';
	size = 'switch-xs';

	constructor(
		public translationService: TranslationService,
		public commonService: CommonService,
		public modalService: NgbModal
	) {
		this.uiSubscription = this.translationService.subscription.subscribe((translation: Translation) => {
			this.onLanguageChange(translation);
		});
	}

	ngOnInit() {
		this.commonService.notification.subscribe((response) => {
			if (response.type === this.name) {
				this.value = response.payload;
			}
		});
	}

	ngOnDestroy() {
		if (this.uiSubscription) {
			this.uiSubscription.unsubscribe();
		}
	}

	onChange($event) {
		this.disabled = true;
		if (this.name === 'recommended-updates') {
			this.disabled = this.isSwitchDisable;
			this.value = !this.value;
		} else if (this.name !== 'wifiSecurity') {
			this.disabled = false;
			this.value = !this.value;
		}
		$event.switchValue = this.value;
		this.toggle.emit($event);
	}

	onLanguageChange(translation: Translation) {
		if (translation && translation.type === TranslationSection.CommonUi) {
			this.onLabel = translation.payload.on;
			this.offLabel = translation.payload.off;
		}
	}

	stopPropagation(event){
		event.stopPropagation();
	}
}

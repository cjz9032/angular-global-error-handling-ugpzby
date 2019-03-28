import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslationService } from 'src/app/services/translation/translation.service';
import Translation from 'src/app/data-models/translation/translation';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslationSection } from 'src/app/enums/translation-section.enum';
import { WifiHomeViewModel } from '../../pages/page-security-wifi/page-security-wifi.component';

@Component({
	selector: 'vtr-ui-switch-onoff',
	templateUrl: './ui-switch-onoff.component.html',
	styleUrls: ['./ui-switch-onoff.component.scss']
})
export class UiSwitchOnoffComponent implements OnInit, OnDestroy {
	@Output() toggle: EventEmitter<any> = new EventEmitter();
	@Input() value: boolean;
	@Input() data: WifiHomeViewModel;
	@Input() name: string;
	@Input() disabled = false;

	uiSubscription: Subscription;

	onLabel = 'on';
	offLabel = 'off';
	size = 'switch-xs';

	constructor(public translationService: TranslationService) {
		this.uiSubscription = this.translationService.subscription
			.subscribe((translation: Translation) => {
				this.onLanguageChange(translation);
			});
	}

	ngOnInit() { }

	ngOnDestroy() {
		if (this.uiSubscription) {
			this.uiSubscription.unsubscribe();
		}
	}


	onChange(event) {
		try {
			if (this.data) {
				if (this.value) {
					this.data.wifiSecurity.disableWifiSecurity();
				} else {
					this.data.wifiSecurity.enableWifiSecurity();
				}
			} else {
				this.value = !this.value;
			}
		} catch (err) {
			console.log(err);
		}

		event.switchValue = this.value;
		this.toggle.emit(event);
	}

	onLanguageChange(translation: Translation) {
		if (translation && translation.type === TranslationSection.CommonUi) {
			this.onLabel = translation.payload.on;
			this.offLabel = translation.payload.off;
		}
	}
}

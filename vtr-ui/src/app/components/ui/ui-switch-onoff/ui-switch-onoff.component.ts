import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	ChangeDetectorRef
} from '@angular/core';
import {
	TranslationService
} from 'src/app/services/translation/translation.service';
import Translation from 'src/app/data-models/translation/translation';
import {
	Subscription
} from 'rxjs/internal/Subscription';
import {
	TranslationSection
} from 'src/app/enums/translation-section.enum';
import {
	WifiHomeViewModel
} from 'src/app/data-models/security-advisor/wifisecurity.model';
import {
	CommonService
} from '../../../services/common/common.service';
import {
	NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
	SecurityService
} from 'src/app/services/security/security.service';

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
	@Input() showLoader = false;
	@Input() theme = 'white';

	isSwitchDisable = false;

	uiSubscription: Subscription;

	onLabel = 'on';
	offLabel = 'off';
	size = 'switch-xs';

	constructor(
		public translationService: TranslationService,
		public commonService: CommonService,
		public modalService: NgbModal,
		private securityService: SecurityService,
		private cd: ChangeDetectorRef
	) {
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


	onChange($event) {
		this.disabled = true;
		try {
			if (this.name === 'wifiSecurity') {
				// this.cd.detach();
				this.isSwitchDisable = true;
				// this.cd.detectChanges();
				if (this.data) {
					if (this.value) {
						this.data.wifiSecurity.disableWifiSecurity().then((res) => {
							if (res === true) {
								this.data.isLWSEnabled = false;
								this.value = false;
							} else {
								this.data.isLWSEnabled = true;
								this.value = true;
							}
							this.disabled = false;
							this.isSwitchDisable = false;
							// this.cd.reattach();
						});
					} else {
						this.data.wifiSecurity.enableWifiSecurity().then((res) => {
							if (res === true) {
								this.data.isLWSEnabled = true;
								this.value = true;
							} else {
								this.data.isLWSEnabled = false;
								this.value = false;
							}
							this.disabled = false;
							this.isSwitchDisable = false;
							// this.cd.reattach();
						}, (error) => {
							this.securityService.wifiSecurityLocationDialog(this.data.wifiSecurity);
							this.disabled = false;
							this.isSwitchDisable = false;
							// this.cd.reattach();
						});
					}
				}
			} else {
				this.disabled = false;
				this.value = !this.value;
			}
		} catch (err) {
			this.disabled = false;
			throw new Error('wifiSecurity is null');
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
}

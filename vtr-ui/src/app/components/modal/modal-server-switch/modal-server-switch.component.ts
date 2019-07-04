import { Component, OnInit, ElementRef, HostListener, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
//import { SelectDropDownModule } from 'ngx-select-dropdown';
//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServerSwitch } from '../../../data-models/server-switch/server-switch.model'
import { isNull, isUndefined } from 'util';

@Component({
	selector: 'vtr-modal-server-switch',
	templateUrl: './modal-server-switch.component.html',
	styleUrls: [
		'../../../../../node_modules/ngx-select-dropdown/dist/assets/style.css',
		'./modal-server-switch.component.scss'
	]
})
export class ModalServerSwitchComponent implements OnInit {

	serverSwitchTitle: any = 'Server Switch Feature';
	serverSwitchData: ServerSwitch;
	serverSwitchForm: FormGroup;
	sddInvalid: any = {
		status: false,
		message: []
	};

	//SelectDropDownModule, config
	sddConfigCountry: any = {
		displayKey: "Value", //if objects array passed which key to be displayed defaults to description
		search: true, //true/false for the search functionlity defaults to false,
		height: '15rem', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
		placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
		limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
		noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
		searchPlaceholder: 'Search', // label thats displayed in search input,
		searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
	};

	sddConfigLanguage: any = {
		displayKey: "Value", //if objects array passed which key to be displayed defaults to description
		search: true, //true/false for the search functionlity defaults to false,
		height: '15rem', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
		placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
		limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
		noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
		searchPlaceholder: 'Search', // label thats displayed in search input,
		searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
	};

	sddConfigSegment: any = {
		displayKey: "Value", //if objects array passed which key to be displayed defaults to description
		search: true, //true/false for the search functionlity defaults to false,
		height: '15rem', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
		placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
		limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
		noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
		searchPlaceholder: 'Search', // label thats displayed in search input,
		searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
	};


	constructor(
		public activeModal: NgbActiveModal,
		public commonService: CommonService
	) { }

	ngOnInit() {
		this.serverSwitchData = new ServerSwitch();

		//SelectDropDownModule configuration
		this.sddConfigCountry.limitTo = this.serverSwitchData.countryList.length;

		this.sddConfigLanguage.limitTo = this.serverSwitchData.languageList.length;

		this.sddConfigSegment.limitTo = this.serverSwitchData.segmentList.length;

		this.serverSwitchForm = new FormGroup({
			country: new FormControl(null, Validators.required),
			language: new FormControl(null, Validators.required),
			segment: new FormControl(null, Validators.required)
		});


	}

	closeModal() {
		this.activeModal.close('close');
	}

	@HostListener('document:keydown.escape', ['$event'])
	onClickEscape($event) {
		this.closeModal();
	}

	/**
	 * Validate & Save the server switch
	 */
	onSubmit(): boolean {
		const formData = this.serverSwitchForm.value;
		this.sddInvalid = {
			status: false,
			message: []
		};
		//console.log(formData);

		//validating
		if (isNull(formData.country) || isUndefined(formData.country)) {
			this.sddInvalid.status = true;
			this.sddInvalid.message.push('Country is required.');
		} else {
			this.serverSwitchData.country = formData.country;
		}

		if (isNull(formData.language) || isUndefined(formData.language)) {
			this.sddInvalid.status = true;
			this.sddInvalid.message.push('Language is required.');
		} else {
			this.serverSwitchData.language = formData.language;
		}

		if (isNull(formData.segment) || isUndefined(formData.segment)) {
			this.sddInvalid.status = true;
			this.sddInvalid.message.push('Segment is required.');
		} else {
			this.serverSwitchData.segment = formData.segment;
		}

		//submit success
		if (!this.sddInvalid.status) {
			this.serverSwitchProcess();
		}

		return this.sddInvalid.status;
	}

	serverSwitchProcess() {
		let serverSwitchLocalData = {
			country: this.serverSwitchData.country,
			language: this.serverSwitchData.language,
			segment: this.serverSwitchData.segment,
		};
		//storing into localStorage
		this.commonService.setLocalStorageValue(LocalStorageKey.ServerSwitchKey, serverSwitchLocalData);
		console.log(window.location.href);

		//reload with new serverSwitch Parms
		//window.location.reload();//working
	}
}

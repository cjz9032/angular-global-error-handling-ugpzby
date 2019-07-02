import { Component, OnInit, ElementRef, HostListener, SecurityContext } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServerSwitch } from '../../../data-models/server-switch/server-switch.model'
import { isEmpty } from 'rxjs/operators';


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
  
  sddInvalid: any = {
    'status': false,
    'message': ''
  };

  //SelectDropDownModule, config
  sddConfigCountry: any = {
    displayKey: "Value", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '50px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
    limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  sddConfigLanguage: any = {
    displayKey: "Value", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '50px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
    limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  sddConfigSegment: any = {
    displayKey: "Value", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '50px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
    limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'Value' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };


  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer,
    private element: ElementRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.serverSwitchData = new ServerSwitch();

    //SelectDropDownModule configuration
    this.sddConfigCountry.limitTo = this.serverSwitchData.countryList.length;

    this.sddConfigLanguage.limitTo = this.serverSwitchData.languageList.length;

    this.sddConfigSegment.limitTo = this.serverSwitchData.segmentList.length;

    console.log(this.sddConfigCountry);
  }

  closeModal() {
    this.activeModal.close('close');
  }

  @HostListener('document:keydown.escape', ['$event'])
  onClickEscape() {
    this.closeModal();
  }

  /**
   * Validate & Save the server switch 
   */
  onSubmit(f:any) {
    console.log(this.serverSwitchData);
    this.sddInvalid = {
      status: false,
      message: ''
    };
    if(this.serverSwitchData.country.length <=0){
      this.sddInvalid.status = true;
      this.sddInvalid.message = 'Country is required.';
    }
    if(this.serverSwitchData.language.length <=0){
      this.sddInvalid.status = true;
      this.sddInvalid.message += 'Language is required.';
    }
    if(this.serverSwitchData.segment.length <=0){
      this.sddInvalid.status = true;
      this.sddInvalid.message += 'Segment is required.';
    }

    return this.sddInvalid.status;
  }

}

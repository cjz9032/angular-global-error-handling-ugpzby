import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, OnDestroy, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { ServerSwitch } from '../../../data-models/server-switch/server-switch.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { isNull, isUndefined } from 'util';

//add components below
import { CptpageDeviceSettingsComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-device-settings/cptpage-device-settings.component';
import { CptpageMyDeviceComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-my-device/cptpage-my-device.component';

declare let JSONEditor: any;
declare let ClipboardJS: any;

@Component({
  selector: 'vtr-page-cpt',
  templateUrl: './page-cpt.component.html',
  styleUrls: ['./page-cpt.component.scss'],
  //add components within array
  entryComponents: [CptpageMyDeviceComponent, CptpageDeviceSettingsComponent]
})
export class PageCptComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Content Preview Tool';
  activeElement: HTMLElement;
  currentComponent: any;
  currentSubscriber: any = null;
  @ViewChild('vc', { read: ViewContainerRef, static: false }) vc: ViewContainerRef;

  serverSwitchData: ServerSwitch;
  serverSwitchForm: FormGroup;
  sddInvalid: any = {
    status: false,
    message: []
  };
  serverSwitchResponse: any = {
    cmsserver: '',
    fullcmsserver: '',
    componentSelector: 'vtr-cptpage-device-settings',
    systemLang: '',
    currentLang: '',
    jsonresponse: {},
    isloading: null,
  };

  editor: any;
  clipboard: any;

  constructor(public commonService: CommonService, private translate: TranslateService, private cfr: ComponentFactoryResolver) { 
    this.loadDynamicStyle();
    this.loadDynamicScripts();
  }

  ngOnInit() {
    this.serverSwitchData = new ServerSwitch();

    this.serverSwitchForm = new FormGroup({
      country: new FormControl(this.serverSwitchData.countryList[0], Validators.required),
      language: new FormControl(this.serverSwitchData.languageList[7], Validators.required),
      segment: new FormControl(this.serverSwitchData.segmentList[1], Validators.required),
      cmsserver: new FormControl(this.serverSwitchData.serverList[1], Validators.required),
      oem: new FormControl(this.serverSwitchData.oemList[0], Validators.required),
      brand: new FormControl(this.serverSwitchData.brandList[0], Validators.required),
      page: new FormControl(this.serverSwitchData.pageList[0], Validators.required)
    });

    this.serverSwitchResponse.systemLang = this.translate.currentLang;

    // when app loads for the 1st time then remove ServerSwitch values
    window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);

  }

  ngAfterViewInit() { }


  /**
	 * Validate & Save the server switch
	 */
  onSubmit(): boolean {
    const formData = this.serverSwitchForm.value;
    this.sddInvalid = {
      status: false,
      message: []
    };
    this.serverSwitchResponse.jsonresponse = null;
    this.serverSwitchResponse.isloading = true;

    // validating
    if (isNull(formData.cmsserver) || isUndefined(formData.cmsserver)) {
      this.sddInvalid.status = true;
      this.sddInvalid.message.push('CMS API is required.');
    } else {
      this.serverSwitchData.cmsserver = formData.cmsserver;
    }

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

    if (isNull(formData.oem) || isUndefined(formData.oem)) {
      this.sddInvalid.status = true;
      this.sddInvalid.message.push('OEM is required.');
    } else {
      this.serverSwitchData.oem = formData.oem;
    }

    if (isNull(formData.brand) || isUndefined(formData.brand)) {
      this.sddInvalid.status = true;
      this.sddInvalid.message.push('Brand is required.');
    } else {
      this.serverSwitchData.brand = formData.brand;
    }

    if (isNull(formData.page) || isUndefined(formData.page)) {
      this.sddInvalid.status = true;
      this.sddInvalid.message.push('Page is required.');
    } else {
      this.serverSwitchData.page = formData.page;
    }

    // submit success
    if (!this.sddInvalid.status) {
      this.cptProcess();
    }

    return this.sddInvalid.status;
  }

  cptProcess() {
    let serverSwitchLocalData = {
      country: this.serverSwitchData.country,
      language: this.serverSwitchData.language,
      segment: this.serverSwitchData.segment,
      cmsserver: this.serverSwitchData.cmsserver,
      oem: this.serverSwitchData.oem,
      brand: this.serverSwitchData.brand,
      page: this.serverSwitchData.page,
      forceit: true
    };
    //storing into localStorage
    this.commonService.setLocalStorageValue(LocalStorageKey.ServerSwitchKey, serverSwitchLocalData);

    this.serverSwitchResponse.cmsserver = this.serverSwitchData.cmsserver;
    this.serverSwitchResponse.currentLang = this.serverSwitchData.language.Value;
    this.serverSwitchResponse.componentSelector = this.serverSwitchData.page.componentSelector;

    //setting language
    this.translate.use(this.serverSwitchResponse.currentLang).subscribe(() => {
      console.log("Language loaded: " + this.serverSwitchResponse.currentLang);
    });

    //for full urls 
    let defaultsURLParm = {
      Lang: (serverSwitchLocalData.language.Value).toLowerCase(),
      GEO: (serverSwitchLocalData.country.Value).toLowerCase(),
      OEM: serverSwitchLocalData.oem,
      Segment: serverSwitchLocalData.segment,
      Brand: serverSwitchLocalData.brand,
      OS: 'Windows'
    };

    //jsonEditor 
    if(!this.editor){
      this.editor = new JSONEditor(document.getElementById('jeditor'),{mode:'view'},{});
    }
    
    //copyClipboard
    if(!this.clipboard){
      this.clipboard = new ClipboardJS('.btnCopy');
    }

    //add components cms logic with switch block
    //load components from page dropdown
    this.vc.clear();
    this.currentComponent = null;
    this.currentSubscriber = null;
    let factory: any;
    let componentRef: any;
    switch (this.serverSwitchResponse.componentSelector) {
      //Page My Device
      case 'vtr-cptpage-my-device':
        factory = this.cfr.resolveComponentFactory(CptpageMyDeviceComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageMyDeviceComponent>componentRef.instance);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {

            //for full urls 
            let queryParams = {
              Page: 'device'
            };
            this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;

          }
        );

        break;
      //Page My Device Settings
      case 'vtr-cptpage-device-settings':
        factory = this.cfr.resolveComponentFactory(CptpageDeviceSettingsComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageDeviceSettingsComponent>componentRef.instance);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {

            //for full urls 
            let queryParams = {
              Page: 'device-settings'
            };
            this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          }
        );

        break;
    }

  }

  parseCMSUrl(defaultsURLParm, queryParams, cmsserver) {

    let CMSOption = Object.assign(defaultsURLParm, queryParams);
    let fullcmsserver = cmsserver + '/api/v1/features';
    let c = 0;
    for (let x in CMSOption) {
      fullcmsserver += (c == 0 ? '?' : '&') + x + '=' + CMSOption[x];
      c++;
    }
    return fullcmsserver;
  }


  loadDynamicScripts() {
    const dynamicScripts = [
     'https://cdn.jsdelivr.net/npm/jsoneditor@8.4.1/dist/jsoneditor.min.js',
     'https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  loadDynamicStyle() {
    const dynamicScripts = [
     'https://cdn.jsdelivr.net/npm/jsoneditor@8.4.1/dist/jsoneditor.min.css'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('link');
      node.href = dynamicScripts[i];
      node.type = 'text/css';
      node.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }


  ngOnDestroy() {
    //setting language
    this.translate.use(this.serverSwitchResponse.systemLang);
    console.log('Revertiing lang', this.serverSwitchResponse.systemLang);

    // when app destroyed then remove ServerSwitch values
    window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);

    //destroy the subscriber
    if (!isNull(this.currentSubscriber)) {
      this.currentSubscriber.unsubscribe();
    }
  }

}

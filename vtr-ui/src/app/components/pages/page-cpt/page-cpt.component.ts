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
import { CptpageDashboardComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-dashboard/cptpage-dashboard.component';
import { CptpageDeviceUpdatesComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-device-updates/cptpage-device-updates.component';
import { CptpageSmartAssistComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-smart-assist/cptpage-smart-assist.component';
import { CptpageSecurityComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security/cptpage-security.component';
import { CptpageSecurityAntivirusComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-antivirus/cptpage-security-antivirus.component';
import { CptpageSecurityPasswordComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-password/cptpage-security-password.component';
import { CptpageSecurityWifiComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-wifi/cptpage-security-wifi.component';
import { CptpageSecurityInternetComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-security-internet/cptpage-security-internet.component';
import { CptpageSupportComponent } from 'src/app/components/pages/page-cpt/children/hardware-settings/cptpage-support/cptpage-support.component';
import { CptpageDeviceGamingComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-device-gaming/cptpage-device-gaming.component';
import { CptpageMacrokeyComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-macrokey/cptpage-macrokey.component';
import { CptpageLightingcustomizeComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-lightingcustomize/cptpage-lightingcustomize.component';
import { CptpageNetworkboostComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-networkboost/cptpage-networkboost.component';
import { CptpageAutocloseComponent } from 'src/app/components/pages/page-cpt/children/gaming/cptpage-autoclose/cptpage-autoclose.component';


declare let JSONEditor: any;
declare let ClipboardJS: any;
/**
 * Gaming Dashboard
Gaming Macrokey
Gaming Lighting
Gaming NetworkBoost
Gaming AutoClose 

src\app\modules\gaming-routing.module.ts
 */

@Component({
  selector: 'vtr-page-cpt',
  templateUrl: './page-cpt.component.html',
  styleUrls: ['./page-cpt.component.scss'],
  //add components within array
  entryComponents: [CptpageMyDeviceComponent, CptpageDeviceSettingsComponent, CptpageDashboardComponent, CptpageDeviceUpdatesComponent
    , CptpageSmartAssistComponent, CptpageSecurityComponent, CptpageSecurityAntivirusComponent,CptpageSecurityPasswordComponent
    , CptpageSecurityWifiComponent, CptpageSecurityInternetComponent, CptpageSupportComponent, CptpageDeviceGamingComponent
    , CptpageMacrokeyComponent, CptpageLightingcustomizeComponent, CptpageNetworkboostComponent, CptpageAutocloseComponent
  ]
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
    showeditor: true,
    responseError: {
      isError: false,
      message: ''
    }
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
      cmsserver: new FormControl(this.serverSwitchData.cmsServerList[3]['cmsserver'], Validators.required),
      oem: new FormControl(this.serverSwitchData.oemList[0], Validators.required),
      brand: new FormControl(this.serverSwitchData.brandList[0], Validators.required),
      page: new FormControl(this.serverSwitchData.pageList[0]['opt'][0], Validators.required),
      showeditor: new FormControl(true),
    });

    this.serverSwitchResponse.systemLang = this.translate.currentLang;

    // when app loads for the 1st time then remove ServerSwitch values
    window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);

  }

  ngAfterViewInit() {}


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
    this.serverSwitchResponse.fullcmsserver = '';
    this.serverSwitchResponse.isloading = true;
    this.serverSwitchResponse.showeditor = formData.showeditor;

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
      //console.log("Language loaded: " + this.serverSwitchResponse.currentLang);
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
    let queryParams = {};

    //jsonEditor 
    if (!this.editor) {
      this.editor = new JSONEditor(document.getElementById('jeditor'), { mode: 'view' }, {});
    }

    //copyClipboard
    if (!this.clipboard) {
      this.clipboard = new ClipboardJS('.btnCopy');
    }

    //response error handler 
    this.serverSwitchResponse.responseError = {
      isError: false,
      message: ''
    };

    //add components cms logic with switch block
    //load components from page dropdown
    this.vc.clear();
    this.currentComponent = null;
    this.currentSubscriber = null;
    let factory: any;
    let componentRef: any;
    switch (this.serverSwitchResponse.componentSelector) {
      //Page Dashboard
      case 'vtr-page-dashboard':
        factory = this.cfr.resolveComponentFactory(CptpageDashboardComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageDashboardComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'dashboard'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {

            // //for full urls 
            // let queryParams = {
            //   Page: 'dashboard'
            // };
            // this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page My Device
      case 'vtr-cptpage-my-device':
        factory = this.cfr.resolveComponentFactory(CptpageMyDeviceComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageMyDeviceComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'device'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page My Device Settings
      case 'vtr-cptpage-device-settings':
        factory = this.cfr.resolveComponentFactory(CptpageDeviceSettingsComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageDeviceSettingsComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'device-settings'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page System Update
      case 'vtr-page-device-updates':
        factory = this.cfr.resolveComponentFactory(CptpageDeviceUpdatesComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageDeviceUpdatesComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'system-updates'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page Smart Assist
      case 'vtr-page-smart-assist':
        factory = this.cfr.resolveComponentFactory(CptpageSmartAssistComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSmartAssistComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'device-settings'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page My Security
      case 'vtr-page-security':
        factory = this.cfr.resolveComponentFactory(CptpageSecurityComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSecurityComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'security'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {      
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page Anti-Virus
      case 'vtr-page-security-antivirus':
        factory = this.cfr.resolveComponentFactory(CptpageSecurityAntivirusComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSecurityAntivirusComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'anti-virus',
          Template: 'inner-page-right-side-article-image-background'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page Password Health
      case 'vtr-page-security-password':
        factory = this.cfr.resolveComponentFactory(CptpageSecurityPasswordComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSecurityPasswordComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'password-protection'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;
      //Page WiFi Security
      case 'vtr-page-security-wifi':
        factory = this.cfr.resolveComponentFactory(CptpageSecurityWifiComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSecurityWifiComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'wifi-security'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;  
      //Page Internet Protection
      case 'vtr-page-security-internet':
        factory = this.cfr.resolveComponentFactory(CptpageSecurityInternetComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSecurityInternetComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'internet-protection'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      //Page Support
      case 'vtr-page-support':
        factory = this.cfr.resolveComponentFactory(CptpageSupportComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageSupportComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'support'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
            this.serverSwitchResponse.responseError.isError = false;
            this.serverSwitchResponse.responseError.message = '';

            //setting child variables
            this.currentComponent.currentSelection.defaultArticleUrl = this.parseCMSUrl(defaultsURLParm, {}, this.serverSwitchResponse.cmsserver,true);

          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break; 
      //Page Gaming Dashboard
      case 'vtr-page-device-gaming':
        factory = this.cfr.resolveComponentFactory(CptpageDeviceGamingComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageDeviceGamingComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'dashboard'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      //Page Gaming Macrokey
      case 'vtr-page-macrokey':
        factory = this.cfr.resolveComponentFactory(CptpageMacrokeyComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageMacrokeyComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'macro-key'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      //Page Gaming Lighting
      case 'vtr-page-lightingcustomize':
        factory = this.cfr.resolveComponentFactory(CptpageLightingcustomizeComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageLightingcustomizeComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'lighting'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      //Page Gaming NetworkBoost
      case 'vtr-page-networkboost':
        factory = this.cfr.resolveComponentFactory(CptpageNetworkboostComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageNetworkboostComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'network-boost'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      //Page Gaming AutoClose
      case 'vtr-page-autoclose':
        factory = this.cfr.resolveComponentFactory(CptpageAutocloseComponent);
        componentRef = this.vc.createComponent(factory);
        this.currentComponent = (<CptpageAutocloseComponent>componentRef.instance);

        //for full urls 
        queryParams = {
          Page: 'auto-close'
        };
        this.serverSwitchResponse.fullcmsserver = this.parseCMSUrl(defaultsURLParm, queryParams, this.serverSwitchResponse.cmsserver);

        //calling child methods
        this.currentSubscriber = this.currentComponent.getCmsJsonResponse().subscribe(
          (jresponse: any) => {            
            this.serverSwitchResponse.jsonresponse = jresponse;
            this.editor.set(jresponse);

            this.serverSwitchResponse.isloading = false;
          },
          (error : any) => {
            this.serverSwitchResponseErrorHandler(error.message);
          }
        );

        break;     
      default:
        this.serverSwitchResponse.fullcmsserver = '';
        this.serverSwitchResponse.jsonresponse = { 'error': 'Work in progress.' };
        this.editor.set(this.serverSwitchResponse.jsonresponse);
        this.serverSwitchResponse.isloading = false;
        break;
    }//end switch
  }

  parseCMSUrl(defaultsURLParm, queryParams, cmsserver, isArticle = false) {

    let CMSOption = Object.assign({},defaultsURLParm, queryParams);
    let fullcmsserver = cmsserver + '/api/v1/' + (!isArticle ? 'features' : 'articles');
    let c = 0;
    for (let x in CMSOption) {
      fullcmsserver += (c == 0 ? '?' : '&') + x + '=' + CMSOption[x];
      c++;
    }
    return fullcmsserver;
  }


  loadDynamicScripts() {
    /*const dynamicScripts = [
      'https://cdn.jsdelivr.net/npm/jsoneditor@8.4.1/dist/jsoneditor.min.js',
      'https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js'
    ];*/
    const dynamicScripts = [
      'assets/cpt/jsoneditor8.4.1.min.js',
      'assets/cpt/clipboard2.min.js'
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
    /*const dynamicScripts = [
      'https://cdn.jsdelivr.net/npm/jsoneditor@8.4.1/dist/jsoneditor.min.css'
    ];*/
    const dynamicScripts = [
      'assets/cpt/jsoneditor8.4.1.min.css'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('link');
      node.href = dynamicScripts[i];
      node.type = 'text/css';
      node.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  serverSwitchResponseErrorHandler(message: string) {
    this.serverSwitchResponse.responseError.isError = true;
    this.serverSwitchResponse.responseError.message = message;
    this.vc.clear();
    if(this.editor){
      this.editor.set({});
    }
    this.serverSwitchResponse.isloading = false;
  }


  ngOnDestroy() {

    this.vc.clear();
    // when app destroyed then remove ServerSwitch values
    //window.localStorage.removeItem(LocalStorageKey.ServerSwitchKey);

    //due to cache, lets set the flag to false to deactive the serverswitch
    const serverSwitchLocalData = this.commonService.getLocalStorageValue(LocalStorageKey.ServerSwitchKey);
    serverSwitchLocalData.forceit = false;
    this.commonService.setLocalStorageValue(LocalStorageKey.ServerSwitchKey, serverSwitchLocalData);

    //destroy the subscriber
    if (!isNull(this.currentSubscriber)) {
      this.currentSubscriber.unsubscribe();
    }

    //setting language
    this.translate.use(this.serverSwitchResponse.systemLang);
  }

}

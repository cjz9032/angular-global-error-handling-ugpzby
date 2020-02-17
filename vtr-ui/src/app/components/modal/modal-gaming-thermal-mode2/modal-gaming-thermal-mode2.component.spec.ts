import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGamingThermalMode2Component } from './modal-gaming-thermal-mode2.component';
import { UiToggleComponent } from '../../ui/ui-toggle/ui-toggle.component';
import { TranslateStore } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GamingOCService } from 'src/app/services/gaming/gaming-OC/gaming-oc.service';
import { TranslationModule } from 'src/app/modules/translation.module';
import { GamingAllCapabilities } from 'src/app/data-models/gaming/gaming-all-capabilities';

describe('ModalGamingThermalMode2Component', () => {
  let component: ModalGamingThermalMode2Component;
  let fixture: ComponentFixture<ModalGamingThermalMode2Component>;

  let gamingCapabilities = new GamingAllCapabilities();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ModalGamingThermalMode2Component,
        UiToggleComponent,
      ],
      imports: [
        TranslationModule,
        HttpClientModule,
      ],
      providers: [
        NgbModal,
        NgbActiveModal,
        GamingOCService,
        TranslateStore
      ],
      schemas: [ 
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGamingThermalMode2Component);
    component = fixture.componentInstance;
    component.gamingCapabilities = gamingCapabilities;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

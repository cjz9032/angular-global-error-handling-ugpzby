import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSubscriptiondetailsComponent } from './widget-subscriptiondetails.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateStore } from '@ngx-translate/core';

describe('WidgetSubscriptiondetailsComponent', () => {
  let component: WidgetSubscriptiondetailsComponent;
  let fixture: ComponentFixture<WidgetSubscriptiondetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSubscriptiondetailsComponent ],
      imports: [FontAwesomeModule, TranslationModule, HttpClientTestingModule],
            providers: [TranslateStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSubscriptiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

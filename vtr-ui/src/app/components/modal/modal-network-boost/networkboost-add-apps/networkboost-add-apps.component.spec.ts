import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkboostAddAppsComponent } from './networkboost-add-apps.component';

xdescribe('NetworkboostAddAppsComponent', () => {
  let component: NetworkboostAddAppsComponent;
  let fixture: ComponentFixture<NetworkboostAddAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkboostAddAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkboostAddAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

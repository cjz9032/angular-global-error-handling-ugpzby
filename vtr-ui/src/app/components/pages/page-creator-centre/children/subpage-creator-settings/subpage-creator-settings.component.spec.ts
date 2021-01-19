import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageCreatorSettingsComponent } from './subpage-creator-settings.component';

describe('SubpageCreatorSettingsComponent', () => {
  let component: SubpageCreatorSettingsComponent;
  let fixture: ComponentFixture<SubpageCreatorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubpageCreatorSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageCreatorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

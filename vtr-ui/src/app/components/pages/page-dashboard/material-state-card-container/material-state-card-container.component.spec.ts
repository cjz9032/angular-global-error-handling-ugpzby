import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialStateCardContainerComponent } from './material-state-card-container.component';


describe('MaterialStateCardContainerComponent', () => {
  let component: MaterialStateCardContainerComponent;
  let fixture: ComponentFixture<MaterialStateCardContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStateCardContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStateCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

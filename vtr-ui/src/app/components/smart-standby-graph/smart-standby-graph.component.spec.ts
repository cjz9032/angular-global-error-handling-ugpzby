import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmartStandbyGraphComponent } from './smart-standby-graph.component';
import { HttpClientModule } from '@angular/common/http';

// describe('SmartStandbyActivityComponent', () => {
//   let component: SmartStandbyGraphComponent;
//   let fixture: ComponentFixture<SmartStandbyGraphComponent>;

beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [SmartStandbyGraphComponent],
		imports: [HttpClientModule]
	})
		.compileComponents();
}));

//   beforeEach(() => {
// 	fixture = TestBed.createComponent(SmartStandbyGraphComponent);
// 	component = fixture.componentInstance;
// 	fixture.detectChanges();
//   });

//   it('should create', () => {
// 	expect(component).toBeTruthy();
//   });
// });

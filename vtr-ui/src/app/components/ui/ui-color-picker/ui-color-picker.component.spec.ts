import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UiColorPickerComponent } from './ui-color-picker.component';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const presetColorList =  [
  {"color":"FFECE6","isChecked":true},
  {"color":"FFFBE6","isChecked":false}
] 

describe('UiColorPickerComponent', () => {
  let component: UiColorPickerComponent;
  let fixture: ComponentFixture<UiColorPickerComponent>;
  const dummyElement = document.createElement('div');
  dummyElement.id = 'menu-main-btn-navbar-toggler';
  document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiColorPickerComponent, mockPipe({ name: 'translate' }),mockPipe({ name: 'sanitize' })],
      providers: [
        NgbModal,NgbActiveModal
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientModule]
    }).compileComponents();
    fixture = TestBed.createComponent(UiColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide color picker when resize', () => {
    component.onResize({});
    expect(component.isColorPicker).toEqual(false);
  })

  it('should choose color that first', () => {
    component.presetColorList = presetColorList;
    component.color = 'FFECE6';
    component.ngOnInit();
    expect(component.presetColorList[0].isChecked).toEqual(true);
  })

  it('should change color', () => {
    component.colorChange(0);
    expect(component.isColorPicker).toEqual(false);
  })

  it('should click apply button to choose color', () => {
    component.colorPickerSelectFun();
    expect(component.isColorPicker).toEqual(false);
  })
  
  it('should click cancel button to deselect color', () =>{
    component.colorPickerCancelFun();
    expect(component.isColorPicker).toEqual(false);
  })

  it('should open advanced color disk', () => {
    component.moreColorFun();
    expect(component.isToggleMoreColor).toEqual(true);
  })

  it('should change color picker', () => {
    const event = 'rgba(127,44,23)';
    component.colorPickerChangeFun(event);
    expect(component.color).toEqual('7f2c17');
  })

  it('should show preset color', () => {
    component.colorPresetFun();
    expect(component.isColorPicker).toEqual(true);
  })

  it('should show color picker when click component', done => {
    const event = new Event('click');
    component.generalClick(event);
		const p = new Promise((resolve, reject) =>
			setTimeout(() => resolve(''), 50)
    );
    component.isSliderOut = true;
		p.then(result => {
			fakeAsync(() => {
        expect(component.isSliderOut).toEqual(false);
			});
			done();
    });
  });
  
  it('should hide color picker when click component', done => {
    const event = new Event('click');
    component.generalClick(event);
		const p = new Promise((resolve, reject) =>
			setTimeout(() => resolve(''), 50)
    );
    component.isSliderOut = false;
		p.then(result => {
			fakeAsync(() => {
        expect(component.isColorPicker ).toEqual(false);
			});
			done();
    });
	});


  it('should slider drag end', () => {
    let event = new Event('click');
    component.clickEvent = event;
    component.isFirstTrigger =true;
		component.cpSliderDragEndFun({});
    expect(component.isSliderOut).toEqual(true);
  })

  it('should change some message when page change', () => {
    component.ngOnChanges({});
    expect(component.ngOnChanges({})).toBeUndefined();
  })

});

export function mockPipe(options: Pipe): Pipe {
    const metadata: Pipe = {
        name: options.name
    };
    return Pipe(metadata)(class MockPipe {
        public transform(query: string, ...args: any[]): any {
            return query;
        }
    }) as any;
}
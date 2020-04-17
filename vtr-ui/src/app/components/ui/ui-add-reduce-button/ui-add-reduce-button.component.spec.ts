import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAddReduceButtonComponent } from './ui-add-reduce-button.component';

describe('UiAddReduceButtonComponent', () => {
    let component: UiAddReduceButtonComponent;
    let fixture: ComponentFixture<UiAddReduceButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ UiAddReduceButtonComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UiAddReduceButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('calculate & reduce : ', () => {
        it("should call calculate & reduce & vaule is 255 & speed is 1", () => {
            expect(component.calculate(255,1,false)).toBe(254);
        });
    
        it("should call calculate & reduce & vaule is '255' & speed is '1'", () => {
            expect(component.calculate('255','1',false)).toBe(254);
        });
    
        it("should call calculate & reduce & vaule is '255' & speed is 1", () => {
            expect(component.calculate('255',1,false)).toBe(254);
        });
    
        it("should call calculate & reduce & vaule is 255 & speed is '1'", () => {
            expect(component.calculate(255,'1',false)).toBe(254);
        });
    
        it("should call calculate & reduce & vaule is '2.05' & speed is '0.05'", () => {
            expect(component.calculate('2.05','0.05',false)).toBe(2);
        });
    
        it("should call calculate & reduce & vaule is 2.05 & speed is '0.05'", () => {
            expect(component.calculate(2.05,'0.05',false)).toBe(2);
        });
    
        it("should call calculate & reduce & vaule is '2.05' & speed is 0.05", () => {
            expect(component.calculate('2.05',0.05,false)).toBe(2);
        });
        
        it("should call calculate & reduce & vaule is 2.05 & speed is 0.05", () => {
            expect(component.calculate(2.05,0.05,false)).toBe(2);
        });
    
        it("should call calculate & reduce & vaule is '0.60' & speed is '0.10'", () => {
            expect(component.calculate('0.60','0.10',false)).toBe(0.5);
        });
    
        it("should call calculate & reduce & vaule is 0.60 & speed is '0.10'", () => {
            expect(component.calculate(0.60,'0.10',false)).toBe(0.5);
        });
    
        it("should call calculate & reduce & vaule is '0.60' & speed is 0.10", () => {
            expect(component.calculate('0.60',0.10,false)).toBe(0.5);
        });
        
        it("should call calculate & reduce & vaule is 0.60 & speed is 0.10", () => {
            expect(component.calculate(0.60,0.10,false)).toBe(0.5);
        });
    })
    
    describe('calculate & add : ', () => {
        it("should call calculate & add & vaule is 255 & speed is 1", () => {
            expect(component.calculate(255,1,true)).toBe(256);
        });
    
        it("should call calculate & add & vaule is '255' & speed is '1'", () => {
            expect(component.calculate('255','1',true)).toBe(256);
        });
    
        it("should call calculate & add & vaule is '255' & speed is 1", () => {
            expect(component.calculate('255',1,true)).toBe(256);
        });
    
        it("should call calculate & add & vaule is 255 & speed is '1'", () => {
            expect(component.calculate(255,'1',true)).toBe(256);
        });
    
        it("should call calculate & add & vaule is '2.05' & speed is '0.05'", () => {
            expect(component.calculate('2.05','0.05',true)).toBe(2.1);
        });
    
        it("should call calculate & add & vaule is 2.05 & speed is '0.05'", () => {
            expect(component.calculate(2.05,'0.05',true)).toBe(2.1);
        });
    
        it("should call calculate & add & vaule is '2.05' & speed is 0.05", () => {
            expect(component.calculate('2.05',0.05,true)).toBe(2.1);
        });
        
        it("should call calculate & add & vaule is 2.05 & speed is 0.05", () => {
            expect(component.calculate(2.05,0.05,true)).toBe(2.1);
        });
    
        it("should call calculate & add & vaule is '0.60' & speed is '0.10'", () => {
            expect(component.calculate('0.60','0.10',true)).toBe(0.7);
        });
    
        it("should call calculate & add & vaule is 0.60 & speed is '0.10'", () => {
            expect(component.calculate(0.60,'0.10',true)).toBe(0.7);
        });
    
        it("should call calculate & add & vaule is '0.60' & speed is 0.10", () => {
            expect(component.calculate('0.60',0.10,true)).toBe(0.7);
        });
        
        it("should call calculate & add & vaule is 0.60 & speed is 0.10", () => {
            expect(component.calculate(0.60,0.10,true)).toBe(0.7);
        });
    })

    describe('should call reduceFn : ', () => {
        it('should call reduceFn & value === minData', () => {
            component.value = 255;
            component.minData = 255;
            component.isValChange = false;
            expect(component.reduceFn()).toBeUndefined();
        });
  
        it('should call reduceFn & isValChange is true', () => {
            component.value = 0.6;
            component.step = 0.1;
            component.isValChange = true;
            component.reduceFn()
            expect(component.value).toBe(0.5);
        });
    
        it('should call reduceFn & value <= minData', () => {
            // value < minData
            component.value = 0;
            component.minData = 1;
            component.isValChange = false;
            component.reduceFn();
            expect(component.value).toBe(1);
        });
    
        it('should call reduceFn & value <= minData', () => {
            // value = minData
            component.value = 0.05;
            component.minData = 0.05;
            component.isValChange = false;
            component.reduceFn();
            expect(component.value).toBe(0.05);
        });                       
    })

    describe('should call addFn : ', () => {
        it('should call addFn & value === maxData', () => {
            component.value = 255;
            component.maxData = 255;
            component.isValChange = false;
            expect(component.addFn()).toBeUndefined();
        });

        it('should call addFn & isValChange is true', () => {
            component.value = 0.6;
            component.step = 0.1;
            component.isValChange = true;
            component.addFn()
            expect(component.value).toBe(0.7);
        });

        it('should call addFn & value >= maxData', () => {
            //value > maxData
            component.value = 1;
            component.maxData = 0;
            component.isValChange = false;
            component.addFn();
            expect(component.value).toBe(0);
        });

        it('should call addFn & value >= maxData', () => {
            //value = maxData
            component.value = 0.2;
            component.maxData = 0.2;
            component.isValChange = false;
            component.addFn();
            expect(component.value).toBe(0.2);
        });

    })

    describe('should call hideColorPicker : ', () => {
        it('should call hideColorPicker & focus button', () => {
            component.hideColorPicker();
            expect(component.hideColorPicker()).toBeUndefined();
            const dummyElement = document.createElement('div');
            dummyElement.id = 'colorPicker';
            document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
            component.hideColorPicker();
            expect(component.hideColorPicker()).toBeUndefined();
        });
    })
});

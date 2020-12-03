import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BetaComponentComponent } from './beta-component.component';
import { TranslationModule } from 'src/app/modules/translation.module';

xdescribe('BetaComponentComponent', () => {
	let component: BetaComponentComponent;
	let fixture: ComponentFixture<BetaComponentComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [BetaComponentComponent],
			imports: [TranslationModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BetaComponentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

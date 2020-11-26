import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TopRowFunctionsComponent } from './top-row-functions.component';

xdescribe('TopRowFunctionsComponent', () => {
	let component: TopRowFunctionsComponent;
	let fixture: ComponentFixture<TopRowFunctionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TopRowFunctionsComponent],
			imports: [FontAwesomeModule, TranslationModule.forChild()],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [TranslateStore],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TopRowFunctionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

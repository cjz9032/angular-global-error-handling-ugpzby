import { PageLayoutComponent } from './../../page-layout/page-layout.component';
import { ContainerCardComponent } from './../../container-card/container-card.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject } from 'rxjs';
import { CMSService } from './../../../services/cms/cms.service';
import { Title } from '@angular/platform-browser';
import { DeviceService } from './../../../services/device/device.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from './../../../services/hypothesis/hypothesis.service';
import { LoggerService } from './../../../services/logger/logger.service';
import { UPEService } from './../../../services/upe/upe.service';
import { CommonService } from './../../../services/common/common.service';
import { MacrokeyService } from './../../../services/gaming/macrokey/macrokey.service';
import { VantageShellService } from './../../../services/vantage-shell/vantage-shell.service';
import { DashboardService } from './../../../services/dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

import { PageMacrokeyComponent } from './page-macrokey.component';

xdescribe('PageMacrokeyComponent', () => {
	let component: PageMacrokeyComponent;
	let fixture: ComponentFixture<PageMacrokeyComponent>;
	const mockShellService = { getMetrics: function getMetrics() { return 'hii'; } };
	const mockTitleService = { setTitle: function setTitle() { return 'hii'; } };
	const onLangChange: Observable<any> = new Subject();

	const mockTranslateService = {onLangChange};

	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PageMacrokeyComponent,
				ContainerCardComponent,
				PageLayoutComponent,
				mockPipe({ name: 'translate' }),
				mockPipe({ name: 'sanitize' })],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [HttpClientModule],
			providers: [
				{ provide: DashboardService, useValue: {} },
				{ provide: VantageShellService, useValue: mockShellService },
				{ provide: MacrokeyService, useValue: {} },
				{ provide: CommonService, useValue: {} },
				{ provide: UPEService, useValue: {} },
				{ provide: LoggerService, useValue: {} },
				{ provide: HypothesisService, useValue: {} },
				{ provide: TranslateService, useValue: mockTranslateService },
				{ provide: DeviceService, useValue: {isGaming: true} },
				{ provide: Title, useValue: mockTitleService },
				{ provide: CMSService, useValue: {} }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(PageMacrokeyComponent);
		component = fixture.debugElement.componentInstance;
		fixture.detectChanges();
		component.cardContentPositionF = {Id: 1, FeatureImage: 'TEST'};
		component.cardContentPositionC = {Id: 1, FeatureImage: 'TEST'};
		tick(10);
		fixture.detectChanges();
	}
	));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
export function mockPipe(options: Pipe): Pipe {
	const metadata: Pipe = {
		name: options.name
	};
	return Pipe(metadata)(
		class MockPipe {
			public transform(query: string, ...args: any[]): any {
				return query;
			}
		}
	);
}

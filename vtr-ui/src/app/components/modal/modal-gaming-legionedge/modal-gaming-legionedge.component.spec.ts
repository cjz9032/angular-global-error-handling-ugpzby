import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalGamingLegionedgeComponent } from './modal-gaming-legionedge.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { MatDialogModule, MatDialogRef } from '@lenovo/material/dialog';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('ModalGamingLegionedgeComponent', () => {
	let component: ModalGamingLegionedgeComponent;
	let fixture: ComponentFixture<ModalGamingLegionedgeComponent>;

	let liteGamingCache = false;
	let desktopMachineCache = false;

	const mockDialogRef = {
		close: jasmine.createSpy('closeModal'),
	};
	const localCacheServiceMock = {
		getLocalCacheValue: (key: any, defaultValue?: any) => {
			switch (key) {
				case '[LocalStorageKey] DesktopType':
					return liteGamingCache;
				case '[LocalStorageKey] LiteGaming':
					return desktopMachineCache;
			}
		},
	};

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [MatDialogModule],
				declarations: [
					ModalGamingLegionedgeComponent,
					GAMING_DATA.mockPipe({ name: 'translate' }),
					GAMING_DATA.mockPipe({ name: 'sanitize' }),
				],
				schemas: [NO_ERRORS_SCHEMA],
				providers: [
					{
						provide: MatDialogRef,
						useValue: mockDialogRef,
					},
					{
						provide: LocalCacheService,
						useValue: localCacheServiceMock,
					},
					HttpClient,
				],
			}).compileComponents();
			fixture = TestBed.createComponent(ModalGamingLegionedgeComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check closeModal', () => {
		component.closeModal();
		expect(component).toBeTruthy();
	});
});

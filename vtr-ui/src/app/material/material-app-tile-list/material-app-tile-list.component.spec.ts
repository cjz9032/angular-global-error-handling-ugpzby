import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAppTileListComponent } from './material-app-tile-list.component';

describe('MaterialAppTileListComponent', () => {
	let component: MaterialAppTileListComponent;
	let fixture: ComponentFixture<MaterialAppTileListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MaterialAppTileListComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MaterialAppTileListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

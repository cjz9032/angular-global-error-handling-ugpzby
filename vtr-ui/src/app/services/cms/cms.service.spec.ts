import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';

import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CMSService } from './cms.service';

describe('CMSService', () => {
    let service:CMSService;
    let shellservice: VantageShellService;
	beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientModule,RouterTestingModule],
		 			providers: [
                        VantageShellService,CommsService,DevService]
    }));

	it('should be created', () => {
		const service: CMSService = TestBed.get(CMSService);
		expect(service).toBeTruthy();
	});
});

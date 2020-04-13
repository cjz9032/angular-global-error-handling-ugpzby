import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { GamingAccessoryService } from './gaming-accessory.service';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

describe('GamingAccessoryService', () => {

  let shellService: VantageShellService;
  let gamingAccessoryService: GamingAccessoryService;

  describe('isShellAvailable is false', () => {
    beforeEach(() => {
      let spy = jasmine.createSpyObj('VantageService', ['getGamingAccessory', 'getLogger']);
      spy.getGamingAccessory.and.returnValue(undefined);

      TestBed.configureTestingModule({
        imports: [
          HttpClientModule
        ],
        providers: [
          GamingAccessoryService,
          LoggerService,
          { provide: VantageShellService, useValue: spy }
        ]
      });

      gamingAccessoryService = TestBed.inject(GamingAccessoryService);
      shellService = TestBed.get(VantageShellService);
    });

    it('inject gamingAccessoryService & shellService', () => {
      expect(gamingAccessoryService).toBeTruthy('can not inject gamingOCService');
      expect(shellService).toBeTruthy('can not inject shellService');
    });

    it('shellService.getGamingAccessory() should return undefined', () => {
      expect(shellService.getGamingAccessory()).toBeUndefined();
    });

    it('isShellAvailable is false', () => {
      expect(gamingAccessoryService.isShellAvailable).toBe(false);
    });

    it('launchAccessory should return undefined', () => {
      expect(gamingAccessoryService.launchAccessory()).toBeUndefined();
    })
  });
  xdescribe('isShellAvailable is true', () => {
    let launchReturnValue = false;
    beforeEach(() => {
      let spy = jasmine.createSpyObj('VantageService', ['getGamingAccessory', 'getLogger']);
      let stubValue = {
        setLaunch() {
            return new Promise( resolve => {
                resolve(launchReturnValue);
            })
        }
      };
      spy.getGamingAccessory.and.returnValue(stubValue);

      TestBed.configureTestingModule({
        imports: [
          HttpClientModule
        ],
        providers: [
          GamingAccessoryService,
          LoggerService,
          { provide: VantageShellService, useValue: spy }
        ]
      });

      gamingAccessoryService = TestBed.inject(GamingAccessoryService);
      shellService = TestBed.get(VantageShellService);
    });

    it('inject gamingAccessoryService & shellService', () => {
      expect(gamingAccessoryService).toBeTruthy('can not inject gamingOCService');
      expect(shellService).toBeTruthy('can not inject shellService');
    });

    it('isShellAvailable is false', () => {
      expect(gamingAccessoryService.isShellAvailable).toBe(true);
    });

    it('Accessory installed: launch success and return true', () => {
      launchReturnValue = true;
      gamingAccessoryService.launchAccessory().then( res => {
          expect(res).toBe(true, 'launchAccessory should return true');
      });
    })

    it('Accessory uninstalled: launch falil and return false', () => {
      launchReturnValue = false;
      gamingAccessoryService.launchAccessory().then( res => {
          expect(res).toBe(false, 'launchAccessory should return false');
      })
    })
  });
});

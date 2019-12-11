import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
    providedIn: 'root'
})
export class SmartPerformanceService {
    private getSmartPerformance: any;
    public isShellAvailable = false;
    constructor(shellService: VantageShellService) {
        //this.getSmartPerformance = shellService.getSmartPerformance();
        if (this.getSmartPerformance) {
            this.isShellAvailable = true;
        }
    }

    getReadiness(): Promise<boolean> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.GetReadiness();
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    launchScan(): Promise<any> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.LaunchScan();
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    launchScanAndFix(): Promise<any> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.LaunchScanAndFix();
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    cancelScan(): Promise<boolean> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.CancelScan();
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getSubscriptionDetails(profile: string): Promise<any> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.GetSubscriptionDetails(profile);
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getScanSettings(profile: string): Promise<any> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.GetScanSettings(profile);
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getScanSummary(profile: string): Promise<any> {
        try {
            if (this.isShellAvailable) {
                return this.getSmartPerformance.GetScanSummary(profile);
            }
            return undefined;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
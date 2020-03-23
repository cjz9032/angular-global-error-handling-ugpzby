import {
	Injectable
} from '@angular/core';
import {
	CommonService
} from '../common/common.service';
import {
	Antivirus
} from '@lenovo/tan-client-bridge';
import {
	LocalStorageKey
} from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AntivirusCommonData } from 'src/app/data-models/security-advisor/antivirus-common.data.model';

@Injectable({
	providedIn: 'root'
})
export class AntivirusService {
	private antivirusCommonData: AntivirusCommonData;
	private antivirus: Antivirus;

	private cacheAvStatus: boolean;
	private cacheFwStatus: boolean;
	private cacheCurrentPage: string;

	constructor(public commonService: CommonService, public shellService: VantageShellService) {
		this.antivirus = this.shellService.getSecurityAdvisor().antivirus;

		this.cacheAvStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		this.cacheFwStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		this.cacheCurrentPage = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		this.antivirusCommonData = new AntivirusCommonData();
	}

	public GetAntivirusStatus () : AntivirusCommonData {
		if (this.antivirus.mcafee || this.antivirus.windowsDefender || this.antivirus.others) {
			this.setPage(this.antivirus);
		} else if (this.cacheAvStatus !== undefined || this.cacheFwStatus !== undefined || this.cacheCurrentPage) {
			this.setAntivirusStatus(this.cacheAvStatus, this.cacheFwStatus);
			this.antivirusCommonData.currentPage = this.cacheCurrentPage;
		}

		return this.antivirusCommonData;
	}

	private setPage(antiVirus: Antivirus) {
		let av: boolean | undefined;
		let fw: boolean | undefined;
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.antivirusCommonData.currentPage = 'mcafee';
			this.antivirusCommonData.isMcAfeeInstalled = true;
			av = antiVirus.mcafee.status;
			fw = antiVirus.mcafee.firewallStatus;
		} else if (antiVirus.others && antiVirus.others.enabled) {
			this.antivirusCommonData.currentPage = 'others';
			this.antivirusCommonData.isMcAfeeInstalled = Boolean(antiVirus.mcafee);
			av = antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : undefined;
			if (antiVirus.windowsDefender) {
				fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : antiVirus.windowsDefender.firewallStatus;
			} else {
				fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : undefined;
			}
		} else {
			this.antivirusCommonData.currentPage = 'windows';
			this.antivirusCommonData.isMcAfeeInstalled = false;
			if (antiVirus.windowsDefender) {
				av = antiVirus.windowsDefender.status;
				fw = antiVirus.windowsDefender.firewallStatus;
			}
		}

		this.setAntivirusStatus(av, fw);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.antivirusCommonData.currentPage);
	}

	private setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined) {
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);
		this.antivirusCommonData.antivirus = av;
		this.antivirusCommonData.firewall = fw;
	}
}

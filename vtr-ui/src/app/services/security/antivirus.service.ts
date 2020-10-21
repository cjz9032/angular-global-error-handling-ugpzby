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
import { LocalCacheService } from '../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root'
})
export class AntivirusService {
	private antivirusCommonData: AntivirusCommonData;
	private antivirus: Antivirus;

	private cacheAvStatus: boolean;
	private cacheFwStatus: boolean;
	private cacheCurrentPage: string;
	private cacheFirewallLink: string;

	constructor(
		public commonService: CommonService,
		public shellService: VantageShellService,
		private localCacheService: LocalCacheService,
		) {
		this.antivirus = this.shellService.getSecurityAdvisor()?.antivirus;

		this.cacheAvStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		this.cacheFwStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		this.cacheCurrentPage = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityCurrentPage);
		this.cacheFirewallLink = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityFirewallLink, '/security/anti-virus');
		this.antivirusCommonData = new AntivirusCommonData();
	}

	public GetAntivirusStatus () : AntivirusCommonData {
		if (this.antivirus.mcafee || this.antivirus.windowsDefender || this.antivirus.others) {
			this.setPage(this.antivirus);
		} else if (this.cacheAvStatus !== undefined || this.cacheFwStatus !== undefined || this.cacheCurrentPage || this.cacheFirewallLink) {
			this.setAntivirusStatus(this.cacheAvStatus, this.cacheFwStatus);
			this.antivirusCommonData.currentPage = this.cacheCurrentPage;
			this.antivirusCommonData.firewallLink = this.cacheFirewallLink;
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
			this.antivirusCommonData.firewallLink = '/security/anti-virus';
		} else if (antiVirus.others && antiVirus.others.enabled) {
			this.antivirusCommonData.currentPage = 'others';
			this.antivirusCommonData.isMcAfeeInstalled = Boolean(antiVirus.mcafee);
			av = antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : undefined;
			if (antiVirus.windowsDefender) {
				fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : antiVirus.windowsDefender.firewallStatus;
				this.antivirusCommonData.firewallLink = antiVirus.others.firewall.length > 0 ? '/security/anti-virus' : 'ms-settings:windowsdefender';
			} else {
				fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : undefined;
				this.antivirusCommonData.firewallLink = '/security/anti-virus';
			}
		} else {
			this.antivirusCommonData.currentPage = 'windows';
			this.antivirusCommonData.isMcAfeeInstalled = false;
			if (antiVirus.windowsDefender) {
				av = antiVirus.windowsDefender.status;
				fw = antiVirus.windowsDefender.firewallStatus;
			}
			this.antivirusCommonData.firewallLink = '/security/anti-virus';
		}

		this.setAntivirusStatus(av, fw);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityCurrentPage, this.antivirusCommonData.currentPage);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityFirewallLink, this.antivirusCommonData.firewallLink);
	}

	private setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);
		this.antivirusCommonData.antivirus = av;
		this.antivirusCommonData.firewall = fw;
	}
}

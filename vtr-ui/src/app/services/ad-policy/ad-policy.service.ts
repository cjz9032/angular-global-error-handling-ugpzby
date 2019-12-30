import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AdPolicyId, AdPolicyEvent } from 'src/app/enums/ad-policy-id.enum';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class AdPolicyService {
	private adPolicyBridge: any;
	private adPolicyList: PolicyItem[];
	public IsSystemUpdateEnabled = true;

	constructor(private vantageShellService: VantageShellService,
		private commonService: CommonService) {
		this.adPolicyBridge = this.vantageShellService.getAdPolicy();
		this.initialize();
	}

	private initialize() {
		this.initializeWithCachedData();
		if (this.adPolicyBridge) {
			this.adPolicyBridge.getAdPolicyList().then((response) => {
				this.adPolicyList = response;
				this.updateSystemUpdateStatus();
				this.commonService.setLocalStorageValue(LocalStorageKey.AdPolicyCache, this.adPolicyList);
				this.commonService.sendNotification(AdPolicyEvent.AdPolicyUpdatedEvent, this);
				this.commonService.sendReplayNotification(AdPolicyEvent.AdPolicyUpdatedEvent, this);
			});
		}
	}

	private initializeWithCachedData() {
		const cachedPolicy = this.commonService.getLocalStorageValue(LocalStorageKey.AdPolicyCache);
		if (cachedPolicy) {
			this.adPolicyList = cachedPolicy;
			this.updateSystemUpdateStatus();
		}
	}

	private updateSystemUpdateStatus() {
		const policy = this.adPolicyList.find(item => item.name === AdPolicyId.SystemUpdate);
		const value = policy === undefined ? undefined : policy.value;
		if (value === '0') {
			this.IsSystemUpdateEnabled = false;
		}
		else {
			this.IsSystemUpdateEnabled = true;
		}
	}

	public getPolicyValueByIdSync(id) {
		const policy = this.adPolicyList.find(item => item.name === id);
		const value = policy === undefined ? undefined : policy.value;
		return value;
	}

	public getPolicyValueById(id) {
		return this.adPolicyBridge.getPolicyValueById(id);
	}
}

export class PolicyItem {
	name: string;
	value: string;
	type?: any;
}

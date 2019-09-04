import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AdPolicyId } from 'src/app/enums/ad-policy-id.enum';

@Injectable({
  providedIn: 'root'
})
export class AdPolicyService {
	private adPolicyBridge: any;
	private adPolicyList: PolicyItem[];
	public IsSystemUpdateEnabled = true;

	constructor(private vantageShellService: VantageShellService) {
		this.adPolicyBridge = this.vantageShellService.getAdPolicy();
		this.initialize();
	}

	private initialize() {
		if (this.adPolicyBridge) {
			this.adPolicyBridge.getAdPolicyList().then((response) => {
				this.adPolicyList = response;
				this.updateSystemUpdateStatus();
			});
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

import { FeatureStatus } from '../common/feature-status.model';

export class AlwaysOnUSBCapability {
	public toggleState = false;
	public checkbox: FeatureStatus = new FeatureStatus(true, false);
}

import { InjectionToken } from '@angular/core';
import { DolbyFusionClient } from './dolby-fusion-client.interface';

export const DOLBY_FUSION_CLIENT = new InjectionToken<DolbyFusionClient>('dolbyFusionClient', {
	factory: () => (window as any).VantageShellExtension.DolbyFusionRpcClient.instance
});

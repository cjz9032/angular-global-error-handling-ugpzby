import { InjectionToken } from '@angular/core';
import { ForteClient } from './forte-client.interface';

export const FORTE_CLIENT = new InjectionToken<ForteClient>('forteClient', {
	factory: () => (window as any).VantageShellExtension.ForteRpcClient.getInstance()
});

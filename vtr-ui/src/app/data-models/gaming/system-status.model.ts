import { LocalStorageKey } from '../../enums/local-storage-key.enum';
export default {
    hwOverClockInfo: {
		cpuOverClockInfo: {
			localCache: LocalStorageKey.cpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		gpuOverClockInfo: {
			localCache: LocalStorageKey.gpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		vramOverClockInfo: {
			localCache: LocalStorageKey.gpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		}
	},
};

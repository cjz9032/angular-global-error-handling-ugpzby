import { LocalStorageKey } from '../../enums/local-storage-key.enum';
export default {
    hwOverClockInfo: {
		cpuOverClockInfo: {
			featureName: 'isCpuOverClocking',
			localCache: LocalStorageKey.cpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		gpuOverClockInfo: {
			featureName: 'isGpuOverClocking',
			localCache: LocalStorageKey.gpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		vramOverClockInfo: {
			featureName: 'isVramOverClocking',
			localCache: LocalStorageKey.gpuOCFeature,
			isSupportOCFeature: false,
			isOverClocking: false
		}
	},
};

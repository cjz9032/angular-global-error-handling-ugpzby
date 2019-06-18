/**
 * this enum is for local storage keys. new keys can be added here. please give meaningful names to key.
 */
export enum LocalStorageKey {
	MachineInfo = '[LocalStorageKey] MachineInfo',
	WelcomeTutorial = '[LocalStorageKey] WelcomeTutorial',
	SecurityVPNStatus = '[LocalStorageKey] SecurityVPNStatus',
	SecurityPasswordManagerStatus = '[LocalStorageKey] SecurityPasswordManagerStatus',
	SecurityWindowsHelloStatus = '[LocalStorageKey] SecurityWindowsHelloStatus',
	SecurityShowWindowsHello = '[LocalStorageKey] SecurityShowWindowsHello',
	SecurityMcAfee = '[LocalStorageKey] SecurityMcAfee',
	SecurityWindowsDefender = '[LocalStorageKey] SecurityWindowsDefender',
	SecurityOtherAntiVirus = '[LocalStorageKey] SecurityOtherAntiVirus',
	SecurityOtherFirewall = '[LocalStorageKey] SecurityOtherFirewall',
	SecurityMcAfeeStatusList = '[LocalStorageKey] SecurityMcAfeeStatusList',
	SecurityWindowsDefenderStatusList = '[LocalStorageKey] SecurityWindowsDefenderStatusList',
	SecurityOthersAntiStatusList = '[LocalStorageKey] SecurityOthersAntiStatusList',
	SecurityOthersFirewallStatusList = '[LocalStorageKey] SecurityOthersFirewallStatusList',
	SecurityCurrentPage = '[LocalStorageKey] SecurityCurrentPage',
	SecurityWifiSecurityState = '[LocalStorageKey] SecurityWifiSecurityState',
	SecurityWifiSecurityHistorys = '[LocalStorageKey] SecurityWifiSecurityHistorys',
	SecurityWifiSecurityIsLocationServiceOn = '[LocalStorageKey] SecurityWifiSecurityIsLocationServiceOn',
	SecurityHomeProtectionChsConsoleUrl = '[LocalStorageKey] SecurityHomeProtectionChsConsoleUrl',
	SecurityHomeProtectionDevicePosture = '[LocalStorageKey] SecurityHomeProtectionDevicePosture',
	SecurityHomeProtectionStatus = '[LocalStorageKey] SecurityHomeProtectionStatus',
	SecurityHomeProtectionFamilyId = '[LocalStorageKey] SecurityHomeProtectionFamilyId',
	SecurityLandingAntivirusStatus = '[LocalStorageKey] SecurityLandingAntivirusStatus',
	SecurityLandingAntivirusFirewallStatus = '[LocalStorageKey] SecurityLandingAntivirusFirewallStatus',
	SecurityLandingWindowsHelloFingerprintStatus = '[LocalStorageKey] SecurityLandingWindowsHelloFingerprintStatus',
	SecurityLandingScore = '[LocalStorageKey] SecurityLandingScore',
	SecurityLandingMaliciousWifi = '[LocalStorageKey] SecurityLandingMaliciousWifi',
	HomeProtectionDevicePosture = '[LocalStorageKey] HomeProtectionDevicePosture',
	DesktopMachine = '[LocalStorageKey] DesktopMachine',
	HadRunApp = '[LocalStorageKey] HadRunApp',
	LidFakeDeviceID = '[LocalStorageKey] LidFakeDeviceID',
	LidStarterAccount = '[LocalStorageKey] LidStarterAccount',
	LidFirstSignInDate = '[LocalStorageKey] LidFirstSignInDate',
	LidHasCreateStarterAccount = '[LocalStorageKey] LidHasCreateStarterAccount',
	CpuOCStatus = '[LocalStorageKey] CpuOCStatus',
	RamOcStatus = '[LocalStorageKey] RamOcStatus',
	CurrentThermalModeStatus = '[LocalStorageKey] CurrentThermalModeStatus',
	PrevThermalModeStatus = '[LocalStorageKey] PrevThermalModeStatus',
	IsHPDSupported = '[LocalStorageKey] IsHPDSupported',
	ConnectedHomeSecurityShowWelcome = '[LocalStorageKey] ConnectedHomeSecurityShowWelcome',
	ConnectedHomeSecurityAccount = '[LocalStorageKey] ConnectedHomeSecurityAccount',
	ConnectedHomeSecurityDeviceName = '[LocalStorageKey] ConnectedHomeSecurityDeviceName',
	ConnectedHomeSecurityDevicePostures = '[LocalStorageKey] ConnectedHomeSecurityDevicePostures',
	ConnectedHomeSecurityDeviceStatus = '[LocalStorageKey] ConnectedHomeSecurityDeviceStatus',
	/**
	 * 0  means "ideaPad",
	 * 1  means "thinkPad",
	 * 2 means "ideaCenter",
	 * 3 means "thinkCenter"
	 */
	MachineType = '[LocalStorageKey] MachineType',
	HybridModeStatus = '[LocalStorageKey] HybridModeStatus',
	TouchpadLockStatus = '[LocalStorageKey] TouchpadLockStatus',
	LightingProfileById = '[LocalStorageKey] LightingProfileById',
	LightingProfileBrightness = '[LocalStorageKey] LightingProfileBrightness',
	LightingProfileEffectColor = '[LocalStorageKey] LightingProfileEffectColor',
	LedDriver = '[LocalStorageKey] LedDriver',
	ProfileBrightness = '[LocalStorageKey] ProfileBrightness',
	LightingCapabilities = '[LocalStorageKey] LightingCapabilities',

	SystemUpdateCriticalUpdateStatus = '[LocalStorageKey] SystemUpdateCriticalUpdateStatus',
	SystemUpdateRecommendUpdateStatus = '[LocalStorageKey] SystemUpdateRecommendUpdateStatus',
	SystemUpdateLastScanTime = '[LocalStorageKey] SystemUpdateLastScanTime',
	SystemUpdateLastInstallTime = '[LocalStorageKey] SystemUpdateLastInstallTime',
	SystemUpdateNextScheduleScanTime = '[LocalStorageKey] SystemUpdateNextScheduleScanTime',
	SystemUpdateInstallationHistoryList = '[LocalStorageKey] SystemUpdateInstallationHistoryList',

	// this enum is for local storage keys. new keys can be added here. Please give meaningful names to key
	cpuInfoFeature = '[LocalStorageKey] CpuInfoFeature',
	gpuInfoFeature = '[LocalStorageKey] GpuInfoFeature',
	memoryInfoFeature = '[LocalStorageKey] MemoryInfoFeature',
	hddInfoFeature = '[LocalStorage] HddInfoFeature',
	touchpadLockFeature = '[LocalStorageKey] TouchpadLockFeature',
	winKeyLockfeature = '[LocalStorageKey] WinKeyLockFeature',
	networkBoostFeature = '[LocalStorageKey] NetworkBoostFeature',
	cpuOCFeature = '[LocalStorageKey] CpuOCFeature',
	ledSetFeature = '[LocalStorageKey] LedSetFeature',
	memOCFeature = '[LocalStorageKey] MemOCFeature',
	macroKeyFeature = '[LocalStorageKey] MacroKeyFeature',
	hybridModeFeature = '[LocalStorageKey] HybridModeFeature',
	optimizationFeature = '[LocalStorageKey] OptimizationFeature',
	smartFanFeature = '[LocalStorageKey] SmartFanFeature',
	xtuService = '[LocalStorageKey] XtuService',
	fbNetFilter = '[LocalStorageKey] FbNetFilter',
	ledDriver = '[LocalStorageKey] LedDriver',
	winKeyLockFeature = '[LocalStorageKey] WinKeyLockFeature',

	// this enum is for macrokey local storage key
	MacroKeyType = '[LocalStorageKey] MacroKeyType',
	MacroKeyStatus = '[LocalStorageKey] MacroKeyStatus',
	MacroKey = '[LocalStorageKey] MacroKey',
	MacroKeyRecordedStatus = '[LocalStorageKey] MacroKeyRecordedStatus',
	MacroKeyChangeStatus = '[LocalStorageKey] MacroKeyChangeStatus',
	PrevMacroKeyStatus = '[LocalStorageKey] PrevMacroKeyStatus',
	PrevMacroKey = '[LocalStorageKey] PrevMacroKey',
	PrevMacroKeyRepeat = '[LocalStorageKey] PrevMacroKeyRepeat',
	PrevMacroKeyInterval = '[LocalStorageKey] PrevMacroKeyInterval',
	CurrentMacroKeyRepeat = '[LocalStorageKey] CurrentMacroKeyRepeat',
	CurrentMacroKeyInterval = '[LocalStorageKey] CurrentMacroKeyInterval',
	SubBrand = '[LocalStorageKey] SubBrand',
}

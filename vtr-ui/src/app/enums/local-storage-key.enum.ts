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
}

export enum TaskType {
	QuickScan,
	CustomScan,
	RefreshModules,
	RecoverBadSectors,
}

export enum TaskStep {
	Confirm,
	Run,
	Cancel,
	Summary,
}

export enum HardwareScanProtocolModule {
	cpu = 'cpu',
	memory = 'memory',
	wireless = 'wireless',
	storage = 'storage',
	pci = 'pci_express',
	motherboard = 'motherboard',
	all = 'all',
}

export enum HardwareScanProtocolType {
	QuickScan = 'quickscan',
	CustomScan = 'customscan',
	RecoverBadSectors = 'recoverbadsectors',
}

export enum HardwareScanOverallResult {
	Incomplete,
	Passed,
	Failed,
	Warning,
	Error,
	Cancelled,
}

export enum HardwareScanState {
	StateHome,
	StateExecuting,
	StateFinished,
}

export enum HardwareScanTestResult {
	NotStarted,
	InProgress,
	Pass,
	Fail,
	Attention,
	Cancelled,
	Na,
}

export enum HardwareScanFinishedHeaderType {
	Scan,
	RecoverBadSectors,
	ViewResults,
	None,
}

export enum HardwareScheduleScanType {
	Quick,
	Full,
}

export enum HardwareScanProgress {
	ScanProgress = '[HardwareScan] ScanProgress',
	ScanResponse = '[HardwareScan] ScanResponse',
	RecoverProgress = '[HardwareScan] RecoverProgress',
	RecoverResponse = '[HardwareScan] RecoverResponse',
	HasDevicesToRecoverBadSectors = '[HardwareScan] HasDevicesToRecoverBadSectors',
	BackEvent = '[HardwareScan] BackEvent',
}

export enum WatcherStepProcess {
	Start,
	Intermediate,
	Stop,
}

export enum ResultCodeStatus {
	Invalid,
	Valid,
}

export enum FontTypes {
	amiri = 'amiri',
	notokr = 'noto-kr',
	notosc = 'noto-sc',
	noto = 'noto',
	rubik = 'rubik',
}

export enum LanguageCode {
	arabic = 'ar',
	croatian = 'hr',
	czech = 'cs',
	danish = 'da',
	deutsch = 'de',
	finnish = 'fi',
	hebrew = 'he',
	hungarian = 'hu',
	italian = 'it',
	japanese = 'ja',
	korean = 'ko',
	polish = 'pl',
	russian = 'ru',
	simplifiedChinese = 'zh-hans',
	swedish = 'sv',
	traditionalChinese = 'zh-hant',
	ukrainian = 'uk',
}

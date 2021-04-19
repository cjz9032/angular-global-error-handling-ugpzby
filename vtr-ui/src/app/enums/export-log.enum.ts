export enum ExportLogErrorStatus {
	LoadingExport,
	SuccessExport,
	AccessDenied,
	GenericError,
}

export enum ExportLogExtensions {
	pdf = 'pdf',
	html = 'html',
}

export enum LogType {
	rbs = 'RecoverBadSectorsLog',
	scan = 'HardwareScanLog',
	snapshot = 'SnapshotLog',
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
	english = 'en',
	hebrew = 'he',
	japanese = 'ja',
	korean = 'ko',
	simplifiedChinese = 'zh-hans',
	traditionalChinese = 'zh-hant',
}

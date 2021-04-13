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

export enum FontTypes {
	amiri = 'amiri',
	notokr = 'noto-kr',
	notosc = 'noto-sc',
	noto = 'noto',
	rubik = 'rubik',
}

export enum PdfLanguageTokens {
	arabic = 'ar',
	japanese = 'ja',
	hebrew = 'he',
	korean = 'ko',
	simplifiedChinese = 'zh-hans',
	traditionalChinese = 'zh-hant',
}

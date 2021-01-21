import { HardwareScanTestResult } from '../enums/hardware-scan.enum';

export interface HardwareScanPluginScanResponse {
	finalResultCode?: string;
	startDate?: string;
	percentageComplete?: string;
	responses?: Array<DoScanResponse | any>;
	resultDescription?: string;
}

export interface DoScanResponse {
	currentLoop: number;
	groupResults: Array<GroupResult>;
	percentageComplete: number;
}

export interface GroupResult {
	id: string;
	moduleName: string;
	resultCode: string;
	resultDescription: string;
	testResultList: Array<TestResults>;
}

export interface TestResults {
	description: string;
	ellappsedMilliseconds: string;
	id: string;
	moduleName: string;
	percentageComplete: string;
	result: string | HardwareScanTestResult;
}

export interface HardwareScanPluginGetPreviousResultResponse {
	hasPreviousResults?: boolean;
	modulesResults?: Array<ModuleResult>;
	scanSummary?: ScanSummary;
}

export interface ScanSummary {
	finalResultCode: string;
	finalResultCodeDescription: string;
	result: number;
	ScanDate: string;
}

export interface ModuleResult {
	id: string; // Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz
	localizedItems: string;
	response: Array<DoScanResponse>;
	scanDate: string;
	categoryInformation: Array<any>;
}

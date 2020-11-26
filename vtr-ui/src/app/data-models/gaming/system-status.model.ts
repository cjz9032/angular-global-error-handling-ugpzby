export class SystemStatus {
	public cpuUseFrequency: string;
	public gpuUseFrequency: string;
	public memoryUsed: string;
	public cpuUsage: number;
	public gpuUsage: number;
	public memoryUsage: number;
	public cpuBaseFrequency: string;
	public gpuModulename: string;
	public gpuMaxFrequency: string;
	public memorySize: string;
	public memoryModuleName: string;
	public ramOver: string;
	public diskList: [
		{
			isSystemDisk: boolean;
			capacity: number;
			type: string;
			hddName: string;
			usedDisk: number;
			diskUsage: number;
		}
	];
}

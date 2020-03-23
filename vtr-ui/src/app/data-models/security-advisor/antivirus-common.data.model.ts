export class AntivirusCommonData {
	public currentPage: string;
	public antivirus: boolean | undefined;
	public firewall: boolean | undefined;
	public isMcAfeeInstalled: boolean;

	constructor() {
		this.currentPage = 'windows';
		this.antivirus = undefined;
		this.firewall = undefined;
		this.isMcAfeeInstalled = false;
	}
}

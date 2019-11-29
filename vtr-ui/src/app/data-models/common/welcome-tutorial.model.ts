export class WelcomeTutorial {
	constructor(
		public page: number, // on page 1 or 2
		public tutorialVersion: string,
		public isDone?: boolean,
		public usageType?: string,
		public interests?: Array<string>,
		public isPrivacyPolicy?: boolean
	) { }
}

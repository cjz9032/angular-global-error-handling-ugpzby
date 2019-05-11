export class WelcomeTutorial {
	constructor(
		public isTutorialCompleted: boolean
		, public usageType?: string
		, public interests?: Array<string>
		, public isPrivacyPolicy?: boolean
	) { }
}

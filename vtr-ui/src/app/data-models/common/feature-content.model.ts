export class FeatureContent {
	Id?: string
	Title?: string
	ShortTitle?: string
	Description?: string
	FeatureImage: string
	Action?: string
	/** External | Internal | ... */
	ActionType?: string
	ActionLink?: string
	BrandName?: string
	BrandImage?: string
	Priority?: string
	Page?: string
	Template?: string
	Position?: string
	ExpirationDate?: string
	/** MM.DD.YYYY */
	DisplayStartDate?: string
	/** default | light | dark | ... */
	OverlayTheme?: string
	Filters?: any
	DataSource?: string
	isLocal?: boolean
}

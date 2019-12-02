export interface StatusInfo {
	status: string;
	levelTitle: string;
	levelDesc: string;
	btnText: string;
	icon: string;
}

export enum SecurityTypeConst {
	NoProtection = 'no protection',
	Basic = 'basic',
	Intermediate = 'intermediate',
	Advanced = 'advanced'
}

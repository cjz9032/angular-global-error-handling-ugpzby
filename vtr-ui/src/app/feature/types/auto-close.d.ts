export interface App {
	path: string;
	name?: string;
	icon?: string;
}

export interface Profile {
	type: string;
}

export interface MaxSelected {
	maxLength: number;
	tooltips?: string;
}

export type AddableType = 'clickable' | 'selected' | 'disabled';

export interface TileItem {
	path: string;
	name: string;
	iconSrc?: string;
	matIcon?: string;
	buttonType?: AddableType;
	tooltip?: string;
}

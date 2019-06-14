import {Transform2} from './Transform';

export interface TextStyle {
	color: string;

	className: string;
	baseline: string;
	anchor: string;

	opacity: number;
}

export interface MText {
	transform: Transform2;

	text: string;
	style: TextStyle;
}

export const defaultGlobalTextStyle: TextStyle = {
	className: 'map-MText',

	baseline: 'central',
	anchor: 'left',

	color: 'black',

	opacity: 1,
};

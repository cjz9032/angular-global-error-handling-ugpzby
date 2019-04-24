import { Color, ColorUtils } from '../Color';

export interface CircleStyle {
	color: Color;
	opacityGradient: number[];

	textColor: Color;

	border: boolean;
}

interface ChartCircle {
	r: number;
	opacity: number;
}

export interface ChartCircleProps {
	color: Color;
	textColor: Color;

	border: boolean;
	borderRadius: number;

	text: string;

	circles: ChartCircle;
}

export const defaultCircleStyle: CircleStyle = {
	color: ColorUtils.colorFromHEX('#FE5050'),
	textColor: ColorUtils.colorFromHEX('#FFFFFF'),

	opacityGradient: [1, 0.1, 0.04],

	border: false,
};

export class ChartCircles {

	static circles(startRadius: number, endRadius: number, style: CircleStyle = { ...defaultCircleStyle }, text: string = '') {
		const steps = style.opacityGradient.length - 1;

		const circles = [];
		for (let i = 0; i <= steps; i++) {
			const r = startRadius + (i / steps) * (endRadius - startRadius);

			circles.push({
				r,
				opacity: style.opacityGradient[i],
			});
		}

		return {
			color: ColorUtils.colorToHEX(style.color),
			textColor: ColorUtils.colorToHEX(style.textColor),

			border: style.border,
			borderRadius: startRadius + ((steps + 1) / steps) * (endRadius - startRadius),

			text: text.toUpperCase(),

			circles,
		};
	}

}

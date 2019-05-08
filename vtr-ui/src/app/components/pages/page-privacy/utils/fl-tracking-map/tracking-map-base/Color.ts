export interface Color {
	r: number;
	g: number;
	b: number;
}

export class ColorUtils {

	static colorKeys = ['r', 'g', 'b'];

	static getZeroColor() {
		return {r: 0, g: 0, b: 0};
	}

	static colorFromRGBArray(rgbArray: number[]) {
		const color: Color = this.getZeroColor();

		this.colorKeys.forEach((key, i) => {
			color[key] = rgbArray[i];
		});

		return color;
	}

	static colorFromHEX(hexString: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	static colorToHEX(color: Color) {
		const hexValues = [];
		Object.keys(color).forEach(key => {
			hexValues.push(color[key].toString(16));
		});

		return `#${hexValues.join('')}`;
	}

	static gradient(colorA: Color, colorB: Color, steps: number) {
		const gradient: Color[] = [];
		for (let i = 0; i < steps; i++) {
			const color: Color = this.gradientStepColor(colorA, colorB, i, steps);

			gradient.push(color);
		}

		return gradient;
	}

	static gradientStepColor(colorA: Color, colorB: Color, step: number, totalSteps: number) {
		const color: Color = this.getZeroColor();

		Object.keys(color).forEach(colorKey => {
			const
				colorValueA = colorA[colorKey],
				colorValueB = colorB[colorKey];

			color[colorKey] = Math.round(colorValueA + (step / totalSteps) * (colorValueB - colorValueA));
		});

		return color;
	}

	static toRGBString(color: Color) {
		const joinedColors = this.colorKeys.map(key => color[key]).join(',');

		return `rgb(${joinedColors})`;
	}
}

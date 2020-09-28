export type GradientColor = {
	start: string;
	end: string;
};

export class Gradient {
	public startColor: string;
	public endColor: string;
	public percent = 0;
	private defaultColor = '#2F3447';
	constructor(gradient: GradientColor, percent: number) {
		if (gradient && typeof percent === 'number') {
			this.startColor = gradient.start;
			this.endColor = gradient.end;
			this.percent = Math.floor(percent * 100);
		} else {
			this.startColor = this.endColor = this.defaultColor;
		}
	}
}

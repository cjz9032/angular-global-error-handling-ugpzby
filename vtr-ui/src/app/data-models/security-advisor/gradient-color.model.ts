export class GradientColor {
	public startColor: string;
	public endColor: string;
	public percent = 0;
	private defaultColor = '#2F3447';
	private colors = [
		{
			start: '#FF5B4D',
			end: '#DB221F'
		}, {
			start: '#EAB029',
			end: '#F0D662'
		}, {
			start: '#346CEF',
			end: '#2955BC'
		}, {
			start: '#00A886',
			end: '#00893A'
		}
	];
	constructor(status: number | undefined, percent: number) {
		if (typeof status === 'number' && typeof percent === 'number') {
			this.startColor = this.colors[status].start;
			this.endColor = this.colors[status].end;
			this.percent = Math.floor(percent * 100);
		} else {
			this.startColor = this.endColor = this.defaultColor;
		}
	}
}

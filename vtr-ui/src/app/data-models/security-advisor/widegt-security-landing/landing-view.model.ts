import { GradientColor } from '../gradient-color.model';

export class LandingView {
	public status: number | undefined;
	public fullyProtected: boolean;
	public percent: number;
	public gradient?: GradientColor;
	public statusText?: string;
}

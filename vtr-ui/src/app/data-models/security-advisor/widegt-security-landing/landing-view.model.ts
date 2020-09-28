import { Gradient } from '../gradient-color.model';

export class LandingView {
	public status: number | undefined;
	public fullyProtected: boolean;
	public percent: number;
	public gradient?: Gradient;
	public statusText?: string;
}

import { MacroKeyInput } from './macrokey-input.model';

export class MacroKeyMacro {
	public repeat: number;
	public interval: number;
	public inputs: MacroKeyInput[] = [];
}

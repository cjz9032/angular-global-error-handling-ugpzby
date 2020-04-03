import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ExecuteHardwareScanService {

	private isButtonDisable = false;

	constructor() { }

	//Use to consult the quick and custom button status
	public getIsButtonDisable(){
		return this.isButtonDisable;
	}

	//Use to control the quick and custom button status
	public setIsButtonDisable(statusButton: boolean){
		this.isButtonDisable = statusButton;
	}
}

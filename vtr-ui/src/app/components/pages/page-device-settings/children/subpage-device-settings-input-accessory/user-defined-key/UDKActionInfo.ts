export const INPUT_TEXT = { str: 'INPUT_TEXT', value: '3' };
export const OPEN_WEB = { str: 'OPEN_WEB', value: '1' };
export const OPEN_FILES = { str: 'OPEN_FILES', value: '0' };
export const OPEN_APPLICATIONS_OR_FILES = { str: 'OPEN_APPLICATIONS_OR_FILES'};
export const OPEN_APPLICATIONS = { str: 'OPEN_APPLICATIONS', value: '1' };
export const INVOKE_KEY_SEQUENCE = { str: 'SEND_KEY_SEQUENCE', value: '2' };

export class UDKActionInfo {
	keyType: number;
	actionType: number;
    actionValue: string;
    applicationList=[];
	fileList=[];
	index = 0;
	constructor(response,value) {
        this.processGetResponse(response);
        this.processGetResponseFilesOrApplications(response,value);

	}
	processGetResponse(response: any) {
		try {
			if (response
				&& response.UDKType
				&& response.UDKType.length
				&& response.UDKType[0].SettingList
				&& response.UDKType[0].SettingList.length
				&& response.UDKType[0].SettingList[0].Setting) {
				const info = response.UDKType[0].SettingList[0].Setting;
				for (const data of info) {
					switch (data.key) {
						case 'UserDefinedKeyType':
							this.keyType = Number(data.value);
							break;
						case 'UserDefinedKeyActionType':
							this.actionType = Number(data.value);
							break;
						case INPUT_TEXT.str:
							this.actionValue = data.value;
							this.index = 2;
                            break;
                        case INVOKE_KEY_SEQUENCE.str:
                            this.actionValue = data.value;
                            this.index = 4;
                            break;    
						case OPEN_WEB.str:
							this.actionValue = data.value;
							this.index = 1;
							break;
					}
				}
			} else {
			}
		} catch (error) {
		}
    }
    processGetResponseFilesOrApplications(response: any,applicationType:string) {
		try {
			if (response
				&& response.UDKType
				&& response.UDKType.length
				&& response.UDKType[0].FileList
				&& response.UDKType[0].FileList.length
				&& response.UDKType[0].FileList[0].Setting) {
				const info = response.UDKType[0].FileList[0].Setting;
				for (const data of info) {
					if(data.type=="1"){
						this.applicationList.push({value:data.value,key:data.key});
					}
					else{
                        this.fileList.push({value:data.value,key:data.key});
					}
					this.index = 3;  
				}
			} else {
			}
		} catch (error) {
		}
	}
}

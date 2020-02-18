export const INPUT_TEXT = { str: 'INPUT_TEXT', value: '3' };
export const OPEN_WEB = { str: 'OPEN_WEB', value: '1' };
export class UDKActionInfo {
	keyType: number;
	actionType: number;
	actionValue: string;
	index = 0;
	constructor(response) {
		this.processGetResponse(response);
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
					// console.log('data.key: ' + data.key + ', data.value: ' + data.value);
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
						case OPEN_WEB.str:
							this.actionValue = data.value;
							this.index = 1;
							break;
					}
				}
			} else {
				// console.log('Response id not in correct format', response);
			}
		} catch (error) {
			throw error;
			// console.log('Error while processing response', error);
		}
	}
}

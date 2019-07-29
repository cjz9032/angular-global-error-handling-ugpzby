import {Injectable} from '@angular/core';
import {createGlobalSettings} from "@angular/cli/utilities/config";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class MetricsTranslateService {


	private baseLanguage;
	private targetLanguage;

	constructor(private translateService: TranslateService, private http: HttpClient) {
		setTimeout(() => {
			this.loadBaseAndTargetFile();
		}, 0)

	}

	public setBaseLanguage(baseLanguage) {
		this.baseLanguage = baseLanguage;
		console.log('base', this.targetLanguage);
	}

	public setTargetLanguage(targetLanguage) {
		this.targetLanguage = this.flatten(targetLanguage);
		console.log('target', this.targetLanguage);
	}

	public translate(sourceValue): string {
		console.log('1.&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',sourceValue)
		var matchedKey = "";
		for (var i in this.targetLanguage) {
			if (this.targetLanguage[i] === sourceValue) {
				matchedKey = i;
				break;
			}
		}
		console.log('2.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', matchedKey)
		let targetValue = this.expand(this.baseLanguage, matchedKey);
		targetValue = targetValue ? targetValue : sourceValue;
		console.log('3.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', targetValue);
		return targetValue;
	}

	private flatten(ob) {
		var toReturn = {};

		for (var i in ob) {
			if (!ob.hasOwnProperty(i)) continue;

			if ((typeof ob[i]) == 'object' && ob[i] !== null) {
				var flatObject = this.flatten(ob[i]);
				for (var x in flatObject) {
					if (!flatObject.hasOwnProperty(x)) continue;

					toReturn[i + '.' + x] = flatObject[x];
				}
			} else {
				toReturn[i] = ob[i];
			}
		}
		return toReturn;
	}

	private expand(object, str) {
		var items = str.split(".") // split on dot notation

		//  loop through all nodes, except the last one
		for (var i = 0; i < items.length; i++) {
			object = object[items[i]] // create a new element inside the reference
			// shift the reference to the newly created object
		}

		// apply the final value

		return object // return the full object
	}

	loadBaseAndTargetFile() {
		    this.http.get('./assets/i18n/en.json').subscribe((baseLanguage) => {
				return this.http.get('./assets/i18n/' + this.translateService.currentLang + '.json').subscribe((targetLanguage) => {
					console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',this.translateService.currentLang,baseLanguage);
					console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',this.translateService.currentLang,targetLanguage);
					this.setTargetLanguage(targetLanguage);
					this.setBaseLanguage(baseLanguage);
				})
			})


	}
}

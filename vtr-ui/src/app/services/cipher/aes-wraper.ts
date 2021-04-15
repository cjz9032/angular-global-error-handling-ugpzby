import { AES } from 'crypto-es/lib/aes';
import CryptoES from 'crypto-es';

const JsonFormatter = {
	stringify: function (cipherParams) {
		// create json object with ciphertext
		const jsonObj: any = { ct: cipherParams.ciphertext.toString(CryptoES.enc.Base64) }; // optionally add iv and salt
		if (cipherParams.iv) {
			jsonObj.iv = cipherParams.iv.toString();
		}
		if (cipherParams.salt) {
			jsonObj.s = cipherParams.salt.toString();
		}
		// stringify json object
		return btoa(JSON.stringify(jsonObj));
	},
	parse: function (jsonStr) {
		// parse json string
		const jsonObj = JSON.parse(atob(jsonStr)); // extract ciphertext from json object, and create cipher params object
		const cipherParams = CryptoES.lib.CipherParams.create({
			ciphertext: CryptoES.enc.Base64.parse(jsonObj.ct),
		}); // optionally extract iv and salt
		if (jsonObj.iv) {
			cipherParams.iv = CryptoES.enc.Hex.parse(jsonObj.iv);
		}
		if (jsonObj.s) {
			cipherParams.salt = CryptoES.enc.Hex.parse(jsonObj.s);
		}
		return cipherParams;
	},
};

export class AesWraper {
	/**
	 * if you omit the iv while encrypting your content,  you should also omit your iv while decripting your content
	 */
	static encrypt(content: string, key: string): string {
		return AES.encrypt(content, key, { format: JsonFormatter })?.toString();
	}

	/**
	 * if you omit the iv while encrypting your content,  you should also omit your iv while decripting your content
	 */
	 static decrypt(content: string, key: string): string {
		return AES.decrypt(content, key, { format: JsonFormatter })?.toString(CryptoES.enc.Utf8);
	}
}

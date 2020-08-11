import { Md5 } from "ts-md5";
import { NORMAL_CONTENTS, EXPIRED_DATE_INPOISTIONB, DISPALY_DATE_INPOISTIONB, MULITI_ITEM_INPOISTIONB } from 'src/testing/content-data';
export class MockContentLocalCacheTest {
	public get(par): any {

		if (par.Key === Md5.hashStr(JSON.stringify({ PAGE: 'normalContents' }))) {
			par.Value = JSON.stringify(NORMAL_CONTENTS);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ PAGE: 'expiredDateWithPoistionB' }))) {
			par.Value = JSON.stringify(EXPIRED_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ PAGE: 'NotReachDisplayDateWithPoistionB' }))) {
			par.Value = JSON.stringify(DISPALY_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ PAGE: 'multi-ItemsInPoistionB' }))) {
			par.Value = JSON.stringify(MULITI_ITEM_INPOISTIONB);
		}
		return par;
	}
}

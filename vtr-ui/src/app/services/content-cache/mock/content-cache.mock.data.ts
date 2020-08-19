import { Md5 } from "ts-md5";
import { NORMAL_CONTENTS, EXPIRED_DATE_INPOISTIONB, DISPALY_DATE_INPOISTIONB, MULITI_ITEM_INPOISTIONB, DASHBOARD, DASHBOARD_ONLY_UPE, DASHBOARD_ONLY_CMS, TEST_DATASOURCE, ARTICLE } from 'src/testing/content-data';

export class MockContentLocalCacheTest {
	public get(par): any {
		if (par.UserName === 'ContentCache_Contents') {
			return this.getContents(par);
		}
		else if (par.UserName === 'ContentCache_Articles') {
			return this.getArticle(par);
		}
	}

	private getContents(par) {
		if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'normalContents' }))) {
			par.Value = JSON.stringify(NORMAL_CONTENTS);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'expiredDateWithPoistionB' }))) {
			par.Value = JSON.stringify(EXPIRED_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'NotReachDisplayDateWithPoistionB' }))) {
			par.Value = JSON.stringify(DISPALY_DATE_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'multi-ItemsInPoistionB' }))) {
			par.Value = JSON.stringify(MULITI_ITEM_INPOISTIONB);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'noOnlineContent', Lang: 'en' }))) {
			par.Value = null;
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'noResponse' }))) {
			par = null;
		} else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'dashboard_only_upe' }))) {
			par.Value = JSON.stringify(DASHBOARD_ONLY_UPE);
		} else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'dashboard_only_cms' }))) {
			par.Value = JSON.stringify(DASHBOARD_ONLY_CMS);
		} else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'dashboard' }))) {
			par.Value = JSON.stringify(DASHBOARD);
		}
		else if (par.Key === Md5.hashStr(JSON.stringify({ Page: 'testDataResource' }))) {
			par.Value = JSON.stringify(TEST_DATASOURCE);
		}
		return par;
	}

	private getArticle(par) {
		if (par.Key === 'cached_article_en') {
			par.Value = JSON.stringify(ARTICLE);
		}
		return par;
	}
}
import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalInfoService } from '../local-info/local-info.service';
import { LoggerService } from '../logger/logger.service';
import { UPEService } from '../upe/upe.service';
import { CMSService } from '../cms/cms.service';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { BuildInContentService } from '../build-in-content/build-in-content.service';
import { SegmentConst } from '../self-select/self-select.service';
import { MetricService } from '../metric/metrics.service';

interface IConfigItem {
	cardId: string;
	displayContent: any;
	template: string;
	positionParam: string;
	tileSource: string;
	cmsContent: any;
	upeContent: any;
}

interface ICacheSettings {
	Key: string;
	Value: string;
	Component: string;
	UserName: string;
}

@Injectable({
	providedIn: 'root'
})
export class ContentCacheService {
	private buildInContents = {};
	private contentLocalCacheContract: any;
	private latestCachedContetns = {};
	private ongoingCacheProcesses = {};

	constructor(
		private vantageShellService: VantageShellService,
		private localInfoService: LocalInfoService,
		private cmsService: CMSService,
		private upeService: UPEService,
		private buildInContentService: BuildInContentService,
		private logger: LoggerService,
		private metrics: MetricService) {
		this.contentLocalCacheContract = this.vantageShellService.getContentLocalCache();
	}

	public async getCachedContents(page: string, contentCards: any) {
		const startTime = new Date();
		const cmsOptions = await this.cmsService.generateContentQueryParams({ Page: page });
		const cacheKey = Md5.hashStr(JSON.stringify(cmsOptions)) + '';

		let cachedContents = null;
		try {
			cachedContents = await this.loadCachedContents(cacheKey);
			if (cachedContents) {
				const positionsWithoutContents = this.getPositionsWithoutContents(cachedContents);
				if (positionsWithoutContents.length > 0) {
					const tmpBuildInContents = await this.loadBuildInContents(cmsOptions);
					positionsWithoutContents.forEach((cardId) => {
						cachedContents[cardId] = tmpBuildInContents[cardId];
					});
				}
			}
			else {
				cachedContents = await this.loadBuildInContents(cmsOptions);
			}
		}
		catch (error) {
			this.logger.error('Load contents error ', error);
		}

		if (!this.ongoingCacheProcesses[cacheKey]) {
			this.ongoingCacheProcesses[cacheKey] = this.cacheContents(cacheKey, cmsOptions, contentCards)
				.finally(() => {
					this.ongoingCacheProcesses[cacheKey] = null;
				});
		}

		this.sendCacheMetrics(startTime, 'loadedCacheContents');

		return cachedContents;
	}

	public async getArticleById(actionType: ContentActionType, articleId: any) {
		const loclInfo = await this.cmsService.getLocalinfo();
		if (actionType === ContentActionType.BuildIn) {
			return this.buildInContentService.getArticle(articleId, loclInfo.Lang);
		} else {
			let article = await this.getCachedArticle(articleId, loclInfo.Lang);
			if (article) {
				return article;
			}
			article = await this.cmsService.fetchCMSArticle(articleId);
			this.saveArticleIfNeed(articleId, loclInfo.Lang, article);
			return article;
		}
	}

	private sendCacheMetrics(startTime, metricsName) {
		const endTime = new Date();
		const diff = endTime.getTime() - startTime.getTime();

		const metricsData = {
			ItemParent: 'ContentCache',
			ItemType: metricsName,
			ItemName: 'TimeDuration(ms)',
			ItemValue: diff
		};
		this.metrics.sendMetrics(metricsData);
	}

	private async loadBuildInContents(queryParams: any) {
		const key = `${queryParams.Page}_${queryParams.Lang}`;
		if (this.buildInContents[key]) {
			return this.buildInContents[key];
		}

		const contents = await this.buildInContentService.getContents(queryParams);
		const contentIds = Object.keys(contents);
		contentIds.forEach(id => {
			contents[id] = this.formalizeContent(contents[id], id, ContentSource.Local);
		});
		this.buildInContents[key] = contents;
		return contents;
	}

	private async loadCachedContents(cacheKey) {
		const contents = await this.getCachedOnlineContents(cacheKey);

		if (contents) {
			const contentsForPage = {};
			const contentIds = Object.keys(contents);
			contentIds.forEach(id => {
				contentsForPage[id] = this.removeInvalidContents(contents[id], id);
				contentsForPage[id] = this.formalizeContent(contentsForPage[id], id);
			});

			return contentsForPage;
		}
		return undefined;
	}

	private getPositionsWithoutContents(cachedContents) {
		const postionsWihtoutContents = [];
		Object.keys(cachedContents).forEach((cardId) => {
			if (!cachedContents[cardId]) {
				postionsWihtoutContents.push(cardId);
			}
			else if (cardId === 'positionA' && cachedContents[cardId].length === 0) {
				postionsWihtoutContents.push(cardId);
			}
		});
		return postionsWihtoutContents;
	}

	private async getCachedOnlineContents(cacheKey) {
		let contents = null;
		if (this.latestCachedContetns[cacheKey]) {
			contents = this.latestCachedContetns[cacheKey];
		}
		else {
			const iCacheSettings: ICacheSettings = {
				Key: cacheKey,
				Value: null,
				Component: 'ContentCache',
				UserName: 'ContentCache_Contents'
			};
			const cachedObject = await this.contentLocalCacheContract.get(iCacheSettings);
			if (cachedObject && cachedObject.Value) {
				contents = JSON.parse(cachedObject.Value);
				this.latestCachedContetns[cacheKey] = contents;
			}
		}
		return contents;
	}

	private removeInvalidContents(contents, cardId) {
		const array = [];
		contents.forEach(content => {
			if (cardId !== 'positionA' && array.length > 0) {
				return;
			}
			if (this.canDisplay(content.DisplayStartDate) && !this.hasExpirated(content.ExpirationDate)) {
				array.push(content);
			}
		});

		return array;
	}

	private canDisplay(displayStartDate) {
		if (displayStartDate == null) {
			return true;
		}
		return new Date(displayStartDate) < new Date();
	}

	private hasExpirated(expirationDate) {
		if (expirationDate == null) {
			return false;
		}
		return new Date(expirationDate) < new Date();
	}

	private async cacheContents(cacheKey, cmsOptions: any, contentCards: any) {
		const startTime = new Date();
		Promise.all([this.fetchCMSContent(cmsOptions, contentCards), this.fetchUPEContent(contentCards)])
			.then(async response => {
				const cacheValueOfContents = {
					positionA: [],
					positionB: [],
					positionC: [],
					positionD: [],
					positionE: [],
					positionF: []
				};
				await this.fillCacheValue(response, contentCards, cacheValueOfContents);
				const contents = await this.getUpdatedContents(cacheKey, cacheValueOfContents);
				await this.saveContents(cacheKey, cacheValueOfContents);
				this.latestCachedContetns[cacheKey] = cacheValueOfContents;
				await this.cacheContentDetail(contents);
				this.sendCacheMetrics(startTime, 'fetchedCacheContents');
			}).catch(error => {
				this.logger.error('cacheContents error ', error);
			});
	}

	private async fillCacheValue(response: any, contentCards: any, cacheValueOfContents: any) {
		const cmsContents = response[0];
		if (cmsContents && cmsContents.length > 0) {
			this.populateContent(cmsContents, contentCards, ContentSource.CMS, cacheValueOfContents);
			const welcomeTextContent = this.cmsService.getOneCMSContent(cmsContents, 'top-title-welcome-text', 'welcome-text')[0];
			if (welcomeTextContent && welcomeTextContent.Title) {
				const localInfo = await this.getLocalInfo();
				if ([SegmentConst.Consumer, SegmentConst.SMB].includes(localInfo.Segment)) {
					cacheValueOfContents['welcome-text'] = new Array(welcomeTextContent);
				}
			}
		}
		const upeContents = response[1];
		if (upeContents && upeContents.length > 0) {
			this.populateContent(upeContents, contentCards, ContentSource.UPE, cacheValueOfContents);
		}
	}

	private async saveContents(cacheKey: string, cacheValueOfContents: any) {
		const iCacheSettings: ICacheSettings = {
			Key: cacheKey,
			Value: JSON.stringify(cacheValueOfContents),
			Component: 'ContentCache',
			UserName: 'ContentCache_Contents'
		};
		await this.contentLocalCacheContract.set(iCacheSettings);
	}

	private async getUpdatedContents(cacheKey: any, cacheValueOfContents: any) {
		const contents = [];
		const cachedContents = await this.getCachedOnlineContents(cacheKey);
		if (cachedContents) {
			for (const key of Object.keys(cacheValueOfContents)) {
				if ('welcome-text' === key) {
					continue;
				}
				const contentList = cacheValueOfContents[key];
				const cachedContentList = cachedContents[key];
				this.findUpdatedContents(contentList, cachedContentList, contents);
				this.removeInvalidCachedArticles(contentList, cachedContentList);
			}
		} else {
			for (const key of Object.keys(cacheValueOfContents)) {
				cacheValueOfContents[key].forEach(content => {
					contents.push(content);
				});
			}
		}
		return contents;
	}

	private findUpdatedContents(contentList: any, cachedContentList: any, contents: any[]) {
		for (const index of Object.keys(contentList)) {
			const content = contentList[index];
			let needUpdated = true;
			for (const idx of Object.keys(cachedContentList)) {
				const cachedContent = cachedContentList[idx];
				if (content.Id === cachedContent.Id &&
					content.Revision === cachedContent.Revision) {
					needUpdated = false;
					break;
				}
			}
			if (needUpdated) {
				contents.push(content);
			}
		}
	}

	private removeInvalidCachedArticles(contentList: any, cachedContentList: any) {
		for (const index of Object.keys(cachedContentList)) {
			let invalid = true;
			const cachedContent = cachedContentList[index];
			for (const idx of Object.keys(contentList)) {
				const content = contentList[idx];
				if (content.Id === cachedContent.Id) {
					invalid = false;
					break;
				}
			}
			if (invalid) {
				this.doRemove(cachedContent);
			}
		}
	}

	private checkArticleCacheable(actionType: any, articId: any): boolean {
		if (actionType && actionType === 'Internal'
			&& articId && !articId.startsWith('lenovo-vantage3:')
			&& !articId.startsWith('dcc-demo')) {
			return true;
		}
		return false;
	}

	private async doRemove(cachedContent: any) {
		const actionType = cachedContent.ActionType;
		const articId = cachedContent.ActionLink;
		if (this.checkArticleCacheable(actionType, articId)) {
			const localInfo = await this.getLocalInfo();
			const key = `${articId}_${localInfo.Lang}`;
			const iCacheSettings: ICacheSettings = {
				Key: key,
				Value: null,
				Component: 'ContentCache',
				UserName: 'ContentCache_Articles'
			};
			this.contentLocalCacheContract
				.delete(iCacheSettings)
				.catch(ex => { this.logger.error('remove article [' + articId + '] failed.'); });
		}
	}

	private cacheContentDetail(contents: any) {
		if (!contents || contents.length === 0) {
			return;
		}
		return new Promise(async (resolve, reject) => {
			const downLoadImages = [];
			const localInfo = await this.getLocalInfo();
			const cacheArticleResults = [];
			contents.forEach(content => {
				this.cacheContentImage(content, downLoadImages);
				const result = this.cacheArticle(content, localInfo.Lang, downLoadImages);
				cacheArticleResults.push(result);
			});
			Promise.all(cacheArticleResults).then(() => {
				const downLoadImagesTimeInterval = setInterval(() => {
					const notComplete = downLoadImages.find(item => !item.complete);
					if (!notComplete) {
						clearInterval(downLoadImagesTimeInterval);
						resolve();
					}
				}, 500);
			}).catch(ex => {
				this.logger.error('Cache content detail error.');
			});
		});
	}

	private cacheContentImage(content: any, downLoadImages: any[]) {
		if (content.FeatureImage) {
			const image = new Image();
			image.src = content.FeatureImage;
			downLoadImages.push(image);
		}
	}

	private async cacheArticle(content: any, lang: string, downLoadImages: any[]) {
		const actionType = content.ActionType;
		const articId = content.ActionLink;
		if (this.checkArticleCacheable(actionType, articId)) {
			const response = await this.cmsService.fetchCMSArticle(articId);
			this.saveArticle(articId, lang, response);
			this.cacheArticleImage(response, downLoadImages);
		}
	}

	private async saveArticle(articId: any, lang: any, response: any) {
		const key = `${articId}_${lang}`;
		const iCacheSettings: ICacheSettings = {
			Key: key,
			Value: JSON.stringify(response),
			Component: 'ContentCache',
			UserName: 'ContentCache_Articles'
		};
		await this.contentLocalCacheContract.set(iCacheSettings);
	}

	private cacheArticleImage(response: any, downLoadImages: any[]) {
		if (response.Results.Image) {
			const image = new Image();
			image.src = response.Image;
			downLoadImages.push(image);
		}
		const body = response.Results.Body;
		const div = document.createElement('div');
		div.innerHTML = body;
		const images: any = div.getElementsByTagName('img');
		for (const element of images) {
			downLoadImages.push(element);
		}
		div.innerHTML = '';
	}

	private async fetchCMSContent(cmsOptions: any, contentCards: any) {
		try {
			return await this.cmsService.fetchContents(cmsOptions);
		} catch (ex) {
			this.logger.error('fech cms contents error.');
		}
	}

	private async fetchUPEContent(contentCards: any) {
		const contentCardList: IConfigItem[] = Object.values(contentCards);
		const upeContentCards = contentCardList.filter(contentCard => contentCard.tileSource === 'UPE');
		if (upeContentCards.length === 0) {
			return;
		}
		try {
			const upePositions = upeContentCards.map(contentCard => contentCard.positionParam);
			return await this.upeService.fetchUPEContent({ positions: upePositions });
		} catch (ex) {
			this.logger.error('fech upe contents error.');
		}
	}

	private async getLocalInfo() {
		return await this.localInfoService.getLocalInfo();
	}

	private populateContent(response: any, contentCards: any, dataSource: ContentSource, cacheValueOfContents: any) {
		const contentCardList: IConfigItem[] = Object.values(contentCards);
		contentCardList.filter(contentCard => contentCard.cardId !== 'welcome-text').forEach(contentCard => {
			let contents: any = this.cmsService.getOneCMSContent(response, contentCard.template, contentCard.positionParam, dataSource);
			if (contents && contents.length > 0) {
				if (contentCard.positionParam !== 'position-A') {
					contents = this.filterContentsByCondition(contents);
				}
				cacheValueOfContents[contentCard.cardId] = contents;
			}
		});
	}

	private async saveArticleIfNeed(articleId, lang, article) {
		if (!article) {
			return;
		}
		if (!this.isNeedCacheArticle(articleId)) {
			return;
		}
		await this.saveArticle(articleId, lang, article);
	}

	private isNeedCacheArticle(articleId) {
		for (const key of Object.keys(this.latestCachedContetns)) {
			if (this.isArticleExistInCache(this.latestCachedContetns[key], articleId)) {
				return true;
			}
		}
		return false;
	}

	private isArticleExistInCache(cachedContents, articleId) {
		for (const positionId of Object.keys(cachedContents)) {
			const contetnsOfPosition = cachedContents[positionId];
			if (!contetnsOfPosition || contetnsOfPosition.length === 0) {
				continue;
			}
			for (const i of Object.keys(contetnsOfPosition)) {
				const content = contetnsOfPosition[i];
				if (content.ActionType !== ContentActionType.Internal) {
					continue;
				}
				if (content.ActionLink === articleId) {
					return true;
				}
			}
		}
		return false;
	}

	private filterContentsByCondition(contents: any) {
		const result = [];
		for (let i = 0; i < contents.length; i++) {
			const content = contents[i];
			if (i === 0) {
				result.push(content);
				if (content.ExpirationDate == null) {
					return result;
				}
			}
			if (content.ExpirationDate == null) {
				result.push(content);
				return result;
			}
		}
	}

	private async getCachedArticle(articId: any, lang: any) {
		const key = `${articId}_${lang}`;
		const iCacheSettings: ICacheSettings = {
			Key: key,
			Value: null,
			Component: 'ContentCache',
			UserName: 'ContentCache_Articles'
		};
		const cachedObject = await this.contentLocalCacheContract.get(iCacheSettings);
		if (cachedObject && cachedObject.Value) {
			return JSON.parse(cachedObject.Value);
		}
		return undefined;
	}

	private formalizeContent(contents, cardId, dataSource?) {
		contents.forEach(content => {
			if (content.BrandName) {
				content.BrandName = content.BrandName.split('|')[0];
			}
			if (dataSource) {
				content.DataSource = dataSource;
			}
		});

		if (cardId === 'positionA') {
			return contents.map((record) => {
				return {
					albumId: 1,
					id: record.Id,
					source: record.Title,
					title: record.Description,
					url: record.FeatureImage,
					ActionLink: record.ActionLink,
					ActionType: record.ActionType,
					OverlayTheme: record.OverlayTheme ? record.OverlayTheme : '',
					DataSource: record.DataSource
				};
			});

		} else {
			return contents[0];
		}
	}

}

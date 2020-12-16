import Fuse  from 'fuse.js/dist/fuse';

export class SearchEngineWraper {
	private searchEngineImpl: any;
	constructor() { }

	public updateSearchContext(context: any []) {
		this.searchEngineImpl  = new Fuse(context, {
  			threshold: 0.4,
			keys: [
			  {
				name: 'featureName',
				weight: 1
			  },
			  {
				name: 'highRelevantKeywords',
				weight: 1
			  },
			  {
				name: 'lowRelevantKeywords',
				weight: 2
			  }
			]
		  });
	}

	public search(userInput: string) {
		// Change the pattern
		return this.searchEngineImpl.search(userInput);
	}
}

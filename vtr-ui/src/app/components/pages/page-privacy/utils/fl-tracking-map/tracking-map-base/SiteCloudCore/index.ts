import * as d3 from 'd3';

import {SiteNode, MapProps} from '..';
import {Site, Border} from './Site';
import {Transform2, VectorUtils, TransformUtils, Vector2} from '../Transform';
import {MText, TextStyle, defaultGlobalTextStyle} from '../Text';
import {defaultChartStyle} from '../ChartCore';

export interface SiteCloudProps {
	title: string;
	minSizePx: number;
	position: Vector2;
}

export interface SiteCloudStyle {
	title: TextStyle;
	transform: Transform2;

	border: any;
	borderSelected: any;
}

export const defaultSiteCloudStyle: SiteCloudStyle = {
	transform: {
		position: VectorUtils.ZeroVector(),
		scale: {
			x: 300,
			y: 300,
		}
	},

	title: {
		...defaultChartStyle.title,
		color: '#34495E'
	},

	border: {
		size: 1,
		color: '#C6D6E1'
	},

	borderSelected: {
		size: 2,
		color: '#FE5050'
	}
};

export class SiteCloudCore {

	sites: Site[];

	title: MText;

	style: SiteCloudStyle;

	protected _siteNodes: SiteNode[];
	protected _props: SiteCloudProps;

	constructor(siteNodes: SiteNode[], props: SiteCloudProps, style: SiteCloudStyle = {...defaultSiteCloudStyle}) {
		this._siteNodes = siteNodes;
		this._props = props;

		this.style = style;

		this.title = {
			text: this._props.title,
			transform: {
				position: {x: 0, y: '-40%'},
				scale: VectorUtils.ZeroVector(),
			},
			style: this.style.title,
		};

		this.style.transform.position = {
			x: -this.style.transform.scale.x as number / 2,
			y: -this.style.transform.scale.y as number / 2 + 60,
		};

		this._pack();
	}

	// Container position
	get globalTransform() {
		return TransformUtils.transformToString({
			position: this._props.position,
			scale: VectorUtils.ZeroVector()
		});
	}

	get transform() {
		return TransformUtils.transformToString(this.style.transform);
	}

	highlightSites(siteList: string[]) {
		this.sites.forEach(site => {
			const isInList = (siteList.indexOf(site.node.name) !== -1);

			site.opacity = (isInList) ? 1 : 0.1;
			site.setBorder((isInList) ? this.style.borderSelected : this.style.border);
		});
	}

	highlightAll() {
		this.sites.forEach(site => {
			site.opacity = 1;
			site.setBorder(this.style.border);
		});
	}

	protected _pack() {
		const pack = d3.pack()
			.size([this.style.transform.scale.x as number, this.style.transform.scale.y as number])
			.radius((d: any) => d.data.outerSize * this._props.minSizePx)
			.padding(-30);

		const sitesH = d3.hierarchy({children: this._siteNodes})
			.sum((d: any) => d.size)
			.sort((a: any, b: any) => b.size - a.size);

		this.sites = pack(sitesH).children.map(site => {
			const transform: Transform2 = {
				position: {x: site.x - site.r / 2, y: site.y - site.r / 2},
				scale: {x: site.r, y: site.r}
			};

			return new Site(site.data as SiteNode, transform, this.style.border, this._props);
		});
	}
}

import * as d3 from 'd3';

import {SiteNode, MapProps} from '../index';
import {Transform2, VectorUtils, TransformUtils} from '../Transform';
import {Logo} from '../Logo';
import {SiteCloudProps} from '.';

export interface Border {
	size: number;
	segments?: any[];
	color?: string;
}

export interface BorderSegment {
	color: string;
	value: number;
}

export class Site {

	node: SiteNode;

	opacity = 1;

	logo: Logo;

	transform: Transform2;

	border: Border;
	borderPaths: any;

	private _cloudProps: MapProps;

	constructor(node: SiteNode, transform: Transform2, border: Border, cloudProps: SiteCloudProps) {

		if (typeof node === 'undefined') {
			this.opacity = 0;
			this.transform = {
				position: VectorUtils.ZeroVector(),
				scale: VectorUtils.ZeroVector(),
			};

			this.border = {
				color: '',
				size: 0,
			};

			this.logo = new Logo('', this.transform, 0);
			return;
		}
		this.node = node;
		this._cloudProps = cloudProps;

		const pos = this.node.outerSize * this._cloudProps.minSizePx / 2;
		const logoTransform: Transform2 = {
			position: {x: pos, y: pos},
			scale: {x: this.node.size, y: this.node.size}
		};
		this.logo = new Logo(this.node.icon, logoTransform, this._cloudProps.minSizePx);

		this.transform = transform;

		this.setBorder(border);
	}

	get borderTransform() {
		if (typeof this.node === 'undefined') {
			return ``;
		}
		return `translate(${this.transform.scale.x as number / 2} ${this.transform.scale.x as number / 2})`;
	}

	setBorder(border: Border) {
		if (typeof this.node === 'undefined') {
			return;
		}
		this.border = {...border};
	}

	protected get _d3Pie() {
		return d3.pie()
			.value((d: any) => d.value)
			.sort((a: any, b: any) => {
				if (b.value < a.value) {
					return -1;
				}
				if (b.value > a.value) {
					return 1;
				}
				return 0;
			});
	}

	protected get _d3Arc() {
		return d3.arc()
			.innerRadius(this.transform.scale.x as number / 2 - this.border.size)
			.outerRadius(this.transform.scale.x as number / 2);
	}
}

export const Site_NULL = new Site(undefined, undefined, undefined, undefined);
// export const Site_NULL = {
//   transform: {
//     position: VectorUtils.ZeroVector(),
//     scale: VectorUtils.ZeroVector(),

//     opacity: 0,

//     logo: {
//       icon: '',

//       position: VectorUtils.ZeroVector(),
//       scale: VectorUtils.ZeroVector(),
//     },

//     Border: {
//       color: '',
//       size: 0,
//     }
//   }
// }

import {trigger, state, style, transition, animate, keyframes, sequence, stagger, query} from '@angular/animations';

export const animations = [
	trigger('mState', [

		state('visible', style({})),

		transition('* => visible', [
			query(
				'.fl-site, .fl-tracker, .fl-data-line, .fl-tracker-chart-background, .fl-tracker-chart-circles',
				style({opacity: 0}),
				{optional: true}
			),

			query(
				'.fl-site-cloud',
				style({transform: 'translate(250px)'}),
				{optional: true}
			),

			query(
				'.fl-site',

				stagger('50ms', [
					animate('250ms', style({opacity: 1}))
				]),

				{optional: true}
			),

			query(
				'.fl-site-cloud',
				animate('250ms ease-out', style({transform: 'translate(0px)'})),
				{optional: true}
			),

			query(
				'.fl-data-line, .fl-tracker-chart-circles',
				animate('250ms ease-out', style({opacity: 1})),
				{optional: true}
			),

			query(
				'.fl-tracker',

				stagger('50ms', [
					animate('250ms', style({opacity: 1}))
				]),

				{optional: true}
			),

			query(
				'.fl-tracker-chart-background',
				animate('250ms ease-out', style({opacity: 1})),
				{optional: true}
			),
		])

	])
];

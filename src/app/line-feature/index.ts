import { once } from 'lodash';
import {
	FeatureNodeStatusEnum,
	FeatureNodeTypeEnum,
	LongLog,
	LongLogContainer,
} from './log-container';

type FeatureNodeInView = {
	nodeName: string;
	nodeType: FeatureNodeTypeEnum;
	nodeDescription?: string;
};
/**
 * Annotate Functions to get metrics
 *
 * @param decoArgs
 * @returns
 * Example: @lineFeature({
		featureName: 'use-case-1' or ['use-case-1', 'use-case-2']
		node: {
			nodeName: 'middleF1',
			nodeType: FeatureNodeTypeEnum.start,
		},
	})
 */
export const lineFeature = (decoArgs: {
	featureName: string | string[];
	node: FeatureNodeInView;
}) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
	const originalMethod = descriptor.value;

	descriptor.value = function (...args: any[]) {
		const { node: curNode, featureName } = decoArgs;
		const outLineZone = initOutLineZone((zoneNodeInfo) => {
			featureLogContainer.addLogs([
				new LongLog({
					...curNode,
					featureName,
					error: zoneNodeInfo.error,
					spendTime: zoneNodeInfo.spendTime,
					nodeStatus: !!zoneNodeInfo.error
						? FeatureNodeStatusEnum.fail
						: FeatureNodeStatusEnum.success,
				}),
			]);
		});

		let result: Promise<unknown> | undefined;
		if (outLineZone) {
			outLineZone.runGuarded(
				function () {
					// @ts-ignore
					result = originalMethod.apply(this, arguments);
					return result;
				},
				this,
				args,
				'outLineZoneRoot'
			);
		} else {
			result = originalMethod.apply(this, args);
		}
		return result;
	};
};

export const featureLogContainer = new LongLogContainer();

interface ZoneNodeInfo {
	spendTime: number;
	error?: Error;
	hasTaskState?: HasTaskState;
}

const initOutLineZone = (onFinish: (params: ZoneNodeInfo) => void): Zone | null => {
	// Current Zone is the parent, whatever what the parent it is
	let firstCallRes: any;
	let isAsync: boolean;

	// From ZoneAwarePromise
	const Zone_symbol_prefix = '__zone_symbol__';
	const UNRESOLVED = null;
	const RESOLVED = true;
	const REJECTED = false;
	const REJECTED_NO_CATCH = 0;
	const symbolPromiseState = Zone_symbol_prefix + 'state';

	const startTime = performance.now();
	let spendTime: number;
	const onFinishCall = once(
		({ error, hasTaskState }: { error?: Error; hasTaskState?: HasTaskState }) => {
			const endTime = performance.now();
			spendTime = endTime - startTime;
			// if( hasTaskState?.microTask  || hasTaskState?.eventTask || hasTaskState?.microTask ){
			//   // there is some tasks running in background
			// }
			onFinish({
				spendTime,
				error,
				hasTaskState,
			});
			// todo destroy?
		}
	);

	const innerZone = Zone.current.fork({
		name: 'myOuterNg',
		onInvoke: (
			parentZoneDelegate: ZoneDelegate,
			currentZone: Zone,
			targetZone: Zone,
			delegate: () => void,
			applyThis: any,
			applyArgs?: any[],
			source?: string
		) => {
			const res: unknown = parentZoneDelegate.invoke(
				targetZone,
				delegate,
				applyThis,
				applyArgs,
				source
			);
			if (source === 'outLineZoneRoot') {
				firstCallRes = res;
				isAsync =
					firstCallRes instanceof Promise &&
					// @ts-ignore
					firstCallRes[symbolPromiseState] === UNRESOLVED;
				if (!isAsync) {
					setTimeout(() => {
						onFinishCall({});
					});
				}
			}

			return res;
		},
		onHasTask: (delegate, curr, target, hasTaskState) => {
			if (isAsync && firstCallRes[symbolPromiseState] === RESOLVED) {
				onFinishCall({
					hasTaskState,
				});
			}
			return delegate.hasTask(target, hasTaskState);
		},
		onHandleError: (
			parentZoneDelegate: ZoneDelegate,
			currentZone: Zone,
			targetZone: Zone,
			error: any
		) => {
			const res = parentZoneDelegate.handleError(targetZone, error);
			// get new error
			onFinishCall({
				error,
			});
			return res;
		},
	});
	return innerZone;
};

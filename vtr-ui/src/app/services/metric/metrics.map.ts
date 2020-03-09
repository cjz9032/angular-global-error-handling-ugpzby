
import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';
import { FeatureClick, ArticleClick, SettingUpdate } from './metrics.model';


// Please add your eventId and metric type in the interface so that the static analysis tool can help you to check if you missing anything
interface MetricsMap {
	closeFeedbackEvent: FeatureClick;
	giveFeedbackEvent: FeatureClick;
}

// if ItemParent is not provided, it would be filled with the pageName of the route
export const metricsMap: MetricsMap = {
	closeFeedbackEvent: {
		ItemType: EventName.FeatureClick,
		ItemName: 'btn.close',
		ItemParent: 'Dialog.Feedback'
	},
	giveFeedbackEvent: {
		ItemType: EventName.FeatureClick,
		ItemName: 'btn.givefeedback',
		ItemParent: ''
	}
};

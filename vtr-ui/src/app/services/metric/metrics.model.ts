import { MetricEventName as EventName } from 'src/app/enums/metrics.enum';

export interface MetricsData {
	ItemType: string;
	ItemName?: string;
	ItemParent?: string;
	ItemParm?: string;
	ItemValue?: any;
	viewOrder?: number;
	ItemID?: string;
	ItemCategory?: string;
	ItemPosition?: string;
	PageNumber?: string;
	SettingParent?: string;
	SettingName?: string;
	SettingValue?: string;
	SettingParm?: string;
}

export class IMetricEvent {
	public ItemType: string;
}

export class FirstRun extends IMetricEvent {
	constructor(IsGaming: boolean) {
		super();
		this.ItemType = EventName.firstrun;
		this.IsGaming = IsGaming;
	}
	public IsGaming: boolean;
}

export class AppLoaded extends IMetricEvent {
	constructor(durationForWeb) {
		super();
		this.ItemType = EventName.apploaded;
		this.DurationForWeb = Math.round(durationForWeb);
	}

	public DurationForWeb: number;
	public DurationActivatePage: number;
	public TargePage: string;
}

export class ArticleDisplay extends IMetricEvent {
	constructor(itemParm, itemValue, isUPE) {
		super();
		this.ItemType = EventName.articlecisplay;
		this.ItemParm = itemParm;
		this.ItemValue = itemValue;
		this.UPE = isUPE;
	}

	public ItemParm: string;
	public ItemValue: any;
	public UPE: boolean;
}

export class AppAction extends IMetricEvent {
	constructor(
		actionType: string,
		launchParms: string,
		launchType: string,
		duration: number,
		durationBlur: number
	) {
		super();
		this.ItemType = EventName.appaction;
		this.ActionType = actionType;
		this.LaunchType = launchType;
		this.LaunchParms = launchParms;
		this.Duration = duration;
		this.DurationBlur = durationBlur;
	}
	public ActionType: string;
	public LaunchType: string;
	public LaunchParms: string;
	public Duration: number;
	public DurationBlur: number;
}

export class GetEnvInfo extends IMetricEvent {
	constructor(source: {
		imcVersion;
		srvVersion;
		shellVersion;
		windowSize;
		displaySize;
		scalingSize;
		isFirstLaunch;
	}) {
		super();
		this.ItemType = EventName.getenvInfo;
		this.ImcVersion = source.imcVersion;
		this.SrvVersion = source.srvVersion;
		this.ShellVersion = source.shellVersion;
		this.WindowSize = source.windowSize;
		this.DisplaySize = source.displaySize;
		this.ScalingSize = source.scalingSize;
		this.IsFirstLaunch = source.isFirstLaunch;
	}

	public ImcVersion: string;
	public SrvVersion: string;
	public ShellVersion: string;
	public WindowSize: string;
	public DisplaySize: string;
	public ScalingSize: string;
	public IsFirstLaunch: string;
}

export class PageView extends IMetricEvent {
	constructor(
		pageName: string,
		duration: number,
		durationBlur: number,
		pageContext: string = null
	) {
		super();
		this.ItemType = EventName.pageview;
		this.PageName = pageName;
		this.PageContext = pageContext;
		this.PageDuration = duration;
		this.PageDurationBlur = durationBlur;
	}
	public PageName: string;
	public PageContext: string;
	public PageDuration: number;
	public PageDurationBlur: number;
}

export class FeatureClick extends IMetricEvent {
	constructor(itemName, itemParent, itemValue?, itemParm?) {
		super();
		this.ItemType = EventName.featureclick;
		this.ItemName = itemName;
		this.ItemParent = itemParent;
		this.ItemValue = itemValue;
		this.ItemParm = itemParm;
	}

	public ItemName: string;
	public ItemParent: string;
	public ItemValue?: any;
	public ItemParm?: string;
}

export class ItemView extends IMetricEvent {
	constructor(itemName, itemParent, itemValue = null, itemParm = null) {
		super();
		this.ItemType = EventName.itemview;
		this.ItemName = itemName;
		this.ItemParent = itemParent;
	}

	public ItemName: string;
	public ItemParent: string;
}

export class ArticleClick extends IMetricEvent {
	constructor(
		itemID,
		itemParm,
		itemParent,
		itemCategory,
		itemPosition,
		viewOrder: number,
		pageNumber: any
	) {
		super();
		this.ItemType = EventName.articleclick;
		this.ItemID = itemID;
		this.ItemParm = itemParm;
		this.ItemParent = itemParent;
		this.ItemCategory = itemCategory;
		this.ItemPosition = itemPosition;
		this.viewOrder = viewOrder;
		this.PageNumber = pageNumber;
	}

	public ItemID: string;
	public ItemParm: string;
	public ItemParent: string;
	public ItemCategory: string;
	public ItemPosition: string;
	public viewOrder: number;
	public PageNumber: any;
	public ItemName?;
}

export class ArticleView extends IMetricEvent {
	constructor(
		itemID,
		itemParent,
		itemCategory,
		duration: number,
		docReadPosition: number,
		mediaReadPosition: number
	) {
		super();
		this.ItemType = EventName.articleview;
		this.ItemID = itemID;
		this.ItemParent = itemParent;
		this.ItemCategory = itemCategory;
		this.Duration = duration;
		this.DocReadPosition = docReadPosition;
		this.MediaReadPosition = mediaReadPosition;
	}

	public ItemID: string;
	public ItemParent: string;
	public ItemCategory: string;
	public Duration: number;
	public DurationBlur: number;
	public DocReadPosition: number;
	public MediaReadPosition: number;
}

export class TaskAction extends IMetricEvent {
	constructor(
		taskName: string,
		taskCount: number,
		taskParm: string,
		taskResult: string,
		taskDuration: number
	) {
		super();
		this.ItemType = EventName.taskaction;
		this.TaskName = taskName;
		this.TaskCount = taskCount;
		this.TaskParm = taskParm;
		this.TaskResult = taskResult;
		this.TaskDuration = taskDuration;
	}
	public TaskName: string;
	public TaskCount: number;
	public TaskParm: string;
	public TaskResult: string;
	public TaskDuration: number;
}

export class SettingUpdate extends IMetricEvent {
	constructor(settingName, settingValue, settingParm, settingParent) {
		super();
		this.ItemType = EventName.settingupdate;
		this.SettingName = settingName;
		this.SettingValue = settingValue;
		this.SettingParm = settingParm;
		this.SettingParent = settingParent;
	}

	public SettingName: string;
	public SettingValue: any;
	public SettingParm?: string;
	public SettingParent: string;
}

export class UserFeedback extends IMetricEvent {
	constructor(
		itemName,
		userEmail,
		itemParent,
		content,
		qaNewStyle: number,
		qaPerformance: string,
		qaUseFrequency: string
	) {
		super();
		this.ItemType = EventName.userfeedback;
		this.ItemName = itemName;
		this.UserEmail = userEmail;
		this.ItemParent = itemParent;
		this.Content = content;
		this.QA = {
			QaNewStyle: qaNewStyle,
			QaPerformance: qaPerformance,
			QaUseFrequency: qaUseFrequency,
		};
	}
	public ItemName: string;
	public UserEmail: number;
	public ItemParent: string;
	public Content: string;
	public QA: any;
}

export class ContentDisplay extends IMetricEvent {
	constructor() {
		super();
		this.ItemType = EventName.contentdisplay;
	}
	public ItemID: string;
	public ItemParent: string;
	public Position: string;
	public DataSource: string;
}

export class NetworkPerformance extends IMetricEvent {
	constructor() {
		super();
		this.ItemType = EventName.performance;
	}

	public Host: string;
	public Api: string;
	public Duration: number;
}

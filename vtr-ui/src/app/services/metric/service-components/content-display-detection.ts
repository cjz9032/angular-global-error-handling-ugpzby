export class ContentDisplayDetection {
	private taskId = 0;
	private taskTable = {};
	private itemGroupTable = {};

	constructor(
		private metricsService: any
	) {
		window.addEventListener('resize', this.checkAll.bind(this));
	}

	public onScrollEvent() {
		this.checkAll();
	}

	public addTask(item, container, position) {
		this.taskId += 1;
		const taskId = this.taskId;

		const taskItem = {
			status : {
				top: false,
				right: false,
				bottom: false,
				left: false
			},
			item,
			container,
			position,
			complete: false
		};

		this.taskTable[taskId] = taskItem;

		if (item.Id) {	// igore item arrays which exist in the dashboard carousel image group
			if (!this.itemGroupTable[item.Id]) {
				this.itemGroupTable[item.Id] = [taskItem];
			} else {
				this.itemGroupTable[item.Id].push(taskItem);
			}
		}

		setTimeout(() => {
			this.checkVisiblityStatus(taskId);
		}, 0);

		return taskId;
	}

	public removeTask(taskId) {
		if (this.taskTable[taskId]) {
			delete this.taskTable[taskId];
		}
	}

	private checkAll() {
		const taskIds = Object.keys(this.taskTable);
		taskIds.forEach(taskId => {
			this.checkVisiblityStatus(taskId);
		});
	}

	public cleanTask() {
		this.taskTable = {};
		this.itemGroupTable = [];
	}

	private removeDuplicateTask(taskId) {
		if (!this.taskTable[taskId]) {
			return;
		}

		const itemId = this.taskTable[taskId].item.Id;

		delete this.taskTable[taskId];

		if (!itemId || !this.itemGroupTable[itemId]) {
			return;
		}

		const itemGroups = this.itemGroupTable[itemId];
		itemGroups.forEach(taskItem => {
			taskItem.complete = true;			// checkVisiblityStatus will clean the complete task
		});
		delete this.itemGroupTable[itemId];
	}

	private checkVisiblityStatus(taskId) {
		const taskContext = this.taskTable[taskId];
		if (!taskContext || !taskContext.container) {
			return;
		}

		if (taskContext.complete) {
			this.removeTask(taskId);
			return;
		}

		let contentCard;
		if (typeof taskContext.container === 'function') {
			contentCard = taskContext.container();
		} else {
			contentCard = taskContext.container;
		}

		if (contentCard.nativeElement.offsetHeight === 0) {
			return;
		}

		let position; // it is not critial property
		if (typeof taskContext.position === 'function') {
			position = taskContext.position();
		} else {
			position = taskContext.position;
		}

		if (!contentCard) {
			return;
		}

		const rec = contentCard.nativeElement.getBoundingClientRect();
		const vp = {
			width: window.innerWidth,
			height: window.innerHeight
		};

		if (!taskContext.status.top) {
			taskContext.status.top = rec.top >= 0 && rec.top < vp.height;
		}

		if (!taskContext.status.bottom) {
			taskContext.status.bottom = rec.bottom > 0 && rec.bottom <= vp.height;
		}

		if (!taskContext.status.left) {
			taskContext.status.left = rec.left >= 0 && rec.left < vp.width;
		}

		if (!taskContext.status.right) {
			taskContext.status.right = rec.right > 0 && rec.right <= vp.width;
		}

		if ( taskContext.status.top && taskContext.status.bottom && taskContext.status.left && taskContext.status.right) {
				if (Array.isArray(taskContext.item)) {
					taskContext.item.forEach(item => {
						this.metricsService.sendContentDisplay(item.Id, item.DataSource, position);
					});
				} else {
					this.metricsService.sendContentDisplay(taskContext.item.Id, taskContext.item.DataSource, position);
				}
				this.removeDuplicateTask(taskId);
		}
	}
}

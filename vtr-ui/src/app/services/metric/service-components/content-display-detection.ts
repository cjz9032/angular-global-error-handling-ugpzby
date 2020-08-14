export class ContentDisplayDetection {
	private taskId = 0;
	private taskTable = {};

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
		this.taskTable[taskId] = {
			status : {
				top: false,
				right: false,
				bottom: false,
				left: false
			},
			item,
			container,
			position
		};

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

	private checkVisiblityStatus(taskId) {
		const taskContext = this.taskTable[taskId];
		if (!taskContext || !taskContext.container || taskContext.status.complete) {
			return;
		}

		const rec = taskContext.container.nativeElement.getBoundingClientRect();
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
				taskContext.status.complete = true;
				if (Array.isArray(taskContext.item)) {
					taskContext.item.forEach(item => {
						this.metricsService.sendContentDisplay(item.Id, item.DataSource, taskContext.position);
					});
				} else {
					this.metricsService.sendContentDisplay(taskContext.item.Id, taskContext.item.DataSource, taskContext.position);

				}
				this.removeTask(taskId);
		}
	}
}

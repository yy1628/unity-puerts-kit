import ResKeeper from "common/res/res-keeper";
import { Director } from "../sys/director";
import { ISchedulable, Scheduler } from "../sys/scheduler";
import { macro } from "../utils/macro";

export class UIComponent extends ResKeeper implements ISchedulable {
	public id: string = null;

	private _scheduler: Scheduler = null;
	constructor() {
		super();

		this._scheduler = Director.inst.getScheduler();
		Scheduler.enableForTarget(this);
	}

	/**
	 * @en
	 * Use Scheduler system to schedule a custom task.<br/>
	 * If the task is already scheduled, then the interval parameter will be updated without scheduling it again.
	 * @zh
	 * 使用定时器系统调度一个自定义的回调任务。<br/>
	 * 如果回调任务已调度，那么将不会重复调度它，只会更新时间间隔参数。
	 * @param callback  The callback function of the task
	 * @param interval  The time interval between each invocation
	 * @param repeat    The repeat count of this task, the task will be invoked (repeat + 1) times, use [[macro.REPEAT_FOREVER]] to repeat a task forever
	 * @param delay     The delay time for the first invocation, Unit: s
	 * @example
	 * ```ts
	 * import { log } from 'cc';
	 * this.schedule((dt) => void log(`time: ${dt}`), 1);
	 * ```
	 */
	public schedule(
		callback: (dt: number) => void,
		interval = 0,
		repeat: number = macro.REPEAT_FOREVER,
		delay = 0
	) {
		interval = interval || 0;

		repeat = Number.isNaN(repeat) ? macro.REPEAT_FOREVER : repeat;
		delay = delay || 0;

		const scheduler = this._scheduler;

		// should not use enabledInHierarchy to judge whether paused,
		// because enabledInHierarchy is assigned after onEnable.
		// Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
		// therefore there is no way to guarantee the paused state other than isTargetPaused.
		const paused = scheduler.isTargetPaused(this);

		scheduler.schedule(callback, this, interval, repeat, delay, paused);
	}

	/**
	 * @en Use Scheduler system to schedule a task that runs only once, with a delay of 0 or larger.
	 * @zh 使用定时器系统调度一个只运行一次的回调任务，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
	 * @method scheduleOnce
	 * @see [[schedule]]
	 * @param callback  The callback function of the task
	 * @param delay  The delay time for the first invocation, Unit: s
	 * @example
	 * ```ts
	 * import { log } from 'cc';
	 * this.scheduleOnce((dt) => void log(`time: ${dt}`), 2);
	 * ```
	 */
	public scheduleOnce(callback: (dt: number) => void, delay = 0) {
		this.schedule(callback, 0, 0, delay);
	}

	/**
	 * @en Un-schedules a custom task.
	 * @zh 取消调度一个自定义的回调任务。
	 * @param callback_fn  The callback function of the task
	 * @example
	 * ```ts
	 * this.unschedule(_callback);
	 * ```
	 */
	public unschedule(callback_fn: (dt: number) => void) {
		if (!callback_fn) {
			return;
		}

		this._scheduler.unschedule(callback_fn, this);
	}

	/**
	 * @en unschedule all scheduled tasks.
	 * @zh 取消调度所有已调度的回调函数。
	 * @example
	 * ```ts
	 * this.unscheduleAllCallbacks();
	 * ```
	 */
	public unscheduleAllCallbacks() {
		this._scheduler.unscheduleAllForTarget(this);
	}

	/* 重新实现update函数，目的是减少 TS 与 C# 间的互调，尽量不要再TS层调用UnityEngine.MonoBehaviour.Update */
	/**
	 * @en Update is called every frame, if the Component is enabled.<br/>
	 * This is a lifecycle method. It may not be implemented in the super class.<br/>
	 * You can only call its super class method inside it. It should not be called manually elsewhere.
	 * @zh 如果该组件启用，则每帧调用 update。<br/>
	 * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
	 * @param dt - the delta time in seconds it took to complete the last frame
	 */
	protected update?(dt: number): void;

	/**
	 * @en LateUpdate is called every frame, if the Component is enabled.<br/>
	 * This is a lifecycle method. It may not be implemented in the super class.<br/>
	 * You can only call its super class method inside it. It should not be called manually elsewhere.
	 * @zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
	 * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
	 * @param dt - the delta time in seconds it took to complete the last frame
	 */
	protected lateUpdate?(dt: number): void;

	/**
	 * @zh 关闭页面时，资源回收
	 */
	protected destroy () {
		this.releaseAutoRes();
	}
}

/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { UIManager } from "../ui/ui-manager";
import { Scheduler } from "./scheduler";
import { EventTarget } from "../event";

/* spell-checker:words COORD, Quesada, INITED, Renerer */

/**
 * @en
 * ATTENTION: USE `director` INSTEAD OF `Director`.
 * `director` is a singleton object which manage your game's logic flow.
 * Since the `director` is a singleton, you don't need to call any constructor or create functions,
 * the standard way to use it is by calling:
 * `director.methodName();`
 * It creates and handle the main Window and manages how and when to execute the Scenes.
 *
 * @zh
 * 注意：用 `director` 代替 `Director`。
 * `director` 一个管理你的游戏的逻辑流程的单例对象。
 * 由于 `director` 是一个单例，你不需要调用任何构造函数或创建函数，
 * 使用它的标准方法是通过调用：
 * `director.methodName();`
 * 它创建和处理主窗口并且管理什么时候执行场景。
 */
export class Director extends EventTarget {
	public static inst: Director;

	private _invalid: boolean;
	private _paused: boolean;
	private _deltaTime: number;
	private _totalTime: number;
	private _frameStartTime: number;
	private _totalFrames: number;
	private _scheduler: Scheduler;
	private _ui: UIManager;

	constructor() {
		super();

		this._invalid = false;
		// paused?
		this._paused = false;

		// deltaTime
		this._deltaTime = 0;
		this._totalTime = 0;
		this._frameStartTime = 0;

		// FPS
		this._totalFrames = 0;

		// Scheduler for user registration update
		this._scheduler = new Scheduler();

		this._ui = UIManager.inst;
	}

	/**
	 * @en Pause the director's ticker, only involve the game logic execution.<br>
	 * It won't pause the rendering process nor the event manager.<br>
	 * If you want to pause the entire game including rendering, audio and event,<br>
	 * please use `game.pause`.
	 * @zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。<br>
	 * 如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 `game.pause` 。
	 */
	public pause() {
		if (this._paused) {
			return;
		}
		this._paused = true;
	}

	/**
	 * @en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
	 * @zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。
	 */
	public resume() {
		if (!this._paused) {
			return;
		}
		this._paused = false;
	}

	/**
	 * @en Returns the delta time since last frame.
	 * @zh 获取上一帧的增量时间。
	 * @deprecated since v3.3.0, please use game.deltaTime instead
	 */
	public getDeltaTime() {
		return this._deltaTime;
	}

	/**
	 * @en Returns the total passed time since game start, unit: ms
	 * @zh 获取从游戏开始到现在总共经过的时间，单位为 ms
	 * @deprecated since v3.3.0, please use game.totalTime instead
	 */
	public getTotalTime() {
		return this._totalTime;
	}

	/**
	 * @en Returns the current time.
	 * @zh 获取当前帧的时间。
	 * @deprecated since v3.3.0, please use game.frameStartTime instead
	 */
	public getCurrentTime() {
		return this._frameStartTime;
	}

	/**
	 * @en Returns how many frames were called since the director started.
	 * @zh 获取 director 启动以来游戏运行的总帧数。
	 */
	public getTotalFrames() {
		return this._totalFrames;
	}

	/**
	 * @en Returns the frames per second.
	 * @zh 获取每秒帧数
	 */
	public getFrames() {
		return 1 / this._deltaTime;
	}

	/**
	 * @en Returns whether or not the Director is paused.
	 * @zh 是否处于暂停状态。
	 */
	public isPaused() {
		return this._paused;
	}

	/**
	 * @en Returns the scheduler associated with this director.
	 * @zh 获取和 director 相关联的调度器。
	 */
	public getScheduler() {
		return this._scheduler;
	}

	// Loop management
	/**
	 * @en Starts the director
	 * @zh 开始执行游戏逻辑
	 */
	public startAnimation() {
		this._invalid = false;
	}

	/**
	 * @en Stops the director
	 * @zh 停止执行游戏逻辑，每帧渲染会继续执行
	 */
	public stopAnimation() {
		this._invalid = true;
	}
	
	/**
	 * @en Run main loop of director
	 * @zh 运行主循环
	 * @param dt Delta time in seconds
	 */
	public tick(dt: number) {
		/* 重新实现update函数，目的是减少 TS 与 C# 间的互调，尽量不要再TS层调用UnityEngine.MonoBehaviour.Update */
		if (!this._invalid) {
			this._deltaTime = this._frameStartTime;
			this._frameStartTime = dt;
			// this.emit(Director.EVENT_BEGIN_FRAME);
			// Update
			if (!this._paused) {
				/** Update for UIBases */
				this._ui.update(dt);
				/** Update scheduler */
				this._scheduler.update(dt);
				/** LateUpdate for UIBases */
				this._ui.lateUpdate(dt);
			}
			// this.emit(Director.EVENT_END_FRAME);
			this._totalTime += dt;
			this._totalFrames++;
		}
	}
}

/**
 * @en Director of the game, used to control game update loop and scene management
 * @zh 游戏的导演，用于控制游戏更新循环与场景管理。
 */
Director.inst = new Director();

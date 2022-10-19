/*
 * @Author: yuanyuan
 * @Date: 2022-08-05 10:21:55
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-25 16:42:15
 * @FilePath: \unity-puerts-kit\src\common\sys\system.ts
 * @Description: 
 */
/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ISchedulable } from './scheduler';

enum Priority {
	LOW = 0,
	MEDIUM = 100,
	HIGH = 200,
	SCHEDULER = (1 << 31) >>> 0,
}
/**
 * @en Base class for all functional system managed by [[Director]].
 * @zh 功能系统的基类，由 [[Director]] 管理。
 */
export default class System implements ISchedulable {
	static Priority = Priority;


    protected _id = '';
    protected _priority = 0;
    protected _executeInEditMode = false;

    set priority (value:number) {
        this._priority = value;
    }
    get priority ():number {
        return this._priority;
    }

    set id (id:string) {
        this._id = id;
    }
    get id ():string {
        return this._id;
    }

    /**
     * @en Sorting between different systems.
     * @zh 不同系统间排序。
     * @param a System a
     * @param b System b
     */
    public static sortByPriority (a:System, b:System) {
        if (a._priority < b._priority) {
            return 1;
        } else if (a._priority > b.priority) {
            return -1;
        } else {
            return 0;
        }
    }
    
    /**
     * @en Update function of the system, it will be invoked between all components update phase and late update phase.
     * @zh 系统的帧更新函数，它会在所有组件的 update 和 lateUpdate 之间被调用
     * @param dt Delta time after the last frame
     */
    update (dt: number) {}
    /**
     * @en Post update function of the system, it will be invoked after all components late update phase and before the rendering process.
     * @zh 系统的帧后处理函数，它会在所有组件的 lateUpdate 之后以及渲染之前被调用
     * @param dt Delta time after the last frame
     */
    postUpdate (dt: number) {}
}

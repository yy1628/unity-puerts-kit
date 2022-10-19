import * as utils from "./utils";
import { Singleton } from "./singleton";
import { Director } from "./sys/director";
import { EventTarget } from "./event";
import { LocalStorage } from "./storage/local-storage";
import { UIManager } from "./ui/ui-manager";

export { utils };

/**
 * @en Director of the game, used to control game update loop
 * @zh 游戏的导演，用于控制游戏更新循环。
 */
export const director = Director.inst;

/**
 * @en
 * @zh UI管理器
 */
export const UI = UIManager.inst;


/**
 * @en
 * EventTarget is an object to which an event is dispatched when something has occurred.
 * [[Node]]s are the most common event targets, but other objects can be event targets too.
 * If a class cannot extend from EventTarget, it can consider using [[Eventify]].
 *
 * @zh
 * 事件目标是具有注册监听器、派发事件能力的类，[[Node]] 是最常见的事件目标，
 * 但是其他类也可以继承自事件目标以获得管理监听器和派发事件的能力。
 * 如果无法继承自 EventTarget，也可以使用 [[Eventify]]
 */
class EventMgr extends Singleton<EventTarget>() {}
export const EVENT = EventMgr.inst;


/**
 * LocalStorage扩展类
 * 本类定位是解决LocalStorage的使用过程中分别保存全局数据和帐号绑定数据分开保存的问题
 * 使用说明：
 * 1、在游戏初始化完成并获取到帐号数据以后，应首先调用setHashID将帐号或者openid初始化
 * 2、如需保存为全局数据并多帐号通用的需要在在调用setItem时将isGlobal设置为true
 * 3、如需保存为帐号绑定数据则在setItem时将isGlobal设置为false或者忽略该参数。
 */
 class LocalMgr extends Singleton<LocalStorage>() {}
export const LOCAL = LocalMgr.inst;
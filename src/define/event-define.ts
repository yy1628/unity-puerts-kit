/*
 * @Description: 事件ID定义
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:31:22
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-10 14:49:47
 */

export const EventId = {
	/** 切换场景 */
	CHANGE_SCENE: "EventId.CHANGE_SCENE",

	/** 屏幕朝向改变 */
	ON_ORIENTATION_CHANGE: "EventId.ON_ORIENTATION_CHANGE",

	/** UI打开事件 */
	ON_UI_OPEN: "EventId.EVENT_ON_UI_OPEN",

	/** UI打开失败 */
	ON_UI_OPEN_FAIL: "EventId.ON_UI_OPEN_FAIL",

	/** UI关闭事件 */
	ON_UI_CLOSE: "EventId.EVENT_ON_UI_CLOSE",

	/** 登录返回 */
	ON_LOGIN_RET: "EventId.ON_LOGIN_RET",

	/** 更新loading进度 */
	ON_UPDATE_LOADING_PROGRESS: "EventId.ON_UPDATE_LOADING_PROGRESS",
	ON_UPDATE_LOADING_END: "EventId.ON_UPDATE_LOADING_END",

	/** 更新loading tip */
	ON_UPDATE_LOADING_TTP: "EventId.ON_UPDATE_LOADING_TTP",

	/** 刷新道具数 */
	ON_REFUSH_ITEM_NUM: "ON_REFUSH_ITEM_NUM",

	/** 刷新任务*/
	ON_REFUSH_TASK: "ON_REFUSH_TASK",

	/** 游戏暂停 */
	ON_GAME_PAUSE: "ON_GAME_PAUSE",
	/** 游戏恢复 */
	ON_GAME_RESUME: "ON_GAME_RESUME",
	/** 游戏开始 */
	ON_GAME_START: "ON_GAME_START",
	/** 游戏结束 */
	ON_GAME_OVER: "ON_GAME_OVER",
	/** 游戏准备阶段开始 */
	ON_GAME_READY_START: "ON_GAME_READY_START",
	/** 游戏准备阶段结束 */
	ON_GAME_READY_END: "ON_GAME_READY_END",
	/** 游戏回合开始 */
	ON_GAME_ROUND_START: "ON_GAME_ROUND_START",
	/** 游戏回合结束 */
	ON_GAME_ROUND_END: "ON_GAME_ROUND_END",

	/** 得分 */
	ON_ADD_SCORE: "ON_GAME_ADD_SCORE",
	/** 奖券 */
	ON_ADD_REWARD: "ON_ADD_REWARD",

	ON_PUT_ITEM: "ON_GAME_ADD_SCORE",

	/** 人物攻击 */
	ON_PLAYER_ON_ATK: "ON_PLAYER_ON_ATK",
	/** 人物受到攻击 */
	ON_PLAYER_ON_HIT: "ON_PLAYER_ON_HIT",
	/** 人物指令 */
	ON_PLAYER_ON_COMMAND: "ON_PLAYER_ON_COMMAND",
	/** 获得加速 */
	ON_PLAYER_ON_SPEED_UP: "ON_PLAYER_ON_SPEED_UP",
	/** 人物离开弯道 */
	ON_PLAYER_ON_DIRECTION_END: "ON_PLAYER_ON_COMMAND_END",
	/** 人物击碎路障 */
	ON_PLAYER_ON_BARRIER_END: "ON_PLAYER_ON_BARRIER_END",
	/** 人物移动到路块 */
	ON_PLAYER_ON_ROAD: "ON_PLAYER_ON_ROAD",
	/** 人物死亡 */
	ON_PLAYER_ON_DEAD: "ON_PLAYER_ON_DEAD",
	/** 人物死亡动画结束 */
	ON_PLAYER_ON_DEAD_ANI_END: "ON_PLAYER_ON_DEAD_ANI_END",
	/** 人物复活 */
	ON_PLAYER_ON_REVIVE: "ON_PLAYER_ON_REVIVE",
	/** 人物切换状态 */
	ON_PLAYER_SWITCH_STATE: "ON_PLAYER_SWITCH_STATE",
	/** 人物速度归零 */
	ON_PLAYER_ON_ZERO: "ON_PLAYER_ON_ZERO",
};

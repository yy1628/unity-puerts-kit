/*
 * @Author: yuanyuan
 * @Date: 2022-08-04 17:27:42
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-09 15:32:57
 * @FilePath: \unity-puerts-kit\src\common\storage\local-storage.ts
 * @Description:
 */

import { UnityEngine } from "csharp";

/**
 * LocalStorage扩展类
 * 本类定位是解决LocalStorage的使用过程中分别保存全局数据和帐号绑定数据分开保存的问题
 * 使用说明：
 * 1、在游戏初始化完成并获取到帐号数据以后，应首先调用setHashID将帐号或者openid初始化
 * 2、如需保存为全局数据并多帐号通用的需要在在调用setItem时将isGlobal设置为true
 * 3、如需保存为帐号绑定数据则在setItem时将isGlobal设置为false或者忽略该参数。
 */
export class LocalStorage {
	private hashID: string;

	/**
	 * 设置openid或者帐号id
	 * @param  {string} openid
	 */
	public setHashID(openid: string): void {
		this.hashID = openid;
		this.setItem("hashID", openid, true);
	}

	/**
	 * 返回openid或者帐号id
	 * @return string
	 */
	public getHashID(): string {
		return this.getItem("hashID", true);
	}

	/**
	 * 保存数据
	 * @param  {string} key 数据key
	 * @param  {string} value   数据
	 * @param  {boolean=false} isGlobal 是否全局保存
	 */
	public setItem(
		key: string,
		value: string,
		isGlobal: boolean = false
	): void {
		if (isGlobal) {
			UnityEngine.PlayerPrefs.SetString(key, value);
		} else {
			UnityEngine.PlayerPrefs.SetString(`${this.hashID}_${key}`, value);
		}
	}

	/**
	 * 获取数据
	 * @param  {string} key 数据key
	 * @param  {boolean=false} isGlobal 是否全局保存
	 * @return string   数据
	 */
	public getItem(key: string, isGlobal: boolean = false): string {
		if (isGlobal) {
			return UnityEngine.PlayerPrefs.GetString(key);
		} else {
			return UnityEngine.PlayerPrefs.GetString(`${this.hashID}_${key}`);
		}
	}

	/**
	 * 删除保存数据
	 * @param  {string} key 数据key
	 * @param  {boolean=false} isGlobal 是否全局保存
	 */
	public removeItem(key: string, isGlobal: boolean = false): void {
		if (isGlobal) {
			UnityEngine.PlayerPrefs.DeleteKey(key);
		} else {
			UnityEngine.PlayerPrefs.DeleteKey(`${this.hashID}_${key}`);
		}
	}

	/**
	 * 清空所有数据
	 */
	public save(): void {
		UnityEngine.PlayerPrefs.Save();
	}

	/**
	 * 清空所有数据
	 */
	public static clearAll(): void {
		UnityEngine.PlayerPrefs.DeleteAll();
	}
}

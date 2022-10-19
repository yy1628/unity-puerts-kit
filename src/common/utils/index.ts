/*
 * @Author: yuanyuan
 * @Date: 2022-08-09 15:41:50
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-09 16:38:59
 * @FilePath: \unity-puerts-kit\src\common\utils\index.ts
 * @Description: 
 */

export * from "./array";
export * from "./js";
export * from "./macro";

/** 数学计算 */
export * from "../math";
/** 随机处理 */
export * from "./random";
/** 时间处理 */
export * from "./time";
/** 文字处理 */
export * from "./word";

/**
 * 获取url参数
 * @param {string} url
 * @param {string} name 参数名
 */
export function getUrlParams(url: string, name: string) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
		r = url.match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

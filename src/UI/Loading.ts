/*
 * @Author: yuanyuan
 * @Date: 2022-08-08 16:06:44
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-10 14:05:55
 * @FilePath: \unity-puerts-kit\src\UI\Loading.ts
 * @Description:
 */
import { EVENT, utils } from "common";
import { UIBase } from "common/ui/ui-base";
import { FairyGUI, UnityEngine } from "csharp";
import { UIShowTypes, LayerType, UIDataInfo, UIType } from "define/ui-define";

export class Loading extends UIBase {
	public onOpen(uiType: UIType, args: any): void {
		this.scheduleOnce((dt) => {
			console.log(dt);
			console.log(this.load("Textures/loading"));
		}, 1);

	}

	protected update?(dt: number): void {
		// console.log("update");
	}

	protected lateUpdate?(dt: number): void {
		// console.log("lateUpdate");
	}
}

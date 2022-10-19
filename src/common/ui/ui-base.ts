import { FairyGUI, UnityEngine } from "csharp";
import { UIShowTypes, UIDataInfo, UIType } from "define/ui-define";
import { UIManager } from "./ui-manager";
import { UIComponent } from "./ui-component";

/*
 * @Author: yuanyuan
 * @Date: 2022-08-05 11:24:41
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-26 16:35:33
 * @FilePath: \unity-puerts-kit\src\common\ui\ui-base.ts
 * @Description:
 */
export class UIBase extends UIComponent {
	/** 界面显示类型 */
	public showType: UIShowTypes = UIShowTypes.UIAddition;
	/** 快速关闭 */
	public quickClose: boolean = true;
	/** mask透明度 */
	public maskOpacity: number = 255;
	/** 打开参数 */
	public _para: any = null;
	/** 是否在播放动画 */
	public isPlayOpenAni: boolean = false;
	/** UI配置数据 */
	public dataInfo: UIDataInfo;

	public uiType: UIType;

	public panel: FairyGUI.UIPanel = null;
	public gameObject: UnityEngine.GameObject = null;

	/**
	 * 关闭界面
	 */
	protected close(): void {
		UIManager.inst.close(this.uiType);
	}

	/**
	 * 当界面被创建时回调，生命周期内只调用
	 * @param args 可变参数
	 */
	public init(uiType: UIType, args: any): void {
		// 先保存一份
		this._para = Object.assign({}, args);
		this.uiType = uiType;
	}

	/**
	 * 当界面被打开时回调，每次调用Open时回调
	 * @param uiType 从哪个UI打开的
	 * @param args 可变参数
	 */
	public onOpen(uiType: UIType, args: any): void {}

	/**
	 * 每次界面Open动画播放完毕时回调
	 */
	public onOpenAniOver(): void {}

	/**
	 * 当界面被关闭时回调
	 */
	public onClose(): void {}

	/**
	 * 当界面被置顶时回调，Open时并不会回调该函数
	 * @param preID 前一个ui
	 * @param args 可变参数，
	 */
	public onTop(preID: number, ...args: any[]): void {}
}

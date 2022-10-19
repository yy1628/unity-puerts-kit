/*
 * @Description:
 * @Author: chenguanhui
 * @Date: 2019-08-13 13:54:36
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-26 16:36:15
 */

import { UIBase } from "common/ui/ui-base";
import { Loading } from "../UI/Loading";

/**
 * 层级管理
 */
export enum LayerType {
	/**
	 * GUI层
	 */
	GUI,

	/**
	 * 提示
	 */
	Tip,

	/**
	 * 最顶层
	 */
	Top,
}

/** 界面展示类型 */
export enum UIShowTypes {
	UIFullScreen, // 全屏显示，全屏界面使用该选项可获得更高性能
	UIAddition, // 叠加显示，性能较差
	UISingle, // 单界面显示，只显示当前界面和背景界面，性能较好
}

/**
 * UI类型定义
 */
export enum UIType {
	$Start,
	UIBack,
	UIWait,
	/** Logo */
	Logo,
	/** 加载 */
	Loading,
	/** UI */
	MainUI,
	/** 二次确认界面 */
	Confirm,

	Test,

	//测试登录界面
	TestAccountLogin,

	/* 游戏开始 */
	GameStart,
	/* 游戏准备 */
	GameReady,
	/* 游戏结算 */
	GameOver,

	$End,
}

export class UIDataInfo {
	/**
	 * 界面类型
	 */
	public uiType: UIType;

	/**
	 * 资源路径
	 */
	private uiPath: string[];

	/**
	 * ui类类型
	 */
	public uiBase: typeof UIBase;

	/** 屏蔽点击 */
	public preventTouch: boolean = true;

	/** 是否缓存 */
	public cache: boolean = false;

	constructor(
		uiType: UIType,
		uiPath: string,
		uiBase: typeof UIBase = UIBase,
		preventTouch: boolean = true,
		cache: boolean = false
	) {
		this.uiType = uiType;
		this.uiPath = uiPath.split("/");
		this.uiBase = uiBase;
		this.preventTouch = preventTouch;
		this.cache = cache;
	}

	/**
	 * 包路径
	 */
	public get packagePath(): string {
		let len = this.uiPath.length;
		let packagePath = "";
		for (let i = 0; i < len - 2; i++) {
			packagePath += this.uiPath[i] + "/";
		}
		return packagePath + this.packageName;
	}

	/**
	 * 包名
	 */
	public get packageName(): string {
		let len = this.uiPath.length;
		return this.uiPath[len - 2];
	}

	/**
	 * 组件名
	 */
	public get componentName(): string {
		let len = this.uiPath.length;
		return this.uiPath[len - 1];
	}

	/**
	 * 获取UI的配置信息
	 * @param uiType
	 */
	public static getUIData(uiType: UIType): UIDataInfo {
		for (let i = 0; i < this._uiDataList.length; ++i) {
			if (this._uiDataList[i].uiType == uiType) {
				return this._uiDataList[i];
			}
		}
		return null;
	}

	//  #region注册UI界面数据
	private static _uiDataList: Array<UIDataInfo> = [
		new UIDataInfo(UIType.UIBack, "UI/Common/UIBack"),
		new UIDataInfo(UIType.UIWait, "UI/Common/UIWait"),
		// new UIDataInfo(UIType.Logo, "Logo"),
		// new UIDataInfo(UIType.Confirm, "Confirm"),
		new UIDataInfo(UIType.Confirm, "UI/Bag/Main", Loading),
		new UIDataInfo(UIType.Loading, "UI/Bag/BagWin", Loading),
	];
	//  #region
}

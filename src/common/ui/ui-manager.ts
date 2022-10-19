/*
 * @Author: yuanyuan
 * @Date: 2022-08-04 17:26:00
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-26 17:15:38
 * @FilePath: \unity-puerts-kit\src\common\ui\ui-manager.ts
 * @Description:
 */

import { BlockInputEvents, FairyGUI, UnityEngine } from "csharp";
import { $typeof } from "puerts";
import {
	LayerType,
	UIDataInfo,
	UIShowTypes,
	UIType,
} from "../../define/ui-define";
import { Singleton } from "../singleton";
import { UIBase } from "./ui-base";

/** 屏幕朝向 */
export enum eOrientation {
	Landscape,
	Portrait,
}

/** UI栈结构体 */
export interface UIInfo {
	uiType: UIType;
	uiView: UIBase;
	uiArgs: any;
	preventNode?: FairyGUI.UIPanel;
	zOrder?: number;
	isClose?: boolean;
}

export interface UICloseInfo {
	uiType: UIType;
	playAnim: boolean;
}

export class UIManager extends Singleton<UIManager>() {
	//# regison  层级控制
	public canvas: UnityEngine.Canvas = null;

	public camera: UnityEngine.Camera = null;

	public guiLayer: UnityEngine.GameObject = null;

	public tipLayer: UnityEngine.GameObject = null;

	public topLayer: UnityEngine.GameObject = null;

	public eventSystem: UnityEngine.EventSystems.EventSystem = null;

	//# regison  层级控制
	private _uiWaitNode: UnityEngine.GameObject = null;

	/** 背景UI（有若干层UI是作为背景UI，而不受切换等影响）*/
	private BackGroundUI = 0;
	/** 是否正在关闭UI */
	private isClosing = false;
	/** 是否正在打开UI */
	private isOpening = false;
	/** UI界面缓存（key为UIId，value为UIView节点）*/
	private UICache: { [UIId: number]: UIBase } = {};

	private FairyGUIPackage: { [name: string]: number } = {};
	/** UI界面栈（{UIID + UIView + UIArgs}数组）*/
	private UIStack: UIInfo[] = [];
	/** UI待打开列表 */
	private UIOpenQueue: UIInfo[] = [];
	/** UI待关闭列表 */
	private UICloseQueue: UICloseInfo[] = [];
	/** UI打开前回调 */
	public uiOpenBeforeDelegate: (uiType: number, preUIType: number) => void;
	/** UI打开回调 */
	public uiOpenDelegate: (uiType: number, preUIType: number) => void;
	/** UI关闭回调 */
	public uiCloseDelegate: (uiType: number) => void;

	/**
	 * 打开界面并添加到界面栈中
	 * @param uiType
	 * @param uiArgs
	 * @param progressCallback
	 */
	public open<T extends UIBase>(
		uiType: UIType | number,
		uiArgs?: any,
		progressCallback?: (num: number, total: number, item: any) => void,
		completeCallback?: (uiView: T) => void
	): void {
		let uiInfo: UIInfo = {
			uiType: uiType,
			uiArgs: uiArgs,
			uiView: null,
		};
		// 插入待打开队列
		if (this.isOpening || this.isClosing) {
			console.log(
				`open <${UIType[uiType]}> ui action push into a queue!`
			);
			this.UIOpenQueue.push(uiInfo);
			return;
		}

		// 界面已经打开
		let uiIndex = this.getUIIndex(uiType);
		if (-1 != uiIndex) {
			// 直接回到该界面
			this.closeToUI(uiType, uiArgs);
			return;
		}
		uiInfo.zOrder = this.UIStack.length + 1;
		this.UIStack.push(uiInfo);

		this.isOpening = true;

		// 显示loading
		this.showUIWaitAnim();

		let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);
		let uiView = new dataInfo.uiBase() as T;
		let panel = this.createFGUI(uiType, uiInfo.zOrder);
		uiView.panel = panel;
		uiView.gameObject = panel.gameObject;
		uiView.init(uiType, uiArgs);

		// 关闭loading
		this.hideUIWaitAnim();
		// 如果界面已经被关闭或创建失败
		if (uiInfo.isClose || null == uiView) {
			console.log(
				`getOrCreateUI ${uiType} faile! close state : ${uiInfo.isClose} , uiView : ${uiView}`,
				"%s"
			);
			this.isOpening = false;
			completeCallback && completeCallback(null);
			return;
		}
		if (dataInfo.preventTouch) {
			uiInfo.preventNode = this.createBack(uiInfo.zOrder);
		}

		// 打开UI，执行配置
		this.onUIOpen(uiType, uiView, uiInfo, uiArgs);
		this.isOpening = false;
		this.autoExecNextUI();

		completeCallback && completeCallback(uiView);
	}

	/**
	 * 关闭当前界面
	 * @param uiType 要关闭的界面
	 */
	public close(uiType: UIType | number, playCloseAni: boolean = true): void {
		console.log(`close ui <${UIType[uiType]}>`);
		let uiCount = this.UIStack.length;
		let uiInfo: UIInfo;
		let uiCloseInfo: UICloseInfo = {
			uiType: uiType,
			playAnim: playCloseAni,
		};

		if (!(uiType > UIType.$Start && uiType < UIType.$End)) {
			console.error("unknown ui type to close!", "%s");
			return;
		}

		if (!this.isUIOpen(uiType)) {
			console.log(`<${UIType[uiType]}> not has open`);
			return;
		}

		// 暂时取消UI关闭队列逻辑
		// UI关闭逻辑使框架过于复杂化
		if (uiCount < 1 || this.isOpening || this.isClosing) {
			console.log(
				`<${UIType[uiType]}> can not be close in this period of time`
			);
			this.UICloseQueue.push(uiCloseInfo);
			return;
		}

		for (let index = this.UIStack.length - 1; index >= 0; index--) {
			let ui: UIInfo = this.UIStack[index];
			if (ui.uiType === uiType) {
				uiInfo = ui;
				this.UIStack.splice(index, 1);
				break;
			}
		}

		// 找不到这个UI
		if (uiInfo === undefined) {
			return;
		}

		this.isClosing = true;
		// 关闭当前界面
		let uiId = uiInfo.uiType;
		let uiView = uiInfo.uiView;
		uiInfo.isClose = true;

		// 回收遮罩层
		if (uiInfo.preventNode) {
			UnityEngine.Object.Destroy(uiInfo.preventNode);
			uiInfo.preventNode = null;
		}

		if (null == uiView) {
			this.isClosing = false;
			return;
		}

		// 处理显示模式
		this.updateUI();
		this.onUIClose(uiId, uiView, uiInfo);
	}
	/**
	 * UI被打开时回调，对UI进行初始化设置，刷新其他界面的显示，并根据
	 * @param nUIType 哪个界面被打开了
	 * @param uiView 界面对象
	 * @param uiInfo 界面栈对应的信息结构
	 * @param uiArgs 界面初始化参数
	 */
	private onUIOpen(
		uiType: UIType,
		uiView: UIBase,
		uiInfo: UIInfo,
		uiArgs: any
	) {
		if (null == uiView) {
			return;
		}

		// 激活界面
		uiInfo.uiView = uiView;
		uiView.gameObject.SetActive(true);
		uiView.gameObject.transform.SetSiblingIndex(
			uiInfo.zOrder || this.UIStack.length
		);

		if (uiInfo.preventNode) {
			uiInfo.preventNode.ui.alpha = 255 / uiView.maskOpacity;
		}

		if (uiView.quickClose) {
			// 处理快速关闭
			uiView.panel.ui.onClick.Add((context: FairyGUI.EventContext) => {
				let obj = FairyGUI.GRoot.inst.touchTarget
				if (obj.name == "") {
					/* 没有点击到任何元素 */
					console.log(`touch close <${UIType[uiType]}>`);
					this.close(uiType);
				}
			});
		}

		// 添加到场景中
		this.add2Layer(uiView.gameObject);

		// 刷新其他UI
		this.updateUI();

		// 从那个界面打开的
		let fromUIID = 0;
		if (this.UIStack.length > 1) {
			fromUIID = this.UIStack[this.UIStack.length - 2].uiType;
		}

		// 打开界面之前回调
		if (this.uiOpenBeforeDelegate) {
			this.uiOpenBeforeDelegate(uiType, fromUIID);
		}

		// 执行onOpen回调
		uiView.onOpen(fromUIID, uiArgs);

		// 播放UI打开动画，如果有得话
		let onAniOverFunc: Function = () => {
			uiView.isPlayOpenAni = false;
			uiView.onOpenAniOver();
			if (this.uiOpenDelegate) {
				this.uiOpenDelegate(uiType, fromUIID);
			}
		};

		// let openAni: UIOpenAnimation = uiView.gameObject.GetComponent(UIOpenAnimation);
		// if (openAni) {
		//     uiView.isPlayOpenAni = true;
		//     openAni.play();
		//     let aniState: cc.AnimationState = openAni.getState(openAni.defaultClip.name);

		//     if (aniState.wrapMode == 2) {
		//         console.error('UI open animation should not be a loop animation!');
		//     }
		//     openAni.once(
		//         cc.Animation.EventType.FINISHED,
		//         () => {
		//             onAniOverFunc();
		//         },
		//         this
		//     );
		// } else {
		// }
		onAniOverFunc();
	}

	/**
	 * UI关闭时回调
	 * @param nUIType 哪个界面被打开了
	 * @param uiView 界面对象
	 * @param uiInfo 界面栈对应的信息结构
	 * @param uiArgs 界面初始化参数
	 */
	private onUIClose(uiType: UIType, uiView: UIBase, uiInfo: UIInfo) {
		let preUIInfo = this.UIStack[this.UIStack.length - 2];
		let onAniOverFunc = () => {
			// 显示之前的界面
			if (
				preUIInfo &&
				preUIInfo.uiView &&
				this.isTopUI(preUIInfo.uiType)
			) {
				// 如果之前的界面弹到了最上方（中间有肯能打开了其他界面）
				preUIInfo.uiView.gameObject.SetActive(true);
				// 回调onTop
				preUIInfo.uiView.onTop(uiType, uiView.onClose());
			} else {
				uiView.onClose();
			}

			if (this.uiCloseDelegate) {
				this.uiCloseDelegate(uiType);
			}

			let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);
			if (dataInfo.cache) {
				this.UICache[uiType] = uiView;
				uiView.gameObject.transform.parent = null;
				console.log(`uiView removeFromParent ${uiInfo.uiType}`);
			} else {
				//@ts-expect-error run private method
				uiView.destroy();
				uiInfo.uiView = null;
				console.log(`uiView destroy <${UIType[uiInfo.uiType]}>`);
				// 处理GUI资源
				this.destroyFGUI(uiType, uiView);
			}
			this.isClosing = false;
			this.autoExecNextUI();
		};

		// 播放UI关闭动画，如果有的话
		// let closeAni: UICloseAnimation =uiView.node.getComponent(UICloseAnimation);
		// if (playCloseAni && closeAni) {
		// 	uiView.isPlayOpenAni = true;
		// 	closeAni.play();
		// 	let aniState: cc.AnimationState = closeAni.getState(
		// 		closeAni.defaultClip.name
		// 	);
		// 	if (aniState.wrapMode == 2) {
		// 		cc.error(
		// 			"UI close animation should be a loop animation!",
		// 			"%s"
		// 		);
		// 	}
		// 	closeAni.once(
		// 		cc.Animation.EventType.FINISHED,
		// 		() => {
		// 			onAniOverFunc();
		// 		},
		// 		this
		// 	);
		// } else {
		onAniOverFunc();
		// }
	}

	/**
	 * 从Fairy-GUI 打开一个页面
	 * @param uiType 界面id
	 * @returns uiNode
	 */
	createFGUI(uiType: UIType, zOrder?: number) {
		let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);

		if (!this.FairyGUIPackage[dataInfo.packagePath]) {
			this.FairyGUIPackage[dataInfo.packagePath] = 0;
			FairyGUI.UIPackage.AddPackage(dataInfo.packagePath);
		}
		this.FairyGUIPackage[dataInfo.packagePath]++;

		let panel = new UnityEngine.GameObject().AddComponent(
			$typeof(FairyGUI.UIPanel)
		) as FairyGUI.UIPanel;
		panel.gameObject.layer = 5;
		panel.packageName = dataInfo.packageName;
		panel.componentName = dataInfo.componentName;

		panel.fitScreen = FairyGUI.FitScreen.FitSize;
		panel.SetSortingOrder(zOrder, true);

		//最后，创建出UI
		panel.CreateUI();

		let uiNode: UnityEngine.GameObject = panel.gameObject; // TODO
		uiNode.name = UIType[uiType];

		return panel;
	}

	destroyFGUI(uiType: UIType, uiView: UIBase) {
		let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);

		UnityEngine.Object.Destroy(uiView.gameObject);

		this.FairyGUIPackage[dataInfo.packagePath]--;
		if (!this.FairyGUIPackage[dataInfo.packagePath]) {
			FairyGUI.UIPackage.RemovePackage(dataInfo.packagePath);
		}
	}

	/**
	 * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
	 * @param uiType 要关闭到的uiId（关闭其顶部的ui）
	 * @param uiArgs 打开的参数
	 * @param bOpenSelf
	 */
	public closeToUI(uiType: UIType, uiArgs: any, bOpenSelf = true): void {
		let idx = this.getUIIndex(uiType);
		if (-1 == idx) {
			return;
		}

		idx = bOpenSelf ? idx : idx + 1;
		for (let i = this.UIStack.length - 1; i >= idx; --i) {
			let uiInfo = this.UIStack.pop();
			let uiType = uiInfo.uiType;
			let uiView = uiInfo.uiView;
			uiInfo.isClose = true;

			// 回收屏蔽层
			if (uiInfo.preventNode) {
				UnityEngine.Object.Destroy(uiInfo.preventNode);
				uiInfo.preventNode = null;
			}

			if (this.uiCloseDelegate) {
				this.uiCloseDelegate(uiType);
			}

			if (uiView) {
				uiView.onClose();
				let dataInfo: UIDataInfo = UIDataInfo.getUIData(uiType);
				if (dataInfo.cache) {
					this.UICache[uiType] = uiView;
					uiView.gameObject.transform.parent = null;
				} else {
					UnityEngine.Object.Destroy(uiView.gameObject);
				}
			}
		}

		this.updateUI();
		this.UIOpenQueue = [];
		bOpenSelf && this.open(uiType, uiArgs);
	}

	/** 关闭所有界面 */
	public closeAll(excludeUI: UIType = UIType.Loading) {
		// 不播放动画 直接关闭
		let len: number = this.UIStack.length;
		for (let i: number = len - 1; i >= 0; --i) {
			let uiInfo = this.UIStack[i];

			if (uiInfo.uiType == excludeUI) {
				continue;
			}

			this.close(uiInfo.uiType, false);
		}
		this.UIOpenQueue = [];
		this.isOpening = false;
		this.isClosing = false;
	}

	/** 清理界面缓存 */
	public clearCache(): void {
		for (const key in this.UICache) {
			let ui = this.UICache[key];
			// if (cc.isValid(ui.node)) {
			//     ui.node.destroy();
			// }
		}
		this.UICache = {};
	}

	public isTopUI(uiType: UIType): boolean {
		if (this.UIStack.length == 0) {
			return false;
		}
		return this.UIStack[this.UIStack.length - 1].uiType == uiType;
	}

	public getUI(uiType: UIType): UIBase {
		for (let index = 0; index < this.UIStack.length; index++) {
			const element = this.UIStack[index];
			if (uiType == element.uiType) {
				return element.uiView;
			}
		}
		return null;
	}

	public isUIOpen(uiType: UIType): boolean {
		return this.getUI(uiType) != null;
	}

	public getTopUI(): UIBase {
		if (this.UIStack.length > 0) {
			return this.UIStack[this.UIStack.length - 1].uiView;
		}
		return null;
	}

	public centerToUI(gameObject: UnityEngine.GameObject) {
		let canvas = this.canvas.transform as UnityEngine.RectTransform;
		let rectTransform = gameObject.transform as UnityEngine.RectTransform;
		if (rectTransform == null) {
			return;
		}
		rectTransform.anchoredPosition = UnityEngine.Vector2.zero;
		rectTransform.SetSizeWithCurrentAnchors(
			UnityEngine.RectTransform.Axis.Horizontal,
			canvas.rect.width
		);
		rectTransform.SetSizeWithCurrentAnchors(
			UnityEngine.RectTransform.Axis.Vertical,
			canvas.rect.height
		);
	}

	public createCanvas() {
		// Canvas
		this.canvas = new UnityEngine.GameObject().AddComponent(
			$typeof(UnityEngine.Canvas)
		) as UnityEngine.Canvas;
		// this.canvas.gameObject.AddComponent(
		// 	$typeof(UnityEngine.UI.CanvasScaler)
		// );
		this.canvas.gameObject.AddComponent(
			$typeof(UnityEngine.UI.GraphicRaycaster)
		);

		this.canvas.gameObject.name = "Canvas";
		this.canvas.renderMode = UnityEngine.RenderMode.ScreenSpaceOverlay;

		this.camera = new UnityEngine.GameObject().AddComponent(
			$typeof(UnityEngine.Camera)
		) as UnityEngine.Camera;
		this.camera.gameObject.name = "Camera";
		this.camera.backgroundColor = UnityEngine.Color.black;
		this.camera.clearFlags = UnityEngine.CameraClearFlags.SolidColor;
		this.camera.orthographic = true;
		this.camera.transform.parent = this.canvas.transform;

		this.guiLayer = new UnityEngine.GameObject();
		this.guiLayer.name = "GuiLayer";
		this.guiLayer.transform.parent = this.canvas.transform;
		this.guiLayer.AddComponent($typeof(UnityEngine.RectTransform));
		this.centerToUI(this.guiLayer);

		this.tipLayer = new UnityEngine.GameObject();
		this.tipLayer.name = "TipLayer";
		this.tipLayer.transform.parent = this.canvas.transform;
		this.tipLayer.AddComponent($typeof(UnityEngine.RectTransform));
		this.centerToUI(this.tipLayer);

		this.topLayer = new UnityEngine.GameObject();
		this.topLayer.name = "TopLayer";
		this.topLayer.transform.parent = this.canvas.transform;
		this.topLayer.AddComponent($typeof(UnityEngine.RectTransform));
		this.centerToUI(this.topLayer);

		this.eventSystem = new UnityEngine.GameObject().AddComponent(
			$typeof(UnityEngine.EventSystems.EventSystem)
		) as UnityEngine.EventSystems.EventSystem;
		this.eventSystem.gameObject.AddComponent(
			$typeof(UnityEngine.EventSystems.StandaloneInputModule)
		);
		this.eventSystem.gameObject.name = "EventSystem";

		this._uiWaitNode = this.createFGUI(UIType.UIWait, 9999).gameObject;
		this._uiWaitNode.transform.parent = this.canvas.transform;
		this._uiWaitNode.SetActive(false);

		let uiContentScaler = this.canvas.gameObject.AddComponent(
			$typeof(FairyGUI.UIContentScaler)
		) as FairyGUI.UIContentScaler;
		uiContentScaler.scaleMode =
			FairyGUI.UIContentScaler.ScaleMode.ScaleWithScreenSize;
		uiContentScaler.designResolutionX = 750;
		uiContentScaler.designResolutionY = 1334;
		uiContentScaler.ApplyChange();
	}

	private createBack(zOrder: number) {
		let back = this.createFGUI(UIType.UIBack, zOrder);
		back.transform.parent = this.guiLayer.transform;
		// back.gameObject.AddComponent($typeof(BlockInputEvents));
		back.gameObject.SetActive(true);
		return back;
	}
	/**
	 * 获取层
	 * @param nLayerType 层级类型
	 */
	public getLayer(nLayerType: LayerType): UnityEngine.GameObject {
		let layer: UnityEngine.GameObject = null;

		switch (nLayerType) {
			case LayerType.GUI:
				layer = this.guiLayer;
				break;
			case LayerType.Tip:
				layer = this.tipLayer;
				break;
			case LayerType.Top:
				layer = this.topLayer;
				break;
			default:
				console.error("Unkonw layer type!", "%s");
				break;
		}

		return layer;
	}
	/**
	 * 添加到指定的层级
	 * @param nLayerType 要添加到的层类型
	 * @param node 被添加的节点
	 */
	public add2Layer(node: UnityEngine.GameObject): void {
		if (!node) {
			console.error("node is not valid!", "%s");
			return;
		}

		let layer = this.guiLayer;
		if (!layer) {
			console.error("add to layer is not found!", "%s");
			return;
		}
		node.transform.parent = layer.transform;
	}

	/**
	 * 获取打开的UI数量
	 */
	public getOpenUICount(): number {
		return this.UIStack.length;
	}

	/** 替换栈顶界面 */
	public replace(uiType: number, uiArgs: any) {
		this.close(this.UIStack[this.UIStack.length - 1].uiType);
		this.open(uiType, uiArgs);
	}

	private getUIIndex(uiType: UIType): number {
		for (let index = 0; index < this.UIStack.length; index++) {
			const element = this.UIStack[index];
			if (uiType == element.uiType) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * 显示UI加载等待动画
	 * @param showMask
	 * @param maxWaitTime
	 */
	public showUIWaitAnim(showMask: boolean = true, maxWaitTime: number = 15) {
		this._uiWaitNode && this._uiWaitNode.SetActive(true);
	}

	/**
	 * 自动执行下一个待关闭或待打开的界面
	 */
	private autoExecNextUI() {
		if (this.UIOpenQueue.length > 0) {
			let uiQueueInfo = this.UIOpenQueue[0];
			this.UIOpenQueue.splice(0, 1);
			this.open(uiQueueInfo.uiType, uiQueueInfo.uiArgs);
			return;
		}

		if (this.UICloseQueue.length > 0) {
			let uiQueueInfo = this.UICloseQueue[0];
			this.UICloseQueue.splice(0, 1);
			this.close(uiQueueInfo.uiType, uiQueueInfo.playAnim);
		}
	}

	/**
	 * 根据界面显示类型刷新显示
	 */
	private updateUI() {
		let hideIndex: number = 0;
		let showIndex: number = this.UIStack.length - 1;
		for (; showIndex >= 0; --showIndex) {
			let mode = this.UIStack[showIndex].uiView.showType;
			// 无论何种模式，最顶部的UI都是应该显示的
			this.UIStack[showIndex].uiView.gameObject.SetActive(true);
			if (UIShowTypes.UIFullScreen == mode) {
				break;
			} else if (UIShowTypes.UISingle == mode) {
				for (let i = 0; i < this.BackGroundUI; ++i) {
					if (this.UIStack[i]) {
						this.UIStack[i].uiView.gameObject.SetActive(true);
					}
				}
				hideIndex = this.BackGroundUI;
				break;
			}
		}
		// 隐藏不应该显示的部分UI
		for (let hide: number = hideIndex; hide < showIndex; ++hide) {
			this.UIStack[hide].uiView.gameObject.SetActive(false);
		}
	}

	/**
	 * 隐藏UI加载等待动画
	 */
	public hideUIWaitAnim() {
		this._uiWaitNode && this._uiWaitNode.SetActive(false);
	}

	public getOpenQueueCount(): number {
		return this.UIOpenQueue.length;
	}

	/** Update for UIBases */
	public update(dt: number) {
		for (let i = 0; i < this.UIStack.length; ++i) {
			//@ts-expect-error run private method
			this.UIStack[i].uiView.update(dt);
		}
	}

	/** Update for UIBases */
	public lateUpdate?(dt: number) {
		for (let i = 0; i < this.UIStack.length; ++i) {
			//@ts-expect-error run private method
			this.UIStack[i].uiView.lateUpdate(dt);
		}
	}
}

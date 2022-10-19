/*
 * @Author: yuanyuan
 * @Date: 2022-08-09 17:22:29
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-26 11:37:43
 * @FilePath: \unity-puerts-kit\src\common\res\res-keeper.ts
 * @Description:
 */
import { System, UnityEngine } from "csharp";
import ResLoader from "./res-loader";

/**
 * 资源引用计数
 * @param id  GetInstanceID
 * */
 const RefCount: { [id: number]: number } = {};

/**
 * 资源加载类
 * 1. 加载完成后自动记录引用关系，根据InstanceID记录反向依赖
 * 2. 支持资源使用，如某打开的UI使用了A资源，其他地方释放资源B，资源B引用了资源A，如果没有其他引用资源A的资源，会触发资源A的释放，
 * 3. 能够安全释放依赖资源（一个资源同时被多个资源引用，只有当其他资源都释放时，该资源才会被释放）
 */
export default class ResKeeper extends ResLoader {
	private autoRes: UnityEngine.Object[] = [];

	/**
	 * 加载资源，通过此接口加载的资源会在界面被销毁时自动释放，开启自动释放功能
	 * 如果同时有其他地方引用的资源，会解除当前界面对该资源的占用
	 * */
	public load<T extends UnityEngine.Object>(path: string, type?: typeof UnityEngine.Object): T {
		let asset = super.load<T>(path, type)
		if (asset != null) {
			this.addRef(asset);
			this.autoRes.push(asset);
		}

		return asset;
	}

	public LoadAll<T extends UnityEngine.Object>(path: string, type?: typeof UnityEngine.Object): System.Array$1<T> {
		let assets = super.LoadAll<T>(path, type)
		for (let i = 0; i < assets.Length; i++) {
			let asset = assets.get_Item(i);
			if (asset != null) {
				this.addRef(asset);
				this.autoRes.push(asset);
			}
		}
		return assets;
	}

	public loadBundleRes<T extends UnityEngine.Object>(bundName: string, path: string, type?: typeof UnityEngine.Object): T {
		let asset = super.loadBundleRes<T>(bundName, path, type)
		if (asset != null) {
			this.addRef(asset);
			this.autoRes.push(asset);
		}
		return asset;
	}

	/**
	 * 释放资源，组件销毁时自动调用
	 */
	public releaseAutoRes() {
		for (let index = 0; index < this.autoRes.length; index++) {
			const element = this.autoRes[index];
			this.decRef(element);
		}
		this.autoRes.length = 0;
	}

	/**
	 * 加入一个自动释放的资源
	 * @param asset 资源url和类型 [ useKey ]
	 */
	public autoReleaseRes(asset: UnityEngine.Object) {
		this.addRef(asset);
		this.autoRes.push(asset);
	}

	/* 资源引用计数 */
	public addRef(asset: UnityEngine.Object) {
		let id = asset.GetInstanceID();
		if (RefCount[id] == null) {
			RefCount[id] = 0;
		}
		RefCount[id]++;
	}

	public decRef(asset: UnityEngine.Object) {
		let id = asset.GetInstanceID();
		if (RefCount[id] == null) {
			UnityEngine.Resources.UnloadAsset(asset);
			return;
		}
		RefCount[id]--;
		if (RefCount[id] <= 0) {
			UnityEngine.Resources.UnloadAsset(asset);
			delete RefCount[id];
		}
	}
}

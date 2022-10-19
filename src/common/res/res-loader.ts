/*
 * @Author: yuanyuan
 * @Date: 2022-08-04 17:27:31
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-10 14:07:56
 * @FilePath: \unity-puerts-kit\src\common\res\res-loader.ts
 * @Description:
 */

import { System, UnityEngine } from "csharp";
import { $typeof } from "puerts";

export default class ResLoader {
	public load<T extends UnityEngine.Object>(path: string, type?: typeof UnityEngine.Object): T {
		if (type) {
			return UnityEngine.Resources.Load(path, $typeof(type)) as T;
		} else {
			return UnityEngine.Resources.Load(path) as T;
		}
	}

	public LoadAll<T extends UnityEngine.Object>(path: string, type?: typeof UnityEngine.Object): System.Array$1<T> {
		if (type) {
			return UnityEngine.Resources.LoadAll(path, $typeof(type)) as System.Array$1<T>;
		} else {
			return UnityEngine.Resources.LoadAll(path) as System.Array$1<T>;
		}
	}

	public loadBundleRes<T extends UnityEngine.Object>( bundName: string, path: string, type?: typeof UnityEngine.Object): T {
		let bundle = UnityEngine.AssetBundle.LoadFromFile(bundName);
		if (!bundle) {
			return null;
		}
		if (type) {
			return bundle.LoadAsset(path, $typeof(type)) as T;
		} else {
			return bundle.LoadAsset(path) as T;
		}
	}
}

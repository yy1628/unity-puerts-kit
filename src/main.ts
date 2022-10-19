/*
 * @Author: yuanyuan
 * @Date: 2022-08-03 16:53:44
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-11 10:31:43
 * @FilePath: \unity-puerts-kit\src\main.ts
 * @Description:
 */

import Bootstrap from "bootstrap";
import { director, utils } from "common";

if (!PRODUCTION) {
	require("addons/source-map-support.unity.js");
	console.STACK_REMAP = (path) => {
		let r = path.replace("Assets/StreamingAssets/scripts/webpack:///", "");
		r = r.replace("webpack-internal:///./", "");
		return r;
	};
}

interface IScriptLauncher {
	JS_fixedUpdate(delta: number): void;
	JS_lateUpdate(delta: number): void;
	JS_update(delta: number): void;
	JS_finalize(): void;
}

export default function main(lancher: IScriptLauncher) {
	return new JavaScriptApplication(lancher);
}

class JavaScriptApplication {
	private static $inst: JavaScriptApplication;
	public static get inst(): JavaScriptApplication {
		return this.$inst;
	}
	constructor(readonly launcher: IScriptLauncher) {
		JavaScriptApplication.$inst = this;
		launcher.JS_fixedUpdate = this.fixedUpdate.bind(this);
		launcher.JS_update = this.update.bind(this);
		launcher.JS_lateUpdate = this.lateUpdate.bind(this);
		launcher.JS_finalize = this.finalize.bind(this);
		this.initialize();
	}

	private initialize() {
		console.log(`已启动 JavaScript 虚拟机`);
		new Bootstrap().start();
	}

	private fixedUpdate(delta: number) {}

	private update(delta: number) {
		WebAPI.tick();
		director.tick(delta);
	}

	private lateUpdate(delta: number) {}

	private finalize() {
		WebAPI.finalize();
		console.log(`关闭 JavaScript 虚拟机`);
	}
}

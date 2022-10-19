/*
 * @Author: yuanyuan
 * @Date: 2022-08-03 16:53:44
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-05 11:21:37
 * @FilePath: \unity-puerts-kit\src\test\index.ts
 * @Description: 
 */
import { GameTest } from "./GameTest";

interface IScriptLauncher {
	JS_fixedUpdate(delta: number): void;
	JS_lateUpdate(delta: number): void;
	JS_update(delta: number): void;
	JS_finalize(): void;
}

export default function main(lancher: IScriptLauncher) {
	new JavaScriptApplication(lancher); // tslint:disable-line
}

class JavaScriptApplication {
	private readonly lancher: IScriptLauncher;
	private static $inst : JavaScriptApplication;
	public static get inst() : JavaScriptApplication { return this.$inst; }
	private ID = Date.now();

	constructor(launcher: IScriptLauncher) {
		JavaScriptApplication.$inst = this;
		this.lancher = launcher;
		this.lancher.JS_fixedUpdate = this.fixedUpdate.bind(this);
		this.lancher.JS_update = this.update.bind(this);
		this.lancher.JS_lateUpdate = this.lateUpdate.bind(this);
		this.lancher.JS_finalize = this.finalize.bind(this);
		this.initialize();
	}

	private initialize() {
		GameTest.start();
	}

	private start() {
	}

	private fixedUpdate(delta: number) {
	}

	private update(delta: number) {
		WebAPI.tick();
	}

	private lateUpdate(delta: number) {
	}

	private finalize() {
		WebAPI.finalize();
	}
}

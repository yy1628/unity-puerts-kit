import { UI } from "common";
import { UIType } from "define/ui-define";

/*
 * @Author: yuanyuan
 * @Date: 2022-08-10 14:25:39
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-26 11:42:03
 * @FilePath: \unity-puerts-kit\src\bootstrap.ts
 * @Description:
 */
export default class Bootstrap {
	async start() {
        await this.initFramework();
        await this.initGame();
        await this.initEnd();
    }

    async initFramework() {
        /* UI框架初始化 */
        UI.createCanvas();
        
    }

    async initGame() {
        /* 处理数据相关：登录、存档等 */
    }

    async initEnd() {
        UI.open(UIType.Confirm);
        UI.open(UIType.Loading);
        UI.open(UIType.Confirm);

    }

}

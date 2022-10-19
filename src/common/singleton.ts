/*
 * @Author: yuanyuan
 * @Date: 2022-08-04 17:30:31
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-04 17:52:24
 * @FilePath: \unity-puerts-kit\src\Framework\Sys\Singleton.ts
 * @Description: 
 */

export function Singleton<T>() {
    class SingletonE {
        protected constructor() {}
        protected static _inst: SingletonE = null;
        public static get inst(): T {
            if(SingletonE._inst == null) {
                SingletonE._inst = new this();
            }
            return SingletonE._inst as T;
        }
    }

    return SingletonE;
}


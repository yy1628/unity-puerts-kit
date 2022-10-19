/*
 * @Author: yuanyuan
 * @Date: 2022-08-09 16:36:02
 * @LastEditors: yuanyuan
 * @LastEditTime: 2022-08-09 16:36:18
 * @FilePath: \unity-puerts-kit\src\common\utils\random.ts
 * @Description: 
 */

/**
 * Fisher-Yates 随机置乱算法
 * @param array 目标数组
 */
 export function fisherYatesShuffle(array: any[]): any[] {
	let count = array.length;
	while (count) {
		let index = Math.floor(Math.random() * count--);
		let temp = array[count];
		array[count] = array[index];
		array[index] = temp;
	}
	return array;
}
/**
 * 获取数组中随机元素
 * @param array 数组
 * @returns {T}
 */
export function randToArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * 随机数组中的几个值
 * @param array  数组
 * @param count  随机几个
 * @returns
 */
export function randomSome<T>(array: T[], count: number) {
	let shuffled = array.slice(0),
		i = array.length,
		min = i - count,
		temp,
		index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
}

/**
 * 带权随机函数
 * @param valueArr
 * @param weightArr
 */
export function randWeightIndex(weightArr: number[]): number {
	weightArr = this.overAddArr(weightArr);
	let totalWeight: number = weightArr[weightArr.length - 1];
	let random: number = Math.random() * totalWeight;
	let arrIndex: number = this.getRandomIndex(random, weightArr);
	return arrIndex;
}
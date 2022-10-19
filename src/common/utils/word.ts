
/**
 *  1000=1K
    1000K=1M
    1000M=1B
    1000B=1T
    1000T=1P
    1000P=1E
    1000E=1Z
    1000Z=1Y
* @param num 
*/
export function formatCNY(num: number, digits: number) {
	const si = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" },
		{ value: 1e6, symbol: "M" },
		// { value: 1E9, symbol: "G" },
		// { value: 1E12, symbol: "T" },
		// { value: 1E15, symbol: "P" },
		// { value: 1E18, symbol: "E" },
		// { value: 1E21, symbol: "Z" },
		// { value: 1E24, symbol: "Y" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	let numStr = "";
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	if (num >= 1e9) {
		numStr = "999.9M";
	} else {
		numStr =
			(num / si[i].value).toFixed(digits).replace(rx, "$1") +
			si[i].symbol;
	}
	if (numStr.length > 5) {
		numStr = numStr.slice(0, 5) + si[i].symbol;
	}
	return numStr;
}


/**
 *阿拉伯数字转中文数字
 *
 * @static
 * @param {number} num
 * @returns {string}
 * @memberof Utils
 */
export function arab2char(num: number): string {
	let changeNum = [
		"零",
		"一",
		"二",
		"三",
		"四",
		"五",
		"六",
		"七",
		"八",
		"九",
	];
	let unit = ["", "十", "百", "千", "万"];
	let getWan = (temp: string | number) => {
		let strArr = temp.toString().split("").reverse();
		let newNum = "";
		for (var i = 0; i < strArr.length; i++) {
			let a = Number(strArr[i]);
			let b = Number(strArr[i - 1]);
			newNum =
				(i == 0 && a == 0
					? ""
					: i > 0 && a == 0 && b == 0
					? ""
					: changeNum[strArr[i]] + (a == 0 ? unit[0] : unit[i])) +
				newNum;
		}
		return newNum;
	};
	let overWan = Math.floor(num / 10000);
	let noWan = num % 10000;
	let noWanStr: string = "";
	if (noWan.toString().length < 4) {
		noWanStr = "0" + noWan;
	}
	return overWan ? getWan(overWan) + "万" + getWan(noWanStr) : getWan(num);
}

export function NumToChinaBigNum(num: number) {
	let bigNum = [
		"零",
		"一",
		"二",
		"三",
		"四",
		"五",
		"六",
		"七",
		"八",
		"九",
		"十",
	];
	if (num < 0 || num > 10) {
		return "";
	}

	return bigNum[num];
}

//**限制文字的数量显示 */
export function limitWorldNum(world: string, len = 6) {
	if (world.length > len) {
		world = world.slice(0, len);
		world += "...";
	}
	return world;
}

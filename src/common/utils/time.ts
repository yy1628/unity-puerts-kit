
/**
 * 转换时间格式
 * 用法：format(ms,'yyyy-MM-dd hh:mm:ss.SS')
 * @param time 毫秒数
 * @param fmt 要转换的时间格式
 */
 export function formatDate(time: number | Date, fmt: string) {
	const date = new Date(time);
	const opt: { [key: string]: string } = {
		"y+": date.getFullYear().toString(), // 年
		"M+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"h+": date.getHours().toString(), // 时
		"m+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString(), // 秒
		"S+": date.getMilliseconds().toString(), // 毫秒
	};
	for (const k in opt) {
		const ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			if (/(y+)/.test(k)) {
				fmt = fmt.replace(ret[1], opt[k].substring(4 - ret[1].length));
			} else {
				fmt = fmt.replace(
					ret[1],
					ret[1].length === 1
						? opt[k]
						: opt[k].padStart(ret[1].length, "0")
				);
			}
		}
	}
	return fmt;
}

function prefixInteger(num: number, length: number): string {
	return (Array(length).join("0") + num).slice(-length);
}

/**
 * 时间戳转换小时
 * @param time 毫秒数
 */
export function formatHour(time: number): string {
	if (time <= 0) {
		return "00:00";
	} else {
		let hour: number = Math.floor(time / (60 * 60));

		let minute: number = Math.floor(time / 60) % 60;
		let minutestr: string = prefixInteger(minute, 2);
		return `${hour}:${minutestr}`;
	}
}

/**
 * 时间戳转换分钟
 * @param time 毫秒数
 */
export function formatMinute(time: number): string {
	if (time <= 0) {
		return "00:00";
	} else {
		let minute: number = Math.floor(time / 60) % 60;

		let second: number = time % 60;
		let secondstr: string = prefixInteger(second, 2);
		return `${minute}:${secondstr}`;
	}
}

/**
 * 时间戳转换秒
 * @param time 毫秒数
 */
export function formatSecond(time: number): string {
	if (time <= 0) {
		return "00";
	} else {
		let second: number = time % 60;
		return `${second}`;
	}
}

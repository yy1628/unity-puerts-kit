/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { IMat3Like, IMat4Like, IVec2Like } from "./type-define";
import { clamp, EPSILON, random } from "./utils";

/**
 * @en Representation of 2D vectors and points.
 * @zh 二维向量。
 */
export class Vec2 {
	// public static ZERO = Object.freeze(new Vec2(0, 0));
	// public static ONE = Object.freeze(new Vec2(1, 1));
	// public static NEG_ONE = Object.freeze(new Vec2(-1, -1));
	// public static UNIT_X = Object.freeze(new Vec2(1, 0));
	// public static UNIT_Y = Object.freeze(new Vec2(0, 1));

	// /**
	//  * @en Obtains a clone of the given vector object
	//  * @zh 获得指定向量的拷贝
	//  */
	// public static clone <Out extends IVec2Like> (a: Out) {
	//     return new Vec2(a.x, a.y);
	// }

	/**
	 * @en Copy the target vector and save the results to out vector object
	 * @zh 复制目标向量
	 */
	public static copy<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = a.x;
		out.y = a.y;
		return out;
	}

	/**
	 * @en Sets the out vector with the given x and y values
	 * @zh 设置向量值
	 */
	public static set<Out extends IVec2Like>(out: Out, x: number, y: number) {
		out.x = x;
		out.y = y;
		return out;
	}

	/**
	 * @en Element-wise vector addition and save the results to out vector object
	 * @zh 逐元素向量加法
	 */
	public static add<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		return out;
	}

	/**
	 * @en Element-wise vector subtraction and save the results to out vector object
	 * @zh 逐元素向量减法
	 */
	public static subtract<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = a.x - b.x;
		out.y = a.y - b.y;
		return out;
	}

	/**
	 * @en Element-wise vector multiplication and save the results to out vector object
	 * @zh 逐元素向量乘法
	 */
	public static multiply<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = a.x * b.x;
		out.y = a.y * b.y;
		return out;
	}

	/**
	 * @en Element-wise vector division and save the results to out vector object
	 * @zh 逐元素向量除法
	 */
	public static divide<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = a.x / b.x;
		out.y = a.y / b.y;
		return out;
	}

	/**
	 * @en Rounds up by elements of the vector and save the results to out vector object
	 * @zh 逐元素向量向上取整
	 */
	public static ceil<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = Math.ceil(a.x);
		out.y = Math.ceil(a.y);
		return out;
	}

	/**
	 * @en Element-wise rounds down of the current vector and save the results to the out vector
	 * @zh 逐元素向量向下取整
	 */
	public static floor<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = Math.floor(a.x);
		out.y = Math.floor(a.y);
		return out;
	}

	/**
	 * @en Calculates element-wise minimum values and save to the out vector
	 * @zh 逐元素向量最小值
	 */
	public static min<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = Math.min(a.x, b.x);
		out.y = Math.min(a.y, b.y);
		return out;
	}

	/**
	 * @en Calculates element-wise maximum values and save to the out vector
	 * @zh 逐元素向量最大值
	 */
	public static max<Out extends IVec2Like>(out: Out, a: Out, b: Out) {
		out.x = Math.max(a.x, b.x);
		out.y = Math.max(a.y, b.y);
		return out;
	}

	/**
	 * @en Calculates element-wise round results and save to the out vector
	 * @zh 逐元素向量四舍五入取整
	 */
	public static round<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = Math.round(a.x);
		out.y = Math.round(a.y);
		return out;
	}

	/**
	 * @en Vector scalar multiplication and save the results to out vector object
	 * @zh 向量标量乘法
	 */
	public static multiplyScalar<Out extends IVec2Like>(
		out: Out,
		a: Out,
		b: number
	) {
		out.x = a.x * b;
		out.y = a.y * b;
		return out;
	}

	/**
	 * @en Element-wise multiplication and addition with the equation: a + b * scale
	 * @zh 逐元素向量乘加: A + B * scale
	 */
	public static scaleAndAdd<Out extends IVec2Like>(
		out: Out,
		a: Out,
		b: Out,
		scale: number
	) {
		out.x = a.x + b.x * scale;
		out.y = a.y + b.y * scale;
		return out;
	}

	/**
	 * @en Calculates the euclidean distance of two vectors
	 * @zh 求两向量的欧氏距离
	 */
	public static distance<Out extends IVec2Like>(a: Out, b: Out) {
		const x = b.x - a.x;
		const y = b.y - a.y;
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * @en Calculates the squared euclidean distance of two vectors
	 * @zh 求两向量的欧氏距离平方
	 */
	public static squaredDistance<Out extends IVec2Like>(a: Out, b: Out) {
		const x = b.x - a.x;
		const y = b.y - a.y;
		return x * x + y * y;
	}

	/**
	 * @en Calculates the length of the vector
	 * @zh 求向量长度
	 */
	public static len<Out extends IVec2Like>(a: Out) {
		const x = a.x;
		const y = a.y;
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * @en Calculates the squared length of the vector
	 * @zh 求向量长度平方
	 */
	public static lengthSqr<Out extends IVec2Like>(a: Out) {
		const x = a.x;
		const y = a.y;
		return x * x + y * y;
	}

	/**
	 * @en Sets each element to its negative value
	 * @zh 逐元素向量取负
	 */
	public static negate<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = -a.x;
		out.y = -a.y;
		return out;
	}

	/**
	 * @en Sets each element to its inverse value, zero value will become Infinity
	 * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
	 */
	public static inverse<Out extends IVec2Like>(out: Out, a: Out) {
		out.x = 1.0 / a.x;
		out.y = 1.0 / a.y;
		return out;
	}

	/**
	 * @en Sets each element to its inverse value, zero value will remain zero
	 * @zh 逐元素向量取倒数，接近 0 时返回 0
	 */
	public static inverseSafe<Out extends IVec2Like>(out: Out, a: Out) {
		const x = a.x;
		const y = a.y;

		if (Math.abs(x) < EPSILON) {
			out.x = 0;
		} else {
			out.x = 1.0 / x;
		}

		if (Math.abs(y) < EPSILON) {
			out.y = 0;
		} else {
			out.y = 1.0 / y;
		}

		return out;
	}

	/**
	 * @en Sets the normalized vector to the out vector
	 * @zh 归一化向量
	 */
	public static normalize<Out extends IVec2Like, Vec2Like extends IVec2Like>(
		out: Out,
		a: Vec2Like
	) {
		const x = a.x;
		const y = a.y;
		let len = x * x + y * y;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
			out.x = x * len;
			out.y = y * len;
		}
		return out;
	}

	/**
	 * @en Calculates the dot product of the vector
	 * @zh 向量点积（数量积）
	 */
	public static dot<Out extends IVec2Like>(a: Out, b: Out) {
		return a.x * b.x + a.y * b.y;
	}

	/**
	 * @en Calculates the cross product of the vector
	 * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
	 * @override (a:Vec2, b:Vec2) => number
	 * @override [deprecated] (out:Vec3, a:Vec2, b:Vec2) => Vec3
	 */
	public static cross(a: IVec2Like, b: IVec2Like): number {
		return a.x * b.y - a.y * b.x;
	}

	/**
	 * @en Calculates the linear interpolation between two vectors with a given ratio
	 * @zh 逐元素向量线性插值： A + t * (B - A)
	 */
	public static lerp<Out extends IVec2Like>(
		out: Out,
		a: Out,
		b: Out,
		t: number
	) {
		const x = a.x;
		const y = a.y;
		out.x = x + t * (b.x - x);
		out.y = y + t * (b.y - y);
		return out;
	}

	/**
	 * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
	 * @zh 生成一个在单位圆上均匀分布的随机向量
	 * @param scale vector length
	 */
	public static random<Out extends IVec2Like>(out: Out, scale?: number) {
		scale = scale || 1.0;
		const r = random() * 2.0 * Math.PI;
		out.x = Math.cos(r) * scale;
		out.y = Math.sin(r) * scale;
		return out;
	}

	/**
	 * @en Vector and third order matrix multiplication, will complete the vector with a third value as one
	 * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
	 */
	public static transformMat3<
		Out extends IVec2Like,
		MatLike extends IMat3Like
	>(out: Out, a: Out, m: IMat3Like) {
		const x = a.x;
		const y = a.y;
		out.x = m.m00 * x + m.m03 * y + m.m06;
		out.y = m.m01 * x + m.m04 * y + m.m07;
		return out;
	}

	/**
	 * @en Vector and third order matrix multiplication, will complete the vector with a third and a fourth element as one
	 * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
	 */
	public static transformMat4<
		Out extends IVec2Like,
		MatLike extends IMat4Like
	>(out: Out, a: Out, m: IMat4Like) {
		const x = a.x;
		const y = a.y;
		out.x = m.m00 * x + m.m04 * y + m.m12;
		out.y = m.m01 * x + m.m05 * y + m.m13;
		return out;
	}

	/**
	 * @en Gets the string representation of the given vector
	 * @zh 返回向量的字符串表示
	 */
	public static str<Out extends IVec2Like>(a: Out) {
		return `Vec2(${a.x}, ${a.y})`;
	}

	/**
	 * @en Converts the given vector to an array
	 * @zh 向量转数组
	 * @param ofs Array Start Offset
	 */
	public static toArray<Out extends Array<number>>(
		out: Out,
		v: IVec2Like,
		ofs = 0
	) {
		out[ofs + 0] = v.x;
		out[ofs + 1] = v.y;
		return out;
	}

	/**
	 * @en Converts the given array to a vector
	 * @zh 数组转向量
	 * @param ofs Array Start Offset
	 */
	public static fromArray<Out extends IVec2Like>(
		out: Out,
		arr: Array<number>,
		ofs = 0
	) {
		out.x = arr[ofs + 0];
		out.y = arr[ofs + 1];
		return out;
	}

	/**
	 * @en Check the equality of the two given vectors
	 * @zh 向量等价判断
	 */
	public static strictEquals<Out extends IVec2Like>(a: Out, b: Out) {
		return a.x === b.x && a.y === b.y;
	}

	/**
	 * @en Check whether the two given vectors are approximately equivalent
	 * @zh 排除浮点数误差的向量近似等价判断
	 */
	public static equals<Out extends IVec2Like>(
		a: Out,
		b: Out,
		epsilon = EPSILON
	) {
		return (
			Math.abs(a.x - b.x) <=
				epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) &&
			Math.abs(a.y - b.y) <=
				epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y))
		);
	}

	/**
	 * @en Calculates the radian angle between two vectors
	 * @zh 求两向量夹角弧度
	 */
	public static angle<Out extends IVec2Like>(a: Out, b: Out) {
		Vec2.normalize(v2_1, a);
		Vec2.normalize(v2_2, b);
		const cosine = Vec2.dot(v2_1, v2_2);
		if (cosine > 1.0) {
			return 0;
		}
		if (cosine < -1.0) {
			return Math.PI;
		}
		return Math.acos(cosine);
	}

	/**
	 * @en x component.
	 * @zh x 分量。
	 */
	public declare x: number;

	/**
	 * @en y component.
	 * @zh y 分量。
	 */
	public declare y: number;

	constructor(other: Vec2);

	constructor(x?: number, y?: number);

	constructor(x?: number | Vec2, y?: number) {
		if (x instanceof Vec2) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
		}
	}
}

const v2_1 = new Vec2();
const v2_2 = new Vec2();

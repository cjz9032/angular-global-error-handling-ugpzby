export interface Vector2 {
	x: number | string;
	y: number | string;
}

export interface Transform2 {
	position: Vector2;
	scale: Vector2;
}

export class TransformUtils {

	static transformToString(t: Transform2) {
		const pos = [];
		Object.keys(t.position).forEach(key => {
			pos.push(t.position[key]);
		});

		return `translate(${pos.join(' ')})`;
	}
}

export class VectorUtils {

	static ZeroVector(): Vector2 {
		return {x: 0, y: 0};
	}

	static vectorSum(vecA: Vector2, vecB: Vector2): Vector2 {
		const sum = this.ZeroVector();

		Object.keys(sum).forEach(key => {
			sum[key] = vecA[key] + vecB[key];
		});

		return sum;
	}

	static vectorDif(vecA: Vector2, vecB: Vector2): Vector2 {
		const dif = this.ZeroVector();

		Object.keys(dif).forEach(key => {
			dif[key] = vecA[key] - vecB[key];
		});

		return dif;
	}

	static scalarMultiply(vec: Vector2, scal: number): Vector2 {
		const product = this.ZeroVector();

		Object.keys(product).forEach(key => {
			product[key] = vec[key] * scal;
		});

		return product;
	}

	static scalarDivide(vec: Vector2, scal: number): Vector2 {
		const product = this.ZeroVector();

		Object.keys(product).forEach(key => {
			product[key] = vec[key] / scal;
		});

		return product;
	}
}

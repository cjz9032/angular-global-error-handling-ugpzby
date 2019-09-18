import { Observable } from 'rxjs';

export interface ScoreCalculate {
	getScore(): Observable<number>;
}

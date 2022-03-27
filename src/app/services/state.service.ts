import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

export class StateService<T> {
	private state$: BehaviorSubject<T>;

	constructor(initialState: T) {
		this.state$ = new BehaviorSubject<T>(initialState);
	}

	select<K>(mapFn: (state: T) => K): Observable<K> {
		return this.state$.asObservable().pipe(
			map((state: T) => mapFn(state)),
			distinctUntilChanged()
		);
	}

	getState(): T {
		return this.state$.getValue();
	}

	setState(newState: Partial<T>) {
		this.state$.next({
			...this.getState(),
			...newState,
		});
	}
}

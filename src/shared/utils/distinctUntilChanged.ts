import { createDomain, Domain, Event, guard, sample, Store, Unit } from 'effector';
import isEqual from 'lodash/isEqual';

/**
 * Связывает хранилище и событие его установки таким образом, что
 * хранилище обновляется только в случае, если новое значение отличается от предыдущего.
 * Работает аналогично https://www.learnrxjs.io/learn-rxjs/operators/filtering/distinctuntilchanged
 */
export function distinctUntilChanged<T>($store: Store<T>, setValue: Unit<T>, domain?: Domain) {
  const d = domain ?? createDomain();

  const $prev = d.createStore<T>($store.getState());

  const prevAndCurrent = sample({
    clock: setValue,
    source: $prev,
    fn: (source, clock) => ({ previous: source, current: clock }),
  });

  const previousNotEqualsCurrent = guard({
    source: prevAndCurrent,
    filter: ({ previous, current }) => !isEqual(previous, current),
  });

  sample({
    source: previousNotEqualsCurrent,
    fn: ({ current }) => current,
    target: [$prev, $store],
  });
}

/**
 * Создаёт хранилище и событие для его обновления.
 * Хранилище обновляется только в случае, если новое значение отличается от предыдущего.
 * Работает аналогично https://www.learnrxjs.io/learn-rxjs/operators/filtering/distinctuntilchanged
 */
export function createDistinctUntilChangedStore<T>(defaultValue: T, domain?: Domain): [Store<T>, Event<T>] {
  const d = domain ?? createDomain();

  const setValue = d.createEvent<T>();
  const $current = d.createStore<T>(defaultValue);

  distinctUntilChanged($current, setValue, d);

  return [$current, setValue];
}

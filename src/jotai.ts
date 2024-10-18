import { useSyncExternalStore } from 'react';

interface Atom<T> {
  get: () => T;
  set: (newValue: T) => void;
  subscribe: (callback: (newValue: T) => void) => () => void;
}
type AtomGetter<T> = (get: <U>(atom: Atom<U>) => U) => T;

export const atom = <T>(initialValue: T | AtomGetter<T>): Atom<T> => {
  let value = typeof initialValue === 'function' ? (null as T) : initialValue;
  const subscribers = new Set<(newValue: T) => void>();
  const subscribed = new Set<Atom<any>>();

  function get<Target>(atom: Atom<Target>) {
    let currentValue = atom.get();
    if (!subscribed.has(atom)) {
      subscribed.add(atom);
      atom.subscribe(newValue => {
        if (currentValue === newValue) {
          return;
        }
        currentValue = newValue;
        computeValue();
      });
    }
    return currentValue;
  }
  async function computeValue() {
    const newValue =
      typeof initialValue === 'function'
        ? (initialValue as AtomGetter<T>)(get)
        : value;
    value = await newValue;
    subscribers.forEach(callback => callback(value));
  }
  computeValue();

  return {
    get: () => value, // 访问状态
    set: (newValue): void => {
      value = newValue; // 更新状态并调用 callback
      computeValue(); // 对 subscribers 的遍历被提取到 computeValue 中
    },
    subscribe: callback => {
      // 依赖收集
      subscribers.add(callback);
      return () => {
        // 依赖清除
        subscribers.delete(callback);
      };
    }
  };
};

export const useAtom = <T>(atom: Atom<T>) => {
  /**
   * 使用 useSyncExternalStore 替换 useState 和 useEffect
   * atom.subscribe 用于收集“触发组件重新渲染的方法”
   * atom.get 用户获取 atom 内部的状态
   */
  const value = useSyncExternalStore(atom.subscribe, atom.get);
  return [value, atom.set]; // 在调用 setAtom 时，实际调用的是 atom.set
};

export const useAtomValue = <T>(atom: Atom<T>) => {
  return useSyncExternalStore(atom.subscribe, atom.get);
};

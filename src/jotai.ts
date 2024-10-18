import { useSyncExternalStore } from 'react';

interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
}

export const atom = <T>(initialValue: T): Atom<T> => {
  let value = initialValue;
  const subscribers = new Set<(newValue: T) => void>();
  return {
    get: () => value, // 访问状态
    set: (newValue): void => {
      value = newValue; // 更新状态并调用 callback
      subscribers.forEach(callback => callback(value));
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

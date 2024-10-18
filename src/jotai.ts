import { useEffect, useState } from 'react';

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
  const [value, setValue] = useState(atom.get());
  useEffect(() => {
    const unsubscribe = atom.subscribe(setValue); // atom 内部调用 setValue，触发组件更新
    return () => unsubscribe(); // 组件卸载，取消订阅 atom
  }, [atom]);
  return [value, atom.set]; // 在调用 setAtom 时，实际调用的是 atom.set
};

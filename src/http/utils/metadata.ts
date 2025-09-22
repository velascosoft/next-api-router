const store = new WeakMap<object, Map<unknown, unknown>>();

function getMap(target: object) {
    let m = store.get(target);
    if (!m) { m = new Map(); store.set(target, m); }
    return m;
}

export function defineMetadata(key: unknown, value: unknown, target: object) {
    const R: any = (globalThis as any).Reflect;
    if (R && typeof R.defineMetadata === 'function') {
        R.defineMetadata(key, value, target);
        return;
    }
    getMap(target).set(key, value);
}

export function getMetadata<T = any>(key: unknown, target: object): T | undefined {
    const R: any = (globalThis as any).Reflect;
    if (R && typeof R.getMetadata === 'function') {
        return R.getMetadata(key, target) as T | undefined;
    }
    return getMap(target).get(key) as T | undefined;
}

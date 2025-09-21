declare global {
    var __NEXT_API_ROUTER_REFLECT_READY__: boolean | undefined;
}

export function ensureReflectMetadataLoaded() {
    if (typeof (globalThis as any).EdgeRuntime !== 'undefined') {
        throw new Error(
            "[next-api-router] reflect-metadata is not compatible with Edge Runtime. " +
            "Add `export const runtime = 'nodejs'`"
        );
    }
    if (!globalThis.__NEXT_API_ROUTER_REFLECT_READY__) {
        require('reflect-metadata');
        globalThis.__NEXT_API_ROUTER_REFLECT_READY__ = true;
    }
}
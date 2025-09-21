import type { NextRequest } from 'next/server';
import { ApiRouter, type ApiRouteController } from '../http/routing/ApiRouter';
import { ensureReflectMetadataLoaded } from '../runtime/reflect-once';

type NextHandler = (req: NextRequest) => Promise<Response> | Response;

type RouterRecords = {
    GET: NextHandler,
    POST: NextHandler,
    PUT: NextHandler,
    PATCH: NextHandler,
    DELETE: NextHandler,
    OPTIONS: NextHandler,
    HEAD: NextHandler
}

export async function createNextRouteLazy(
    controllerFactory: () => Promise<ApiRouteController> | ApiRouteController,
    basePath = ''
): Promise<RouterRecords> {
    ensureReflectMetadataLoaded();
    const controller = await controllerFactory();
    const router = new ApiRouter(basePath, controller);
    const handle: NextHandler = (req) => router.handle(req);
    return { GET: handle, POST: handle, PUT: handle, PATCH: handle, DELETE: handle, OPTIONS: handle, HEAD: handle };
}
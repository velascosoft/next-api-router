import type { NextRequest } from 'next/server';
import { ApiRouteController, ApiRouter } from '../http/routing/ApiRouter';
import { HTTP_METHOD } from '../types';

type NextHandler = (req: NextRequest) => Promise<Response> | Response;

export function createNextRoute(controller: ApiRouteController, basePath = ''): Record<HTTP_METHOD, NextHandler> {
    const router = new ApiRouter(basePath, controller);
    const handle: NextHandler = (req) => router.handle(req);

    return {
        GET: handle,
        POST: handle,
        PUT: handle,
        PATCH: handle,
        DELETE: handle,
        OPTIONS: handle,
        HEAD: handle,
    };
}
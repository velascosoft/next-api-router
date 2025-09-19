import { NextRequest, NextResponse } from 'next/server';

type ErrorHandler = (error: unknown, req: NextRequest, params: Record<string, string>) => Promise<NextResponse> | NextResponse;
interface ApiRouteController {
    [key: string]: any;
}
declare class ApiRouter {
    private routes;
    private basePath;
    private globalErrorHandler;
    constructor(basePath: string | undefined, controller: ApiRouteController);
    onError(handler: ErrorHandler): void;
    handle(req: NextRequest): Promise<NextResponse>;
}

type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

type NextHandler = () => Promise<NextResponse> | NextResponse;
type Middleware = (req: NextRequest, ctx: Record<string, unknown>, next: NextHandler) => Promise<NextResponse> | NextResponse;

interface RouteDefinition {
    path: string;
    method: HTTP_METHOD;
    handlerName: string;
}
declare function RequestMapping(path: string, method: HTTP_METHOD): (target: any, propertyKey: string) => void;
declare function Use(...middlewares: Middleware[]): (target: any, propertyKey: string) => void;
declare function UseController(...middlewares: Middleware[]): (constructor: any) => void;
declare function getRoutes(target: any): RouteDefinition[];
declare function getControllerMiddlewares(target: any): Middleware[];
declare function getRouteMiddlewares(target: any): Record<string, Middleware[]>;

export { type ApiRouteController, ApiRouter, type Middleware, type NextHandler, RequestMapping, type RouteDefinition, Use, UseController, getControllerMiddlewares, getRouteMiddlewares, getRoutes };

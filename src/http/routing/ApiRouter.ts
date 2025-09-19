import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { match as pathMatch } from "path-to-regexp";
import { Middleware } from "../middlewares";
import { getControllerMiddlewares, getRouteMiddlewares, getRoutes } from "../decorators/RoutingMapping";
import { HTTP_METHOD } from '../../types';

type ErrorHandler = (
    error: unknown,
    req: NextRequest,
    params: Record<string, string>
) => Promise<NextResponse> | NextResponse;

interface Route {
    method: HTTP_METHOD;
    path: string;
    matcher: ReturnType<typeof pathMatch>;
    handlers: Middleware[];
    onError?: ErrorHandler;
}

export interface ApiRouteController {
    [key: string]: any;
}

export class ApiRouter {
    private routes: Route[] = [];
    private basePath = '';
    private globalErrorHandler: ErrorHandler = (err, req) => {
        const reqPath = req.nextUrl.pathname;

        return NextResponse.json({
            success: false,
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            path: reqPath,
        }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }

    constructor(basePath = '', controller: ApiRouteController) {
        this.basePath = basePath;

        const controllerRoutes = getRoutes(controller);
        const classMiddlewares = getControllerMiddlewares(controller);
        const routeMwsMap = getRouteMiddlewares(controller);

        for (const route of controllerRoutes) {
            const fullPath = `${this.basePath}${route.path}`.replace(/\/+$/, '');
            const matcher = pathMatch(fullPath, { decode: decodeURIComponent });
            const handler: Middleware = controller[route.handlerName].bind(controller);

            const methodMiddlewares = routeMwsMap[route.handlerName] || [];

            this.routes.push({
                method: route.method,
                path: fullPath,
                matcher,
                handlers: [...classMiddlewares, ...methodMiddlewares, handler],
            })
        }
    }

    onError(handler: ErrorHandler) {
        this.globalErrorHandler = handler;
    }

    async handle(req: NextRequest): Promise<NextResponse> {
        const reqMethod = req.method?.toUpperCase();
        const reqPath = req.nextUrl.pathname.replace(/^\/api/, '');

        for (const route of this.routes) {
            if (route.method !== reqMethod) continue;
            const match = route.matcher(reqPath);
            if (match) {
                const params = match.params as Record<string, string>;
                const stack = [...route.handlers];

                const execute = async (i: number): Promise<NextResponse> => {
                    if (i < stack.length - 1) {
                        return stack[i](req, params, () => execute(i + 1));
                    }
                    return stack[i](req, params, () => execute(i));
                };

                try {
                    return await execute(0);
                } catch (err) {
                    if (route.onError) {
                        return await route.onError(err, req, params);
                    }
                    if (this.globalErrorHandler) {
                        return await this.globalErrorHandler(err, req, params);
                    }

                    return NextResponse.json({
                        success: false,
                        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
                    }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
                }
            }
        }

        return NextResponse.json({ sucess: false, message: 'Not Found' }, { status: StatusCodes.NOT_FOUND });
    }
}
import { HTTP_METHOD } from "../../types";
import { Middleware } from "../middlewares";
import { defineMetadata, getMetadata } from "../utils/metadata";

export interface RouteDefinition {
    path: string;
    method: HTTP_METHOD;
    handlerName: string;
}

const routesMetadataKey = Symbol('routes');
const routeMiddlewaresKey = Symbol('route_middlewares');
const controllerMiddlewaresKey = Symbol('controller_middlewares');

export function RequestMapping(path: string, method: HTTP_METHOD) {
    return function (target: any, propertyKey: string) {
        const routes: RouteDefinition[] = getMetadata(routesMetadataKey, target.constructor) || [];
        routes.push({
            path,
            method,
            handlerName: propertyKey,
        });
        
        defineMetadata(routesMetadataKey, routes, target.constructor);
    };
}

export function Use(...middlewares: Middleware[]) {
    return function (target: any, propertyKey: string) {
        const map: Record<string, Middleware[]> =
            getMetadata(routeMiddlewaresKey, target.constructor) || {};
        map[propertyKey] = [...(map[propertyKey] || []), ...middlewares];
        defineMetadata(routeMiddlewaresKey, map, target.constructor);
    };
}

export function UseController(...middlewares: Middleware[]) {
    return function (constructor: any) {
        const list: Middleware[] =
            getMetadata(controllerMiddlewaresKey, constructor) || [];
        defineMetadata(controllerMiddlewaresKey, [...list, ...middlewares], constructor);
    };
}

export function getRoutes(target: any): RouteDefinition[] {
    return getMetadata(routesMetadataKey, target.constructor) || [];
}

export function getControllerMiddlewares(target: any): Middleware[] {
    return getMetadata(controllerMiddlewaresKey, target.constructor) || [];
}

export function getRouteMiddlewares(target: any): Record<string, Middleware[]> {
    return getMetadata(routeMiddlewaresKey, target.constructor) || {};
}
import { HTTP_METHOD } from "../../types";
import { Middleware } from "../middlewares";

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
        const routes: RouteDefinition[] = Reflect.getMetadata(routesMetadataKey, target.constructor) || [];
        routes.push({
            path,
            method,
            handlerName: propertyKey,
        });
        Reflect.defineMetadata(routesMetadataKey, routes, target.constructor);
    };
}

export function Use(...middlewares: Middleware[]) {
    return function (target: any, propertyKey: string) {
        const map: Record<string, Middleware[]> =
            Reflect.getMetadata(routeMiddlewaresKey, target.constructor) || {};
        map[propertyKey] = [...(map[propertyKey] || []), ...middlewares];
        Reflect.defineMetadata(routeMiddlewaresKey, map, target.constructor);
    };
}

export function UseController(...middlewares: Middleware[]) {
    return function (constructor: any) {
        const list: Middleware[] =
            Reflect.getMetadata(controllerMiddlewaresKey, constructor) || [];
        Reflect.defineMetadata(controllerMiddlewaresKey, [...list, ...middlewares], constructor);
    };
}

export function getRoutes(target: any): RouteDefinition[] {
    return Reflect.getMetadata(routesMetadataKey, target.constructor) || [];
}

export function getControllerMiddlewares(target: any): Middleware[] {
    return Reflect.getMetadata(controllerMiddlewaresKey, target.constructor) || [];
}

export function getRouteMiddlewares(target: any): Record<string, Middleware[]> {
    return Reflect.getMetadata(routeMiddlewaresKey, target.constructor) || {};
}
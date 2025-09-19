import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { match } from 'path-to-regexp';

// src/http/routing/ApiRouter.ts

// src/http/decorators/RoutingMapping.ts
var routesMetadataKey = Symbol("routes");
var routeMiddlewaresKey = Symbol("route_middlewares");
var controllerMiddlewaresKey = Symbol("controller_middlewares");
function RequestMapping(path, method) {
  return function(target, propertyKey) {
    const routes = Reflect.getMetadata(routesMetadataKey, target.constructor) || [];
    routes.push({
      path,
      method,
      handlerName: propertyKey
    });
    Reflect.defineMetadata(routesMetadataKey, routes, target.constructor);
  };
}
function Use(...middlewares) {
  return function(target, propertyKey) {
    const map = Reflect.getMetadata(routeMiddlewaresKey, target.constructor) || {};
    map[propertyKey] = [...map[propertyKey] || [], ...middlewares];
    Reflect.defineMetadata(routeMiddlewaresKey, map, target.constructor);
  };
}
function UseController(...middlewares) {
  return function(constructor) {
    const list = Reflect.getMetadata(controllerMiddlewaresKey, constructor) || [];
    Reflect.defineMetadata(controllerMiddlewaresKey, [...list, ...middlewares], constructor);
  };
}
function getRoutes(target) {
  return Reflect.getMetadata(routesMetadataKey, target.constructor) || [];
}
function getControllerMiddlewares(target) {
  return Reflect.getMetadata(controllerMiddlewaresKey, target.constructor) || [];
}
function getRouteMiddlewares(target) {
  return Reflect.getMetadata(routeMiddlewaresKey, target.constructor) || {};
}

// src/http/routing/ApiRouter.ts
var ApiRouter = class {
  routes = [];
  basePath = "";
  globalErrorHandler = (err, req) => {
    const reqPath = req.nextUrl.pathname;
    return NextResponse.json({
      success: false,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      path: reqPath
    }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  };
  constructor(basePath = "", controller) {
    this.basePath = basePath;
    const controllerRoutes = getRoutes(controller);
    const classMiddlewares = getControllerMiddlewares(controller);
    const routeMwsMap = getRouteMiddlewares(controller);
    for (const route of controllerRoutes) {
      const fullPath = `${this.basePath}${route.path}`.replace(/\/+$/, "");
      const matcher = match(fullPath, { decode: decodeURIComponent });
      const handler = controller[route.handlerName].bind(controller);
      const methodMiddlewares = routeMwsMap[route.handlerName] || [];
      this.routes.push({
        method: route.method,
        path: fullPath,
        matcher,
        handlers: [...classMiddlewares, ...methodMiddlewares, handler]
      });
    }
  }
  onError(handler) {
    this.globalErrorHandler = handler;
  }
  async handle(req) {
    const reqMethod = req.method?.toUpperCase();
    const reqPath = req.nextUrl.pathname.replace(/^\/api/, "");
    for (const route of this.routes) {
      if (route.method !== reqMethod) continue;
      const match = route.matcher(reqPath);
      if (match) {
        const params = match.params;
        const stack = [...route.handlers];
        const execute = async (i) => {
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
    return NextResponse.json({ sucess: false, message: "Not Found" }, { status: StatusCodes.NOT_FOUND });
  }
};

export { ApiRouter, RequestMapping, Use, UseController, getControllerMiddlewares, getRouteMiddlewares, getRoutes };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
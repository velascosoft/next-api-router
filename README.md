# @velascosoftware/next-api-router

---

# English

Router with **decorators** and **middlewares** for the **App Router Next.js** (Route Handlers).  
Inspired at frameworks like Spring or Nest, but simplify and adapt to the Next philosophy.

## ✨ Features

- ✅ Decorators to define routes (`@RequestMapping`)  
- ✅ Middlewares at controller level (`@UseController`) or method level (`@Use`)  
- ✅ Compatible with `NextRequest` / `NextResponse` from `next/server`  
- ✅ Based on `path-to-regexp` for dynamic routes (`/users/:id`)  
- ✅ Written in **TypeScript** with included typings  
- ✅ **No dependency on `reflect-metadata`** → works out-of-the-box  

## 📦 Installation

```bash
npm install @velascosoftware/next-api-router
```

> Requires:  
> - Node.js >= 18.17  
> - Next.js >= 13.4  

## 🚀 Basic Usage

### 1. Define your controller with decorators

```ts
import { NextRequest, NextResponse } from 'next/server';
import { RequestMapping, Use, UseController, type Middleware } from '@velascosoftware/next-api-router';

const logger: Middleware = async (req, params, next) => {
  console.log(req.method, req.nextUrl.pathname, params);
  return next();
};

@UseController(logger)
class UserController {
  @RequestMapping('/users/:id', 'GET')
  async getOne(req: NextRequest, { id }: { id: string }) {
    return NextResponse.json({ id });
  }

  @Use(async (req, params, next) => {
    console.log('Check auth');
    return next();
  })
  @RequestMapping('/users', 'POST')
  async create(req: NextRequest) {
    const body = await req.json();
    return NextResponse.json({ created: body }, { status: 201 });
  }
}

export { UserController };
```

### 2. Connect the router in your `route.ts`

```ts
// app/api/users/route.ts
export const runtime = 'nodejs'; //Recommended, but not neccesary

import { createNextRoute } from '@velascosoftware/next-api-router';
import { UserController } from '@/controllers/UserController';

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD } =
  createNextRoute(new UserController(), '/users');
```

## ⚡ Middlewares

A **middleware** is a function that receives `(req, params, next)` and returns a `NextResponse`:

```ts
import type { Middleware } from '@velascosoftware/next-api-router';

const authMiddleware: Middleware = async (req, params, next) => {
  if (!req.headers.get('authorization')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return next();
};
```

They can be applied with `@UseController(...)` or `@Use(...)` on a specific handler.

## 🛑 Error Handling

By default, `ApiRouter` catches errors and returns a `500`.  

## 📖 Exported API

```ts
// Router
export { ApiRouter, type ApiRouteController };

// Decorators
export {
  RequestMapping,
  Use,
  UseController,
  getRoutes,
  getControllerMiddlewares,
  getRouteMiddlewares,
  type RouteDefinition
};

// Types
export type { Middleware, NextHandler };

// DX Helpers
export { createNextRoute } from './next/createNextRoute';
export { createCatchAllHandlers } from './next/createCatchAllHandlers';
```

## 📂 Recommended structure

```
app/
  api/
    users/
      route.ts   ← mount the router here
src/
  controllers/
    UserController.ts
```

---

# Español

Router con **decoradores** y **middlewares** para el **App Router de Next.js** (Route Handlers).  
Inspirado en frameworks como Spring o Nest, pero simplificado y adaptado a la filosofía de Next.


## ✨ Características

- ✅ Decoradores para definir rutas (`@RequestMapping`)  
- ✅ Middlewares a nivel controlador (`@UseController`) o método (`@Use`)  
- ✅ Compatible con `NextRequest` / `NextResponse` de `next/server`  
- ✅ Basado en `path-to-regexp` para rutas dinámicas (`/users/:id`)  
- ✅ Escrito en **TypeScript** con tipados incluidos  
- ✅ **Sin dependencia de `reflect-metadata`** → funciona out-of-the-box  

## 📦 Instalación

```bash
npm install @velascosoftware/next-api-router
```

> Requiere:  
> - Node.js >= 18.17  
> - Next.js >= 13.4  

## 🚀 Uso básico

### 1. Define tu controlador con decoradores

```ts
import { NextRequest, NextResponse } from 'next/server';
import { RequestMapping, Use, UseController, type Middleware } from '@velascosoftware/next-api-router';

const logger: Middleware = async (req, params, next) => {
  console.log(req.method, req.nextUrl.pathname, params);
  return next();
};

@UseController(logger)
class UserController {
  @RequestMapping('/users/:id', 'GET')
  async getOne(req: NextRequest, { id }: { id: string }) {
    return NextResponse.json({ id });
  }

  @Use(async (req, params, next) => {
    console.log('Check auth');
    return next();
  })
  @RequestMapping('/users', 'POST')
  async create(req: NextRequest) {
    const body = await req.json();
    return NextResponse.json({ created: body }, { status: 201 });
  }
}

export { UserController };
```

### 2. Conecta el router en tu `route.ts`

```ts
// app/api/users/route.ts
export const runtime = 'nodejs'; //Recomendado, pero no necesario

import { createNextRoute } from '@velascosoftware/next-api-router';
import { UserController } from '@/controllers/UserController';

export const { GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD } =
  createNextRoute(new UserController(), '/users');
```

## ⚡ Middlewares

Un **middleware** es una función que recibe `(req, params, next)` y devuelve un `NextResponse`:

```ts
import type { Middleware } from '@velascosoftware/next-api-router';

const authMiddleware: Middleware = async (req, params, next) => {
  if (!req.headers.get('authorization')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return next();
};
```

Se pueden aplicar con `@UseController(...)` o `@Use(...)` en un handler específico.

## 🛑 Manejo de errores

Por defecto, `ApiRouter` atrapa errores y devuelve un `500`.  

## 📖 API Exportada

```ts
// Router
export { ApiRouter, type ApiRouteController };

// Decoradores
export {
  RequestMapping,
  Use,
  UseController,
  getRoutes,
  getControllerMiddlewares,
  getRouteMiddlewares,
  type RouteDefinition
};

// Tipos
export type { Middleware, NextHandler };

// Helpers DX
export { createNextRoute } from './next/createNextRoute';
export { createCatchAllHandlers } from './next/createCatchAllHandlers';
```

## 📂 Estructura recomendada

```
app/
  api/
    users/
      route.ts   ← monta el router aquí
src/
  controllers/
    UserController.ts
```

---

## 📜 License

MIT © 2025 Velasco Software

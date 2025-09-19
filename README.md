# @velascosoft/next-api-router

Router con **decorators** y **middlewares** para el **App Router de Next.js** (Route Handlers).  
Inspirado en frameworks como Spring o Nest, pero simplificado y adaptado a la filosofía de Next.

---

## ✨ Características

- ✅ Decorators para definir rutas (`@RequestMapping`)  
- ✅ Middlewares a nivel controlador (`@UseController`) o método (`@Use`)  
- ✅ Compatible con `NextRequest` / `NextResponse` de `next/server`  
- ✅ Manejo centralizado de errores (global o por ruta)  
- ✅ Basado en `path-to-regexp` para rutas dinámicas (`/users/:id`)  
- ✅ Escrito en **TypeScript** con tipados incluidos  

---

## 📦 Instalación

```bash
npm install @velascosoft/next-api-router reflect-metadata
```

> Requiere:  
> - Node.js >= 18.17  
> - Next.js >= 13.4  
> - Importar `reflect-metadata` en tu entrypoint (ej. `app/api/route.ts` o `src/app/layout.ts`)

---

## 🚀 Uso básico

### 1. Define tu controlador con decorators

```ts
import { NextRequest, NextResponse } from 'next/server';
import { RequestMapping, Use, UseController, type Middleware } from '@tu-scope/next-api-router';

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
```

### 2. Conecta el router en tus `route.ts`

```ts
import 'reflect-metadata';
import { ApiRouter } from '@tu-scope/next-api-router';

const router = new ApiRouter('', new UserController());

export async function GET(req: NextRequest) {
  return router.handle(req);
}
export async function POST(req: NextRequest) {
  return router.handle(req);
}
```

---

## ⚡ Middlewares

Un **middleware** es una función que recibe `(req, params, next)` y devuelve un `NextResponse`:

```ts
import type { Middleware } from '@tu-scope/next-api-router';

const authMiddleware: Middleware = async (req, params, next) => {
  if (!req.headers.get('authorization')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return next();
};
```

Se pueden aplicar con `@UseController(...)` o `@Use(...)` en un handler específico.

---

## 📖 API Exportada

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

// Tipos
export type { Middleware, NextHandler };

// Errores (si usas ExternalApiError)
export { ExternalApiError };
```

---

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

MIT © 2025 [Tu Nombre]

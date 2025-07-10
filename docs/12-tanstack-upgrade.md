We merged "devinxi" alpha to main. please follow the steps below to upgrade.

Move to the framework adapter
As mentioned earlier in this message, we're moving all released to framework-specific adapters. As such, we'll no longer be publishing/updating the @tanstack/start package.

npm uninstall @tanstack/start
npm install @tanstack/react-start
Migration guide
We've made a few key breaking changes that you'll need to make when upgrading
to v1.121.0.

These changes have been broken down into the large sweeping changes, smaller changes,
and optional ones.

Important

Before going through this guide, make sure that you've backed up your project and have it
committed to version control (like Git) in a working state.

Core Migration
Let's go! 🚅

Swap to Vite
You'll need to remove the vinxi package and install Vite 6+.

npm uninstall vinxi
npm install vite
Update your packages (only for alpha).

You'll need to update any of the TanStack Router or Start packages to the alpha branch.

# This is not an exhaustive list of packages.
# Look at your `package.json` for the packages you'd need to upgrade.
npm install @tanstack/react-router@alpha @tanstack/react-router-devtools@alpha
npm install @tanstack/react-start@alpha
If you are using SolidJS, swap out the react- prefix for solid-.

Update your scripts
You'll need to update the scripts in your package.json to use the Vite dev and build commands.

{
  "scripts": {
    "dev": "vite dev --port 3000",
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
app.config.ts to vite.config.ts
TanStack Start is now a Vite plugin. So, register the plugin in a Vite config file and delete app.config.ts.

// vite.config.ts
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // tailwindcss(), sentry(), ...
    tanstackStart({ /** Add your options here */ })
  ]
})
Rename app/ to src/
We're staying Vite-native. All your source code should be moved from app/ to src/.

mv app src
if you use a path alias in your tsconfig.json, make sure to also update that to src:

 "paths": {
      "@/*": [
        "./src/*"
      ]
    },
You need src/router.tsx
You'll need to make sure that you have your createRouter function
exported out of src/router.tsx.

// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
Delete src/client.tsx and src/ssr.tsx
If you did NOT customize your src/client.tsx and src/ssr.tsx files, then you can delete them.

rm -rf src/client.tsx
rm -rf src/ssr.tsx
However, if you did customize the these files, like installing when installing the Clerk adapter,
then you'll need to rename the src/ssr.tsx file to src/server.tsx.

mv src/ssr.tsx src/server.tsx
If you are using a custom server.tsx entry, then the overall structure of the file (including
the default export) should look something similar to this.

// src/server.tsx
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

import { createRouter } from './router'

export default createStartHandler({
  createRouter,
})(defaultStreamHandler)
Devinxi - Changes to your TanStack Start config
TODO: List out all the changes

We've moved around some of the options in the TanStack Start config.

// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  plugins: [
    tanstackStart({ 
	    // The changes are...
	  })
  ]
})
Devinxi - Migrating from API Routes to Server Routes
API routes have seen a huge improvement and we're now calling them "Server Routes".

First, delete the src/api.ts entry handler.

rm -rf src/api.ts
In your API routes files, you'll need to make the following changes to turn them into Server Routes.

// src/routes/api/users.tsx
import { json } from '@tanstack/react-start'
- import { createAPIFileRoute } from '@tanstack/react-start/api'
import { fetchUsers } from '../../utils/users'

- export const APIRoute = createAPIFileRoute('/api/users')({
+ export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request, params }) => {
    console.info('Fetching users... @', request.url)
    const users = await fetchUsers()
    // You can now call Server Functions from here 🥳
    return json(users)
  },
})
You more easily find these routes by search for the imports from @tanstack/react-start/api.

Not migrating at this time
If you decide that right now is not the appropriate time to migrate you will need to pin your versions of @tanstack/react-start (as well as several other related libraries). We have built a simple helper function into create-start-app to help you with this process: npx create-start-app@latest pin-versions. Simply execute that command in your application's root directory and the command will make the necessary adjustments to your package.json file. Then you can remove the node_modules directory as well as package lock files, and re-install and you should be able to continue with your development and upgrade when you choose.


11:03:16.858 Running build in Washington, D.C., USA (East) – iad1
11:03:16.859 Build machine configuration: 2 cores, 8 GB
11:03:16.995 Cloning github.com/tsipan1997-byte/Nolimitgoods (Branch: main, Commit: d5e2322)
11:03:17.760 Cloning completed: 764.000ms
11:03:18.579 Restored build cache from previous deployment (FEsZoTmDo6oM4Ri23BaGYrm8BKEe)
11:03:18.914 Running "vercel build"
11:03:18.925 Vercel CLI 62.1.0
11:03:19.168 Running "install" command: `npm install --legacy-peer-deps`...
11:04:40.911 
11:04:40.911 up to date, audited 1070 packages in 1m
11:04:40.911 
11:04:40.911 197 packages are looking for funding
11:04:40.911   run `npm fund` for details
11:04:41.404 
11:04:41.404 34 vulnerabilities (3 low, 9 moderate, 18 high, 4 critical)
11:04:41.404 
11:04:41.404 To address all issues (including breaking changes), run:
11:04:41.404   npm audit fix --force
11:04:41.404 
11:04:41.404 Run `npm audit` for details.
11:04:41.406 npm warn install-scripts 7 packages have install scripts not yet covered by allowScripts:
11:04:41.406 npm warn install-scripts   @prisma/client@6.7.0 (postinstall: node scripts/postinstall.js)
11:04:41.407 npm warn install-scripts   @prisma/engines@6.7.0 (postinstall: node scripts/postinstall.js)
11:04:41.407 npm warn install-scripts   es5-ext@0.10.64 (postinstall:  node -e "try{require('./_postinstall')}catch(e){}" || exit 0)
11:04:41.407 npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
11:04:41.408 npm warn install-scripts   prisma@6.7.0 (preinstall: node scripts/preinstall-entry.js)
11:04:41.408 npm warn install-scripts   esbuild@0.25.12 (postinstall: node install.js)
11:04:41.408 npm warn install-scripts   unrs-resolver@1.12.2 (postinstall: node postinstall.js)
11:04:41.408 npm warn install-scripts
11:04:41.409 npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
11:04:41.488 Detected Next.js version: 14.2.28
11:04:41.489 Running "npx prisma generate && next build"
11:04:43.262 Prisma schema loaded from prisma/schema.prisma
11:04:43.499 
11:04:43.500 ✔ Generated Prisma Client (v6.7.0) to ./../../home/ubuntu/logistics_landing_page/nextjs_space/node_modules/.prisma/client in 118ms
11:04:43.500 
11:04:43.500 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
11:04:43.500 
11:04:43.501 Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
11:04:43.501 
11:04:44.677   ▲ Next.js 14.2.28
11:04:44.677 
11:04:44.699    Creating an optimized production build ...
11:04:48.570 Failed to compile.
11:04:48.571 
11:04:48.571 ./app/components/features-section.tsx
11:04:48.572 Error: 
11:04:48.572   x Unexpected token `section`. Expected jsx identifier
11:04:48.572     ,-[/vercel/path0/app/components/features-section.tsx:18:1]
11:04:48.572  18 |   const isUk = language === 'uk' || (language as string) === 'ua';
11:04:48.572  19 | 
11:04:48.572  20 |   return (
11:04:48.572  21 |     <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
11:04:48.572     :      ^^^^^^^
11:04:48.572  22 |       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
11:04:48.573  23 |         
11:04:48.573  24 |         {/* Заголовок */}
11:04:48.573     `----
11:04:48.573 
11:04:48.573 Caused by:
11:04:48.573     Syntax Error
11:04:48.573 
11:04:48.573 Import trace for requested module:
11:04:48.573 ./app/components/features-section.tsx
11:04:48.573 ./app/page.tsx
11:04:48.573 
11:04:48.582 
11:04:48.582 > Build failed because of webpack errors
11:04:48.619 Error: Command "npx prisma generate && next build" exited with 1

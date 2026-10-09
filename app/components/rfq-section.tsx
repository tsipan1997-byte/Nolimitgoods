16:44:26.806 Running build in Washington, D.C., USA (East) – iad1
16:44:26.807 Build machine configuration: 2 cores, 8 GB
16:44:26.884 Cloning github.com/tsipan1997-byte/Nolimitgoods (Branch: main, Commit: 59f37a4)
16:44:26.885 Skipping build cache, deployment was triggered without cache.
16:44:27.623 Cloning completed: 739.000ms
16:44:28.338 Running "vercel build"
16:44:28.353 Vercel CLI 62.7.0
16:44:29.959 Running "install" command: `npm install --legacy-peer-deps`...
16:45:36.890 npm warn deprecated mumath@3.3.4: Redundant dependency in your project.
16:45:41.395 npm warn deprecated uuid@8.3.2: uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028).
16:45:47.541 npm warn deprecated recharts@2.15.3: 1.x and 2.x branches are no longer active. Bump to Recharts v3 to receive latest features and bugfixes. See https://github.com/recharts/recharts/wiki/3.0-migration-guide
16:45:48.664 npm warn deprecated eslint@9.24.0: This version is no longer supported. Please see https://eslint.org/version-support for other options.
16:45:48.865 npm warn deprecated @plotly/mapbox-gl@1.13.4: This package is deprecated as of August 2026. plotly.js v4 uses MapLibre for map traces — see https://github.com/maplibre/maplibre-gl-js.
16:46:57.668 npm warn deprecated next@14.2.28: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.
16:47:01.414 
16:47:01.414 added 1069 packages, and audited 1070 packages in 3m
16:47:01.415 
16:47:01.415 197 packages are looking for funding
16:47:01.415   run `npm fund` for details
16:47:01.778 
16:47:01.778 34 vulnerabilities (3 low, 9 moderate, 18 high, 4 critical)
16:47:01.779 
16:47:01.779 To address all issues (including breaking changes), run:
16:47:01.779   npm audit fix --force
16:47:01.779 
16:47:01.779 Run `npm audit` for details.
16:47:01.780 npm warn install-scripts 7 packages have install scripts not yet covered by allowScripts:
16:47:01.780 npm warn install-scripts   @prisma/client@6.7.0 (postinstall: node scripts/postinstall.js)
16:47:01.780 npm warn install-scripts   prisma@6.7.0 (preinstall: node scripts/preinstall-entry.js)
16:47:01.780 npm warn install-scripts   unrs-resolver@1.12.2 (postinstall: node postinstall.js)
16:47:01.780 npm warn install-scripts   es5-ext@0.10.64 (postinstall:  node -e "try{require('./_postinstall')}catch(e){}" || exit 0)
16:47:01.781 npm warn install-scripts   @prisma/engines@6.7.0 (postinstall: node scripts/postinstall.js)
16:47:01.781 npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
16:47:01.781 npm warn install-scripts   esbuild@0.25.12 (postinstall: node install.js)
16:47:01.781 npm warn install-scripts
16:47:01.781 npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
16:47:01.853 Detected Next.js version: 14.2.28
16:47:01.854 Running "npx prisma generate && next build"
16:47:03.018 Prisma schema loaded from prisma/schema.prisma
16:47:03.296 
16:47:03.299 ✔ Generated Prisma Client (v6.7.0) to ./../../home/ubuntu/logistics_landing_page/nextjs_space/node_modules/.prisma/client in 30ms
16:47:03.299 
16:47:03.299 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
16:47:03.299 
16:47:03.299 Help us improve the Prisma ORM for everyone. Share your feedback in a short 2-min survey: https://pris.ly/orm/survey/release-5-22
16:47:03.300 
16:47:03.980 Attention: Next.js now collects completely anonymous telemetry regarding usage.
16:47:03.980 This information is used to shape Next.js' roadmap and prioritize features.
16:47:03.980 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
16:47:03.980 https://nextjs.org/telemetry
16:47:03.980 
16:47:04.035   ▲ Next.js 14.2.28
16:47:04.035 
16:47:04.052    Creating an optimized production build ...
16:47:07.964 Failed to compile.
16:47:07.964 
16:47:07.965 ./app/components/rfq-section.tsx
16:47:07.965 Error: 
16:47:07.965   x Unexpected token `section`. Expected jsx identifier
16:47:07.965      ,-[/vercel/path0/app/components/rfq-section.tsx:185:1]
16:47:07.965  185 |   };
16:47:07.965  186 | 
16:47:07.965  187 |   return (
16:47:07.966  188 |     <section id="rfq" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
16:47:07.966      :      ^^^^^^^
16:47:07.966  189 |       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
16:47:07.966  190 | 
16:47:07.966  191 |       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
16:47:07.966      `----
16:47:07.966 
16:47:07.966 Caused by:
16:47:07.966     Syntax Error
16:47:07.966 
16:47:07.967 Import trace for requested module:
16:47:07.967 ./app/components/rfq-section.tsx
16:47:07.967 ./app/page.tsx
16:47:07.967 
16:47:07.975 
16:47:07.976 > Build failed because of webpack errors
16:47:07.997 Error: Command "npx prisma generate && next build" exited with 1

14:06:06.582 Running build in Washington, D.C., USA (East) – iad1
14:06:06.583 Build machine configuration: 2 cores, 8 GB
14:06:06.721 Cloning github.com/tsipan1997-byte/Nolimitgoods (Branch: main, Commit: 2ee0a39)
14:06:07.256 Cloning completed: 535.000ms
14:06:09.126 Restored build cache from previous deployment (5ArrXGS3DPZLPpiqTRwPksNvy5jZ)
14:06:09.583 Running "vercel build"
14:06:09.594 Vercel CLI 62.1.0
14:06:10.207 Running "install" command: `npm install --legacy-peer-deps`...
14:07:23.847 
14:07:23.849 up to date, audited 1070 packages in 1m
14:07:23.850 
14:07:23.850 197 packages are looking for funding
14:07:23.850   run `npm fund` for details
14:07:24.241 
14:07:24.242 34 vulnerabilities (3 low, 9 moderate, 18 high, 4 critical)
14:07:24.242 
14:07:24.242 To address all issues (including breaking changes), run:
14:07:24.242   npm audit fix --force
14:07:24.242 
14:07:24.242 Run `npm audit` for details.
14:07:24.243 npm warn install-scripts 7 packages have install scripts not yet covered by allowScripts:
14:07:24.243 npm warn install-scripts   @prisma/client@6.7.0 (postinstall: node scripts/postinstall.js)
14:07:24.243 npm warn install-scripts   @prisma/engines@6.7.0 (postinstall: node scripts/postinstall.js)
14:07:24.243 npm warn install-scripts   es5-ext@0.10.64 (postinstall:  node -e "try{require('./_postinstall')}catch(e){}" || exit 0)
14:07:24.244 npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
14:07:24.244 npm warn install-scripts   prisma@6.7.0 (preinstall: node scripts/preinstall-entry.js)
14:07:24.244 npm warn install-scripts   esbuild@0.25.12 (postinstall: node install.js)
14:07:24.244 npm warn install-scripts   unrs-resolver@1.12.2 (postinstall: node postinstall.js)
14:07:24.244 npm warn install-scripts
14:07:24.244 npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
14:07:24.317 Detected Next.js version: 14.2.28
14:07:24.318 Running "npx prisma generate && next build"
14:07:25.290 Prisma schema loaded from prisma/schema.prisma
14:07:25.441 
14:07:25.441 ✔ Generated Prisma Client (v6.7.0) to ./../../home/ubuntu/logistics_landing_page/nextjs_space/node_modules/.prisma/client in 79ms
14:07:25.441 
14:07:25.441 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
14:07:25.441 
14:07:25.441 Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
14:07:25.441 
14:07:26.118   ▲ Next.js 14.2.28
14:07:26.118 
14:07:26.132    Creating an optimized production build ...
14:07:28.151 Failed to compile.
14:07:28.151 
14:07:28.152 ./app/components/rfq-section.tsx
14:07:28.152 Error: 
14:07:28.152   x Unexpected token `section`. Expected jsx identifier
14:07:28.152      ,-[/vercel/path0/app/components/rfq-section.tsx:165:1]
14:07:28.152  165 |   };
14:07:28.152  166 | 
14:07:28.152  167 |   return (
14:07:28.152  168 |     <section id="rfq" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
14:07:28.152      :      ^^^^^^^
14:07:28.152  169 |       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
14:07:28.152  170 | 
14:07:28.153  171 |       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
14:07:28.153      `----
14:07:28.153 
14:07:28.154 Caused by:
14:07:28.154     Syntax Error
14:07:28.154 
14:07:28.154 Import trace for requested module:
14:07:28.154 ./app/components/rfq-section.tsx
14:07:28.154 ./app/page.tsx
14:07:28.154 
14:07:28.165 
14:07:28.165 > Build failed because of webpack errors
14:07:28.184 Error: Command "npx prisma generate && next build" exited with 1

11:16:48.864 Running build in Washington, D.C., USA (East) – iad1
11:16:48.864 Build machine configuration: 2 cores, 8 GB
11:16:48.981 Cloning github.com/tsipan1997-byte/Nolimitgoods (Branch: main, Commit: 22d31a6)
11:16:49.537 Cloning completed: 556.000ms
11:16:50.242 Restored build cache from previous deployment (EtCZfuHH89K64VQUGvwFTUUWNVce)
11:16:50.587 Running "vercel build"
11:16:50.597 Vercel CLI 62.1.0
11:16:50.845 Running "install" command: `npm install --legacy-peer-deps`...
11:17:57.726 
11:17:57.726 up to date, audited 1070 packages in 1m
11:17:57.726 
11:17:57.726 197 packages are looking for funding
11:17:57.726   run `npm fund` for details
11:17:58.076 
11:17:58.076 34 vulnerabilities (3 low, 9 moderate, 18 high, 4 critical)
11:17:58.076 
11:17:58.076 To address all issues (including breaking changes), run:
11:17:58.076   npm audit fix --force
11:17:58.076 
11:17:58.076 Run `npm audit` for details.
11:17:58.077 npm warn install-scripts 7 packages have install scripts not yet covered by allowScripts:
11:17:58.077 npm warn install-scripts   @prisma/client@6.7.0 (postinstall: node scripts/postinstall.js)
11:17:58.077 npm warn install-scripts   @prisma/engines@6.7.0 (postinstall: node scripts/postinstall.js)
11:17:58.077 npm warn install-scripts   es5-ext@0.10.64 (postinstall:  node -e "try{require('./_postinstall')}catch(e){}" || exit 0)
11:17:58.078 npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
11:17:58.078 npm warn install-scripts   prisma@6.7.0 (preinstall: node scripts/preinstall-entry.js)
11:17:58.079 npm warn install-scripts   esbuild@0.25.12 (postinstall: node install.js)
11:17:58.079 npm warn install-scripts   unrs-resolver@1.12.2 (postinstall: node postinstall.js)
11:17:58.079 npm warn install-scripts
11:17:58.079 npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
11:17:58.141 Detected Next.js version: 14.2.28
11:17:58.142 Running "npx prisma generate && next build"
11:17:58.917 Prisma schema loaded from prisma/schema.prisma
11:17:59.056 
11:17:59.057 ✔ Generated Prisma Client (v6.7.0) to ./../../home/ubuntu/logistics_landing_page/nextjs_space/node_modules/.prisma/client in 68ms
11:17:59.057 
11:17:59.057 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
11:17:59.057 
11:17:59.057 Tip: Want real-time updates to your database without manual polling? Discover how with Pulse: https://pris.ly/tip-0-pulse
11:17:59.057 
11:17:59.719   ▲ Next.js 14.2.28
11:17:59.719 
11:17:59.734    Creating an optimized production build ...
11:18:01.987 Failed to compile.
11:18:01.988 
11:18:01.988 ./app/components/rfq-section.tsx
11:18:01.988 Error: 
11:18:01.988   x Unexpected token `section`. Expected jsx identifier
11:18:01.988      ,-[/vercel/path0/app/components/rfq-section.tsx:102:1]
11:18:01.989  102 |   };
11:18:01.989  103 | 
11:18:01.989  104 |   return (
11:18:01.989  105 |     <section id="rfq" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
11:18:01.989      :      ^^^^^^^
11:18:01.989  106 |       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
11:18:01.989  107 | 
11:18:01.989  108 |       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
11:18:01.989      `----
11:18:01.989 
11:18:01.989 Caused by:
11:18:01.989     Syntax Error
11:18:01.989 
11:18:01.989 Import trace for requested module:
11:18:01.990 ./app/components/rfq-section.tsx
11:18:01.990 ./app/page.tsx
11:18:01.990 
11:18:01.999 
11:18:01.999 > Build failed because of webpack errors
11:18:02.019 Error: Command "npx prisma generate && next build" exited with 1

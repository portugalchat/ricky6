# RAILWAY DEPLOYMENT - PROBLEMA RESOLVIDO ✅

## ERRO CORRIGIDO
O erro `TypeError [ERR_INVALID_ARG_TYPE]: The "paths[0]" argument must be of type string. Received undefined` foi resolvido.

## SOLUÇÃO IMPLEMENTADA
1. **Criado `esbuild.config.js`** - substitui `import.meta.dirname` por `"."` durante o build
2. **Actualizado `Dockerfile`** - usa o novo script de build personalizado
3. **Testado localmente** - servidor de produção funciona sem erros

## FICHEIROS FINAIS PARA GITHUB
```
✅ Dockerfile (corrigido)
✅ esbuild.config.js (novo)
✅ package.json + package-lock.json
✅ client/ (com shared-types.ts)
✅ server/
✅ shared/
```

## COMANDOS RAILWAY (via Docker)
```bash
npm install                    # Instala dependências
npm run build:client          # Build do frontend
node esbuild.config.js         # Build do backend (corrigido)
npm start                      # Inicia aplicação
```

## ENVIRONMENT VARIABLES NECESSÁRIAS
- `NODE_ENV=production`
- `DATABASE_URL` (Supabase)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REDIS_URL` (Upstash)

O deploy no Railway deve agora funcionar sem erros de Node.js.
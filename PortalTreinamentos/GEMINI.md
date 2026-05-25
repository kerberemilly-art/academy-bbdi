# BBDI Academy - Portal de Treinamentos

Instruções fundamentais para o desenvolvimento e manutenção do projeto.

## Contexto do Projeto
- **Localização:** `PortalTreinamentos/`
- **Backend:** Go (localizado em `go-backend/`).
- **Frontend:** React + Vite (localizado em `src/`).
- **Banco de Dados:** SQLite em `data/portal-treinamentos.sqlite`.
- **Deploy:** Coolify via Docker (`Dockerfile` na raiz da pasta).

## Regras de Desenvolvimento
1. **Modo Caveman:** Sempre responda de forma técnica, direta e sem "fluff" (comunicação ultra-comprimida).
2. **Sincronização:** Novos treinamentos criados via IA (PDF) são salvos no SQLite. A lógica de catálogo em `src/data/trainingCatalog.js` e estatísticas em `src/data/trainingStats.js` deve sempre mesclar dados locais (hardcoded) com dados do backend.
3. **Segurança:** Nunca comite o arquivo `.env`. Ele contém chaves sensíveis (Mistral, Groq).
4. **Deploy:** O build do frontend deve sempre ser movido para `go-backend/dist/` antes de compilar o binário Go para que o comando `//go:embed` funcione.

## Comandos Úteis
- **Build Frontend:** `npm run build`
- **Mover Build:** `Move-Item -Path ./dist -Destination ./go-backend/dist -Force`
- **Rodar Backend:** `cd go-backend ; go run .`
- **Sync Git:** `git add . ; git commit -m "..." ; git push origin main`

---
*Lembre-se: Verifique sempre se o SQLite está incluído no commit para persistir novos treinamentos no GitHub.*

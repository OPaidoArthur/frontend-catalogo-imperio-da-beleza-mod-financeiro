# Frontend Catalogo

## Rodar local

```bash
npm install
npm run dev
```

## Variaveis de ambiente

Frontend (publicas):

- `NEXT_PUBLIC_API_URL` (ex: `http://127.0.0.1:8000`)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (ex: `5511999999999`)
- `NEXT_PUBLIC_COMPANY_EMAIL` (ex: `imperiodabelezavariedades@gmail.com`)

Email (servidor):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE` (`true` ou `false`)
- `SMTP_FROM` (ex: `catalogo@seudominio.com`)
- `COMPANY_EMAIL` (ex: `imperiodabelezavariedades@gmail.com`)
- `CATALOG_API_KEY` (mesma chave configurada no backend)

## Build

```bash
npm run build
npm run start
```

## Deploy no Render (frontend_catalogo)

- **Root Directory**: `frontend_catalogo`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` (URL do backend online)
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `CATALOG_API_KEY` (mesma chave do backend)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`
  - `SMTP_FROM`, `COMPANY_EMAIL`

> O catálogo usa apenas `/catalog/products` e `/catalog/orders`, então pode deixar `AUTH_REQUIRED=true` no backend sem expor dados sensíveis.

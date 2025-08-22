# TV Doutor – Supabase Client Package

Pacote de integração Supabase para o Sistema de Contratos.

## Instalação
```bash
npm i @supabase/supabase-js
```

## Variáveis de ambiente (Vite)
Copie `.env.example` para `.env.local` e preencha:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Uso rápido
```ts
import { searchContracts, getMonthlyRevenue } from '@/lib'

const contratos = await searchContracts({ q: 'São Paulo', status: 'approved', limit: 10 })
const receita   = await getMonthlyRevenue(2025)
```

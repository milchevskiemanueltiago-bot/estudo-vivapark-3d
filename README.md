# Estudo VivaPark 3D

Estudo de investimento em 3D do VivaPark (Porto Belo) e da Meia Praia (Itapema): maquete 3D que gira com o mouse e com a rolagem, sol de verão e inverno por fachada, ranking com modelo de pontuação transparente, dossiê de cada obra e cenários de valorização (premissas).

## Rodar local

```
npm install
npm run dev
```

## Publicar no GitHub Pages

1. Crie um repositório e envie o projeto (`git push -u origin main`).
2. Em Settings > Pages, escolha "GitHub Actions". O workflow `.github/workflows/pages.yml` publica a cada push na `main`.
3. Atenção: Pages em repositório privado exige plano pago do GitHub. Em repositório público o estudo fica aberto a qualquer pessoa.

## Dados

`src/data.ts` (obras, preços do DWV de 22/10/2026, pavimentos e lazer dos portais), `src/score.ts` (pesos e notas) e `src/sun.ts` (geometria solar). Valores ausentes aparecem como "—"; pavimentos não publicados usam 14 andares só como ilustração.

Este material é análise de mercado com premissas declaradas, não recomendação de investimento.

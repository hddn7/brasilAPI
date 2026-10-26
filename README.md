# Feriados do Brasil

Página estática que consulta os feriados nacionais da [BrasilAPI](https://brasilapi.com.br/) pelo ano informado.

## Executar localmente

Na pasta do projeto:

```powershell
python -m http.server 4173
```

Acesse `http://localhost:4173`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie os arquivos da pasta para o repositório, na branch `main`:

```powershell
git init
git add index.html styles.css app.js README.md
git commit -m "Criar calendário de feriados"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

3. No repositório do GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e a pasta `/ (root)` e confirme.

O GitHub Pages exibirá o endereço público em Settings > Pages. A aplicação usa chamadas HTTPS para a BrasilAPI, então o site publicado deve ser servido por HTTPS.

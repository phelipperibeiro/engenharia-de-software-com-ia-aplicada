# 02 — Do `npm start` ao código no navegador

## O que o `npm start` faz aqui?

Em cada parte, o `package.json` define algo como:

```json
"start": "browser-sync -w . --server --files '...' --port 3000"
```

Significado rápido:

```
browser-sync
    |
    +-- --server .     ==> servir arquivos da pasta atual (como um site estático)
    |
    +-- --files ...    ==> observar mudanças nesses arquivos e recarregar o browser
    |
    +-- --port 3000    ==> http://localhost:3000
```

Importante: **servir** e **observar mudanças** são coisas diferentes. Tudo que existe no disco (por exemplo `src/**/*.js`) já pode ser baixado pelo navegador; a lista `--files` só diz **em quais mudanças** o live-reload dispara (no exemplo original às vezes falta glob para `src/` — ver comentários no projeto).

---

## Como o `index.html` “liga” o JavaScript

Trecho típico:

```html
<script type="module" src="./src/index.js"></script>
```

Fluxo:

```
+------------------+
|    index.html    |
+------------------+
         |
         |  navegador pede GET ./src/index.js
         v
+------------------+
|   src/index.js   |  importa outros .js (controllers, services...)
+------------------+
         |
         |  cada import vira outro GET (módulo ES)
         v
+------------------+
| controller/*.js  |
| service/*.js     |
| ...              |
+------------------+
```

- **`type="module"`** habilita `import` / `export` (ES modules).
- Caminhos relativos (`./controller/Foo.js`) são resolvidos em relação ao **arquivo atual**.

---

## Por que aparece `new Worker('/src/workers/...')`?

Workers são carregados por **URL**. A barra inicial `/` significa “raiz do site” que o Browser Sync está servindo:

```
Origin: http://localhost:3000
Worker URL:  http://localhost:3000/src/workers/modelTrainingWorker.js
```

Isso é independente do `import` em módulos: o worker é outro arquivo JS executado em **thread separada**.

---

## Diagrama: primeira carga da página

```
   Usuário abre http://localhost:3000
              |
              v
        [ index.html ]
              |
              +--> CSS, CDN (Bootstrap, tfjs-vis, etc.)
              |
              +--> <script type="module" src="./src/index.js">
                          |
                          v
                   [ src/index.js ]
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
    UserService    new Worker(...)   Controllers init
          |               |               |
          v               v               v
    fetch users.json   worker escuta   Views registram
                         mensagens      callbacks no DOM
```

---

## Próximo passo

[03-arquitetura-service-view-controller.md](./03-arquitetura-service-view-controller.md) — papéis de Service, View e Controller neste projeto.

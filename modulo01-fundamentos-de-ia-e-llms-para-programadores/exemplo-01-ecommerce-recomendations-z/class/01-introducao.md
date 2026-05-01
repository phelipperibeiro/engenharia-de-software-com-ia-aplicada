# 01 — Introdução e estrutura de pastas

## O que é este exemplo?

É uma **SPA minimalista no navegador**: lista usuários, mostra compras, lista produtos e, nas partes mais avançadas, **treina um modelo** (TensorFlow.js) num **Web Worker** e **ranqueia produtos** para o usuário selecionado.

Não há servidor Node com Express aqui: o `npm start` só sobe um **servidor de arquivos estáticos** (Browser Sync). Toda a “inteligência” roda **no cliente** (browser).

---

## Visão do diretório `exemplo-01-ecommerce-recomendations-z/`

```
exemplo-01-ecommerce-recomendations-z/
├── class/                      ← você está aqui (material de estudo)
├── parte01-ecommerce-recomendations-with-tensorflow/
├── parte02-ecommerce-recomendations-with-tensorflow/
├── parte03-ecommerce-recomendations-with-tensorflow/
├── parte04-ecommerce-recomendations-with-tensorflow/
└── parte05-ecommerce-recomendations-with-tensorflow/
```

Cada `parteXX` é um **projeto quase independente** (seu próprio `package.json`, `index.html`, `data/`, `src/`). A ideia pedagógica é **evoluir o mesmo conceito** em passos; o arquivo que mais muda entre uma parte e outra é em geral:

`src/workers/modelTrainingWorker.js`

O arquivo `src/index.js` é **idêntico** nas cinco partes — o que “cresce” é principalmente o worker de ML.

---

## Dentro de cada `parteXX` (layout típico)

```
parte05-.../
├── index.html              # marcação + <script type="module" src="./src/index.js">
├── style.css
├── package.json            # script "start" com browser-sync
├── data/
│   ├── users.json          # usuários, idades, compras
│   └── products.json       # catálogo (preço, categoria, cor)
└── src/
    ├── index.js            # monta services, views, worker, controllers
    ├── controller/         # orquestra UI + serviços + eventos
    ├── view/               # DOM, templates HTML em pasta templates/
    ├── service/            # fetch JSON, sessionStorage
    ├── events/             # constants.js + Events (CustomEvent na página)
    └── workers/
        └── modelTrainingWorker.js   # ML + mensagens (thread separada)
```

---

## Dados (`data/`)

Fluxo simplificado dos dados:

```
  users.json          products.json
       |                     |
       +----------+----------+
                  |
                  v
          UserService / fetch no worker
                  |
                  v
        sessionStorage (cópia na UI) + uso no treino
```

- **`users.json`**: ao carregar, o app costuma copiar para `sessionStorage` para persistir compras na sessão do navegador.
- **`products.json`**: lido no worker com `fetch('/data/products.json')` durante o treino (caminho relativo ao origin do Browser Sync).

---

## Próximo passo

[02-do-npm-start-ao-navegador.md](./02-do-npm-start-ao-navegador.md) — como o HTML entra no `src/` e o que o Browser Sync faz de verdade.

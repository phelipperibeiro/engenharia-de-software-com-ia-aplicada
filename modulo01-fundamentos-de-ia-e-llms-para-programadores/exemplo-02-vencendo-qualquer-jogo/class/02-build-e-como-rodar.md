# 02 — Build e como rodar

## Fluxo de desenvolvimento

```
Desenvolvedor
     |
     v
npm install          (na pasta DuckHunt-JS-parte01 ou parte02)
     |
     v
npm start            ---> webpack-dev-server
     |
     v
http://localhost:8080
```

O `package.json` usa **`webpack-dev-server`** (não Browser Sync como em outros exemplos do curso).

---

## O que o Webpack faz aqui (resumo)

```
webpack.config.js
        |
        +-- entry: main.js  -----------------> bundle dist/duckhunt.js
        |
        +-- CopyWebpackPlugin
              |
              v
        machine-learning/yolov5n_web_model/*
              copiado para
        dist/yolov5n_web_model/*
```

Isso é **essencial**: no worker, o modelo é carregado com caminhos relativos como `yolov5n_web_model/model.json`. Em tempo de execução o navegador precisa **encontrar** esses arquivos sob o mesmo origin que serviu a página.

```
Requisição HTTP
      |
      v
GET /yolov5n_web_model/model.json   ---> arquivo copiado pelo Webpack
GET /yolov5n_web_model/*.bin        ---> shards de pesos (se existirem)
```

---

## Diagrama: da pasta fonte ao navegador

```
+------------------+     npm run build      +------------------+
| main.js + src/   | ---------------------> | dist/duckhunt.js |
| machine-learning |                        | dist/index.html  |
+------------------+                        | dist/yolov5n...  |
                                                      |
                                                      v
                                              webpack-dev-server
                                              serve dist/ na porta 8080
```

---

## Comandos úteis

| Comando | Efeito |
|---------|--------|
| `npm start` | Servidor de desenvolvimento + hot reload típico do Webpack |
| `npm run build` | Gera `dist/` para deploy estático |
| `npm run lint` | ESLint em `src/**/*.js` (não cobre necessariamente `machine-learning/`) |

---

## Próximo passo

[03-arquitetura-do-fluxo.md](./03-arquitetura-do-fluxo.md)

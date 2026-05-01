# 05 — Como executar e dicas

## Comando

Na pasta `exemplo-00-z/`:

```bash
npm install
npm start
```

O `package.json` define:

```json
"start": "node --no-warnings --watch index.js"
```

- **`node`**: executa `index.js`.
- **`--watch`**: reinicia o processo quando você salva alterações no arquivo (Node moderno).
- **`--no-warnings`**: reduz ruído no terminal.

---

## Fluxo: do seu editor ao terminal

```
  Salva index.js
        |
        v
  node --watch detecta mudança
        |
        v
  encerra processo anterior + roda de novo
        |
        v
  novo console.log com probabilidades
```

Útil para experimentar: mude idade/cor da “zé” e veja as porcentagens mudarem.

---

## Módulos ES (`import`)

O arquivo usa:

```javascript
import tf from '@tensorflow/tfjs-node'
```

No Node, isso exige que o projeto seja tratado como **ES module**. O campo correto no `package.json` costuma ser `"type": "module"`. Se ao rodar aparecer erro de sintaxe em `import`, verifique se seu `package.json` está coerente com a versão do Node que você usa (documentação oficial Node: [ECMAScript modules](https://nodejs.org/api/esm.html)).

---

## Limitações didáticas (esperadas)

```
+-------------------------------+
| Apenas 3 exemplos de treino   |
+-------------------------------+
        |
        v
  modelo pode “decorar” ou oscilar;
  métricas não são confiáveis fora do tutorial
```

Para aprender **bem** generalização, dataset maior, validação e regularização vêm depois — outros exemplos do curso entram nisso.

---

## Relação com outros exemplos do módulo

```
exemplo-00-z (Node, script único)
        |
        | conceitos: tensor, dense, softmax, one-hot
        v
exemplo-01-... (navegador + worker + dados JSON + app maior)
```

Use este `exemplo-00-z` para fixar **formato de entrada/saída** da rede; use o e-commerce para ver **ML dentro de uma aplicação web**.

---

## Voltar ao índice

[class/README.md](./README.md)

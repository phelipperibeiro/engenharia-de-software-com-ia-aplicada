# 04 — Worker, YOLOv5n e pós-processamento

> **Antes do código:** o que é YOLO em termos de detecção de objetos — [00-yolo-resumo.md](./00-yolo-resumo.md).

## Visão geral no worker

```
importScripts(tfjs CDN)
        |
        v
loadModelAndLabels()
   fetch(labels.json) + tf.loadGraphModel(model.json)
        |
        v
warmup (executeAsync com tensor dummy)  ---> reduz latência da 1ª inferência
        |
        v
postMessage({ type: 'model-loaded' })   (opcional consumo na UI)
```

---

## Mensagem `predict`

```
onmessage:
   se type !== 'predict' --> ignora
   se modelo não pronto   --> ignora

   preprocessImage(ImageBitmap)  ---> tensor [1, 640, 640, 3] aprox.
        |
        v
   runInference(tensor)
        |
        v
   executeAsync(tensor)  ---> saídas do grafo TensorFlow
        |
        v
   assume 3 primeiros tensores: boxes, scores, classes
```

O modelo **GraphModel** devolve tensores; o código assume ordem `[boxes, scores, classes]` como é comum em exportações YOLO para TF.js (se mudar o export, esse índice precisa ser revisado).

---

## Pré-processamento (resumo)

```
ImageBitmap
     |
     | tf.browser.fromPixels
     v
[H, W, 3] uint8
     |
     | resizeBilinear --> 640 x 640
     | div(255)       --> [0, 1]
     | expandDims(0)  --> batch 1
     v
tensor entrada do modelo
```

`tf.tidy` agrupa tensores temporários para **evitar vazamento de memória** em loop contínuo.

---

## Pós-processamento (`processPrediction`) — **parte02**

Fluxograma lógico:

```
para cada detecção i (índice em scores)
        |
        | score[i] < CLASS_THRESHOLD (0.4)?  --> descarta
        v
label = labels[ classes[i] ]
        |
        | label !== 'kite'?  --> descarta
        v
caixa [x1,y1,x2,y2] normalizada 0..1
        |
        v
multiplica por width/height do ImageBitmap original
        |
        v
centro da caixa (centerX, centerY)  ---> yield { x, y, score }
```

**Importante:** `labels.json` vem do dataset em que o modelo foi treinado (estilo COCO). O filtro `label === 'kite'` é **didático**: escolhe uma classe específica entre dezenas. Para um jogo real de caça ao pato, você trocaria para uma classe que o modelo realmente reconheça nos seus frames (ou treinaria um modelo próprio).

---

## Diagrama: da caixa ao centro

```
   (x1,y1) +------------------+ (x2,y2)
           |     bounding     |
           |       box        |
           +--------+---------+
                    ^
                    | centro
                  (cx,cy) ---> enviado como (x,y) para a mira
```

Coordenadas da caixa vêm normalizadas; o código escala para pixels do bitmap antes de calcular o centro.

---

## Frequência (200 ms)

O `setInterval` na thread principal define **~5 FPS** de análise. É um compromisso entre CPU/GPU e fluidez; valores menores = mais inferências = mais custo.

---

## Próximo passo

[05-parte01-vs-parte02.md](./05-parte01-vs-parte02.md)

---
title: "d3-zoom, d3-drag : Panning and Zooming and Dragging"
slug: d3-zoom-d3-drag-panning-zooming-dragging
description: d3-zoom과 d3-drag의 개념과 동작 방식을 코드와 함께 살펴봅니다.
author: jinyongp
date: 2022-04-21T11:16:27.486Z
lastmod: 2022-04-22T08:11:36.449Z
draft: true
tags:
  - d3.js
  - series
categories: []
---

- 이전 시리즈: [d3-selection : Data Driven Transformation of DOM](/blog/d3-selection-data-driven-transformation-dom)

---

# d3-zoom, d3-drag 살펴보기

[d3-zoom](https://github.com/d3/d3-zoom)과 [d3-drag](https://github.com/d3/d3-drag)는 사용자가 마우스 클릭 혹은 터치로 화면을 제어하거나 요소를 이동하는 기능을 제공합니다.

이번 시리즈 또한 마찬가지로 저번 시리즈에 구현했던 코드에 d3-zoom과 d3-drag를 결합하는 걸 목표로 하여 그에 필요한 부분만 다루도록 하겠습니다.

---

## d3-zoom

d3-zoom은 사용자가 화면을 드래그 혹은 스크롤하여 현재 보는 범위를 이동,확대,축소하는 기능을 제공합니다. 혹은, 특정 요소를 선택했을 때 그 위치로 이동하면서 포커스하는 효과를 줄 수도 있습니다.

### Panning and Zooming

d3-zoom은 d3-selection과 연계하여 구현합니다. `Selection` 객체에 zoom 기능을 제공하기 위해 `d3.zoom()` 함수를 호출하여 전달합니다. 저번 시리즈에서 생성한 `root` 요소를 가져와 zoom 기능을 추가해보겠습니다.

```js
const zoom = d3
  .zoom()
  .on('zoom', (event) => {
    console.log('Zoom and Drag!');
  });

root.call(zoom);
```

`d3.zoom()` 함수는 `Selection` 객체를 인자로 받는 함수를 생성하여 반환합니다. `root.call(zoom)`을 호출함으로써 인자로 받은 [객체에 여러 property와 event를 등록](https://github.com/d3/d3-zoom/blob/1bccd3fd56ea24e9658bd7e7c24e9b89410c8967/src/zoom.js#L72-L83)하게 됩니다.

>[selection.call()](https://github.com/d3/d3-selection#selection_call)은 `Selection` 객체를 인자로 받는 함수를 인자로 받습니다. `root.call(zoom)`은 다음 코드와 동일합니다.
>
>```js
>zoom(root);
>```

`root` 요소를 드래그하거나 스크롤을 해보면 이벤트에 등록한 함수가 실행됩니다. `zoom` 이벤트에 등록할 함수를 작성하여 요소를 이동시켜봅시다.

전달한 함수는 `event` 객체를 매개변수로 가집니다. 클릭 이동인지 스크롤인지에 따라 종류가 달라집니다.

```js
// MouseEvent
sourceEvent: MouseEvent {...}
target: ƒ y(t)
transform: Jx {k: x.xx, x: x.xx, y: x.xx}
type: "zoom"

// WheelEvent
sourceEvent: WheelEvent {...}
target: ƒ y(t)
transform: Jx {k: x.xx, x: x.xx, y: x.xx}
type: "zoom"
```

이 중에서 scale factor인 `k` 와 translation 값인 `x`, `y`를 얻을 수 있는 `transform` 객체를 이용합니다.

```js
.on('zoom', ({ transform }) => {
  nodeGroup.attr('transform', transform);
  linkGroup.attr('transform', transform);
});
```

저번 시리즈에서 생성한 `nodeGroup`과 `linkGroup`은 `svg` 요소를 가지는 `Selection` 객체로 `transform` 속성을 변경하여 위치와 크기를 조절할 수 있습니다.

>`transform`은 객체인데 그대로 전달할 수 있는 이유는 적용될 때 [`transform.toString()`함수가 호출되어 `"translate(x,y) scale(k)"` 형태의 문자열로 변환](https://github.com/d3/d3-zoom#transform_toString)되기 때문입니다.

화면을 드래그하여 이동하고 스크롤하여 확대, 축소할 수 있습니다.

### Focusing

그럼 특정 요소를 클릭했을 때 해당 요소를 포커스하는 동작에 대해 구현해보겠습니다. 일단 `Selection` 객체에 이벤트를 등록하기 위해선 `selection.on()` 메서드를 호출합니다. 저번 시리즈에서 생성한 `circles`를 가져오겠습니다.

```js
circles.on('click', (event, node) => {
  console.log('Click!');
});
```

`click` 이벤트에 등록한 함수는 `event`와 `node` 객체를 매개변수로 가집니다. `node`의 현재 위치 `x`, `y` 좌표로 이동 및 확대해야 하므로 이를 이용합니다.

사용자의 조작이 아닌 코드를 통해 특정 좌표로 이동하고 확대하기 위해선 [`zoom.translateTo`](https://github.com/d3/d3-zoom#zoom_translateTo)와 [`zoom.scaleTo`](https://github.com/d3/d3-zoom#zoom_scaleTo) 함수를 이용합니다. 해당 함수는 첫 번째 인자로 `Selection` 객체를 전달받으므로 `selection.call()` 함수로 호출할 수 있습니다.

```js
circles.on('click', (_, { x, y }) => {
  root
    .transition()
    .duration(500)
    .call(zoom.translateTo, x, y)
    .transition()
    .call(zoom.scaleTo, 3);
});
```

`circles` 요소를 클릭하면 클릭한 `circle`의 `x`, `y` 좌표를 가져옵니다. 그리고 `zoom.translateTo`와 `zoom.scaleTo`가 `root` 요소의 zoom 상태를 변경합니다. `transition`과 `duration`은 zoom이 이동할 때 transition 효과를 주어 보다 자연스러운 움직임을 제공합니다.

---

## d3-drag

d3-drag는 요소를 클릭하여 드래그하는 기능을 제공합니다.

### Dragging

d3-drag 또한 d3-selection에 기능을 제공합니다. `d3.drag()` 함수는 `Selection` 객체를 인자로 받는 함수를 생성하여 반환합니다. 추가로, 드래그하기 위해서 필요한 세 가지 이벤트를 등록해야 합니다.

```js
const drag = d3
  .drag()
  .on("start", (event, node) => {
    console.log('Drag Start!');
  })
  .on("drag", (event, node) => {
    console.log('Dragging!');
  })
  .on("end", (event, node) => {
    console.log('Drag End!');
  });

circles.call(drag);
```

요소를 클릭하면 `start` 이벤트가 발생하고, 클릭 후 드래그하면 `drag` 이벤트 그리고 클릭을 떼면 `end` 이벤트가 발생합니다. 이벤트에 등록한 모든 함수는 클릭 이벤트 객체와 클릭한 요소의 정보를 매개변수로 가집니다.

요소를 클릭하여 드래그할 때 simulation은 계속 실행 중인 상태여야 합니다. d3-force 시리즈에서 언급한 내용으로 simulation을 종료하지 않고 계속 실행하려면 `alphaTarget`을 이용해야 합니다.

또한, 요소가 다른 요소와 상관없이 [특정 고정 좌표에 위치하도록 하려면 `fx`와 `fy` 값을 설정](https://github.com/d3/d3-force#simulation_nodes)해야 합니다.

```js
const drag = d3
  .drag()
  .on('start', (event, node) => {
    nodeGroup.style('cursor', 'grabbing');
    simulation.alphaTarget(0.1).restart();
  })
  .on('drag', (event, node) => {
    node.fx = event.x;
    node.fy = event.y;
  })
  .on('end', (event, node) => {
    nodeGroup.style('cursor', 'grab');
    simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
  });

circles.call(drag);
```

클릭할 때 `alphaTarget`을 `alphaMin`보다 크게 설정하여 simulation이 절대 종료되지 않도록 합니다. `alphaTarget` 값이 클수록 다른 요소의 움직임이 커집니다. 클릭을 종료하면 다시 되돌려놓습니다.

클릭하여 드래그를 시작하면 `fx`와 `fy` 값을 현재 마우스의 위치로 설정합니다. 클릭을 종료하면 `null`로 설정하여 고정 위치를 제거합니다.

## 프로젝트에 연결하기

d3-zoom과 d3-drag를 추가해보았습니다. `Network` class를 작성하여 코드를 정리했고  실시간으로 `alpha`와 `zoom` 상태를 확인하고 제어할 수 있도록 구현하였습니다. `nodes`와 `links`를 추가할 수 있도록 구현하였습니다. 비어있는 채로 `ADD`를 클릭하면 새로운 요소가 임의의 요소에 연결됩니다. 그리고 `node`의 아이디를 DOM에 그려 `node`의 데이터를 어떻게 DOM에 적용할 수 있는지 보여줬습니다.

<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="mdpoWxa" data-user="jinyongp" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/jinyongp/pen/mdpoWxa">
  D3 Force, Zoom, Drag (w/ SVG)</a> by Park, Jinyong (<a href="https://codepen.io/jinyongp">@jinyongp</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

---

## Conclusion

d3-zoom과 d3-drag를 기존 프로젝트에 연결하는 코드를 작성해보면서 개념과 구현 방법에 대해 알아보았습니다. 여기서 사용해본 기능 말고도 d3는 정말 많은 기능을 제공합니다. 공식 문서에 예시가 살짝 아쉽긴 하지만, 직접 사용해보면서 그 유틸성을 확인해보았으면 합니다.

`ADD` 버튼을 눌러 계속 요소를 추가하다보면 점점 프레임이 떨어지면서 성능이 하락하는 모습을 볼 수 있습니다. 이 문제는 HTML5 Canvas API가 해결할 수 있습니다. 허나, 이 방법도 그리기엔 쉬울지 몰라도 오늘 적용한 zoom과 drag 기능을 추가하는데엔 어려움이 있습니다. 다음 시리즈는 지금까지 구현한 내용을 Canvas API로 리팩토링하면서 전부 알아보도록 하겠습니다.

---

## References

- [d3-zoom](https://github.com/d3/d3-zoom)
- [d3-drag](https://github.com/d3/d3-drag)
- [d3-transition](https://github.com/d3/d3-transition)
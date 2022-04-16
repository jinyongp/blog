---
title: "d3-force : Simulation, Forces 살펴보기"
slug: d3-force-simulation-forces-살펴보기
description: d3-force의 Simulation, Forces의 개념과 동작 방식을 코드와 함께 살펴봅니다.
author: jinyongp
date: 2022-04-14T14:20:46.840Z
lastmod: 2022-04-16T03:24:57.065Z
draft: false
tags:
  - d3.js
  - series
categories: []
---

# d3-force 살펴보기

[d3-force](https://github.com/d3/d3-force)는 입자(`nodes`) 간에 가해지는 물리적 힘(forces)을 simulation하여 입자의 좌표값을 계산하고 제공합니다.

그럼 코드와 함께 [Simulation](#simulation)과 [Forces](#forces)에 대해 이해해봅시다.

---

## [Simulation](https://github.com/d3/d3-force#simulation)

Simulation은 `nodes`에 가해지는 물리적 힘을 계산합니다. `d3.forceSimulation()` 함수로 simulation을 생성합니다.

```js
const simulation = d3.forceSimulation();
```

Simulation에 그래프의 정점 목록인 `nodes`와 간선 목록인 `links`를 등록할 수 있습니다.

### Nodes

먼저 `nodes`에 대해 알아봅시다. Simulation은 입력한  `node` 객체에 계산 결과값을 추가합니다. `nodes` 배열에서 각 `node`를 인덱스로 관리해도 되지만, 보기 어려우므로 고유 식별자 `id`를 추가하겠습니다.

```js
const nodes = [...Array(5)].map((_, i) => ({ id: i + 1 }));
// [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

simulation.nodes(nodes);
// nodes [
//   {
//     id: 1,
//     index: 0,
//     vx: x.xx,
//     vy: x.xx,
//     x: x.xx,
//     y: x.xx,
//   }
//   , ...
// ]
```

Simulation은 `node`에 `index`와 함께 좌표값인 `x`, `y` 그리고 속도값인 `vx`, `vy`를 추가합니다. 원본 `node` 객체 자체를 수정해야하므로 [non-extensible한 객체](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)는 사용할 수 없습니다. 만약 불변성 유지가 필요하다면 객체를 복사하여 전달해야 합니다.

### Links

그럼 이제 `links`를 등록해봅시다. d3-force에서 `link` 객체는 방향성을 지닌 간선이므로 `source`와 `target`을 가진 객체로 선언합니다. `nodes`와 달리 각 property는  객체가 아닌 `node`를 식별할 `id`를 갖습니다.

```js
const links = [
  { source: 1, target: 4 },
  { source: 3, target: 4 },
  { source: 2, target: 5 },
  { source: 4, target: 1 },
  { source: 5, target: 4 },
];

simulation.force('link', d3.forceLink(links).id(({ id }) => id));
// links [
//   {
//     index: 1,
//     source: {
//       id: 3
//       index: 2
//       vx: x.xx,
//       vy: x.xx,
//       x: x.xx,
//       y: x.xx,
//     },
//     target: {
//       ...
//     },
//   }, ...
// ]
```

나중에 [Forces](#forces) 챕터에서 다시 만나겠지만, `links`는 `nodes`에 작용할 힘을 제공하므로 `force`로 추가합니다. `links`를 simulation에 추가하면 `source`, `target`에 설정된 `id`를 동일한 `id`를 가진 `node` 객체로 대체합니다. (코드에 나와 있듯 [link.id()](https://github.com/d3/d3-force#link_id) 함수로 지정해야 합니다.)

### Tick

Simulation에 `nodes`와 `links`를 등록해봤습니다. `tick` 이벤트에 핸들러 함수를 등록하여 매 `tick`마다 실행할 코드를 작성할 수 있습니다. Simulation은 생성 직후 곧바로 실행됩니다. 필요하다면 [`simulation.stop()`](https://github.com/d3/d3-force#simulation_stop) 함수로 정지하거나 [`simulation.restart()`](https://github.com/d3/d3-force#simulation_restart)로 재시작할 수 있습니다.

`tick` 이벤트 핸들러를 등록하여 `node`에 저장된 결과값을 확인해봅시다.

```js
simulation.on('tick', () => {
  console.log(nodes[0]);
});
// 첫 번째 tick: {id: 1, index: 0, x: 5.826695986913618, y: -4.292216192303559, vy: -4.292216192303559, …}
// 두 번째 tick: {id: 1, index: 0, x: 4.820993020602418, y: -8.04960224695047, vy: -3.7573860546469113, …}
// 세 번째 tick: {id: 1, index: 0, x: 4.188865598751164, y: -10.465829270778734, vy: -2.4162270238282635, …}
// 네 번째 tick: {id: 1, index: 0, x: 3.823314491169919, y: -11.82585404923582, vy: -1.3600247784570867, …}
// ...
```

Simulation은 `tick` 단위마다 좌표값을 계산합니다. 우린 simulation에 의해 `tick`마다 계산된 절대 좌표값(x, y)를 화면에 그려주기만 하면 됩니다. 그리는 건 나중에 d3-selection과 함께 알아보겠습니다.

### Alpha

Simulation을 얼마나 진행할 지 결정하는 `alpha`, `alphaMin`, `alphaDecay`, `alphaTarget`, `velocityDecay` 속성에 대해 알아보겠습니다. 문서에 주어진 `alpha`의 정의는 설명도 부실하고 이해하기 꽤 어려우니 [구현 코드](https://github.com/d3/d3-force/blob/main/src/simulation.js)를 보며 동작 방식을 알아봅시다. 주어진 속성의 초기값은 다음과 같습니다.

```js
var simulation,
    alpha = 1,
    alphaMin = 0.001,
    alphaDecay = 1 - Math.pow(alphaMin, 1 / 300) // 0.02276277904418933
    alphaTarget = 0,
    velocityDecay = 0.6,
    // ...
```

`alpha`는 매 `tick`마다 `alpha += (alphaTarget - alpha) * alphaDecay`로 계산되어 감소합니다. 또한, 매 `tick`마다 `alpha`와 `alphaMin`를 비교합니다. `alpha`가 `alphaMin`보다 작아질 때까지 simulation을 실행합니다.

```js
simulation.on('tick', () => {
  console.log(simulation.alpha());
  // 001: 0.9772372209558107    = 1 + (0 - 1) * 0.02276277904418933;
  // 002: 0.9549925860214359    = alpha + (alphaTarget - alpha) * alphaDecay
  // ...
  // 300: 0.0009999999999999966 종료: alphaMin(0.001) 미만
});
```

`alphaTarget`은 `alpha`의 도달 목표입니다. `alpha`는 `alphaTarget`에 도달할 때까지 감소합니다. `alphaTarget`이 `alphaMin`보다 크다면 `alpha`가 `alphaMin`에 도달할 수 없으므로 simulation은 종료되지 않고 계속 실행됩니다. 나중에 d3-drag를 적용할 때 이용할 수 있습니다.

아래 코드에서 `alphaTarget`으로 `alpha`가 `1`부터 `0.5`까지 감소하도록 설정했습니다. 하지만 `alpha`가 `0.6` 미만으로 감소했을 때 simulation이 종료되므로 `0.5`까지 감소할 일은 없습니다.

```js
simulation.alphaMin(0.6).alphaTarget(0.5);
simulation.on('tick', () => {
  console.log(simulation.alpha());
  // 001: 0.9886186104779053
  // 002: 0.9774962930107179
  // ...
  // 070: 0.5997631157484438 종료: alphaMin(0.6) 미만
});
```

아래 코드에선 `alpha`가 `0.4` 이하로 감소해야만 종료됩니다. 하지만, `alphaTarget`에 의해 `0.4`보다 작아질 수 없습니다. 고로, simulation이 종료되지 않습니다.

```js
simulation.alphaMin(0.4).alphaTarget(0.5);
simulation.on('tick', () => {
  console.log(simulation.alpha());
  // 001: 0.9886186104779053
  // 002: 0.9774962930107179
  // ...
  // 300: 0.5005000000000002
  // 301: 진행 중...
});
```

`alphaDecay`는 `alpha`의 감소량입니다. 수가 클수록 `alpha`는 `alphaMin`에 빠르게 도달합니다.

`velocityDecay`는 `node.vx`, `node.vy` 값의 감소량입니다. 구현 코드에선 `node.x += node.vx *= velocityDecay;`로 작성되어 있는데, `node.vx *= velocityDecay`를 먼저 연산하고 `node.x += node.vx`를 연산합니다. `0`으로 설정하면 simulation이 종료될 때까지 속도를 계속 유지합니다.

---

## [Forces](https://github.com/d3/d3-force#forces)

Forces는 simulation에서 `node`에 적용할 물리적 힘입니다. 척력 혹은 인력을 적용하거나, 일정 거리를 유지하게끔 합니다. 몇가지 모듈을 이용해 force를 적용할 수 있습니다. Links, many-body, centering, collision, positioning에 대해 알아봅시다.

### [Links](https://github.com/d3/d3-force#links)

Link force는 `node`를 연결하고 일정 거리를 유지하는 힘입니다. 위에서 언급했듯 `simulation.force()`와 `d3.forceLink()`로 생성합니다. 이 과정에서 `distance`와 `strength`를 이용해 거리와 거리를 유지할 힘을 결정합니다.

```js
const forceLink = d3
  .forceLink(links)
  .id(({ id }) => id)
  .distance(100)
  .strength(1);

simulation.force('link', forceLink);
```

`strength`는 `distance`로 설정한 일정 거리를 유지하는 힘입니다. `0`부터 `1` 사이를 추천합니다

### [Many-Body](https://github.com/d3/d3-force#many-body)

Many Body force는 `nodes`에 척력 혹은 인력을 적용합니다. `simulation.force()`와 `d3.forceManyBody()`로 생성합니다. 이 또한, `strength`로 적용할 힘을 결정합니다. 전달한 수가 양수라면 인력, 음수라면 척력입니다.

```js
const forceManyBody = d3
  .forceManyBody()
  .strength(-300);

simulation.force('manyBody', forceManyBody);
```

참고로 많은 예시에서 `force('manyBody', forceManyBody)`가 아닌 `force('charge', forceCharge)`로 되어있지만 이름은 전혀 중요하지 않습니다. 단순히 식별자 역할을 수행하므로 다른 force와 구분만 가능하면 됩니다.

### [Centering](https://github.com/d3/d3-force#centering)

Centering force는 `nodes`의 중심이 지정한 좌표(x, y)에 위치하도록 합니다. `simulation.force()`와 `d3.forceCenter()`로 생성합니다. Viewport 상에서 정중앙에 위치해야 할 때 적용합니다. `strength`를 이용하면 부드러운 움직임이 가능합니다.

```js
const forceCenter = d3
  .forceCenter(width / 2, height / 2)
  .strength(0.1);

simulation.force('center', forceCenter);
```

`resize` 이벤트 혹은 [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)로 크기 변경을 감지하고 `nodes`가 항상 중앙에 위치하도록 할 수 있습니다.

### [Collision](https://github.com/d3/d3-force#collision)

Collision force는 `nodes`가 서로 겹치는 것을 방지하는 힘입니다. `simulation.force()`와 `d3.forceCollide()`로 생성합니다. `node`를 점이 아닌 원으로 취급하여 충돌 여부를 확인하고 `radius`로 원의 반지름을 결정합니다. `strength`로 겹칠 때 서로 밀어낼 힘을 결정합니다.

```js
const forceCollide = d3
  .forceCollide()
  .radius(5)
  .strength(0.8);

simulation.force('collide', forceCollide);
```

### [Positioning](https://github.com/d3/d3-force#positioning)

Positioning force는 지정한 좌표(x, y)로 `nodes`를 밀어내는 힘입니다. `simulation.force()`와 `d3.forceX()` 그리고 `d3.forceY()`로 생성합니다. `strength`로 밀어내는 힘을 결정합니다.

```js
const forceX = d3.forceX().strength(1);
const forceY = d3.forceY(height / 2);

simulation.force('x', forceX).force('y', forceY);
```

`d3.forceRadial()` 함수는 원형을 기준으로 밀어내는 힘을 생성합니다. `strength`로 밀어내는 힘을 결정합니다.

```js
const forceRadial = d3
  .forceRadial(100, width / 2, height / 2)
  .strength(0.5);

simulation.force('radial', forceRadial);
```

---

## Conclusion

d3-force의 개념과 동작 방식을 코드와 함께 이해해보았습니다. 아직 d3-selection에 대해 다루지 않아 계산 결과값으로 그래프를 그리진 않았습니다만, 다음 시간에 SVG로 그래프를 그려보고 d3-zoom과 함께 d3-drag를 적용해보도록 하겠습니다. 여태까지 작성한 코드를 정리하는 것으로 작성을 마무리하겠습니다.

```js
const nodes = [...Array(5)].map((_, i) => ({ id: i + 1 }));

const links = [
  { source: 1, target: 4 },
  { source: 3, target: 4 },
  { source: 2, target: 5 },
  { source: 4, target: 1 },
  { source: 5, target: 4 },
];

const simulation = d3
  .forceSimulation()
  .alpha(...)
  .alphaMin(...)
  .alphaDecay(...)
  .alphaTarget(...)
  .velocityDecay(...);

const forceLink = d3
  .forceLink(links)
  .id(({ id }) => id)
  .distance(100)
  .strength(1);

const forceManyBody = d3
  .forceManyBody()
  .strength(-300);

const forceCenter = d3
  .forceCenter(width / 2, height / 2)
  .strength(0.1)

const forceCollide = d3
  .forceCollide()
  .radius(5)
  .strength(0.8)

simulation
  .nodes(nodes)
  .force('link', forceLink)
  .force('manyBody', forceManyBody)
  .force('center', forceCenter)
  .force('collide', forceCollide);

simulation.on('tick', () => {
  ...
});
```
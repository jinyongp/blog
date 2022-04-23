---
title: D3.js Github Follow Network
slug: d3-js-github-follow-network
description: Drawing Github Follower & Following Network using D3.js
author: jinyongp
date: 2022-04-14T14:31:09.367Z
lastmod: 2022-04-23T07:32:03.757Z
draft: false
tags:
  - d3.js
---

이전에 진행한 [D3.js를 이용한 Github Starred Repo 관계망 그리기 프로젝트](https://github.com/Pre-Onboarding-FE-Team07/wanted-codestates-project-7-7-2)에서 d3.js에 큰 흥미를 느끼게 되었습니다. 처음 다뤄보는 라이브러리라 기능 하나를 추가할 때마다 많은 자료와 문서를 찾아봐야 했습니다. 어찌어찌하긴 했지만 약간 아쉬움이 남아있습니다. 아무래도 깔끔하게 이해하는데 어려움이 있었고, 그 어려움을 극복하고자 직접 정리하여 작성해보고자 합니다.

사용하는 라이브러리는 [d3.js](https://github.com/d3/d3)입니다. 자세히는 `d3-force`, `d3-zoom`, `d3-selection`, `d3-drag` 등 필요한 모듈이라면 전부 활용해볼 예정이고 성능 향상을 위해 Canvas API로 구현해보려고 합니다.

## Series

1. [d3-force : Simulating Physical Forces](/blog/d3-force-simulating-physical-forces)
2. [d3-selection : Data Driven Transformation of DOM](/blog/d3-selection-data-driven-transformation-dom)
3. [d3-zoom, d3-drag : Panning and Zooming and Dragging](/blog/d3-zoom-d3-drag-panning-zooming-dragging)
4. [D3.js and Canvas API : 성능 향상을 위한 Refactoring](/blog/d3-js-canvas-api-성능-향상을-위한-refactoring)

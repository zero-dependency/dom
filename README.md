# @zero-dependency/dom

[![npm version](https://img.shields.io/npm/v/@zero-dependency/dom)](https://npm.im/@zero-dependency/dom)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@zero-dependency/dom)](https://bundlephobia.com/package/@zero-dependency/dom@latest)
![npm license](https://img.shields.io/npm/l/@zero-dependency/dom)

## Installation

```sh
npm install @zero-dependency/dom
```

```sh
yarn add @zero-dependency/dom
```

```sh
pnpm add @zero-dependency/dom
```

## Usage

```js
import { el, observeElement, waitElement } from '@zero-dependency/dom'

// createElement
const element = el('div', { class: 'foo' }, 'Hello World')
document.body.appendChild(element)

// observeElement
observeElement(element, (mutation, observer) => {
  console.log(mutation.target.textContent) // 'hello world'
  observer.disconnect()
})

element.textContent = element.textContent.toLowerCase() // 'hello world'

// waitElement
const el = await waitElement('div.card')
console.log(el) // <div class="card">...</div>
```

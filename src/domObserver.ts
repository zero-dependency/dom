import { Emitter } from '@zero-dependency/emitter'
import type { EventMap } from '@zero-dependency/emitter'

interface ParsedResult {
  partialSelector: string
  key?: string
  selector?: string
  options?: {
    attributes?: boolean
    useParentNode?: boolean
    useTargetNode?: boolean
  }
}

interface ParsedSelector {
  ids: ParsedResult[]
  classNames: ParsedResult[]
}

interface ObservedOptions {
  attributes?: boolean
  useParentNode?: boolean
}

type SelectorsType = keyof ParsedSelector
type ObservedSelectors = Record<string, ParsedResult[]>

class DOMObserver extends Emitter<EventMap> {
  private observer: MutationObserver
  private readonly observedIds: ObservedSelectors = Object.create(null)
  private readonly observedClassNames: ObservedSelectors = Object.create(null)
  private readonly attributeObservers = new Map()
  private readonly IGNORED_HTML_TAGS = new Set([
    'BR',
    'HEAD',
    'LINK',
    'META',
    'SCRIPT',
    'STYLE'
  ])

  constructor() {
    super()

    this.observer = new MutationObserver((mutations) => {
      const pendingNodes: [Node, Node][] = []

      for (const { addedNodes, removedNodes, target } of mutations) {
        if (
          !addedNodes ||
          !removedNodes ||
          (addedNodes.length === 0 && removedNodes.length === 0)
        ) {
          continue
        }

        for (let i = 0; i < 2; i++) {
          const nodes = i === 0 ? addedNodes : removedNodes
          for (const node of nodes) {
            if (
              node.nodeType !== Node.ELEMENT_NODE ||
              this.IGNORED_HTML_TAGS.has(node.nodeName)
            ) {
              continue
            }

            pendingNodes.push([target, node])
            if ((node as Element).childElementCount === 0) continue

            for (const childNode of (node as Element).querySelectorAll(
              '[id],[class]'
            )) {
              pendingNodes.push([target, childNode])
            }
          }
        }
      }

      if (pendingNodes.length === 0) return

      this.processMutations(this, pendingNodes as [HTMLElement, HTMLElement][])
    })

    this.observer.observe(document, {
      childList: true,
      subtree: true
    })
  }

  // @ts-ignore
  override on<E extends string>(
    selector: E,
    callback: EventMap[E],
    options?: ObservedOptions
  ): this {
    const parsedSelector = this.parseSelector(selector)
    const initialNodes = []

    for (const selectorType of Object.keys(parsedSelector)) {
      let observedSelectorType

      switch (selectorType) {
        case 'ids':
          observedSelectorType = this.observedIds
          break
        case 'classNames':
          observedSelectorType = this.observedClassNames
          break
        default:
          break
      }

      for (const { key, partialSelector } of parsedSelector[selectorType]) {
        const currentObservedTypeSelectors = observedSelectorType[key]
        const observedType = { partialSelector, selector, options }

        if (!currentObservedTypeSelectors) {
          observedSelectorType[key] = [observedType]
        } else {
          currentObservedTypeSelectors.push(observedType)
        }

        if (observedSelectorType === this.observedIds) {
          initialNodes.push(...document.querySelectorAll(`#${key}`))
        } else if (observedSelectorType === this.observedClassNames) {
          initialNodes.push(...document.getElementsByClassName(key))
        }
      }
    }

    const result = super.on(selector, callback)
    this.processMutations(
      this,
      initialNodes.map((node) => [node.parentElement, node])
    )

    return result
  }

  // @ts-ignore
  override off<E extends string>(selector: E, callback: EventMap[E]): void {
    super.off(selector, callback)

    if (this.listenerCount(selector) > 0) return

    const parsedSelector = this.parseSelector(selector)

    for (const selectorType of Object.keys(parsedSelector)) {
      let observedSelectorType
      switch (selectorType) {
        case 'ids':
          observedSelectorType = this.observedIds
          break
        case 'classNames':
          observedSelectorType = this.observedClassNames
          break
        default:
          break
      }

      for (const { key } of parsedSelector[selectorType]) {
        const currentObservedTypeSelectors = observedSelectorType[key]

        if (!currentObservedTypeSelectors) {
          continue
        }

        const observedTypeIndex = currentObservedTypeSelectors.findIndex(
          (observedType) => observedType.selector === selector
        )

        if (observedTypeIndex === -1) {
          continue
        }

        const observedType = currentObservedTypeSelectors[observedTypeIndex]
        this.stopAttributeObserver(observedType)
        currentObservedTypeSelectors.splice(observedTypeIndex)

        if (!currentObservedTypeSelectors.length) {
          delete observedSelectorType[key]
        }
      }
    }
  }

  private processObservedResults(
    emitter: DOMObserver,
    target: HTMLElement,
    node: HTMLElement,
    results: ParsedResult[]
  ): void {
    if (!results || results.length === 0) return

    for (const observedType of results) {
      const { partialSelector, selector, options } = observedType
      let foundNode: HTMLElement | null = partialSelector.includes(' ')
        ? node.querySelector(selector)
        : node

      if (!foundNode) continue

      if (options && options.useParentNode) {
        foundNode = node
      }

      if (options && options.useTargetNode) {
        foundNode = target
      }

      const { isConnected } = foundNode
      if (options && options.attributes) {
        if (isConnected) {
          this.startAttributeObserver(observedType, emitter, foundNode)
        } else {
          this.stopAttributeObserver(observedType)
        }
      }

      emitter.emit(selector, foundNode, isConnected)
    }
  }

  private stopAttributeObserver(observedType: ParsedResult): void {
    const attributeObserver = this.attributeObservers.get(observedType)
    if (!attributeObserver) return

    attributeObserver.disconnect()
    this.attributeObservers.delete(observedType)
  }

  private startAttributeObserver(
    observedType: ParsedResult,
    emitter: DOMObserver,
    el: HTMLElement
  ): void {
    const attributeObserver = new window.MutationObserver(() =>
      emitter.emit(observedType.selector, el, el.isConnected)
    )
    attributeObserver.observe(el, { attributes: true, subtree: true })
    this.attributeObservers.set(observedType, attributeObserver)
  }

  private parseSelector(selector: string): ParsedSelector {
    const ids = []
    const classNames = []
    const partialSelectors = selector
      .split(',')
      .map((selector) => selector.trim())

    for (const partialSelector of partialSelectors) {
      if (partialSelector.startsWith('#')) {
        ids.push({
          key: partialSelector.split(' ')[0]!.split('#')[1],
          partialSelector
        })
      } else if (partialSelector.startsWith('.')) {
        classNames.push({
          key: partialSelector.split(' ')[0]!.split('.')[1],
          partialSelector
        })
      }
    }

    return {
      ids,
      classNames
    }
  }

  private processMutations(
    emitter: DOMObserver,
    nodes: [HTMLElement, HTMLElement][]
  ): void {
    if (!nodes || nodes.length === 0) return

    for (const [target, node] of nodes) {
      let nodeId = node.id

      if (typeof nodeId === 'string' && nodeId.length > 0) {
        nodeId = nodeId.trim()
        this.processObservedResults(
          emitter,
          target,
          node,
          this.observedIds[nodeId]
        )
      }

      const nodeClassList = node.classList
      if (nodeClassList && nodeClassList.length > 0) {
        for (let className of nodeClassList) {
          className = className.trim()
          this.processObservedResults(
            emitter,
            target,
            node,
            this.observedClassNames[className]
          )
        }
      }
    }
  }
}

const observer = new DOMObserver()

export function observeElement<T extends Element = Element>(
  selector: string,
  callback: (el: T, isConnected: boolean) => void,
  options?: ObservedOptions
) {
  const domObserver = observer.on(selector, callback, options)
  return () => domObserver.off(selector, callback)
}

export function waitElement<T extends Element = Element>(
  selector: string,
  options?: ObservedOptions
): Promise<[T, () => void]> {
  return new Promise((resolve) => {
    const disconnect = observeElement<T>(
      selector,
      (el, isConnected) => {
        if (isConnected) {
          resolve([el, disconnect])
        }
      },
      options
    )
  })
}

import assert from 'node:assert/strict'
import test from 'node:test'
import { createLiquidRuntime } from '../src/core.js'
import { createLiquidSurface } from '../src/dom.js'

class FakeStyle {
  setProperty(name, value) { this[name] = value }
}

class FakeElement {
  constructor(document, tagName) {
    this.ownerDocument = document
    this.tagName = tagName.toUpperCase()
    this.children = []
    this.attributes = new Map()
    this.style = new FakeStyle()
    this.offsetWidth = 240
    this.offsetHeight = 120
    this.nodeType = 1
    this.removed = false
    this.classes = new Set()
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name),
      replace: (from, to) => { this.classes.delete(from); this.classes.add(to) },
      toggle: (name, force) => force ? this.classes.add(name) : this.classes.delete(name)
    }
  }
  set className(value) { this.classes = new Set(String(value).split(/\s+/).filter(Boolean)) }
  get className() { return [...this.classes].join(' ') }
  setAttribute(name, value) { this.attributes.set(name, String(value)) }
  appendChild(child) { this.children.push(child); return child }
  append(value) { this.children.push(String(value)) }
  querySelector(selector) {
    const match = selector.match(/^\[data-liquid-layer="([^"]+)"\]$/)
    return match ? this.children.find((child) => child.attributes?.get('data-liquid-layer') === match[1]) : null
  }
  remove() { this.removed = true }
}

function fakeDocument() {
  const document = {
    defaultView: {},
    createElement: (tagName) => new FakeElement(document, tagName)
  }
  document.documentElement = new FakeElement(document, 'html')
  return document
}

test('DOM adapter hides surface anatomy and lifecycle behind one handle', () => {
  const document = fakeDocument()
  const runtime = createLiquidRuntime({
    document,
    matchMedia: null,
    environment: { CSS: { supports: () => false }, navigator: { userAgent: '' } }
  })
  const surface = createLiquidSurface({
    runtime,
    document,
    surface: 'panel',
    descriptor: { elevated: true },
    content: 'Hello from vanilla'
  })

  assert.equal(surface.element.children.length, 6)
  assert.equal(surface.contentElement.children[0], 'Hello from vanilla')
  assert.equal(surface.element.classList.contains('liquid-glass--frost'), true)
  assert.equal(surface.element.classList.contains('liquid-glass--elevated'), true)

  surface.update({ material: 'clear', elevated: false })
  assert.equal(surface.element.classList.contains('liquid-glass--clear'), true)
  assert.equal(surface.element.classList.contains('liquid-glass--elevated'), false)

  surface.destroy()
  assert.equal(surface.element.removed, true)
  assert.throws(() => surface.update({ surface: 'overlay' }), /destroyed/)
})

test('DOM adapter rejects unsafe or ambiguous content values', () => {
  const document = fakeDocument()
  assert.throws(() => createLiquidSurface({ document, content: { html: '<b>unsafe</b>' } }), /text, a DOM Node/)
})

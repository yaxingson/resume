'use strict'

function dir(obj) {
  return Object.keys(Object.getPrototypeOf(obj))
}

/** 
 * @param { Element } node 
 * @param { { element:Function, text:Function } } handler
 * */
function traverse(node, handler) {}

const qs = {
  /** @param {string} search */
  parse(search) {
    const queryPairs = search.split('&').map(item=>item.split('='))
    return queryPairs.reduce((o, [k, v])=>{
      o[k] = decodeURIComponent(v)
      return o
    }, {})
  },
  stringify() {

  }
}

async function main() {
  const { history, navigator, document, location, screen } = window

  console.log(Object.is(window, globalThis))
  console.log(dir(history))
  console.log(dir(navigator))

  const img = document.querySelector('img')
  const { DOCUMENT_NODE, ELEMENT_NODE, ATTRIBUTE_NODE, TEXT_NODE, COMMENT_NODE } = Node

  const nodes = {
    document:document,
    attribute:img.attributes[0],
    text: document.body.firstChild,
    comment: document.body.childNodes[1],
    element: img,
    documentType:document.childNodes[0],
    fragment:document.createDocumentFragment()
  }

  console.table(Object.keys(nodes).reduce((o, t)=>{
    const { nodeName, nodeType, nodeValue } = nodes[t]
    o[t] = { nodeName, nodeType, nodeValue }
    return o
  }, {}))

  console.log(img.parentNode, img.nextElementSibling)

  traverse(document.body, {
    element() {

    },
    text() {

    }
  })

  const accountInput = document.getElementById('account')
  const table = document.getElementsByTagName('table')[0]
  const rows = Array.from(table.querySelector('tbody').children)

  rows.forEach((row, i)=>{
    row.style.backgroundColor = i%2 ? 'pink' : 'skyblue'
  })

  console.log(img.className)
  
  const pre = document.querySelector('pre')

  console.log(pre.innerHTML)
  console.log(pre.textContent, void 0)
  console.log(img.getAttribute('class'), img.getAttributeNode('src').value)

  const style = document.createAttribute('style')
  style.nodeValue = 'font-size:80px;'

  document.querySelector('h1').setAttributeNode(style)

  setTimeout(()=>{
    img.removeAttribute('src')
  }, 3000)

  console.log(img.hasAttributes(), img.hasAttribute('data-src'))
  console.log(img.getAttribute('data-src'))

  console.log(document.styleSheets[0].cssRules)
  
  const svg = document.createElement('svg')
  const greet = document.createTextNode('hello,world')
  const comment = document.createComment('')

  console.log(svg)
  console.log(greet)

  document.body.insertBefore(svg, img)  
  document.body.replaceChild(greet, svg)

  const editors = document.querySelector('select')

  console.log(editors.options)

  const { images, links, forms } = document

  console.dir(links)
  console.log(table.rows, table.insertRow(0), table.deleteRow(0))

  const firstRow = table.rows[1]

  console.log(firstRow.cells, firstRow.rowIndex, firstRow)

  const thead = table.createTHead()

  // const result = window.confirm('Are you sure to delete it ?')
  // console.log(result)
  
  editors.add(new Option('Linux', ''))

  console.log(forms[0].elements)
  console.log(navigator.userAgent, location.protocol)

  editors.addEventListener('change', ev=>{
    ev.stopPropagation()
    ev.preventDefault()

    console.log(editors.selectedIndex)
    console.log(ev.target.nodeName.toLowerCase(), ev.srcElement)


  }, { capture:true })

  console.log(qs.parse('p=63&spm_id_from=pageDriver&vd_source=c5793fe6ed2923e0fc34d937e1b17963'))
  console.log(dir(screen))

  img.onload = ()=>console.log('image load ...')

  document.body.addEventListener('mousemove', ev=>{
    const { screenX, clientX, offsetX } = ev

  })

}

main()

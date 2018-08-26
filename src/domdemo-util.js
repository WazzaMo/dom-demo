/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const dom = new DOM()

function demoBody() {
  return dom.findElement({selector:"#demo-doc>xhtml>xbody"})
}

function demoRoot() {
  return dom.findElement({id:'demo-doc'}).expect(TAG_DIV)
}

function output() {
  return dom.findElement({id:'output'}).expect(TAG_DIV)
}

function demoPage() {
  return dom.findElement({id:'__demo-page'}).expect(TAG_DIV)
}


function updateDemoSourceWindow() {
  var srcText = makeSrcFromDom(demoRoot())
  output().html( srcText )
}

function updateDemoPageWindow() {
  var _html = demoBody().html()
  demoPage().html( _html )
}

function writeToDemo(task) {
  task()
  updateDemoSourceWindow()
  updateDemoPageWindow()
  updateOptionChoices()
}

function resetDemoHtml() {
  writeToDemo( () => demoBody().html(`
    <h1 id="demo1">Demo Document</h1>
    <p id="demo2">Absolutely anything could happen here</p>
  `))
}

function updateTaskParameterOptions(selectElement) {
  var options = '<option value="#xbody">body</option>\n'
  demoBody().children().each( function(tag){
    if (tag.hasId()) {
      options += `<option value="#${tag.getId()}">
        &lt;${tag.tagName()} id="${tag.getId()}"&gt;
      </option>`
    } else {
      options += `<option value="${tag.selectorPath()}">
        ${tag.tagName()}
      </option>`
    }
  })
  selectElement.html(options)
}

function updateSource(mapping, template) {
  var newSource = template
  for(var key in mapping) {
    var id = mapping[key]
    var element = dom.findElement({id: id})
    var regex = new RegExp(`{{${key}}}`, ['g'])
    var selector = element.value
    if (selector === '#xbody') {
      selector = 'body'
    }
    newSource = newSource.replace(regex, selector)
  }
  return newSource
}

function showResult(taskId, message, isError) {
  var result = dom
    .findElement({id: taskId})
    .selectFirst('.task-result')
  if (!! isError) {
    result.classes().set('task-result-error')
  } else {
    result.classes().remove('task-result-error')
  }
  result.text(message)
}
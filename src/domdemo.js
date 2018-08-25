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

function updateOptionChoices() {
  var selectToUpdate = [
    'appendElement-type', 'hideElement-type'
  ]
  for(var idSelect of selectToUpdate) {
    var selectElement = dom.findElement({id:idSelect})
    updateTaskParameterOptions(selectElement)
  }
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

function uiTaskInnerHtml(event) {
  var htmlInput = dom.findElement({id: 'innerHTMLValue'})

  writeToDemo( ()=> demoBody().html(htmlInput.element.value))
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

function getTargetSelector(appendType) {
  var target
  if (appendType.value == '#xbody') {
    target = demoBody()
  } else {
    target = demoBody().selectFirst(appendType.value)
  }
  return target
}

function updateEvalSource() {
  var uiTask = dom.findElement({id:'task-Eval'})
  var uiTaskCode = uiTask.selectFirst('.ui-task-code')
  var createType = dom.findElement({id:'createElement-type'})
  var text = dom.findElement({id:'newElementText'})
  var appendType = dom.findElement({id:'appendElement-type'})
  var target
  if (appendType.value == '#xbody') {
    target = 'document.body'
  } else {
    target = `document.body.querySelector('${appendType.value}')`
  }
  uiTaskCode.text(`var node = document.createElement( '${createType.value}' )
  node.innerText = '${text.value}'
  ${target}.appendChild(node)`)
}

function uiTaskEval(event) {
  var text = dom.findElement({id:'newElementText'})
  var createType = dom.findElement({id:'createElement-type'})
  var appendType = dom.findElement({id:'appendElement-type'})

  var created = document.createElement(createType.value)
  created.innerText = text.value
  var target = getTargetSelector(appendType)
  writeToDemo( () => target.element.appendChild( created ) )
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

function updateSetAttribSource() {
  var mapping = {_Element: 'hideElement-type'}
  var template = `
    var element = document.body.querySelector('{{_Element}}')
    element.setAttribute('hidden', true)
  `
  dom
    .findElement({id:'task-SetAttrib'})
    .selectFirst('.ui-task-code')
    .text(updateSource(mapping, template))
}

function setupInputChangeObservers() {
  var evalParams = dom
    .findElement({id: 'task-Eval'})
    .selectFirst('div.task-parameters')
  evalParams.on({
    event:dom.event.CHANGE,
    handler:updateEvalSource
  })

  var setAttribParams = dom
    .findElement({id:'task-SetAttrib'})
    .selectFirst('div.task-parameters')
  setAttribParams.on({
    event: dom.event.CHANGE,
    handler: updateSetAttribSource
  })
}

function setupUiTaskButtons() {
  var dom = new DOM()
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'resetDemo',
    handler: resetDemoHtml
  })
  dom.buttonOn({
    event:dom.event.CLICK,
    id:'btn-task-innerHTML',
    handler: uiTaskInnerHtml
  })
  dom.buttonOn({
    event: dom.event.CLICK,
    id:'btn-task-Eval',
    handler: uiTaskEval
  })
}

function setup() {
  setupUiTaskButtons()
  setupUiAccordianButtons()
  setupInputChangeObservers()
  resetDemoHtml()
  updateDemoPageWindow()
  updateDemoSourceWindow()
}

window.onload = setup


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
}

function uiTaskInnerHtml(event) {
  var htmlInput = dom.findElement({id: 'innerHTMLValue'})

  writeToDemo( ()=> demoBody().html(htmlInput.element.value))
}

function updateEvalOptions() {
  var createType = dom.findElement({id:'createElement-type'})
  var appendType = dom.findElement({id:'appendElement-type'})
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
  appendType.html(options)
}

function uiTaskEval(event) {
  var text = dom.findElement({id:'newElementText'})
  var createType = dom.findElement({id:'createElement-type'})
  var appendType = dom.findElement({id:'appendElement-type'})

  var created = document.createElement(createType.value)
  created.innerText = text.value
  var target
  if (appendType.value == '#xbody') {
    target = demoBody()
  } else {
    target = demoBody().selectFirst(appendType.value)
  }
  writeToDemo( () => target.element.appendChild( created ) )
}

function extendAccordianButtons() {
  var task = dom.findElement({id:'task-Eval'})
  var button = task.selectFirst('div.ui-task-header>.ui-accordian')
  button.on({
    event: dom.event.CLICK,
    handler: updateEvalOptions
  })
}

function setupUiTaskButtons() {
  var dom = new DOM()
  dom.buttonOn({
    event:dom.event.CLICK,
    id:'btn-task-innerHTML',
    handler:uiTaskInnerHtml
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
  extendAccordianButtons()
  updateDemoPageWindow()
  updateDemoSourceWindow()
}

window.onload = setup


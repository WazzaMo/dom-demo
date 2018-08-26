/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

 
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

function setTaskEvalInputValueChangeObserver() {
  var evalParams = dom
    .findElement({id: 'task-Eval'})
    .selectFirst('div.task-parameters')
  evalParams.on({
    event:dom.event.CHANGE,
    handler:updateEvalSource
  })
  updateEvalSource()
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

function setupTaskCreateAppendButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id:'btn-task-Eval',
    handler: uiTaskEval
  })
}
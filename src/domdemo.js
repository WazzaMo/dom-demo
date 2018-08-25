/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */


function updateOptionChoices() {
  var selectToUpdate = [
    'appendElement-type', 'hideElement-type'
  ]
  for(var idSelect of selectToUpdate) {
    var selectElement = dom.findElement({id:idSelect})
    updateTaskParameterOptions(selectElement)
  }
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
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'btn-task-setAttrib',
    handler: uiTaskSetAttrib
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


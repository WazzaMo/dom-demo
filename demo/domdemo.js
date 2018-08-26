/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */


function updateOptionChoices() {
  var selectToUpdate = [
    'appendElement-type', 'hideElement-type',
    'askElement-type', 'removeTarget-type',
    'addClassTarget-elem', 'removeClassTarget-elem'
  ]
  for(var idSelect of selectToUpdate) {
    var selectElement = dom.findElement({id:idSelect})
    updateTaskParameterOptions(selectElement)
  }
}

function setupInputChangeObservers() {
  setTaskInnerHtmlChangeObserver()
  setTaskEvalInputValueChangeObserver()
  setTaskSetAttribChangeObserver()
  setTaskGetAttribChangeObserver()
  setTaskRemoveAttribChangeObserver()
  setTaskAddClassChangeObserver()
  setTaskRemoveClassChangeObserver()
}

function setupResetDemoHtmlButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'resetDemo',
    handler: resetDemoHtml
  })
}

function setupUiTaskButtons() {
  setupResetDemoHtmlButton()
  setupTaskInnerHtmlButton()
  setupTaskCreateAppendButton()
  setupTaskSetAttribButton()
  setupTaskGetAttribButton()
  setupTaskRemoveAttribButton()
  setupAddClassButton()
  setupRemoveClassButton()
}

function setup() {
  updateOptionChoices()
  setupUiTaskButtons()
  setupUiAccordianButtons()
  setupInputChangeObservers()
  resetDemoHtml()
  updateDemoPageWindow()
  updateDemoSourceWindow()
}

window.onload = setup


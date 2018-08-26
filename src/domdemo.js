/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */


function updateOptionChoices() {
  var selectToUpdate = [
    'appendElement-type', 'hideElement-type', 'askElement-type'
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


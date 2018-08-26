/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */


function updateOptionChoices() {
  var selectToUpdate = [
    'appendElement-type', 'removeElement-elem',
    'hideElement-type', 'askElement-type',
    'removeTarget-type', 'addClassTarget-elem',
    'removeClassTarget-elem', 'addEventListener-elem'
  ]
  for(var idSelect of selectToUpdate) {
    var selectElement = dom.findElement({id:idSelect})
    updateTaskParameterOptions(selectElement)
  }
}

function setupInputChangeObservers() {
  setTaskInnerHtmlChangeObserver()
  setTaskEvalInputValueChangeObserver()
  setTaskRemoveElementChangeObserver()
  setTaskSetAttribChangeObserver()
  setTaskGetAttribChangeObserver()
  setTaskRemoveAttribChangeObserver()
  setTaskAddClassChangeObserver()
  setTaskRemoveClassChangeObserver()
  setTaskAddEventListenerChangeObserver()
}

function setupResetDemoHtmlButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'resetDemo',
    handler: function() { location.reload() }
  })
}

function setupUiTaskButtons() {
  setupResetDemoHtmlButton()
  setupTaskInnerHtmlButton()
  setupTaskCreateAppendButton()
  setupTaskRemoveElementButton()
  setupTaskSetAttribButton()
  setupTaskGetAttribButton()
  setupTaskRemoveAttribButton()
  setupAddClassButton()
  setupRemoveClassButton()
  setupAddEventListener()
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


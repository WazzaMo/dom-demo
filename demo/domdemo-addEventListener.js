/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const
  ID_TASK_ADDEVENTLISTENER = 'task-addEventListener',
  ID_TARGET_ADDLISTENER = 'addEventListener-elem',
  ID_ADDEVENTNAME = 'addEventName',
  BTNID_TASK_ADDLISTENER = 'btn-task-addListener'
  ID_DEMOPAGE = '__demo-page'


function updateAddEventListenerSource() {
  var mapping = {
    _Element: ID_TARGET_ADDLISTENER,
    _Name: ID_ADDEVENTNAME,
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    element.addEventListener("{{_Name}}", function(event) {
      event.preventDefault()
      alert('Event {{_Name}} fired on {{_Element}}!!')
    })
  `
  var templateBody =
    `document.body.addEventListener("{{_Name}}", function(event) {
      event.preventDefault()
      alert('Event {{_Name}} fired on {{_Element}}!!')
    })
  `

  var code = dom
    .findElement({id: ID_TASK_ADDEVENTLISTENER})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: ID_TARGET_ADDLISTENER})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskAddEventListenerChangeObserver() {
  dom
  .findElement({id: ID_TASK_ADDEVENTLISTENER})
  .selectFirst('.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateAddEventListenerSource
  })
  updateAddEventListenerSource()
}

function taskAddEventListener(elementParam, nameParam) {
  var result = {}
  var element

  if (elementParam.value == '#xbody') {
    element = dom.findElement({id: ID_DEMOPAGE})
  } else {
    element =
      dom
      .findElement({id: ID_DEMOPAGE})
      .selectFirst(elementParam.value)
  }
  if (element.exists()) {
    element.on({
      event: nameParam.value,
      handler: function(ev) {
        alert(`Event ${nameParam.value} fired on ${element.selectorPath()}!!'`)
      }
    })
    result.value = `Event ${nameParam.value} added for ${elementParam.value}`
  } else {
    result.error = `Try a different element - ${elementParam.value} could not be found`
  }

  return result
}

function uiTaskAddEventListener(event) {
  var elementParam = dom.findElement({id: ID_TARGET_ADDLISTENER})
  var nameParam = dom.findElement({id: ID_ADDEVENTNAME})
  var result = taskAddEventListener(elementParam, nameParam)
  if (result['value']) {
    showResult(ID_TASK_ADDEVENTLISTENER, result.value)
  } else {
    showResult(ID_TASK_ADDEVENTLISTENER, result.error, true)
  }
  // writeToDemo( () => {})
}

function setupEventNameOptions() {
  var selectEvent = dom.findElement({id: ID_ADDEVENTNAME})

  for(var eventName in dom.event) {
    eventName = eventName.toLowerCase()
    selectEvent.append(
      `<option value="${eventName}">${eventName}</option>`
    )
  }
}

function setupAddEventListenerButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: BTNID_TASK_ADDLISTENER,
    handler: uiTaskAddEventListener
  })
}

function setupAddEventListener() {
  setupEventNameOptions()
  setupAddEventListenerButton()
}
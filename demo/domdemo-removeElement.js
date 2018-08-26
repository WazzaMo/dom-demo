/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const
  ID_TASK_REMOVE_ELEMENT = 'task-RemoveElement'
  BTNID_TASK_REMOVE_ELEMENT = 'btn-task-removeElement',
  ID_TARGET_REMOVE_ELEMENT = 'removeElement-elem',
  GETATTRIB_ATTRIBNAME_ID = 'getAttributeName'

const ID_DEMO_PAGE = '__demo-page'

function updateRemoveElementSource() {
  var mapping = {
    _Element: ID_TARGET_REMOVE_ELEMENT
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    element.remove()
  `
  var templateBody =
    `// In this demo, you could paste this in JS console.
    var bodySimulator = document.querySelector( "#${ID_DEMO_PAGE}")
    bodySimulator.remove()

    // You can remove the body with the following line...
    document.body.remove()    // (DESTRUCTIVE)
  `

  var code = dom
    .findElement({id: ID_TASK_REMOVE_ELEMENT})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: ID_TARGET_REMOVE_ELEMENT})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskRemoveElementChangeObserver() {
  dom
  .findElement({id: ID_TASK_REMOVE_ELEMENT})
  .selectFirst('div.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateRemoveElementSource
  })
  updateRemoveElementSource()
}

function taskRemoveElement(elementParam) {
  var result = {}

  var element
  if (elementParam.value == '#xbody') {
    element = demoBody()
  } else {
    element = demoBody().selectFirst(elementParam.value)
  }
  if (element.exists()) {
    element.remove()
    result.value = `Element ${element.tagName()} removed`
  } else {
    result.error = `Try a different element - ${elementParam.value} could not be found`
  }
  return result
}

function uiTaskRemoveElement(event) {
  var elementParam = dom.findElement({id: ID_TARGET_REMOVE_ELEMENT})

  var result = taskRemoveElement(elementParam)
  if (result['value']) {
    showResult(ID_TASK_REMOVE_ELEMENT, result.value)
  } else {
    showResult(ID_TASK_REMOVE_ELEMENT, result.error, true)
  }
  writeToDemo( ()=>{} )
}

function setupTaskRemoveElementButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: BTNID_TASK_REMOVE_ELEMENT,
    handler: uiTaskRemoveElement
  })
}
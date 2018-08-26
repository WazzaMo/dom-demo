/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const TASK_GET_ATTRIB = 'task-GetAttrib'
const GETATTRIB_ELEMENT_ID = 'askElement-type'
const GETATTRIB_ATTRIBNAME_ID = 'getAttributeName'

function updateGetAttribSource() {
  var mapping = {
    _Element: GETATTRIB_ELEMENT_ID,
    _Name: GETATTRIB_ATTRIBNAME_ID
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    var value = element.getAttribute("{{_Name}}")
    console.log(value)
  `
  var templateBody =
    `var value = document.body.getAttribute("{{_Name}}")
    console.log(value)
  `

  var code = dom
    .findElement({id: TASK_GET_ATTRIB})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: GETATTRIB_ELEMENT_ID})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskGetAttribChangeObserver() {
  dom
  .findElement({id: TASK_GET_ATTRIB})
  .selectFirst('div.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateGetAttribSource
  })
  updateGetAttribSource()
}

function taskGetAttribShowResult(message, isError) {
  showResult(TASK_GET_ATTRIB, message, isError)
}

function taskGetAttrib(elementParam, nameParam) {
  var result = {}

  var element
  if (elementParam.value == '#xbody') {
    element = demoBody()
  } else {
    element = demoBody().selectFirst(elementParam.value)
  }
  if (element.exists()) {
    if (element.attributes().has(nameParam.value)) {
      result.value = element.attributes().get(nameParam.value)
    } else {
      result.error =
        `Element ${elementParam.value} does not `
        + `have attribute "${nameParam.value}"`
    }
  } else {
    result.error = `Try a different element - ${elementParam.value} could not be found`
  }
  return result
}

function uiTaskGetAttrib(event) {
  var elementParam = dom.findElement({id: GETATTRIB_ELEMENT_ID})
  var nameParam = dom.findElement({id: GETATTRIB_ATTRIBNAME_ID})

  if (nameParam.value.length == 0) {
    taskGetAttribShowResult("Attribute name not entered", true)
  } else {
    var result = taskGetAttrib(elementParam, nameParam)
    if (result['value']) {
      taskGetAttribShowResult(result.value)
    } else {
      taskGetAttribShowResult(result.error, true)
    }
  }
}

function setupTaskGetAttribButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'btn-task-getAttrib',
    handler: uiTaskGetAttrib
  })
}
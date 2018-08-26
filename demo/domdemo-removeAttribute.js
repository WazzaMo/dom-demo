/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const TASK_REMOVE_ATTRIB = 'task-RemoveAttrib'
const REMOVEATTRIB_ELEMENT_ID = 'removeTarget-type'
const REMOVEATTRIB_ATTRIBNAME_ID = 'removeAttributeName'
const BTNID_REMOVEATTRIB = 'btn-task-removeAttrib'
const TEXTID_REMOVEATTRIB = 'removeAttributeName'

function updateRemoveAttribSource() {
  var mapping = {
    _Element: REMOVEATTRIB_ELEMENT_ID,
    _Name: REMOVEATTRIB_ATTRIBNAME_ID
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    element.removeAttribute("{{_Name}}")
  `
  var templateBody =
    `document.body.removeAttribute("{{_Name}}")
  `

  var code = dom
    .findElement({id: TASK_REMOVE_ATTRIB})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: REMOVEATTRIB_ELEMENT_ID})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskRemoveAttribChangeObserver() {
  dom
  .findElement({id: TASK_REMOVE_ATTRIB})
  .selectFirst('div.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateRemoveAttribSource
  })
  updateRemoveAttribSource()
}

function taskRemoveAttribShowResult(message, isError) {
  showResult(TASK_REMOVE_ATTRIB, message, isError)
}

function taskRemoveAttrib(elementParam, nameParam) {
  var result = {}

  var element
  if (elementParam.value == '#xbody') {
    element = demoBody()
  } else {
    element = demoBody().selectFirst(elementParam.value)
  }
  if (element.exists()) {
    if (element.attributes().has(nameParam.value)) {
      element.attributes().remove(nameParam.value)
      result.value = "Success!"
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

function uiTaskRemoveAttrib(event) {
  var elementParam = dom.findElement({id: REMOVEATTRIB_ELEMENT_ID})
  var nameParam = dom.findElement({id: REMOVEATTRIB_ATTRIBNAME_ID})

  if (nameParam.value.length == 0) {
    taskRemoveAttribShowResult("Attribute name not entered", true)
  } else {
    var result = taskRemoveAttrib(elementParam, nameParam)
    if (result['value']) {
      taskRemoveAttribShowResult(result.value)
      writeToDemo( ()=>{} )
    } else {
      taskRemoveAttribShowResult(result.error, true)
    }
  }
}

function setupTaskRemoveAttribButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: BTNID_REMOVEATTRIB,
    handler: uiTaskRemoveAttrib
  })
}
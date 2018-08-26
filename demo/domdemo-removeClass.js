/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const
  ID_TASK_REMOVECLASS = 'task-removeClass',
  ID_TARGET_REMOVECLASS = 'removeClassTarget-elem',
  ID_REMOVECLASSNAME = 'removeClassName',
  BTNID_TASK_REMOVECLASS = 'btn-task-removeClass'


function updateRemoveClassSource() {
  var mapping = {
    _Element: ID_TARGET_REMOVECLASS,
    _Name: ID_REMOVECLASSNAME,
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    element.classList.remove("{{_Name}}")
  `
  var templateBody =
    `var value = document.body.classList.remove("{{_Name}}")
  `

  var code = dom
    .findElement({id: ID_TASK_REMOVECLASS})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: ID_TARGET_REMOVECLASS})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskRemoveClassChangeObserver() {
  dom
  .findElement({id: ID_TASK_REMOVECLASS})
  .selectFirst('.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateRemoveClassSource
  })
  updateRemoveClassSource()
}

function taskRemoveClass(elementParam, nameParam) {
  var result = {}
  var element

  if (! nameParam.value || nameParam.value.length == 0) {
    result.error = `Class name can not be empty`
  } else {
    if (elementParam.value == '#xbody') {
      element = demoBody()
    } else {
      element = demoBody().selectFirst(elementParam.value)
    }
    if (element.exists()) {
      if (element.classes().has(nameParam.value)) {
        element.classes().remove(nameParam.value)
        result.value = `Success!`
      } else {
        result.error = `Element ${elementParam.value} `
        + `does not have class "${nameParam.value}" - nothing to do!`
      }
    } else {
      result.error = `Try a different element - ${elementParam.value} could not be found`
    }
  }
  return result
}

function uiTaskRemoveClass(event) {
  var elementParam = dom.findElement({id: ID_TARGET_REMOVECLASS})
  var nameParam = dom.findElement({id: ID_REMOVECLASSNAME})
  var result = taskRemoveClass(elementParam, nameParam)
  if (result['value']) {
    showResult(ID_TASK_REMOVECLASS, result.value)
  } else {
    showResult(ID_TASK_REMOVECLASS, result.error, true)
  }
  writeToDemo( () => {})
}

function setupRemoveClassButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: BTNID_TASK_REMOVECLASS,
    handler: uiTaskRemoveClass
  })
}
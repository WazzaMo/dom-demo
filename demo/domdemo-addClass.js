/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

const
  ID_TASK_ADDCLASS = 'task-addClass',
  ID_TARGET_ADDCLASS = 'addClassTarget-elem',
  ID_ADDCLASSNAME = 'addClassName',
  BTNID_TASK_ADDCLASS = 'btn-task-addClass'


function updateAddClassSource() {
  var mapping = {
    _Element: ID_TARGET_ADDCLASS,
    _Name: ID_ADDCLASSNAME,
  }
  var templateSubElement =
    `var element = document.body.querySelector('{{_Element}}')
    element.classList.add("{{_Name}}")
  `
  var templateBody =
    `var value = document.body.classList.add("{{_Name}}")
  `

  var code = dom
    .findElement({id: ID_TASK_ADDCLASS})
    .selectFirst('.ui-task-code')

  var chosenElement = dom.findElement({id: ID_TARGET_ADDCLASS})

  if (chosenElement.value == '#xbody') {
    code.text(updateSource(mapping, templateBody))
  } else {
    code.text(updateSource(mapping, templateSubElement))
  }
}

function setTaskAddClassChangeObserver() {
  dom
  .findElement({id: ID_TASK_ADDCLASS})
  .selectFirst('.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateAddClassSource
  })
  updateAddClassSource()
}

function taskAddClass(elementParam, nameParam) {
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
        result.error = `Element ${elementParam.value} `
        + `already has class "${nameParam.value}" - nothing to do!`
      } else {
        element.classes().add(nameParam.value)
        result.value = `Success!`
      }
    } else {
      result.error = `Try a different element - ${elementParam.value} could not be found`
    }
  }
  return result
}

function uiTaskAddClass(event) {
  var elementParam = dom.findElement({id: ID_TARGET_ADDCLASS})
  var nameParam = dom.findElement({id: ID_ADDCLASSNAME})
  var result = taskAddClass(elementParam, nameParam)
  if (result['value']) {
    showResult(ID_TASK_ADDCLASS, result.value)
  } else {
    showResult(ID_TASK_ADDCLASS, result.error, true)
  }
  writeToDemo( () => {})
}

function setupAddClassButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: BTNID_TASK_ADDCLASS,
    handler: uiTaskAddClass
  })
}
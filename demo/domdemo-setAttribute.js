/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

function updateSetAttribSource() {
  var mapping = {_Element: 'hideElement-type'}
  var template =
    `var element = document.body.querySelector('{{_Element}}')
    element.setAttribute('hidden', true)
  `
  dom
    .findElement({id:'task-SetAttrib'})
    .selectFirst('.ui-task-code')
    .text(updateSource(mapping, template))
}

function setTaskSetAttribChangeObserver() {
  var setAttribParams = dom
  .findElement({id:'task-SetAttrib'})
  .selectFirst('div.task-parameters')
  setAttribParams.on({
    event: dom.event.CHANGE,
    handler: updateSetAttribSource
  })
  updateSetAttribSource()
}

function uiTaskSetAttrib(event) {
  var elementParam = dom.findElement({id: 'hideElement-type'})
  var target = demoBody().selectFirst(elementParam.value)
  writeToDemo( () => target.attributes().set('hidden', true))
}

function setupTaskSetAttribButton() {
  dom.buttonOn({
    event: dom.event.CLICK,
    id: 'btn-task-setAttrib',
    handler: uiTaskSetAttrib
  })
}
/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

function updateSetAttribSource() {
  var mapping = {_Element: 'hideElement-type'}
  var template = `
    var element = document.body.querySelector('{{_Element}}')
    element.setAttribute('hidden', true)
  `
  dom
    .findElement({id:'task-SetAttrib'})
    .selectFirst('.ui-task-code')
    .text(updateSource(mapping, template))
}

function uiTaskSetAttrib(event) {
  var elementParam = dom.findElement({id: 'hideElement-type'})
  var target = demoBody().selectFirst(elementParam.value)
  writeToDemo( () => target.attributes().set('hidden', true))
}
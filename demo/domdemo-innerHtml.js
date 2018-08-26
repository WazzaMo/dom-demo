/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

function updateInnerHtmlSource() {
  var mapping = {_Value: 'innerHTMLValue'}
  var template =
    `document.body.innerHTML = \`{{_Value}}\``
  dom
    .findElement({id:'task-innerHTML'})
    .selectFirst('.ui-task-code')
    .text(updateSource(mapping, template))
}

function setTaskInnerHtmlChangeObserver() {
  dom
  .findElement({id:'task-innerHTML'})
  .selectFirst('.task-parameters')
  .on({
    event: dom.event.CHANGE,
    handler: updateInnerHtmlSource
  })
  updateInnerHtmlSource()
}

function uiTaskInnerHtml(event) {
  var htmlInput = dom.findElement({id: 'innerHTMLValue'})

  writeToDemo( ()=> demoBody().html(htmlInput.element.value))
}

function setupTaskInnerHtmlButton() {
  dom.buttonOn({
    event:dom.event.CLICK,
    id:'btn-task-innerHTML',
    handler: uiTaskInnerHtml
  })
}
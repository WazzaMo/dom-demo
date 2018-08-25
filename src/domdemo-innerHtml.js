/*
 * (c) Copyright 2018, Warwick Molloy
 * DOM Demo
 * License: MIT
 */

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
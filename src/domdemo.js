const dom = new DOM()

function demoBody() {
  return dom.findElement({selector:"#demo-doc>xhtml>xbody"})
}

function demoRoot() {
  return dom.findElement({id:'demo-doc'}).expect(TAG_DIV)
}

function output() {
  return dom.findElement({id:'output'}).expect(TAG_DIV)
}

function demoPage() {
  return dom.findElement({id:'__demo-page'}).expect(TAG_DIV)
}

function updateAccordianClass(parent, isCollapsed) {
  const COLLAPSE_CLASS = 'ui-task-collapsed'
  const EXPAND_CLASS = 'ui-task-expanded'

  if (isCollapsed) {
    parent.classes().add(COLLAPSE_CLASS)
    parent.classes().remove(EXPAND_CLASS)
  } else {
    parent.classes().remove(COLLAPSE_CLASS)
    parent.classes().add(EXPAND_CLASS)
  }
}

function updateAccordianParent(buttonResult, isCollapsed) {
  var uiTask = buttonResult.getParent().getParent()
  var collapsable = uiTask.selectAll('.collapse-away')

  collapsable.each(function(item) {
    if (isCollapsed) {
      item.attributes().set('hidden', true)
    } else {
      item.attributes().remove('hidden')
    }
  })

  updateAccordianClass(uiTask, isCollapsed)
}

function setAccordianButton(button, isCollapsed) {
  var buttonText = isCollapsed ? 'Expand' : 'Collapse'
  button.text(buttonText)
  var state = isCollapsed ? 'collapsed': 'expanded'
  button.attributes().set('data-is-collapsed', state)
  updateAccordianParent(button, isCollapsed)
}

function generateAccordianHandler(button) {
  var handler = function(event) {
    var isCollapsedValue = button.attributes().get('data-is-collapsed')
    var isCollapsed = isCollapsedValue == 'collapsed'
    setAccordianButton(button, ! isCollapsed )
  }
  return handler
}

function updateDemoSourceWindow() {
  var srcText = makeSrcFromDom(demoRoot())
  output().html( srcText )
}

function updateDemoPageWindow() {
  var _html = demoBody().html()
  demoPage().html( _html )
}

function writeToDemo(task) {
  task()
  updateDemoSourceWindow()
  updateDemoPageWindow()
}

function uiTaskInnerHtml(event) {
  var htmlInput = dom.findElement({id: 'innerHTMLValue'})
  console.log(`Writing htmlInput: ${htmlInput.value}`)
  writeToDemo( ()=> demoBody().html(htmlInput.element.value))
}

function uiTaskEval(event) {
  var task = dom.findElement({id:'task-Eval'})

  // var jsInput = getElement({id:'evalValue'}).one().element.value
  // var jsStatement = `demoBody().${jsInput}`
  // console.log("Executing: " + jsStatement)
  // writeToDemo( () => eval(jsStatement) )
}

function setupUiTaskButtons() {
  var dom = new DOM()
  dom.buttonOn({
    event:dom.event.CLICK,
    id:'btn-task-innerHTML',
    handler:uiTaskInnerHtml
  })
  dom.buttonOn({
    event: dom.event.CLICK,
    id:'btn-task-Eval',
    handler: uiTaskEval
  })
}

function setupUiAccordianButtons() {
  var accordianButtons = dom.selectAll({class: 'ui-accordian'})
  accordianButtons.each( function(button) {
    handler = generateAccordianHandler(button)
    button.on({event:dom.event.CLICK, handler: handler})
    setAccordianButton(button, true)
  })
  // getElement({class: 'ui-accordian'})
  // accordianButtons.eachMatch( buttonResult => {
  //   handler = generateAccordianHandler(buttonResult)
  //   buttonClick({result: buttonResult}, handler)
  //   setAccordianButton(buttonResult, true)
  // })
}

function setup() {
  setupUiTaskButtons()
  setupUiAccordianButtons()
  updateDemoPageWindow()
  updateDemoSourceWindow()
}

window.onload = setup


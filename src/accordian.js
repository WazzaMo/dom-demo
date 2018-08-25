
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

function setupUiAccordianButtons() {
  var accordianButtons = dom.selectAll({class: 'ui-accordian'})
  accordianButtons.each( function(button) {
    handler = generateAccordianHandler(button)
    button.on({event:dom.event.CLICK, handler: handler})
    setAccordianButton(button, true)
  })
}

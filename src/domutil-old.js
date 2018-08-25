/*
 * Reusable Utility Functions
 */

const
  DOC_KEY_ID = 'ID',
  DOC_KEY_SELECTOR = 'SELECTOR',
  DOC_KEY_CLASS='CLASS',
  DOC_KEY_TAGNAME = 'TAGNAME'

const
  TAG_BUTTON = 'BUTTON',
  TAG_DIV = 'DIV',
  TAG_INPUT = 'INPUT'

function newResultById(arg, id) {
  var result = { arg: arg, element: undefined }
  result.docKey = DOC_KEY_ID
  result.docMatcher = id
  result.element = document.getElementById(id)
  result.single = true
  return result
}

function newResultBySelector(arg, selector) {
  var result = { arg: arg, element: undefined }
  result.docKey = DOC_KEY_SELECTOR
  result.docMatcher = selector
  result.element = document.querySelector(selector)
  result.single = true
  return result
}

function newResultByClass(arg, _class) {
  var result = { arg: arg, element: undefined }
  result.docKey = DOC_KEY_CLASS
  result.docMatcher = _class
  result.collection = document.getElementsByClassName(_class)
  result.single = false
  return result
}

function newResultForElement(element) {
  var selector = createSelectorForElement(element)
  var result = { arg: {selector: selector}, element: element }
  result.docKey = DOC_KEY_SELECTOR
  result.docMatcher = selector
  result.single = true
  return result
}

function createSelectorForElement(element) {
  var isValid = function(e) { return (!! e) }
  var nodeList = []
  while(isValid(element)) {
    var _id = element.getAttribute('id')
    var _class = element.getAttribute('class')
    if (_id) {
      nodeList.push( '#'+_id )
    } else if (_class) {
      nodeList.push( '.'+_class )
    } else {
      nodeList.push( element.tagName )
    }
    element = element.parentElement
  }
  nodeList.reverse()
  return nodeList.reduce( (parent,child) => `${parent}>${child}` )
}

var getArgFun = function () {
  if (this.docKey) {
    var plurality = this.single ? 'element' : 'elements'
    return `Got ${plurality} by ${this.docKey}, matching ${this.docMatcher}`
  } else {
    return `Unrecognised matching argument: ${JSON.stringify(this.arg)}`
  }
}

var expectFun = function (typestring) {
  var element = this.element
  var collection = this.collection
  var matchedBy = this.getArg()

  if (! element ) {
    console.error(`Element is ${element}! Expected ${typestring} matched by ${matchedBy}`)
  } else if (collection) {
    var count = 0
    for(var index in collection) {
      element = collection[index]
      if (element.tagName != typestring) {
        count++
      }
    }
    if (count > 0) {
      console.error(`There were ${count} elements in the collection matched by ${matchedBy} NOT of type ${typestring}`)
    }
  } else if ( element.tagName != typestring) {
    console.error(`Expected Element of ${matchedBy} to be a ${typestring}`)
  }
  return this
}

var singularizerFun = function () {
  var isCollection = (!! this.collection) && (! this.single)
  if (isCollection && this.collection.length == 1) {
    this.element = this.collection[0]
    this.single = true
  }
  return this
}

var oneFun = function() {
  var isSingle = this.single && (!! this.element)
  var matchedBy = this.getArg()

  if (! isSingle) {
    console.error(`Expected single element matched by ${matchedBy}`)
    return undefined
  }
  return this
}

var selectFun = function(selector) {
  var isSingle = this.single && (!! this.element)
  var isCollection = (!!this.collection)
  if (isSingle) {
    var foundElement = this.element.querySelector(selector)
    return makeResultForElement(foundElement)
  } else if (isCollection) {
    console.error(
      `Cannot perform a select() a collection - ${this.getArg()}`
    )
  } else {
    console.error(
      `Cannot perform select() where match failed - attempted match of ${this.getArg()}`
    )
  }
  return undefined
}

var eachChildFun = function(task, where_true) {
  var criteria = (!! where_true) ? where_true : (element) => true
  var isSingle = this.single && (!! this.element)
  if (task && isSingle) {
    var children = this.element.children
    for(childElement of children) {
      var childResult = makeResultForElement(childElement)
      if (criteria(childResult)) {
        task(childResult)
      }
    }
  }
  return this
}

var eachMatchFun = function(task, where_true) {
  var criteria = (!! where_true) ? where_true : (element) => true
  var isSingle = this.single && (!! this.element)

  if (isSingle) {
    console.error('Cannot call eachMatch on single element: ' + this.toSelector())
  } else {
    var collection = this.collection
    for( element of collection) {
      var result = makeResultForElement(element)
      if (criteria(result)) {
        task(result)
      }
    }
  }
  return this
}

var hasClassFun = function(className) {
  var isSingle = this.single && (!! this.element)
  if (isSingle) {
    var classes = this.element.className
    return classes.indexOf(className) >= 0
  } else {
    console.error(`Only elements can have a class name - matched by ${this.getArg()}`)
  }
  return false
}

var getParentFun = function() {
  var element = this.element
  var collection = this.collection
  if (!! element) {
    return makeResultForElement(element.parentElement)
  } else if (!! collection && collection.length > 0) {
    element = collection[0]
    return makeResultForElement(element.parentElement)
  } else {
    console.error(`Could not get parent - matched by ${this.getArg()}`)
    return undefined
  }
}

var attribFun = function(name,param) {
  var isSingle = this.single && (!! this.element)
  var element = this.element

  if (isSingle) {
    if (typeof(param)==='function') {
      var attributeFunction = param
      var attributeObject = element.attributes.getNamedItem(name)
      if (attributeObject) {
        attributeFunction(attributeObject.value)
      } else {
        attributeFunction(undefined)
      }
    } else if (param) {
      element.setAttribute(name, param)
    } else {
      var attributeObject = element.attributes.getNamedItem(name)
      var value = undefined
      if (attributeObject) {
        value = attributeObject.value
      }
      return value
    }
  }
  return this
}

function addResultFunctions(result) {
  result.expect = expectFun.bind(result)
  result.getArg = getArgFun.bind(result)
  result._singularizer = singularizerFun.bind(result)
  result.one = oneFun.bind(result)
  result.select = selectFun.bind(result)
  result.eachChild = eachChildFun.bind(result)
  result.attrib = attribFun.bind(result)
  result.eachMatch = eachMatchFun.bind(result)
  result.toSelector = function() { return createSelectorForElement(result.element) }
  result.getParent = getParentFun.bind(result)
  result.hasClass = hasClassFun.bind(result)
  result._singularizer()
}

function makeResultForElement(element) {
  var result = newResultForElement(element)
  addResultFunctions(result)
  return result
}

function getElement(arg) {
  var result = { arg: arg, element: undefined }
  var id = arg.id
  var selector = arg.selector
  var _class = arg.class
  if (id) {
    result = newResultById(arg, id)
  } else if (selector) {
    result = newResultBySelector(arg, selector)
  } else if (_class) {
    result = newResultByClass(arg, _class)
  }
  
  addResultFunctions(result)
  return result
}

function button(arg) {
  var btn = getElement(arg).one().expect( TAG_BUTTON ).element
  return btn
}

function handle(arg, type, listener) {
  var isAllowDefault = arg.isAllowDefault
  var result = arg.result
  if (!! result) {
    tagName = result.element.tagName
  } else {
    tagName = arg.tagName
    result = (!! tagName) ? getElement(arg).expect(tagName) : getElement(arg)
  }

  result.one().element.addEventListener(type, function(event) {
    if (isAllowDefault) {
      event.preventDefault()
    }
    listener(event)
  })
}

function buttonClick(arg, handler) {
  arg.tagName = TAG_BUTTON
  handle(arg, 'click', handler)
}

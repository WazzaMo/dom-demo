/*
 * Fluid DOM for JavaScript
 * (c) Copyright 2018 Warwick Molloy
 * Available under the MIT License
 */

const
  DOC_KEY_ID = 'ID',
  DOC_KEY_SELECTOR = 'SELECTOR',
  DOC_KEY_CLASS='CLASS',
  DOC_KEY_TAGNAME = 'TAGNAME',
  DOC_KEY_CHILDREN = 'CHILDREN',
  DOC_KEY_ELEMENT = 'ELEMENT'

const
  TAG_BUTTON = 'BUTTON',
  TAG_DIV = 'DIV',
  TAG_INPUT = 'INPUT'


function providesAll(list, args) {
  var message = ''
  for(var expectedArg of list) {
    var value = args[expectedArg]
    if (!value) {
      message += `Value for ${expectedArg} was not provided.\n`
    }
  }
  if (!!message) {
    console.error(`Expected ${list.length} parameters:\n${message}`)
    return false
  }
  return true
}

function providesOne(list, args) {
  var valuesOfArgs = list.map( expectedWord => args[expectedWord] )
  var isAnyNotUndefined = valuesOfArgs.find( x => x != undefined )
  if (!isAnyNotUndefined) {
    var argumentNames = list.reduce( (arg1, arg2) => `${arg1}, ${arg2}`)
    console.error(`One of these parameters were expected ${argumentNames} but none had a value!`)
  }
  return !!isAnyNotUndefined
}

function Attributes(element) {
  return {
    element: element,
    each: function(task) {
      for(var attribute of element.attributes) {
        task(attribute.name, attribute.value)
      }
      return this
    },
    attributeNames: function() {
      var list = []
      this.each( (name,val) => list.push(name))
      return list
    },
    set: function(name, value) {
      this.element.setAttribute(name, value)
      return this
    },
    with: function(name, task) {
      var value = this.get(name)
      task(value)
      return this
    },
    get: function(name) {
      return this.element.getAttribute(name)
    },
    has: function(name) {
      return this.element.getAttribute(name) != null
    },
    remove: function(name) {
      this.element.removeAttribute(name)
      return this
    }
  }
}

function Classes(element, elementObject) {
  return {
    elementObject: elementObject,
    each: function(task) {
      for(var _class of element.classList) {
        task(_class)
      }
      return this
    },
    has: function(name) {
      return element.classList.contains(name)
    },
    whenHas: function(name, task) {
      if (this.has(name)) {
        task(elementObject)
      }
      return this
    },
    add: function(_class) {
      if (!! _class && _class.length > 0) {
        element.classList.add(_class)
      } else {
        console.error(`Class name given was "${_class}" - it must not be empty!`)
      }
      return this
    },
    remove: function(_class) {
      element.classList.remove(_class)
    },
    set: function(_class) {
      if (! this.has(_class)) {
        this.add(_class)
      }
      return this
    }
  }
}

function Element(arg) {
  var id = arg.id
  var selector = arg.selector
  var keyType = undefined
  var matcher
  var element = arg.element
  var isValid

  if (!!element) {
    keyType = DOC_KEY_ELEMENT
    matcher = 'ELEMENT: ' + element.tagName
    isValid = !!element
  } else if (!!id) {
    keyType = DOC_KEY_ID
    element = document.getElementById(id)
    matcher = id
    isValid = !!element
  } else if (!!selector) {
    keyType = DOC_KEY_SELECTOR
    matcher = selector
    element = document.querySelector(selector)
    isValid = !!element
  } else {
    providesOne(['id', 'selector'], arg)
    isValid = false
    element = {
      tagName: `NO MATCH by ${arg}`,
      parentElement: undefined,
      innerHTML: undefined,
      innerText: undefined
    }
  }
  return {
    docKey: keyType,
    docMatcher: matcher,
    element: element,
    parent: isValid ? element.parentElement : undefined,
    value: isValid ? element.value : undefined,
    type: 'Element',
    arg: arg,
    isSingle: true,
    // -- methods --
    children: function() {
      return new ElementList({
        children: this.element.children,
        parent: this.element
      })
    },
    expect: function(tagName) {
      if (this.element.tagName === tagName) {
        return this
      } else {
        console.error(`Expected ${tagName} but Actual ${element.tagName}`)
      }
    },
    getId: function() {
      return this.attributes().get('id')
    },
    getParent: function() {
      return new Element({element: this.element.parentElement})
    },
    hasId: function() {
      return this.attributes().has('id')
    },
    exists: function() {
      return isValid
    },
    selectAll: function(selector) {
      var elementList = this.element.querySelectorAll(selector)
      return new ElementList({children: elementList, parent: this.element})
    },
    selectFirst: function(selector) {
      if (typeof(selector) === 'string') {
        var element = this.element.querySelector(selector)
        if (!element) {
          console.error(`Selector ${selector} did not match an element`)
          return undefined
        }
        return new Element({element: element})
      } else {
        console.error(`Not a valid selector string: ${JSON.stringify(selector)}`)
        return undefined
      }
    },
    selectorPath: function() {
      var element = this.element
      var isValid = (e) => (!! e)
      var nodeList = []
      while(isValid(element)) {
        var _id = element.getAttribute('id')
        var _class = element.getAttribute('class')
        if (_id) {
          nodeList.push( '#'+_id )
          element = null // break out
        } else {
          if (_class) {
            nodeList.push( '.'+_class )
          } else {
            nodeList.push( element.tagName )
          }
          element = element.parentElement
        }
      }
      nodeList.reverse()
      return nodeList.reduce( (parent,child) => `${parent}>${child}` )
    },
    tagName: function() {
      return this.element.tagName
    },
    text: function(_text) {
      if (!!_text) {
        this.element.innerText = _text
        return this
      }
      return this.element.innerText
    },
    html: function(_html) {
      if (!! _html) {
        this.element.innerHTML = _html
        return this
      } else {
        return this.element.innerHTML
      }
    },
    append: function(_html) {
      var totalHtml = `${this.html()}${_html}`
      this.html(totalHtml)
      return this
    },
    prepend: function(_html) {
      var totalHtml = `${_html}${this.html()}`
      this.html(totalHtml)
      return this
    },
    remove: function() {
      this.element.remove()
      return undefined
    },
    attributes: function() {
      return new Attributes(this.element)
    },
    classes: function() {
      return new Classes(this.element, this)
    },
    on: function(args) {
      if (providesAll(['event','handler'], args)) {
        var event = args.event
        var handler = args.handler
        var optKeepDefault = args.keepDefault
        this.element.addEventListener(event, function(firedEvent) {
          if (! optKeepDefault) {
            firedEvent.preventDefault()
          }
          handler(firedEvent)
        })
      }
    }
  }
}

function ElementList(arg) {
  var selector = arg.selector
  var tagName = arg.tagName
  var children = arg.children
  var _class = arg.class
  var keyType = undefined
  var matcher
  var parent
  var elementList
  if (!!selector ) {
    elementList = document.querySelectorAll(selector)
    keyType = DOC_KEY_SELECTOR
    matcher = selector
    parent = elementList.length > 0 ? elementList[0].parentElement : undefined
  } else if (!!tagName) {
    elementList = document.getElementsByTagName(tagName)
    parent = elementList.length > 0 ? elementList[0].parentElement : undefined
    keyType = DOC_KEY_TAGNAME
    matcher = tagName
  } else if (!!children) {
    elementList = children,
    parent = arg.parent,
    keyType = DOC_KEY_CHILDREN
    matcher = 'CHILDREN'
  } else if (!!_class) {
    elementList = document.getElementsByClassName(_class)
    parent = elementList.length > 0 ? elementList[0].parentElement : undefined
    keyType = DOC_KEY_CLASS
    matcher = _class
  } else {
    providesOne(['selector', 'class', 'tagName'], arg)
    elementList = []
  }
  return {
    elementList: elementList,
    parent: parent,
    docKey: keyType,
    isSingle: false,
    docMatcher: matcher,
    arg: arg,
    type: 'ElementList',
    // -- methods --
    each: function(doTask) {
      for(var index = 0; index < this.elementList.length; index++) {
        var item = this.elementList[index]
        doTask( new Element({element: item}) )
      }
      return this
    },
    getElementAt: function(index) {
      var element = this.elementList[index]
      return new Element({element: element})
    },
    length: function() {
      return this.elementList.length
    }
  }
}

function DOM() {
  var eventlist = [
    'abort', 'afterscriptexecute',
    'animationcancel', 'animationend', 'animationiteration',
    'auxclick',
    'beforescriptexecute', 'blur',
    'change', 'click', 'close', 'contextmenu',
    'dblclick',
    'error',
    'focus', 'fullscreenchange', 'fullscreenerror',
    'gotpointercapture',
    'input',
    'keydown', 'keypress', 'keyup',
    'load', 'loadend', 'loadstart', 'lostpointercapture',
    'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
    'offline', 'online',
    'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave',
    'pointermove', 'pointerout', 'pointerover', 'pointerup', 
    'reset', 'resize',
    'scroll', 'select', 'selectionchange', 'selectionchange',
    'selectstart', 'submit', 
    'touchcancel', 'touchmove', 'touchstart',
    'transitioncancel', 'transitionend',
    'visibilitychange',
    'wheel'
  ]
  var events = {}
  for(var ev of eventlist) {
    var key = ev.toUpperCase()
    events[key] = ev
  }
  return {
    event: events,
    findElement: function(arg) {
      return new Element(arg)
    },
    selectAll: function(arg) {
      return new ElementList(arg)
    },
    buttonOn(arg) {
      if (providesAll(['id', 'event', 'handler'],arg)) {
        var id = arg.id
        var event = arg.event
        var handler = arg.handler
        var button = this.findElement({id: id}).expect(TAG_BUTTON)
        button.on(arg)
      }
    }
  }
}


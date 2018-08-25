

function getListOfLines(src) {
  return src.split("\n")
}

function getLongestLine(lines) {
  return lines.reduce(
    (lineA,lineB) => (lineA.length > lineB.length) ? lineA : lineB
  )
}

function getIndentLongestLine(lines) {
  var index = 0
  for(var lineNum = 0; lineNum < lines.length; lineNum++) {
    var match = lines[lineNum].match(/[^ ^\t]/)
    var ti = match ? match.index : 0
    index = (ti > 0) ? ti : index
  }
  return index;
}

function makeGlobalReplaceMatcher(indentString) {
  return new RegExp(indentString,'g')
}

function hasAnyNonSpaceCharacter(line) {
  return line.match(/[^ ^\t]/) != null
}

function makeSpacePadding(len) {
  var padding = ''
  for(var index = 0; index < len; index++) {
    padding += ' '
  }
  return padding
}

function makeConsistentIndent(baseLen, line) {
  const TRIM_BUFFER = 5

  var prefix = line.substr(0,baseLen-TRIM_BUFFER)
  var adjustedLine
  if (hasAnyNonSpaceCharacter(prefix)) {
    adjustedLine = makeSpacePadding(baseLen) + line
    // console.log(`padded:${adjustedLine}||Padding was|${makeSpacePadding(baseLen)}|`)
  } else {
    adjustedLine = line.substr(baseLen - TRIM_BUFFER)
    // console.log(`trimmed:${adjustedLine} | BaseLen=${baseLen}  line=[${line}]`)
  }
  return adjustedLine
}

function removeIndent(src) {
  var lines = getListOfLines(src)
  var indentLen = getIndentLongestLine(lines)
  var unindentedLines = lines.map( aLine => makeConsistentIndent(indentLen, aLine) ) //aLine.substr(indentLen - 5))
  return unindentedLines.join("\n")
}

function makeSrcFromDom(root) {
  var raw = root.html();
  var encodeSrc = raw
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/xhtml/g, 'html')
    .replace(/xbody/g, 'body')
    ;
  var unIndented = removeIndent(encodeSrc)
  return `<pre>${unIndented}</pre>`
}
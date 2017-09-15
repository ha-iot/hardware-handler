(function () {
  if (!Array.prototype.forEach) {
    // Source: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Compatibilidade
    Array.prototype.forEach = function (fn, scope) {
      for (var i = 0, len = this.length; i < len; ++i) {
        fn.call(scope, this[i], i, this)
      }
    }
  }

  var buttons = document.getElementsByTagName('button')

  Array.prototype.forEach.call(buttons, function (button) {
    button.onclick = buttonClick
  })

  var mainTitle = document.querySelector('.mainTitle')
  var originalTitle = mainTitle.innerHTML

  function buttonClick(e) {
    e.preventDefault()

    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', '/api/relays/' + e.target.value, false) // false for synchronous (guarantee that the app will have this values)
    xmlHttp.send()

    mainTitle.innerHTML = xmlHttp.responseText

    setTimeout(function () {
      mainTitle.innerHTML = originalTitle
    }, 2000)
  }
})()

// 回调地狱
$.get('url1', function (data1) {
  $.get('url2', function (data2) {
    $.get('url3', function (data3) {
      $.get('url4', function (data4) {
        // ...
      })
    })
  })
})

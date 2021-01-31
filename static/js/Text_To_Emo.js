  var i = 2 ;
  var my_div = null;
  var newh1 = null;
  var newDiv = null;
  var num = [];
 
  function equ_result() {
    var val = 0;
      for (let x = 1; x < i; x++) {
        val =  val + num[x];
      }
      val = val / (i - 1);
      document.getElementById("equ").innerHTML = (val).toFixed(5);
      for (let x = 1; x < i; x++) {
        document.getElementById("result_" + x + "_2").innerHTML = (num[x] - val).toFixed(5);
      }
  }

  function send(x){
    var str = document.getElementById( "inputform_" + x ).value;
    var textdata = JSON.stringify({"data":$("#inputform_" + x).val()});
    $(function(){
      $('.result_' + x).html("Loading...");
      document.getElementById("equ").innerHTML = "Loading...";
      document.getElementById('result_' + x + '_2').innerHTML = "Loading...";
      $.ajax({
             url: '/input',
             type: 'POST',
             scriptCharset: 'utf-8',
             data: textdata,
             contentType: "application/json" ,
             dataType: "json",
         }).done(function(data){
             console.log('感情値：' + data);
             $('.result_' + x).html(data);
             num[x] = Number(data);
             equ_result()
         }).fail(function(){
             data = "0.00000";
             console.log('感情値：' + data);
             $('.result_' + x).html(data);
             num[x] = Number(data);
             equ_result()
             console.log('failed');
         });
     });
  };

  function addParagraph() {
    var newDiv = document.createElement("h2");
    var newContent = document.createTextNode("段落" + i);
    newDiv.appendChild(newContent);

    var input_data = document.createElement('textarea');
    input_data.type = 'text';
    input_data.id = 'inputform_' + i;
    input_data.placeholder = '段落' + i;
    input_data.rows="3" 
    input_data.style="width:70%; float:left;"
    input_data.onkeydown=function(){
      textareaResize(event);
    }
    input_data.class = "textbox" 
    input_data.wrap="hard" 
    var newnum = i;
    input_data.onkeyup=function(){
      send(newnum);
    }     

    var newh = document.createElement("h1");
    var newContent2 = document.createTextNode("絶対感情値：");
    newh.appendChild(newContent2);
    newh.className = "inline";

    var newh1 = document.createElement("h1");
    var newContent2 = document.createTextNode("入力前");
    newh1.appendChild(newContent2);
    newh1.className = 'result_' + i + " feel_point" + " inline";

    var newbr = document.createElement("br");

    var newh_2 = document.createElement("h1");
    var newContent2_2 = document.createTextNode("相対感情値：");
    newh_2.appendChild(newContent2_2);
    newh_2.className = "inline";

    var newh1_2 = document.createElement("h1");
    var newContent2_2 = document.createTextNode("入力前");
    newh1_2.appendChild(newContent2_2);
    newh1_2.className = 'result_' + i + " feel_point" + " inline";
    newh1_2.id = 'result_' + i + '_2'

    var newbr2 = document.createElement("br");
    newbr2.clear = "left";
    
    var parent = document.getElementById('form_area');
    parent.appendChild(newDiv);
    parent.appendChild(input_data);
    parent.appendChild(newh);
    parent.appendChild(newh1);
    parent.appendChild(newbr);
    parent.appendChild(newh_2);
    parent.appendChild(newh1_2);
    parent.appendChild(newbr2);
    i++ ;
  }

  function textareaResize(event) {
    try {
        elem_id = event.srcElement.id;
    } catch ( e ) {
        elem_id = event.target.id;
    }
    var keycode = event.keyCode;
    if (keycode == 13) {
        var m = document.getElementById(elem_id);
        var r = m.getAttribute("rows");
        m.setAttribute("rows", parseInt(r)+1);
    }
}

function dispText() {
  var txt = "";
  for (let x = 1; x < i; x++) {
     txt = txt + document.getElementById("inputform_"+x).value + "\n\n";
  }
  var blob = new Blob([txt], { "type": "text/plain" });

  //IEの場合
  if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, "outFileFromWindows.txt");
      //IE以外の場合
  } else {
      document.getElementById("createFile").href = window.URL.createObjectURL(blob);
  }
}


  $("code").each(function() { //this wraps each <code> with the appropriate html wrappers
    $(this).wrap("<div class='codeWrapper'></div>");
    $(this).parent().append("<div class='codeCounter'></div>");
    $(this).parent().append("<div class='copyButton hidden'>Copy</div>");
  });

function runCssParser(object) {
  var html = String(object.html());
  var re = /(\n| |\t)/;     //Selects all newlines, spaces, and tabs
  array = html.split(re);   //parses the html into an array
  console.log(array);       //outputs array for debugging purposes
  var isInside = false;
  var bigComment = false;
  var smallComment = false;
  for(var i = 0; i < array.length; i++) {
    var sample = array[i];  //grabs content of part of the array. At end of loop, will replace array[i] with modified code
    
    if(!bigComment && !smallComment) { //Checks if inside comment. If not, keep going. If so, skip
      if(isInside) {  //checks if inside brackets
        if(sample.match(/(".*"|'.*')/)) {
          sample = sample.replace(/(".*"|'.*')/,'<span class="cssQuote">'+sample.match(/(".*"|'.*')+/)[0]+'</span>');
        }
        if(sample.match(/\}/)) { //matches outry bracket
          isInside = false;
        }
        else if(sample.match(/^-.*?-/)) { //matches css browser qualifier eg -moz-
          var temp = sample.replace(/\-(.*\-)?/, '<span class="cssComment">'+sample.match(/\-.*\-/)+'</span>')
          array[i] = '<span class="cssAttr">'+temp+'</span>';
        }
        else if(sample.match(/\w*\:/)) {
          array[i] = '<span class="cssAttr">'+sample+'</span>';
        }
        else if(sample.match(/\d+(\.\d+)?/)) { //checks for numbers, including decimals
          var first = sample.match(/[a-z|%|s]+/); //looks for things such as px, s, or em
          var copy = '<span class="cssSpecial">'+first+'</span>';
          console.log(first);
          if(copy.match(/null/))
            copy = '';
          var temp = '<span class="cssNum">'+sample.match(/\d*\.?\d*/)+'</span>';
          console.log(temp);
          if(sample.match(/[\;|\:]/)) { //looks fo r ; and matches it to bracket color
            var end = '<span class="cssBrack">'+sample.match(/[\;|\:]/)+'</span>';
            array[i] = temp+copy+end;
          }
          else
            array[i] = temp+copy;
        }
        else if(sample.match(/.*\;/)) { //looks for ;, and colors them white or whatever color the brackets are
          var copy = '<span class="cssAttrValue">'+sample.match(/.*[^;]/)+'</span>';
          var temp = '<span class="cssBrack">'+sample.match(/;/)+'</span>';
          array[i] = copy+temp;
        }
        else if(sample.match(/[\t]/)) { //Looks for tab characters, and gives them a shadow-border to the left
          array[i] = '<span class="cssTab">'+sample+'</span>';
        }
        else if(sample.match(/\w*/)) { //matches any word not caught by the above specifiers
          array[i] = '<span class="cssAttrValue">'+sample+'</span>';
        }

      } //end if inside brackets
      else {  //All this code is matched if the segment is outside brackets
        if(sample.match(/\{/)) { //matches outry bracket
          isInside = true;
        }
        else if(sample.match(/[\s]\.\w*/)) { //checks for regular class
          array[i] = '<span class="cssClass">'+sample+'</span>';
        }
        else if(sample.match(/.*[:|\.].*/)) { //check for psuedo or combo class
          var copy = '<span class="cssClass">'+sample.match(/[\:|\.]\w*/)+'</span>';
          var temp = '<span class="cssSpecial">'+sample.match(/\w*/)+'</span>';
          array[i] = temp+copy;
        }
        else if(sample.match(/\w*/)) { //matches any word
          array[i] = '<span class="cssSpecial">'+sample+'</span>';
        }
      }
    } //end if comment
    else { //Comments the current selection
      array[i] = '<span class="cssComment">'+sample+'</span>';
    }
    if(sample.match(/\/\*/)) { //Block comments
      bigComment = true;
      array[i] = '<span class="cssComment">'+sample+'</span>';
    }
    if(sample.match(/\*\//)) { //End of block comment
      bigComment = false;
      array[i] = '<span class="cssComment">'+sample+'</span>';
    }
    if(sample.match(/\/\//)) { //Looks for one-line comments
      smallComment = true;
      array[i] = '<span class="cssComment">'+sample+'</span>';
    }
    if(smallComment && sample.match(/[\n]/)) { //if it's a new line, the one line comment is ignored from this point on
      smallComment = false;
    }
  } //end of for each loop
  object.html(array.join("")); //joins array seperated by no space and pushes it to the code area's html
}

function runCodeParser() {
  $("code").each(function() { //will run for all <code></code> on the page
    var html = String($(this).html()); //grabs current text in the <code>
    //Start code counter code (will be own function)
      var re = /[\n]/;  //matches all newlines
      var array = html.split(re); //parses into array by newline
      var amount = array.length-1;
      console.log("Size of array: "+amount);
      var numberLines = '';
      for(var i = 1; i <= amount; i++) {
        numberLines+=i+' \n';
      }
      $(this).parent().find('.codeCounter').html(numberLines);
    //End code counter code
    var type = $(this).attr("value"); //grabs code type
    console.log(type);
    switch(type) {  //will eventually check other kinds of code
      case 'html': console.log("ran html"); runHtmlParser($(this)); break;  //not supported
      case 'css': console.log("ran CSS"); runCssParser($(this)); break;
      case 'js': console.log("ran js"); runJsParser($(this)); break;        //not supported
      default: break;
    }
  });
  // runCodeParser();
}
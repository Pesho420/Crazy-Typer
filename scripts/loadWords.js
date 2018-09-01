var wordsFile, words = [];

function loadWords() {
  var curr = "", file = new XMLHttpRequest();

  file.open("GET", "files/words.txt", false);

  file.onreadystatechange = function() {
    if(file.readyState==4) {
      if(file.status==200 || file.status==0) {
        wordsFile = file.responseText;
      }
    }
  }
  file.send(null);

  for(var i=0;i<wordsFile.length;i++) {
    if((wordsFile.charCodeAt(i)>="a".charCodeAt() && wordsFile.charCodeAt(i)<="z".charCodeAt()) || 
        (wordsFile.charCodeAt(i)>="A".charCodeAt() && wordsFile.charCodeAt(i)<="Z".charCodeAt())) {
      curr+=wordsFile[i];
    }
    else {
      if(curr.length>2) {
        words.push(curr);
      }

      curr = "";
    }
  }

  if(curr.length>2) {
    words.push(curr);
  }

  console.log("Dictionary size: " + words.length);
}

loadWords();

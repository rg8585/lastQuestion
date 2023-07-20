let columnCheck = 0
let borderCheck = 0
let paragraphs = [];
let paragraphsHT = [];
let chapterIndex = 0;
let cycles = 2
let cyclestr = 1
let cycleAnimation = 0
let direction = 0
let contentHeight = 0
var wheelDeltaY = 0;
const functions = [nudgeParagraph,decreaseParagraphSize,increaseParagraphSize,takeSide,underlinging,changeFont,changeTracking,addColumn,gridLock];
// const functions = [changeTracking]
var scrollPosition
var canvas
let multiplier = 0
let quickswitch = true


//---------
var mainContainer
var divA
//---------


const cssClasses = [
  'narrator',
  'computer',
  'character1',
  'character2',
  'character3',
  'question',
  'multivac',
  'ending'
];

function setup() {
  prepareText();
}


function prepareText() {
  mainContainer = select(".mainContainer") ;
  divA = select(".divA")
  paragraphs = selectAll("p");
  paragraphs = paragraphs.filter(paragraph => !paragraph.class().includes("chaptertext"));
  paragraphs = paragraphs.filter(paragraph => !paragraph.class().includes("chapter"));
  paragraphsHT = Array.from( document.querySelectorAll('p') );
  var filteredArray = paragraphsHT.filter(function(element) {
    return !element.classList.contains('chapter') && !element.classList.contains('chaptertext');
  });
  paragraphsHT = filteredArray
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.fontFamily = "Roboto";
  }

}






///////////////////////////////scroll


// Store the previous scroll position and the bank value
var previousScrollPosition = 0;
var bank = 0;


// Attach the trackScroll function to the scroll event
window.addEventListener('scroll', trackScroll);

document.addEventListener("wheel", function(event) {
  
  // Retrieve the wheel delta values
  deltaX = event.deltaX || 0;
  deltaY = event.deltaY || 0;
  deltaZ = event.deltaZ || 0;

  // Get the current scroll position
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  changeChapterText();

  // Calculate the height of the content

  if(cycleAnimation==0){
    contentHeight =  document.body.scrollHeight
  }

  // Calculate the height of the viewport
  var viewportHeight = window.innerHeight;


  //maximum scroll position  
  // Calculate the difference between the current and previous scroll position
  var scrollDifference = scrollPosition - previousScrollPosition;



  if (scrollDifference > 0) {
    // Update the bank value
    bank += scrollDifference;

  }


  // Check if reached the bottom of the div
  if ( getLastVisibleElement() >= paragraphs.length-2) {

    //translating scroll
    cycleAnimation -= deltaY*5
    quickswitch = false
    mainContainer.style('transform',`translateY(${cycleAnimation}px`)


    //cycle
    if(paragraphs[(paragraphs.length)-2].elt.getBoundingClientRect().y< -10){
      mainContainer.style('transform',`translateY(${windowHeight*2}px`)
      cycleAnimation = 0
      window.scrollTo(0, 0);
      quickswitch = true
      cycles += 0.5
      cyclestr += 1
      changeCycle()
    }

  }



  if(scrollDifference>0){
    chaos();
  }

  previousScrollPosition=scrollPosition

});


function changeChapterText() {
  //88 + 40 the height of chapter number
   var targetElements = document.querySelectorAll('.chaptertext');
   var currentPosition = window.pageYOffset || document.documentElement.scrollTop;
   
   var previousIndex = -1;
   for (var i = 0; i < targetElements.length; i++) {
     var element = targetElements[i].getBoundingClientRect().y
     
     if (element >= 40 && element <= 130) {
       return; // Exit the function if a matching element is found
     } else if (40 < element) {
       break; // Exit the loop if the current position is before the element
     }
     
     previousIndex = i;
   }
 
   let writtenIndex = previousIndex+1
 
   if(writtenIndex<=0){
    document.querySelector('.chapter').textContent = "Scroll Down ↓"
   }else{
    document.querySelector('.chapter').textContent = "Chapter [ "+writtenIndex+" ]";
   }
}
 

function trackScroll() {
}







/////////////////////////////////chaos manager

let selectedParagraphIndex;

function chaos() {
  if (quickswitch){
    let currentHeight = getValue(divA, 'rectHeight');
    multiplier = Math.min( 100, floor(( bank / 1000/2) * cycles ) ) ;
    for (let c = 0; c < multiplier; c++) {
      let indexClassyParagraph = chooseRandomParagraph();
      let classy = findClass(paragraphs[indexClassyParagraph])
      chooseRandomFunction(functions,indexClassyParagraph)


      //checkers

      let checkW = paragraphs[indexClassyParagraph].elt.getBoundingClientRect().width
      let checkX = paragraphs[indexClassyParagraph].elt.getBoundingClientRect().x
      let checkR = paragraphs[indexClassyParagraph].elt.getBoundingClientRect().right
      let checkH = paragraphs[indexClassyParagraph].elt.getBoundingClientRect().height

      let currentMarginLeft = parseFloat(paragraphs[indexClassyParagraph].style('margin-left'));
      let currentMarginRight = parseFloat(paragraphs[indexClassyParagraph].style('margin-right'));
      if(currentMarginLeft<0){
        paragraphs[indexClassyParagraph].style("margin-left","0px");
      }
      if(currentMarginRight < 0){
        paragraphs[indexClassyParagraph].style("margin-right","0px");
      }

      if(currentMarginRight < 0 && currentMarginLeft<0){
        gridLock(indexClassyParagraph);
      }

      while(checkH>1050){
        let currentMarginLeft = parseFloat(paragraphs[indexClassyParagraph].style('margin-left'));
        let currentMarginRight = parseFloat(paragraphs[indexClassyParagraph].style('margin-right'));
        currentMarginLeft -= 1
        currentMarginRight -= 1
        paragraphs[indexClassyParagraph].style("margin-left",`${currentMarginLeft}px`);
        paragraphs[indexClassyParagraph].style("margin-right",`${currentMarginRight}px`);
        checkH = paragraphs[indexClassyParagraph].elt.getBoundingClientRect().height
        if(currentMarginLeft<0 || currentMarginRight<0){
          paragraphs[indexClassyParagraph].style("margin-left",`16px`);
          paragraphs[indexClassyParagraph].style("margin-right",`16px`);  
          print("hello")
          break
        }
      }


      if(checkX<16){
        paragraphs[indexClassyParagraph].style('margin-left', '16px')          
      }
      if(checkR<2048){
        paragraphs[indexClassyParagraph].style('margin-right', '16px')          
      }
    }
  }

}


function chooseRandomParagraph() {
  let index = 0
  index = Math.floor( random(getLastVisibleElement(),paragraphs.length));
  return index;
}


function findClass(paragraph) {
  const childNodes = paragraph.child();
  let classNames = [];

  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];

    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const classList = Array.from(childNode.classList);
      const classIndex = cssClasses.findIndex((className) => classList.includes(className));
      const className = cssClasses[classIndex];
      classNames.push(className);
    }
  }
  if(classNames.length == 1){
    return classNames[0]
  } else{
    var filteredList = classNames.filter(function(className) {
      return className !== 'narrator' && className !== 'multivac';
    });

    return filteredList[0]
  }
  // return classNames.length > 0 ? classNames[0] : '';
}


function findParagraphIndex(paragraph) {
  return paragraphs.findIndex((p) => p.elt === paragraph.elt);
}


function hasCharacterAtBeginning(className) {
  let match = false
  if (className == "character1"){
    return true
  }
  if (className == "character2"){
    return true
  }
  if (className == "character3"){
    return true
  }
  return false
}

function chooseRandomFunction(functions,n) {
  const randomIndex = Math.floor(Math.random() * functions.length);
  const randomFunction = functions[randomIndex];
  randomFunction(n); // Invoke the randomly chosen function
}


///////////////////////////////changers




function smallestSize(n) {
  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");
  let smallestSize = 2048; 

  spans.forEach((span) => {
    let widthSize =  span.getBoundingClientRect().width
    let bfontSize = parseInt(window.getComputedStyle(span).fontSize)
    if (widthSize < smallestSize && bfontSize<40) {
      smallestSize = widthSize
    }
  });

  return smallestSize;
}


function biggestFontSize(n) {
  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");
  let biggestFontSize = 0; 

  spans.forEach((span) => {
    let bfontSize = parseInt(window.getComputedStyle(span).fontSize)
    if (bfontSize>biggestFontSize) {
      biggestFontSize = bfontSize
    }
  });

  return biggestFontSize;
}

function changeFont(n){

  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");

  spans.forEach((span) => {
    let diceRoll = random(100)
    let diceRollB = random(100)
    let diceRollC = random(100)
    let textSize = parseInt(window.getComputedStyle(span).fontSize)
    let lineHeighter = parseInt(window.getComputedStyle(span).lineHeight)
    let spanClass = span.classList.value
    lineHeighter += 3

    if(diceRoll>80){
      span.style.lineHeight = `${lineHeighter}px`
    }

    if(lineHeighter>160){
      span.style.lineHeight = "normal"
    }

    if(diceRollB>90){
      span.style.fontWeight = random(["100","300","500"])
    }

    if(spanClass=="computer"){
      span.style.fontWeight = "900";
    }
  

    if(textSize>30 && diceRoll>80){
      span.style.fontStyle = "italic"
    }

    if(diceRoll>97 && spanClass=="narrator"){
      span.style.fontFamily = "Roboto Condensed"
    }

  });
}


function changeTracking(n){
  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");

  spans.forEach((span) => {
    let diceRoll = random(100)
    let diceRollB = random(100)
    let diceRollC = random(100)
    let textSize = parseInt(window.getComputedStyle(span).fontSize)
    let spacing = parseInt(window.getComputedStyle(span).letterSpacing)
    let spanClass = span.classList.value
    let inc = random(-0.01,0.01)
    spacing += inc

    if(spanClass=="computer" || spanClass=="multivac" ){
      span.style.letterSpacing = `${spacing}px`;
    }
    if(diceRoll>80 && spanClass=="narrator"){
      span.style.letterSpacing = `${spacing}px`;
    }

  });
}


function underlinging(n){
  let diceRoll = random(100)
  let diceRollB = random(100)

  if(diceRoll>70){
    let paragraph = paragraphs[n]
    let spans = paragraph.elt.querySelectorAll("span");

    spans.forEach((span) => {
      let spanClass = span.classList.value
      if ( (spanClass == "character1" || spanClass == "character2") && diceRollB>60 ){
        span.style.textDecoration = "underline";
      }else{
        span.style.textDecoration = "none";
      }

    });
  }

}


function takeSide(n){
  let paragraph = paragraphs[n];
  let spans = paragraph.elt.querySelectorAll("span");


  spans.forEach((span) => {
    let spanClass = span.classList.value
    let textSize = parseInt(window.getComputedStyle(span).fontSize)
    let spacing = parseInt(window.getComputedStyle(span).letterSpacing)
    let marginLeft = (parseInt(window.getComputedStyle(span).marginLeft))
    let marginRight = (parseInt(window.getComputedStyle(span).marginRight))


    if (spanClass == "character1"){
      span.style.justifyContent = "left";
      span.style.display = "flex"
      textSize += 1
      if(textSize<50){
        span.style.fontSize = `${textSize}px`
      }
    }

    if (spanClass == "character2"){
      span.style.justifyContent = "right";
      span.style.display = "flex"
      textSize += 1
      if(textSize<50){
        span.style.fontSize = `${textSize}px`;
      }
    }


    
    if (spanClass == "narrator"){
      span.style.justifyContent = "center";
      textSize += random(-1,1)
      if(textSize>11){
        span.style.fontSize = `${textSize}px`
      }

    }


  });
}

function increaseParagraphSize(n) {

  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");


  spans.forEach((span) => {
    let diceRoll = random(100)
    let textSize = parseInt(getComputedStyle(span).fontSize, 10);
    textSize += 1
    if (textSize<70){
      span.style.fontSize = `${textSize}px`
    }
    if(diceRoll>98){
      span.style.fontSize = 50 +"px" 
    }
  });

  
}


function decreaseParagraphSize(n) {


  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");


  spans.forEach((span) => {
    let diceRoll = random(100)
    let textSize = parseInt(getComputedStyle(span).fontSize, 10);
    textSize -= 1
    if (textSize>11){
      span.style.fontSize = `${textSize}px`
    }
  });
}

function nudgeParagraph(n) {

  
  let paragraph = paragraphs[n];
  let currentMarginLeft = parseFloat(paragraph.style('margin-left'));
  let newMarginLeft = currentMarginLeft + random(-10, 10);
  let currentMarginRight = parseFloat(paragraph.style('margin-right'));
  let newMarginRight = currentMarginRight + random(-10, 10);  
  paragraph.style('margin-left', newMarginLeft + 'px');
  paragraph.style('margin-right', newMarginRight + 'px');
  let smallest =  smallestSize(n)
  if(smallest<100){
    paragraph.style('margin-left', '434px')
    paragraph.style('margin-right', '434px')
  }

  // let checkW = paragraph.elt.getBoundingClientRect().width
  // let checkX = paragraph.elt.getBoundingClientRect().x

  // if(checkX<0 || checkX+checkW>2048){
  //   paragraph.style('margin-left', 0 + 'px');
  //   paragraph.style('margin-right', 0 + 'px');
  // }

}



//////////// usability and engine


function getValue(object,kind){ //scale-y is in transform //rect height is the whole boundingbox

  if (kind == "scaleY") {
    let string = object.elt.style.transform;
    // Remove any non-numeric characters from the string
    let numberString = string.replace(/[^\d.]/g, "");
    // Convert the extracted string to a number
    let number = parseFloat(numberString);
    return number;
  }

  if(kind == "rectHeight"){
    let number = object.elt.getBoundingClientRect().height
    return number;
  }

}

;(function() {
  var throttle = function(type, name, obj) {
    var obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle("scroll", "optimizedScroll");
})();



function changeCycle() {
  document.querySelector('h3').textContent = "cycle: [ "+cyclestr+" ]";
}

function getLastVisibleElement() {
  var elements = paragraphs
  var visibleElements = [];

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var rect = element.elt.getBoundingClientRect();

    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      visibleElements.push(element);
    }
  }

  let lastElement = visibleElements[visibleElements.length-1]
  let lastElementIndex = paragraphs.indexOf(lastElement)

  return lastElementIndex;
}



//////------------------- timer

var idleTime = 0;
var idleInterval = setInterval(timerIncrement, 60000); // Check every minute

// Reset the timer and restart the page if no scrolling occurs for 15 minutes
function timerIncrement() {
  idleTime++;
  if (idleTime >= 15) { // 15 minutes (15 * 60 seconds)
    window.scrollTo(0, 0);
    resetCSSChanges()
  }
}

// Reset the timer on any user activity (e.g., scroll, mouse movement, keypress)
function resetTimer() {
  idleTime = 0;
}

//Attach the event listeners to detect user activity
document.addEventListener('scroll', resetTimer);


//////NOTES TO KEEP:---------------------------------------------------


// fix spaces
// 

document.addEventListener('contextmenu', event => event.preventDefault());





function resetCSSChanges() {
  // Get all elements in the document
  var elements = document.querySelectorAll("*");

  // Iterate over each element
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Remove the inline 'style' attribute
    element.removeAttribute("style");
  }
  
}





function addColumn(n) {
  let paragraph = paragraphs[n]

  if(paragraph.elt.textContent.length > 230){
    if(columnCheck < 3){
      columnCheck ++
      let diceRoll = random(100)
      var paragraph1 = paragraphs[n].elt.innerText
      var paragraph2 = paragraphs[n+1].elt.innerText
      
      // // Merge the paragraphs
      var mergedParagraphs = paragraph1 + " " + paragraph2;
      paragraphs[n].elt.innerText = mergedParagraphs


      //remove from list and html
      paragraphs[n+1].remove()
      paragraphs.splice(n+1, 1)

      paragraph.elt.removeAttribute("style");
      paragraph.style('columns', '2');
      paragraph.style('column-rule', '1px solid black');
      paragraph.style('column-gap' ,'3em');

      if(diceRoll > 50){
        paragraph.style('margin-right','100px');
        paragraph.style('margin-left','868px');  
      }else{
        paragraph.style('margin-right','868px');
        paragraph.style('margin-left','100px');  
      }
      paragraph.style('margin-top','20px');
      paragraph.style('margin-bottom','20px');
      paragraph.style('text-align','justify');
    } 
    
  }
}

function addLeftBorder(n) {
  let paragraph = paragraphs[n]
  paragraph.style.margin = "100px"
  paragraph.style.borderLeft = "2px solid black";

}



function gridLock(n){
  if(random(100)>98){
    let fontSizeCheck = biggestFontSize(n)
    if(fontSizeCheck>35){
      var inc=1008
      var gridSpot = random([16,520,1024])
    }else{
      var inc = 504
      var gridSpot = random([16,520,1024,1528])
    }
    let paragraph = paragraphs[n]
    let spans = paragraph.elt.querySelectorAll("span");
    let rMargin =  2048 - (gridSpot + inc)
    paragraph.removeAttribute("style");
    paragraph.style('margin-left', gridSpot + 'px');
    paragraph.style('margin-right', rMargin + 'px');  
  }
}
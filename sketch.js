



let checker = 0
let paragraphs = [];
let paragraphsHT = [];
let chapterIndex = 0;
let cycles = 1
let cyclestr = 1
let cycleAnimation = 0
let direction = 0
let contentHeight = 0
var wheelDeltaY = 0;
const functions = [nudgeParagraph,decreaseParagraphSize,increaseParagraphSize,takeSide,underlinging,changeFont,changeTracking];
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
  canvas = createCanvas(windowWidth,windowHeight)
  canvas.position(0,0);
  canvas.style('z-index','-1')
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

  // console.log("cycle anim: " + cycleAnimation)
  // console.log("scroll pos + 500 need bigger : " + scrollPosition+700)
  // console.log("right side: need smaller" + (contentHeight - viewportHeight-600))

  // Check if reached the bottom of the div
  if ( getLastVisibleElement() >= paragraphs.length-2) {

    //translating scroll
    cycleAnimation -= deltaY*5
    quickswitch = false
    mainContainer.style('transform',`translateY(${cycleAnimation}px`)
    console.log("im transforming")


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
    if(bank%2>=1){
      chaos();
    }
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
    multiplier = Math.min( 160, floor(( bank / 1000/2) * cycles ) ) ;
    for (let c = 0; c < multiplier; c++) {
      let indexClassyParagraph = chooseRandomParagraph();
      let classy = findClass(paragraphs[indexClassyParagraph])
      chooseRandomFunction(functions,indexClassyParagraph)
      // fixproblems(indexClassyParagraph)
    }
  }

}

function fixproblems(n){
  let paragraph = paragraphs[n]
  let paraR = paragraph.elt.getBoundingClientRect().right

  if( paraH>windowHeight){

  }
}


function chooseRandomParagraph() {

  let index = 0
  
  if(cyclestr>1){
    index = Math.floor( random(getLastVisibleElement(),paragraphs.length));
  }else{
    index = Math.floor( Math.random() * paragraphs.length);
  }
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


function mouseClicked() {
  changeFont(0)
}

function biggestSize() {
  let paragraph = paragraphs[0]
  let spans = paragraph.elt.querySelectorAll("span");
  let biggestSize = 0;

  spans.forEach((span) => {
    let fontSize = parseInt(getComputedStyle(span).fontSize, 10);
    if (fontSize > biggestSize) {
      biggestSize = fontSize;
    }
  print(biggestSize)
  });

  return biggestSize;
}

function addColumn(n) {
  let paragraph = paragraphs[n]
  print(paragraph.elt.textContent.length)
  if(paragraph.elt.textContent.length > 230){
    paragraph.style('columns', '2');
  }
}


function changeFont(n){

  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");
  print("hello")

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

    if(diceRoll>97 && styleChild=="narrator"){
      span.style.fontFamily = "Roboto Condensed"
    }

  });
}


function changeTracking(n){
  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");
  print("hello")

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
    print("hello")

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
  let children = paragraph.child();
  for(let i=0; i<children.length ; i++ ){

    let child = children[i]
    let styleChild = children[i].classList[0]
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    let marginLeft = (parseInt(window.getComputedStyle(child).marginLeft))
    let marginRight = (parseInt(window.getComputedStyle(child).marginRight))


    
    if (styleChild == "character1"){
      child.style.justifyContent = "left";
      child.style.display = "flex"
      textSize += 1
      if(textSize<50){
        child.style.fontSize = `${textSize}px`
        
      }
    }
    
    
    if (styleChild == "character2"){
      child.style.justifyContent = "right";
      child.style.display = "flex"
      textSize += 1
      if(textSize<50){
        child.style.fontSize = `${textSize}px`;
      }
    }
    
    
    if (styleChild == "narrator"){
      child.style.justifyContent = "center";
      textSize += random(-1,1)
      if(textSize>11){
        child.style.fontSize = `${textSize}px`
      }

    }


  }
}

function increaseParagraphSize(n) {

  let paragraph = paragraphs[n]
  let spans = paragraph.elt.querySelectorAll("span");
  print("hello")


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

  let paragraph = paragraphs[n];
  let children = paragraph.child();
  
  for(let i=0; i<children.length ; i++ ){
    let child = children[i]
    let textSize = (parseInt(window.getComputedStyle(child).fontSize))
    textSize -= 1
    if (textSize>11){
      child.style.fontSize = `${textSize}px`
    }
  }

}


function nudgeParagraph(n) {
  let paragraph = paragraphs[n];
  let currentMarginLeft = parseFloat(paragraph.style('margin-left'));
  let newMarginLeft = currentMarginLeft + random(-40, 30);
  let currentMarginRight = parseFloat(paragraph.style('margin-right'));
  let newMarginRight = currentMarginRight + random(-40, 30);
  
  paragraph.style('margin-left', newMarginLeft + 'px');
  paragraph.style('margin-right', newMarginRight + 'px');
  let paraX = paragraph.elt.getBoundingClientRect().x
  let paraY = paragraph.elt.getBoundingClientRect().y
  let paraR = paragraph.elt.getBoundingClientRect().right
  let paraW = paragraph.elt.getBoundingClientRect().width


  if (paraX < 0 || paraR > windowWidth){
    paragraph.style('margin-left', '0px')
    paragraph.style('margin-right', '0px')
  }

  if (paraW<10){
    paragraph.style('margin-left', '0px')
    paragraph.style('margin-right', '0px')
  }

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



function keyTyped() {
  if (key == 'r'){
    location.reload()
  }
}


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
  console.log(idleTime)
  if (idleTime >= 15) { // 15 minutes (15 * 60 seconds)
    window.scrollTo(0, 0);
    window.location.reload(); // Restart the page
  }
}

// Reset the timer on any user activity (e.g., scroll, mouse movement, keypress)
function resetTimer() {
  idleTime = 0;
}

// Attach the event listeners to detect user activity
document.addEventListener('scroll', resetTimer);
document.addEventListener('mousemove', resetTimer);
document.addEventListener('keypress', resetTimer);
document.addEventListener('touchstart', resetTimer);
document.addEventListener('touchmove', resetTimer);


//////NOTES TO KEEP:---------------------------------------------------


// fix spaces
// 

document.addEventListener('contextmenu', event => event.preventDefault());
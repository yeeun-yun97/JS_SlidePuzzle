const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")
const imgButton = document.querySelector(".img-button")
const selectDifficulty = document.querySelector(".select-difficulty")

let tiles = [];
const dragged = {
    el: null,
    class: null,
    index: null
}

let image = "url('https://placeimg.com/400/400/any";
let countImage=0;

let isPlaying = false;
let timeInterval = 0;
let time = 0;

let DIFFICULTY_NORMAL=4;
let DIFFICULTY_EASY=3;
let DIFFICULTY_HARD =8;
let difficulty =DIFFICULTY_NORMAL;

setGame();

function setImage(){
    let length= `${String(400/difficulty)}px`;
    tiles.forEach(tile => {
        tile.style.width=length;
        tile.style.height=length;
        tile.style.background=`${image}${countImage}')`
        tile.style.backgroundPositionY=`-${tile.getAttribute("data-row")*(400/difficulty)}px`
        tile.style.backgroundPositionX=`-${tile.getAttribute("data-col")*(400/difficulty)}px`
        if(tile.getAttribute("data-index")==='0') {
            tile.setAttribute('draggable', 'true');
            tile.style.background = '#00B992'
        }
    });

    countImage++
}

function setGame() {
    isPlaying = true;
    time = 0;
    container.innerHTML = "";
    container.style.gridTemplateColumns=`repeat(${difficulty},1fr)`
    gameText.style.display = 'none'
    clearInterval(timeInterval)
    tiles = createImageTiles();

    setImage();
    tiles.forEach(tile => container.appendChild(tile));
    setTimeout(() => {
        container.innerHTML = "";
        shuffle(tiles).forEach(tile => container.appendChild(tile))
        timeInterval = setInterval(() => {
            playTime.innerText = time;
            time++;
        }, 1000)
    }, 2000)
}

function createImageTiles() {
    const tempArray = [];
    Array(difficulty*difficulty).fill().forEach((_, i) => {
        const li = document.createElement("li")
        li.setAttribute('data-index', i)
        li.setAttribute('data-col', String(i%difficulty))
        li.setAttribute('data-row', String(Math.floor(i/difficulty)));
        li.classList.add(`list${i}`);
        tempArray.push(li);
    })
    return tempArray;
}


function shuffle(array) {
    let index = array.length - 1;
    while (index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--
    }
    return array
}

function checkStatus() {
    const currentList = [...container.children]
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
    if (unMatchedList.length === 0) {
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval)
    }//gamefinish
}

function moveChild(el, obj,draggedIndex,droppedIndex) {
    let originPlace;
    let isLast = false;
    if (el.nextSibling) {
        originPlace = el.nextSibling
    } else {
        originPlace = el.previousSibling
        isLast = true
    }
    draggedIndex > droppedIndex ? obj.before(el) : obj.after(el)
    isLast ? originPlace.after(obj) : originPlace.before(obj);
}


//events
container.addEventListener('dragstart', e => {
    let obj= e.target
    if(obj.getAttribute('data-index')!=='0')return;
    if (!isPlaying) return;
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})

container.addEventListener('dragover', e => {
    e.preventDefault()
})

container.addEventListener('drop', e => {
    if (!isPlaying) return;
    const obj = e.target
    let parentChildren= [...obj.parentNode.children];
    if (obj.className !== dragged.class) {
        let draggedIndex=parentChildren.indexOf(dragged.el);
        let droppedIndex=parentChildren.indexOf(obj);
        if(obj.getAttribute('data-row')===dragged.el.getAttribute('data-row')&&(draggedIndex===droppedIndex+1||draggedIndex===droppedIndex-1)){
            moveChild(dragged.el,obj,draggedIndex,droppedIndex)
        }else if(draggedIndex===droppedIndex+difficulty||draggedIndex===droppedIndex-difficulty){
            moveChild(dragged.el,obj,draggedIndex,droppedIndex)
        }
    }
    checkStatus();
})

startButton.addEventListener('click', () => {
    setGame()
})

imgButton.addEventListener('click',()=>{
    setImage()
})

selectDifficulty.addEventListener('change',(e)=>{
    if(e.target.value==="쉬움"){
        difficulty=DIFFICULTY_EASY
    }else if (e.target.value==="보통") {
        difficulty=DIFFICULTY_NORMAL
    }else if (e.target.value==="어려움") {
        difficulty=DIFFICULTY_HARD
    }
   setGame()
})
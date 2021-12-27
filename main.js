const idioms = ["诗情画意", "南来北往", "一团和气", "落花流水"];
const oCharCellGroup = document.querySelector(".char-cell-group");
const oBlankCellGroup = document.querySelector(".blank-cell-group");

let charList = [];
let blankList = ["", "", "", ""];
let resArr = [undefined, undefined, undefined, undefined];
let charAreas = [];
let blankAreas = [];
let oChars = null;
let oBlanks = null;
let startX = 0;
let startY = 0;
let cellX = 0;
let cellY = 0;
let cellW = 0;
let cellH = 0;
let mouseX = 0;
let mouseY = 0;

function formatCharsArr() {
  let arr = [];
  idioms.map((item) => {
    arr = arr.concat(item.split(""));
    return item;
  });

  return arr.sort(randomSort);
}

function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

function blankCell(value, index) {
  return `
    <div class="cell-item">
        <div class="wrapper" data-index="${index}"></div>
    </div>
  `;
}

function charCellTpl(char, index) {
  return `
    <div class="cell-item">
        <div class="wrapper" data-index="${index}">${char}</div>
    </div>
  `;
}

function render() {
  let clist = "";
  let blist = "";
  charList.map((char, index) => {
    clist += charCellTpl(char, index);
    return char;
  });
  blankList.map((item, index) => {
    blist += blankCell(item, index);
    return item;
  });
  oBlankCellGroup.innerHTML = blist;
  oCharCellGroup.innerHTML = clist;
}

function bindEvent() {
  let oChar = null;
  for (let i = 0; i < oChars.length; i++) {
    oChar = oChars[i];
    oChar.addEventListener("touchstart", handleTouchStart, false);
    oChar.addEventListener("touchmove", handleTouchMove, false);
    oChar.addEventListener("touchend", handleTouchEnd, false);
  }
}

function handleTouchStart(e) {
  cellW = this.offsetWidth;
  cellH = this.offsetHeight;
  cellX = this.offsetLeft;
  cellY = this.offsetTop;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  mouseX = startX - cellX;
  mouseY = startY - cellY;

  this.style.width = cellW / 10 + "rem";
  this.style.height = cellH / 10 + "rem";
  this.style.position = "fixed";
  this.style.left = cellX / 10 + "rem";
  this.style.top = cellY / 10 + "rem";
}

function handleTouchMove(e) {
  e.preventDefault();
  const moveX = e.touches[0].clientX;
  const moveY = e.touches[0].clientY;

  cellX = moveX - mouseX;
  cellY = moveY - mouseY;

  setPosition(this, { startX: cellX, startY: cellY });
}

function getAreas(domList, arrWrapper) {
  let startX = 0;
  let startY = 0;
  let oItem = null;

  for (let i = 0; i < domList.length; i++) {
    oItem = domList[i];
    startX = oItem.offsetLeft;
    startY = oItem.offsetTop;

    arrWrapper.push({
      startX,
      startY,
    });
  }
}

function handleTouchEnd(e) {
  const blankWidth = oBlanks[0].offsetWidth;
  const blankHeight = oBlanks[0].offsetHeight;
  for (let i = 0; i < blankAreas.length; i++) {
    if (resArr[i] !== undefined) {
      continue;
    }
    let { startX, startY } = blankAreas[i];

    if (
      (cellX > startX &&
        cellX < startX + blankWidth / 2 &&
        cellY > startY &&
        cellY < startY + blankHeight / 2) ||
      (cellX + blankWidth > startX + blankWidth / 2 &&
        cellX + blankWidth < startX + blankWidth &&
        cellY > startY &&
        cellY < startY + blankHeight / 2)
    ) {
      setPosition(this, { startX, startY });
      setResArr(this, i);

      if (!resArr.includes(undefined)) {
        setTimeout(() => {
          if (checkResult()) {
            alert("正确");
          } else {
            alert("错了");
          }
          resetPosition();
        }, 1000);
      }
      return;
    }
  }

  const _index = Number(this.dataset.index);
  let charArea = charAreas[_index];

  setPosition(this, { ...charArea });
}

function setPosition(el, { startX, startY }) {
  el.style.left = startX / 10 + "rem";
  el.style.top = startY / 10 + "rem";
}

function resetPosition() {
  resArr.map((item) => {
    const el = item.el;
    const index = el.dataset.index;
    let { startX, startY } = charAreas[index];

    setPosition(el, { ...charAreas[index] });

    resArr = [];
    startX = 0;
    startY = 0;
    cellX = 0;
    cellY = 0;
    return item;
  });
}

function setResArr(el, index) {
  resArr[index] = {
    char: el.innerText,
    el,
  };
}

function checkResult() {
  let idiom = "";
  resArr.map((item) => (idiom += item.char));

  return idioms.find((item) => item === idiom);
}

const init = () => {
  charList = formatCharsArr();
  render();

  oChars = oCharCellGroup.querySelectorAll(".cell-item .wrapper");
  oBlanks = oBlankCellGroup.querySelectorAll(".cell-item .wrapper");
  getAreas(oBlanks, blankAreas);
  getAreas(oChars, charAreas);
  bindEvent();
};

init();

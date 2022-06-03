let optionscont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".Pencil");
let eraser = document.querySelector(".Eraser");
let sticky = document.querySelector(".StickyNote");
let upload = document.querySelector(".Upload");
let pencilFlag = false;
let eraserFlag = false;

let optionFlag = true;
//True for Show Tools & False for Hiding tools

optionscont.addEventListener("click", (e) => {
  optionFlag = !optionFlag;
  if (optionFlag) {
    openTools();
  } else {
    closeTools();
  }
});
function openTools() {
  let iconElem = optionscont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";

}
function closeTools() {
  let iconElem = optionscont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "none";

  pencilTollCont.style.display = "none";
  eraserTollCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  //if pencilFlag==true : Show Pencil tool && if pencilFlag==false : Hide Pencil tool
  pencilFlag = !pencilFlag;
  if (pencilFlag == true) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  //if eraserFlag==true : Show Eraser tool && if eraserFlag==false : Hide Eraser tool
  eraserFlag = !eraserFlag;
  if (eraserFlag == true) {
    eraserToolCont.style.display = "flex";
  } else {
    eraserToolCont.style.display = "none";
  }
});

upload.addEventListener("click", (e) => {
  //For Opening File Explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyHtml = `
            <div class="header-cont">
                <div class="minimize">
                    <i class="fa-solid fa-minus"></i>
                </div>
                <div class="remove">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="note-cont">
                <img src="${url}"/>
            </div>
        `;
    createSticky(stickyHtml);
  });
});

sticky.addEventListener("click", (e) => {
  let stickyHtml = `
        <div class="header-cont">
                <div class="minimize">
                    <i class="fa-solid fa-minus"></i>
                </div>
                <div class="remove">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="note-cont">
            <textarea spellcheck="false"> </textarea>
        </div>
    `;
  createSticky(stickyHtml);
});

function createSticky(stickyHtml) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = stickyHtml;

  document.body.appendChild(stickyCont);

  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");
  noteAction(minimize, remove, stickyCont);

  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
}

function noteAction(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });
  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") {
      noteCont.style.display = "block";
    } else {
      noteCont.style.display = "none";
    }
  });
}

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the Sticky Notes at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the Sticky Notes on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the Sticky Notes, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

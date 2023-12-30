const themeSwitcherBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFilter = document.querySelector("#clear-completed");

function main() {
  // Theme-Switcher
  themeSwitcherBtn.addEventListener("click", () => {
    bodyTag.classList.toggle("light");
    const themeImg = themeSwitcherBtn.children[0];
    themeImg.setAttribute(
      "src",
      themeImg.getAttribute("src") === "/icon-sun.svg" ?
      "/icon-moon.svg" :
      "/icon-sun.svg"
    );
  });


  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  ul.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currentPos, newPos);
      if (currentPos > newPos) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        ul.insertBefore(draggingCard, e.target.nextSibling)
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPos, 1);
      todos.splice(newPos, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos));

    }
  });

  //Add Todo In LocalStorage
  addBtn.addEventListener("click", () => {
    const item = todoInput.value.trim();
    if (item) {
      todoInput.value = "";
      const todos = !localStorage.getItem("todos") ? [] :
        JSON.parse(localStorage.getItem("todos"));

      const currentTodo = {
        item: item,
        isCompleted: false,
      };

      todos.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todos));
      makeTodoElement([currentTodo]);
    }
  });


  todoInput.addEventListener('keydown', (e) => {

    if (e.key == 'Enter') {
      addBtn.click();
    }

  })

  filter.addEventListener('click', (e) => {

    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }


  });


  btnFilter.addEventListener('click', () => {
    var deleteIndexes = [];
    document.querySelectorAll(".card.checked").forEach((card) => {
      deleteIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener('animationend', () => {
        card.remove();
      });

    });

    removeMultipleTodos(deleteIndexes);

  })

}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeMultipleTodos(indexes) {
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));

}


function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}



function makeTodoElement(todoArray) {
  if (!todoArray) {
    return null;
  }
  const ItemsLeft = document.querySelector('#items-left');

  todoArray.forEach((todoObject) => {
    //Create Html Elements Of Todo
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    //Add Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");
    //Add Attributes
    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "/icon-cross.svg");
    img.setAttribute("alt", "Clear It");
    item.textContent = todoObject.item;

    if (todoObject.isCompleted) {
      card.classList.add('checked');
      cbInput.setAttribute('checked', 'checked');
    }

    //Add EventListener
    card.addEventListener('dragstart', () => {
      card.classList.add("dragging");
    });

    card.addEventListener('dragend', () => {
      card.classList.remove("dragging");
    });
    cbInput.addEventListener('click', (e) => {

      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;
      const currentCardIndex = [...document.querySelectorAll(".todos .card")]
        .indexOf(currentCard);
      stateTodo(currentCardIndex, checked);

      checked ? currentCard.classList.add('checked') : currentCard.classList.remove('checked')

      ItemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;


    })

    clearBtn.addEventListener('click', (e) => {

      const currentCard = clearBtn.parentElement;
      currentCard.classList.add('fall');
      const indexOfCurrentCard = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
      removeTodo(indexOfCurrentCard);
      currentCard.addEventListener('animationend', () => {


        setTimeout(() => {
          currentCard.remove();
          ItemsLeft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);

      });

    });


    //Set Element by Parent Child
    clearBtn.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);

    document.querySelector(".todos").appendChild(card);
  });
  ItemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}

document.addEventListener("DOMContentLoaded", main);
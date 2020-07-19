const TOYS_URL = "http://localhost:3000/toys"
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.getElementById("add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleNewToyForm(e);
    e.target.reset(); // Clears out the form (input fields)
  })

  fetch(TOYS_URL)
    .then(resp => resp.json())
    .then(json => createToyCards(json))
});

function createToyCards(toys) {
  const toyCollection = document.getElementById("toy-collection");

  toys.forEach(toy => {
    const card = document.createElement("div");

    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn">Like <3</button>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.matches("button.like-btn")) {
        handleLikeBtn(toy, card)
      }
    })

    toyCollection.appendChild(card);
  });
}

function handleLikeBtn(toy, card) {
  toy.likes++
  const likesElement = card.querySelector("p");
  likesElement.innerHTML = `${toy.likes} Likes`;

  fetch(`${TOYS_URL}/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      "likes": toy.likes,
    })
  })
}

function handleNewToyForm(e) {
  const newToyName = e.target.name.value;
  const newToyImage = e.target.image.value;
  const newToy = {
    "name": newToyName,
    "image": newToyImage,
    "likes": 0,
  }

  fetch(`${TOYS_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy)
  }).then(resp => resp.json()).then(json => {
    const toy = [json]
    createToyCards(toy)
  })
}
//CRUD APP

//Init page
const RANDOM_URL = Math.floor((Math.random() * 800) + 1);
const NUM_EACH_PAGE = 10;

let triggeredItem = undefined;
let items = [];
let currPage = 1;
let totalPageNum = 1;

getItemData();
initButtons();
initEditModal();
initLikedModal();

//Load API
async function getItemData() {
    let url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + RANDOM_URL;
    let response = await fetch(url);
    let data = await response.json();
    return data.results;
}

getItemData().then(res => {
    res.forEach(item => {
        items.push(item.name);
    });

    initPage(items);

}).catch(error => {
    displayErrorPage();
    console.log(error);
});




//Empty item
function displayErrorPage() {
    let ul = document.getElementsByClassName("list-group")[0];
    let newItem = document.createElement("a");
    newItem.appendChild(document.createTextNode("Oops! Something went wrong..."));
    ul.appendChild(newItem);
}



function initPage(items) {
    let ul = document.getElementsByClassName("list-group")[0];
    let totalNumItems = items.length;

    items.forEach(item => {
        ul.appendChild(createNewItem(item));
    });

    if (totalNumItems > NUM_EACH_PAGE) {
        for (let i = 0; i < NUM_EACH_PAGE; i++) {
            ul.children[i].style.display = "block";
        }

        totalPageNum = Math.ceil(totalNumItems / NUM_EACH_PAGE);
        for (let i = 0; i < totalPageNum; i++) {
            createNewPageButton();
        }

    } else {
        for (let i = 0; i < totalNumItems; i++) {
            ul.children[i].style.display = "block";
        }
    }

    let nav = document.getElementsByClassName("pagination")[0];
    nav.children[1].firstElementChild.style.backgroundColor = "bisque";

    document.getElementById("input-catched").value = "";

}

//Pagination
function showPages(nextPage) {
    let nav = document.getElementsByClassName("pagination")[0];
    nav.children[nextPage].firstElementChild.style.backgroundColor = "bisque";
    nav.children[currPage].firstElementChild.style.backgroundColor = "white";

    let ul = document.getElementsByClassName("list-group")[0];
    //hide current page
    for (let i = (currPage - 1) * NUM_EACH_PAGE; i < Math.min(currPage * NUM_EACH_PAGE, ul.children.length); i++) {
        ul.children[i].style.display = "none";
    }
    //show chosen page
    for (let i = (nextPage - 1) * NUM_EACH_PAGE; i < Math.min(nextPage * NUM_EACH_PAGE, ul.children.length); i++) {
        ul.children[i].style.display = "block";
    }


}


function createNewPageButton() {
    //Create button
    let ul = document.getElementsByClassName("pagination")[0];
    let newPage = document.createElement("li");
    newPage.className = "page-item";
    let newText = document.createElement("a");
    newText.className = "page-link text-secondary";
    newText.appendChild(document.createTextNode(ul.children.length - 1));

    newPage.appendChild(newText);

    //Add event
    newPage.addEventListener("click", (e) => {
        showPages(e.target.textContent);
        currPage = e.target.textContent;
    });

    ul.insertBefore(newPage, ul.children[ul.children.length - 1]);

    return newPage;
}




//Initialize items
function initButtons() {

    //Catched button
    document.getElementById("submit").addEventListener("click", () => {
        let input = document.getElementById("input-catched").value;
        document.getElementById("input-catched").value = "";
        let ul = document.getElementsByClassName("list-group")[0];
        ul.appendChild(createNewItem(input));

        //If exceed page num
        let recordPageNum = totalPageNum;
        totalPageNum = Math.ceil(ul.children.length / NUM_EACH_PAGE);
        if (recordPageNum !== totalPageNum) {
            createNewPageButton();
        }
    });

    //Liked button
    document.getElementById("liked").addEventListener("click", (e) => {
        document.getElementById("liked-modal").style.display = "block";
    });

    //Left and Right page button
    document.getElementById("previous-page-button").addEventListener("click", () => {
        if (currPage > 1) {
            showPages(currPage - 1);
            currPage--;
        }
    });
    document.getElementById("next-page-button").addEventListener("click", () => {
        if (currPage < totalPageNum) {
            showPages(currPage + 1);
            currPage++;
        }
    });

    //Sort button
    document.getElementById("sort-button").addEventListener("click", (e) => {
        if (e.target.firstElementChild.className === "arrow up mr-2") {
            e.target.firstElementChild.className = "arrow down mr-2";
            sortItems(true);
        } else {
            e.target.firstElementChild.className = "arrow up mr-2";
            sortItems(false);
        }
    });



}

//Liked button
function initLikedModal() {
    document.getElementById("close-liked-button").addEventListener("click", () => {
        document.getElementById("liked-modal").style.display = "none";
    });

}


//Delete button
function addDeleteButton() {
    //Create button
    let buttonDelete = document.createElement('button');
    buttonDelete.className = "btn btn-light btn-sm float-right ml-2 delete";
    //Add event
    buttonDelete.addEventListener("click", (e) => {
        deleteButtonEvent(e);
    });
    buttonDelete.style.display = "none";
    buttonDelete.appendChild(document.createTextNode("Delete"));
    return buttonDelete;

}

function deleteButtonEvent(e) {
    //If item is in liked list
    let stars = document.getElementsByClassName("list-group")[1].children;
    for (let i = 0; i < stars.length; i++) {
        if (stars[i].firstElementChild.textContent === e.target.previousElementSibling.textContent) {
            stars[i].remove();
        }
    }

    e.target.parentElement.remove();

    //Refresh page
    let ul = document.getElementsByClassName("list-group")[0];
    for (let i = 0; i < Math.min(NUM_EACH_PAGE, ul.children.length); i++) {
        ul.children[i].style.display = "block";
    }
    let prevPageNum = totalPageNum;
    totalPageNum = Math.ceil(ul.children.length / NUM_EACH_PAGE);
    if (prevPageNum !== totalPageNum) {
        let ul = document.getElementsByClassName("pagination")[0];
        ul.children[ul.children.length - 2].remove();
    }
}

//Edit button
function addEditButton() {
    //Creat button
    let buttonEdit = document.createElement('button');
    buttonEdit.className = "btn btn-light btn-sm float-right edit";
    //Add event
    buttonEdit.addEventListener("click", (e) => {
        editButtonEvent(e);
    });
    buttonEdit.style.display = "none";
    buttonEdit.appendChild(document.createTextNode("Edit"));

    return buttonEdit;
}

function editButtonEvent(e) {
    //Show edit modal
    triggeredItem = e.target.parentElement;
    document.getElementById("edit-modal").style.display = "block";
    triggeredItem.children[1].style.color = "red";
    document.getElementById("input-changes").value = triggeredItem.children[1].textContent;
}


//Edit modal
function initEditModal() {
    //Close Modal
    document.getElementById("close-edit-button").addEventListener("click", () => {
        document.getElementById("edit-modal").style.display = "none";
        triggeredItem.children[1].style.color = "black";
        triggeredItem = undefined;
    });

    //Open edit modal
    document.getElementById("save-edit-button").addEventListener("click", () => {
        let inputElement = document.getElementById("input-changes").value;

        //If item is in liked list
        let stars = document.getElementsByClassName("list-group")[1].children;
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].firstElementChild.textContent === triggeredItem.children[1].textContent) {
                stars[i].firstElementChild.textContent = inputElement;
            }
        }

        //Change value
        if (triggeredItem !== undefined) {
            triggeredItem.children[1].textContent = inputElement;
        }

        document.getElementById("edit-modal").style.display = "none";
        triggeredItem.children[1].style.color = "black";
    });
}

//Assign delete/edit button animation
function mouseInAndOut(element) {
    //Mouse in
    element.addEventListener("mouseenter", (e) => {
        e.target.style.backgroundColor = "bisque";
        e.target.children[0].style.display = "inline-block";
        e.target.children[2].style.display = "inline-block";
        e.target.children[3].style.display = "inline-block";
    });
    //Mouse out
    element.addEventListener("mouseleave", (e) => {
        e.target.style.backgroundColor = "white";
        //If item is in liked list unchange
        if (e.target.children[0].className === "fa fa-star unchecked") {
            e.target.children[0].style.display = "none";
        }
        e.target.children[2].style.display = "none";
        e.target.children[3].style.display = "none";
    });

}

//Star button
function addStarButton() {
    //Create button
    let starButton = document.createElement("span");
    starButton.className = "fa fa-star unchecked";

    //Add event
    starButton.addEventListener("click", (e) => {
        likedUl = document.getElementsByClassName("list-group")[1];
        let itemtext = e.target.nextElementSibling.textContent;

        //If item is not in liked list
        if (starButton.className === "fa fa-star unchecked") {
            //Create new liked item           
            let likedItem = document.createElement("li");
            likedItem.className = "list-group-item";

            let newText = document.createElement("a");
            newText.appendChild(document.createTextNode(itemtext));

            //Add to modal
            likedItem.appendChild(newText);
            likedUl.appendChild(likedItem);

            starButton.style.display = "inline-block";
            starButton.className = "fa fa-star checked";
        } else {
            let stars = likedUl.children;
            for (let i = 0; i < stars.length; i++) {
                if (stars[i].firstElementChild.textContent === itemtext) {
                    stars[i].remove();
                }

            }
            starButton.className = "fa fa-star unchecked";
        }
    });
    return starButton;
}

//Catched button
function createNewItem(itemName) {
    //Create new item
    let newItem = document.createElement("li");
    newItem.className = "list-group-item";

    let newStar = document.createElement("span");
    newStar.className = "fa fa-star checked";

    let newText = document.createElement("a");
    newText.appendChild(document.createTextNode(itemName));

    //Add elements
    newItem.appendChild(addStarButton());
    newItem.appendChild(newText);
    newItem.appendChild(addDeleteButton());
    newItem.appendChild(addEditButton());
    mouseInAndOut(newItem);

    newItem.style.display = "none";

    return newItem;

}


function sortItems(dir) {
    //Get Items
    let ul = document.getElementsByClassName("list-group")[0];

    sortItem = [];
    for (let i = 0; i < ul.children.length; i++) {
        let item = { name: ul.children[i].children[1].textContent, liked: ul.children[i].children[0].className };
        sortItem.push(item);
    }

    //Sort
    if (dir === true) {
        sortItem.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else {
        sortItem.sort((a, b) => {
            if (a.name < b.name) { return 1; }
            if (a.name > b.name) { return -1; }
            return 0;
        });
    }

    for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].children[1].textContent = sortItem[i].name;
        ul.children[i].children[0].className = sortItem[i].liked;
        if (sortItem[i].liked === "fa fa-star checked") {
            ul.children[i].children[0].style.display = "inline-block";
        }
        if (sortItem[i].liked === "fa fa-star unchecked") {
            ul.children[i].children[0].style.display = "none";
        }
    }

}
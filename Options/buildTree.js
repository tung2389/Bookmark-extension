var chosenId = undefined
var previousChosenElement = undefined
function createBookmarksTree(bookmark, hierarchy, parentFolder) {
  let isFolder = bookmark.children
  if(isFolder) {
    let folderLength = bookmark.children.length
    let folder = createFolderElement(bookmark);
    if(!parentFolder) { //This is the top folder
      folder = createFolderElement(bookmark, true)
      let buttonHolder = document.getElementById('buttonHolder')
      buttonHolder.appendChild(folder)
    }
    if(parentFolder) {
      parentFolder.appendChild(folder)
    }
    for(let i=0; i < folderLength; i++){
      createBookmarksTree(bookmark.children[i], hierarchy + 1, folder)
    }
  }
  else {
    let file = createFileElement(bookmark)
    parentFolder.appendChild(file)
  }
}



function createFolderElement(bookmark, topFolder=false) {
  let div = document.createElement('div')
  div.innerHTML = bookmark.title
  div.setAttribute("id", bookmark.id)
  if(topFolder)
    div.classList.add('topFolder')
  else
    div.classList.add('folder')
  div.addEventListener("click", function(event) {
    setChosenElement(bookmark, div)
    event.cancelBubble = true // Cancel onClick triggers in parent elements
    let children = this.children;
    for(let i = 0; i < children.length; i++) {
      let child = children[i]
      if(child.style.display === 'block') {
        child.style.display = 'none';
      }
      else {
        child.style.display = 'block';
      }
    }
  })
  return div;
}

// function addFolderButton(bookmark) {
//   let buttonHolder = document.getElementById('buttonHolder')
//   let button = document.createElement('button')
//   button.innerHTML = bookmark.title
//   button.setAttribute("id", bookmark.id)
//   buttonHolder.appendChild(button)
// }
function createFileElement(bookmark) {
  let div = document.createElement('div')
  div.innerHTML = bookmark.title
  div.setAttribute("id", bookmark.id)
  div.classList.add('folder')
  div.addEventListener('click', function(event) { // Overwrite the behavior of parent folders to prevent event triggers in parents
    setChosenElement(bookmark, div)
    event.cancelBubble = true
  })
  return div;
}
chrome.bookmarks.getTree(function(BookmarkTreeNode) {
  for(let i = 0; i < BookmarkTreeNode[0].children.length; i++) {
    createBookmarksTree(BookmarkTreeNode[0].children[i], 0, undefined)
  }
})

function setChosenElement(bookmark, element) {
  if(previousChosenElement)
    {
      previousChosenElement.classList.remove("chosen")
    }
  chosenId = bookmark.id
  element.classList.add("chosen")
  previousChosenElement = element
}
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function exportJSON() {
    if(!chosenId) {
      alert('you must choose bookmarks first')
      return
    }
    chrome.bookmarks.getSubTree(chosenId, function(result) {
        let data = JSON.stringify(result)
        download(data, 'test.json', 'application/json')
    })
}

function exportHTML() {
    if(!chosenId) {
      alert('you must choose bookmarks first')
      return
    }
    chrome.bookmarks.getSubTree(chosenId, function(result) {
        let data = result[0]
        let generatedHTML = generateHTML(data)
        download(generatedHTML, "test.html", "text/html")
    })
}
function generateHTML(bookmarks) {
    let div = document.createElement('div')
    createTrees(div, bookmarks, undefined)
    let generatedHTML =  
    "<!DOCTYPE html> <html> <head> <style> .folder{ display:block; position:relative;left:40px;font-size:22px;font-weight:bold } .file{ display:block;position:relative;left:40px;font-size:18px;font-weight:normal  } </style> </head> <body>"
    +
    div.outerHTML
    +
    "</body> </html>"
    return generatedHTML
}
function createTrees(topDiv, bookmark, parentFolder) {
    let isFolder = bookmark.children
    if(isFolder) {
      let folderLength = bookmark.children.length
      let folder = getFolderElement(bookmark)
      if(!parentFolder) { //This is the top folder
        topDiv.appendChild(folder)
      }
      if(parentFolder) {
        parentFolder.appendChild(folder)
      }
      for(let i=0; i < folderLength; i++){
        createTrees(topDiv, bookmark.children[i], folder)
      }
    }
    else {
      let file = getFileElement(bookmark)
      if(!parentFolder) {
        topDiv.appendChild(file)
        return
      }
      parentFolder.appendChild(file)
    }
}

function getFolderElement(bookmark) {
    let div = document.createElement('div')
    div.classList.add('folder')
    div.innerHTML =  bookmark.title
    return div
}

function getFileElement(bookmark) {
    let a = document.createElement('a')
    a.classList.add('file')
    a.href = bookmark.url
    a.innerHTML = bookmark.title
    return a
}

document.addEventListener('DOMContentLoaded', function() {
  let exportHTMLButton = document.getElementById('html')
  let exportJSONButton = document.getElementById('json')
  exportHTMLButton.addEventListener('click',exportHTML)
  exportJSONButton.addEventListener('click',exportJSON)
})
// exportHTMLButton.setAttribute("onclick", "exportHTML()") Chrome extension doesn't allow us to execute inline scripts
// exportJSONButton.setAttribute("onclick", "exportJSON()")
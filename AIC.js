document.addEventListener('DOMContentLoaded', function () {
  checkDB()
})
function checkDB() {
  fetch('http://localhost:3000/artworks')
    .then(resp => resp.json())
    .then(data => {
      if (data.length === 0) {
        fetchArt()
      }
      else if (data.length > 0) {
        buildArtwork(data)
      }
    })
}
function fetchArt() {
  const requestSize = Array(100).fill().map((x, i) => i)                                 //when initially requesting data, a certain percentage would inexplicably fail. to combat this, i've added statements to look at the initial fetch request
  let automate = []                                                                      //and store the index of the item as it fails. also, requests greater than 10 at a time would fail, so i have told the engine to request
  const skipArray = []                                                                   //ten at a time, with a timeout of 1 second. if a request succeeds, it is added to our local database. on start up, the engine checks to see if
  requestSize.forEach((overallIndex) => {                                                //we have data in the database. if we do, it skips the inital fetch, and fetches from our local database.
    automate.push(overallIndex)
    if (automate.length === 10) {
      automate.forEach((item) => {
        setTimeout(() => {
          try {
            fetch(`https://api.artic.edu/api/v1/artworks/${item}`,
              {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'AIC-User-Agent': 'aic-bash (elizabethtreahy@gmail.com)',
                },
              })
              .then(response => {
                if (response.status === 200) {
                  response.json().then(data => createDatabase(data))
                }
                else if (response.status === 400) {
                  skipArray.push(pageNumber)
                }
                else if (response.status === 404) {
                  skipArray.push(pageNumber)
                }
                else if (response.status === 500) {
                  skipArray.push(pageNumber)
                }
              })
          } catch {
            skipArray.push(pageNumber)
          }
        }, 1000)
      })
      automate = []
    }
  })
}
function createDatabase(artInfo) {                                 //function to store successful data in our local database
  fetch('http://localhost:3000/artworks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(artInfo.data)
  })
    .then(response => response.json())
    .then(data => console.log(data))
}
function buildArtwork(element) {                           //function to load one artwork at a time              
  const startIndex = 0
  const endIndex = 1
  let incrementIndex = 0
  loadArtworks(startIndex, endIndex, incrementIndex, element)
  submitComment()
}
function loadArtworks(startIndex, endIndex, incrementIndex, element) {      //function to load each page w/ art and artist name and artwork name
  submitLike()
  pageRight(startIndex, endIndex, incrementIndex, element)
  pageLeft(startIndex, endIndex, incrementIndex, element)
  element.forEach((value, i) => {
    if ((startIndex + incrementIndex <= i) && (endIndex + incrementIndex > i)) {
      const img = document.getElementById('image')
      if (value.image_id !== null) {
        img.src = `https://www.artic.edu/iiif/2/${value.image_id}/full/843,/0/default.jpg`
      }
      else {
        img.src = "images/placeholder.jpg"
      }
      document.getElementById("image-list").append(img)
      let title = document.getElementById("Artwork")
      title.textContent = value.title
      let artistName = document.getElementById("Artist")
      artistName.textContent = value.artist_title
    }
  }
  )
}
function submitComment() {                                         //funciton to submit a comment
  const submitButton = document.getElementById("submit")
  submitButton.addEventListener("click", () => {
    const comment = document.getElementById("comment-area").value
    const p = document.createElement("p")
    p.append(comment)
    document.getElementById("comment-block").append(p)
  })
}
function submitLike() {                                  //function to like an image
  const likeButton = document.getElementById("heart")
  let likeTruthy = true
  likeButton.addEventListener("click", () => {
    if (likeTruthy === true) {
      likeButton.src = "images/Heart-full.png"
      likeTruthy = !likeTruthy
      return likeTruthy
    }
    else {
      likeButton.src = "images/Heart-outline.png"
      likeTruthy = !likeTruthy
      return likeTruthy
    }
  })
}
function pageRight(startIndex, endIndex, incrementIndex, element) {                 //function for moving right w/ arrow button
  document.getElementById("Arrow-Right").addEventListener("click", () => {
    incrementIndex += 1
    if (incrementIndex >= element.length) {
      incrementIndex = startIndex
    }
    clearFields()
    loadArtworks(startIndex, endIndex, incrementIndex, element)
  })
  return incrementIndex
}
function pageLeft(startIndex, endIndex, incrementIndex, element) {                //function for moving left w/ arrow button
  document.getElementById("Arrow-Left").addEventListener("click", () => {
    incrementIndex -= 1
    if (incrementIndex < 0) {
      incrementIndex = element.length - 1
    }
    clearFields()
    loadArtworks(startIndex, endIndex, incrementIndex, element)
  })
  return incrementIndex
}
function clearFields() {
  document.getElementById("comment-block").replaceChildren()                   //function to clear prev info for new page refresh
  document.getElementById("heart").src = "images/Heart-outline.png"
  document.getElementById("comment-area").value = ""

}
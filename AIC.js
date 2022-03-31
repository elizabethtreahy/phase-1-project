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
  const requestSize = Array(100).fill().map((x, i) => i)
  let automate = []
  const skipArray = []
  requestSize.forEach((overallIndex) => {
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
function createDatabase(artInfo) {
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
function buildArtwork(element) {
  const startIndex = 0
  const endIndex = 1
  let incrementIndex = 0
  loadArtworks(startIndex, endIndex, incrementIndex, element)
  submitComment()
}
function loadArtworks(startIndex, endIndex, incrementIndex, element) {
  submitLike()
  pageRight(startIndex, endIndex, incrementIndex, element)
  pageLeft(startIndex, endIndex, incrementIndex, element)
  element.forEach((value, i) => {
    if ((startIndex + incrementIndex <= i) && (endIndex + incrementIndex > i)) {
      const img = document.createElement("img")
      img.id = value.id
      if (value.image_id !== null) {
        img.src = `https://www.artic.edu/iiif/2/${value.image_id}/full/843,/0/default.jpg`
      }
      else {
        img.src = "../phase-1-project/images/placeholder.jpg"
        const li = document.createElement("li")
        li.innerText = "Artwork is temporarily unavailable."
        document.getElementById("image-list").append(li)
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
function submitComment() {
  const submitButton = document.getElementById("submit")
  submitButton.addEventListener("click", () => {
    const comment = document.getElementById("comment-area").value
    const p = document.createElement("p")
    p.append(comment)
    document.getElementById("comment-block").append(p)
  })
}
function submitLike() {
  const likeButton = document.getElementById("heart")
  let likeTruthy = true
  likeButton.addEventListener("click", () => {
    if (likeTruthy === true) {
      likeButton.src = "../phase-1-project/images/Heart.svg"
      likeTruthy = !likeTruthy
      return likeTruthy
    }
    else {
      likeButton.src = "../phase-1-project/images/Heart-outline.svg"
      likeTruthy = !likeTruthy
      return likeTruthy
    }
  })
}
function pageRight(startIndex, endIndex, incrementIndex, element) {
  document.getElementById("Arrow-Right").addEventListener("click", () => {
      incrementIndex += 1
      if (incrementIndex >= element.length) {
        incrementIndex = startIndex
      }
      document.getElementById("image-list").replaceChildren()
      document.getElementById("comment-block").replaceChildren()
      document.getElementById("heart").src = "../phase-1-project/images/Heart-outline.svg"
      document.getElementById("comment-area").value = ""
      loadArtworks(startIndex, endIndex, incrementIndex, element)
  })
  return incrementIndex
}
function pageLeft(startIndex, endIndex, incrementIndex, element) {
  document.getElementById("Arrow-Left").addEventListener("click", () => {
      incrementIndex -= 1
      if (incrementIndex < 0) {
        incrementIndex = element.length - 1
      }
      document.getElementById("image-list").replaceChildren()
      document.getElementById("comment-block").replaceChildren()
      document.getElementById("heart").src = "../phase-1-project/images/Heart-outline.svg"
      document.getElementById("comment-area").value = ""
      loadArtworks(startIndex, endIndex, incrementIndex, element)
  })
  return incrementIndex
}

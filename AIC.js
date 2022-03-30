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
  const requestSize = Array(1000).fill().map((x, i) => i)
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
                  console.log(response.status, pageNumber)
                }
                else if (response.status === 404) {
                  skipArray.push(pageNumber)
                  console.log(response.status, pageNumber)
                }
                else if (response.status === 500) {
                  skipArray.push(pageNumber)
                  console.log(response.status, pageNumber)
                }
              })
          } catch {
            skipArray.push(pageNumber)
            console.log(skipArray)
          }
        }, 1000)
      })
      automate = []
    }
  })
}

function createDatabase(artInfo) {
  console.log(artInfo)
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
  element.forEach(value => {
    console.log(value.artist_title)
  })
}
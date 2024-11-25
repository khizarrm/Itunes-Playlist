let playlist = JSON.parse(localStorage.getItem('playlist')) || [];

function getSong() {
  let songName = document.getElementById('song').value;
  console.log('Song function called');

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      console.log(response);
      document.getElementById('songname').innerHTML = `
        <h1>Songs Matching: ${songName} </h1>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Artwork</th>
            </tr>
          </thead>
          <tbody>
            ${response.results.map(song => `
              <tr>
                <td><button class="add" onclick="addToPlaylist('${song.trackName}', '${song.artistName}', '${song.artworkUrl100}')">+</button></td>
                <td>${song.trackName}</td>
                <td>${song.artistName}</td>
                <td><img src="${song.artworkUrl100}" alt="Artwork"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      updatePlaylist();
    }
  };
  xhr.open('GET', `/songs?term=${songName}`, true);
  xhr.send();
}

function addToPlaylist(trackName, artistName, artworkUrl100) {
  var playlistTableBody = document.getElementById('playlist-table-body');
  var newRow = document.createElement('tr');
  var actionsCell = document.createElement('td');
  var titleCell = document.createElement('td');
  var artistCell = document.createElement('td');
  var artworkCell = document.createElement('td');

  var removeButton = document.createElement('button');
  removeButton.innerHTML = "-";
  removeButton.onclick = function() {
    var row = this.parentNode.parentNode;
    playlistTableBody.removeChild(row);
  };

  var moveUpButton = document.createElement('button');
  moveUpButton.innerHTML = "🔼";
  moveUpButton.onclick = function() {
    var row = this.parentNode.parentNode;
    var previousRow = row.previousElementSibling;
    if (previousRow) {
      playlistTableBody.insertBefore(row, previousRow);
    }
  };

  var moveDownButton = document.createElement('button');
  moveDownButton.innerHTML = "🔽";
  moveDownButton.onclick = function() {
    var row = this.parentNode.parentNode;
    var nextRow = row.nextElementSibling;
    if (nextRow) {
      playlistTableBody.insertBefore(nextRow, row);
    }
  };

  actionsCell.appendChild(removeButton);
  actionsCell.appendChild(moveUpButton);
  actionsCell.appendChild(moveDownButton);

  titleCell.textContent = trackName;
  artistCell.textContent = artistName;

  var artworkImage = document.createElement('img');
  artworkImage.src = artworkUrl100;
  artworkImage.alt = 'Artwork';
  artworkCell.appendChild(artworkImage);

  newRow.appendChild(actionsCell);
  newRow.appendChild(titleCell);
  newRow.appendChild(artistCell);
  newRow.appendChild(artworkCell);

  playlistTableBody.appendChild(newRow);
  playlist.push({ trackName, artistName, artworkUrl100 });
  updatePlaylist();
}

function updatePlaylist() {
  localStorage.setItem('playlist', JSON.stringify(playlist));
  console.log('update called');
}

function handleKeyUp(event) {
  if (event.keyCode === 13) {
    document.getElementById("submit_button").click();
  }
}

document.addEventListener('DOMContentLoaded', function() {

  // Event listeners
  document.getElementById('submit_button').addEventListener('click', getSong);
  document.addEventListener('keyup', handleKeyUp);

});

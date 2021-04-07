const clientId = '344145a119d24910bd258fffe9980f3d';
const redirectURI = 'https://dylanbrinkley.com/repos/playlist-creator/index.html';
// const redirectURIDev = 'http://localhost:3000/';

let accessToken = '';
let expiresIn = '';

let getAccessToken = (url) => {
  if(accessToken === null){
    return accessToken;
  }

  let token = url.match(/access_token=([^&]*)/);
  let expires = url.match(/expires_in=([^&]*)/);

  if(token !== null && expires !== null){
    accessToken = token[1];
    expiresIn = expires[1];
     
    window.setTimeout(() => accessToken = '', expiresIn * 1);
    window.history.pushState('Access Token', null, '/');
  }
}

let redirectAuthorizeLink = (accessToken, redirectUri, clientId) => {
  if(accessToken === '' && window.location.href.match(/access_token=([^&]*)/) === null){
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
  }
}

getAccessToken(window.location.href);
redirectAuthorizeLink(accessToken, redirectURI, clientId);



let Spotify = {
  async search (term) {
    let trackArr = [];
    await fetch('https://api.spotify.com/v1/search?type=track&q=' + term, 
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      }
    ).then(response => response.json())
     .then(data => {
      trackArr = data.tracks.items.map(track => {

          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            previewUrl: track.preview_url
          }
          
        })
     }).catch(() => {
       redirectAuthorizeLink(accessToken, redirectURI, clientId);
    });
     return trackArr;
  },//END search()

  async savePlaylist(name, trackArr) {
    if(name === null || trackArr === null || name === '' || trackArr === ''){
      return null;
    }
    let header = {Authorization: `Bearer ${accessToken}`};
    let userId;
    let playlistId;

    await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: header
    }).then(response => response.json())
      .then(data => userId = data.id)
      .catch(() => {
        redirectAuthorizeLink(accessToken, redirectURI, clientId);
     });


    let createPlaylistBody = {name: name};

    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(createPlaylistBody)
    }).then(response => response.json())
      .then(data => {playlistId = data.id})
      .catch(() => {
        redirectAuthorizeLink(accessToken, redirectURI, clientId);
     });


    let addTracksBody = {uris: trackArr};

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(addTracksBody)
    });

    return;

  },//END savePlaylist()

  async getPlaylists(){
    let header = {Authorization: `Bearer ${accessToken}`};
    let userId;
    let playlisitArr;

    await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: header
    }).then(response => response.json())
      .then(data => userId = data.id)
      .catch(() => {
        redirectAuthorizeLink(accessToken, redirectURI, clientId);
     });


    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'GET',
      headers: header
    }).then(response => response.json())
      .then(data => {
        playlisitArr = data.items.map(playlist => {
  
            return {
              id: playlist.id,
              name: playlist.name,
              href:  playlist.href
            }
            
          })
       })
       .catch(() => {
        redirectAuthorizeLink(accessToken, redirectURI, clientId);
       });

    return playlisitArr;
  }, //END getPlaylists

  async getPlaylist(id){
    let header = {Authorization: `Bearer ${accessToken}`};
    let playlistArr;

    await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      method: 'GET',
      headers: header
    }).then(response => response.json())
      .then(data => {

        playlistArr = data.tracks.items.map(track => {
  
          return {
            id: track.track.id,
            name: track.track.name,
            artist: track.track.artists[0].name,
            album: track.track.album.name,
            uri: track.track.uri,
            previewUrl: track.track.preview_url
          }
        })

        playlistArr.unshift({playlistName: data.name});
    })
    .catch(() => {
      redirectAuthorizeLink(accessToken, redirectURI, clientId);
   });
    return playlistArr;
  }, //END getPlaylists

  async updatePlaylist(id, tracksUris, playlistName, tracksUrisOriginal){
    let header = {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};
    let body;

    if(tracksUrisOriginal !== null){
      const removeUris = tracksUrisOriginal.filter(track => tracksUris.indexOf(track) === -1)
        .map(track2 => ({uri: track2}));

      body = {tracks: removeUris};

      await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'DELETE',
        headers: header,
        body: JSON.stringify(body)
      });
    }

    body = {name: playlistName};

    await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(body)
    });


    body = {uris: tracksUris};

    await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(body)
    });
  },


};

export default Spotify

import React, { Component } from 'react'
import './PlaylistSaving.css'

class PlaylistSaving extends Component {

  render() {
    return (
      <div className="SavingPlaylist">
        <p>Saving Playlist</p>
        <img src="../../images/loader.gif" alt="Playlist is saving." className="SavingPlaylist_Icon"/>
      </div>
    )
  }

}

export default PlaylistSaving
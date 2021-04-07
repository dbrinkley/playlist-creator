import React, { Component } from 'react'
import './PlayList.css'
import TrackList from '../TrackList/TrackList'
import Dropdown from '../Dropdown/Dropdown'


export class PlayList extends Component {
  

  handleNameChange = (e) => {
    this.props.onNameChange(e.target.value);
    this.props.isPlaylistDropdownOpen && this.props.onToggle();
  }
  

  render() {

    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange} />
        <Dropdown changePlaylist={this.props.changePlaylist} playlists={this.props.playlists} changePlaylistName={this.props.onNameChange} onToggle={this.props.onToggle} isPlaylistDropdownOpen={this.props.isPlaylistDropdownOpen}/>

        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} onPreview={this.props.onPreview} previewSongId={this.props.previewSongId} previewSongList={this.props.previewSongList} isSaving={this.props.isSaving} />
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    )
  }
}

export default PlayList

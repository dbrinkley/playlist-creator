import React, { Component } from 'react'
import './TrackList.css'
import Track from '../Track/Track'
import PlaylistSaving from '../PlaylistSaving/PlaylistSaving'

class TrackList extends Component {
  render() {

    return (

      this.props.isSaving === true
        ? <PlaylistSaving />
        : <div className="TrackList">
            {this.props.tracks.map((track) => {

              let previewTrack = track.id === this.props.previewSongId
                ? true : false;

              return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} onPreview={this.props.onPreview} isPreview={previewTrack} />
            })}
          </div>
    
    )
  }
}

export default TrackList

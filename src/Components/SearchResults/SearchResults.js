import React, { Component } from 'react'
import './SearchResults.css'
import TrackList from '../TrackList/TrackList'

class SearchResults extends Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} onPreview={this.props.onPreview} previewSongId={this.props.previewSongId} previewSongList={this.props.previewSongList} />
      </div>
    )
  }
}

export default SearchResults

import React, { Component } from 'react'
import './Dropdown.css'
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Dropdown extends Component {


  selectItem = item => {

    const name = item === null ? "New Playlist" : item.name;
    const id = item === null ? null : item.id;
  
    this.props.changePlaylist(id);
    this.props.changePlaylistName(name);
    this.props.onToggle();
  }

  handleToggle = () => {
    this.props.onToggle();
  }



  render() {
    return (
      <div className="Dropdown-container">
        { this.props.isPlaylistDropdownOpen
          ? <button onClick={this.handleToggle} className="Dropdown-toggle"><FontAwesomeIcon icon={faCaretDown} /></button>
          : <button onClick={this.handleToggle} className="Dropdown-toggle"><FontAwesomeIcon icon={faCaretUp} /></button> }
        

        { this.props.isPlaylistDropdownOpen && (
          <div className="Dropdown">
            <button className="Dropdown-option" onClick={() => this.selectItem(null)}>New Playlist</button>
              { this.props.playlists.map(playlist => {
                  return <button value={playlist.id} playlistname={playlist.name} data-playlistname={playlist.name} key={playlist.id} onClick={() => this.selectItem(playlist)} className="Dropdown-option">{playlist.name}</button>
              })}
          </div>
        )}
      </div>
    )
  }
}

export default Dropdown

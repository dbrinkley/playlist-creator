import React, { Component } from 'react'
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';

import Spotify from '../../util/Spotify'

class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistTracksOriginal: [],
      searchResults: [],
      previewSongId: null,
      savingPlaylist: false,
      playlists: [],
      selectedPlaylistId: null,
      isPlaylistDropdownOpen: false,
      term: ""
    } 

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.previewTrack = this.previewTrack.bind(this);
    this.onChangePlaylist = this.onChangePlaylist.bind(this);
    this.filterSearchResults = this.filterSearchResults.bind(this);
    this.saveToLocal = this.saveToLocal.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.updateTerm = this.updateTerm.bind(this);
  }


  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    this.setState((state) => ({
      playlistTracks: [...state.playlistTracks, track]
    }))
  }

  removeTrack(track){
    const newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks: newPlaylist});
  }

  previewTrack(id){
    this.setState({previewSongId: id});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  updateTerm(term){
    this.setState({term: term});
  }

  savePlaylist(){

    this.setState({savingPlaylist: true});

    setTimeout(() => {

      let trackArrOriginal = this.state.playlistTracks !== this.state.playlistTracksOriginal
        ? this.state.playlistTracksOriginal.map(track => track.uri) : null;

        // console.log(trackArrOriginal);

      let trackArr = this.state.playlistTracks.map(track => track.uri);

      this.state.selectedPlaylistId !== null
       ? Spotify.updatePlaylist(this.state.selectedPlaylistId, trackArr, this.state.playlistName, trackArrOriginal)
       : Spotify.savePlaylist(this.state.playlistName, trackArr);

       this.state.selectedPlaylistId !== null 
        ? console.log('update playlist') : console.log('save Playlist');

      
      Spotify.getPlaylists().then(data => {
        this.setState({ 
          playlistName: 'New Playlist',
          playlistTracks: [],
          playlistTracksOriginal: [],
          savingPlaylist: false,
          selectedPlaylistId: null, 
          playlists: data});
      });
    }, 1000);
  }

  onSearch(){
    Spotify.search(this.state.term).then(tracks => {
      this.setState({searchResults: [...tracks]});
    });
  }

  filterSearchResults() {  
    if(Array.isArray(this.state.playlistTracks) && this.state.playlistTracks.length){
        return this.state.searchResults.filter(track => {
          return this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id) ? false : true;        
        })
    } else {
      return this.state.searchResults;
    }
  }

  saveToLocal() {
    window.localStorage.setItem('currentState', JSON.stringify(this.state));
  }


  toggleDropdown() {
    this.setState(prevState => ({
      isPlaylistDropdownOpen: !prevState.isPlaylistDropdownOpen
   }))
  }

  //Desc: null check is for when user selects 'new playlist' from dropdown in playlist component
  async onChangePlaylist(id) {
    if(id !== null){
      await Spotify.getPlaylist(id).then(data => {
        let playlistName = data[0].playlistName;
        data.shift();
        this.setState({playlistName: playlistName, playlistTracks: data, playlistTracksOriginal: data, selectedPlaylistId: id});
      });
    } else {
      this.setState({
        playlistTracks: [],
        playlistTracksOriginal: [],
        selectedPlaylistId: null
      });
    }
  }

  componentDidMount(){
    Spotify.getPlaylists().then(data => {
      this.setState({playlists: data});
    });
    if(window.localStorage.getItem('currentState') !== null && window.localStorage.getItem('currentState').length !== 0){
      this.setState({...JSON.parse(window.localStorage.getItem('currentState'))});
    } 
  }

  componentDidUpdate(){
    this.saveToLocal();
  }




  render(){

    return (
      <div>
        <h1>Playlist<span className="highlight">Creator</span></h1>
        <div className="App">
          <SearchBar onSearch={this.onSearch} onTermChange={this.updateTerm} searchTerm={this.state.term} />
            <div className="App-playlist">
              <SearchResults searchResults={this.filterSearchResults()} onAdd={this.addTrack} onPreview={this.previewTrack} previewSongId={this.state.previewSongId} previewSongList={this.state.previewSongList} />

              <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onPreview={this.previewTrack} previewSongId={this.state.previewSongId}  previewSongList={this.state.previewSongList} isSaving={this.state.savingPlaylist} playlists={this.state.playlists} changePlaylist={this.onChangePlaylist} selectedPlaylistId={this.state.selectedPlaylistId} onToggle={this.toggleDropdown} isPlaylistDropdownOpen={this.state.isPlaylistDropdownOpen} />
            </div>
        </div>
        <div className="App-footer">
          <p className="App-footer-text">Powered by <a href="https://spotify.com">Spotify</a></p>
        </div>
      </div>
    )
  }
}

export default App;

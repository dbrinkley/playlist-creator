import React, { Component } from 'react'
import './SearchBar.css'

class SearchBar extends Component {
  constructor(props) {
    super(props)
  
    // this.state = {
    //    term: null
    // }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  

  search(){
    this.props.onSearch();
  }

  handleTermChange(e){
    this.props.onTermChange(e.target.value);
  }

  handleKeyDown(e){
    if(e.keyCode === 13){
      this.search();
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleKeyDown} value={this.props.searchTerm} />
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
    </div>
    )
  }
}

export default SearchBar

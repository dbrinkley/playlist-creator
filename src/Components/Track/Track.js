import React, { Component } from 'react'
import { FaPlay, FaStop } from 'react-icons/fa';
import './Track.css'


export class Track extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.previewTrack = this.previewTrack.bind(this);
    this.renderPreviewAction = this.renderPreviewAction.bind(this)
  }
  

  renderAction(){
    return this.props.isRemoval ? <button className="Track-action Track-action-active Track-action-addRemove" onClick={this.removeTrack}>-</button> : <button className="Track-action Track-action-active Track-action-addRemove" onClick={this.addTrack}>+</button>;
  }

  renderPreviewAction(){
    let previewDisplay = this.props.track.previewUrl === null
      ? true : false;

    let buttonStatusClass = this.props.track.previewUrl === null
    ? ' Track-action-inactive' : 'Track-action-active'

    return this.props.isPreview ? <button disabled={previewDisplay} className={`Track-action Track-action-preview ${buttonStatusClass} Track-action-preview-active`} onClick={this.previewTrack}><FaStop /></button> : <button disabled={previewDisplay} className={`Track-action Track-action-preview ${buttonStatusClass}`} onClick={this.previewTrack}><FaPlay /></button>;
  }


  previewTrack(){
    let trackId = !(this.props.isPreview) ? this.props.track.id : null;
    this.props.onPreview(trackId);
  }


  addTrack(){
    this.props.onAdd(this.props.track);
  }


  removeTrack(){
    this.props.onRemove(this.props.track);
  }


  renderPreview(){
    return this.props.isPreview ? <audio src={this.props.track.previewUrl} controls autoPlay className="Track-audio-preview" /> : "";
  }

  
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} |{this.props.track.album}</p>
        </div>
        
        {this.renderPreviewAction()}
        {this.renderPreview()}
        {this.renderAction()}
      </div>
    )
  }
}

export default Track


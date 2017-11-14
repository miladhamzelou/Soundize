import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  pauseActiveTrack,
  playActiveTrack,
  showMusicbar
} from '../actions/player_actions'

import {
  setActiveTrack,
  removeTrackFromPlaylist,
  addTrackToPlaylist,
  addTrackToQueuedList,
  setActiveTracklist,
  setPlayingTracklist
} from '../actions/track_actions'

class Track extends Component {
  state = {
    dropdownClassName: 'dropdown'
  }
  handleClick = event => {
    if (this.state.dropdownClassName === 'dropdown is-active') {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.setState({ dropdownClassName: 'dropdown' })
      }
    }
  }
  renderArtists(artists) {
    return artists.map((artist, index) => {
      if (index + 1 === artists.length) {
        return artist.name
      } else {
        return artist.name + ', '
      }
    })
  }
  addTrackToQueuedList = track => {
    this.props.addTrackToQueuedList(track)
    this.toggleDropdown()
  }
  startTrack = async track => {
    if (track.id === this.props.activeTrack.id) {
      this.props.playActiveTrack()
      this.props.showMusicbar()
    } else {
      this.props.setPlayingTracklist(this.props.activeTracklist)
      await this.props.setActiveTrack(track, this.props.index)
      this.props.playActiveTrack()
      this.props.showMusicbar()
    }
  }
  setClassName = () => {
    if (this.props.activeTrack.id === this.props.track.id) {
      return 'track active-track'
    } else {
      return 'track'
    }
  }
  renderStartStopButton = () => {
    if (this.props.track.preview_url !== null) {
      return this.props.isPlaying &&
        this.props.activeTrack.id === this.props.track.id ? (
        <button
          style={{ transform: `translateY(${3}px)`, boxShadow: 'none' }}
          onClick={() => this.props.pauseActiveTrack()}
          className="button play-btn"
        >
          <span className="icon">
            <i className="fa fa-pause" />
          </span>
        </button>
      ) : (
        <button
          onClick={() => this.startTrack(this.props.track)}
          className="button play-btn"
        >
          <span className="icon">
            <i className="fa fa-play" />
          </span>
        </button>
      )
    } else {
      return (
        <button className="button play-btn">
          <span className="icon">
            <i className="fa fa-stop" />
          </span>
        </button>
      )
    }
  }
  playedTimeColor = () => {
    if (this.props.activeTrack.id === this.props.track.id) {
      return this.props.playedTime * 100 + '%'
    } else {
      return 0
    }
  }
  renderPopularity = () => {
    let pop = Math.round(this.props.track.popularity / 10)
    var foo = []
    for (var i = 1; i <= pop; i++) {
      foo.push(i)
    }
    return foo.map((div, index) => {
      return <div key={index} className="color-pop" />
    })
  }
  toggleDropdown = () => {
    if (this.state.dropdownClassName === 'dropdown') {
      this.setState({ dropdownClassName: 'dropdown is-active' })
      document.addEventListener('mousedown', this.handleClick)
    } else {
      this.setState({ dropdownClassName: 'dropdown' })
      document.removeEventListener('mousedown', this.handleClick)
    }
  }
  addTrackToPlaylist = (ownerId, playlistId) => {
    this.props.addTrackToPlaylist(ownerId, playlistId, this.props.track.uri)
    this.toggleDropdown()
  }

  removeTrackFromPlaylist = async spotifyURI => {
    await this.props.removeTrackFromPlaylist(
      this.props.activeTracklist.owner.id,
      this.props.activeTracklist.id,
      spotifyURI
    )
    this.toggleDropdown()
    this.props.setActiveTracklist(
      this.props.activeTracklist.owner.id,
      this.props.activeTracklist.id
    )
  }
  renderPlaylists = () => {
    if (this.props.privatePlaylists) {
      return this.props.privatePlaylists.map((playlist, index) => {
        return (
          <li key={index}>
            <a
              onClick={() =>
                this.addTrackToPlaylist(playlist.owner.id, playlist.id)}
            >
              {playlist.name}
            </a>
          </li>
        )
      })
    }
  }
  setWrapperRef = node => {
    this.wrapperRef = node
  }
  render() {
    return (
      <li className={this.setClassName()}>
        <div className="img-wrapper">
          <div className="img-click-play">
            {this.props.isPlaying &&
            this.props.activeTrack.id === this.props.track.id ? (
              <button
                onClick={() => this.props.pauseActiveTrack()}
                className="button play-btn"
              >
                <span className="icon">
                  <i className="fa fa-pause" />
                </span>
              </button>
            ) : (
              <button
                onClick={() => this.startTrack(this.props.track)}
                className="button play-btn"
              >
                <span className="icon">
                  <i className="fa fa-play" />
                </span>
              </button>
            )}
          </div>
          {this.props.track.album.images.length !== 0 ? (
            <img src={this.props.track.album.images[0].url} />
          ) : (
            <img />
          )}
        </div>

        <div className="track-info">
          <div className="track-section-higher">
            <div className="track-details">
              <div className="artist-label">
                {this.renderArtists(this.props.track.artists)}
              </div>
              <div className="title-label">{this.props.track.name}</div>
            </div>

            <div className="track-section-higher-right-grp">
              <div className="popularity">
                <div
                  className="bg-pop-wrapper"
                  style={{ position: 'absolute' }}
                >
                  {this.renderPopularity()}
                </div>
                <div className="bg-pop-wrapper">
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                  <div className="bg-pop" />
                </div>
              </div>

              <div className={this.state.dropdownClassName}>
                <div className="dropdown-trigger">
                  <div
                    onClick={() => this.toggleDropdown()}
                    className="track-open-mini-meny"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                  >
                    <i className="fa fa-circle" aria-hidden="true" />
                    <i className="fa fa-circle" aria-hidden="true" />
                    <i className="fa fa-circle" aria-hidden="true" />
                  </div>
                </div>

                <div
                  ref={this.setWrapperRef}
                  className="dropdown-menu track-mini-meny"
                  id="dropdown-menu"
                  role="menu"
                >
                  <div className="dropdown-content">
                    <div
                      className="dropdown-item open-add-track"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu4"
                    >
                      Lägg till i spellista<span className="icon is-small">
                        <i className="fa fa-angle-right" aria-hidden="true" />
                      </span>
                      <div className="mini-meny-playlists">
                        <ul className="menu-list">{this.renderPlaylists()}</ul>
                      </div>
                    </div>
                    {this.props.track.preview_url !== null ? (
                      <div
                        onClick={() =>
                          this.addTrackToQueuedList(this.props.track)}
                        className="dropdown-item"
                      >
                        Lägg till i kön
                      </div>
                    ) : null}
                    {this.props.isMyPlaylist ? (
                      <div
                        onClick={() =>
                          this.removeTrackFromPlaylist(this.props.track.uri)}
                        className="dropdown-item"
                      >
                        Ta bort från spellistan
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="track-section-lower">
            {this.renderStartStopButton()}
            {this.props.activeTrack.id === this.props.track.id ? (
              <div className="time-counter">
                {(Math.round(30 * (this.props.playedTime || 0)) / 100).toFixed(
                  2
                )}
              </div>
            ) : (
              <div className="time-counter hidden" />
            )}
            <div className="time-duration">
              {(Math.round(30) / 100).toFixed(2)}
            </div>
            <div className="running-track">
              <div
                style={{ width: this.playedTimeColor() }}
                className="played-color"
              />
              <div className="track-color" />
              {this.props.track.id === this.props.activeTrack.id ? (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={this.props.playedTime}
                  readOnly
                  /* onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp} */
                />
              ) : (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={0}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      </li>
    )
  }
}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isMyPlaylist: PropTypes.bool
}

const mapStateToProps = ({ playlist, track, player }) => {
  return {
    playlists: playlist.playlists,
    isPlaying: player.isPlaying,
    playedTime: player.playedTime,
    activeTrack: track.activeTrack,
    activeTracklist: track.activeTracklist,
    privatePlaylists: playlist.privatePlaylists
  }
}

export default connect(mapStateToProps, {
  pauseActiveTrack,
  playActiveTrack,
  setActiveTrack,
  removeTrackFromPlaylist,
  addTrackToPlaylist,
  addTrackToQueuedList,
  showMusicbar,
  setActiveTracklist,
  setPlayingTracklist
})(Track)

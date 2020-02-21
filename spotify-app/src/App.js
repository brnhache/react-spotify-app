import React, { Component } from "react";
import logo from "./logo.svg";
import hash from "./hash.js";
import Player from "./Player.js";
import * as $ from "jquery";
import "./App.css";

export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "69ac6279528e4e46876893964895c496";
const redirectUri = "http://localhost:3000";
const scopes = ["user-read-currently-playing", "user-read-playback-state"];

class App extends Component {
    constructor() {
        super();
        this.state = {
            token: null,
            item: {
                album: {
                    images: [{ url: "" }]
                },
                name: "",
                artists: [{ name: "" }],
                duration_ms: 0
            },
            is_playing: "Paused",
            progress_ms: 0
        };
        this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    }

    getCurrentlyPlaying(token) {
        // Make a call using the token
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: xhr => {
                xhr.setRequestHeader("Authorization", "Bearer" + token);
            },
            success: data => {
                this.setState({
                    item: data.item,
                    is_playing: data.is_playing,
                    progress_ms: data.progress_ms
                });
            }
        });
    }

    componentDidMount() {
        // set token
        let _token = hash.access_token;
        if (_token) {
            // set token
            this.setState({
                token: _token
            });
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    {!this.state.token && (
                        <a
                            className="btn btn--loginApp-link"
                            href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                                "%20"
                            )}&response_type=token&show_dialog=true`}
                        >
                            Login to Spotify
                        </a>
                    )}
                    {this.state.token && (
                        // Spotify Player Will Go Here In The Next Step
                        <Player
                            item={this.state.item}
                            is_playing={this.state.is_playing}
                            progress_ms={this.progress_ms}
                        />
                    )}
                </header>
            </div>
        );
    }
}

export default App;

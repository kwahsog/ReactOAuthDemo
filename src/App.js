import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import logo from './logo.svg';
import './App.css';
import config from './config.json';

class App extends Component {
    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token: '' };
    }

    logout = () => {
        this.setState({ isAuthenticated: false, token: '', user: null })
    };

    onFailure = () => {
        alert("Auth failed");
    };

    googleResponse = (response) => {
        //const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
        const token = JSON.stringify({ access_token: response.accessToken });
        const options = {
            method: 'POST',
            body: token,
            mode: 'cors',
            cache: 'default'
        };

        ///////TODO: Configure fetch to properly parse json reply. to match token.
        fetch(config.SERVER_URL, options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                    //this.setState({ isAuthenticated: true, user, token })
                    this.setState({ isAuthenticated: true, user, token });

            });
        })
    };

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <GoogleLogout
                            buttonText="Logout"
                            onLogoutSuccess={this.logout}
                        >
                        </GoogleLogout>
                    </div>
                </div>
            ) :
            (
                <div>
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

export default App;


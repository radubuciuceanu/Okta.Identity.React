import React, {Component} from 'react';
import {Button} from "@material-ui/core";
import './home.css'
import {Grid} from "@material-ui/core";
import {userRepository} from "../../data/repositories/user-repository";
import {tap} from "rxjs/operators";
import Logout from "../../business/commands/logout";
import User from "../user/user";

export default class Home extends Component {
    #logoutCommand = new Logout();

    constructor(props) {
        super(props);

        this.state = {authCookies: null};
    }

    componentDidMount() {
        userRepository.getLoggedUser()
            .pipe(tap((cookies) => this.setState({authCookies: cookies})))
            .subscribe();
    }

    render() {
        return (
            <Grid container spacing={16} alignItems={'center'} justify={'center'} direction={"column"}>
                {this.#renderHelloMessage()}
                {this.#renderUser()}
                <Grid className="home-field" item>
                    {this.#renderLoginButton()}
                    {this.#renderLogoutButton()}
                </Grid>
            </Grid>
        )
    }

    #renderLoginButton = () => {
        if (!this.state.authCookies) {
            return <Button fullWidth onClick={this.#login}>Login</Button>
        }

        return null;
    };

    #renderLogoutButton = () => {
        if (this.state.authCookies) {
            return <Button fullWidth onClick={this.#logout}>Logout</Button>
        }

        return null;
    };

    #login = () => {
        this.props.history.push('/login');
    };

    #logout = () => {
        this.#logoutCommand.execute()
            .pipe(tap(() => this.props.history.push('/login')))
            .subscribe();
    };

    #renderHelloMessage = () => {
        if (this.state.authCookies) {
            return (
                <Grid className="home-field" item>
                    <Button fullWidth>Hello {this.state.authCookies.user.profile.firstName}</Button>
                </Grid>
            )
        }

        return null;
    };

    #renderUser = () => {
        if (this.state.authCookies) {
            return (
                <Grid className="home-field">
                    <Button fullWidth onClick={this.#user}>User</Button>
                </Grid>
            )
        }

        return null;
    };

    #user = () => {
        this.props.history.push('/user');
    }
}

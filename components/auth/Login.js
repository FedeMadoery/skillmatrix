import React, {useState} from 'react';
import {Button, Form, Grid, Header, Input, Message, Segment, TransitionablePortal} from "semantic-ui-react";
import {Link} from '../../routes';
import {connect} from "react-redux";
import {loginUser, loginWithGitHub, loginWithGoogle} from "../../redux/actions";
import {firebase} from '@firebase/app';

const _login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, showAlert] = useState(false);
    const [error, setError] = useState({errorCode: 'init', errorMessage: 'init'});

    const handlerGitHubLogin = () => {
        const provider = new firebase.auth.GithubAuthProvider();

        loginWithFirebasePopup(provider, props.loginWithGitHub);
    };

    const handlerGoogleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        loginWithFirebasePopup(provider, props.loginWithGoogle);
    };

    const loginWithFirebasePopup = (provider, loginSuccess) => {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const token = result.credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            loginSuccess(token, user);
        }).catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            setError({errorCode, errorMessage});
            showAlert(true);
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
        });
    };


    return (
        <Grid centered columns={2}>
            <Grid.Column>
                <Header as="h2" textAlign="center">
                    Login
                </Header>

                <TransitionablePortal onClose={() => showAlert(false)} open={alert}
                                      transition={{animation: 'fly up', duration: 500}}>
                    <Grid centered columns={1} style={{position: 'absolute', top: '50%', left: '26.5%'}}>
                        <Grid.Column>
                            <Segment color='red'>
                                <Message warning>
                                    <Message.Header>We're sorry we can't do that</Message.Header>
                                    <p>{error.errorCode}</p>
                                    <p>{error.errorMessage}</p>
                                </Message>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </TransitionablePortal>

                <Segment>
                    <Form size="large">
                        <Form.Field>
                            <Input
                                fluid
                                icon='users'
                                iconPosition='left'
                                labelPosition='right'
                                placeholder="Email address"
                                onChange={(event) => setEmail(event.target.value)}
                                label={{content: '@folderit.net'}}
                            />
                        </Form.Field>

                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <Button color="blue" fluid size="large" loading={props.auth.loading}
                                onClick={() => props.loginUser(email, password)}>
                            Login
                        </Button>


                        {/*<br/>

                        <Grid centered columns={3}>
                            <Grid.Column>
                                <Button disabled={true}
                                    icon='github' labelPosition='left' color='black' onClick={handlerGitHubLogin}
                                    label={{as: 'button', basic: true, content: 'Login with'}}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Button disabled={true}
                                    icon='google' labelPosition='left' color='red' onClick={handlerGoogleLogin}
                                    label={{as: 'button', basic: true, content: 'Login with'}}
                                />
                            </Grid.Column>
                        </Grid>*/}
                    </Form>
                </Segment>
            </Grid.Column>

        </Grid>
    );
};

function mapStateToProps(state) {
    return {...state}
}

export default connect(mapStateToProps, {loginUser, loginWithGitHub, loginWithGoogle})(_login);
import {
    CLEAN_DATA, FETCH_USER_DATA,
    LOGIN_USER, LOGIN_USER_FAILED,
    LOGIN_WITH_GITHUB,
    LOGIN_WITH_GOOGLE,
    LOGIN_WITH_INTRANET,
    LOGOUT_USER
} from "./types";
import {Router} from "../../routes";
import {cleanData, userDataUpdate} from "./FireBaseAction";
import axios from "axios";
import {getUserByEmail} from "../../env";
import {getLargeImage} from "../../components/utils/imagesManager";

export const loginUser = (email, password) => {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        const user = {username: email + '@folderit.net', password};
        axios
            .post("https://hrm.folderit.net/wp-json/jwt-auth/v1/token", user)
            .then(
                r => {
                    if (r && r.data && r.data.token) {
                        const userResult = {
                            email: r.data.user_email,
                            displayName: r.data.user_display_name,
                            folderHRMID: r.data.user_id,
                            photoURL: ''
                        };
                        sessionStorage.setItem('tokenJWT', r.data.token);
                        const headers = {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json'
                        };


                        axios.post(getUserByEmail, userResult, {headers: headers}).then(async (response) => {
                                const data = response.data;
                                userResult.position = data.user.position;
                                userResult.photoURL = data.user.photoURL;
                                userResult.uid = data.uid;

                                if (!data.user.photoURL) {

                                    let config = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                            'Authorization': `Bearer ${r.data.token}`,
                                        },
                                        params: {
                                            include: 'avatar'
                                        }
                                    };

                                    return axios.get(`https://hrm.folderit.net/wp-json/erp/v1/hrm/employees/${userResult.folderHRMID}`, config).then(
                                        (response) => {
                                            userResult.photoURL = response.data.avatar_url;
                                            dispatch(loginWithIntranet(r.data.token, userResult));
                                            dispatch({type: FETCH_USER_DATA, payload: data.user});
                                            Router.pushRoute('/')
                                        }
                                    );
                                } else {
                                    dispatch(loginWithIntranet(r.data.token, userResult));
                                    dispatch({type: FETCH_USER_DATA, payload: data.user});
                                    Router.pushRoute('/')
                                }
                            }
                        ).catch(e => {
                            dispatch({type: LOGIN_USER_FAILED});
                            console.log(e)
                        });
                    }
                }
            ).catch(e => {
            dispatch({type: LOGIN_USER_FAILED});
            console.log(e)
        })
        ;
    };
};


export const loginWithGitHub = (token, user) => {
    return (dispatch) => {
        dispatch({type: LOGIN_WITH_GITHUB, payload: {token, user}});
        dispatch(userDataUpdate({email: user.email, photoURL: user.photoURL}));
        Router.pushRoute('/')
    };
};

export const loginWithGoogle = (token, user) => {
    return (dispatch) => {
        dispatch({type: LOGIN_WITH_GOOGLE, payload: {token, user}});
        dispatch(userDataUpdate({email: user.email, photoURL: user.photoURL}));
        Router.pushRoute('/')
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        dispatch({type: LOGOUT_USER});
        dispatch({type: CLEAN_DATA});
        Router.pushRoute('/login')
    }

};
const loginWithIntranet = (token, user) => {
    return (dispatch) => {
        dispatch({type: LOGIN_WITH_INTRANET, payload: {token, user,}});
        dispatch(userDataUpdate({email: user.email, photoURL: user.photoURL}));
        Router.pushRoute('/')
    };
};



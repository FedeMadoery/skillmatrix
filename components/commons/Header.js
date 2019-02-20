import React from 'react';
import {Button, Icon, Menu} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import {connect} from "react-redux";
import {withRouter} from "next/router";
import {logoutUser, skillCreate} from "../../redux/actions";

const _header = (props) => {
    //state = {}

    const ROUTES = {
        home: '/index',
        employees: '/employees'
    };


    const handleItemClick = (e, {name}) => Router.pushRoute(ROUTES[name.toLowerCase()]);


    return (
        <Menu style={{marginTop: '10px'}} size='small'>
            <Menu.Item active={ROUTES.home === props.router.asPath}
                       onClick={handleItemClick} name='Home' />

            <Menu.Menu position="right">
                <Menu.Item active={ROUTES.employees === props.router.asPath}
                           onClick={handleItemClick} name='Employees' />

                <Link route="/skill/index">
                    <a className="item">+</a>
                </Link>

                <Menu.Item active={ROUTES.employess === props.router.asPath}
                           onClick={props.logoutUser} >
                    Logout
                    <Icon name='user secret'></Icon>
                </Menu.Item>

            </Menu.Menu>
        </Menu>
    );
}


const mapStateToProps = (state) => {
    return {...state.router}
}

export default withRouter(connect(mapStateToProps, {skillCreate, logoutUser})(_header));

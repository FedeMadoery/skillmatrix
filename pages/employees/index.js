import React, {Component} from 'react';
import Layout from '../../components/commons/Layout';
import {Link} from '../../routes';
import withAuth from "../../components/utils/withAuth";
import {connect} from "react-redux";
import EmployeesData from "../../components/admin/EmployeesData";
import {Dimmer, Divider, Loader, Search, Segment, Menu, Label, Button, Grid} from "semantic-ui-react";
import _ from "lodash";
import {skillsFetch, userDataFetch} from "../../redux/actions";
import Cards from "../../components/dash/Cards";
import MenuItems from "../../components/dash/MenuItems";
import TechnologiesCards from "../../components/admin/TechnologiesCards";

class EmployeesIndex extends Component {

    state = {
        activeItem: 'JavaScript', // TODO Set the first one for default
        isLoading: false,
        value: '', // Value of the search Field
        selectedTechs: []
    };


    handleItemClick = (e, {name}) => {
        this.setState({activeItem: name})
    };

    componentDidMount() {
        this.props.userDataFetch();
        this.props.skillsFetch();
    }

    handleResultSelect = (e, {result}) => this.setState({activeItem: result.name, value: result.name});
    resetComponent = () => this.setState({isLoading: false, results: [], value: ''});
    handleSearchChange = (e, {value}) => {
        const {skills} = this.props;
        this.setState({isLoading: true, value});

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent();

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
            const isMatch = result => re.test(result.name);

            this.setState({
                isLoading: false,
                results: _.filter(skills, isMatch),
            })
        }, 300)
    };

    onSelectTech(techUID){
        this.setState((state, props) => {
            return {selectedTechs: [...state.selectedTechs, techUID ]};
        });
    }

    onRemoveTech(techUID) {
        const {selectedTechs} = this.state;
        let newSelectedTechs = [...selectedTechs];
        newSelectedTechs.splice(selectedTechs.findIndex( (uid) => uid === techUID), 1);

        this.setState({selectedTechs: newSelectedTechs});
    }

    searchEmployees() {
        const {selectedTechs} = this.state;

        console.log(selectedTechs)
    }

    render() {

        const {isLoading, results, value, activeItem, loading} = this.state;
        const resultRenderer = ({name}) => <Label content={name} color='blue' onClick={this.handleItemClick}/>;

        return (

            <Layout>
                <div>
                    <link
                        rel="stylesheet"
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                    />

                    <Menu attached='top' pointing secondary pagination>
                        <MenuItems
                            items={this.props.skills}
                            activeItem={activeItem}
                            handleItemClick={this.handleItemClick}
                        />
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Search
                                    loading={isLoading}
                                    onResultSelect={this.handleResultSelect}
                                    onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
                                    results={results}
                                    resultRenderer={resultRenderer}
                                    value={value}
                                />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>

                    <Segment attached='bottom' style={{marginLeft: 0}}>
                        <Dimmer active={this.props.loading}>
                            <Loader/>
                        </Dimmer>
                        {!this.props.loading &&
                        <TechnologiesCards
                            onSelectTech={(techUID) => this.onSelectTech(techUID)}
                            onRemoveTech={(techUId) => this.onRemoveTech(techUId)}
                            skillSelected={activeItem}/>
                        }
                    </Segment>
                    <Grid centered columns={2}>
                        <Grid.Column>
                            <Button fluid basic loading={loading} color='blue' onClick={() => this.searchEmployees()}>
                                Search Employees
                            </Button>
                        </Grid.Column>
                    </Grid>

                    <Divider/>
                    <EmployeesData/>

                </div>

            </Layout>
        );
    }
}


const mapStateToProps = state => {

    const skills = _.map(state.fireBase.skills, (val, uid) => {
        return {...val, key: uid, title: ''}; // {shift: 'Monday', name:'s', id:'1j2j34'};
    });

    return {
        ...state,
        skills,
        loading: !!state.fireBase.loading
    };
};


export default connect(mapStateToProps, {skillsFetch, userDataFetch})(withAuth(EmployeesIndex))
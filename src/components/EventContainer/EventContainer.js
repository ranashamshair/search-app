import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Event from '../Event/Event';
import store from "../../store";
import {getEvents} from "../../actions";
import {connect} from "react-redux";
import ArticleLoader from "../ArticleLoader/ArticleLoader";

class EventContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.props.getEvents();
    }


    loadMore(e) {
        const st = store.getState();

        st.eventsLoading = true;
        st.pageEvents +=1;

        store.dispatch( getEvents(st) );
    }

    render() {
        let events = [];

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                events.push(<ArticleLoader key={'event_' + i} />);
            }
        }

        if ( this.props.events.length )
        {
            events = this.props.events.map(item =>
                <Event
                    key={'event_' + item.id}
                    link={item.link}
                    title={(item.title) ? item.title.rendered : ''}
                    imgSrc={item.image_url}
                />
            );

        } else {
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    events = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        this.setState({loading: false});
                    }, 3000);
                }
            }
        }


        return (
            <div>
                <BlockHeader title="Events" />

                <div className="row row-spacing">
                    {events}
                </div>

                {
                    (this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMore}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        );
    }
    
}

function mapStateToProps(state) {
    return {
        events: (state.events && state.events.events) ? state.events.events : [],
        message: state.eventsMessage,
        page: state.pageEvents,
        loading: state.eventsLoading
    };
}

export default connect(
    mapStateToProps,
    { getEvents }
)(EventContainer);

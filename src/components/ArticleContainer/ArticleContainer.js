import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Article from '../Article/Article';
import store from "../../store";
import {loadMore} from "../../actions";
import {connect} from "react-redux";
import ArticleLoader from "../ArticleLoader/ArticleLoader";

class ArticleContainer extends Component {
    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            loading: true,
            page: 0,
            // for detecting changes !!!
            searchText: storeState.searchText || '',
            selectedCategories: storeState.selectedCategories || [],
            sorting: storeState.sorting || '',
        };
        this._isMounted = false;

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMore(e) {
        const storeState = store.getState();
        this.props.loadMore(storeState, storeState.currentTab);
    }

    render() {
        let news = [];

        let show = true;

        if ( this.props.isLoading ) {
            for (let i = 0; i < 4; i++) {
                news.push(<ArticleLoader key={'news_' + i} />);
            }
        }

        if ( this.props.news.length && !this.props.isLoading )
        {
            news = this.props.news.map((item, key)=>
                <Article
                    key={'article_' + key}
                    link={item.detailsUrl}
                    excerpt={item.excerpt}
                    articleTitle={item.title}
                    imgSrc={item.photo}
                />
            );

        } else {
            if ( !this.props.isLoading ) {
                if(this.props.message){
                    show = false;
                }else{
                }
            }
        }


        return show ? (
            <div>
                <BlockHeader title="Articles > Other" />

                <div className="row row-spacing">
                    {news}
                </div>

                {
                    (this.props.news.length && this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMore}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        ) : '';
    }

}

function mapStateToProps(state) {
    return {
        news: state.postsNew || [],
        message: state.message,
        page: state.page,
    };
}

export default connect(
    mapStateToProps,
    { loadMore }
)(ArticleContainer);
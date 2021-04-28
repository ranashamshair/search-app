import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Article from '../Article/Article';
import store from "../../store";
import {getOther, loadMore, setNextPage} from "../../actions";
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
        this.props.getOther(this.state);

        store.subscribe(() => {
            if (this._isMounted) {
                const storeState = store.getState();

                const {
                    searchText = '',
                    selectedCategories = [],
                    sorting = '',
                    page = 0,
                } = storeState;

                const difference = selectedCategories
                    .filter(x => !this.state.selectedCategories.includes(x))
                    .concat(this.state.selectedCategories.filter(x => !selectedCategories.includes(x)));

                const changes = {};
                if (searchText !== this.state.searchText) changes.searchText = searchText;
                if (difference.length > 0) changes.selectedCategories = selectedCategories;
                if (sorting !== this.state.sorting) changes.sorting = sorting;

                if (Object.keys(changes).length > 0) {
                    changes.loading = true;
                    this.setState(changes, () => this.props.getOther(Object.assign(storeState, changes)));
                } else if (page > 0 && page !== this.state.page) {
                    this.setState({page: page}, () => store.dispatch( loadMore(storeState, storeState.currentTab) ) );
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMore(e) {
        store.dispatch( setNextPage() );
    }

    render() {
        let news = [];

        let show = true;

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                news.push(<ArticleLoader key={'news_' + i} />);
            }
        }

        // let i = 0;
        // while (this.state.loading) {
        //     news.push(<ArticleLoader key={'news_' + i} />);
        //     ++i;
        // }

        if ( this.props.news.length )
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
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    // console.log('news:  ', news);
                    show = false;
                    // news = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        if (this._isMounted) this.setState({loading: false});
                    }, 3000);
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
        loading: state.loading
    };
}

export default connect(
    mapStateToProps,
    { getOther }
)(ArticleContainer);

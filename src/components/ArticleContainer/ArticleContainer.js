import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Article from '../Article/Article';
import store from "../../store";
import {getNews} from "../../actions";
import {connect} from "react-redux";
import ArticleLoader from "../ArticleLoader/ArticleLoader";

class ArticleContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.props.getNews();
    }


    loadMore(e) {
        const st = store.getState();

        st.newsLoading = true;
        st.pageNews +=1;

        store.dispatch( getNews(st) );
    }

    render() {
        let news = [];

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                news.push(<ArticleLoader key={'news_' + i} />);
            }
        }

        if ( this.props.news.length )
        {
            news = this.props.news.map(item =>
                <Article
                    key={'article_' + item.id}
                    link={item.link}
                    articleTitle={(item.title) ? item.title.rendered : ''}
                    imgSrc={item.image_url}
                />
            );

        } else {
            if ( !this.props.loading ) {
                setTimeout(() => {
                    this.setState({loading: false});
                }, 3000);
            }
        }


        return (
            <div>
                <BlockHeader title="Articles" />

                <div className="row row-spacing">
                    {news}
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
        news: (state.news && state.news.news) ? state.news.news : [],
        page: state.pageNews,
        loading: state.auctionsLoading
    };
}

export default connect(
    mapStateToProps,
    { getNews }
)(ArticleContainer);

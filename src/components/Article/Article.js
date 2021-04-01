import React from 'react';

import './Article.css';

function Article(props) {

    // TODO excerpt !!!
    
    return (
        <>
            
            <div className="col-12 col-md-6 col-lg-4 grid-item search-article-result anim-search-result">
                <aside className="favourite d-flex flex-1 mb-3 bg-white position-relative align-items-center">
                    {
                        (props.imgSrc) ? (
                            <figure>
                                <img src={props.imgSrc} alt="Event" width="150" height="150" />
                            </figure>
                        ) : ''
                    }
                    <div className="favourite-content p-3 flex-1">
                        <h3 className="font-weight-bold"><a href={props.link} className="link-overlay">{props.articleTitle}</a></h3>
                        {props.excerpt && <p>excerpt: {props.excerpt}</p>}
                    </div>
                </aside>
            </div>

        </>
    );
    
}

export default Article;

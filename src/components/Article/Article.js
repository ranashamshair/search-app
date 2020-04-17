import React from 'react';

import './Article.css';

function Article(props) {
    
    return (
        <>
            
            <div className="col-12 col-md-6 col-lg-4 grid-item search-article-result anim-search-result">
                <aside className="favourite d-flex flex-1 mb-3 bg-white position-relative align-items-center">
                    <figure>
                        <img src={props.imgSrc} alt="Article" width="150" height="150" />
                    </figure>
                    <div className="favourite-content p-3 flex-1">
                        <h3 className="font-weight-bold"><a href="#0" className="link-overlay">{props.articleTitle}</a></h3>
                    </div>
                </aside>
            </div>

        </>
    );
    
}

export default Article;
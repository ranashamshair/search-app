import React, {useEffect, useState} from 'react';

import './Article.css';
import FadeIn from "react-fade-in";

function Article(props) {

    // TODO excerpt !!!
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if ( window.innerWidth < 576 ) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

    return (
        <>
          <div className="col-12 col-md-6 col-lg-3 pb-4 search-auction-result anim-search-result lot-container">
            <FadeIn>
              <a href={props.link} target="_blank">
                <figure className="text-center imgContainer">
                  {
                    (props.imgSrc) ? (
                        <img src={props.imgSrc} alt="Text" className="mw-100" width="260" height="250" />
                      ) :
                      <div className="emptyPhoto">
                        {!isMobile ?
                          <img
                            src="https://johnmoran.invaluable.com/wp-content/themes/theme-johnmoran/dist/img/moran_grey.png"
                            alt="LOGO" className="mw-100" width="260"/> : ''}
                      </div>
                  }
                </figure>
              </a>
              <aside className="search-lot--content py-4 px-4 text-left">
                <a href={props.link} target="_blank">
                  <h3 className="font-weight-normal text-grey title">{props.articleTitle}</h3>
                </a>
                {props.excerpt !== '' && <p className='m-0'>Excerpt: {props.excerpt}</p>}
              </aside>
            </FadeIn>
          </div>
        </>
    );

}

export default Article;

// <div className="col-12 col-md-6 col-lg-4 grid-item search-article-result anim-search-result">
//   <aside className="favourite d-flex flex-1 mb-3 bg-white position-relative align-items-center">
//     {
//       (props.imgSrc) ? (
//         <figure>
//           <img src={props.imgSrc} alt="Event" width="150" height="150" />
//         </figure>
//       ) : ''
//     }
//     <div className="favourite-content p-3 flex-1">
//       <h3 className="font-weight-bold"><a href={props.link} className="link-overlay">{props.articleTitle}</a></h3>
//       {props.excerpt && <p>excerpt: {props.excerpt}</p>}
//     </div>
//   </aside>
// </div>

import React from 'react';
import './Auction.css';

function Auction(props) {
    
    return (
        <>
            
            <div className="col-12 col-lg-6 search-auction-result anim-search-result">
                <div className="widget-fluid mb-3 d-flex flex-column flex-md-row text-center justify-content-lg-center align-items-center w-100">
                    <div className="widget-fluid--body bg-white">
                        <span className="widget-fluid--body__tag text-uppercase">{props.location}</span>  
                        <h4 className="widget-fluid--body__headline">
                            <a href="#0" className="link-overlay font-weight-bold">{props.title}</a>
                        </h4>
                        <span className="widget-fluid--body__date">{props.date}</span>
                        <span className="widget-fluid--body__date d-block text-grey">{props.time}</span>
                    </div>
                    <div className="widget-fluid--image">
                        <figure>
                            <img src={props.imgSrc} alt="Prints &amp; Multiples" className="mw-100" width="260" height="300" />
                        </figure>
                    </div>
                </div>
            </div>

        </>
    );
    
} 

export default Auction;
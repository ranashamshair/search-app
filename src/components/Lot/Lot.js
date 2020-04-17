import React from 'react';
import FadeIn from 'react-fade-in';

function Lot(props) {

    return (
        <>
            <div className="col-12 col-md-6 col-lg-3">
                <FadeIn>
                    <figure className="text-center">
                        <img src={props.imgSrc} alt="Text" className="mw-100" width="260" height="250" />
                    </figure>
                    <aside className="search-lot--content py-3 px-2 text-center">
                        <span className="text-grey mb-1 d-block">Lot {props.lotNumber}</span>
                        <h3 className="font-weight-bold text-grey">{props.artist}</h3>
                        <p className="mb-1">{props.provenance}</p>
                        <p className="font-weight-bold text-grey">{props.estimate}</p>
                    </aside>   
                </FadeIn>
            </div>
        </>
    );
    
}

export default Lot;
import React from 'react';
import FadeIn from 'react-fade-in';

function Lot(props) {
    // console.log('lot props: ', props);
    const lot = props.lot;

    let img = !!lot.photos ? lot.photos[0]._links : null;
    let imgSrc = '';
    if(img){
        imgSrc = (img.thumbnail) ? img.thumbnail.href : (img.medium ? img.medium.href : (img.large ? img.large.href : ''));
    }
    let seller = lot.sellerView ? lot.sellerView.sellerName : '';

    let curr = lot.currencySymbol ? lot.currencySymbol : '$';
    let estimate = (lot.estimateLow === lot.estimateHigh) ? `Estimate: ${curr + lot.estimateLow}` : `Estimate: ${curr + lot.estimateLow} - ${curr + lot.estimateHigh}`;

    return (
        <>
            <div className="col-12 col-md-6 col-lg-3">
                <FadeIn>
                    <figure className="text-center">
                        <img src={imgSrc} alt="Text" className="mw-100" width="260" height="250" />
                    </figure>
                    <aside className="search-lot--content py-3 px-2 text-center">
                        <span className="text-grey mb-1 d-block">Lot {lot.lotNumber + ((props.isPast && lot.lotNumberExtension) ? ' - ' + lot.lotNumberExtension : '')}</span>
                        {/*<h3 className="font-weight-bold text-grey">{props.artist}</h3>*/}
                        <h3 className="font-weight-bold text-grey">{seller}</h3>
                        <p className="mb-1">{lot.title}</p>
                        <p className="font-weight-bold text-grey">{estimate}</p>
                        {
                            (props.isPast) ? (
                                <p className="font-weight-bold text-grey">Result price: {curr + lot.priceResult}</p>
                            ) : ''
                        }
                    </aside>
                </FadeIn>
            </div>
        </>
    );
    
}

export default Lot;

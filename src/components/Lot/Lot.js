import React, {useEffect, useState} from 'react';
import FadeIn from 'react-fade-in';
import './Lot.css';

function getDate(datetime) {
    const dateT = new Date(datetime);

    const darr = dateT.toDateString().split(' ');
    darr.shift();
    darr[1] = parseInt(darr[1]);
    switch (darr[1]) {
        case 1: darr[1] += 'st'; break;
        case 2: darr[1] += 'nd'; break;
        case 3: darr[1] += 'rd'; break;
        default: darr[1] += 'th';
    }

    return darr.join(' ');
}

function Lot(props) {
    const { ref, title, photo, saleTitle, currencySymbol, saleDate, estimate ,estimateLow,
        lotNumber, bid, lotNumberExtension, priceResult } = props.lot;


    let slug = title.replace(/ /g, "-");  // maybe need to change this place to api result
    let url = `/auction-lot/${slug}_${ref}`; // maybe need to change this place to api result

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if ( window.innerWidth < 576 ) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    let estimatePrice = (((estimateLow || estimate) && currencySymbol) || '') + ' ' + ((estimateLow && estimate && `${estimateLow} - ${estimate}`) || estimateLow || estimate || '');

    return (
        <>
            <div className="col-12 col-md-6 col-lg-3 pb-4">
                <FadeIn>
                    <a href={url} target="_blank">
                        <figure className="text-center imgContainer">
                            {
                                (photo) ? (
                                    <img src={photo} alt="Text" className="mw-100" width="260" height="250" />
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
                        <a href={url} target="_blank">
                            <h3 className="font-weight-bold text-grey">{title}</h3>
                            {saleTitle && <h4 className="my-3 subtitle"><u>{saleTitle}</u></h4>}
                        </a>
                        {estimatePrice !== '' && <p>Estimate: {estimatePrice}</p>}
                        {lotNumber && <p>Lot number: {lotNumber} {(props.isPast && lotNumberExtension) || ''}</p>}
                        {(bid && <p>Bid: {bid}</p>) || ''}
                        {(saleDate && <p>Sale date: {getDate(saleDate)}</p>) || ''}
                        {/*this add in past fields */}
                        {(props.isPast) && <p>Result price: {priceResult || 'Unsold'}</p>}
                    </aside>
                </FadeIn>
            </div>
        </>
    );

}

export default Lot;

// <FadeIn>
//     <a href={url} target="_blank">
//         <figure className="text-center imgContainer">
//             {
//                 (lot.photo) ? (
//                     <img src={lot.photo} alt="Text" className="mw-100" width="260" height="250" />
//                   ) :
//                   <img src="https://johnmoran.invaluable.com/wp-content/themes/theme-johnmoran/dist/img/moran_grey.png" alt="LOGO" className="mw-100" width="260" />
//             }
//         </figure>
//     </a>
//     <aside className="search-lot--content py-3 px-3 text-left">
//         <a href={url} target="_blank">
//             {/*<span className="text-grey mb-1 d-block">Lot {lot.lotNumber + ((props.isPast && lot.lotNumberExtension) ? ' - ' + lot.lotNumberExtension : '')}</span>*/}
//             {/*<h3 className="font-weight-bold text-grey">{props.artist}</h3>*/}
//             <h3 className="font-weight-bold text-grey">{lot.title}</h3>
//             <h4 className="mb-1">{lot.saleTitle}</h4>
//         </a>
//         <p className="font-weight-bold text-grey">{estimate}</p>
//         {
//             (props.isPast) ? (
//               <p className="font-weight-bold text-grey">Result price: {curr + lot.priceResult}</p>
//             ) : ''
//         }
//     </aside>
// </FadeIn>

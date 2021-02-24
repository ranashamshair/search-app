import React, {useEffect, useState} from 'react';
import FadeIn from 'react-fade-in';
import './Lot.css';

function Lot(props) {
    // console.log('lot props: ', props);
    const { ref, title, photo, saleTitle, currencySymbol, saleDate, estimateHigh ,estimateLow,
        lotNumber, bid, lotNumberExtension, priceResult, location, date, except, detailsUrl } = props.lot;

    // let seller = lot ? lot.sellerName : '';  maybe need to change this place to api result

    // let curr = lot.currencySymbol ? lot.currencySymbol : '$';
    // let estimate = (lot.estimateLow === lot.estimate) ? `Estimate: ${curr + lot.estimateLow}` : `Estimate: ${curr + lot.estimateLow} - ${curr + lot.estimate}`;

    let slug = title.replace(/ /g, "-");  // maybe need to change this place to api result
    let url = `/auction-lot/${slug}_${ref}`; // maybe need to change this place to api result
    // console.log(url);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if ( window.innerWidth < 576 ) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [])
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
                        {currencySymbol && <p>currencySymbol: {currencySymbol}</p>}
                        {estimateHigh && <p>estimateHigh: {estimateHigh}</p>}
                        {estimateLow && <p>estimateLow: {estimateLow}</p>}
                        {lotNumber && <p>lotNumber: {lotNumber}</p>}
                        {bid && <p>bid: {bid}</p>}
                        {ref && <p>ref: {ref}</p>}
                        {saleDate && <p>saleDate: {saleDate}</p>}
                        {/*this add in past fields */}
                        {lotNumberExtension && <p>lotNumberExtension: {lotNumberExtension}</p>}
                        {priceResult && <p>priceResult: {priceResult}</p>} {/*priceResult is number*/}
                        {/*this add in auctions fields */}
                        {date && <p>date: {date}</p>}
                        {location &&
                            <>
                                {location.city && <p>city: {location.city}</p>}
                                {location.state && <p>state: {location.state}</p>}
                                {location.country && <p>country: {location.country}</p>}
                            </>
                        }
                        {/*this add in other fields */}
                        {except && <p>except: {except}</p>}
                        {detailsUrl && <p>detailsUrl: {detailsUrl}</p>}
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

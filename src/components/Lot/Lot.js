import React, {useEffect, useState} from 'react';
import FadeIn from 'react-fade-in';
import './Lot.css';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDate(datetime) {
    const dateT = new Date(datetime);

    return `${days[dateT.getDay()]}, ${months[dateT.getMonth()]} ${dateT.getDate()}, ${dateT.getFullYear()}`;
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
            <div className="col-12 col-md-6 col-lg-3 pb-4 lot-container">
                <FadeIn>
                    <a href={url} target="_blank" rel="noopener noreferrer">
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
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <h3 className="font-weight-normal text-grey title" dangerouslySetInnerHTML={{__html: title}} />
                            {saleTitle && <h4 className="my-3 font-weight-normal subtitle"><u dangerouslySetInnerHTML={{__html: saleTitle}} /></h4>}
                        </a>
                        {estimatePrice !== '' && <p className='m-0'>Estimate: {estimatePrice}</p>}
                        {lotNumber && <p className='m-0'>Lot number: {lotNumber} {(props.isPast && lotNumberExtension) || ''}</p>}
                        {(bid && <p className='m-0'>Bid: {bid}</p>) || ''}
                        {(saleDate && <p className='m-0'>Sale date: {getDate(saleDate)}</p>) || ''}
                        {/*this add in past fields */}
                        {(props.isPast) && <p className='m-0'>Result price: {(priceResult && ((currencySymbol || '') + ' ' + priceResult)) || 'Unsold'}</p>}
                    </aside>
                </FadeIn>
            </div>
        </>
    );

}

export default Lot;

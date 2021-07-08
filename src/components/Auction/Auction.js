import React, {useEffect, useState} from 'react';
import './Auction.css';
import FadeIn from "react-fade-in";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDate(datetime) {
    return `${days[datetime.getDay()]}, ${months[datetime.getMonth()]} ${datetime.getDate()}, ${datetime.getFullYear()}`;
}


function Auction(props) {
    const dateT = new Date(props.datetime * 1000);

    let date = getDate(dateT);
    let time = dateT.toLocaleTimeString('en-US');

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if ( window.innerWidth < 576 ) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    const addr = props.location;
    let addrShow = addr.city + (addr.state ? ', ' + addr.state : '');

    // <div className="col-12 col-lg-6 search-auction-result anim-search-result">
    return (
        <>
            <div className="col-12 col-md-6 col-lg-3 pb-4 search-auction-result anim-search-result lot-container">
                <FadeIn>
                    <a href={props.link} target="_blank" rel="noopener noreferrer">
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
                        <a href={props.link} target="_blank" rel="noopener noreferrer">
                            <h3 className="font-weight-normal text-grey title" dangerouslySetInnerHTML={{__html: props.title}} />
                            {props.title && <h4 className="my-3 font-weight-normal subtitle"><u dangerouslySetInnerHTML={{__html: addrShow}} /></h4>}
                        </a>
                        {date !== '' && <p className='m-0'>{date}</p>}
                        {time !== '' && <p className='m-0'>{time}</p>}
                    </aside>
                </FadeIn>
            </div>

        </>
    );

}

export default Auction;


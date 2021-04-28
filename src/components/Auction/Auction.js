import React, {useEffect, useState} from 'react';
import './Auction.css';
import FadeIn from "react-fade-in";

// const months = {
//     1: 'Jan',
//     2: 'Feb',
//     3: 'Mar',
//     4: 'Apr',
//     5: 'May',
//     6: 'Jun',
//     7: 'Jul',
//     8: 'Aug',
//     8: 'Sep',
//     8: 'Oct',
//     8: 'Nov',
//     8: 'Dec',
// }

function getDate(datetime) {
    const darr = datetime.toDateString().split(' ');
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
                            <h3 className="font-weight-normal text-grey title">{addrShow}</h3>
                            {props.title && <h4 className="my-3 font-weight-normal subtitle"><u>{props.title}</u></h4>}
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


    //     <div className="widget-fluid mb-3 d-flex flex-column flex-md-row text-center justify-content-lg-center align-items-center w-100">
    //         <div className="widget-fluid--body bg-white">
    //             <span className="widget-fluid--body__tag text-uppercase">{addrShow}</span>
    //             <h4 className="widget-fluid--body__headline">
    //                 <a href={props.link} target="_blank" className="link-overlay font-weight-bold">{props.title}</a>
    //             </h4>
    //             <span className="widget-fluid--body__date">{date}</span>
    //             <span className="widget-fluid--body__date d-block text-grey">{time}</span>
    //         </div>
    //         {
    //             (props.imgSrc) ? (
    //                 <div className="widget-fluid--image">
    //                     <a href={props.link} target="_blank">
    //                         <figure>
    //                             <img src={props.imgSrc} alt="Prints &amp; Multiples" className="mw-100" width="260" height="300" />
    //                         </figure>
    //           </a>
    //         </div>
    //       ) : ''
    //     }
    //   </div>
    // </div>

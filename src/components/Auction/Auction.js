import React from 'react';
import './Auction.css';

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
    switch (darr[1]) {
        case '1': darr[1] += 'st'; break;
        case '2': darr[1] += 'nd'; break;
        case '3': darr[1] += 'rd'; break;
        default: darr[1] += 'st';
    }

    return darr.join(' ');
}


function Auction(props) {
    const dateT = new Date(props.datetime * 1000);

    let date = getDate(dateT);
    let time = dateT.toLocaleTimeString('en-US');

    const addr = props.location;
    let addrShow = addr.city + (addr.state ? ', ' + addr.state : '');

    let slug = props.title.replace(/ /g, "-");
    let url = `/auction-catalog/${slug}_${props.auctionId}`;
    // console.log(url);

    return (
        <>
            
            <div className="col-12 col-lg-6 search-auction-result anim-search-result">
                <div className="widget-fluid mb-3 d-flex flex-column flex-md-row text-center justify-content-lg-center align-items-center w-100">
                    <div className="widget-fluid--body bg-white">
                        <span className="widget-fluid--body__tag text-uppercase">{addrShow}</span>
                        <h4 className="widget-fluid--body__headline">
                            <a href={props.url} target="_blank" className="link-overlay font-weight-bold">{props.title}</a>
                        </h4>
                        <span className="widget-fluid--body__date">{date}</span>
                        <span className="widget-fluid--body__date d-block text-grey">{time}</span>
                    </div>
                    {
                        (props.imgSrc) ? (
                            <div className="widget-fluid--image">
                                <a href={props.url} target="_blank">
                                    <figure>
                                        <img src={props.imgSrc} alt="Prints &amp; Multiples" className="mw-100" width="260" height="300" />
                                    </figure>
                                </a>
                            </div>
                        ) : ''
                    }
                </div>
            </div>

        </>
    );
    
} 

export default Auction;

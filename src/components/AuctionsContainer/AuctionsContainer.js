import React from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Auction from '../Auction/Auction';

function AuctionsContainer() {
    
    const testAuctionData = [
        {   
            id: 1,
            location: "Monrovia, CA, US",
            title: "Traditional Collector",
            date: 'Feb 15th 2020',
            time: "10:00am PST",
            imgSrc: 'http://hksndev2.co.uk/decoupled/search/dist/img/lot_4.jpg'
        },
        {
            id: 2,
            location: "Monrovia, CA, US",
            title: "Prints & Multiples",
            date: 'Mar 19th 2020',
            time: "10:00am PST",
            imgSrc: 'http://hksndev2.co.uk/decoupled/search/dist/img/lot_9.jpg'
        },
        {
            id: 3,
            location: "Monrovia, CA, US",
            title: "Studio Jewelry & Timepieces",
            date: 'Mar 10th 2020',
            time: "10:00am PST",
            imgSrc: 'http://hksndev2.co.uk/decoupled/search/dist/img/lot_6.jpg'
        },
        {
            id: 4,
            location: "Monrovia, CA, US",
            title: "Studio Fine Art",
            date: "Jan 26th 2020",
            time: "10:00am PST",
            imgSrc: 'http://hksndev2.co.uk/decoupled/search/dist/img/lot_2.jpg'
        }
    ]

    return (
        <div>
            <BlockHeader title="Auctions" />

            <div className="row row-spacing">
                {testAuctionData.map(item => 
                    <Auction 
                        key={item.id}
                        location={item.location}
                        title={item.title}
                        date={item.date}
                        time={item.time}
                        imgSrc={item.imgSrc}
                    />
                )}
            </div>

        </div>
    );
    
}

export default AuctionsContainer;
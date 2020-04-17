import React from 'react';

function BlockHeader(props) {

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <header className="mb-2">
                        <h2 className="subheading text-uppercase">{ props.title }</h2>
                    </header>
                </div>
            </div>
        </>
    );

}

export default BlockHeader;
import React from 'react';
import './DotLoader.scss';

const DotLoader = (props) => {
    const { externalClassName } = props;
    return (
        <div className={externalClassName ? `${externalClassName} dot-loader` : "dot-loader"}>
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    );
};

export default DotLoader;

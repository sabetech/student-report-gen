import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
    return (
        <div className={clsx('bg-white overflow-hidden shadow rounded-lg', className)} {...props}>
            <div className="px-4 py-5 sm:p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;

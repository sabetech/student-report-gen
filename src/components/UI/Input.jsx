import React from 'react';
import clsx from 'clsx';

const Input = ({ label, className, error, ...props }) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={clsx(
                    "block w-full rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500",
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300",
                    props.disabled && "bg-slate-50 text-slate-500"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;

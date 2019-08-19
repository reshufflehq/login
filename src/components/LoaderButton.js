import React from "react";

export default ({
    isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
}) =>
    <button
        className={`btn ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
        {!isLoading ? text : loadingText}
    </button>;


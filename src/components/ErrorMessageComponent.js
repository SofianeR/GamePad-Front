import React from "react";

const ErrorMessageComponent = ({ message, size }) => {
  return (
    <div>
      <h4
        style={{
          color: "red",
          fontSize: size,
          fontWeight: "bold",
          textAlign: "center",
        }}>
        {message}
      </h4>
    </div>
  );
};

export default ErrorMessageComponent;

import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Icon = ({ name, size = "1rem", color }) => {
  return (
    <i className={`bi bi-${name}`} style={{ fontSize: size, color: color }}></i>
  );
};

export default Icon;

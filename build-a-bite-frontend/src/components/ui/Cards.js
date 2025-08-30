import React from "react";

function Card({ children, className }) {
  return (
    <div className={`bg-white shadow-md rounded-xl p-6 ${className || ""}`}>
      {children}
    </div>
  );
}

 function CardHeader({ children, className }) {
  return (
    <div className={`border-b pb-3 mb-4 ${className || ""}`}>{children}</div>
  );
}

function CardTitle({ children, className }) {
  return <h2 className={`text-xl font-semibold ${className || ""}`}>{children}</h2>;
}

function CardContent({ children, className }) {
  return <div className={className || ""}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardContent };
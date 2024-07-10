import React, { useEffect } from "react";
import serviceData from "../../package.json";

export const AppProvider = ({ children }) => {
    useEffect(() => {
        const title = document.createElement("title");
        title.innerText = serviceData.name;
        document.head.appendChild(title);

        return () => {
            document.head.removeChild(title);
        };
    }, []);

    return <div className="bg-white dark:bg-slate-900 text-white">{children}</div>;
}

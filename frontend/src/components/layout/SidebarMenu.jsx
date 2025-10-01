import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function SidebarMenu({menuItem}) {
  

  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("");

  useEffect(() => {
    if (location.pathname) {
      setActiveMenuItem(location.pathname);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (url) => {
    setActiveMenuItem(url);
  };

  return (
    <div className="list-group mt-5 pl-4">
      {menuItem.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          className={`fw-bold list-group-item list-group-item-action ${activeMenuItem?.includes(item.url) ? "active" : ""}`}
          onClick={() => handleMenuItemClick(item.url)}
          aria-current={activeMenuItem?.includes(item.url) ? "true" : "false"}
        >
          <i className={`${item.icon} fa-fw pe-2`}></i> {item.name}
        </Link>
      ))}
    </div>
  );
}

export default SidebarMenu;

import SidebarMenu from "./SidebarMenu";

function UserLayout({ children }) {
    const menuItem = [
        { name: "Profile", url: "/me/profile", icon: "fas fa-user" },
        { name: "UpdateProfile", url: "/me/update_profile", icon: "fas fa-user" },
        { name: "Upload Avatar", url: "/me/upload_avatar", icon: "fas fa-circle" },
        { name: "Update Password", url: "/me/update_password", icon: "fas fa-lock" }
      ];
    return (
        <div>
            <div className='mt-2 mb-4 py-4'>
                <h2 className='text-center fw-bolder'>User Setting</h2>
            </div>

            <div className='container'>
                <div className='row justify-content-around'>
                    <div className='col-12 col-lg-3'>
                        <div>
    <SidebarMenu menuItem={menuItem} />
  </div>
                    </div>
                    <div className='col-12 col-lg-8 user-dashboard'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserLayout;
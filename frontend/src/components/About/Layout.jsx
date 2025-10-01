import { Outlet, Link } from "react-router-dom";


const Layout = () => {
    return (
        <>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{ background: "#232f3e", color: "#fff", padding: "40px 20px", marginTop: "40px" }}>
                <div style={{ maxWidth: "1200px", margin: "auto", display: "flex", flexWrap: "wrap", gap: "40px" }}>
                    {/* About */}
                    <div>
                        <h4 style={{ marginBottom: "15px" }}>About Us</h4>
                        <p style={{ maxWidth: "250px", lineHeight: "1.6", fontSize: "14px" }}>
                            We are committed to providing high-quality products, secure payments, and excellent service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ marginBottom: "15px" }}>Quick Links</h4>
                        <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
                            <li><Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>About</Link></li>
                            <li><Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</Link></li>

                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ marginBottom: "15px" }}>Contact</h4>
                        <p style={{ fontSize: "14px" }}>📞 +251 991394574</p>
                        <p style={{ fontSize: "14px" }}>📞 +251 920758825</p>
                        <p style={{ fontSize: "14px" }}>📧 edensolomon555@gmail.com</p>
                        <p style={{ fontSize: "14px" }}>📧 beteltarekegn4@gmail.com</p>
                    </div>
                </div>
                <p style={{ textAlign: "center", marginTop: "30px", fontSize: "12px" }}>
                    &copy; {new Date().getFullYear()} Utopia. All rights reserved.
                </p>
            </footer>
        </>
    );
};

export default Layout;

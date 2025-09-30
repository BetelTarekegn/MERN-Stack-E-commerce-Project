import { FaUsers, FaHeadset, FaBriefcase, FaDollarSign, FaPhone, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./InfoSections.css";
import Layout from "./Layout";

const InfoSections = () => {
  return (
   
    <section style={{ background: "#f9f6f4", padding: "60px 20px", fontFamily: "Arial, sans-serif" }}>
      
      {/* About Us */}
      <div style={{ maxWidth: "900px", margin: "auto", textAlign: "center", marginBottom: "70px" }}>
        <FaUsers style={{ fontSize: "40px", color: "#232f3e", marginBottom: "15px" }} />
        <h2 style={{ fontSize: "28px", color: "#3a2a20", marginBottom: "20px" }}>About Us</h2>
        <p style={{ fontSize: "16px", color: "#444", lineHeight: 1.6, marginBottom: "25px" }}>
          Discover our story and values...
        </p>
        <Link to="/about" className="cta-btn">Learn More</Link>
      </div>

      {/* Contact Us */}
      <div style={{ maxWidth: "900px", margin: "auto", textAlign: "center", marginBottom: "70px" }}>
        <FaHeadset style={{ fontSize: "40px", color: "#232f3e", marginBottom: "15px" }} />
        <h2 style={{ fontSize: "28px", color: "#3a2a20", marginBottom: "20px" }}>Contact Us</h2>
        <p style={{ fontSize: "16px", color: "#444", lineHeight: 1.6, marginBottom: "25px" }}>
          Have questions or need assistance?...
        </p>
        <Link to="/contact" className="cta-btn">Get in Touch</Link>

        <div className="contact-info">
          <p><FaPhone /> +251 991394594</p>
          <p><FaEnvelope /> edensolomon555@gmail.com</p>
             <p><FaPhone /> +251 920758825</p>
          <p><FaEnvelope /> beteltarekegn4@gmail.com</p>
        </div>
        
      </div>
      

      
      

    </section>
    
  );
};

export default InfoSections;

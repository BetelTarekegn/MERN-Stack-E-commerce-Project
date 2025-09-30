const SellPage = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#232f3e" }}>Make Money with Us</h1>
      <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.8", marginTop: "15px" }}>
        Partner with us to grow your business. Whether you are a small
        entrepreneur or a large brand, our platform provides the tools,
        visibility, and support you need to succeed.
      </p>
      <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.8", marginTop: "15px" }}>
        You can sell products, advertise, or join our affiliate program.
        Start your journey with us and reach millions of customers worldwide.
      </p>
      <a
        href="/register-seller"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 25px",
          background: "#232f3e",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Become a Seller
      </a>
    </div>
  );
};

export default SellPage;

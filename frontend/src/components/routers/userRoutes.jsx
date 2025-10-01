import { Route } from "react-router-dom";
import Login from '../auth/Login.jsx';
import Home from '../Home.jsx';
import ProductDetails from '../product/ProductDetails.jsx';
import Register from '../auth/Register.jsx';
import Profile from '../user/Profile.jsx';
import UpdateProfile from '../user/UpdateProfile.jsx';
import UploadAvater from '../user/UploadAvater.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';
import UpdatePassword from '../user/UpdatePassword.jsx';
import ForgotPassword from '../auth/ForgotPassword.jsx';
import ResetPassword from '../auth/ResetPassword.jsx';
import Cart from '../cart/Cart.jsx';
import Shipping from '../cart/Shipping.jsx';
import ConfirmOrder from '../cart/ConfirmOrder.jsx';
import Payment from '../Payment/Payment.jsx';
import PaymentSuccess from "../Payment/PaymentSuccess.jsx";
import VerifyPayment from "../Payment/VerifyPayment.jsx";
import PaymentReceipt from '../Payment/PaymentReceipt';
import MyOrder from "../order/MyOrder.jsx";
import AboutPage from "../About/AboutPage";
import ContactPage from "../About/ContactPage";
import ChatBotPage from "../Chatbot/ChatbotPage.jsx";




function UserRoutes() {
  return (<>
    <Route path="/" element={<Home />} />
    <Route path="/chatbot" element={<ChatBotPage />} />

    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/password/forgot" element={<ForgotPassword />} />
    <Route path="/password/reset/:token" element={<ResetPassword />} />
  
        {/* Layout wraps all pages */}
       
          
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          
        
      
    

    <Route path="/me/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />

    <Route path="/me/update_profile" element={
      <ProtectedRoute>
        <UpdateProfile />
      </ProtectedRoute>
    } />

    <Route path="/me/upload_avatar" element={
      <ProtectedRoute>
        <UploadAvater />
      </ProtectedRoute>
    } />
    <Route path="/me/update_password" element={
      <ProtectedRoute>
        <UpdatePassword />
      </ProtectedRoute>
    } />
    <Route path="/cart" element={<Cart />} />
    <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
    <Route path="/confirm_order" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
    <Route path="/payment" element={<Payment />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
    <Route path="/verify-payment/:tx_ref" element={<VerifyPayment />} />
    <Route path="/me/orders" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
    <Route path="/payment-receipt" element={<PaymentReceipt />} />
  </>)
}
export default UserRoutes;
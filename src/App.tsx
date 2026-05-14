import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { toastMessage: cartToast, showToast: showCartToast } = useCart();
  const { toastMessage: authToast, showToast: showAuthToast } = useAuth();

  const toastMessage = cartToast || authToast;
  const clearToast = () => {
    if (cartToast) showCartToast('');
    if (authToast) showAuthToast('');
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      {toastMessage && <Toast message={toastMessage} onClose={clearToast} />}
    </div>
  );
}

export default App;

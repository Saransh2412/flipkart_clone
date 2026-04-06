import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifySession } from '../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle } from 'react-icons/fi';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  const verifyingRef = useRef(false);

  useEffect(() => {
    if (verifyingRef.current) return;

    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    if (!sessionId) {
      setError('Invalid session ID');
      setVerifying(false);
      return;
    }

    verifyingRef.current = true;
    verifySession(sessionId)
      .then((res) => {
        toast.success(res.data.message || 'Order placed successfully!');
        // Redirect to orders page after a brief delay to show success message
        setTimeout(() => navigate('/orders'), 2000);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to verify payment');
        setVerifying(false);
      });
  }, [location, navigate]);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px', padding: '40px' }}>
      {verifying ? (
        <div>
          <h2>Processing your payment...</h2>
          <p>Please wait, verifying your transaction.</p>
        </div>
      ) : error ? (
        <div>
          <h2 style={{ color: 'red' }}>Payment Verification Failed</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/cart')} className="btn-primary" style={{ marginTop: '20px' }}>Return to Cart</button>
        </div>
      ) : (
        <div className="fade-in">
          <FiCheckCircle size={64} color="var(--primary-color)" />
          <h2 style={{ marginTop: '20px' }}>Payment Successful!</h2>
          <p>Your order is being processed and you will be redirected shortly.</p>
        </div>
      )}
    </div>
  );
}

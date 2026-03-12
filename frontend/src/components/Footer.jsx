import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-col">
          <h4>ABOUT</h4>
          <ul>
            <li><Link to="#">Contact Us</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">Press</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>HELP</h4>
          <ul>
            <li><Link to="#">Payments</Link></li>
            <li><Link to="#">Shipping</Link></li>
            <li><Link to="#">Cancellation & Returns</Link></li>
            <li><Link to="#">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>CONSUMER POLICY</h4>
          <ul>
            <li><Link to="#">Return Policy</Link></li>
            <li><Link to="#">Terms Of Use</Link></li>
            <li><Link to="#">Security</Link></li>
            <li><Link to="#">Privacy</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>MAIL US</h4>
          <p className="footer-text">
            Flipkart Clone Pvt Ltd.,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Bangalore, 560103
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 Flipkart Clone. All rights reserved.</span>
          <span>Made with ❤️ for learning purposes</span>
        </div>
      </div>
    </footer>
  );
}

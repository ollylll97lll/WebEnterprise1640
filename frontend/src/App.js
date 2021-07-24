import logo from './logo.svg';
import './App.css';
import GuestNav from './components/Navbar/GuestNav';
import Footer from './components/Footer';
import LoginPage from './pages/Login';
import Timer from './components/Timer';

function App() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <GuestNav />
        <br />
        <div className="col-12">
          <Timer />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

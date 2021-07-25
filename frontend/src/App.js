import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Error from './components/Error';
import RedirectPage from './components/Redirect';
import AdminPage from './pages/Admin';
import CoordinatorPage from './pages/Coordinator';
import HomePage from './pages/Home';
import ChangePassword from './pages/Home/ChangePass';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/Login/ForgotPass';
import ManagerPage from './pages/Manager';
import StudentPage from './pages/Student';
import ViewDetails from './pages/ViewDetails';

function App() {
  return (
    <Switch initial='/'>
      <Route path='/' exact component={LoginPage} />
      <Route path='/forgot' component={ForgotPassword} />
      <Route path='/home' component={HomePage} />
      <Route path='/changepass' component={ChangePassword} />
      <Route path='/admindashboard' component={AdminPage} />
      <Route path='/manager' component={ManagerPage} />
      <Route path='/coordinator' component={CoordinatorPage} />
      <Route path='/student' component={StudentPage} />
      <Route path='/viewdetails' component={ViewDetails} />
      <Route path='/error' component={Error} />
      <Route path='/redirect' component={RedirectPage} />
    </Switch >
  );
}

export default App;

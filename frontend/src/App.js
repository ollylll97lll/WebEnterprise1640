import { Route, Switch } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/ConfigRoutes/PrivateRoutes';
import RedirectPage from './components/Redirect';
import AdminPage from './pages/Admin';
import CoordinatorPage from './pages/Coordinator';
import HomePage from './pages/Home';
import ChangePassword from './pages/Home/ChangePass';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/Login/ForgotPass';
import ManagerPage from './pages/Manager';
import PostDetails from './pages/PostDetail';
import StaffPage from './pages/Staff';
import ViewDetails from './pages/ViewDetails';

function App() {
  return (
    <Switch initial='/'>
      <Route path='/7265646972656374746f6c6f676f7574' exact component={RedirectPage} />
      <Route path='/' exact component={LoginPage} />
      <Route path='/forgot' component={ForgotPassword} />
      <Route path='/recoverpass' component={ChangePassword} />

      <PrivateRoute path='/home' component={HomePage} />

      <PrivateRoute path='/admindashboard' component={AdminPage} />
      <PrivateRoute path='/manager' component={ManagerPage} />
      <PrivateRoute path='/coordinator' component={CoordinatorPage} />
      <PrivateRoute path='/staff' component={StaffPage} />
      <PrivateRoute path='/viewdetails' component={ViewDetails} />
      <PrivateRoute path='/postdetails' component={PostDetails} />


      <Route path='/redirect' component={RedirectPage} />

    </Switch >
  );
}

export default App;

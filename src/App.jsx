import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './utils/hooks/user.auth.js';
import { refreshUser } from './redux/auth/auth.operations.js';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader/Loader.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import './App.css';
import Home from './components/Home/Home.jsx';
import CurrencyTable from './components/CurrencyTable/CurrencyTable.jsx';
import Chart from './components/Chart/Chart.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  const { isRefreshing } = useAuth();

  return isRefreshing ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          exact
          path={`/dashboard`}
          element={<PrivateRoute component={<Dashboard />} redirect={'/'} />}
        >
          <Route index element={<Home />} />
          <Route path={'home'} element={<Home />} />
          <Route path={'diagram'} element={<Chart />} />
          <Route path={'statistics'} element={<CurrencyTable />} />{' '}
        </Route>
        <Route exact path={`/`} element={<PublicRoute component={<Dashboard />} />} />
        <Route exact path={`/login`} element={<PublicRoute component={<Login />} />} />
        <Route exact path={`/register`} element={<PublicRoute component={<Register />} />} />
        <Route
          path={`/users/verify/:verificationToken`}
          element={<PublicRoute component={<VerifyEmail />} />}
        />
        <Route path="*" element={<PublicRoute component={<NotFound />} />} />
      </Routes>
    </Suspense>
  );
};

export default App;

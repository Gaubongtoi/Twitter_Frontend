import DefaultLayout from '../components/Layouts/DefaultLayout';
import SinginSignup from '../components/Layouts/SinginSignup';
import Home from '../pages/Home';
import MeProfile from '../pages/MeProfile';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import UserProfile from '../pages/UserProfile';

const publicRoutes = [
    { path: '/signin', component: Signin, layout: SinginSignup },
    { path: '/signup', component: Signup, layout: SinginSignup },
];
const privateRoutes = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/api/user/profile', component: UserProfile, layout: DefaultLayout },
    { path: '/api/user/me', component: MeProfile, layout: DefaultLayout },
];

export { publicRoutes, privateRoutes };

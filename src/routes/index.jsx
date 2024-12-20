import DefaultLayout from '../components/Layouts/DefaultLayout';
import MessageLayout from '../components/Layouts/MessageLayout';
import SinginSignup from '../components/Layouts/SinginSignup';
import ExploreLayout from '../components/Layouts/ExploreLayout';

import BookmarkView from '../pages/BookmarkView';
import Home from '../pages/Home';
import MeProfile from '../pages/MeProfile';
import Message from '../pages/Message';
import NotificationView from '../pages/NotificationView';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import TweetView from '../pages/TweetView';
import UserProfile from '../pages/UserProfile';
import ExploreView from '../pages/ExploreView';

const publicRoutes = [
    { path: '/signin', component: Signin, layout: SinginSignup },
    { path: '/signup', component: Signup, layout: SinginSignup },
];
const privateRoutes = [
    { path: '/', component: Home, layout: DefaultLayout },
    // Profile
    { path: '/api/user/profile', component: UserProfile, layout: DefaultLayout },
    // Profile (Me)
    { path: '/api/user/me', component: MeProfile, layout: DefaultLayout },
    // Tweet Routes
    { path: '/api/tweets/:tweet_id', component: TweetView, layout: DefaultLayout },
    // Bookmark
    { path: '/api/bookmarks', component: BookmarkView, layout: DefaultLayout },
    // Message
    { path: '/api/message', component: Message, layout: MessageLayout },
    // Notifications
    { path: '/api/notifications', component: NotificationView, layout: DefaultLayout },
    // Explore
    { path: '/api/explore', component: ExploreView, layout: ExploreLayout },
];

export { publicRoutes, privateRoutes };

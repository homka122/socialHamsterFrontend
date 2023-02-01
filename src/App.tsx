import Conversations from './Pages/Conversations/Conversations';
import Conversation from './Pages/Conversation/Conversation';
import Layout from './Pages/Layout/Layout';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import UserPage from './Pages/AboutMe/UserPage';
import Feed from './Pages/Feed/Feed';
import LoginForm from './Pages/LoginForm/LoginForm';
import { Friends } from './Pages/Friends/Friends';
import { FriendList } from './Pages/FriendList/FriendList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to={'/conversations'} /> },
      { path: '/conversations', element: <Conversations /> },
      { path: '/conversations/:id', element: <Conversation /> },
      { path: '/me', element: <UserPage me={true} /> },
      { path: '/users/:id', element: <UserPage /> },
      { path: '/feed', element: <Feed /> },
      { path: '/friends', element: <Friends /> },
      { path: '/friends/:id', element: <FriendList /> },
    ],
  },
  { path: '/auth', element: <LoginForm /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

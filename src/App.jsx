import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';
import ModalLoginNoti from './components/Modal/ModalLoginNoti';
import ModalEdit from './components/Modal/ModalEdit';
import useEditModal from './hooks/modal/useEditModal';
import useLoginNoti from './hooks/modal/useLoginNoti';
import useQuote from './hooks/modal/useQuote';
import ModalQuote from './components/Modal/ModalQuote';
import useTweetModal from './hooks/modal/useTweetModal';
import ModalTweet from './components/Modal/ModalTweet';
import useAddMessage from './hooks/modal/useAddMessage';
import ModalAddMessage from './components/Modal/ModalAddMessage';
function App() {
    const editModal = useEditModal();
    const loginModal = useLoginNoti();
    const quoteModal = useQuote();
    const tweetModal = useTweetModal();
    const addMessageModal = useAddMessage();

    return (
        <>
            <div>
                <Router>
                    {loginModal.isOpen && <ModalLoginNoti />}
                    {editModal.isOpen && <ModalEdit />}
                    {quoteModal.isOpen && <ModalQuote />}
                    {tweetModal.isOpen && <ModalTweet />}
                    {addMessageModal.isOpen && <ModalAddMessage />}

                    <Routes>
                        {publicRoutes.map((route, index) => {
                            let Layout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null || route.layout === undefined) {
                                Layout = Fragment;
                            }
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            {/* Children Content */}
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                        {privateRoutes.map((route, index) => {
                            let Layout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null || route.layout === undefined) {
                                Layout = Fragment;
                            }
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            {/* Children Content */}
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default App;

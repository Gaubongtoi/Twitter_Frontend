import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';
import ModalLoginNoti from './components/Modal/ModalLoginNoti';
import ModalEdit from './components/Modal/ModalEdit';
import useEditModal from './hooks/modal/useEditModal';
import useLoginNoti from './hooks/modal/useLoginNoti';
import ModalRetweet from './components/Modal/ModalRetweet';
import useRetweet from './hooks/modal/useRetweet';
function App() {
    const editModal = useEditModal();
    const loginModal = useLoginNoti();
    const retweetModal = useRetweet();

    return (
        <>
            <div>
                <Router>
                    {loginModal.isOpen && <ModalLoginNoti />}
                    {editModal.isOpen && <ModalEdit />}
                    {retweetModal.isOpen && <ModalRetweet />}

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

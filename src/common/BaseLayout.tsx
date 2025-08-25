import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAuth } from '../hooks/use-auth';
import { UserAPIProvider } from '../backend/Provider';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AuthCheck from './AuthCheck';
import Loader, { useLoading } from './Loader';
import { id } from 'date-fns/locale';

const BaseLayout: React.FC = () => {
  const loading = useLoading();
  const { idToken } = useAuth();
  const apiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;

  return (
    <AuthCheck>
      <UserAPIProvider basePath={apiEndpoint} accessToken={idToken}>
        <Header />
        <Row className="flex-nowrap m-0 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
          <Col md={3} xl={2} sm={2} xs={1} className="col-auto px-0 border bg-light">
            <Sidebar />
          </Col>
          <Col className="overflow-hidden p-3 ps-4 pe-4 vertical-scroll-intermediate-container">
            <Loader loading={loading} />
            <Outlet />
          </Col>
        </Row>
      </UserAPIProvider>
    </AuthCheck>
  );
};

export default BaseLayout;

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Header from './Header';
import Sidebar from './Sidebar';
import AuthCheck from './AuthCheck';
import Loader, { useLoading } from './Loader';

interface Props {
  children?: React.ReactNode;
}

const BaseLayout: React.FC<Props> = ({ children }) => {
  const loading = useLoading();

  return (
    <AuthCheck>
      <Header />
      <Row
        className="flex-nowrap m-0 overflow-hidden"
        style={{
          height: 'calc(100vh - 56px)',
        }}
      >
        <Col md={3} xl={2} sm={2} xs={1} className="col-auto px-0 border bg-light">
          <Sidebar />
        </Col>
        <Col className="overflow-hidden p-3 ps-4 pe-4 vertical-scroll-intermediate-container">
            <Loader loading={loading} />
            {children}
        </Col>
      </Row>
    </AuthCheck>
  );
};

export default BaseLayout;

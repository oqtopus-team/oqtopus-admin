import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LanguageSelector } from './_components/LanguageSelector';

const AuthHeader: React.FunctionComponent = () => {
  const appName: string = import.meta.env.VITE_APP_NAME;
  return (
    <Navbar bg="primary" variant="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand>{appName}</Navbar.Brand>
      </Container>
      <LanguageSelector />
    </Navbar>
  );
};

export default AuthHeader;

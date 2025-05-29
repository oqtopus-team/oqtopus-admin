import clsx from 'clsx';
import { languages } from '../i18n/config';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Select } from './Select';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const Header: React.FunctionComponent = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const appName: string = import.meta.env.VITE_APP_NAME;
  return (
    <Navbar bg="primary" variant="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/users">{appName}</Navbar.Brand>
        <NavDropdown title={auth.email} className="text-white" id="basic-nav-dropdown">
          <NavDropdown.Item
            onClick={() => {
              navigate({ pathname: '/password-change' });
            }}
          >
            {t('header.menu.change_password')}
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => {
              auth
                .signOut(t)
                .then((res) => {
                  if (res.success) {
                    navigate({ pathname: '/login' });
                  }
                })
                .catch(() => {
                  alert(t('header.logout.failure'));
                });
            }}
          >
            {t('header.menu.logout')}
          </NavDropdown.Item>
        </NavDropdown>
      </Container>
      <LanguageSelector />
    </Navbar>
  );
};

const LanguageSelector = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <Select
      className={clsx('!w-[100px]', 'border-primary', 'text-primary', 'outline-primary')}
      onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (languages.includes(e.target.value)) {
          console.log(e.target.value);
          i18next.changeLanguage(e.target.value);
        }
      }}
      defaultValue={i18next.language}
      value={''}
    >
      {languages.map((lang: string) => {
        return (
          <option value={lang} key={lang}>
            {t(`header.lang.${lang}`)}
          </option>
        );
      })}
    </Select>
  );
};

export default Header;

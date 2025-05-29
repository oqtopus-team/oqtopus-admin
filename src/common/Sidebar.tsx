import Nav from 'react-bootstrap/Nav';
import { FaUser, FaFile, FaServer, FaCommentAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const menuItems: MenuItem[] = [
    {
      name: t('sidebar.users'),
      path: '/users',
      icon: <FaUser />,
    },
    {
      name: t('sidebar.white_list'),
      path: '/whitelist',
      icon: <FaFile />,
    },
    {
      name: t('sidebar.device'),
      path: '/device',
      icon: <FaServer />,
    },
    {
      name: t('sidebar.announcements'),
      path: '/announcements',
      icon: <FaCommentAlt />,
    },
  ];
  return (
    <div className="flex-column d-flex align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
      <Nav
        as="ul"
        className="flex-column nav-pills mb-sm-auto mb-0 align-items-center align-items-sm-start"
      >
        {menuItems.map((menuItem, index) => {
          return (
            <Nav.Item as="li" key={index}>
              <Nav.Link href={menuItem.path}>
                <h5>
                  {menuItem.icon} {menuItem.name}
                </h5>
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
  );
};

export default Sidebar;

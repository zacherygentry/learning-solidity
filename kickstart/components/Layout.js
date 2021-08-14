import React from 'react';
import Header from '../components/Header';
import { Container } from 'semantic-ui-react';

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;

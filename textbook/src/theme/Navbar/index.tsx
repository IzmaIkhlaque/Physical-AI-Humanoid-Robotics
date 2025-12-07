import React from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props): JSX.Element {

  // Filter navbar items to always hide Login/Signup as per user request
  const filteredItems = props.items?.filter((item) => {
    if (item.to === '/login' || item.to === '/signup') {
      return false;
    }
    return true; // Keep other items
  });

  return (
    <>
      <Navbar {...props} items={filteredItems} />
    </>
  );
}

import React from 'react';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import { useAuth } from '../../hooks/useAuth';
import { useHistory, useLocation } from '@docusaurus/router';
import type { Props } from '@theme/NavbarItem/LocaleDropdownNavbarItem';

export default function LocaleDropdownNavbarItemWrapper(props: Props): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const history = useHistory();
  const location = useLocation();

  // Don't show locale dropdown while loading auth state
  if (isLoading) {
    return null;
  }

  // Only show locale dropdown to authenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Wrap the original component to intercept locale changes
  const handleLocaleChange = (locale: string) => {
    if (locale === 'ur' && !isAuthenticated) {
      // Redirect to login if trying to access Urdu without authentication
      history.push('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }
  };

  return <LocaleDropdownNavbarItem {...props} />;
}

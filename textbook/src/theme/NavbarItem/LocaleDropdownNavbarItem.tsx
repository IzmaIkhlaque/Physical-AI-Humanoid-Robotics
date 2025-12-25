import React from 'react';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import type { Props } from '@theme/NavbarItem/LocaleDropdownNavbarItem';

/**
 * Language Switcher Wrapper
 *
 * IMPORTANT: The language dropdown is ALWAYS visible so users can switch languages.
 * Access to /ur/ content is protected by UrduRouteGuard in Root.tsx instead.
 */
export default function LocaleDropdownNavbarItemWrapper(props: Props): JSX.Element {
  // Always show the language dropdown - don't hide it based on auth
  // The /ur/ routes themselves are protected by UrduRouteGuard
  return <LocaleDropdownNavbarItem {...props} />;
}

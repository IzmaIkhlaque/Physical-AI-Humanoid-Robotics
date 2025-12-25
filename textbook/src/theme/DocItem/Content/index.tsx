import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';
import ChapterTranslateButton from '../../../components/ChapterTranslateButton';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  const location = useLocation();

  // Extract chapter slug from current path
  // Example: /part1/chapter1-what-is-physical-ai/lesson1 -> part1-chapter1-what-is-physical-ai
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Skip if on Urdu locale
  if (pathParts[0] === 'ur') {
    pathParts.shift(); // Remove 'ur' from path
  }

  // Get chapter identifier (part + chapter)
  let chapterSlug = '';
  if (pathParts.length >= 2) {
    // e.g., "part1" + "chapter1-what-is-physical-ai"
    chapterSlug = `${pathParts[0]}-${pathParts[1]}`;
  }

  // Only show button on lesson pages (not on intro pages)
  const showButton = chapterSlug && pathParts.length >= 3 && pathParts[2].startsWith('lesson');

  return (
    <>
      {showButton && <ChapterTranslateButton chapterSlug={chapterSlug} />}
      <Content {...props} />
    </>
  );
}

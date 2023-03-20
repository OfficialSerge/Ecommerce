"use client"

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch('55L0ZMZNID', '44e9cf45b67ca2ba66003e425a368dac');

export function AlgoliaSearchProvider() {
  return (
    <InstantSearch searchClient={searchClient} indexName="instant_search">
      {/* ... */}
    </InstantSearch>
  );
}

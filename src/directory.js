import angular from 'angular';
import 'angular-sanitize';

import {
  SearchService
} from './components/search.service';
import {
  SearchComponent
} from './components/search.component';
import {
  SearchFormComponent
} from './components/search-form.component';
import {
  SearchResultComponent
} from './components/search-result.component';
import {
  PaginationComponent
} from './components/pagination.component';
import {
  SortControlsComponent
} from './components/sort-controls.component';
import {
  UpdateFormComponent
} from './components/update-form.component';
import {
  ContactFormComponent
} from './components/contact-form.component';
import {
  StartFromFilter
} from './components/start-from.filter';
import {
  TelLinkFilter
} from './components/tel-link.filter';
import {
  TemplateRun
} from './components/templates.run';
import {
  LocationConfig
} from "./components/location.config";
import {
  SORT_OPTIONS
} from './components/sort-options';
import {
  CONTACTS_LIST
} from './components/contacts';

angular.module('uoitDirectory', ['ngSanitize'])
  .constant('SORT_OPTIONS', SORT_OPTIONS)
  .constant('CONTACTS_LIST', CONTACTS_LIST)
  .service('SearchService', SearchService)
  .component('directorySearch', SearchComponent)
  .component('directorySearchForm', SearchFormComponent)
  .component('directorySearchResult', SearchResultComponent)
  .component('directoryPagination', PaginationComponent)
  .component('directorySortControls', SortControlsComponent)
  .component('directoryUpdateForm', UpdateFormComponent)
  .component('directoryContactForm', ContactFormComponent)
  .filter('startFrom', StartFromFilter)
  .filter('telLink', TelLinkFilter)
  .config(LocationConfig)
  .run(TemplateRun);

angular.bootstrap(document.body, ['uoitDirectory'], {
  strictDi: true
});
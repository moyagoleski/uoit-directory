import angular from 'angular';

import { SearchService } from './components/search.service';
import { SearchComponent } from './components/search.component';
import { PaginationComponent } from './components/pagination.component';
import { StartFromFilter } from './components/start-from.filter';
import { TelLinkFilter } from './components/tel-link.filter';
import { TemplateRun } from './components/templates.run'
import { CONTACTS_LIST } from './components/contacts';

angular.module('uoitDirectory', [])
	.constant('CONTACTS_LIST', CONTACTS_LIST)
	.service('SearchService', SearchService)
	.component('directorySearch', SearchComponent)
	.component('directoryPagination', PaginationComponent)
	.filter('startFrom', StartFromFilter)
	.filter('telLink', TelLinkFilter)
	.run(TemplateRun);

angular.bootstrap(document.body, ['uoitDirectory'], {
	strictDi: true
});
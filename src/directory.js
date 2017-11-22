import angular from 'angular';

import { DirectoryService } from './components/directory.service';
import { DirectorySearchComponent } from './components/directory-search.component';
import { DirectoryPaginationComponent } from './components/directory-pagination.component';
import { StartFromFilter } from './components/start-from.filter';
import { TelLinkFilter } from './components/tel-link.filter';
import { TemplateRun } from './components/templates.run'
import { DIRECTORY_CONTACTS } from './components/directory-contacts';

angular.module('uoitDirectory', [])
	.constant('DIRECTORY_CONTACTS', DIRECTORY_CONTACTS)
	.service('DirectoryService', DirectoryService)
	.component('directorySearch', DirectorySearchComponent)
	.component('directoryPagination', DirectoryPaginationComponent)
	.filter('startFrom', StartFromFilter)
	.filter('telLink', TelLinkFilter)
	.run(TemplateRun);

angular.bootstrap(document.body, ['uoitDirectory'], {
	strictDi: true
});
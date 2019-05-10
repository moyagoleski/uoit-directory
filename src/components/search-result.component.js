export const SearchResultComponent = {
  templateUrl: 'search-result.component.html',
  bindings: {
    result: '<',
    onExpand: '&',
    onUpdateRequest: '&'
  },
  controller: class SearchResult {

    constructor($sce) {
      'ngInject';
      if (this.result && this.result.expert && this.result.expert.summary) {
        this.result.expert.summary = $sce.trustAsHtml(this.result.expert.summary);
      }
    }
  }
}
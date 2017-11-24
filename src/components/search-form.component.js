export const SearchFormComponent = {
  templateUrl: 'search-form.component.html',
  bindings: {
    searchQuery: '<',
    departments: '<',
    loadingResults: '<',
    hasResults: '<',
    onChange: '&',
    onSubmit: '&'
  },
  controller: class SearchForm {
    constructor() {
      this.$state = {
        // validation errors
        departmentError: null,
        userError: null,
      };
    }
  }
};

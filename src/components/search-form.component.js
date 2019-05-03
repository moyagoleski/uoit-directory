export const SearchFormComponent = {
  templateUrl: 'search-form.component.html',
  bindings: {
    searchQuery: '<',
    initialQuery: '<',
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

    $onInit() {
      if (this.initialQuery) {
        this.onChange({
          $event: this.initialQuery
        })
      }
    }
  }
};
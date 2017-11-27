export const PaginationComponent = {
  templateUrl: 'pagination.component.html',
  bindings: {
    numberOfItems: '<',
    currentPage: '<',
    pageSize: '<',
    onNext: '&',
    onPrev: '&',
    onGoto: '&'
  },
  controller: class Pagination {
    constructor() {
      this.$state = {
        numberOfPages: 0,
        pageNumbers: [1]
      };
    }
		/**
		 * Assign a count of available pages for paginating to the state.
		 */
    updateNumberOfPages() {
      this.$state.numberOfPages = this.numberOfItems
        ? Math.ceil(this.numberOfItems / this.pageSize)
        : 0;
    }

		/**
		 * Update the state's list of page numbers available to paginate through.
		 */
    updatePageNumbers() {
      if (this.$state.numberOfPages > 0) {
        let numberOfPages = this.$state.numberOfPages;
        const pageNumArray = [];
        while (numberOfPages) {
          pageNumArray.push(numberOfPages);
          numberOfPages--;
        }
        this.$state.pageNumbers = pageNumArray.reverse();
      } else {
        this.$state.pageNumbers = [1];
      }
    }

    $onChanges() {
      this.updateNumberOfPages();
      this.updatePageNumbers();
    }
  }
  // end controller
};

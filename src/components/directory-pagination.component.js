export const DirectoryPaginationComponent = {
  templateUrl: 'directory-pagination.component.html',
  bindings: {
    items: '<',
    currentPage: '<',
    pageSize: '<',
    onNext: '&',
    onPrev: '&',
    onGoto: '&'
  },
  controller: class DirectoryPagination {
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
      this.$state.numberOfPages = this.items && this.items.length
        ? Math.ceil(this.items.length / this.pageSize)
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

		/**
		 * Calls both pagination-building methods in order (helper).
		 */
    updatePagination() {
      this.updateNumberOfPages();
      this.updatePageNumbers();
    }

    $onChanges() {
      this.updatePagination();
    }
  }
  // end controller
};

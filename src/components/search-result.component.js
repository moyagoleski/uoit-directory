export const SearchResultComponent = {
  templateUrl: 'search-result.component.html',
  bindings: {
    result: '<',
    onExpand: '&',
    onUpdateRequest: '&'
  },
  controller: class SearchResult {

    constructor($sce, $http, $httpParamSerializerJQLike) {
      'ngInject';
      this.isVisible = false;
      this.$http = $http;
      this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
      this.$state = {
        // common contacts tab data
        contacts: this.CONTACTS_LIST,

        // directory API data
        departments: null,
        users: null,
        usersCache: null,

        // data and status of contact form
        formData: {
          recipient: null,
          sendCopy: null,
          bannerId: null,
          firstname: null,
          lastname: null,
          department: null,
          position: null,
          building: null,
          office: null,
          extension: null,
          email: null
        },
        formStatus: {
          success: null,
          error: null
        },

        // pagination
        currentPage: 0,
        pageSize: 10,

        //sorting
        sortOptions: this.SORT_OPTIONS,
        sortOrder: 'lastname',

        // whether results are currently loading
        loadingResults: false,
      };
      /**
       * A map of DOM element IDs as string constants.
       */
      this.ID = {
        SEARCH_FORM: 'search-form',
        SEARCH_RESULTS: 'search-results',
        DIRECTORY_TABS: 'directory-tabs',
        DIRECTORY_TABS_CONTENT: 'directory-tabs-content'
      };

      if (this.result && this.result.expert && this.result.expert.summary) {
        this.result.expert.summary = $sce.trustAsHtml(this.result.expert.summary);
      }
    }


    /**
     * hide and show the contact form with the click of button.
     */
    showHide() {
      this.isVisible = !this.isVisible;
    }

    /**
     * Send a filled-out contact request form to the contact mailer script.
     */
    onContactFormSubmit({
      formData,
      form,
      recipient
    }) {
      formData.recipient = recipient;
      const data = this.$httpParamSerializerJQLike(formData);
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      console.log(`contact form submitted!`);
      this.$http({
          method: 'POST',
          url: 'mail.php',
          headers,
          data
        })
        .then(response => {
          if (response.data && response.data.success) {
            console.info(response);
            this.$state.formStatus.error = false;
            this.$state.formStatus.success = `Your message was sent successfully!`;
            form.$setUntouched();
            this.$state.formData = {};
          } else {
            const error = response.data && response.data.message ?
              response.data.message :
              'Please refresh the page and try again!';
            throw new Error(error);
          }
        })
        .catch(error => {
          console.info(error);
          const errorMessage = error.status ?
            `${error.status} (${error.statusText})` :
            error.message || error;
          this.$state.formStatus.success = false;
          this.$state.formStatus.error = `There was an error submitting your message. ${errorMessage}`;
        })
    }
  }
}
export const ContactFormComponent = {
  templateUrl: 'contact-form.component.html',
  bindings: {
    formData: '<',
    formStatus: '<',
    formRecipient: '=',
    onSubmit: '&'
  }
};
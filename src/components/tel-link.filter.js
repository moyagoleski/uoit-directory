export const TelLinkFilter = () => {
  return tel => {
    const maxLength = 10;
    const cityCodeLength = 3;
    const numberLength = 7;
    // Return if no number was passed in
    if (!tel) {
      return '';
    }
    tel = tel.toString();
    // Strip all non-numeric characters
    let value = tel.trim().replace(/\D/g, '');
    // Trim to verify the model doesn't get any larger
    if (value.length > maxLength) {
      // If the first character is a country code
      if (value.charAt(0) === '1') {
        // Don't strip it, allow 11 digits
        value = value.substring(1, maxLength + 1);
      } else {
        value = value.substring(0, maxLength);
      }
    }
    if (tel.search('ext.') !== -1) {
    	const ext = tel.split('ext.')[1].trim();
    	value = `${value},${ext}`;
    }
    return value;
  }
}

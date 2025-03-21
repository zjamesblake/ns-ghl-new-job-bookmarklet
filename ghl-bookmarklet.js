// GHL Job Creator Bookmarklet
(function() {
  // Prevent multiple instances
  if (document.getElementById('ghl-form-popup-overlay')) {
    return;
  }
  
  // Helper function to extract data from GHL contact page
  function extractContactData() {
    try {
      // Use the specific input field selectors provided
      const firstNameInput = document.querySelector('input[name="contact.first_name"]');
      const lastNameInput = document.querySelector('input[name="contact.last_name"]');
      const emailInput = document.querySelector('input[name="contact.email"]');
      
      // Extract values from the input fields
      let firstName = firstNameInput ? firstNameInput.value.trim() : '';
      let lastName = lastNameInput ? lastNameInput.value.trim() : '';
      let email = emailInput ? emailInput.value.trim() : '';
      
      // If inputs don't have values, try to find displayed values on the page
      if (!firstName || !lastName) {
        // Fallback: Get first name and last name from displayed text
        const fullNameElement = document.querySelector('[data-cy="contact-full-name"]') || 
                              document.querySelector('.contact-name') ||
                              document.querySelector('.contact-detail-name');
                              
        if (fullNameElement) {
          const fullName = fullNameElement.textContent.trim();
          const nameParts = fullName.split(' ');
          if (nameParts.length >= 1 && !firstName) {
            firstName = nameParts[0];
          }
          if (nameParts.length >= 2 && !lastName) {
            lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Fallback for email if input field doesn't have value
      if (!email) {
        const emailElement = document.querySelector('[data-cy="contact-email"]') ||
                            document.querySelector('.contact-email') ||
                            document.querySelector('a[href^="mailto:"]');
        
        if (emailElement) {
          // Extract email from mailto link if present
          if (emailElement.hasAttribute('href') && emailElement.getAttribute('href').startsWith('mailto:')) {
            email = emailElement.getAttribute('href').replace('mailto:', '');
          } else {
            email = emailElement.textContent.trim();
          }
        }
      }
      
      return {
        firstName,
        lastName,
        email
      };
    } catch (error) {
      console.error('Error extracting contact data:', error);
      return {
        firstName: '',
        lastName: '',
        email: ''
      };
    }
  }
  
  // Extract the data
  const contactData = extractContactData();
  
  // Create styles
  const styles = `
    #ghl-form-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }
    
    #ghl-form-popup-container {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      height: 90%;
      max-height: 800px;
      position: relative;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    }
    
    #ghl-form-popup-header {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #ghl-form-popup-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    
    #ghl-form-popup-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #777;
    }
    
    #ghl-form-iframe {
      flex: 1;
      width: 100%;
      border: none;
    }
  `;
  
  // Form URL with pre-filled parameters
  const formUrl = new URL('https://api.leadconnectorhq.com/widget/form/rpBMjFJzdISFJTYMWgQV');
  
  // Add contact data as query parameters with the correct parameter names
  if (contactData.firstName) {
    formUrl.searchParams.append('first_name', contactData.firstName);
  }
  if (contactData.lastName) {
    formUrl.searchParams.append('last_name', contactData.lastName);
  }
  if (contactData.email) {
    formUrl.searchParams.append('email', contactData.email);
  }
  
  // Create the overlay HTML
  const overlayHtml = `
    <div id="ghl-form-popup-overlay">
      <style>${styles}</style>
      <div id="ghl-form-popup-container">
        <div id="ghl-form-popup-header">
          <h3 id="ghl-form-popup-title">Create New Job</h3>
          <button id="ghl-form-popup-close" aria-label="Close">&times;</button>
        </div>
        <iframe id="ghl-form-iframe" src="${formUrl.toString()}" allow="geolocation"></iframe>
      </div>
    </div>
  `;
  
  // Add the overlay to the page
  const overlayContainer = document.createElement('div');
  overlayContainer.innerHTML = overlayHtml;
  document.body.appendChild(overlayContainer);
  
  // Setup close handler
  document.getElementById('ghl-form-popup-close').addEventListener('click', function() {
    document.getElementById('ghl-form-popup-overlay').remove();
  });
  
  // Close when clicking outside the container
  document.getElementById('ghl-form-popup-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.remove();
    }
  });
  
  // Listen for form submission message (optional, if the form supports postMessage)
  window.addEventListener('message', function(event) {
    // Check origin for security (adjust to match the form's domain)
    if (event.origin !== 'https://api.leadconnectorhq.com') return;
    
    // If the message indicates form submission success
    if (event.data && event.data.type === 'form-submit-success') {
      setTimeout(() => {
        document.getElementById('ghl-form-popup-overlay').remove();
        // Optionally refresh the page
        // window.location.reload();
      }, 2000);
    }
  }, false);
})();

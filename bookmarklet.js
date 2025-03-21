javascript:(function(){
  if(document.getElementById('ghl-form-popup-overlay')) return;
  
  function extractData(){
    try{
      const firstNameInput = document.querySelector('input[name="contact.first_name"]') || document.querySelector('input[name="first_name"]');
      const lastNameInput = document.querySelector('input[name="contact.last_name"]') || document.querySelector('input[name="last_name"]');
      const emailInput = document.querySelector('input[name="contact.email"]') || document.querySelector('input[name="email"]');
      
      let firstName = firstNameInput ? firstNameInput.value.trim() : '';
      let lastName = lastNameInput ? lastNameInput.value.trim() : '';
      let email = emailInput ? emailInput.value.trim() : '';
      
      if(!firstName || !lastName){
        const nameElement = document.querySelector('.contact-header-info h1') || document.querySelector('.contact-name') || document.querySelector('.contact-info-name') || document.querySelector('h1.name');
        if(nameElement){
          const nameParts = nameElement.textContent.trim().split(' ');
          if(nameParts.length >= 1 && !firstName) firstName = nameParts[0];
          if(nameParts.length >= 2 && !lastName) lastName = nameParts.slice(1).join(' ');
        }
      }
      
      if(!email){
        const emailElement = document.querySelector('.contact-header-info a[href^="mailto:"]') || document.querySelector('a[href^="mailto:"]') || document.querySelector('.contact-email');
        if(emailElement){
          if(emailElement.getAttribute('href')) email = emailElement.getAttribute('href').replace('mailto:','');
          else email = emailElement.textContent.trim();
        }
      }
      
      console.log('Extracted data:', {firstName, lastName, email});
      return {firstName, lastName, email};
    } catch(error){
      console.error('Error extracting contact data:', error);
      return {firstName:'', lastName:'', email:''};
    }
  }
  
  const contactData = extractData();
  const formUrl = new URL('https://api.leadconnectorhq.com/widget/form/rpBMjFJzdISFJTYMWgQV');
  
  if(contactData.firstName) formUrl.searchParams.append('first_name', contactData.firstName);
  if(contactData.lastName) formUrl.searchParams.append('last_name', contactData.lastName);
  if(contactData.email) formUrl.searchParams.append('email', contactData.email);
  
  const overlayContainer = document.createElement('div');
  const styles = '#ghl-form-popup-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif}#ghl-form-popup-container{background:white;border-radius:8px;width:90%;max-width:800px;height:90%;max-height:800px;position:relative;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;flex-direction:column}#ghl-form-popup-header{padding:15px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}#ghl-form-popup-title{font-size:18px;font-weight:bold;color:#333;margin:0}#ghl-form-popup-close{background:none;border:none;font-size:24px;cursor:pointer;color:#777}#ghl-form-iframe{flex:1;width:100%;border:none}';
  
  overlayContainer.innerHTML = '<div id="ghl-form-popup-overlay"><style>'+styles+'</style><div id="ghl-form-popup-container"><div id="ghl-form-popup-header"><h3 id="ghl-form-popup-title">Create New Job</h3><button id="ghl-form-popup-close" aria-label="Close">&times;</button></div><iframe id="ghl-form-iframe" src="'+formUrl.toString()+'" allow="geolocation"></iframe></div></div>';
  
  document.body.appendChild(overlayContainer);
  
  document.getElementById('ghl-form-popup-close').addEventListener('click', function(){
    document.getElementById('ghl-form-popup-overlay').remove();
  });
  
  document.getElementById('ghl-form-popup-overlay').addEventListener('click', function(e){
    if(e.target === this) this.remove();
  });
})();

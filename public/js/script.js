document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('studentProfileForm');
  const successMessage = document.getElementById('successMessage');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
      fieldOfStudy: document.getElementById('fieldOfStudy').value,
      university: document.getElementById('university').value,
      yearOfStudy: document.getElementById('yearOfStudy').value,
      availability: document.getElementById('availability').value,
      interests: document.getElementById('interests').value,
      workExperience: document.getElementById('workExperience').value,
      linkedinOrResume: document.getElementById('linkedinOrResume').value
    };
    
    // Form validation
    if (!validateForm(formData)) {
      return;
    }
    
    // Send data to MongoDB through API
    submitToAPI(formData)
      .then(response => {
        // Hide the form and show success message
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Log the response for debugging
        console.log('Submission successful:', response);
      })
      .catch(error => {
        // Show error
        alert('There was an error submitting your profile. Please try again later.');
        console.error('Submission error:', error);
      });
    
    // For backup if the API fails, uncomment this
    /*
    simulateApiSubmission(formData)
      .then(response => {
        // Hide the form and show success message
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Log the response for debugging
        console.log('Submission successful:', response);
      })
      .catch(error => {
        // Show error
        alert('There was an error submitting your profile. Please try again later.');
        console.error('Submission error:', error);
      });
    */
  });
  
  // Function to submit to real API
  async function submitToAPI(data) {
    try {
      const response = await fetch('/api/student-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('API submission error:', error);
      throw error;
    }
  }
  
  // Basic form validation
  function validateForm(data) {
    const requiredFields = ['fieldOfStudy', 'university', 'yearOfStudy', 'availability', 'interests'];
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        alert(`Please fill in the ${formatFieldName(field)} field.`);
        document.getElementById(field).focus();
        return false;
      }
    }
    
    return true;
  }
  
  // Format field name for error messages
  function formatFieldName(field) {
    const formatted = field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str) { return str.toUpperCase(); });
    
    return formatted;
  }
  
  // Simulate API submission (to be replaced with actual MongoDB connection)
  function simulateApiSubmission(data) {
    return new Promise((resolve, reject) => {
      console.log('Form data to be sent to MongoDB in the future:', data);
      
      // Simulate network delay
      setTimeout(() => {
        // Simulate successful response 95% of the time
        if (Math.random() > 0.05) {
          resolve({
            success: true,
            message: 'Profile saved successfully'
          });
        } else {
          reject(new Error('Network error'));
        }
      }, 1500);
    });
  }
  
  // Handle file upload preview if needed
  const resumeUpload = document.getElementById('resumeUpload');
  
  resumeUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // In the future, this will handle file upload to MongoDB or a storage service
      
      // Display the file name (optional)
      const fileUploadNote = document.querySelector('.file-upload-note');
      fileUploadNote.innerHTML = `Selected file: <strong>${file.name}</strong> <button type="button" id="clearFile" class="clear-file">Clear</button>`;
      
      // Add clear button functionality
      document.getElementById('clearFile').addEventListener('click', function() {
        resumeUpload.value = '';
        fileUploadNote.innerHTML = 'Or upload your CV (PDF/DOC): <input type="file" id="resumeUpload" accept=".pdf,.doc,.docx">';
        // Re-add the event listener to the new file input
        document.getElementById('resumeUpload').addEventListener('change', resumeUpload.onchange);
      });
    }
  });
}); 
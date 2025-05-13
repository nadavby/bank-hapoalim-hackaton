document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('studentProfileForm');
  const successMessage = document.getElementById('successMessage');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Créer un FormData object pour envoyer les données, y compris le fichier
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('fieldOfStudy', document.getElementById('fieldOfStudy').value);
    formData.append('university', document.getElementById('university').value);
    formData.append('yearOfStudy', document.getElementById('yearOfStudy').value);
    formData.append('availability', document.getElementById('availability').value);
    formData.append('interests', document.getElementById('interests').value);
    formData.append('workExperience', document.getElementById('workExperience').value);
    formData.append('linkedinOrResume', document.getElementById('linkedinOrResume').value);
    
    // Ajouter le fichier s'il existe
    const resumeFile = document.getElementById('resumeUpload').files[0];
    if (resumeFile) {
      formData.append('resumeFile', resumeFile);
    }
    
    // Créer un objet pour la validation
    const dataForValidation = {
      fieldOfStudy: document.getElementById('fieldOfStudy').value,
      university: document.getElementById('university').value,
      yearOfStudy: document.getElementById('yearOfStudy').value,
      availability: document.getElementById('availability').value,
      interests: document.getElementById('interests').value,
      workExperience: document.getElementById('workExperience').value,
      linkedinOrResume: document.getElementById('linkedinOrResume').value
    };
    
    // Form validation
    if (!validateForm(dataForValidation)) {
      return;
    }
    
    // Send data to MongoDB through API
    submitToAPI(formData)
      .then(response => {
        // Hide the form and show success message
        form.style.display = 'none';
        
        // Si un fichier a été téléchargé, ajouter le lien pour y accéder
        if (response.profile && response.profile.resumeFile && response.profile.resumeFile.url) {
          const fileUrl = response.profile.resumeFile.url;
          const profileId = response.profile._id;
          
          // Ajouter le lien direct vers le fichier et le lien API pour télécharger
          const fileLinks = `
            <div class="resume-download-links">
              <p>Vous pouvez accéder à votre CV de deux façons :</p>
              <ul>
                <li><a href="${fileUrl}" target="_blank">Voir le fichier directement</a></li>
                <li><a href="/api/student-profile/${profileId}/resume" target="_blank">Télécharger via l'API</a></li>
              </ul>
            </div>
          `;
          
          successMessage.innerHTML += fileLinks;
        }
        
        successMessage.classList.remove('hidden');
        
        // Log the response for debugging
        console.log('Submission successful:', response);
      })
      .catch(error => {
        // Show error
        alert('There was an error submitting your profile. Please try again later.');
        console.error('Submission error:', error);
      });
  });
  
  // Function to submit to real API
  async function submitToAPI(formData) {
    try {
      const response = await fetch('/api/student-profile', {
        method: 'POST',
        body: formData  // Pas besoin de définir Content-Type, il sera automatiquement défini avec le boundary
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
  
  // Handle file upload preview if needed
  const resumeUpload = document.getElementById('resumeUpload');
  
  resumeUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Veuillez télécharger un fichier PDF ou DOC/DOCX');
        resumeUpload.value = '';
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Veuillez télécharger un fichier de moins de 5MB.');
        resumeUpload.value = '';
        return;
      }
      
      // Display the file name
      const fileUploadNote = document.querySelector('.file-upload-note');
      fileUploadNote.innerHTML = `Fichier sélectionné: <strong>${file.name}</strong> <button type="button" id="clearFile" class="clear-file">Effacer</button>`;
      
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
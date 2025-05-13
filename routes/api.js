const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Import the Student Profile model
const StudentProfile = require('../models/studentProfile');

// Configuration de Multer pour le stockage des fichiers sur le disque
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + extension);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Accepter uniquement les PDF et documents Word
  if (file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Veuillez télécharger un PDF ou document Word.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  },
  fileFilter: fileFilter
});

// GET all student profiles (admin access only in future)
router.get('/student-profiles', async (req, res) => {
  try {
    // Get profiles from database
    const profiles = await StudentProfile.find().sort({ createdAt: -1 });
    
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
});

// POST pour ajouter un nouveau profil avec upload de CV
router.post('/student-profile', upload.single('resumeFile'), async (req, res) => {
  try {
    // Créer un nouveau profil avec les données du formulaire
    const profileData = { ...req.body };
    
    // Ajouter les informations du fichier s'il existe
    if (req.file) {
      // Chemin où le fichier a été sauvegardé
      const filePath = req.file.path;
      const fileUrl = `/uploads/${path.basename(filePath)}`;
      
      // Lire le fichier pour le stocker aussi dans MongoDB
      const fileData = fs.readFileSync(filePath);
      
      profileData.resumeFile = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date(),
        data: fileData,
        path: filePath,
        url: fileUrl
      };
    }
    
    // Create and save profile to database
    const newProfile = new StudentProfile(profileData);
    await newProfile.save();
    
    console.log('Received and saved profile data with resume');
    
    res.status(201).json({ 
      message: 'Profile saved successfully',
      profile: {
        ...profileData,
        resumeFile: profileData.resumeFile ? {
          filename: profileData.resumeFile.filename,
          originalname: profileData.resumeFile.originalname,
          size: profileData.resumeFile.size,
          contentType: profileData.resumeFile.contentType,
          url: profileData.resumeFile.url
        } : null
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error saving profile', error: error.message });
  }
});

// GET a single profile by ID (for future edit functionality)
router.get('/student-profile/:id', async (req, res) => {
  try {
    // Get profile by ID from database
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// GET pour télécharger un CV depuis le fichier stocké localement
router.get('/student-profile/:id/resume', async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile || !profile.resumeFile) {
      return res.status(404).json({ message: 'CV non trouvé' });
    }
    
    // Vérifier si le fichier existe sur le disque
    if (profile.resumeFile.path && fs.existsSync(profile.resumeFile.path)) {
      // Si le fichier existe sur le disque, l'envoyer directement
      res.set({
        'Content-Type': profile.resumeFile.contentType,
        'Content-Disposition': `attachment; filename="${profile.resumeFile.originalname}"`,
      });
      
      // Créer un stream de lecture pour le fichier
      const fileStream = fs.createReadStream(profile.resumeFile.path);
      fileStream.pipe(res);
    } else if (profile.resumeFile.data) {
      // Fallback : utiliser les données stockées dans MongoDB
      res.set({
        'Content-Type': profile.resumeFile.contentType,
        'Content-Disposition': `attachment; filename="${profile.resumeFile.originalname}"`,
        'Content-Length': profile.resumeFile.size
      });
      
      // Envoyer le fichier depuis MongoDB
      res.send(profile.resumeFile.data);
    } else {
      return res.status(404).json({ message: 'Fichier CV introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement du CV', error: error.message });
  }
});

module.exports = router; 
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError('');
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Por favor selecciona una imagen primero');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const prog = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(prog);
          },
        }
      );

      onUpload(res.data.secure_url);
    } catch (err) {
      setError('Error al subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '10px' }}>
        {uploading ? `Subiendo... ${progress}%` : 'Subir Imagen'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;

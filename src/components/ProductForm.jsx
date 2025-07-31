import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageUploader from './ImageUploader';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      alert('Por favor completá todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name,
        description,
        price: Number(price),
        imageUrl, // guardamos la URL de la imagen subida
      });

      alert('Producto agregado con éxito');
      // Limpiar formulario
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
    } catch (error) {
      alert('Error al agregar producto: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '1rem auto' }}>
      <h2>Agregar Producto</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ ...inputStyle, height: '80px' }}
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={inputStyle}
      />

      {/* Aquí insertamos el uploader */}
      <ImageUploader onUploadComplete={setImageUrl} />

      {/* Preview de la imagen subida */}
      {imageUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      <button type="submit" style={buttonStyle}>Agregar Producto</button>
    </form>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

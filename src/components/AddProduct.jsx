import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageUpload from './ImageUpload';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUploadComplete = (url) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Nombre y precio son obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        imageUrl,
        createdAt: new Date()
      });

      setSuccessMsg('Producto agregado con éxito');
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError('Error al agregar producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="input"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea"
      />

      <ImageUpload onUpload={handleUploadComplete} />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="preview-image"
        />
      )}

      <button type="submit" disabled={loading} className="btn">
        {loading ? 'Agregando...' : 'Agregar Producto'}
      </button>

      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </form>
  );
};

export default AddProduct;

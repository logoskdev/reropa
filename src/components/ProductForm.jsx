// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageUploader from './ImageUploader';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    subcategoria: '',
    estado: '',
    marca: '',
    talle: '',
    color: '',
    ubicacion: '',
    imagenUrl: '',
  });

  const categorias = ['Ropa', 'Calzado', 'Accesorios', 'Tecnología', 'Perfumes'];
  const estados = ['Nuevo', 'Como nuevo', 'Usado'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    const { nombre, descripcion, precio, categoria, estado, imagenUrl } = formData;
    if (!nombre.trim() || !descripcion.trim() || !precio || !categoria || !estado || !imagenUrl) {
      alert('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        ...formData,
        precio: Number(formData.precio),
        creadoEn: serverTimestamp(),
      });

      alert('Producto agregado con éxito');
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        subcategoria: '',
        estado: '',
        marca: '',
        talle: '',
        color: '',
        ubicacion: '',
        imagenUrl: '',
      });
    } catch (error) {
      alert('Error al agregar producto: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Agregar Producto</h2>

      <input
        type="text"
        name="nombre"
        placeholder="Título del producto *"
        value={formData.nombre}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      <textarea
        name="descripcion"
        placeholder="Descripción *"
        value={formData.descripcion}
        onChange={handleChange}
        required
        style={{ ...inputStyle, height: '80px' }}
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio (USD) *"
        value={formData.precio}
        onChange={handleChange}
        required
        style={inputStyle}
        min="0"
        step="0.01"
      />

      <select
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="">Categoría *</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="subcategoria"
        placeholder="Subcategoría (opcional)"
        value={formData.subcategoria}
        onChange={handleChange}
        style={inputStyle}
      />

      <select
        name="estado"
        value={formData.estado}
        onChange={handleChange}
        required
        style={inputStyle}
      >
        <option value="">Estado *</option>
        {estados.map((est) => (
          <option key={est} value={est}>
            {est}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="marca"
        placeholder="Marca (opcional)"
        value={formData.marca}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="talle"
        placeholder="Talle (opcional)"
        value={formData.talle}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="color"
        placeholder="Color (opcional)"
        value={formData.color}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="ubicacion"
        placeholder="Ubicación (opcional)"
        value={formData.ubicacion}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Uploader de imagen */}
      <ImageUploader onUploadComplete={(url) => setFormData((prev) => ({ ...prev, imagenUrl: url }))} />

      {formData.imagenUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={formData.imagenUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      <button type="submit" style={buttonStyle}>
        Agregar Producto
      </button>
    </form>
  );
}

const formStyle = {
  maxWidth: '400px',
  margin: '1rem auto',
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
  fontWeight: 'bold',
};

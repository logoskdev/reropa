import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    subcategoria: '',
    estado: '',
    marca: '',
    talle: '',
    color: '',
    ubicacion: '',
    imagenes: [], // <-- array para múltiples imágenes
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [imagenesPreview, setImagenesPreview] = useState([]); // previews

  // Categorías y subcategorías
  const categorias = {
    Hombre: ['Ropa', 'Zapatillas', 'Accesorios', 'Cuidado personal', 'Otros'],
    Mujer: ['Ropa', 'Calzado', 'Carteras', 'Accesorios', 'Belleza', 'Otros'],
    Niño: ['Ropa', 'Calzado', 'Juguetes', 'Cochecitos', 'Muebles y decoración', 'Accesorios', 'Otros'],
    Casa: ['Electrodomésticos', 'Utensilios', 'Limpieza', 'Textil', 'Accesorios', 'Decoración', 'Herramientas', 'Seguridad', 'Exterior', 'Animales'],
    Electronicos: ['Consolas', 'Computadoras', 'Accesorios', 'Teléfonos', 'Auriculares', 'Tablets', 'TV', 'Belleza', 'Relojes', 'Otros'],
    Entretenimiento: ['Libros', 'Música', 'Video'],
    Hobbies: ['Coleccionables', 'Juegos de mesa', 'Puzzles', 'Sellos', 'Postales', 'Educación'],
    Deportes: ['Ciclismo', 'Fitness', 'Running', 'Yoga', 'Outdoor', 'Deportes acuáticos', 'Deportes en equipo', 'Deportes con raqueta', 'Golf', 'Equitación', 'Skates y patinetes', 'Boxeo y artes marciales', 'Deportes de invierno', 'Deportes y juegos casuales'],
  };

  const estados = ['Nuevo', 'Como nuevo', 'Usado'];

  const handleChange = (e) => {
    if (e.target.name === 'categoria') {
      setFormData(prev => ({
        ...prev,
        categoria: e.target.value,
        subcategoria: '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length > 3) {
      setError('Solo puedes subir hasta 3 imágenes');
      return;
    }

    setUploading(true);
    setError('');
    setExito('');

    try {
      const urls = [];
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // corrige según tu env var
        // Nota: Usar VITE_CLOUDINARY_UPLOAD_PRESET o VITE_CLOUDINARY_PRESET, según tengas en tu .env.local

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          form
        );
        urls.push(res.data.secure_url);
      }
      setFormData(prev => ({ ...prev, imagenes: urls }));
      setImagenesPreview(urls);
    } catch (err) {
      console.error(err);
      setError('Error subiendo las imágenes');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    const { titulo, descripcion, precio, categoria, subcategoria, estado, imagenes } = formData;
    if (!titulo.trim() || !descripcion.trim() || !precio || !categoria || !subcategoria || !estado || imagenes.length === 0) {
      setError('Por favor, completa todos los campos obligatorios (*)');
      return;
    }

    if (isNaN(precio) || Number(precio) <= 0) {
      setError('El precio debe ser un número mayor a 0');
      return;
    }

    try {
      await addDoc(collection(db, 'productos'), {
        ...formData,
        precio: Number(precio),
        creadoEn: serverTimestamp(),
      });
      setExito('Producto subido correctamente ✅');

      setFormData({
        titulo: '',
        descripcion: '',
        precio: '',
        categoria: '',
        subcategoria: '',
        estado: '',
        marca: '',
        talle: '',
        color: '',
        ubicacion: '',
        imagenes: [],
      });
      setImagenesPreview([]);
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto. Intenta nuevamente.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Agregar Producto</h2>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      {exito && <p style={{ color: 'green', marginBottom: '1rem' }}>{exito}</p>}

      <form onSubmit={handleSubmit}>

        <label>
          Título del producto *<br />
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Ej: Camiseta vintage"
          />
        </label>

        <label>
          Descripción *<br />
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={4}
            style={textareaStyle}
            placeholder="Detalles, estado, historia, etc."
          />
        </label>

        <label>
          Precio (ARS$) *<br />
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            style={inputStyle}
            placeholder="Ej: 59990"
          />
        </label>

        <label>
          Categoría *<br />
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="">Selecciona una categoría</option>
            {Object.keys(categorias).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Subcategoría *<br />
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            required
            disabled={!formData.categoria}
            style={selectStyle}
          >
            <option value="">
              {formData.categoria ? 'Selecciona una subcategoría' : 'Primero seleccioná una categoría'}
            </option>
            {formData.categoria &&
              categorias[formData.categoria].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))
            }
          </select>
        </label>

        <label>
          Estado *<br />
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="">Selecciona estado</option>
            {estados.map(est => (
              <option key={est} value={est.toLowerCase().replace(' ', '-')}>{est}</option>
            ))}
          </select>
        </label>

        <label>
          Marca (opcional)<br />
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: Nike, Apple"
          />
        </label>

        <label>
          Talle (opcional)<br />
          <input
            type="text"
            name="talle"
            value={formData.talle}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: M, 42, único"
          />
        </label>

        <label>
          Color (opcional)<br />
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: Rojo, negro"
          />
        </label>

        <label>
          Ubicación (opcional)<br />
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ej: Buenos Aires, Argentina"
          />
        </label>

        <label>
          Imágenes (hasta 3) *<br />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            required={formData.imagenes.length === 0}
            disabled={uploading}
            style={{ marginBottom: '1rem' }}
          />
        </label>

        {uploading && <p>Cargando imágenes...</p>}

        {imagenesPreview.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            {imagenesPreview.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Previsualización ${i + 1}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 8 }}
              />
            ))}
          </div>
        )}

        <button type="submit" disabled={uploading} style={buttonStyle}>
          {uploading ? 'Subiendo...' : 'Subir producto'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

const selectStyle = {
  ...inputStyle,
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

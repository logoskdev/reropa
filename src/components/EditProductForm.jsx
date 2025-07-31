import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function EditProductForm({ productId, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar datos actuales del producto
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !description || price === '') {
      alert('Por favor completá todos los campos');
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        name,
        description,
        price: Number(price),
      });
      alert('Producto actualizado con éxito');
      onClose();
    } catch (error) {
      alert('Error al actualizar producto: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '10px 0', textAlign: 'left' }}>
      <h3>Editar Producto</h3>
      <input
        type="text"
        value={name}
        placeholder="Nombre"
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        required
      />
      <textarea
        value={description}
        placeholder="Descripción"
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...inputStyle, height: '70px' }}
        required
      />
      <input
        type="number"
        value={price}
        placeholder="Precio"
        onChange={(e) => setPrice(e.target.value)}
        style={inputStyle}
        required
      />
      <div style={{ marginTop: '10px' }}>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={onClose} style={{ ...buttonStyle, marginLeft: '10px', backgroundColor: '#ccc', color: '#000' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '8px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import EditProductForm from './EditProductForm';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productosData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log(`Producto ${id} eliminado.`);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div>
      <h2>Lista de productos</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
            {editingId === product.id ? (
              <EditProductForm
                productId={product.id}
                onClose={() => setEditingId(null)}
              />
            ) : (
              <>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ maxWidth: '150px', display: 'block', marginBottom: '8px', borderRadius: '6px' }}
                  />
                )}
                <strong>{product.name}</strong> - ${product.price}
                <p>{product.description}</p>
                <button
                  onClick={() => setEditingId(product.id)}
                  style={{ marginRight: '10px' }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ color: 'red' }}
                >
                  🗑️ Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;

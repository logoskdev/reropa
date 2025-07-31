// src/pages/Galeria.jsx
import React, { useEffect, useState } from "react";
// Asegúrate que la ruta a tu config Firebase sea correcta, si está en src/firebase/config.js cambia aquí:
import { db } from "../firebase/config"; 
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Galeria = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categorias = [
    "Hombre",
    "Mujer",
    "Niño",
    "Calzado",
    "Abrigo",
    "Remeras",
    "Tecnología",
    "Perfumes",
    "Accesorios",
  ];

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(docs);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("Error al cargar productos. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(
        (p) =>
          p.categoria &&
          p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
      )
    : productos;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Galería de Productos</h1>

      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center col-span-full">Cargando productos...</p>
      ) : error ? (
        <p className="text-center col-span-full text-red-600">{error}</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-center col-span-full text-gray-500">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={
                  producto.imagenes?.[0] ||
                  producto.imagen || // por si usas campo imagen singular
                  "https://via.placeholder.com/300x300?text=Sin+Imagen"
                }
                alt={producto.titulo || "Producto"}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-2">
                <h2 className="text-lg font-semibold truncate">
                  {producto.titulo}
                </h2>
                <p className="text-sm text-gray-600">{producto.categoria}</p>
                <p className="font-bold">${producto.precio}</p>
                <Link
                  to={`/producto/${producto.id}`}
                  className="text-blue-500 text-sm mt-2 inline-block hover:underline"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galeria;

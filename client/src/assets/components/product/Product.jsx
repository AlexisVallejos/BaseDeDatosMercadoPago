import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import './Product.css';

// Inicializar MercadoPago
initMercadoPago('APP_USR-afa3f272-1e02-47d6-afa1-1b3adff62c59', {
  locale: 'es-AR',
});

const products = [
  {
    id: 1,
    title: 'Camiseta De La Selección Argentina 24',
    price: 100,
    image: 'https://static.wixstatic.com/media/78f33e_36283ed9d7234d7a91549c2a1e22976a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    category: 'Camisetas',
  },
  {
    id: 2,
    title: 'Camiseta De La Selección Brasil 24',
    price: 120,
    image: 'https://soccershopuy.net/cdn/shop/files/7e155b8fd0166107ec20109f02c8588e_1200x1200.webp?v=1711051427',
    category: 'Camisetas',
  },
  {
    id: 3,
    title: 'Camiseta De La Selección Francia 24',
    price: 150,
    image: 'https://soccershopuy.net/cdn/shop/files/84099b5c895e88af9888a609aaf885a9_150x150.webp?v=1711053827',
    category: 'Camisetas',
  },
  {
    id: 4,
    title: 'Camisete De Messi 2008 Barcelona FC',
    price: 80,
    image: 'https://funisboutique.com/cdn/shop/files/pixelcut-export-2024-07-31T174301.564.png?v=1722440590&width=480',
    category: 'Camisetas',
  },
  {
    id: 5,
    title: 'Camiseta De kaka 2007  AC Milan',
    price: 70,
    image: 'https://acdn.mitiendanube.com/stores/002/003/574/products/ac-milan-titular-retro-2006-2007-22-kaka-parche-uefa-champions-league-1-2da92d37c3ddd0fb5b17268776186223-1024-1024.png',
    category: 'Camisetas',
  },
  {
    id: 6,
    title: 'Short De Maradona AFA 94',
    price: 170,
    image: 'https://acdn.mitiendanube.com/stores/001/088/028/products/photoroom-20240118_181146-213f49d8c40c1b405017056264628952-480-0.png',
    category: 'Shorts',
  },
  {
    id: 7,
    title: 'Pelota Oficial del mundial 78 TANGO',
    price: 190,
    image: 'https://media.ambito.com/p/61f153c15c6cd6e562fc6a7a759aba30/adjuntos/239/imagenes/040/132/0040132402/730x0/smart/imagepng.png',
    category: 'Accesorios',
  },
  {
    id: 8,
    title: 'Camiseta De Maradona Copa Del Mundo 1986',
    price: 200,
    image: 'https://acdn.mitiendanube.com/stores/001/983/293/products/img_5275-5857628fea20488b3217081896217950-480-0.png',
    category: 'Camisetas',
  },
];

export default function CatalogoProductos() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const createPreference = async (product) => {
    try {
      const response = await axios.post('http://localhost:3000/create_preference', {
        title: product.title,
        quantity: 1,
        price: product.price,
      });
      const { id } = response.data;
      return id;
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      alert('Hubo un error al procesar el pago. Por favor, inténtelo de nuevo.');
    }
  };

  const handleBuyNow = async (product) => {
    const id = await createPreference(product);
    if (id) {
      setPreferenceId(id);
    }
  };

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category !== 'Todos') {
      result = result.filter((product) => product.category === category);
    }
    if (sortOrder === 'price_asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price_desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(result);
  }, [searchTerm, category, sortOrder]);

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-title">Catálogo de Productos</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="Todos">Todas las categorías</option>
          <option value="Camisetas">Camisetas</option>
          <option value="Shorts">Shorts</option>
          <option value="Accesorios">Accesorios</option>
        </select>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="default">Por defecto</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
        </select>
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" onClick={() => setSelectedProduct(product)} />
            <h3 className="product-title">{product.title}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price}</p>
            <button onClick={() => handleBuyNow(product)} className="buy-now-button">Comprar ahora</button>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedProduct(null)}>&times;</span>
            <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-image" />
            <h2>{selectedProduct.title}</h2>
            <p className="modal-category">{selectedProduct.category}</p>
            <p className="modal-price">${selectedProduct.price}</p>
            <button onClick={() => handleBuyNow(selectedProduct)} className="buy-now-button">Comprar ahora</button>
          </div>
        </div>
      )}
      {preferenceId && (
        <div className="mercadopago-button-container">
          <Wallet initialization={{ preferenceId: preferenceId }} />
        </div>
      )}
    </div>
  );
}
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Importa la función uuidv4 de la biblioteca uuid

// Generar un nuevo ID para productos
const generateProductId = () => {
  return uuidv4(); // Genera un nuevo UUID como ID de producto
};
// Crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
      id: generateProductId(), // Genera un nuevo ID de carrito
      products: [],
    };
  
    // Agregar el nuevo carrito al archivo "carrito.json"
    fs.readFile('carrito.json', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error al leer carrito' });
      } else {
        const carts = JSON.parse(data);
        carts.push(newCart);
  
        // Guardar los carritos actualizados en el archivo
        fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Error al crear carrito' });
          } else {
            res.status(201).json(newCart);
          }
        });
      }
    });
  });

// Listar un carrito por ID
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
  
    // Leer los carritos desde el archivo "carrito.json"
    fs.readFile('carrito.json', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error al leer carrito' });
      } else {
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
  
        if (cart) {
          res.json(cart);
        } else {
          res.status(404).json({ error: 'Carrito no encontrado' });
        }
      }
    });
  });
// Agregar un producto a un carrito
// Ruta POST para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1; // Añadir un producto de uno en uno
  
    // Leer los carritos desde el archivo "carrito.json"
    fs.readFile('carrito.json', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error al leer carrito' });
      } else {
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === cartId);
  
        if (cart) {
          // Comprueba si el producto ya está en el carrito
          const existingProduct = cart.products.find((p) => p.product === productId);
  
          if (existingProduct) {
            // Si existe, incrementa la cantidad
            existingProduct.quantity += quantity;
          } else {
            // Si no existe, agrega el producto al carrito
            cart.products.push({
              product: productId,
              quantity: quantity,
            });
          }
  
          // Guarda el carrito actualizado en el archivo
          fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), (err) => {
            if (err) {
              res.status(500).json({ error: 'Error al agregar producto al carrito' });
            } else {
              res.status(201).json(cart);
            }
          });
        } else {
          res.status(404).json({ error: 'Carrito no encontrado' });
        }
      }
    });
  });

module.exports = router;
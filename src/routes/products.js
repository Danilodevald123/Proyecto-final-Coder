const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Importa la función uuidv4 de la biblioteca uuid

// Generar un nuevo ID para productos
const generateProductId = () => {
  return uuidv4(); // Genera un nuevo UUID como ID de producto
};
// Obtener la lista de productos
router.get('/', async (req, res) => {
    try {
      const data = await fs.promises.readFile('productos.json');
      const products = JSON.parse(data);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al leer productos' });
    }
  });

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
  
    try {
      // Lee los productos desde el archivo "productos.json" en la carpeta actual (Routes)
      const data = await fs.promises.readFile('productos.json');
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.log(error); // Agrega esto para obtener más información sobre el error
      res.status(500).json({ error: 'Error al leer productos' });
    }
  });

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const newProduct = req.body;
  newProduct.id = generateProductId(); // Genera un nuevo ID

  // Validar campos obligatorios
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    res.status(400).json({ error: 'Campos obligatorios faltantes' });
  } else {
    // Leer los productos desde el archivo "productos.json"
    fs.readFile('productos.json', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error al leer productos' });
      } else {
        const products = JSON.parse(data);
        products.push(newProduct);

        // Guardar los productos actualizados en el archivo
        fs.writeFile('productos.json', JSON.stringify(products, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Error al agregar producto' });
          } else {
            res.status(201).json(newProduct);
          }
        });
      }
    });
  }
});

// Actualizar un producto por ID
// Ruta PUT para actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
  
    // Validar campos obligatorios
    if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.code || !updatedProduct.price || !updatedProduct.stock || !updatedProduct.category) {
      res.status(400).json({ error: 'Campos obligatorios faltantes' });
      return;
    }
  
    try {
      const data = await fs.promises.readFile('productos.json');
      const products = JSON.parse(data);
      const existingProductIndex = products.findIndex((p) => p.id === productId);
  
      if (existingProductIndex !== -1) {
        // Mantén el ID del producto
        updatedProduct.id = productId;
        products[existingProductIndex] = updatedProduct;
  
        await fs.promises.writeFile('productos.json', JSON.stringify(products, null, 2));
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.log(error); // Agrega esto para obtener más información sobre el error
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  });
// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  // Leer los productos desde el archivo "productos.json"
  fs.readFile('productos.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error al leer productos' });
    } else {
      const products = JSON.parse(data);
      const productIndex = products.findIndex((p) => p.id === productId);

      if (productIndex !== -1) {
        products.splice(productIndex, 1);

        // Guardar los productos actualizados en el archivo
        fs.writeFile('productos.json', JSON.stringify(products, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Error al eliminar producto' });
          } else {
            res.json({ message: 'Producto eliminado' });
          }
        });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    }
  });
});

module.exports = router;
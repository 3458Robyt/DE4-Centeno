const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
const handlebars = exphbs.create({
    layoutsDir: __dirname + '/views/layouts', // Ruta a la carpeta de layouts
    defaultLayout: null, // Desactiva el uso de un layout por defecto
  });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));

// Datos simulados para productos (reemplaza con tu propia lógica)
let productos = ['Producto 1', 'Producto 2', 'Producto 3'];

// Ruta raíz
app.get('/', (req, res) => {
  res.render('index', { productos });
});

// Ruta "/realtimeproducts"
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Cuando un cliente se conecta, envía la lista de productos
  socket.emit('actualizarProductos', { productos });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

  socket.on('agregarProducto', (data) => {
    // Lógica para agregar un nuevo producto (reemplaza con tu propia lógica)
    const nuevoProducto = data.nombre;
    productos.push(nuevoProducto);

    // Actualizar la lista de productos y emitir la actualización a todos los clientes
    io.emit('actualizarProductos', { productos });
  });
});

server.listen(3000, () => {
  console.log('Servidor en ejecución en http://localhost:3000');
});
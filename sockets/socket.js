const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Cuarteto'));
bands.addBand(new Band('Los Bunkers'));
bands.addBand(new Band('Kudai'));

console.log(bands);

//Mensajes de sockets
io.on('connection',client=>{

    client.emit('active-bands',bands.getBands());

    console.log('Cliente conectado');
    client.on('disconnect',() => {
        console.log('Cliente desconectado');
    });
    client.on('mensaje',(payload)=>{
        console.log("!Mensaje",payload);
        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });
    client.on('emitir-mensaje',(payload)=>{
        console.log('Emitiendo');
        //para mandar a todos menos al q lo emite
        client.broadcast.emit('nuevo-mensaje',payload);

    });
    client.on('vote-band',(payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band',(payload)=>{
        const newBand = new Band(payload.name);
        bands.addBand(newBand),
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',(payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });
});

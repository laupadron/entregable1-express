

// servidor con express
// express esta hecho a base de middlewares=>es una funcion
// 3 tipos de middlewares: 
// 1.de aplicacion: f que nos prevee express para interactuar 
//con ntra app(GET;POST;DELETE,ETC)
// 2.incorporados
// 3.de terceros


// el USE responde a cualquier metodo, si no le ponemos 
//ruta responde a todas las rutas
// app.use((req,res)=>{
//  res.send('respondiendo a todo')
// })

// app.get('/users',(req,res)=>{
//  res.send('hola desde express');
// });
const express= require('express');
const path=require('path');
const fs= require('fs/promises');

const app=express();

app.use(express.json());

const jsonPath=path.resolve('./files/tasks.json');

app.get('/tasks',async(req,res)=>{
 // obtener el JSON
 const jsonFile=await fs.readFile(jsonPath, 'utf-8');
 // enviar la respuesta
 res.send(jsonFile);
});

app.post('/tasks',async(req,res)=>{
// nos envian la info dentro del body de la peticion
 const task= req.body;
 // obtener el arreglo desde el json file
 const taskArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
 // generar id
 const lastIndex= taskArray.length-1;
 const newId=taskArray[lastIndex].id+1;
 // agreagar el usuario en el arreglo
 taskArray.push({...task,id:newId});
 // escribir la info en el JSON
 await fs.writeFile(jsonPath, JSON.stringify(taskArray));
 res.end();
});

app.delete('/tasks',async(req,res)=>{
 // nos envian la info dentro del body de la peticion
 const task= req.body;
  // obtener el arreglo desde el json file
  const taskArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
 // logica para el delete
 const index = taskArray.findIndex(e => e.id === task.id);
 taskArray.splice(index,1);
 await fs.writeFile(jsonPath, JSON.stringify(taskArray));
 res.end();
});

app.put('/tasks',async(req,res)=>{
 const {title, description,status,id}= req.body;
 const taskArray=JSON.parse(await fs.readFile(jsonPath,'utf-8'));
 const index = taskArray.findIndex(e => e.id === id);
 
 if(index>=0){
  taskArray[index].status=status
 }
 await fs.writeFile(jsonPath, JSON.stringify(taskArray));
 res.end();
});

const PORT=8000;

app.listen(PORT, ()=>{
 console.log(`servidor escuchando en el puerto ${PORT}`);
});
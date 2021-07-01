//const app = require('../../config/server');
const bcryptjs = require('bcryptjs');
const connection = require('../../config/db');

module.exports = (app)=>{

    let flagLogin =false;
    
    //gets
    app.get('/cerrar-sesion' , (req , res)=>{
        
        flagLogin = false;
        res.redirect('/');
    
    })

    app.get('/registrarUsuario' , (req , res)=>{
    
       if (flagLogin) {
           res.render('../views/ventanas/usuario/registroUsuario.ejs');
       }
    
    })

    app.get('/' , (req , res)=>{
       res.render('../views/ventanas/login/login.ejs');
    });

    app.get('/main' , async(req , res)=>{
        if (flagLogin) {
            try {
                await connection.query('SELECT * FROM usuario',(err,result)=>{
                    try {
                        res.render('../views/ventanas/main/main.ejs',{
                            usuario:result
                        });
                    } catch (error) {
                        console.error(`Error de la consulta ${err}`);
                        console.error(`Error del catch 2 ${error}`);
                    }
                });
            } catch (error) {
                console.error(`Error del catch ${error}`);
            }
        }else{
            res.redirect('/');
        }
       
    });

    app.get('/delete/:idUsuario' , async(req , res)=>{
       const idUsuario = req.params.idUsuario;
        await connection.query('DELETE FROM usuario WHERE idUsuario = ?',[idUsuario],(err)=>{
            try {
                if (err) {
                    res.send(err);
                }else{
                    connection.query('SELECT * FROM usuario', (err,result)=>{
                        try {
                            res.render('../views/ventanas/main/main.ejs',{
                                alert:true,
                                alertTitle: 'Eliminado',
                                alertMessage: "Usuario eliminado",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: "main",
                                usuario:result
                            })
                        } catch (error) {
                            console.error(`Error de la consulta ${err}`);
                            console.error(`Error del catch ${error}`);
                        }

                    });
                }
            } catch (error) {
                console.error(`Error de la consulta ${err}`);
                console.error(`Error del catch ${error}`);
            }
        });
    });

    app.get('/usuariosActivos' , async(req , res)=>{
        
        if (flagLogin) {

            try {
                await connection.query("SELECT * FROM usuario WHERE estado = 'Activo'",(err, result)=>{
                    try {
                        res.render('../views/ventanas/usuario/usuarioActivo.ejs',{
                            usuario:result
                        });
                    } catch (error) {
                        console.error(`Error del catch ${error}`);
                        console.error(`Error de la consulta ${err}`);
                    }
                });
            } catch (error) {
                console.error(`Error del catch 1 ${error}`);
            }
            
        }else{
            res.redirect('/');
        }
    })

    //post
    app.post('/auth' , async(req , res)=>{
        const {email, password} = req.body;
        if (email && password) {
            try {
                await connection.query('SELECT * FROM administrador WHERE nombreUsuario = ?',email,(err, result)=>{
                    console.log(result);
                    try {
                        if (password===result[0].pass) {
                            flagLogin=true;
                            res.render('../views/ventanas/login/login.ejs',{
                                alert: true,
                                alertTitle: "Inicio de session",
                                alertMessage: "Inicio de session éxitoso",
                                alertIcon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: 'main'   
                            })
                        }else if (password!==result[0].pass) {
                            res.render('../views/ventanas/login/login.ejs',{
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "Usuario y/o contraseña incorrecta",
                                alertIcon: "warning",
                                showConfirmButton: true,
                                timer: false,
                                ruta: '/'
                            });

                            
                        }
                    } catch (error) {
                        res.render('../views/ventanas/login/login.ejs',{
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "Usuario y/o contraseña incorrecta",
                            alertIcon: "warning",
                            showConfirmButton: true,
                            timer: false,
                            ruta: '/'
                        });

                        console.error(`Error de la consulta ${err}`);
                        console.error(`Error del segundo catch ${err}`);
                    }
                });
            } catch (error) {
                console.error(`Error del primer try ${error}`);
            }
        }
    
    });

    app.post('/datosUsuario' , async(req , res)=>{
    
    const {id,nombre, apellido, usuario, password,horario} = req.body;

    let hashPass = await bcryptjs.hash(password, 8);
    
    console.log(req.body);

    try {
        connection.query('INSERT INTO usuario SET ?',{
            idUsuario:id,
            nombre:nombre,
            apellido:apellido,
            pass:hashPass,
            nombreUsuario:usuario,
            estado:horario,
        },(err)=>{
            if (err) {
                console.error(err);
            }else{
                res.render('../views/ventanas/usuario/registroUsuario.ejs', {
                    alert:true,
                    alertTitle: 'Registro',
                    alertMessage: "Registro Exitoso",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: "registrarUsuario"
                })
            }
        });
    } catch (error) {
        console.error(`Error del catch ${error}`);
    }
    
    });

    app.post('/edit/:idUsuario' , async(req , res)=>{
    
        const idUsuario = req.params.idUsuario;
        const {id,nombre, apellido, usuario, estado} = req.body;
        
        await connection.query('UPDATE usuario SET nombre = ? , apellido = ?, nombreUsuario = ?, estado = ?,idUsuario = ? WHERE idUsuario = ?', [nombre,apellido, usuario, estado,id, idUsuario],(err, result)=>{

        try {
            if (err) {
                console.error(`Error de la consulta ${err}`);
            }else{
                connection.query('SELECT * FROM usuario', (err,result)=>{
                    try {
                        res.render('../views/ventanas/main/main.ejs',{
                            alert:true,
                            alertTitle: 'Editado',
                            alertMessage: "Usuario Editado",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: "main",
                            usuario:result
                        })
                    } catch (error) {
                        console.error(`Error de la consulta ${err}`);
                        console.error(`Error del catch ${error}`);
                    }

                });
            }
        } catch (error) {
            console.error(`Error de la consulta ${err}`);
            console.error(`Error del catch${error}`);
        }
        });
    
    });


}
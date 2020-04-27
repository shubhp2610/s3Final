const express = require('express');
const jwt = require('jsonwebtoken');
var path = require('path');
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
var mkdirp = require('mkdirp');
var fs = require('fs');
var rimraf = require("rimraf");
var con = mysql.createConnection({
  host: "stackapi.net",
  user: "root",
  password: "shubhpatel2610",
  database: "s3"
});
con.connect(function(err) {
    if (err) {
        console.log("//ERROR//");
        console.log(err);
    }
});

const app = express();
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/views')));
app.set("view engine", "ejs"); 
var bkt = [];
var bktId = [];
var fileid = [];
var file = [];
var filetype = [];
var tkn = null;
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/signup.html'));
  });

  app.get('/signme', (req, res) => {
       //  console.log(req.body);
    var username = req.query.username;
    var password = req.query.password;
try{
    var id = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    sql = 'INSERT INTO login (id, username, password) VALUES (\''+id+'\',\''+username+'\',\''+password+'\')';
    con.query(sql, function (err, result,fields) {
      if (err) throw err;
     
          res.redirect('/');
    });}catch(e){
        console.log(e)
    }
  });
    //  console.log(req.body);
    
    


app.get('/dashboard', verifyToken, (req, res) => {  
    bkt =[];bktId=[];
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
        try{
            sql = 'SELECT * FROM buckets where owner = \''+authData.user.id+'\'';
            console.log(sql);
            con.query(sql, function (err, result,fields) {
              if (err) throw err;
              if(Object.keys(result).length === 0){
                    bkt[0] = "No bucket";
              }else{
                for(i=0;i<Object.keys(result).length;i++){
                    bkt[i] = result[i].name;
                    bktId[i]= result[i].id;
                }  var len = Object.keys(result).length;
              }     res.render("index", { data: authData, bkts : bkt, bktid : bktId, bkl : len});            
             });
            }catch(err){
             console.log(err);
         }
    
    
    // res.sendFile(path.join(__dirname + '/index.html', { username: authData }));

    }
  });
});
app.get('/dashboard/:bkt', (req, res) => {  

    file =[];fileid=[];filetype=[];chk=[];linkd=[];link=[];shd=[];sh=[];
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        try{
          sql = 'SELECT * FROM buckets where name = \''+req.params.bkt+'\' AND owner = \''+authData.user.id+'\'';
          console.log(sql);
          con.query(sql, function (err, result,fields) {
            if (err) throw err;
            if(Object.keys(result).length === 0){
              res.sendStatus(403);
            }else{

          try{
              sql = 'SELECT * FROM files where bucketname = \''+req.params.bkt+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                var len = Object.keys(result).length; 
                if(len=== 0){
                  file[0] = "NO FILES";
                }else{
                  console.log("+++++"+Object.keys(result).length);
                    var re = /(?:\.([^.]+))?$/;
                  for(i=0;i<len;i++){
                      file[i] = result[i].name;
                      fileid[i]= result[i].id;
                      filetype[i] = "http://s3.shubh/assets/icon/"+re.exec(result[i].name)[1]+".svg"; 
                      if(result[i].public != null){chk[i]="checked";linkd[i]="inline-block";link[i]=result[i].public;}else{chk[i]="";linkd[i]="none";link[i]="";}
                      if(result[i].share != null){shd[i]="inline-block";sh[i]=result[i].share;}else{shd[i]="none";sh[i]=""; }
                      console.log(link[i])
              
                  }                     

                }                          res.render("file", { data: authData, file : file, fileid : fileid, fl : len, ft : filetype , bktname : req.params.bkt, chk:chk,linkd:linkd,link:link,shd:shd,sh:sh}); 
        
               });
              }catch(err){
               console.log(err);
           }
          }
          });
        }catch(err){
         console.log(err);
     }
      }
    });
  });
app.get('/logout', (req, res) => {  
    tkn=null;
    res.redirect('/')
  });
app.get('/login', (req, res) => {
  var username = req.query.username;
  var password = req.query.password;

try{
  sql = 'SELECT * FROM login where username = \''+username+'\' AND password = \''+password+'\'';
  con.query(sql, function (err, result,fields) {
    if (err) throw err;
    if(result.length>0){
    const user = {
      id:result[0].id,
      username: username,
      password: password
    }
  
    jwt.sign({user}, 'secretkey', { expiresIn: '3600s' }, (err, token) => {
        tkn = token;
        res.redirect('/dashboard')
  
    });
  }else{
      res.redirect('/')
  }
  });}catch(e){
      console.log(e)
  }
});
    
app.get('/addBucket', verifyToken, (req, res) => {  
    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        if(req.query.bkt){
            try{
                sql = 'SELECT * FROM buckets where name = \''+req.query.bkt+'\'';
                con.query(sql, function (err, result,fields) {
                  if (err) throw err;
                  if(Object.keys(result).length === 0){
                    try{
                       var id = '';
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < 50; i++ ) {
                          id += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        sql2 = 'INSERT INTO buckets (id, name, owner) VALUES (\''+id+'\',\''+req.query.bkt+'\',\''+authData.user.id+'\')';
                        con.query(sql2, function (err, resultw2,fields) {
                          if (err) throw err;
                          console.log(authData.user.id+" Added"); 
                          mydir = __dirname + '\\uploads\\'+req.query.bkt;
                          console.log(mydir)
                          mkdirp(mydir).then(made =>
                            console.log(`made directories, starting with ${made}`))

                                res.redirect('/dashboard');
                                });
                            }catch(err){
                                console.log(err);
                            }
                  }else{
                    res.sendFile(path.join(__dirname + '/mkbkt.html'));
                }
        
        });
            }catch(err){
                console.log(err);
            }
          
        }else{
            res.sendFile(path.join(__dirname + '/mkbkt.html'));
          }

       //res.render("index", { data: authData });
      
  
      }
    });
  });
  app.get('/fileUpload', (req, res) => {
     res.render("up", { bkt: req.query.bkt});            

  });

  app.post('/upload',verifyToken,function(req, res) {
    if(tkn!=null){
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      console.log(authData)
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
  
    console.log('req.files >>>', req.files); // eslint-disable-line
  
    sampleFile = req.files.sampleFile;
  
    uploadPath = __dirname + '/uploads/'+req.body.bkt +'/'+ sampleFile.name;
  
    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
  
      try{
        var id = '';
         var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
         var charactersLength = characters.length;
         for ( var i = 0; i < 100; i++ ) {
           id += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
         sql2 = 'INSERT INTO files (id, name, bucketname, owner) VALUES (\''+id+'\',\''+sampleFile.name+'\',\''+req.body.bkt+'\',\''+authData.user.id+'\')';
         con.query(sql2, function (err, resultw2,fields) {
           if (err) throw err;
           console.log(authData.user.id+" Added");
                 res.redirect('/dashboard/'+req.body.bkt);
                 });
             }catch(err){
                 console.log(err);
             }

      //res.send('File uploaded to ' + uploadPath);
    });
  });
}else{
  res.sendStatus(403);
}
  });

  app.get('/file/:fileid', (req, res) => {  
    if(req.params.fileid.length==15){
      try{
        sql = 'SELECT * FROM files where public = \''+req.params.fileid+'\'';
        console.log(sql);
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          if(Object.keys(result).length === 0){
            res.sendStatus(404);
          }else{
            var fn = result[0].name;
            var bn = result[0].bucketname;
            res.download(__dirname+'/uploads/'+bn+'/'+fn)
          }                          
  
         });
        }catch(err){
         console.log(err);
     }
    }else{
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          try{
              sql = 'SELECT * FROM files where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                if(Object.keys(result).length === 0){
                  res.sendStatus(404);
                }else{
                  var fn = result[0].name;
                  var bn = result[0].bucketname;
                  res.download(__dirname+'/uploads/'+bn+'/'+fn)
                }                          
        
               });
              }catch(err){
               console.log(err);
           }
          
      }
    });
  }
  });

  app.get('/delete/:fileid', (req, res) => {  
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
        if(req.params.fileid.length == 100){
          try{
              sql = 'SELECT * FROM files where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                if(Object.keys(result).length === 0){
                  res.sendStatus(404);
                }else{
                  var fn = result[0].name;
                  var bn = result[0].bucketname;
                  fs.unlink(__dirname+'/uploads/'+bn+'/'+fn, function(error) {
                    if (error) {
                        throw error;
                    }
                    console.log('Deleted' + bn +'/'+fn);
                    try{
                      sql = 'DELETE FROM files where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
                      console.log(sql);
                      con.query(sql, function (err, result,fields) {
                        if (err) throw err;
                      });
                    }catch(err){
                      console.log(err);
                  }


                    res.redirect('/dashboard/'+bn);
                });
                           
                
              }
               });
              }catch(err){
               console.log(err);
           }
          }if(req.params.fileid.length == 50){
            try{
              sql = 'SELECT * FROM buckets where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                if(Object.keys(result).length === 0){
                  res.sendStatus(404);
                }else{
                  var bn = result[0].name;
                  //var bn = result[0].bucketname;
                  rimraf(__dirname+'/uploads/'+bn, function () { 
                    console.log('Deleted' + bn );
                    try{
                      sql = 'DELETE FROM buckets where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
                      console.log(sql);
                      con.query(sql, function (err, result,fields) {
                        if (err) throw err;
                      });
                    }catch(err){
                      console.log(err);
                  }


                    res.redirect('/dashboard');
                });
                           
                
              }
               });
              }catch(err){
               console.log(err);
           }
          }
          
      }
    });
  });


  app.get('/makePublic/:fileid', (req, res) => {  
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          try{
              sql = 'SELECT * FROM files where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                if(Object.keys(result).length === 0){
                  res.sendStatus(404);
                }else{
                  if(result[0].public==null || result[0].public=="NULL" || result[0].public==""){
                  try{
                    var id = '';
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < 15; i++ ) {
                          id += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                    sql = 'UPDATE files SET public = \''+id+'\' WHERE id = \''+req.params.fileid+'\'';
                    console.log(sql);
                    con.query(sql, function (err, result2,fields) {
                      if (err) throw err;
                      console.log(result)
                      res.redirect('/dashboard/'+result[0].bucketname)
                    });
                  }catch(err){
                    console.log(err);
                }
              }else{
                try{
                  sql = 'UPDATE files SET public = NULL WHERE id = \''+req.params.fileid+'\'';
                  console.log(sql);
                  con.query(sql, function (err, result3,fields) {
                    if (err) throw err;
                    res.redirect('/dashboard/'+result[0].bucketname)
                  });
                }catch(err){
                  console.log(err);
              }
              }
                }                          
        
               });
              }catch(err){
               console.log(err);
           }
          
      }
    });
  });
  app.get('/share/:fileid', (req, res) => {  
    jwt.verify(tkn, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          try{
              sql = 'SELECT * FROM files where id = \''+req.params.fileid+'\' AND owner = \''+authData.user.id+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
                if(Object.keys(result).length === 0){
                  res.sendStatus(404);
                }else{
                  if(result[0].share==null || result[0].share=="NULL" || result[0].share==""){
                  try{
                    var id = '';
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < 5; i++ ) {
                          id += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                    sql = 'UPDATE files SET share = \'share'+id+'\' WHERE id = \''+req.params.fileid+'\'';
                    console.log(sql);
                    con.query(sql, function (err, result2,fields) {
                      if (err) throw err;
                      console.log(result)
                      res.redirect('/dashboard/'+result[0].bucketname)
                    });
                  }catch(err){
                    console.log(err);
                }
              }else{
                try{
                  sql = 'UPDATE files SET share = NULL WHERE id = \''+req.params.fileid+'\'';
                  console.log(sql);
                  con.query(sql, function (err, result3,fields) {
                    if (err) throw err;
                    res.redirect('/dashboard/'+result[0].bucketname)
                  });
                }catch(err){
                  console.log(err);
              }
              }
                }                          
        
               });
              }catch(err){
               console.log(err);
           }
          
      }
    });
  });

  app.get('/dl/:fileid', (req, res) => {  
    if(req.params.fileid.length==10){
      try{
        sql = 'SELECT * FROM files where share = \''+req.params.fileid+'\'';
        console.log(sql);
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          if(Object.keys(result).length === 0){
            res.sendStatus(404);
          }else{
            var fn = result[0].name;
            var bn = result[0].bucketname;
            try{
              sql = 'UPDATE files SET share = NULL WHERE share = \''+req.params.fileid+'\'';
              console.log(sql);
              con.query(sql, function (err, result,fields) {
                if (err) throw err;
              });}catch(err){
                console.log(err);
              }
            res.download(__dirname+'/uploads/'+bn+'/'+fn)
            

          }                          
  
         });
        }catch(err){
         console.log(err);
     }
    }else{
      res.json({msg: "Not found!"})
    }
  });
    

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//verify bkt present
/*function bktPresent(bktname){
    try{
        sql = 'SELECT * FROM buckets where name = \''+bktname+'\'';
        con.query(sql, function (err, result,fields) {
          if (err) throw err;
          console.log(Object.keys(result).length);
          if(Object.keys(result).length === 0){
            return 0;
          }else{
            return 1;
          }

});
    }catch(err){
        console.log(err);
    }
}*/




// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = 'Bearer '+tkn;
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(80, () => console.log('Server started on port 80'));
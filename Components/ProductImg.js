import {useState} from 'react'
import Link from 'next/link' 
import {firebaseG} from '../Firebase/FirebaseConf'
const db = firebaseG.firestore()
const auth =  firebaseG.auth()
export default function ProductImg(props) {

const [datosEmpresa, setDatosEmpresa] = useState([])
if(datosEmpresa.length === 0){
  auth.onAuthStateChanged(async user=>{
    if(user != null){
      const docs = []
      await db.collection(props.correo).doc('datosUsuario').get().then(doc =>{
        docs.push({...doc.data()})
        setDatosEmpresa(docs)
      })
    }
  })
}
  return (
    <>
        {datosEmpresa.length != 0?
        <>
        <style jsx
        >{
            `#percentuale{
            width:300px;
            height: 60px;
            right: 0px;
            top: 3px;
            position:absolute;
            background-image: url('${datosEmpresa[0].imagenEmpresa}');
            background-position: center;
            background-size: cover;
            }
            #left{
              
              height: 400px;
              background-image: url('${datosEmpresa[0].imagenEmpresa}');
              background-position: center;
              background-size: cover;
            }
            .logo{ 
              width:150px;
              height:150px;
              text-align:center;
              border-radius:50%;
            }
            h2{
              font-size:40px;
              text-align:center;
            }

            `
        }
        </style>
        <a>
          <Link href={`/Productos/${props.id}`}>
      <section id="card-city">
        <div id="left">
          <div id="left-bottom">
           
          
          </div>
        </div>
        <div id="right">
          <div id="right_top">

            <h2> {datosEmpresa[0].nombreEmpresa} </h2>
            <div id="circle"></div>
            <div class="squares" id="square_topdx"></div>
            <div class="squares" id="square_topsx"></div>
            <div class="squares" id="square_bottomsx"></div>
            <div class="squares" id="square_bottomdx"></div>
          </div>
          <div id="right_middle">
            <p id="text">
            <img className="logo" src={datosEmpresa[0].imagenLogo}/>
            <h3>Direccion:</h3> <span> {datosEmpresa[0].direccionEmpresa}</span> <br></br>
            <h3>Numero:</h3> <span>{datosEmpresa[0].numeroEmpresa} </span>         

            </p>
            <div id="line"></div>
            <div id="big_circle"></div>
            <div id="small_circle"></div>
          </div>
          <div class="little_dots" id="dot1">
            {" "}
          </div>
          <div class="little_dots" id="dot2">
            {" "}
          </div>
          <div class="little_dots" id="dot3">
            {" "}
          </div>
        </div>
      </section>
      </Link>
     
      </a>
      </> 
      :console.log('')}
    </>
  );
}

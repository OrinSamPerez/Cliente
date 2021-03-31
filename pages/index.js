import {useState,useEffect} from "react";
import SearchIcon from '@material-ui/icons/Search';
import ProductImg from '../Components/ProductImg'
import Head from 'next/head'
import {firebaseG} from '../Firebase/FirebaseConf'
const db = firebaseG.firestore()
const auth =  firebaseG.auth()
export default function Home() {
  const [searchArray,setSearchArray ] = useState([])
  const [ rowProducto, setRowProducto ] = useState([])
  
  if(rowProducto.length === 0 ){
    auth.onAuthStateChanged(async user =>{
      if(user != null){
        const docs =[]
        db.collection('Empresa').get().then(docus =>{
            docus.forEach(doc =>{
              docs.push({...doc.data(), id:doc.id})
            })
            setRowProducto(docs)
        })

      }
    })
  }

  const changeSEARCH = (e)=>{
    let palabraBuscar = e.target.value
    let numeroPalabraBuscar = palabraBuscar.length;

    const result = rowProducto.filter(word => {
      const PalabraProducto = word.nameEmpresa; 
      const caracterPalabrasActual = PalabraProducto.substr(0,numeroPalabraBuscar) 
      return caracterPalabrasActual.toLowerCase()  === palabraBuscar.toLowerCase() 
    })
    setSearchArray(result)
  }
  return (
    <div>
    <Head>
      <title>Home</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main className="app-container">
    <div className="searchGlobal">
      <form>
        <input onChange={changeSEARCH} type="text" placeholder="Buscar empresa aqui..."/>
      </form>
      <div className="searchIcon"><SearchIcon/></div>
    </div>
      <div >
      {
        searchArray.length === 0?
        rowProducto.map(row=>
          <ProductImg correo={row.correoEmpresa} id={row.id}/>

        )
      :searchArray.map(row=>
          <ProductImg correo={row.correoEmpresa}  id={row.id}/>

        )
      }
      </div>
      </main>
    </div>
  )
}

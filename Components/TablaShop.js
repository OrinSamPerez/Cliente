import React,{useState, useEffect} from "react";
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import {firebaseG} from '../Firebase/FirebaseConf'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { ToastContainer, toast } from 'react-toastify';
const db = firebaseG.firestore()
export default function TablaShop(props){
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    const fecha = new Date();
    const [hora, setHora] = useState()
    const [getItemsData, setGetItemsData] = useState([])
    const horaActual = (`${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`)
    setTimeout(()=>{
        setHora(horaActual)
    },1000)
    const valueSend = {
      diaActual:`${fecha.getDate()}/${meses[fecha.getMonth()]}/${fecha.getFullYear()}`,
      horaActual:`${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
      productos:[],
      email:'',
      Total:'',
      subTotal:'',
    }
    const [ sendFactura, setSendFactura ] = useState(valueSend)

  let TOTAL = 0;
  let SUBTOTAL = 0;
  const getData =()=>{
    firebaseG.auth().onAuthStateChanged(async (user)=>{
      firebaseG.firestore().collection(user.email).doc('Facturas-Clientes').collection(props.id).onSnapshot((querySnapshot)=>{
        const docs = [];
        querySnapshot.forEach(doc =>{
          docs.push({...doc.data(),id:doc.id})
          
        })
        setGetItemsData(docs);
      });
      })
    }
    //Total y subtotal
        getItemsData.map(row=>{
          SUBTOTAL += row.precio * row.cantidadSeleccionada
          TOTAL += ((((row.precio * row.cantidadSeleccionada ) * 18)/100) + (row.precio * row.cantidadSeleccionada)) - (((row.precio * row.cantidadSeleccionada ) * row.descuento)/100 ) 
        })
       
    
      const [ empresaE,emailEmpresa] = useState([])
      
        firebaseG.auth().onAuthStateChanged(async user =>{
          if(user != null){
            firebaseG.firestore().collection(user.email).doc('ListaCotizacion').collection('ListaCotizacion').doc(props.id).get().then(doc=>{
              const docs = [];
              if(doc.exists){
                docs.push(doc.data())
              }
              emailEmpresa(docs)
            })
          }
        
        })

    useEffect(()=>{
      getData()
    },[])
    const onDelete = (id) => {
        const opcion = confirm('¿Seguro que lo desea eliminar?')
        if(opcion === true){
          firebaseG.auth().onAuthStateChanged(async (user) => {
            await db.collection(user.email).doc('Facturas-Clientes').collection(props.id).doc(id).delete();
            toast.info('Se ha eliminado correctamente', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
          })
        }

  }

  const onDeleteClick = (id)=>{
    const opcion = confirm('¿Seguro que lo desea eliminar?')
      if(opcion === true){
        firebaseG.auth().onAuthStateChanged(async (user) => {
          await db.collection(user.email).doc('ListaCotizacion').collection('ListaCotizacion').doc(id).delete();
          getItemsData.map(async doc =>{
            await db.collection(user.email).doc('Facturas-Clientes').collection(props.id).doc(doc.id).delete();
          })
          toast.info('Se ha eliminado correctamente', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        
        })
      }
 
}
  
  const enviarFactura = async () =>{
    sendFactura.Total = TOTAL
    sendFactura.subTotal = SUBTOTAL
    sendFactura.productos = getItemsData
         firebaseG.auth().onAuthStateChanged(async user=>{
          if(user != null){
            sendFactura.email = user.email
            if(empresaE.empresaEmail != 'undefined')
            {
                 await firebaseG.firestore().collection(empresaE[0].empresaEmail).doc('Clientes-Facturas').collection('Clientes-Facturas').doc().set(sendFactura)
                await firebaseG.firestore().collection(user.email).doc('ListaCotizacion').collection('ListaCotizacion').doc(props.id).update({"estado":"Enviada - No Pagada"}) 
                toast.success('¡La cotizacion se ha enviado correctamente ✅!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  });
          }
        }  
      })
  }
  const onCancel = ()=>{
    firebaseG.auth().onAuthStateChanged(async user=>{
      if(user != null){
        await firebaseG.firestore().collection(empresaE[0].empresaEmail).doc('Clientes-Facturas').collection('Clientes-Facturas').doc(user.email).delete()
        await firebaseG.firestore().collection(user.email).doc('ListaCotizacion').collection('ListaCotizacion').doc(props.id).update({"estado":"No Enviada"})  
        props.buttonClose()
        toast.success('¡La cotizacion se ha cancelado correctamente ✅!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });

      }
    })
  }

  const reporte= ()=>{
    //var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre")
    
      
            
           
            
           // var fechaA = new Date();
            var logo= new Image();
            //logo.src='logo.png';
            const docu = new jsPDF()
            //docu.addImage(logo, 'JPEG',30,5,15,15);
            docu.text(10,25,`Factura`)
            
          //  docu.text(150,25,`${fechaA.getDate()}/${meses[fechaA.getMonth()]}/${fechaA.getUTCFullYear()}` )
            docu.text(75,35, `COTIZACION`)
            
          
            docu.autoTable({
              startY:45,
              html: '#cotizacion' ,
              
            })
             
            docu.save(`cotizacion.pdf`)
         
      
    }
  return(
    <>
        <div className="products products-table">

<div className="cart-page product">
<div className="cart-page-container">
<div className="cart-page-header">
  <div className="cart-header-footer">
    <Link href={`/Productos/${props.id}`} className="cart-header-cta" target="_blank">Continuar buscando</Link>
  </div>
</div>
<div className="cart-page-header page-order-received">
  <div className="cart-header-notice">
    <span className="cart-header-icon"><i className="fa fa-check" aria-hidden="true"></i></span>
    <span className="cart-header-text">Gracias. Por ordenar con nosotros.</span>
  </div> 
  <div className="cart-order-received">
    <div className="order-received-col received-col-mobile">
      <span className="">Fecha:</span>
      <span className="bold-text">{meses[fecha.getMonth()]} /{fecha.getDate()}/ {fecha.getFullYear()}</span>
      <span className="bold-text">Hora: {hora}</span>
    </div>
    <div className="order-received-col">
      <span className="">Empresa:</span>
      <span className="bold-text">{props.id}</span>
    </div>
    <Button onClick={()=>onDeleteClick(props.id)} variant="outlined" color="secondary">
       Elminar factura <RestoreFromTrashIcon />
    </Button>
  </div>
</div>


<div className="cart-page-table">
  <table id="cotizacion"   className="cart-table-product">
    <thead>
      <tr className="cart-table-header">
        <th className="cart-table-size">Producto</th>
        <th className=" cart-table-size">Precio</th>
        <th className=" cart-table-size">Cantidad</th>
        <th className=" cart-table-size">Subtotal</th>
        <th className=" cart-table-size">Descuento</th>
        <th className=" cart-table-size">ITBIS</th>
        <th className=" cart-table-size">Total</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
     
      {getItemsData.map(row=>
        <tr className="cart-table-content cart-table-content-detail-payment">
        <td className="  bold-text">{row.productoEmpresa}</td>
        <td className="cart-table-size"><span className="">RD$ {row.precio}</span></td>
        <td className="cart-table-size">{row.cantidadSeleccionada}</td>
        <td className="cart-table-size">RD$ {(row.precio * row.cantidadSeleccionada)}</td>
        <td className="cart-table-size">RD$ {((row.precio * row.cantidadSeleccionada ) * row.descuento)/100 }</td>
        <td className="cart-table-sizes">RD$ {(((row.precio * row.cantidadSeleccionada ) * 18)/100)  }</td>
        <td className="cart-table-sizes">RD$ {((((row.precio * row.cantidadSeleccionada ) * 18)/100) + (row.precio * row.cantidadSeleccionada)) - (((row.precio * row.cantidadSeleccionada ) * row.descuento)/100 ) }</td>
       <td>
        <li className=""> 
          <Button onClick={()=>onDelete(row.id)}  variant="outlined" color="secondary">
              <DeleteOutlineIcon color="secondary"/>
          </Button>
         </li>
        <li className="cart-table-icon red-text right-text-mobile"><i className="fa fa-close"></i></li>
      </td> 
      </tr>

        )
      } 
    
    </tbody>
    <section  className="posi">
     <br></br>
               
                
     <h5 id="subtotal" className="bold-text">SubTotal: <span>RD$ {SUBTOTAL}</span></h5>
     <h5 id="total" className="bold-text">Total: <span>RD$ {TOTAL}</span></h5>
     
     <h5><span className="bold-text"></span></h5>
       <Button onClick={reporte} variant="outlined" color="secondary" >
           Descargar Factura
       </Button>
       &nbsp; &nbsp; &nbsp; 
       {
         empresaE.length === 0?console.log('')
         :empresaE[0].estado != 'No Enviada' ?
         <Button onClick={onCancel} variant="outlined" color="primary">
             Cancelar Cotizacion
           </Button> 
         :<Button onClick={enviarFactura} variant="outlined" color="primary">
             Enviar factura
           </Button> 
           
       } 
      


     
  <br></br>
</section>
  </table>
</div>
<div className="cart-block-right">
  <div className="cart-header-footer">
    
  </div>
</div>
</div>
</div>
  </div>
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />
    {/* Same as */}
    <ToastContainer />
    </>
)
}
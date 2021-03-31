import {firebaseG} from '../Firebase/FirebaseConf'

const db = firebaseG.firestore()

let collectionDB = db.collection("Empresa")


const getDataFirebase = (doc) => {
    const data = doc.data();
    const { id } = doc.id;
    const {imagenLogo, imagenEmpresa, nombreEmpresa, numeroEmpresa, direccionEmpresa}= data
    return {
      imagenLogo, imagenEmpresa, nombreEmpresa, numeroEmpresa, direccionEmpresa, 
    };
  };
  
  
  export const listenDataItems = (callback) => {
    
        return collectionDB.onSnapshot(({ docs }) => {
          const newData = docs.map(getDataFirebase);
          callback(newData);
  
  
        });
      }

  
 
  //Extraer productos, de cada usuario
  export const productosUnicosDeEmpresa = (URLactual)=>{
    const docProductos = collectionDB.doc(URLactual).get();
    return docProductos
  }

  
export const dataProducto = (doc) => {
  const { precioVentaProducto, imageProducto, cantidadProducto,nombreProducto , descuentoProducto}= doc.data();
  return { precioVentaProducto, imageProducto, cantidadProducto, nombreProducto , descuentoProducto }
};
  export const DataEmpresaProducto = (emailEmpresa,callback) => {
        
        return db.collection(emailEmpresa).doc('Producto').collection('Producto')
      }
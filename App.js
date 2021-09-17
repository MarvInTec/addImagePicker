import React, {useState} from 'react';
import { StatusBar, TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import firebase from './src/firebase';
//img1 de user
import img1 from './src/assets/avt.png';
import { TextInput } from 'react-native-gesture-handler';


export default function App() {
  //state onde a imagem carregada pelo picker será guardada
  const [selectedImage, setSelectedImage] = useState(null);

  //state de armazenamento de dados do form e imagem
  const [state, setState] = useState({
    nome:'',
    email:'',
    telefone:'',
    imageUri: ''
  })
  //função de armazenar valores do form no state
  const handleInputChange = (name, value) =>{
    setState({
        ...state, [name]: value
    })
}

  //função especifica do expo image picker
  let openImagePickerAsync = async () => {
    //solicita acesso a biblioteca
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //se não for permitido emite o alerta e para a função
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    //acessa a biblioteca do aparelho e armazena os dados da imagem no pickerResult
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    // se não obtiver imagem, para a ação
    if (pickerResult.cancelled === true) {
      return;
    }
    //armazena os dados da imagem dentro do state do selectedImage recuperando apenas o caminho da imagem
    setSelectedImage({ localUri: pickerResult.uri });
    console.log(pickerResult);
  }
 
  console.log(selectedImage)
  console.log(state)


  const uploadImg = async () => {
        const response = await fetch(selectedImage.localUri);
        const blob = await response.blob();
        //os 2 códigos acima prepara a imagem para armazenamento


        const uploadUri = selectedImage.localUri;
        let nomeArquivo = uploadUri.substring(uploadUri.lastIndexOf('/')+1)
        //recupera o nome temporário criado pelo picker e separa do caminho uri
        
        const ref = firebase.storage.ref().child(`images/${nomeArquivo}`);
        const envio =  ref.put(blob);
        //comandos que realiza o armazenamento da imagem no storage

        //função que verifica o status de envio com base nos dados tranferidos
        const envioStatus = snapshot => {
            console.log(`transferido: ${snapshot.bytesTransferred}`)
        }

        //função  que recupera o caminho da imagem armazenada no storage, após a conclusão da transferencia, e passa o caminho da imagem no storage para dentro do state.imageUri
        //emite alerta de Carregada.
        //ATENÇÃO ANTES CLICAR NO BOTÃO DE ADICIONAR VOCÊ DEVE SELECIONAR A IMAGEM E CARREGAR NO STORAGE. PARA ELE PODER GUARDAR OS DADOS DO USER E IMAGEM
        const envioCompleto = () => {
            envio.snapshot.ref.getDownloadURL().then((snapshot)=> {
              console.log(snapshot);
              setState({...state, imageUri:snapshot})
              alert('Carregada');
            } ) 
        }

        //função que mostra algum erro no envio
        const envioErro = snapshot => {
          console.log(snapshot)
        }

        //esculta que verifica se a imagem foi enviada corretamente e ativa as funções descritas acima
        envio.on("state_changed", envioStatus, envioErro, envioCompleto)

  } 


  //após carregar a imagem no storage e preencher o form, você poderá acionar o botão de adicionar. para armazernar os dados.
  const addUser = async () => {
    await firebase.db.collection('users').add(state).then(
        ()=>{
            alert("salved");           
        }
    ).catch(
        ()=>alert("não foi possivel inserir")
    )
}
 
  return (
    <View style={style.container}>
      <StatusBar/>
      <Image style={style.img} source={selectedImage ? { uri: selectedImage.localUri } : img1}/>
      <TouchableOpacity style={style.btn} onPress={openImagePickerAsync}><Text>Escolher Imagem</Text></TouchableOpacity>

      <TouchableOpacity style={style.btn} onPress={uploadImg}><Text>Carregar</Text></TouchableOpacity>

      <TextInput
          style={style.input}
          placeholder='Nome'
          defaultValue={state.nome}
          onChangeText={
              (value)=>handleInputChange('nome', value)
          }
      />
      <TextInput
          style={style.input}
          placeholder='email'
          textContentType='emailAddress'
          defaultValue={state.email}
          onChangeText={
              (value)=>handleInputChange('email', value)
          }
      />
      <TextInput
          style={style.input}
          placeholder='Telefone'
          defaultValue={state.telefone}
          onChangeText={
              (value)=>handleInputChange('telefone', value)
          }
      />


      <TouchableOpacity style={style.btn} onPress={addUser}><Text>Adicionar</Text></TouchableOpacity>
            
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  btn: {
    width:150,
    height:50,
    borderRadius:3,
    backgroundColor:'red',
    alignItems: 'center',
    justifyContent:'center'
  },
  btnText:{
    color:'#ffff'
  },
    img:{
      width:200,
      height:200,
      borderRadius:10,
      marginBottom:5
    },
    input:{
      height:60, 
      width:'90%',
      borderWidth:1, 
      padding:10,
      marginTop:5
    }
})

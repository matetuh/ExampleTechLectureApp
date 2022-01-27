import React, {useState} from 'react';
import {
  SafeAreaView,
  Button,
  Linking,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';

const App = () => {
  //---INPUT TEXT---
  const [text, onChangeText] = useState('');
  //---AUTHORIZATION TOKEN---
  const [token, setToken] = useState('');
  //---FOLDERS NAMES---
  const [folders, setFolders] = useState([]);
  //---DOWNLOADED FILES---
  const [download, setDownload] = useState([]);
  //---SAVED FILE---
  const [saved, setSaved] = useState([]);

  // ----TOKEN URL---
  const dropboxUrl =
    'https://www.dropbox.com/oauth2/authorize?client_id=jyh7rf3esns3ex1&response_type=token&redirect_uri=myapp://com.exampletechlectureapp/callback';

  // //----CODE URL---
  // const dropboxUrl =
  //   'https://www.dropbox.com/oauth2/authorize?client_id=jyh7rf3esns3ex1&response_type=code';

  //----OPEN URL IN BROWSER---
  const handlePress = async () => {
    await Linking.openURL(dropboxUrl);
  };

  //----LISTEN FOR EVENT TO GET REDIRECT URL---
  Linking.addEventListener('url', callback => {
    console.log('--------Redirect url: ' + JSON.stringify(callback));
    let re = /&access_token=.+(?=&scope)/g;
    let trimmedToken = callback.url.match(re)[0].replace('&access_token=', '');
    setToken(trimmedToken);
    console.log(trimmedToken);
  });

  // // //---CODE AUTHORIZATION---
  // const postAuthorize = code => {
  //   let formdata = new FormData();
  //   formdata.append('code', code);
  //   formdata.append('grant_type', 'authorization_code');
  //   formdata.append('client_id', 'jyh7rf3esns3ex1');
  //   formdata.append('client_secret', 'jmue87ncwz0t074');

  //   let requestOptions = {
  //     method: 'POST',
  //     body: formdata,
  //   };

  //   fetch('https://api.dropbox.com/oauth2/token', requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       setToken(result.access_token);
  //       console.log(result.acces_token);
  //       console.log(result);
  //     })
  //     .catch(error => console.log('error', error));
  // };

  //----API FUNCTIONS---
  //---LIST ALL FOLDERS---
  const listFolders = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '',
        recursive: false,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
      }),
    };

    fetch('https://api.dropboxapi.com/2/files/list_folder', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('---Result: ' + JSON.stringify(result));
        console.log('---Result entries: ' + JSON.stringify(result.entries));
        result.entries.map(folder => {
          console.log('---Folder name: ' + folder.name);
        });
        setFolders(result.entries);
      })
      .catch(error => console.log('error', error));
  };

  //---DOWNLOAD FILE---
  const downloadFile = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Dropbox-API-Arg': '{"path": "/Kwantowa/text.txt"}',
      },
    };

    fetch('https://content.dropboxapi.com/2/files/download', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setDownload([result]);
      })
      .catch(error => console.log('error', error));
  };

  //---SAVE FILE ON DROPBOX---
  const saveFile = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Dropbox-API-Arg':
          '{"path": "/Kwantowa/testSave.txt","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
        'Content-Type': 'application/octet-stream',
      },
    };

    fetch('https://content.dropboxapi.com/2/files/upload', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setSaved([result]);
      })
      .catch(error => console.log('error', error));
  };

  //---MAP FOLDERS TO VIEW---
  const folderNames = folders.map((f, iter) => <Text>{f.name}</Text>);
  //---MAP FILES TO VIEW---
  const downloadedFiles = download.map((f, iter) => <Text>{f}</Text>);
  //---SAVED FILES TO VIEW---
  const savedFiles = saved.map((f, iter) => <Text>{f}</Text>);

  return (
    <SafeAreaView>
      {/* <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <View style={styles.button}>
        <Button
          onPress={() => postAuthorize(text)}
          title="Initialize token"
          color="#841584"
          accessibilityLabel="Initialize token"
        />
      </View> */}
      <View style={styles.button}>
        <Button
          title="Open Dropbox Login Panel"
          onPress={() => handlePress()}
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => listFolders()}
          title="List Folders"
          color="#75C32C"
          style={styles.button}
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => downloadFile()}
          title="Download File"
          color="#FEB7FF"
          style={styles.button}
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => saveFile()}
          title="Save File"
          color="#AEB4FF"
          style={styles.button}
        />
      </View>
      <View style={styles.folders}>
        <Text style={{fontWeight: 'bold'}}>Lista folderów:</Text>
        <View>{folderNames}</View>
      </View>
      <View style={styles.folders}>
        <Text style={{fontWeight: 'bold'}}>Pobrane pliki:</Text>
        <View>{downloadedFiles}</View>
      </View>
      <View style={styles.folders}>
        <Text style={{fontWeight: 'bold'}}>Zapisane pliki:</Text>
        <View>{savedFiles}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    height: 40,
    margin: 5,
  },
  folders: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default App;

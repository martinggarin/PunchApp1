import firebase from 'firebase';

const userConfig = {
  apiKey: 'AIzaSyCvSHOaKLtLtXsdln3K_GtNfRMQ_kONSZw',
  authDomain: 'punchapp-86a47.firebaseapp.com',
  databaseURL: 'https://punchapp-86a47.firebaseio.com',
  projectId: 'punchapp-86a47',
  storageBucket: 'punchapp-86a47.appspot.com',
  messagingSenderId: '685510681673',
  appId: '1:685510681673:web:a26c8543002a0c1c0d0b98',
  measurementId: 'G-HB0SX7XC0Z',
};
const merchantConfig = {
  apiKey: 'AIzaSyCvSHOaKLtLtXsdln3K_GtNfRMQ_kONSZw',
  authDomain: 'punchapp-86a47.firebaseapp.com',
  databaseURL: 'https://punchapp-86a47.firebaseio.com',
  projectId: 'punchapp-86a47',
  storageBucket: 'punchapp-86a47.appspot.com',
  messagingSenderId: '685510681673',
  appId: '1:685510681673:web:b6adb8ca4abc6b4b0d0b98',
  measurementId: 'G-Q0YRDVYJ8Z',
};

firebase.initializeApp(userConfig, 'user');
firebase.initializeApp(merchantConfig, 'merchant');

module.exports.firebaseApp = { user: firebase.app('user'), merchant: firebase.app('merchant') };

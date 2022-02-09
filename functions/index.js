const functions = require("firebase-functions");
const _ = require('lodash');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('RC5J3MBI7G',
    '80d7855e24daade163332dd2d8c70449');
  const index = client.initIndex('documents');
  
  exports.addToIndex = functions.firestore.document('documents/{documentId}')
      .onCreate(snapshot => {
  
          const data = snapshot.data();
          const objectID = snapshot.id;
  
          return index.saveObject({ ...data, objectID });
  
      });
  
  exports.updateIndex = functions.firestore.document('documents/{documentId}')
  
      .onUpdate((change) => {
          const newData = change.after.data();
          const objectID = change.after.id;
          return index.saveObject({ ...newData, objectID });
  });
  
  exports.deleteFromIndex = functions.firestore.document('documents/{documentId}')
  
      .onDelete(snapshot => 
          index.deleteObject(snapshot.id)
  );
  
  
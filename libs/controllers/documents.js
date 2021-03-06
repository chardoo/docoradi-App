const algoliasearch = require('algoliasearch');
const algoliaClient = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY_ID);
// const documentHelper = require('../../helpers/documentHelper');
const _ = require('lodash');
const { doc } = require('prettier');
const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY_ID);
const db = require('../../libs/data/db').getDB();
const index = client.initIndex('documents');

const personalIndex = client.initIndex('personalDocuments');

const initialDocuments = async (req, res, next) =>{
    try {
         
        index.setSettings({
            customRanking: ["desc(createdTime)"]
        });
        const {userId} = req.body;
        
        const documents  =  await index.search(userId,{
          filters: `(userId:${userId})`,
          
        })
        // console.log(documents); 
        if (!documents) {
          throw new Error('something went wrong try again');
        }
        res.status(200).json(documents.hits);

      } catch (error) {
        next(error);
      }
}

const personalUploadedDocuments = async (req, res, next) =>{
  try {
       
      personalIndex.setSettings({
          customRanking: ["desc(createdTime)"]
      });
      const {userId} = req.body;
      console.log(userId);
      const documents  =  await personalIndex.search(userId)
   
      if (!documents) {
        throw new Error('something went wrong try again');
      }
      res.status(200).json(documents.hits);

    } catch (error) {
      next(error);
    }
}

const searchDocuments = async (req, res, next) => {
  try {
    const{userId, searchIndex} =  req.body
    const documents  =  await index.search(searchIndex,{
      filters: `(userId:${userId})`
    })
    if (!documents) {
      throw new Error('something went wrong try again');
    }
    res.status(200).json(documents.hits);
  } catch (error) {
    next(error);
  }
};


const viewLater = async(req, res, next) =>{
  try {
    const {objectID} = req.body
    console.log('viewLater with id', objectID)
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({isLater: true});
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok');
  } catch (error) {
    next(error);
  }
}
const removeFromViewLater = async(req, res, next) =>{
  try {
    const {objectID} = req.body
    console.log('remove with id', objectID)
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({isLater: false});
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok');
  } catch (error) {
    next(error);
  }
}

const markAsViewed = async(req, res, next) =>{
  try {
    const {objectID} = req.body
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({isViewed: true});
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok')
  } catch (error) {
    next(error);
  }
}


module.exports = {
    searchDocuments, initialDocuments, viewLater,markAsViewed, removeFromViewLater, personalUploadedDocuments
}
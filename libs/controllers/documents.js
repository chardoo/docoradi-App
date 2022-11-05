const algoliasearch = require('algoliasearch');
const { filter } = require('lodash');
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY_ID
);
// const documentHelper = require('../../helpers/documentHelper');
const _ = require('lodash');
const { doc } = require('prettier');
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY_ID
);
const db = require('../../libs/data/db').getDB();
const index = client.initIndex('documents');

const personalIndex = client.initIndex('personalDocuments');

const initialDocuments = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const documents = await index.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });

    const personalDocuments = await personalIndex.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });
    // console.log(documents);
    if (!documents) {
      throw new Error('something went wrong try again');
    }
    const newDocuments = {
      personal: personalDocuments.hits,
      sent: documents.hits,
    };
    res.status(200).json(newDocuments);
  } catch (error) {
    next(error);
  }
};

const personalUploadedDocuments = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const documents = await personalIndex.search(userId);

    if (!documents) {
      throw new Error('something went wrong try again');
    }
    res.status(200).json(documents.hits);
  } catch (error) {
    next(error);
  }
};

const searchDocuments = async (req, res, next) => {
  try {
    const { userId, searchIndex } = req.body;
    const documents = await index.search(searchIndex, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });
    if (!documents) {
      throw new Error('something went wrong try again');
    }

    res.status(200).json(documents.hits);
  } catch (error) {
    next(error);
  }
};

const getfileTypes = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const documents = await index.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['mime'],
    });
    // console.log(documents);
    if (!documents) {
      throw new Error('something went wrong try again');
    }
    const filteredArr = documents.hits.reduce((acc, current) => {
      const x = acc.find((item) => item.mime === current.mime);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    filteredArr.push({ mime: 'all', objectID: 'eusduf2323' });
    res.status(200).json({ filteredArr });
  } catch (error) {
    next(error);
  }
};
const getfilesByMimeType = async (req, res, next) => {
  try {
    const { userId, mimeType } = req.body;
    if (mimeType === 'all') {
      const documents = await index.search(userId, {
        filters: `(userId:${userId})`,
        attributesToRetrieve: ['*'],
      });

      if (!documents) {
        throw new Error('something went wrong try again');
      }
      res.status(200).json(documents.hits);
    }

    const documents = await index.search(mimeType, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });

    if (!documents) {
      throw new Error('something went wrong try again');
    }

    res.status(200).json(documents.hits);
  } catch (error) {
    next(error);
  }
};

const filterDocuments = async (req, res, next) => {
  try {
    // index.setSettings({
    //   customRanking: ['desc(createdTime)'],
    // });
    const {
      userId,
      companyName,
      documentType,
      billDate,
      accountNumber,
    } = req.body;
    console.log(billDate);
    console.log(companyName);
    console.log(accountNumber);
    console.log(userId);

    const filters = `companyName:${companyName}`;
    console.log(filters);
    const documents = await index.search(userId, {
      filters: `companyName:${companyName} AND billDate:${billDate} OR (accountNumber:${accountNumber})`,
      // filters:'companyName:richgroup',
      // facetFilters: [`companyName:${companyName}`],
      attributesToRetrieve: ['*'],
    });

    console.log('dsdsd', documents);
    if (!documents) {
      throw new Error('something went wrong try again');
    }

    res.status(200).json(documents.hits);
  } catch (error) {
    next(error);
  }
};

const viewLater = async (req, res, next) => {
  try {
    const { objectID } = req.body;
    console.log('viewLater with id', objectID);
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({ isLater: true });
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok');
  } catch (error) {
    next(error);
  }
};
const removeFromViewLater = async (req, res, next) => {
  try {
    const { objectID } = req.body;
    console.log('remove with id', objectID);
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({ isLater: false });
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok');
  } catch (error) {
    next(error);
  }
};

const markAsViewed = async (req, res, next) => {
  try {
    const { objectID } = req.body;
    const docRef = await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(objectID);
    const updatedDoc = await docRef.update({ isViewed: true });
    if (!updatedDoc) {
      throw new Error('something went wrong when trying to update document');
    }
    res.status(200).json('ok');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchDocuments,
  initialDocuments,
  viewLater,
  markAsViewed,
  removeFromViewLater,
  personalUploadedDocuments,
  getfileTypes,
  getfilesByMimeType,
  filterDocuments,
};

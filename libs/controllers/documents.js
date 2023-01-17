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
index.setSettings({
  ranking: ['desc(timestamp)'],
});
personalIndex.setSettings({
  ranking: ['desc(timestamp)'],
});
const initialDocuments = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log(userId);
    const documents = await index.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });
    // console.log(documents);
    const personalDocuments = await personalIndex.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });

    documents.hits.concat(personalDocuments.hits);
    let documentdifkfd = [];
    documentdifkfd = [...documents.hits];
    const newdoc = documentdifkfd.concat(personalDocuments.hits);
    if (!documents) {
      throw new Error('something went wrong try again');
    }
    const newDocuments = {
      sent: newdoc,
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

const sentDocuments = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const documents = await index.search(userId);

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

    const personalDocuments = await personalIndex.search(searchIndex, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });

    documents.hits.concat(personalDocuments.hits);
    let documentdifkfd = [];
    documentdifkfd = [...documents.hits];
    const newdoc = documentdifkfd.concat(personalDocuments.hits);

    if (!documents) {
      throw new Error('something went wrong try again');
    }

    res.status(200).json(newdoc);
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
    const personaldocuments = await personalIndex.search(userId, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['mime'],
    });

    // console.log(documents);
    if (!personaldocuments) {
      throw new Error('something went wrong try again');
    }
    let mimetypes = [];
    mimetypes = [...documents.hits];
    const mimess = mimetypes.concat(personaldocuments.hits);
    const mimes = mimess.reduce((acc, current) => {
      const x = acc.find((item) => item.mime === current.mime);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    mimes.push({ mime: 'all', objectID: 'eusduf2323' });
    res.status(200).json({ mimes });
  } catch (error) {
    next(error);
  }
};
const getfilesByMimeType = async (req, res, next) => {
  try {
    const { userId, mimeType } = req.body;
    const documents = await index.search(mimeType, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });
    const personaldocuments = await personalIndex.search(mimeType, {
      filters: `(userId:${userId})`,
      attributesToRetrieve: ['*'],
    });

    if (!personaldocuments) {
      throw new Error('something went wrong try again');
    }
    let documentFoundBythisMimeType = [];
    documentFoundBythisMimeType = [...documents.hits];
    const documentFound = documentFoundBythisMimeType.concat(
      personaldocuments.hits
    );

    res.status(200).json(documentFound);
  } catch (error) {
    next(error);
  }
};

const filterDocuments = async (req, res, next) => {
  try {
    const {
      userId,
      companyName,
      documentType,
      billDate,
      accountNumber,
    } = req.body;

    const filters = `companyName:${companyName}`;
    const documents = await index.search(userId, {
      filters: `companyName:${companyName} AND billDate:${billDate} OR (accountNumber:${accountNumber})`,
      // filters:'companyName:richgroup',
      // facetFilters: [`companyName:${companyName}`],
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

const viewLater = async (req, res, next) => {
  try {
    const { objectID } = req.body;
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
  sentDocuments,
  getfileTypes,
  getfilesByMimeType,
  filterDocuments,
};

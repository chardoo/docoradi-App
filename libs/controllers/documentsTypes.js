const fetch = require('fetch-node');
const request = require('request');
const getDocumentTypes = async (req, res, next) => {
  try {
    let URL = `${process.env.SERVICEURL}/service/documentTypes/`;
    const me = request(URL, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(JSON.parse(results.body));
      }
    });
  } catch (error) {
    next(error);
  }
};

const uploadDocumentTypes = async (req, res, next) => {
  try {
    let URL = `${process.env.SERVICEURL}/service/docxon/personal`;
    const me = request(
      { url: URL, method: 'POST', json: true, body: req.body },
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.status(201).json(results.body.status);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
module.exports = { getDocumentTypes, uploadDocumentTypes };

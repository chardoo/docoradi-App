const fetch = require('fetch-node');
const request = require('request');
const getDocumentTypes = async (req, res, next) => {
  try {
    let URL = `${process.env.SERVICEURL}/service/documentTypes/`;
    // console.log(URL);
    // const response = await fetch(URL,{method: 'GET'});
    // console.log(response);
    const me = request(URL, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        // console.log(results.body);

        res.status(200).json(JSON.parse(results.body));

        //    const countDoctors =  JSON.stringify(results.body, (key, value) =>(typeof value ==='bigint' ? value.toString(): value))
        //    const final =   JSON.parse(countDoctors, (key, value) => {
        //        if (typeof value === "string" && value.startsWith('BIGINT::')) {
        //          return BigInt(value.substr(8));
        //        }
        //        return value;
        //      });

        //   res.status(200).json(final);
      }
    });
    //    console.log(me.response)
    //     // const data = await response.json();
    //     res.status(200).json(me);
  } catch (error) {
    next(error);
  }
};

const uploadDocumentTypes = async (req, res, next) => {
  try {
    let URL = `${process.env.SERVICEURL}/service/docxon/`;
    const me = request(
      { url: URL, method: 'POST', json: true, body: req.body },
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(JSON.parse(results.body));
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
module.exports = { getDocumentTypes, uploadDocumentTypes };

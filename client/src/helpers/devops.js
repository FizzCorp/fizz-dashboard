// imports
import ajaxHelper from '../ajax';
import Logger from '../../common/logger.js';

// globals
const logger = new Logger('Devops Helper', '#0000FF');
const sdk = {
  uploadHtmlLatest(params, cb) {
    ajaxHelper.sdk.signHtmlLatest({
      data: params.data,
      success: (response) => {
        logger.log('uploadHtmlLatest Sign Response: ', response);
        if (!response.success) {
          return cb(response);
        }

        ajaxHelper.signer.uploadV3({
          url: response.data[0].signedUrl,
          data: new Blob(['Hello Landing'], {
            type: 'text/html;charset=utf-8'
          }),
          headers: response.data[0].headers,
          success: (response) => {
            cb(null, response);
          },
          error: (err) => {
            cb(err);
          }
        });
      },
      error: (err) => {
        logger.log('uploadHtmlLatest :: Error ===> ', err);
        cb(err);
      }
    });
  },
  uploadHtmlCurrent(params, cb) {
    ajaxHelper.sdk.signHtmlCurrent({
      data: params.data,
      success: (response) => {
        logger.log('uploadHtmlCurrent Sign Response: ', response);
        if (!response.success) {
          return cb(response);
        }

        ajaxHelper.signer.uploadV3({
          url: response.data[0].signedUrl,
          data: new Blob(['Hello Landing'], {
            type: 'text/html;charset=utf-8'
          }),
          headers: response.data[0].headers,
          success: (response) => {
            cb(null, response);
          },
          error: (err) => {
            cb(err);
          }
        });
      },
      error: (err) => {
        logger.log('uploadHtmlCurrent :: Error ===> ', err);
        cb(err);
      }
    });
  },
  uploadBundle(params, cb) {
    ajaxHelper.sdk.signBundle({
      data: params.signParams.data,
      success: (response) => {
        if (!response.success) {
          return cb(response);
        }

        const signedUrl = response.data[0].signedUrl;
        ajaxHelper.signer.upload(signedUrl, {
          data: params.uploadParams.data,
          success: (uploadResponse) => {
            cb(null, uploadResponse);
          },
          error: (err) => {
            cb(err);
          }
        });
      },
      error: (err) => {
        logger.log('uploadBundle :: Error ===> ', err);
        cb(err);
      }
    });
  }
};

// exports
module.exports = {
  sdk: sdk
};
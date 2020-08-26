const { promises } = require('fs');
// const csvTojson = require('csvtojson');

const AWS = require('aws-sdk');

const S3 = new AWS.S3();

const filePathOnBucket = {
  Bucket: 'developer-survey',
  Key: 'survey_results_public.csv',
};

(async () => {
  console.time('elapsed');
  console.log('downloading file...');
  const { Body } = await S3.getObject(filePathOnBucket).promise();
  // const surveyInJson = csvTojson(Body.toString());
  // await promises.writeFile('output-promise.csv', surveyInJson);
  await promises.writeFile('output-promise.csv', Body.toString());
  console.log();
  console.timeEnd('elapsed');
})();

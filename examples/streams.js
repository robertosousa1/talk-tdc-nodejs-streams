const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

const AWS = require('aws-sdk');

const S3 = new AWS.S3();

const filePathOnBucket = {
  Bucket: 'developer-survey',
  Key: 'survey_results_public.csv',
};

const fileOutput = createWriteStream('output-stream.csv');

(async () => {
  console.time('elapsed');
  console.log('downloading file...');
  const dataStream = await S3.getObject(filePathOnBucket).createReadStream();

  await pipelineAsync(dataStream, fileOutput);
  console.log();
  console.timeEnd('elapsed');
})();

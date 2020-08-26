const { createWriteStream } = require('fs');
const { Transform, pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

const csvTojson = require('csvtojson');
const jsonTocsv = require('json-to-csv-stream');

const AWS = require('aws-sdk');

const S3 = new AWS.S3();

const filePathOnBucket = {
  Bucket: 'developer-survey',
  Key: 'survey_results_public.csv',
};

const fileOutput = createWriteStream('output-stream.csv');

const mapStream = new Transform({
  transform: (chunk, encoding, cb) => {
    const line = JSON.parse(chunk);
    return cb(
      null,
      JSON.stringify({
        Respondent: line.Respondent,
        Country: line.Country,
        YearsCoding: line.YearsCoding,
      })
    );
  },
});

(async () => {
  console.time('elapsed');
  console.log('downloading file...');
  const dataStream = await S3.getObject(filePathOnBucket).createReadStream();

  await pipelineAsync(
    dataStream,
    csvTojson(),
    mapStream,
    jsonTocsv(),
    fileOutput
  );
  console.log();
  console.timeEnd('elapsed');
})();

// Import required AWS SDK clients and commands for Node.js
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient, awsCredentialsConfig, ddbDocClient  } from "./libs/aws.config.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDB(awsCredentialsConfig);
let userId = 5002;
const createTable = (table) => {
  return new Promise((res, rej) => {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "N",
        }
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      TableName: table,
      StreamSpecification: {
        StreamEnabled: false,
      },
    };
        
    const run = async () => {
      try {
        const data = await ddbClient.send(new CreateTableCommand(params));
        res({message: 'success'});
        return data;
      } catch (err) {
        rej(err);
      }
    };
    run();
  });
}

const addItem = (user) => {
  console.log(user);
  return new Promise((res,rej)=>{ 
    var params = {
      TableName: 'allusers',
      Item: {
        'id' : {N: `${++userId}`},
        'name' : {S: user.name},
        'skills' : {S: user.skills},
        'designation': {S: user.designation},
        'ctc': {S: user.ctc}
      }
    };

    ddb.putItem(params, function(err, data) {
      if (err) {
        rej(err);
      } else {
        res({message: 'success'});
      }
    })
  });
}

const getAllItems = async() => {
  return new Promise((res,rej)=>{
    const params = {
      TableName: "allusers"
    };
    const scanTable = async () => {
      try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        res(data)
      } catch (err) {
        console.log("Error", err);
        rej(err);
      }
    };
    scanTable();
  })
}

const getItem = (id) => {
  return new Promise((res,rej)=>{
    const params = {
      TableName: 'users',
      Key: {
        'id': {N: id}
      }
    };
    ddb.getItem(params, function(err, data) {
      if (err) {
        rej(err);
      } else {
        res(data.Item);
      }
    });
  })
}

const deleteItem = (userID) => {
  return new Promise((res,rej)=>{
    const params = {
      TableName: 'users',
      Key: {
        'id': {N: userID}
      }
    };
    
    // Call DynamoDB to delete the item from the table
    ddb.deleteItem(params, function(err, data) {
      if (err) {
        rej(err);
      } else {
        res({message: 'success'});
      }
    });
  });
}

export {createTable, addItem, getItem, deleteItem, getAllItems};

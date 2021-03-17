import * as AWS  from 'aws-sdk'
process.env._X_AMZN_TRACE_ID = '_X_AMZN_TRACE_ID'

import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
const logger = createLogger('dataLayer')

import { TodoItem } from '../models/TodoItem'
import { S3 } from 'aws-sdk'

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.INDEX_NAME,
        private readonly s3: S3 =  new XAWS.S3({
          signatureVersion: 'v4'
        })) {
      }

    async updateTodo(update: UpdateTodoRequest, userId: string, todoId: string ): Promise<String> {
        const { name,dueDate,done } = update
        const params = {
            TableName: this.todosTable,
            Key:                  
              {todoId,
              userId},
            UpdateExpression: "set #name=:n, #dueDate=:dD, #done=:d",
            ExpressionAttributeValues: {
              ':n': name,
              ':dD': dueDate,
              ':d': done
            },
            ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
            },
            ReturnValues:"UPDATED_NEW"       
        };

        logger.info('Item update in progress ...', {
            // Additional info added in logs
            userId
        })

        await this.docClient.update(params, function(err) {
            if (err) {
              logger.info("Item update failed.", { message: err.message });
            } else {
              logger.info("Item has been sucessfully updated.");
            }
        }).promise();

    return 
    }

    async deleteTodo (todoId: string, userId:string) {
    
        const params = {
            TableName: this.todosTable,
            Key:                  
            { todoId, userId },
        }

        await this.docClient.delete(params, function(err) {
            if (err) {
              logger.info("Unable to delete item.", { todoId, userId, message: err.message });
            } else {
              logger.info("Item has been sucessfully deleted");
            }
        }).promise();
    }
}




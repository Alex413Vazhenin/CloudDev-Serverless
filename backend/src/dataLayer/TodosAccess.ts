import * as AWS  from 'aws-sdk'
process.env._X_AMZN_TRACE_ID = '_X_AMZN_TRACE_ID'

import * as AWSXRay from 'aws-xray-sdk'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

import { createLogger } from '../utils/logger'
const logger = createLogger('dataLayer')

import { TodoItem } from '../models/TodoItem'
import { S3 } from 'aws-sdk'

export class TodosAccess {
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
              logger.info("Item update failed. ", {message: err.message});
            } else {
              logger.info("Item has been sucessfully updated.");
            }
        }).promise();
}




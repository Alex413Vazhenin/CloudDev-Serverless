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

}




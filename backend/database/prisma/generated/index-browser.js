
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 393aa359c9ad4a4bb28630fb5613f9c281cde053
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "393aa359c9ad4a4bb28630fb5613f9c281cde053"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.AnalysisDatasetScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  building: 'building',
  floor: 'floor',
  room: 'room',
  startDate: 'startDate',
  endDate: 'endDate',
  occupantType: 'occupantType',
  meterIdL1: 'meterIdL1',
  meterIdL2: 'meterIdL2',
  totalRecords: 'totalRecords',
  positiveLabels: 'positiveLabels',
  createdAt: 'createdAt'
};

exports.Prisma.AnalysisReadyDataScalarFieldEnum = {
  id: 'id',
  datasetId: 'datasetId',
  timestamp: 'timestamp',
  room: 'room',
  rawWattageL1: 'rawWattageL1',
  rawWattageL2: 'rawWattageL2',
  wattage110v: 'wattage110v',
  wattage220v: 'wattage220v',
  wattageTotal: 'wattageTotal',
  isPositiveLabel: 'isPositiveLabel',
  sourceAnomalyEventId: 'sourceAnomalyEventId'
};

exports.Prisma.ExperimentRunScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  filteringParameters: 'filteringParameters',
  status: 'status',
  candidateCount: 'candidateCount',
  totalDataPoolSize: 'totalDataPoolSize',
  positiveLabelCount: 'positiveLabelCount',
  negativeLabelCount: 'negativeLabelCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  candidateStats: 'candidateStats'
};

exports.Prisma.AnomalyEventScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  name: 'name',
  datasetId: 'datasetId',
  line: 'line',
  eventTimestamp: 'eventTimestamp',
  detectionRule: 'detectionRule',
  score: 'score',
  dataWindow: 'dataWindow',
  status: 'status',
  reviewerId: 'reviewerId',
  reviewTimestamp: 'reviewTimestamp',
  justificationNotes: 'justificationNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  experimentRunId: 'experimentRunId'
};

exports.Prisma.AnomalyLabelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventLabelLinkScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  labelId: 'labelId',
  createdAt: 'createdAt'
};

exports.Prisma.TrainedModelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  scenarioType: 'scenarioType',
  status: 'status',
  experimentRunId: 'experimentRunId',
  modelConfig: 'modelConfig',
  dataSourceConfig: 'dataSourceConfig',
  modelPath: 'modelPath',
  trainingMetrics: 'trainingMetrics',
  validationMetrics: 'validationMetrics',
  trainingLogs: 'trainingLogs',
  jobId: 'jobId',
  trainingDataInfo: 'trainingDataInfo',
  createdAt: 'createdAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt'
};

exports.Prisma.EvaluationRunScalarFieldEnum = {
  id: 'id',
  name: 'name',
  scenarioType: 'scenarioType',
  status: 'status',
  trainedModelId: 'trainedModelId',
  testSetSource: 'testSetSource',
  evaluationMetrics: 'evaluationMetrics',
  jobId: 'jobId',
  createdAt: 'createdAt',
  completedAt: 'completedAt'
};

exports.Prisma.ModelPredictionScalarFieldEnum = {
  id: 'id',
  evaluationRunId: 'evaluationRunId',
  timestamp: 'timestamp',
  predictionScore: 'predictionScore',
  groundTruth: 'groundTruth'
};

exports.Prisma.AmmeterScalarFieldEnum = {
  id: 'id',
  electricMeterNumber: 'electricMeterNumber',
  electricMeterName: 'electricMeterName',
  deviceNumber: 'deviceNumber',
  factory: 'factory',
  device: 'device',
  voltage: 'voltage',
  currents: 'currents',
  power: 'power',
  battery: 'battery',
  switchState: 'switchState',
  networkState: 'networkState',
  lastUpdated: 'lastUpdated',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AmmeterLogScalarFieldEnum = {
  id: 'id',
  deviceNumber: 'deviceNumber',
  action: 'action',
  factory: 'factory',
  device: 'device',
  voltage: 'voltage',
  currents: 'currents',
  power: 'power',
  battery: 'battery',
  switchState: 'switchState',
  networkState: 'networkState',
  lastUpdated: 'lastUpdated',
  requestData: 'requestData',
  responseData: 'responseData',
  statusCode: 'statusCode',
  success: 'success',
  errorMessage: 'errorMessage',
  responseTime: 'responseTime',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  AnalysisDataset: 'AnalysisDataset',
  AnalysisReadyData: 'AnalysisReadyData',
  ExperimentRun: 'ExperimentRun',
  AnomalyEvent: 'AnomalyEvent',
  AnomalyLabel: 'AnomalyLabel',
  EventLabelLink: 'EventLabelLink',
  TrainedModel: 'TrainedModel',
  EvaluationRun: 'EvaluationRun',
  ModelPrediction: 'ModelPrediction',
  Ammeter: 'Ammeter',
  AmmeterLog: 'AmmeterLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

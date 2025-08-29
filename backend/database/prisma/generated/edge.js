
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/generated",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/infowin/Git-projects/pu-in-practice/backend/database/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "..",
  "clientVersion": "5.22.0",
  "engineVersion": "393aa359c9ad4a4bb28630fb5613f9c281cde053",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "sqlite",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": null,
        "value": "file:./pu_practice.db"
      }
    }
  },
  "inlineSchema": "// SQLite 本機數據庫 Schema for PU Learning 實驗工作台\n// 此文件獨立於主要的 PostgreSQL 數據庫\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"./generated\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./pu_practice.db\"\n}\n\n// ========== 枚舉定義 (SQLite 使用 String) ==========\n// OccupantType: \"OFFICE_WORKER\", \"STUDENT\", \"DEPOSITORY\"\n// ExperimentRunStatus: \"CONFIGURING\", \"LABELING\", \"COMPLETED\"\n// AnomalyEventStatus: \"UNREVIEWED\", \"CONFIRMED_POSITIVE\", \"REJECTED_NORMAL\"\n\n// ========== 1. 預處理數據相關資料表 ==========\n\n/// 用於管理一組組預處理完成的分析數據集（黃金週數據）\nmodel AnalysisDataset {\n  id             String              @id @default(cuid())\n  name           String              @unique\n  description    String?\n  building       String\n  floor          String\n  room           String\n  startDate      DateTime            @map(\"start_date\")\n  endDate        DateTime            @map(\"end_date\")\n  occupantType   String              @map(\"occupant_type\") // \"OFFICE_WORKER\", \"STUDENT\", \"DEPOSITORY\"\n  meterIdL1      String              @map(\"meter_id_l1\")\n  meterIdL2      String              @map(\"meter_id_l2\")\n  totalRecords   Int                 @map(\"total_records\")\n  positiveLabels Int                 @map(\"positive_labels\")\n  createdAt      DateTime            @default(now()) @map(\"created_at\")\n  analysisData   AnalysisReadyData[]\n  anomalyEvents  AnomalyEvent[]\n\n  @@map(\"analysis_datasets\")\n}\n\n/// 存放預處理完成、每分鐘的、可直接用於模型訓練的數據\nmodel AnalysisReadyData {\n  id                   String          @id @default(cuid())\n  datasetId            String          @map(\"dataset_id\")\n  dataset              AnalysisDataset @relation(fields: [datasetId], references: [id])\n  timestamp            DateTime\n  room                 String\n  rawWattageL1         Float           @map(\"raw_wattage_l1\")\n  rawWattageL2         Float           @map(\"raw_wattage_l2\")\n  wattage110v          Float           @map(\"wattage_110v\")\n  wattage220v          Float           @map(\"wattage_220v\")\n  wattageTotal         Float           @map(\"wattage_total\")\n  isPositiveLabel      Boolean         @default(false) @map(\"is_positive_label\")\n  sourceAnomalyEventId String?         @unique @map(\"source_anomaly_event_id\")\n\n  @@map(\"analysis_ready_data\")\n}\n\n// ========== 2. 實驗管理相關資料表 ==========\n\n/// 實驗運行配置和狀態\nmodel ExperimentRun {\n  id                  String         @id @default(cuid())\n  name                String\n  description         String?\n  filteringParameters String?        @map(\"filtering_parameters\") // JSON string for SQLite\n  status              String         @default(\"CONFIGURING\") @map(\"status\") // \"CONFIGURING\", \"LABELING\", \"COMPLETED\"\n  candidateCount      Int?           @map(\"candidate_count\")\n  totalDataPoolSize   Int?           @map(\"total_data_pool_size\") // Total number of all selected dataset records combined\n  positiveLabelCount  Int?           @map(\"positive_label_count\")\n  negativeLabelCount  Int?           @map(\"negative_label_count\") // Calculated as totalDataPoolSize - positiveLabelCount\n  createdAt           DateTime       @default(now()) @map(\"created_at\")\n  updatedAt           DateTime       @updatedAt @map(\"updated_at\")\n  candidateStats      String?        @map(\"candidate_stats\") // JSON string for SQLite\n  anomalyEvents       AnomalyEvent[]\n  trainedModels       TrainedModel[]\n\n  @@map(\"experiment_run\")\n}\n\n/// Anomaly event records\nmodel AnomalyEvent {\n  id                 String           @id @default(cuid())\n  eventId            String           @unique @map(\"event_id\")\n  name               String // Descriptive name like \"A203_wattage_total_>150W\"\n  datasetId          String           @map(\"dataset_id\")\n  dataset            AnalysisDataset  @relation(fields: [datasetId], references: [id])\n  line               String           @map(\"line\") // L1 or L2\n  eventTimestamp     DateTime         @map(\"event_timestamp\")\n  detectionRule      String           @map(\"detection_rule\")\n  score              Float\n  dataWindow         String           @map(\"data_window\") // JSON string for SQLite\n  status             String           @default(\"UNREVIEWED\") @map(\"status\") // \"UNREVIEWED\", \"CONFIRMED_POSITIVE\", \"REJECTED_NORMAL\"\n  reviewerId         String?          @map(\"reviewer_id\")\n  reviewTimestamp    DateTime?        @map(\"review_timestamp\")\n  justificationNotes String?          @map(\"justification_notes\")\n  createdAt          DateTime         @default(now()) @map(\"created_at\")\n  updatedAt          DateTime         @updatedAt @map(\"updated_at\")\n  experimentRunId    String?          @map(\"experiment_run_id\")\n  experimentRun      ExperimentRun?   @relation(fields: [experimentRunId], references: [id])\n  eventLabelLinks    EventLabelLink[]\n\n  @@map(\"anomaly_event\")\n}\n\n/// 異常標籤定義\nmodel AnomalyLabel {\n  id              String           @id @default(cuid())\n  name            String           @unique\n  description     String?\n  createdAt       DateTime         @default(now()) @map(\"created_at\")\n  updatedAt       DateTime         @updatedAt @map(\"updated_at\")\n  eventLabelLinks EventLabelLink[]\n\n  @@map(\"anomaly_label\")\n}\n\n/// 事件和標籤的關聯表\nmodel EventLabelLink {\n  id           String       @id @default(cuid())\n  eventId      String       @map(\"event_id\")\n  labelId      String       @map(\"label_id\")\n  createdAt    DateTime     @default(now()) @map(\"created_at\")\n  anomalyEvent AnomalyEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  anomalyLabel AnomalyLabel @relation(fields: [labelId], references: [id], onDelete: Cascade)\n\n  @@unique([eventId, labelId])\n  @@map(\"event_label_link\")\n}\n\n// ========== 3. 模型訓練與評估相關資料表 ==========\n\n/// 記錄一次完整的模型訓練事件\nmodel TrainedModel {\n  id              String        @id @default(cuid())\n  name            String\n  scenarioType    String        @map(\"scenario_type\") // \"ERM_BASELINE\", \"GENERALIZATION_CHALLENGE\", \"DOMAIN_ADAPTATION\"\n  status          String // \"PENDING\", \"RUNNING\", \"COMPLETED\", \"FAILED\"\n  experimentRunId String        @map(\"experiment_run_id\")\n  experimentRun   ExperimentRun @relation(fields: [experimentRunId], references: [id])\n\n  // nnPU 完整超參數配置（JSON 格式）\n  modelConfig      String @map(\"model_config\") // Complete nnPU hyperparameters as JSON\n  dataSourceConfig String @map(\"data_source_config\") // Data split configuration as JSON\n\n  // 訓練結果和狀態\n  modelPath         String? @map(\"model_path\")\n  trainingMetrics   String? @map(\"training_metrics\") // JSON string with loss, accuracy, etc.\n  validationMetrics String? @map(\"validation_metrics\") // JSON string with validation metrics\n  trainingLogs      String? @map(\"training_logs\") // Detailed training logs\n  jobId             String? @map(\"job_id\") // Training job tracking ID\n\n  // 訓練數據詳細信息（JSON 格式）\n  trainingDataInfo String? @map(\"training_data_info\") // JSON with P/U data sources, counts, and split details\n\n  // 時間戳記\n  createdAt   DateTime  @default(now()) @map(\"created_at\")\n  startedAt   DateTime? @map(\"started_at\")\n  completedAt DateTime? @map(\"completed_at\")\n\n  evaluationRuns EvaluationRun[]\n\n  @@map(\"trained_models\")\n}\n\n/// 記錄一次獨立的模型評估事件\nmodel EvaluationRun {\n  id                String            @id @default(cuid())\n  name              String\n  scenarioType      String            @map(\"scenario_type\") // \"ERM_BASELINE\", \"GENERALIZATION_CHALLENGE\", \"DOMAIN_ADAPTATION\"\n  status            String // \"PENDING\", \"RUNNING\", \"COMPLETED\", \"FAILED\"\n  trainedModelId    String            @map(\"trained_model_id\")\n  trainedModel      TrainedModel      @relation(fields: [trainedModelId], references: [id])\n  testSetSource     String            @map(\"test_set_source\") // JSON string for SQLite\n  evaluationMetrics String?           @map(\"evaluation_metrics\") // JSON string for SQLite\n  jobId             String?           @map(\"job_id\") // Evaluation job tracking ID\n  createdAt         DateTime          @default(now()) @map(\"created_at\")\n  completedAt       DateTime?         @map(\"completed_at\")\n  predictions       ModelPrediction[]\n\n  @@map(\"evaluation_runs\")\n}\n\n/// 記錄單一樣本的預測結果\nmodel ModelPrediction {\n  id              String        @id @default(cuid())\n  evaluationRunId String        @map(\"evaluation_run_id\")\n  evaluationRun   EvaluationRun @relation(fields: [evaluationRunId], references: [id])\n  timestamp       DateTime\n  predictionScore Float         @map(\"prediction_score\")\n  groundTruth     Int?          @map(\"ground_truth\")\n\n  @@map(\"model_predictions\")\n}\n\n// ========== 4. 額外的支援資料表 ==========\n\n/// 電錶基本資訊（簡化版）\nmodel Ammeter {\n  id                  String    @id\n  electricMeterNumber String    @map(\"electric_meter_number\")\n  electricMeterName   String    @map(\"electric_meter_name\")\n  deviceNumber        String    @unique @map(\"device_number\")\n  factory             String?\n  device              String?\n  voltage             Float?\n  currents            Float?\n  power               Float?\n  battery             Float?\n  switchState         Int?      @map(\"switch_state\")\n  networkState        Int?      @map(\"network_state\")\n  lastUpdated         DateTime? @map(\"last_updated\")\n  createdAt           DateTime? @map(\"created_at\")\n  updatedAt           DateTime? @map(\"updated_at\")\n\n  @@map(\"ammeter\")\n}\n\n/// 電錶日誌記錄（簡化版）\nmodel AmmeterLog {\n  id           String    @id\n  deviceNumber String    @map(\"device_number\")\n  action       String\n  factory      String?\n  device       String?\n  voltage      Float?\n  currents     Float?\n  power        Float?\n  battery      Float?\n  switchState  Int?      @map(\"switch_state\")\n  networkState Int?      @map(\"network_state\")\n  lastUpdated  DateTime? @map(\"last_updated\")\n  requestData  String?   @map(\"request_data\")\n  responseData String?   @map(\"response_data\")\n  statusCode   Int?      @map(\"status_code\")\n  success      Boolean\n  errorMessage String?   @map(\"error_message\")\n  responseTime Int?      @map(\"response_time\")\n  ipAddress    String?   @map(\"ip_address\")\n  userAgent    String?   @map(\"user_agent\")\n  userId       String?   @map(\"user_id\")\n  createdAt    DateTime? @map(\"created_at\")\n\n  @@map(\"ammeter_log\")\n}\n",
  "inlineSchemaHash": "f196aa4b8d85c8e0f305dc9e44511668d788fe95b1808bdd80261a0d7caf1cde",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"AnalysisDataset\":{\"dbName\":\"analysis_datasets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"building\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"floor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"room\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"dbName\":\"start_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"dbName\":\"end_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"occupantType\",\"dbName\":\"occupant_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meterIdL1\",\"dbName\":\"meter_id_l1\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meterIdL2\",\"dbName\":\"meter_id_l2\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalRecords\",\"dbName\":\"total_records\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"positiveLabels\",\"dbName\":\"positive_labels\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"analysisData\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnalysisReadyData\",\"relationName\":\"AnalysisDatasetToAnalysisReadyData\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anomalyEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnomalyEvent\",\"relationName\":\"AnalysisDatasetToAnomalyEvent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"用於管理一組組預處理完成的分析數據集（黃金週數據）\"},\"AnalysisReadyData\":{\"dbName\":\"analysis_ready_data\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"datasetId\",\"dbName\":\"dataset_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataset\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnalysisDataset\",\"relationName\":\"AnalysisDatasetToAnalysisReadyData\",\"relationFromFields\":[\"datasetId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"room\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawWattageL1\",\"dbName\":\"raw_wattage_l1\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rawWattageL2\",\"dbName\":\"raw_wattage_l2\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wattage110v\",\"dbName\":\"wattage_110v\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wattage220v\",\"dbName\":\"wattage_220v\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wattageTotal\",\"dbName\":\"wattage_total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPositiveLabel\",\"dbName\":\"is_positive_label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceAnomalyEventId\",\"dbName\":\"source_anomaly_event_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"存放預處理完成、每分鐘的、可直接用於模型訓練的數據\"},\"ExperimentRun\":{\"dbName\":\"experiment_run\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filteringParameters\",\"dbName\":\"filtering_parameters\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"dbName\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"CONFIGURING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"candidateCount\",\"dbName\":\"candidate_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalDataPoolSize\",\"dbName\":\"total_data_pool_size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"positiveLabelCount\",\"dbName\":\"positive_label_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"negativeLabelCount\",\"dbName\":\"negative_label_count\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"candidateStats\",\"dbName\":\"candidate_stats\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anomalyEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnomalyEvent\",\"relationName\":\"AnomalyEventToExperimentRun\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainedModels\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TrainedModel\",\"relationName\":\"ExperimentRunToTrainedModel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"實驗運行配置和狀態\"},\"AnomalyEvent\":{\"dbName\":\"anomaly_event\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventId\",\"dbName\":\"event_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"datasetId\",\"dbName\":\"dataset_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataset\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnalysisDataset\",\"relationName\":\"AnalysisDatasetToAnomalyEvent\",\"relationFromFields\":[\"datasetId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"line\",\"dbName\":\"line\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventTimestamp\",\"dbName\":\"event_timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"detectionRule\",\"dbName\":\"detection_rule\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataWindow\",\"dbName\":\"data_window\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"dbName\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"UNREVIEWED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewerId\",\"dbName\":\"reviewer_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewTimestamp\",\"dbName\":\"review_timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"justificationNotes\",\"dbName\":\"justification_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"experimentRunId\",\"dbName\":\"experiment_run_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"experimentRun\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExperimentRun\",\"relationName\":\"AnomalyEventToExperimentRun\",\"relationFromFields\":[\"experimentRunId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventLabelLinks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EventLabelLink\",\"relationName\":\"AnomalyEventToEventLabelLink\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Anomaly event records\"},\"AnomalyLabel\":{\"dbName\":\"anomaly_label\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"eventLabelLinks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EventLabelLink\",\"relationName\":\"AnomalyLabelToEventLabelLink\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"異常標籤定義\"},\"EventLabelLink\":{\"dbName\":\"event_label_link\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventId\",\"dbName\":\"event_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"labelId\",\"dbName\":\"label_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anomalyEvent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnomalyEvent\",\"relationName\":\"AnomalyEventToEventLabelLink\",\"relationFromFields\":[\"eventId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anomalyLabel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AnomalyLabel\",\"relationName\":\"AnomalyLabelToEventLabelLink\",\"relationFromFields\":[\"labelId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"eventId\",\"labelId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"eventId\",\"labelId\"]}],\"isGenerated\":false,\"documentation\":\"事件和標籤的關聯表\"},\"TrainedModel\":{\"dbName\":\"trained_models\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scenarioType\",\"dbName\":\"scenario_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"experimentRunId\",\"dbName\":\"experiment_run_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"experimentRun\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ExperimentRun\",\"relationName\":\"ExperimentRunToTrainedModel\",\"relationFromFields\":[\"experimentRunId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelConfig\",\"dbName\":\"model_config\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataSourceConfig\",\"dbName\":\"data_source_config\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"modelPath\",\"dbName\":\"model_path\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainingMetrics\",\"dbName\":\"training_metrics\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validationMetrics\",\"dbName\":\"validation_metrics\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainingLogs\",\"dbName\":\"training_logs\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"dbName\":\"job_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainingDataInfo\",\"dbName\":\"training_data_info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"dbName\":\"started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evaluationRuns\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EvaluationRun\",\"relationName\":\"EvaluationRunToTrainedModel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"記錄一次完整的模型訓練事件\"},\"EvaluationRun\":{\"dbName\":\"evaluation_runs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scenarioType\",\"dbName\":\"scenario_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainedModelId\",\"dbName\":\"trained_model_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trainedModel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TrainedModel\",\"relationName\":\"EvaluationRunToTrainedModel\",\"relationFromFields\":[\"trainedModelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"testSetSource\",\"dbName\":\"test_set_source\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evaluationMetrics\",\"dbName\":\"evaluation_metrics\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobId\",\"dbName\":\"job_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"predictions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ModelPrediction\",\"relationName\":\"EvaluationRunToModelPrediction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"記錄一次獨立的模型評估事件\"},\"ModelPrediction\":{\"dbName\":\"model_predictions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evaluationRunId\",\"dbName\":\"evaluation_run_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evaluationRun\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EvaluationRun\",\"relationName\":\"EvaluationRunToModelPrediction\",\"relationFromFields\":[\"evaluationRunId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"predictionScore\",\"dbName\":\"prediction_score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groundTruth\",\"dbName\":\"ground_truth\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"記錄單一樣本的預測結果\"},\"Ammeter\":{\"dbName\":\"ammeter\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"electricMeterNumber\",\"dbName\":\"electric_meter_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"electricMeterName\",\"dbName\":\"electric_meter_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceNumber\",\"dbName\":\"device_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voltage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"power\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"battery\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"switchState\",\"dbName\":\"switch_state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"networkState\",\"dbName\":\"network_state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUpdated\",\"dbName\":\"last_updated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"電錶基本資訊（簡化版）\"},\"AmmeterLog\":{\"dbName\":\"ammeter_log\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceNumber\",\"dbName\":\"device_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"device\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"voltage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"power\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"battery\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"switchState\",\"dbName\":\"switch_state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"networkState\",\"dbName\":\"network_state\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUpdated\",\"dbName\":\"last_updated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestData\",\"dbName\":\"request_data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseData\",\"dbName\":\"response_data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusCode\",\"dbName\":\"status_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"success\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"dbName\":\"error_message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseTime\",\"dbName\":\"response_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"dbName\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"電錶日誌記錄（簡化版）\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {}
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)


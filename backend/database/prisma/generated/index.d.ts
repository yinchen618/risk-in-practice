
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AnalysisDataset
 * 用於管理一組組預處理完成的分析數據集（黃金週數據）
 */
export type AnalysisDataset = $Result.DefaultSelection<Prisma.$AnalysisDatasetPayload>
/**
 * Model AnalysisReadyData
 * 存放預處理完成、每分鐘的、可直接用於模型訓練的數據
 */
export type AnalysisReadyData = $Result.DefaultSelection<Prisma.$AnalysisReadyDataPayload>
/**
 * Model ExperimentRun
 * 實驗運行配置和狀態
 */
export type ExperimentRun = $Result.DefaultSelection<Prisma.$ExperimentRunPayload>
/**
 * Model AnomalyEvent
 * Anomaly event records
 */
export type AnomalyEvent = $Result.DefaultSelection<Prisma.$AnomalyEventPayload>
/**
 * Model AnomalyLabel
 * 異常標籤定義
 */
export type AnomalyLabel = $Result.DefaultSelection<Prisma.$AnomalyLabelPayload>
/**
 * Model EventLabelLink
 * 事件和標籤的關聯表
 */
export type EventLabelLink = $Result.DefaultSelection<Prisma.$EventLabelLinkPayload>
/**
 * Model TrainedModel
 * 記錄一次完整的模型訓練事件
 */
export type TrainedModel = $Result.DefaultSelection<Prisma.$TrainedModelPayload>
/**
 * Model EvaluationRun
 * 記錄一次獨立的模型評估事件
 */
export type EvaluationRun = $Result.DefaultSelection<Prisma.$EvaluationRunPayload>
/**
 * Model ModelPrediction
 * 記錄單一樣本的預測結果
 */
export type ModelPrediction = $Result.DefaultSelection<Prisma.$ModelPredictionPayload>
/**
 * Model Ammeter
 * 電錶基本資訊（簡化版）
 */
export type Ammeter = $Result.DefaultSelection<Prisma.$AmmeterPayload>
/**
 * Model AmmeterLog
 * 電錶日誌記錄（簡化版）
 */
export type AmmeterLog = $Result.DefaultSelection<Prisma.$AmmeterLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AnalysisDatasets
 * const analysisDatasets = await prisma.analysisDataset.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AnalysisDatasets
   * const analysisDatasets = await prisma.analysisDataset.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.analysisDataset`: Exposes CRUD operations for the **AnalysisDataset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisDatasets
    * const analysisDatasets = await prisma.analysisDataset.findMany()
    * ```
    */
  get analysisDataset(): Prisma.AnalysisDatasetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysisReadyData`: Exposes CRUD operations for the **AnalysisReadyData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisReadyData
    * const analysisReadyData = await prisma.analysisReadyData.findMany()
    * ```
    */
  get analysisReadyData(): Prisma.AnalysisReadyDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.experimentRun`: Exposes CRUD operations for the **ExperimentRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExperimentRuns
    * const experimentRuns = await prisma.experimentRun.findMany()
    * ```
    */
  get experimentRun(): Prisma.ExperimentRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.anomalyEvent`: Exposes CRUD operations for the **AnomalyEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnomalyEvents
    * const anomalyEvents = await prisma.anomalyEvent.findMany()
    * ```
    */
  get anomalyEvent(): Prisma.AnomalyEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.anomalyLabel`: Exposes CRUD operations for the **AnomalyLabel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnomalyLabels
    * const anomalyLabels = await prisma.anomalyLabel.findMany()
    * ```
    */
  get anomalyLabel(): Prisma.AnomalyLabelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventLabelLink`: Exposes CRUD operations for the **EventLabelLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventLabelLinks
    * const eventLabelLinks = await prisma.eventLabelLink.findMany()
    * ```
    */
  get eventLabelLink(): Prisma.EventLabelLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trainedModel`: Exposes CRUD operations for the **TrainedModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrainedModels
    * const trainedModels = await prisma.trainedModel.findMany()
    * ```
    */
  get trainedModel(): Prisma.TrainedModelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.evaluationRun`: Exposes CRUD operations for the **EvaluationRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EvaluationRuns
    * const evaluationRuns = await prisma.evaluationRun.findMany()
    * ```
    */
  get evaluationRun(): Prisma.EvaluationRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.modelPrediction`: Exposes CRUD operations for the **ModelPrediction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ModelPredictions
    * const modelPredictions = await prisma.modelPrediction.findMany()
    * ```
    */
  get modelPrediction(): Prisma.ModelPredictionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ammeter`: Exposes CRUD operations for the **Ammeter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ammeters
    * const ammeters = await prisma.ammeter.findMany()
    * ```
    */
  get ammeter(): Prisma.AmmeterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ammeterLog`: Exposes CRUD operations for the **AmmeterLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AmmeterLogs
    * const ammeterLogs = await prisma.ammeterLog.findMany()
    * ```
    */
  get ammeterLog(): Prisma.AmmeterLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "analysisDataset" | "analysisReadyData" | "experimentRun" | "anomalyEvent" | "anomalyLabel" | "eventLabelLink" | "trainedModel" | "evaluationRun" | "modelPrediction" | "ammeter" | "ammeterLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AnalysisDataset: {
        payload: Prisma.$AnalysisDatasetPayload<ExtArgs>
        fields: Prisma.AnalysisDatasetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisDatasetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisDatasetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          findFirst: {
            args: Prisma.AnalysisDatasetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisDatasetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          findMany: {
            args: Prisma.AnalysisDatasetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>[]
          }
          create: {
            args: Prisma.AnalysisDatasetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          createMany: {
            args: Prisma.AnalysisDatasetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisDatasetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>[]
          }
          delete: {
            args: Prisma.AnalysisDatasetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          update: {
            args: Prisma.AnalysisDatasetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisDatasetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisDatasetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisDatasetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisDatasetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisDatasetPayload>
          }
          aggregate: {
            args: Prisma.AnalysisDatasetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisDataset>
          }
          groupBy: {
            args: Prisma.AnalysisDatasetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisDatasetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisDatasetCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisDatasetCountAggregateOutputType> | number
          }
        }
      }
      AnalysisReadyData: {
        payload: Prisma.$AnalysisReadyDataPayload<ExtArgs>
        fields: Prisma.AnalysisReadyDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisReadyDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisReadyDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          findFirst: {
            args: Prisma.AnalysisReadyDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisReadyDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          findMany: {
            args: Prisma.AnalysisReadyDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>[]
          }
          create: {
            args: Prisma.AnalysisReadyDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          createMany: {
            args: Prisma.AnalysisReadyDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisReadyDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>[]
          }
          delete: {
            args: Prisma.AnalysisReadyDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          update: {
            args: Prisma.AnalysisReadyDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisReadyDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisReadyDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisReadyDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisReadyDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisReadyDataPayload>
          }
          aggregate: {
            args: Prisma.AnalysisReadyDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisReadyData>
          }
          groupBy: {
            args: Prisma.AnalysisReadyDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisReadyDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisReadyDataCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisReadyDataCountAggregateOutputType> | number
          }
        }
      }
      ExperimentRun: {
        payload: Prisma.$ExperimentRunPayload<ExtArgs>
        fields: Prisma.ExperimentRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExperimentRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExperimentRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          findFirst: {
            args: Prisma.ExperimentRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExperimentRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          findMany: {
            args: Prisma.ExperimentRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>[]
          }
          create: {
            args: Prisma.ExperimentRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          createMany: {
            args: Prisma.ExperimentRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExperimentRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>[]
          }
          delete: {
            args: Prisma.ExperimentRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          update: {
            args: Prisma.ExperimentRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          deleteMany: {
            args: Prisma.ExperimentRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExperimentRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExperimentRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>[]
          }
          upsert: {
            args: Prisma.ExperimentRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperimentRunPayload>
          }
          aggregate: {
            args: Prisma.ExperimentRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExperimentRun>
          }
          groupBy: {
            args: Prisma.ExperimentRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExperimentRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExperimentRunCountArgs<ExtArgs>
            result: $Utils.Optional<ExperimentRunCountAggregateOutputType> | number
          }
        }
      }
      AnomalyEvent: {
        payload: Prisma.$AnomalyEventPayload<ExtArgs>
        fields: Prisma.AnomalyEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnomalyEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnomalyEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          findFirst: {
            args: Prisma.AnomalyEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnomalyEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          findMany: {
            args: Prisma.AnomalyEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>[]
          }
          create: {
            args: Prisma.AnomalyEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          createMany: {
            args: Prisma.AnomalyEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnomalyEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>[]
          }
          delete: {
            args: Prisma.AnomalyEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          update: {
            args: Prisma.AnomalyEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          deleteMany: {
            args: Prisma.AnomalyEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnomalyEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnomalyEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>[]
          }
          upsert: {
            args: Prisma.AnomalyEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyEventPayload>
          }
          aggregate: {
            args: Prisma.AnomalyEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnomalyEvent>
          }
          groupBy: {
            args: Prisma.AnomalyEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnomalyEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnomalyEventCountArgs<ExtArgs>
            result: $Utils.Optional<AnomalyEventCountAggregateOutputType> | number
          }
        }
      }
      AnomalyLabel: {
        payload: Prisma.$AnomalyLabelPayload<ExtArgs>
        fields: Prisma.AnomalyLabelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnomalyLabelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnomalyLabelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          findFirst: {
            args: Prisma.AnomalyLabelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnomalyLabelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          findMany: {
            args: Prisma.AnomalyLabelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>[]
          }
          create: {
            args: Prisma.AnomalyLabelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          createMany: {
            args: Prisma.AnomalyLabelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnomalyLabelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>[]
          }
          delete: {
            args: Prisma.AnomalyLabelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          update: {
            args: Prisma.AnomalyLabelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          deleteMany: {
            args: Prisma.AnomalyLabelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnomalyLabelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnomalyLabelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>[]
          }
          upsert: {
            args: Prisma.AnomalyLabelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnomalyLabelPayload>
          }
          aggregate: {
            args: Prisma.AnomalyLabelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnomalyLabel>
          }
          groupBy: {
            args: Prisma.AnomalyLabelGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnomalyLabelGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnomalyLabelCountArgs<ExtArgs>
            result: $Utils.Optional<AnomalyLabelCountAggregateOutputType> | number
          }
        }
      }
      EventLabelLink: {
        payload: Prisma.$EventLabelLinkPayload<ExtArgs>
        fields: Prisma.EventLabelLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventLabelLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventLabelLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          findFirst: {
            args: Prisma.EventLabelLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventLabelLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          findMany: {
            args: Prisma.EventLabelLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>[]
          }
          create: {
            args: Prisma.EventLabelLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          createMany: {
            args: Prisma.EventLabelLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventLabelLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>[]
          }
          delete: {
            args: Prisma.EventLabelLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          update: {
            args: Prisma.EventLabelLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          deleteMany: {
            args: Prisma.EventLabelLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventLabelLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventLabelLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>[]
          }
          upsert: {
            args: Prisma.EventLabelLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLabelLinkPayload>
          }
          aggregate: {
            args: Prisma.EventLabelLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventLabelLink>
          }
          groupBy: {
            args: Prisma.EventLabelLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventLabelLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventLabelLinkCountArgs<ExtArgs>
            result: $Utils.Optional<EventLabelLinkCountAggregateOutputType> | number
          }
        }
      }
      TrainedModel: {
        payload: Prisma.$TrainedModelPayload<ExtArgs>
        fields: Prisma.TrainedModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrainedModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrainedModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          findFirst: {
            args: Prisma.TrainedModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrainedModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          findMany: {
            args: Prisma.TrainedModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>[]
          }
          create: {
            args: Prisma.TrainedModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          createMany: {
            args: Prisma.TrainedModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrainedModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>[]
          }
          delete: {
            args: Prisma.TrainedModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          update: {
            args: Prisma.TrainedModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          deleteMany: {
            args: Prisma.TrainedModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrainedModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrainedModelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>[]
          }
          upsert: {
            args: Prisma.TrainedModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainedModelPayload>
          }
          aggregate: {
            args: Prisma.TrainedModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrainedModel>
          }
          groupBy: {
            args: Prisma.TrainedModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrainedModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrainedModelCountArgs<ExtArgs>
            result: $Utils.Optional<TrainedModelCountAggregateOutputType> | number
          }
        }
      }
      EvaluationRun: {
        payload: Prisma.$EvaluationRunPayload<ExtArgs>
        fields: Prisma.EvaluationRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EvaluationRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EvaluationRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          findFirst: {
            args: Prisma.EvaluationRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EvaluationRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          findMany: {
            args: Prisma.EvaluationRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>[]
          }
          create: {
            args: Prisma.EvaluationRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          createMany: {
            args: Prisma.EvaluationRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EvaluationRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>[]
          }
          delete: {
            args: Prisma.EvaluationRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          update: {
            args: Prisma.EvaluationRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          deleteMany: {
            args: Prisma.EvaluationRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EvaluationRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EvaluationRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>[]
          }
          upsert: {
            args: Prisma.EvaluationRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EvaluationRunPayload>
          }
          aggregate: {
            args: Prisma.EvaluationRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvaluationRun>
          }
          groupBy: {
            args: Prisma.EvaluationRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<EvaluationRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.EvaluationRunCountArgs<ExtArgs>
            result: $Utils.Optional<EvaluationRunCountAggregateOutputType> | number
          }
        }
      }
      ModelPrediction: {
        payload: Prisma.$ModelPredictionPayload<ExtArgs>
        fields: Prisma.ModelPredictionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModelPredictionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModelPredictionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          findFirst: {
            args: Prisma.ModelPredictionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModelPredictionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          findMany: {
            args: Prisma.ModelPredictionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>[]
          }
          create: {
            args: Prisma.ModelPredictionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          createMany: {
            args: Prisma.ModelPredictionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModelPredictionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>[]
          }
          delete: {
            args: Prisma.ModelPredictionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          update: {
            args: Prisma.ModelPredictionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          deleteMany: {
            args: Prisma.ModelPredictionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModelPredictionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModelPredictionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>[]
          }
          upsert: {
            args: Prisma.ModelPredictionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelPredictionPayload>
          }
          aggregate: {
            args: Prisma.ModelPredictionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModelPrediction>
          }
          groupBy: {
            args: Prisma.ModelPredictionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModelPredictionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModelPredictionCountArgs<ExtArgs>
            result: $Utils.Optional<ModelPredictionCountAggregateOutputType> | number
          }
        }
      }
      Ammeter: {
        payload: Prisma.$AmmeterPayload<ExtArgs>
        fields: Prisma.AmmeterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmmeterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmmeterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          findFirst: {
            args: Prisma.AmmeterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmmeterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          findMany: {
            args: Prisma.AmmeterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>[]
          }
          create: {
            args: Prisma.AmmeterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          createMany: {
            args: Prisma.AmmeterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmmeterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>[]
          }
          delete: {
            args: Prisma.AmmeterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          update: {
            args: Prisma.AmmeterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          deleteMany: {
            args: Prisma.AmmeterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmmeterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmmeterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>[]
          }
          upsert: {
            args: Prisma.AmmeterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterPayload>
          }
          aggregate: {
            args: Prisma.AmmeterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmmeter>
          }
          groupBy: {
            args: Prisma.AmmeterGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmmeterGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmmeterCountArgs<ExtArgs>
            result: $Utils.Optional<AmmeterCountAggregateOutputType> | number
          }
        }
      }
      AmmeterLog: {
        payload: Prisma.$AmmeterLogPayload<ExtArgs>
        fields: Prisma.AmmeterLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AmmeterLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AmmeterLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          findFirst: {
            args: Prisma.AmmeterLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AmmeterLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          findMany: {
            args: Prisma.AmmeterLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>[]
          }
          create: {
            args: Prisma.AmmeterLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          createMany: {
            args: Prisma.AmmeterLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AmmeterLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>[]
          }
          delete: {
            args: Prisma.AmmeterLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          update: {
            args: Prisma.AmmeterLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          deleteMany: {
            args: Prisma.AmmeterLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AmmeterLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AmmeterLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>[]
          }
          upsert: {
            args: Prisma.AmmeterLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AmmeterLogPayload>
          }
          aggregate: {
            args: Prisma.AmmeterLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAmmeterLog>
          }
          groupBy: {
            args: Prisma.AmmeterLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AmmeterLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AmmeterLogCountArgs<ExtArgs>
            result: $Utils.Optional<AmmeterLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    analysisDataset?: AnalysisDatasetOmit
    analysisReadyData?: AnalysisReadyDataOmit
    experimentRun?: ExperimentRunOmit
    anomalyEvent?: AnomalyEventOmit
    anomalyLabel?: AnomalyLabelOmit
    eventLabelLink?: EventLabelLinkOmit
    trainedModel?: TrainedModelOmit
    evaluationRun?: EvaluationRunOmit
    modelPrediction?: ModelPredictionOmit
    ammeter?: AmmeterOmit
    ammeterLog?: AmmeterLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AnalysisDatasetCountOutputType
   */

  export type AnalysisDatasetCountOutputType = {
    analysisData: number
    anomalyEvents: number
  }

  export type AnalysisDatasetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisData?: boolean | AnalysisDatasetCountOutputTypeCountAnalysisDataArgs
    anomalyEvents?: boolean | AnalysisDatasetCountOutputTypeCountAnomalyEventsArgs
  }

  // Custom InputTypes
  /**
   * AnalysisDatasetCountOutputType without action
   */
  export type AnalysisDatasetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDatasetCountOutputType
     */
    select?: AnalysisDatasetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnalysisDatasetCountOutputType without action
   */
  export type AnalysisDatasetCountOutputTypeCountAnalysisDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisReadyDataWhereInput
  }

  /**
   * AnalysisDatasetCountOutputType without action
   */
  export type AnalysisDatasetCountOutputTypeCountAnomalyEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnomalyEventWhereInput
  }


  /**
   * Count Type ExperimentRunCountOutputType
   */

  export type ExperimentRunCountOutputType = {
    anomalyEvents: number
    trainedModels: number
  }

  export type ExperimentRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anomalyEvents?: boolean | ExperimentRunCountOutputTypeCountAnomalyEventsArgs
    trainedModels?: boolean | ExperimentRunCountOutputTypeCountTrainedModelsArgs
  }

  // Custom InputTypes
  /**
   * ExperimentRunCountOutputType without action
   */
  export type ExperimentRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRunCountOutputType
     */
    select?: ExperimentRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExperimentRunCountOutputType without action
   */
  export type ExperimentRunCountOutputTypeCountAnomalyEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnomalyEventWhereInput
  }

  /**
   * ExperimentRunCountOutputType without action
   */
  export type ExperimentRunCountOutputTypeCountTrainedModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainedModelWhereInput
  }


  /**
   * Count Type AnomalyEventCountOutputType
   */

  export type AnomalyEventCountOutputType = {
    eventLabelLinks: number
  }

  export type AnomalyEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    eventLabelLinks?: boolean | AnomalyEventCountOutputTypeCountEventLabelLinksArgs
  }

  // Custom InputTypes
  /**
   * AnomalyEventCountOutputType without action
   */
  export type AnomalyEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEventCountOutputType
     */
    select?: AnomalyEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnomalyEventCountOutputType without action
   */
  export type AnomalyEventCountOutputTypeCountEventLabelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventLabelLinkWhereInput
  }


  /**
   * Count Type AnomalyLabelCountOutputType
   */

  export type AnomalyLabelCountOutputType = {
    eventLabelLinks: number
  }

  export type AnomalyLabelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    eventLabelLinks?: boolean | AnomalyLabelCountOutputTypeCountEventLabelLinksArgs
  }

  // Custom InputTypes
  /**
   * AnomalyLabelCountOutputType without action
   */
  export type AnomalyLabelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabelCountOutputType
     */
    select?: AnomalyLabelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnomalyLabelCountOutputType without action
   */
  export type AnomalyLabelCountOutputTypeCountEventLabelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventLabelLinkWhereInput
  }


  /**
   * Count Type TrainedModelCountOutputType
   */

  export type TrainedModelCountOutputType = {
    evaluationRuns: number
  }

  export type TrainedModelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluationRuns?: boolean | TrainedModelCountOutputTypeCountEvaluationRunsArgs
  }

  // Custom InputTypes
  /**
   * TrainedModelCountOutputType without action
   */
  export type TrainedModelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModelCountOutputType
     */
    select?: TrainedModelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TrainedModelCountOutputType without action
   */
  export type TrainedModelCountOutputTypeCountEvaluationRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationRunWhereInput
  }


  /**
   * Count Type EvaluationRunCountOutputType
   */

  export type EvaluationRunCountOutputType = {
    predictions: number
  }

  export type EvaluationRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    predictions?: boolean | EvaluationRunCountOutputTypeCountPredictionsArgs
  }

  // Custom InputTypes
  /**
   * EvaluationRunCountOutputType without action
   */
  export type EvaluationRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRunCountOutputType
     */
    select?: EvaluationRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EvaluationRunCountOutputType without action
   */
  export type EvaluationRunCountOutputTypeCountPredictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModelPredictionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AnalysisDataset
   */

  export type AggregateAnalysisDataset = {
    _count: AnalysisDatasetCountAggregateOutputType | null
    _avg: AnalysisDatasetAvgAggregateOutputType | null
    _sum: AnalysisDatasetSumAggregateOutputType | null
    _min: AnalysisDatasetMinAggregateOutputType | null
    _max: AnalysisDatasetMaxAggregateOutputType | null
  }

  export type AnalysisDatasetAvgAggregateOutputType = {
    totalRecords: number | null
    positiveLabels: number | null
  }

  export type AnalysisDatasetSumAggregateOutputType = {
    totalRecords: number | null
    positiveLabels: number | null
  }

  export type AnalysisDatasetMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    building: string | null
    floor: string | null
    room: string | null
    startDate: Date | null
    endDate: Date | null
    occupantType: string | null
    meterIdL1: string | null
    meterIdL2: string | null
    totalRecords: number | null
    positiveLabels: number | null
    createdAt: Date | null
  }

  export type AnalysisDatasetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    building: string | null
    floor: string | null
    room: string | null
    startDate: Date | null
    endDate: Date | null
    occupantType: string | null
    meterIdL1: string | null
    meterIdL2: string | null
    totalRecords: number | null
    positiveLabels: number | null
    createdAt: Date | null
  }

  export type AnalysisDatasetCountAggregateOutputType = {
    id: number
    name: number
    description: number
    building: number
    floor: number
    room: number
    startDate: number
    endDate: number
    occupantType: number
    meterIdL1: number
    meterIdL2: number
    totalRecords: number
    positiveLabels: number
    createdAt: number
    _all: number
  }


  export type AnalysisDatasetAvgAggregateInputType = {
    totalRecords?: true
    positiveLabels?: true
  }

  export type AnalysisDatasetSumAggregateInputType = {
    totalRecords?: true
    positiveLabels?: true
  }

  export type AnalysisDatasetMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    building?: true
    floor?: true
    room?: true
    startDate?: true
    endDate?: true
    occupantType?: true
    meterIdL1?: true
    meterIdL2?: true
    totalRecords?: true
    positiveLabels?: true
    createdAt?: true
  }

  export type AnalysisDatasetMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    building?: true
    floor?: true
    room?: true
    startDate?: true
    endDate?: true
    occupantType?: true
    meterIdL1?: true
    meterIdL2?: true
    totalRecords?: true
    positiveLabels?: true
    createdAt?: true
  }

  export type AnalysisDatasetCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    building?: true
    floor?: true
    room?: true
    startDate?: true
    endDate?: true
    occupantType?: true
    meterIdL1?: true
    meterIdL2?: true
    totalRecords?: true
    positiveLabels?: true
    createdAt?: true
    _all?: true
  }

  export type AnalysisDatasetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisDataset to aggregate.
     */
    where?: AnalysisDatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisDatasets to fetch.
     */
    orderBy?: AnalysisDatasetOrderByWithRelationInput | AnalysisDatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisDatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisDatasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisDatasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisDatasets
    **/
    _count?: true | AnalysisDatasetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisDatasetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisDatasetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisDatasetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisDatasetMaxAggregateInputType
  }

  export type GetAnalysisDatasetAggregateType<T extends AnalysisDatasetAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisDataset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisDataset[P]>
      : GetScalarType<T[P], AggregateAnalysisDataset[P]>
  }




  export type AnalysisDatasetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisDatasetWhereInput
    orderBy?: AnalysisDatasetOrderByWithAggregationInput | AnalysisDatasetOrderByWithAggregationInput[]
    by: AnalysisDatasetScalarFieldEnum[] | AnalysisDatasetScalarFieldEnum
    having?: AnalysisDatasetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisDatasetCountAggregateInputType | true
    _avg?: AnalysisDatasetAvgAggregateInputType
    _sum?: AnalysisDatasetSumAggregateInputType
    _min?: AnalysisDatasetMinAggregateInputType
    _max?: AnalysisDatasetMaxAggregateInputType
  }

  export type AnalysisDatasetGroupByOutputType = {
    id: string
    name: string
    description: string | null
    building: string
    floor: string
    room: string
    startDate: Date
    endDate: Date
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt: Date
    _count: AnalysisDatasetCountAggregateOutputType | null
    _avg: AnalysisDatasetAvgAggregateOutputType | null
    _sum: AnalysisDatasetSumAggregateOutputType | null
    _min: AnalysisDatasetMinAggregateOutputType | null
    _max: AnalysisDatasetMaxAggregateOutputType | null
  }

  type GetAnalysisDatasetGroupByPayload<T extends AnalysisDatasetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisDatasetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisDatasetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisDatasetGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisDatasetGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisDatasetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    building?: boolean
    floor?: boolean
    room?: boolean
    startDate?: boolean
    endDate?: boolean
    occupantType?: boolean
    meterIdL1?: boolean
    meterIdL2?: boolean
    totalRecords?: boolean
    positiveLabels?: boolean
    createdAt?: boolean
    analysisData?: boolean | AnalysisDataset$analysisDataArgs<ExtArgs>
    anomalyEvents?: boolean | AnalysisDataset$anomalyEventsArgs<ExtArgs>
    _count?: boolean | AnalysisDatasetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisDataset"]>

  export type AnalysisDatasetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    building?: boolean
    floor?: boolean
    room?: boolean
    startDate?: boolean
    endDate?: boolean
    occupantType?: boolean
    meterIdL1?: boolean
    meterIdL2?: boolean
    totalRecords?: boolean
    positiveLabels?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["analysisDataset"]>

  export type AnalysisDatasetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    building?: boolean
    floor?: boolean
    room?: boolean
    startDate?: boolean
    endDate?: boolean
    occupantType?: boolean
    meterIdL1?: boolean
    meterIdL2?: boolean
    totalRecords?: boolean
    positiveLabels?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["analysisDataset"]>

  export type AnalysisDatasetSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    building?: boolean
    floor?: boolean
    room?: boolean
    startDate?: boolean
    endDate?: boolean
    occupantType?: boolean
    meterIdL1?: boolean
    meterIdL2?: boolean
    totalRecords?: boolean
    positiveLabels?: boolean
    createdAt?: boolean
  }

  export type AnalysisDatasetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "building" | "floor" | "room" | "startDate" | "endDate" | "occupantType" | "meterIdL1" | "meterIdL2" | "totalRecords" | "positiveLabels" | "createdAt", ExtArgs["result"]["analysisDataset"]>
  export type AnalysisDatasetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysisData?: boolean | AnalysisDataset$analysisDataArgs<ExtArgs>
    anomalyEvents?: boolean | AnalysisDataset$anomalyEventsArgs<ExtArgs>
    _count?: boolean | AnalysisDatasetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnalysisDatasetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AnalysisDatasetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AnalysisDatasetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisDataset"
    objects: {
      analysisData: Prisma.$AnalysisReadyDataPayload<ExtArgs>[]
      anomalyEvents: Prisma.$AnomalyEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      building: string
      floor: string
      room: string
      startDate: Date
      endDate: Date
      occupantType: string
      meterIdL1: string
      meterIdL2: string
      totalRecords: number
      positiveLabels: number
      createdAt: Date
    }, ExtArgs["result"]["analysisDataset"]>
    composites: {}
  }

  type AnalysisDatasetGetPayload<S extends boolean | null | undefined | AnalysisDatasetDefaultArgs> = $Result.GetResult<Prisma.$AnalysisDatasetPayload, S>

  type AnalysisDatasetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisDatasetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisDatasetCountAggregateInputType | true
    }

  export interface AnalysisDatasetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisDataset'], meta: { name: 'AnalysisDataset' } }
    /**
     * Find zero or one AnalysisDataset that matches the filter.
     * @param {AnalysisDatasetFindUniqueArgs} args - Arguments to find a AnalysisDataset
     * @example
     * // Get one AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisDatasetFindUniqueArgs>(args: SelectSubset<T, AnalysisDatasetFindUniqueArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisDataset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisDatasetFindUniqueOrThrowArgs} args - Arguments to find a AnalysisDataset
     * @example
     * // Get one AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisDatasetFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisDatasetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisDataset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetFindFirstArgs} args - Arguments to find a AnalysisDataset
     * @example
     * // Get one AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisDatasetFindFirstArgs>(args?: SelectSubset<T, AnalysisDatasetFindFirstArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisDataset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetFindFirstOrThrowArgs} args - Arguments to find a AnalysisDataset
     * @example
     * // Get one AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisDatasetFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisDatasetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisDatasets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisDatasets
     * const analysisDatasets = await prisma.analysisDataset.findMany()
     * 
     * // Get first 10 AnalysisDatasets
     * const analysisDatasets = await prisma.analysisDataset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisDatasetWithIdOnly = await prisma.analysisDataset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisDatasetFindManyArgs>(args?: SelectSubset<T, AnalysisDatasetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisDataset.
     * @param {AnalysisDatasetCreateArgs} args - Arguments to create a AnalysisDataset.
     * @example
     * // Create one AnalysisDataset
     * const AnalysisDataset = await prisma.analysisDataset.create({
     *   data: {
     *     // ... data to create a AnalysisDataset
     *   }
     * })
     * 
     */
    create<T extends AnalysisDatasetCreateArgs>(args: SelectSubset<T, AnalysisDatasetCreateArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisDatasets.
     * @param {AnalysisDatasetCreateManyArgs} args - Arguments to create many AnalysisDatasets.
     * @example
     * // Create many AnalysisDatasets
     * const analysisDataset = await prisma.analysisDataset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisDatasetCreateManyArgs>(args?: SelectSubset<T, AnalysisDatasetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisDatasets and returns the data saved in the database.
     * @param {AnalysisDatasetCreateManyAndReturnArgs} args - Arguments to create many AnalysisDatasets.
     * @example
     * // Create many AnalysisDatasets
     * const analysisDataset = await prisma.analysisDataset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisDatasets and only return the `id`
     * const analysisDatasetWithIdOnly = await prisma.analysisDataset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisDatasetCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisDatasetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisDataset.
     * @param {AnalysisDatasetDeleteArgs} args - Arguments to delete one AnalysisDataset.
     * @example
     * // Delete one AnalysisDataset
     * const AnalysisDataset = await prisma.analysisDataset.delete({
     *   where: {
     *     // ... filter to delete one AnalysisDataset
     *   }
     * })
     * 
     */
    delete<T extends AnalysisDatasetDeleteArgs>(args: SelectSubset<T, AnalysisDatasetDeleteArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisDataset.
     * @param {AnalysisDatasetUpdateArgs} args - Arguments to update one AnalysisDataset.
     * @example
     * // Update one AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisDatasetUpdateArgs>(args: SelectSubset<T, AnalysisDatasetUpdateArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisDatasets.
     * @param {AnalysisDatasetDeleteManyArgs} args - Arguments to filter AnalysisDatasets to delete.
     * @example
     * // Delete a few AnalysisDatasets
     * const { count } = await prisma.analysisDataset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisDatasetDeleteManyArgs>(args?: SelectSubset<T, AnalysisDatasetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisDatasets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisDatasets
     * const analysisDataset = await prisma.analysisDataset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisDatasetUpdateManyArgs>(args: SelectSubset<T, AnalysisDatasetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisDatasets and returns the data updated in the database.
     * @param {AnalysisDatasetUpdateManyAndReturnArgs} args - Arguments to update many AnalysisDatasets.
     * @example
     * // Update many AnalysisDatasets
     * const analysisDataset = await prisma.analysisDataset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisDatasets and only return the `id`
     * const analysisDatasetWithIdOnly = await prisma.analysisDataset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisDatasetUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisDatasetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisDataset.
     * @param {AnalysisDatasetUpsertArgs} args - Arguments to update or create a AnalysisDataset.
     * @example
     * // Update or create a AnalysisDataset
     * const analysisDataset = await prisma.analysisDataset.upsert({
     *   create: {
     *     // ... data to create a AnalysisDataset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisDataset we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisDatasetUpsertArgs>(args: SelectSubset<T, AnalysisDatasetUpsertArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisDatasets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetCountArgs} args - Arguments to filter AnalysisDatasets to count.
     * @example
     * // Count the number of AnalysisDatasets
     * const count = await prisma.analysisDataset.count({
     *   where: {
     *     // ... the filter for the AnalysisDatasets we want to count
     *   }
     * })
    **/
    count<T extends AnalysisDatasetCountArgs>(
      args?: Subset<T, AnalysisDatasetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisDatasetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisDataset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisDatasetAggregateArgs>(args: Subset<T, AnalysisDatasetAggregateArgs>): Prisma.PrismaPromise<GetAnalysisDatasetAggregateType<T>>

    /**
     * Group by AnalysisDataset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisDatasetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisDatasetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisDatasetGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisDatasetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisDatasetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisDatasetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisDataset model
   */
  readonly fields: AnalysisDatasetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisDataset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisDatasetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    analysisData<T extends AnalysisDataset$analysisDataArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisDataset$analysisDataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    anomalyEvents<T extends AnalysisDataset$anomalyEventsArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisDataset$anomalyEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisDataset model
   */
  interface AnalysisDatasetFieldRefs {
    readonly id: FieldRef<"AnalysisDataset", 'String'>
    readonly name: FieldRef<"AnalysisDataset", 'String'>
    readonly description: FieldRef<"AnalysisDataset", 'String'>
    readonly building: FieldRef<"AnalysisDataset", 'String'>
    readonly floor: FieldRef<"AnalysisDataset", 'String'>
    readonly room: FieldRef<"AnalysisDataset", 'String'>
    readonly startDate: FieldRef<"AnalysisDataset", 'DateTime'>
    readonly endDate: FieldRef<"AnalysisDataset", 'DateTime'>
    readonly occupantType: FieldRef<"AnalysisDataset", 'String'>
    readonly meterIdL1: FieldRef<"AnalysisDataset", 'String'>
    readonly meterIdL2: FieldRef<"AnalysisDataset", 'String'>
    readonly totalRecords: FieldRef<"AnalysisDataset", 'Int'>
    readonly positiveLabels: FieldRef<"AnalysisDataset", 'Int'>
    readonly createdAt: FieldRef<"AnalysisDataset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisDataset findUnique
   */
  export type AnalysisDatasetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisDataset to fetch.
     */
    where: AnalysisDatasetWhereUniqueInput
  }

  /**
   * AnalysisDataset findUniqueOrThrow
   */
  export type AnalysisDatasetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisDataset to fetch.
     */
    where: AnalysisDatasetWhereUniqueInput
  }

  /**
   * AnalysisDataset findFirst
   */
  export type AnalysisDatasetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisDataset to fetch.
     */
    where?: AnalysisDatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisDatasets to fetch.
     */
    orderBy?: AnalysisDatasetOrderByWithRelationInput | AnalysisDatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisDatasets.
     */
    cursor?: AnalysisDatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisDatasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisDatasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisDatasets.
     */
    distinct?: AnalysisDatasetScalarFieldEnum | AnalysisDatasetScalarFieldEnum[]
  }

  /**
   * AnalysisDataset findFirstOrThrow
   */
  export type AnalysisDatasetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisDataset to fetch.
     */
    where?: AnalysisDatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisDatasets to fetch.
     */
    orderBy?: AnalysisDatasetOrderByWithRelationInput | AnalysisDatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisDatasets.
     */
    cursor?: AnalysisDatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisDatasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisDatasets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisDatasets.
     */
    distinct?: AnalysisDatasetScalarFieldEnum | AnalysisDatasetScalarFieldEnum[]
  }

  /**
   * AnalysisDataset findMany
   */
  export type AnalysisDatasetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisDatasets to fetch.
     */
    where?: AnalysisDatasetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisDatasets to fetch.
     */
    orderBy?: AnalysisDatasetOrderByWithRelationInput | AnalysisDatasetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisDatasets.
     */
    cursor?: AnalysisDatasetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisDatasets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisDatasets.
     */
    skip?: number
    distinct?: AnalysisDatasetScalarFieldEnum | AnalysisDatasetScalarFieldEnum[]
  }

  /**
   * AnalysisDataset create
   */
  export type AnalysisDatasetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisDataset.
     */
    data: XOR<AnalysisDatasetCreateInput, AnalysisDatasetUncheckedCreateInput>
  }

  /**
   * AnalysisDataset createMany
   */
  export type AnalysisDatasetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisDatasets.
     */
    data: AnalysisDatasetCreateManyInput | AnalysisDatasetCreateManyInput[]
  }

  /**
   * AnalysisDataset createManyAndReturn
   */
  export type AnalysisDatasetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisDatasets.
     */
    data: AnalysisDatasetCreateManyInput | AnalysisDatasetCreateManyInput[]
  }

  /**
   * AnalysisDataset update
   */
  export type AnalysisDatasetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisDataset.
     */
    data: XOR<AnalysisDatasetUpdateInput, AnalysisDatasetUncheckedUpdateInput>
    /**
     * Choose, which AnalysisDataset to update.
     */
    where: AnalysisDatasetWhereUniqueInput
  }

  /**
   * AnalysisDataset updateMany
   */
  export type AnalysisDatasetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisDatasets.
     */
    data: XOR<AnalysisDatasetUpdateManyMutationInput, AnalysisDatasetUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisDatasets to update
     */
    where?: AnalysisDatasetWhereInput
    /**
     * Limit how many AnalysisDatasets to update.
     */
    limit?: number
  }

  /**
   * AnalysisDataset updateManyAndReturn
   */
  export type AnalysisDatasetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisDatasets.
     */
    data: XOR<AnalysisDatasetUpdateManyMutationInput, AnalysisDatasetUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisDatasets to update
     */
    where?: AnalysisDatasetWhereInput
    /**
     * Limit how many AnalysisDatasets to update.
     */
    limit?: number
  }

  /**
   * AnalysisDataset upsert
   */
  export type AnalysisDatasetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisDataset to update in case it exists.
     */
    where: AnalysisDatasetWhereUniqueInput
    /**
     * In case the AnalysisDataset found by the `where` argument doesn't exist, create a new AnalysisDataset with this data.
     */
    create: XOR<AnalysisDatasetCreateInput, AnalysisDatasetUncheckedCreateInput>
    /**
     * In case the AnalysisDataset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisDatasetUpdateInput, AnalysisDatasetUncheckedUpdateInput>
  }

  /**
   * AnalysisDataset delete
   */
  export type AnalysisDatasetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
    /**
     * Filter which AnalysisDataset to delete.
     */
    where: AnalysisDatasetWhereUniqueInput
  }

  /**
   * AnalysisDataset deleteMany
   */
  export type AnalysisDatasetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisDatasets to delete
     */
    where?: AnalysisDatasetWhereInput
    /**
     * Limit how many AnalysisDatasets to delete.
     */
    limit?: number
  }

  /**
   * AnalysisDataset.analysisData
   */
  export type AnalysisDataset$analysisDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    where?: AnalysisReadyDataWhereInput
    orderBy?: AnalysisReadyDataOrderByWithRelationInput | AnalysisReadyDataOrderByWithRelationInput[]
    cursor?: AnalysisReadyDataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisReadyDataScalarFieldEnum | AnalysisReadyDataScalarFieldEnum[]
  }

  /**
   * AnalysisDataset.anomalyEvents
   */
  export type AnalysisDataset$anomalyEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    where?: AnomalyEventWhereInput
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    cursor?: AnomalyEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnomalyEventScalarFieldEnum | AnomalyEventScalarFieldEnum[]
  }

  /**
   * AnalysisDataset without action
   */
  export type AnalysisDatasetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisDataset
     */
    select?: AnalysisDatasetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisDataset
     */
    omit?: AnalysisDatasetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisDatasetInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisReadyData
   */

  export type AggregateAnalysisReadyData = {
    _count: AnalysisReadyDataCountAggregateOutputType | null
    _avg: AnalysisReadyDataAvgAggregateOutputType | null
    _sum: AnalysisReadyDataSumAggregateOutputType | null
    _min: AnalysisReadyDataMinAggregateOutputType | null
    _max: AnalysisReadyDataMaxAggregateOutputType | null
  }

  export type AnalysisReadyDataAvgAggregateOutputType = {
    rawWattageL1: number | null
    rawWattageL2: number | null
    wattage110v: number | null
    wattage220v: number | null
    wattageTotal: number | null
  }

  export type AnalysisReadyDataSumAggregateOutputType = {
    rawWattageL1: number | null
    rawWattageL2: number | null
    wattage110v: number | null
    wattage220v: number | null
    wattageTotal: number | null
  }

  export type AnalysisReadyDataMinAggregateOutputType = {
    id: string | null
    datasetId: string | null
    timestamp: Date | null
    room: string | null
    rawWattageL1: number | null
    rawWattageL2: number | null
    wattage110v: number | null
    wattage220v: number | null
    wattageTotal: number | null
    isPositiveLabel: boolean | null
    sourceAnomalyEventId: string | null
  }

  export type AnalysisReadyDataMaxAggregateOutputType = {
    id: string | null
    datasetId: string | null
    timestamp: Date | null
    room: string | null
    rawWattageL1: number | null
    rawWattageL2: number | null
    wattage110v: number | null
    wattage220v: number | null
    wattageTotal: number | null
    isPositiveLabel: boolean | null
    sourceAnomalyEventId: string | null
  }

  export type AnalysisReadyDataCountAggregateOutputType = {
    id: number
    datasetId: number
    timestamp: number
    room: number
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel: number
    sourceAnomalyEventId: number
    _all: number
  }


  export type AnalysisReadyDataAvgAggregateInputType = {
    rawWattageL1?: true
    rawWattageL2?: true
    wattage110v?: true
    wattage220v?: true
    wattageTotal?: true
  }

  export type AnalysisReadyDataSumAggregateInputType = {
    rawWattageL1?: true
    rawWattageL2?: true
    wattage110v?: true
    wattage220v?: true
    wattageTotal?: true
  }

  export type AnalysisReadyDataMinAggregateInputType = {
    id?: true
    datasetId?: true
    timestamp?: true
    room?: true
    rawWattageL1?: true
    rawWattageL2?: true
    wattage110v?: true
    wattage220v?: true
    wattageTotal?: true
    isPositiveLabel?: true
    sourceAnomalyEventId?: true
  }

  export type AnalysisReadyDataMaxAggregateInputType = {
    id?: true
    datasetId?: true
    timestamp?: true
    room?: true
    rawWattageL1?: true
    rawWattageL2?: true
    wattage110v?: true
    wattage220v?: true
    wattageTotal?: true
    isPositiveLabel?: true
    sourceAnomalyEventId?: true
  }

  export type AnalysisReadyDataCountAggregateInputType = {
    id?: true
    datasetId?: true
    timestamp?: true
    room?: true
    rawWattageL1?: true
    rawWattageL2?: true
    wattage110v?: true
    wattage220v?: true
    wattageTotal?: true
    isPositiveLabel?: true
    sourceAnomalyEventId?: true
    _all?: true
  }

  export type AnalysisReadyDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisReadyData to aggregate.
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisReadyData to fetch.
     */
    orderBy?: AnalysisReadyDataOrderByWithRelationInput | AnalysisReadyDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisReadyDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisReadyData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisReadyData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisReadyData
    **/
    _count?: true | AnalysisReadyDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisReadyDataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisReadyDataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisReadyDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisReadyDataMaxAggregateInputType
  }

  export type GetAnalysisReadyDataAggregateType<T extends AnalysisReadyDataAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisReadyData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisReadyData[P]>
      : GetScalarType<T[P], AggregateAnalysisReadyData[P]>
  }




  export type AnalysisReadyDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisReadyDataWhereInput
    orderBy?: AnalysisReadyDataOrderByWithAggregationInput | AnalysisReadyDataOrderByWithAggregationInput[]
    by: AnalysisReadyDataScalarFieldEnum[] | AnalysisReadyDataScalarFieldEnum
    having?: AnalysisReadyDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisReadyDataCountAggregateInputType | true
    _avg?: AnalysisReadyDataAvgAggregateInputType
    _sum?: AnalysisReadyDataSumAggregateInputType
    _min?: AnalysisReadyDataMinAggregateInputType
    _max?: AnalysisReadyDataMaxAggregateInputType
  }

  export type AnalysisReadyDataGroupByOutputType = {
    id: string
    datasetId: string
    timestamp: Date
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel: boolean
    sourceAnomalyEventId: string | null
    _count: AnalysisReadyDataCountAggregateOutputType | null
    _avg: AnalysisReadyDataAvgAggregateOutputType | null
    _sum: AnalysisReadyDataSumAggregateOutputType | null
    _min: AnalysisReadyDataMinAggregateOutputType | null
    _max: AnalysisReadyDataMaxAggregateOutputType | null
  }

  type GetAnalysisReadyDataGroupByPayload<T extends AnalysisReadyDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisReadyDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisReadyDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisReadyDataGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisReadyDataGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisReadyDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    timestamp?: boolean
    room?: boolean
    rawWattageL1?: boolean
    rawWattageL2?: boolean
    wattage110v?: boolean
    wattage220v?: boolean
    wattageTotal?: boolean
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisReadyData"]>

  export type AnalysisReadyDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    timestamp?: boolean
    room?: boolean
    rawWattageL1?: boolean
    rawWattageL2?: boolean
    wattage110v?: boolean
    wattage220v?: boolean
    wattageTotal?: boolean
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisReadyData"]>

  export type AnalysisReadyDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    datasetId?: boolean
    timestamp?: boolean
    room?: boolean
    rawWattageL1?: boolean
    rawWattageL2?: boolean
    wattage110v?: boolean
    wattage220v?: boolean
    wattageTotal?: boolean
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisReadyData"]>

  export type AnalysisReadyDataSelectScalar = {
    id?: boolean
    datasetId?: boolean
    timestamp?: boolean
    room?: boolean
    rawWattageL1?: boolean
    rawWattageL2?: boolean
    wattage110v?: boolean
    wattage220v?: boolean
    wattageTotal?: boolean
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: boolean
  }

  export type AnalysisReadyDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "datasetId" | "timestamp" | "room" | "rawWattageL1" | "rawWattageL2" | "wattage110v" | "wattage220v" | "wattageTotal" | "isPositiveLabel" | "sourceAnomalyEventId", ExtArgs["result"]["analysisReadyData"]>
  export type AnalysisReadyDataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }
  export type AnalysisReadyDataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }
  export type AnalysisReadyDataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
  }

  export type $AnalysisReadyDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisReadyData"
    objects: {
      dataset: Prisma.$AnalysisDatasetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      datasetId: string
      timestamp: Date
      room: string
      rawWattageL1: number
      rawWattageL2: number
      wattage110v: number
      wattage220v: number
      wattageTotal: number
      isPositiveLabel: boolean
      sourceAnomalyEventId: string | null
    }, ExtArgs["result"]["analysisReadyData"]>
    composites: {}
  }

  type AnalysisReadyDataGetPayload<S extends boolean | null | undefined | AnalysisReadyDataDefaultArgs> = $Result.GetResult<Prisma.$AnalysisReadyDataPayload, S>

  type AnalysisReadyDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisReadyDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisReadyDataCountAggregateInputType | true
    }

  export interface AnalysisReadyDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisReadyData'], meta: { name: 'AnalysisReadyData' } }
    /**
     * Find zero or one AnalysisReadyData that matches the filter.
     * @param {AnalysisReadyDataFindUniqueArgs} args - Arguments to find a AnalysisReadyData
     * @example
     * // Get one AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisReadyDataFindUniqueArgs>(args: SelectSubset<T, AnalysisReadyDataFindUniqueArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisReadyData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisReadyDataFindUniqueOrThrowArgs} args - Arguments to find a AnalysisReadyData
     * @example
     * // Get one AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisReadyDataFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisReadyDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisReadyData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataFindFirstArgs} args - Arguments to find a AnalysisReadyData
     * @example
     * // Get one AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisReadyDataFindFirstArgs>(args?: SelectSubset<T, AnalysisReadyDataFindFirstArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisReadyData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataFindFirstOrThrowArgs} args - Arguments to find a AnalysisReadyData
     * @example
     * // Get one AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisReadyDataFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisReadyDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisReadyData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findMany()
     * 
     * // Get first 10 AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisReadyDataWithIdOnly = await prisma.analysisReadyData.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisReadyDataFindManyArgs>(args?: SelectSubset<T, AnalysisReadyDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisReadyData.
     * @param {AnalysisReadyDataCreateArgs} args - Arguments to create a AnalysisReadyData.
     * @example
     * // Create one AnalysisReadyData
     * const AnalysisReadyData = await prisma.analysisReadyData.create({
     *   data: {
     *     // ... data to create a AnalysisReadyData
     *   }
     * })
     * 
     */
    create<T extends AnalysisReadyDataCreateArgs>(args: SelectSubset<T, AnalysisReadyDataCreateArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisReadyData.
     * @param {AnalysisReadyDataCreateManyArgs} args - Arguments to create many AnalysisReadyData.
     * @example
     * // Create many AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisReadyDataCreateManyArgs>(args?: SelectSubset<T, AnalysisReadyDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisReadyData and returns the data saved in the database.
     * @param {AnalysisReadyDataCreateManyAndReturnArgs} args - Arguments to create many AnalysisReadyData.
     * @example
     * // Create many AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisReadyData and only return the `id`
     * const analysisReadyDataWithIdOnly = await prisma.analysisReadyData.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisReadyDataCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisReadyDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisReadyData.
     * @param {AnalysisReadyDataDeleteArgs} args - Arguments to delete one AnalysisReadyData.
     * @example
     * // Delete one AnalysisReadyData
     * const AnalysisReadyData = await prisma.analysisReadyData.delete({
     *   where: {
     *     // ... filter to delete one AnalysisReadyData
     *   }
     * })
     * 
     */
    delete<T extends AnalysisReadyDataDeleteArgs>(args: SelectSubset<T, AnalysisReadyDataDeleteArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisReadyData.
     * @param {AnalysisReadyDataUpdateArgs} args - Arguments to update one AnalysisReadyData.
     * @example
     * // Update one AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisReadyDataUpdateArgs>(args: SelectSubset<T, AnalysisReadyDataUpdateArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisReadyData.
     * @param {AnalysisReadyDataDeleteManyArgs} args - Arguments to filter AnalysisReadyData to delete.
     * @example
     * // Delete a few AnalysisReadyData
     * const { count } = await prisma.analysisReadyData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisReadyDataDeleteManyArgs>(args?: SelectSubset<T, AnalysisReadyDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisReadyData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisReadyDataUpdateManyArgs>(args: SelectSubset<T, AnalysisReadyDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisReadyData and returns the data updated in the database.
     * @param {AnalysisReadyDataUpdateManyAndReturnArgs} args - Arguments to update many AnalysisReadyData.
     * @example
     * // Update many AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisReadyData and only return the `id`
     * const analysisReadyDataWithIdOnly = await prisma.analysisReadyData.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisReadyDataUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisReadyDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisReadyData.
     * @param {AnalysisReadyDataUpsertArgs} args - Arguments to update or create a AnalysisReadyData.
     * @example
     * // Update or create a AnalysisReadyData
     * const analysisReadyData = await prisma.analysisReadyData.upsert({
     *   create: {
     *     // ... data to create a AnalysisReadyData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisReadyData we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisReadyDataUpsertArgs>(args: SelectSubset<T, AnalysisReadyDataUpsertArgs<ExtArgs>>): Prisma__AnalysisReadyDataClient<$Result.GetResult<Prisma.$AnalysisReadyDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisReadyData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataCountArgs} args - Arguments to filter AnalysisReadyData to count.
     * @example
     * // Count the number of AnalysisReadyData
     * const count = await prisma.analysisReadyData.count({
     *   where: {
     *     // ... the filter for the AnalysisReadyData we want to count
     *   }
     * })
    **/
    count<T extends AnalysisReadyDataCountArgs>(
      args?: Subset<T, AnalysisReadyDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisReadyDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisReadyData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisReadyDataAggregateArgs>(args: Subset<T, AnalysisReadyDataAggregateArgs>): Prisma.PrismaPromise<GetAnalysisReadyDataAggregateType<T>>

    /**
     * Group by AnalysisReadyData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisReadyDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisReadyDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisReadyDataGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisReadyDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisReadyDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisReadyDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisReadyData model
   */
  readonly fields: AnalysisReadyDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisReadyData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisReadyDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends AnalysisDatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisDatasetDefaultArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisReadyData model
   */
  interface AnalysisReadyDataFieldRefs {
    readonly id: FieldRef<"AnalysisReadyData", 'String'>
    readonly datasetId: FieldRef<"AnalysisReadyData", 'String'>
    readonly timestamp: FieldRef<"AnalysisReadyData", 'DateTime'>
    readonly room: FieldRef<"AnalysisReadyData", 'String'>
    readonly rawWattageL1: FieldRef<"AnalysisReadyData", 'Float'>
    readonly rawWattageL2: FieldRef<"AnalysisReadyData", 'Float'>
    readonly wattage110v: FieldRef<"AnalysisReadyData", 'Float'>
    readonly wattage220v: FieldRef<"AnalysisReadyData", 'Float'>
    readonly wattageTotal: FieldRef<"AnalysisReadyData", 'Float'>
    readonly isPositiveLabel: FieldRef<"AnalysisReadyData", 'Boolean'>
    readonly sourceAnomalyEventId: FieldRef<"AnalysisReadyData", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisReadyData findUnique
   */
  export type AnalysisReadyDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisReadyData to fetch.
     */
    where: AnalysisReadyDataWhereUniqueInput
  }

  /**
   * AnalysisReadyData findUniqueOrThrow
   */
  export type AnalysisReadyDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisReadyData to fetch.
     */
    where: AnalysisReadyDataWhereUniqueInput
  }

  /**
   * AnalysisReadyData findFirst
   */
  export type AnalysisReadyDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisReadyData to fetch.
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisReadyData to fetch.
     */
    orderBy?: AnalysisReadyDataOrderByWithRelationInput | AnalysisReadyDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisReadyData.
     */
    cursor?: AnalysisReadyDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisReadyData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisReadyData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisReadyData.
     */
    distinct?: AnalysisReadyDataScalarFieldEnum | AnalysisReadyDataScalarFieldEnum[]
  }

  /**
   * AnalysisReadyData findFirstOrThrow
   */
  export type AnalysisReadyDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisReadyData to fetch.
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisReadyData to fetch.
     */
    orderBy?: AnalysisReadyDataOrderByWithRelationInput | AnalysisReadyDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisReadyData.
     */
    cursor?: AnalysisReadyDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisReadyData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisReadyData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisReadyData.
     */
    distinct?: AnalysisReadyDataScalarFieldEnum | AnalysisReadyDataScalarFieldEnum[]
  }

  /**
   * AnalysisReadyData findMany
   */
  export type AnalysisReadyDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisReadyData to fetch.
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisReadyData to fetch.
     */
    orderBy?: AnalysisReadyDataOrderByWithRelationInput | AnalysisReadyDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisReadyData.
     */
    cursor?: AnalysisReadyDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisReadyData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisReadyData.
     */
    skip?: number
    distinct?: AnalysisReadyDataScalarFieldEnum | AnalysisReadyDataScalarFieldEnum[]
  }

  /**
   * AnalysisReadyData create
   */
  export type AnalysisReadyDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisReadyData.
     */
    data: XOR<AnalysisReadyDataCreateInput, AnalysisReadyDataUncheckedCreateInput>
  }

  /**
   * AnalysisReadyData createMany
   */
  export type AnalysisReadyDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisReadyData.
     */
    data: AnalysisReadyDataCreateManyInput | AnalysisReadyDataCreateManyInput[]
  }

  /**
   * AnalysisReadyData createManyAndReturn
   */
  export type AnalysisReadyDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisReadyData.
     */
    data: AnalysisReadyDataCreateManyInput | AnalysisReadyDataCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisReadyData update
   */
  export type AnalysisReadyDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisReadyData.
     */
    data: XOR<AnalysisReadyDataUpdateInput, AnalysisReadyDataUncheckedUpdateInput>
    /**
     * Choose, which AnalysisReadyData to update.
     */
    where: AnalysisReadyDataWhereUniqueInput
  }

  /**
   * AnalysisReadyData updateMany
   */
  export type AnalysisReadyDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisReadyData.
     */
    data: XOR<AnalysisReadyDataUpdateManyMutationInput, AnalysisReadyDataUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisReadyData to update
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * Limit how many AnalysisReadyData to update.
     */
    limit?: number
  }

  /**
   * AnalysisReadyData updateManyAndReturn
   */
  export type AnalysisReadyDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisReadyData.
     */
    data: XOR<AnalysisReadyDataUpdateManyMutationInput, AnalysisReadyDataUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisReadyData to update
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * Limit how many AnalysisReadyData to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisReadyData upsert
   */
  export type AnalysisReadyDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisReadyData to update in case it exists.
     */
    where: AnalysisReadyDataWhereUniqueInput
    /**
     * In case the AnalysisReadyData found by the `where` argument doesn't exist, create a new AnalysisReadyData with this data.
     */
    create: XOR<AnalysisReadyDataCreateInput, AnalysisReadyDataUncheckedCreateInput>
    /**
     * In case the AnalysisReadyData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisReadyDataUpdateInput, AnalysisReadyDataUncheckedUpdateInput>
  }

  /**
   * AnalysisReadyData delete
   */
  export type AnalysisReadyDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
    /**
     * Filter which AnalysisReadyData to delete.
     */
    where: AnalysisReadyDataWhereUniqueInput
  }

  /**
   * AnalysisReadyData deleteMany
   */
  export type AnalysisReadyDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisReadyData to delete
     */
    where?: AnalysisReadyDataWhereInput
    /**
     * Limit how many AnalysisReadyData to delete.
     */
    limit?: number
  }

  /**
   * AnalysisReadyData without action
   */
  export type AnalysisReadyDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisReadyData
     */
    select?: AnalysisReadyDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisReadyData
     */
    omit?: AnalysisReadyDataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisReadyDataInclude<ExtArgs> | null
  }


  /**
   * Model ExperimentRun
   */

  export type AggregateExperimentRun = {
    _count: ExperimentRunCountAggregateOutputType | null
    _avg: ExperimentRunAvgAggregateOutputType | null
    _sum: ExperimentRunSumAggregateOutputType | null
    _min: ExperimentRunMinAggregateOutputType | null
    _max: ExperimentRunMaxAggregateOutputType | null
  }

  export type ExperimentRunAvgAggregateOutputType = {
    candidateCount: number | null
    positiveLabelCount: number | null
    negativeLabelCount: number | null
  }

  export type ExperimentRunSumAggregateOutputType = {
    candidateCount: number | null
    positiveLabelCount: number | null
    negativeLabelCount: number | null
  }

  export type ExperimentRunMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    filteringParameters: string | null
    status: string | null
    candidateCount: number | null
    positiveLabelCount: number | null
    negativeLabelCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    candidateStats: string | null
  }

  export type ExperimentRunMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    filteringParameters: string | null
    status: string | null
    candidateCount: number | null
    positiveLabelCount: number | null
    negativeLabelCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    candidateStats: string | null
  }

  export type ExperimentRunCountAggregateOutputType = {
    id: number
    name: number
    description: number
    filteringParameters: number
    status: number
    candidateCount: number
    positiveLabelCount: number
    negativeLabelCount: number
    createdAt: number
    updatedAt: number
    candidateStats: number
    _all: number
  }


  export type ExperimentRunAvgAggregateInputType = {
    candidateCount?: true
    positiveLabelCount?: true
    negativeLabelCount?: true
  }

  export type ExperimentRunSumAggregateInputType = {
    candidateCount?: true
    positiveLabelCount?: true
    negativeLabelCount?: true
  }

  export type ExperimentRunMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    filteringParameters?: true
    status?: true
    candidateCount?: true
    positiveLabelCount?: true
    negativeLabelCount?: true
    createdAt?: true
    updatedAt?: true
    candidateStats?: true
  }

  export type ExperimentRunMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    filteringParameters?: true
    status?: true
    candidateCount?: true
    positiveLabelCount?: true
    negativeLabelCount?: true
    createdAt?: true
    updatedAt?: true
    candidateStats?: true
  }

  export type ExperimentRunCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    filteringParameters?: true
    status?: true
    candidateCount?: true
    positiveLabelCount?: true
    negativeLabelCount?: true
    createdAt?: true
    updatedAt?: true
    candidateStats?: true
    _all?: true
  }

  export type ExperimentRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExperimentRun to aggregate.
     */
    where?: ExperimentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExperimentRuns to fetch.
     */
    orderBy?: ExperimentRunOrderByWithRelationInput | ExperimentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExperimentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExperimentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExperimentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExperimentRuns
    **/
    _count?: true | ExperimentRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExperimentRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExperimentRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExperimentRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExperimentRunMaxAggregateInputType
  }

  export type GetExperimentRunAggregateType<T extends ExperimentRunAggregateArgs> = {
        [P in keyof T & keyof AggregateExperimentRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExperimentRun[P]>
      : GetScalarType<T[P], AggregateExperimentRun[P]>
  }




  export type ExperimentRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExperimentRunWhereInput
    orderBy?: ExperimentRunOrderByWithAggregationInput | ExperimentRunOrderByWithAggregationInput[]
    by: ExperimentRunScalarFieldEnum[] | ExperimentRunScalarFieldEnum
    having?: ExperimentRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExperimentRunCountAggregateInputType | true
    _avg?: ExperimentRunAvgAggregateInputType
    _sum?: ExperimentRunSumAggregateInputType
    _min?: ExperimentRunMinAggregateInputType
    _max?: ExperimentRunMaxAggregateInputType
  }

  export type ExperimentRunGroupByOutputType = {
    id: string
    name: string
    description: string | null
    filteringParameters: string | null
    status: string
    candidateCount: number | null
    positiveLabelCount: number | null
    negativeLabelCount: number | null
    createdAt: Date
    updatedAt: Date
    candidateStats: string | null
    _count: ExperimentRunCountAggregateOutputType | null
    _avg: ExperimentRunAvgAggregateOutputType | null
    _sum: ExperimentRunSumAggregateOutputType | null
    _min: ExperimentRunMinAggregateOutputType | null
    _max: ExperimentRunMaxAggregateOutputType | null
  }

  type GetExperimentRunGroupByPayload<T extends ExperimentRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExperimentRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExperimentRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExperimentRunGroupByOutputType[P]>
            : GetScalarType<T[P], ExperimentRunGroupByOutputType[P]>
        }
      >
    >


  export type ExperimentRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    filteringParameters?: boolean
    status?: boolean
    candidateCount?: boolean
    positiveLabelCount?: boolean
    negativeLabelCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    candidateStats?: boolean
    anomalyEvents?: boolean | ExperimentRun$anomalyEventsArgs<ExtArgs>
    trainedModels?: boolean | ExperimentRun$trainedModelsArgs<ExtArgs>
    _count?: boolean | ExperimentRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["experimentRun"]>

  export type ExperimentRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    filteringParameters?: boolean
    status?: boolean
    candidateCount?: boolean
    positiveLabelCount?: boolean
    negativeLabelCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    candidateStats?: boolean
  }, ExtArgs["result"]["experimentRun"]>

  export type ExperimentRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    filteringParameters?: boolean
    status?: boolean
    candidateCount?: boolean
    positiveLabelCount?: boolean
    negativeLabelCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    candidateStats?: boolean
  }, ExtArgs["result"]["experimentRun"]>

  export type ExperimentRunSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    filteringParameters?: boolean
    status?: boolean
    candidateCount?: boolean
    positiveLabelCount?: boolean
    negativeLabelCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    candidateStats?: boolean
  }

  export type ExperimentRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "filteringParameters" | "status" | "candidateCount" | "positiveLabelCount" | "negativeLabelCount" | "createdAt" | "updatedAt" | "candidateStats", ExtArgs["result"]["experimentRun"]>
  export type ExperimentRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anomalyEvents?: boolean | ExperimentRun$anomalyEventsArgs<ExtArgs>
    trainedModels?: boolean | ExperimentRun$trainedModelsArgs<ExtArgs>
    _count?: boolean | ExperimentRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExperimentRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ExperimentRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ExperimentRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExperimentRun"
    objects: {
      anomalyEvents: Prisma.$AnomalyEventPayload<ExtArgs>[]
      trainedModels: Prisma.$TrainedModelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      filteringParameters: string | null
      status: string
      candidateCount: number | null
      positiveLabelCount: number | null
      negativeLabelCount: number | null
      createdAt: Date
      updatedAt: Date
      candidateStats: string | null
    }, ExtArgs["result"]["experimentRun"]>
    composites: {}
  }

  type ExperimentRunGetPayload<S extends boolean | null | undefined | ExperimentRunDefaultArgs> = $Result.GetResult<Prisma.$ExperimentRunPayload, S>

  type ExperimentRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExperimentRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExperimentRunCountAggregateInputType | true
    }

  export interface ExperimentRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExperimentRun'], meta: { name: 'ExperimentRun' } }
    /**
     * Find zero or one ExperimentRun that matches the filter.
     * @param {ExperimentRunFindUniqueArgs} args - Arguments to find a ExperimentRun
     * @example
     * // Get one ExperimentRun
     * const experimentRun = await prisma.experimentRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExperimentRunFindUniqueArgs>(args: SelectSubset<T, ExperimentRunFindUniqueArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExperimentRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExperimentRunFindUniqueOrThrowArgs} args - Arguments to find a ExperimentRun
     * @example
     * // Get one ExperimentRun
     * const experimentRun = await prisma.experimentRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExperimentRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ExperimentRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExperimentRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunFindFirstArgs} args - Arguments to find a ExperimentRun
     * @example
     * // Get one ExperimentRun
     * const experimentRun = await prisma.experimentRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExperimentRunFindFirstArgs>(args?: SelectSubset<T, ExperimentRunFindFirstArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExperimentRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunFindFirstOrThrowArgs} args - Arguments to find a ExperimentRun
     * @example
     * // Get one ExperimentRun
     * const experimentRun = await prisma.experimentRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExperimentRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ExperimentRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExperimentRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExperimentRuns
     * const experimentRuns = await prisma.experimentRun.findMany()
     * 
     * // Get first 10 ExperimentRuns
     * const experimentRuns = await prisma.experimentRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const experimentRunWithIdOnly = await prisma.experimentRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExperimentRunFindManyArgs>(args?: SelectSubset<T, ExperimentRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExperimentRun.
     * @param {ExperimentRunCreateArgs} args - Arguments to create a ExperimentRun.
     * @example
     * // Create one ExperimentRun
     * const ExperimentRun = await prisma.experimentRun.create({
     *   data: {
     *     // ... data to create a ExperimentRun
     *   }
     * })
     * 
     */
    create<T extends ExperimentRunCreateArgs>(args: SelectSubset<T, ExperimentRunCreateArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExperimentRuns.
     * @param {ExperimentRunCreateManyArgs} args - Arguments to create many ExperimentRuns.
     * @example
     * // Create many ExperimentRuns
     * const experimentRun = await prisma.experimentRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExperimentRunCreateManyArgs>(args?: SelectSubset<T, ExperimentRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExperimentRuns and returns the data saved in the database.
     * @param {ExperimentRunCreateManyAndReturnArgs} args - Arguments to create many ExperimentRuns.
     * @example
     * // Create many ExperimentRuns
     * const experimentRun = await prisma.experimentRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExperimentRuns and only return the `id`
     * const experimentRunWithIdOnly = await prisma.experimentRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExperimentRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ExperimentRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExperimentRun.
     * @param {ExperimentRunDeleteArgs} args - Arguments to delete one ExperimentRun.
     * @example
     * // Delete one ExperimentRun
     * const ExperimentRun = await prisma.experimentRun.delete({
     *   where: {
     *     // ... filter to delete one ExperimentRun
     *   }
     * })
     * 
     */
    delete<T extends ExperimentRunDeleteArgs>(args: SelectSubset<T, ExperimentRunDeleteArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExperimentRun.
     * @param {ExperimentRunUpdateArgs} args - Arguments to update one ExperimentRun.
     * @example
     * // Update one ExperimentRun
     * const experimentRun = await prisma.experimentRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExperimentRunUpdateArgs>(args: SelectSubset<T, ExperimentRunUpdateArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExperimentRuns.
     * @param {ExperimentRunDeleteManyArgs} args - Arguments to filter ExperimentRuns to delete.
     * @example
     * // Delete a few ExperimentRuns
     * const { count } = await prisma.experimentRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExperimentRunDeleteManyArgs>(args?: SelectSubset<T, ExperimentRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExperimentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExperimentRuns
     * const experimentRun = await prisma.experimentRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExperimentRunUpdateManyArgs>(args: SelectSubset<T, ExperimentRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExperimentRuns and returns the data updated in the database.
     * @param {ExperimentRunUpdateManyAndReturnArgs} args - Arguments to update many ExperimentRuns.
     * @example
     * // Update many ExperimentRuns
     * const experimentRun = await prisma.experimentRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExperimentRuns and only return the `id`
     * const experimentRunWithIdOnly = await prisma.experimentRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExperimentRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ExperimentRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExperimentRun.
     * @param {ExperimentRunUpsertArgs} args - Arguments to update or create a ExperimentRun.
     * @example
     * // Update or create a ExperimentRun
     * const experimentRun = await prisma.experimentRun.upsert({
     *   create: {
     *     // ... data to create a ExperimentRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExperimentRun we want to update
     *   }
     * })
     */
    upsert<T extends ExperimentRunUpsertArgs>(args: SelectSubset<T, ExperimentRunUpsertArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExperimentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunCountArgs} args - Arguments to filter ExperimentRuns to count.
     * @example
     * // Count the number of ExperimentRuns
     * const count = await prisma.experimentRun.count({
     *   where: {
     *     // ... the filter for the ExperimentRuns we want to count
     *   }
     * })
    **/
    count<T extends ExperimentRunCountArgs>(
      args?: Subset<T, ExperimentRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExperimentRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExperimentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExperimentRunAggregateArgs>(args: Subset<T, ExperimentRunAggregateArgs>): Prisma.PrismaPromise<GetExperimentRunAggregateType<T>>

    /**
     * Group by ExperimentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperimentRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExperimentRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExperimentRunGroupByArgs['orderBy'] }
        : { orderBy?: ExperimentRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExperimentRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExperimentRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExperimentRun model
   */
  readonly fields: ExperimentRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExperimentRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExperimentRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    anomalyEvents<T extends ExperimentRun$anomalyEventsArgs<ExtArgs> = {}>(args?: Subset<T, ExperimentRun$anomalyEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trainedModels<T extends ExperimentRun$trainedModelsArgs<ExtArgs> = {}>(args?: Subset<T, ExperimentRun$trainedModelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExperimentRun model
   */
  interface ExperimentRunFieldRefs {
    readonly id: FieldRef<"ExperimentRun", 'String'>
    readonly name: FieldRef<"ExperimentRun", 'String'>
    readonly description: FieldRef<"ExperimentRun", 'String'>
    readonly filteringParameters: FieldRef<"ExperimentRun", 'String'>
    readonly status: FieldRef<"ExperimentRun", 'String'>
    readonly candidateCount: FieldRef<"ExperimentRun", 'Int'>
    readonly positiveLabelCount: FieldRef<"ExperimentRun", 'Int'>
    readonly negativeLabelCount: FieldRef<"ExperimentRun", 'Int'>
    readonly createdAt: FieldRef<"ExperimentRun", 'DateTime'>
    readonly updatedAt: FieldRef<"ExperimentRun", 'DateTime'>
    readonly candidateStats: FieldRef<"ExperimentRun", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ExperimentRun findUnique
   */
  export type ExperimentRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter, which ExperimentRun to fetch.
     */
    where: ExperimentRunWhereUniqueInput
  }

  /**
   * ExperimentRun findUniqueOrThrow
   */
  export type ExperimentRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter, which ExperimentRun to fetch.
     */
    where: ExperimentRunWhereUniqueInput
  }

  /**
   * ExperimentRun findFirst
   */
  export type ExperimentRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter, which ExperimentRun to fetch.
     */
    where?: ExperimentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExperimentRuns to fetch.
     */
    orderBy?: ExperimentRunOrderByWithRelationInput | ExperimentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExperimentRuns.
     */
    cursor?: ExperimentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExperimentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExperimentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExperimentRuns.
     */
    distinct?: ExperimentRunScalarFieldEnum | ExperimentRunScalarFieldEnum[]
  }

  /**
   * ExperimentRun findFirstOrThrow
   */
  export type ExperimentRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter, which ExperimentRun to fetch.
     */
    where?: ExperimentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExperimentRuns to fetch.
     */
    orderBy?: ExperimentRunOrderByWithRelationInput | ExperimentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExperimentRuns.
     */
    cursor?: ExperimentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExperimentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExperimentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExperimentRuns.
     */
    distinct?: ExperimentRunScalarFieldEnum | ExperimentRunScalarFieldEnum[]
  }

  /**
   * ExperimentRun findMany
   */
  export type ExperimentRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter, which ExperimentRuns to fetch.
     */
    where?: ExperimentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExperimentRuns to fetch.
     */
    orderBy?: ExperimentRunOrderByWithRelationInput | ExperimentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExperimentRuns.
     */
    cursor?: ExperimentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExperimentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExperimentRuns.
     */
    skip?: number
    distinct?: ExperimentRunScalarFieldEnum | ExperimentRunScalarFieldEnum[]
  }

  /**
   * ExperimentRun create
   */
  export type ExperimentRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ExperimentRun.
     */
    data: XOR<ExperimentRunCreateInput, ExperimentRunUncheckedCreateInput>
  }

  /**
   * ExperimentRun createMany
   */
  export type ExperimentRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExperimentRuns.
     */
    data: ExperimentRunCreateManyInput | ExperimentRunCreateManyInput[]
  }

  /**
   * ExperimentRun createManyAndReturn
   */
  export type ExperimentRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * The data used to create many ExperimentRuns.
     */
    data: ExperimentRunCreateManyInput | ExperimentRunCreateManyInput[]
  }

  /**
   * ExperimentRun update
   */
  export type ExperimentRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ExperimentRun.
     */
    data: XOR<ExperimentRunUpdateInput, ExperimentRunUncheckedUpdateInput>
    /**
     * Choose, which ExperimentRun to update.
     */
    where: ExperimentRunWhereUniqueInput
  }

  /**
   * ExperimentRun updateMany
   */
  export type ExperimentRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExperimentRuns.
     */
    data: XOR<ExperimentRunUpdateManyMutationInput, ExperimentRunUncheckedUpdateManyInput>
    /**
     * Filter which ExperimentRuns to update
     */
    where?: ExperimentRunWhereInput
    /**
     * Limit how many ExperimentRuns to update.
     */
    limit?: number
  }

  /**
   * ExperimentRun updateManyAndReturn
   */
  export type ExperimentRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * The data used to update ExperimentRuns.
     */
    data: XOR<ExperimentRunUpdateManyMutationInput, ExperimentRunUncheckedUpdateManyInput>
    /**
     * Filter which ExperimentRuns to update
     */
    where?: ExperimentRunWhereInput
    /**
     * Limit how many ExperimentRuns to update.
     */
    limit?: number
  }

  /**
   * ExperimentRun upsert
   */
  export type ExperimentRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ExperimentRun to update in case it exists.
     */
    where: ExperimentRunWhereUniqueInput
    /**
     * In case the ExperimentRun found by the `where` argument doesn't exist, create a new ExperimentRun with this data.
     */
    create: XOR<ExperimentRunCreateInput, ExperimentRunUncheckedCreateInput>
    /**
     * In case the ExperimentRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExperimentRunUpdateInput, ExperimentRunUncheckedUpdateInput>
  }

  /**
   * ExperimentRun delete
   */
  export type ExperimentRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    /**
     * Filter which ExperimentRun to delete.
     */
    where: ExperimentRunWhereUniqueInput
  }

  /**
   * ExperimentRun deleteMany
   */
  export type ExperimentRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExperimentRuns to delete
     */
    where?: ExperimentRunWhereInput
    /**
     * Limit how many ExperimentRuns to delete.
     */
    limit?: number
  }

  /**
   * ExperimentRun.anomalyEvents
   */
  export type ExperimentRun$anomalyEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    where?: AnomalyEventWhereInput
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    cursor?: AnomalyEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnomalyEventScalarFieldEnum | AnomalyEventScalarFieldEnum[]
  }

  /**
   * ExperimentRun.trainedModels
   */
  export type ExperimentRun$trainedModelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    where?: TrainedModelWhereInput
    orderBy?: TrainedModelOrderByWithRelationInput | TrainedModelOrderByWithRelationInput[]
    cursor?: TrainedModelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrainedModelScalarFieldEnum | TrainedModelScalarFieldEnum[]
  }

  /**
   * ExperimentRun without action
   */
  export type ExperimentRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
  }


  /**
   * Model AnomalyEvent
   */

  export type AggregateAnomalyEvent = {
    _count: AnomalyEventCountAggregateOutputType | null
    _avg: AnomalyEventAvgAggregateOutputType | null
    _sum: AnomalyEventSumAggregateOutputType | null
    _min: AnomalyEventMinAggregateOutputType | null
    _max: AnomalyEventMaxAggregateOutputType | null
  }

  export type AnomalyEventAvgAggregateOutputType = {
    score: number | null
  }

  export type AnomalyEventSumAggregateOutputType = {
    score: number | null
  }

  export type AnomalyEventMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    datasetId: string | null
    line: string | null
    eventTimestamp: Date | null
    detectionRule: string | null
    score: number | null
    dataWindow: string | null
    status: string | null
    reviewerId: string | null
    reviewTimestamp: Date | null
    justificationNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    experimentRunId: string | null
  }

  export type AnomalyEventMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    name: string | null
    datasetId: string | null
    line: string | null
    eventTimestamp: Date | null
    detectionRule: string | null
    score: number | null
    dataWindow: string | null
    status: string | null
    reviewerId: string | null
    reviewTimestamp: Date | null
    justificationNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    experimentRunId: string | null
  }

  export type AnomalyEventCountAggregateOutputType = {
    id: number
    eventId: number
    name: number
    datasetId: number
    line: number
    eventTimestamp: number
    detectionRule: number
    score: number
    dataWindow: number
    status: number
    reviewerId: number
    reviewTimestamp: number
    justificationNotes: number
    createdAt: number
    updatedAt: number
    experimentRunId: number
    _all: number
  }


  export type AnomalyEventAvgAggregateInputType = {
    score?: true
  }

  export type AnomalyEventSumAggregateInputType = {
    score?: true
  }

  export type AnomalyEventMinAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    datasetId?: true
    line?: true
    eventTimestamp?: true
    detectionRule?: true
    score?: true
    dataWindow?: true
    status?: true
    reviewerId?: true
    reviewTimestamp?: true
    justificationNotes?: true
    createdAt?: true
    updatedAt?: true
    experimentRunId?: true
  }

  export type AnomalyEventMaxAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    datasetId?: true
    line?: true
    eventTimestamp?: true
    detectionRule?: true
    score?: true
    dataWindow?: true
    status?: true
    reviewerId?: true
    reviewTimestamp?: true
    justificationNotes?: true
    createdAt?: true
    updatedAt?: true
    experimentRunId?: true
  }

  export type AnomalyEventCountAggregateInputType = {
    id?: true
    eventId?: true
    name?: true
    datasetId?: true
    line?: true
    eventTimestamp?: true
    detectionRule?: true
    score?: true
    dataWindow?: true
    status?: true
    reviewerId?: true
    reviewTimestamp?: true
    justificationNotes?: true
    createdAt?: true
    updatedAt?: true
    experimentRunId?: true
    _all?: true
  }

  export type AnomalyEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnomalyEvent to aggregate.
     */
    where?: AnomalyEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyEvents to fetch.
     */
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnomalyEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnomalyEvents
    **/
    _count?: true | AnomalyEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnomalyEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnomalyEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnomalyEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnomalyEventMaxAggregateInputType
  }

  export type GetAnomalyEventAggregateType<T extends AnomalyEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAnomalyEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnomalyEvent[P]>
      : GetScalarType<T[P], AggregateAnomalyEvent[P]>
  }




  export type AnomalyEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnomalyEventWhereInput
    orderBy?: AnomalyEventOrderByWithAggregationInput | AnomalyEventOrderByWithAggregationInput[]
    by: AnomalyEventScalarFieldEnum[] | AnomalyEventScalarFieldEnum
    having?: AnomalyEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnomalyEventCountAggregateInputType | true
    _avg?: AnomalyEventAvgAggregateInputType
    _sum?: AnomalyEventSumAggregateInputType
    _min?: AnomalyEventMinAggregateInputType
    _max?: AnomalyEventMaxAggregateInputType
  }

  export type AnomalyEventGroupByOutputType = {
    id: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date
    detectionRule: string
    score: number
    dataWindow: string
    status: string
    reviewerId: string | null
    reviewTimestamp: Date | null
    justificationNotes: string | null
    createdAt: Date
    updatedAt: Date
    experimentRunId: string | null
    _count: AnomalyEventCountAggregateOutputType | null
    _avg: AnomalyEventAvgAggregateOutputType | null
    _sum: AnomalyEventSumAggregateOutputType | null
    _min: AnomalyEventMinAggregateOutputType | null
    _max: AnomalyEventMaxAggregateOutputType | null
  }

  type GetAnomalyEventGroupByPayload<T extends AnomalyEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnomalyEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnomalyEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnomalyEventGroupByOutputType[P]>
            : GetScalarType<T[P], AnomalyEventGroupByOutputType[P]>
        }
      >
    >


  export type AnomalyEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    datasetId?: boolean
    line?: boolean
    eventTimestamp?: boolean
    detectionRule?: boolean
    score?: boolean
    dataWindow?: boolean
    status?: boolean
    reviewerId?: boolean
    reviewTimestamp?: boolean
    justificationNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    experimentRunId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
    eventLabelLinks?: boolean | AnomalyEvent$eventLabelLinksArgs<ExtArgs>
    _count?: boolean | AnomalyEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anomalyEvent"]>

  export type AnomalyEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    datasetId?: boolean
    line?: boolean
    eventTimestamp?: boolean
    detectionRule?: boolean
    score?: boolean
    dataWindow?: boolean
    status?: boolean
    reviewerId?: boolean
    reviewTimestamp?: boolean
    justificationNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    experimentRunId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
  }, ExtArgs["result"]["anomalyEvent"]>

  export type AnomalyEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    name?: boolean
    datasetId?: boolean
    line?: boolean
    eventTimestamp?: boolean
    detectionRule?: boolean
    score?: boolean
    dataWindow?: boolean
    status?: boolean
    reviewerId?: boolean
    reviewTimestamp?: boolean
    justificationNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    experimentRunId?: boolean
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
  }, ExtArgs["result"]["anomalyEvent"]>

  export type AnomalyEventSelectScalar = {
    id?: boolean
    eventId?: boolean
    name?: boolean
    datasetId?: boolean
    line?: boolean
    eventTimestamp?: boolean
    detectionRule?: boolean
    score?: boolean
    dataWindow?: boolean
    status?: boolean
    reviewerId?: boolean
    reviewTimestamp?: boolean
    justificationNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    experimentRunId?: boolean
  }

  export type AnomalyEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "name" | "datasetId" | "line" | "eventTimestamp" | "detectionRule" | "score" | "dataWindow" | "status" | "reviewerId" | "reviewTimestamp" | "justificationNotes" | "createdAt" | "updatedAt" | "experimentRunId", ExtArgs["result"]["anomalyEvent"]>
  export type AnomalyEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
    eventLabelLinks?: boolean | AnomalyEvent$eventLabelLinksArgs<ExtArgs>
    _count?: boolean | AnomalyEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnomalyEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
  }
  export type AnomalyEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataset?: boolean | AnalysisDatasetDefaultArgs<ExtArgs>
    experimentRun?: boolean | AnomalyEvent$experimentRunArgs<ExtArgs>
  }

  export type $AnomalyEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnomalyEvent"
    objects: {
      dataset: Prisma.$AnalysisDatasetPayload<ExtArgs>
      experimentRun: Prisma.$ExperimentRunPayload<ExtArgs> | null
      eventLabelLinks: Prisma.$EventLabelLinkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      name: string
      datasetId: string
      line: string
      eventTimestamp: Date
      detectionRule: string
      score: number
      dataWindow: string
      status: string
      reviewerId: string | null
      reviewTimestamp: Date | null
      justificationNotes: string | null
      createdAt: Date
      updatedAt: Date
      experimentRunId: string | null
    }, ExtArgs["result"]["anomalyEvent"]>
    composites: {}
  }

  type AnomalyEventGetPayload<S extends boolean | null | undefined | AnomalyEventDefaultArgs> = $Result.GetResult<Prisma.$AnomalyEventPayload, S>

  type AnomalyEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnomalyEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnomalyEventCountAggregateInputType | true
    }

  export interface AnomalyEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnomalyEvent'], meta: { name: 'AnomalyEvent' } }
    /**
     * Find zero or one AnomalyEvent that matches the filter.
     * @param {AnomalyEventFindUniqueArgs} args - Arguments to find a AnomalyEvent
     * @example
     * // Get one AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnomalyEventFindUniqueArgs>(args: SelectSubset<T, AnomalyEventFindUniqueArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnomalyEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnomalyEventFindUniqueOrThrowArgs} args - Arguments to find a AnomalyEvent
     * @example
     * // Get one AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnomalyEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AnomalyEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnomalyEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventFindFirstArgs} args - Arguments to find a AnomalyEvent
     * @example
     * // Get one AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnomalyEventFindFirstArgs>(args?: SelectSubset<T, AnomalyEventFindFirstArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnomalyEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventFindFirstOrThrowArgs} args - Arguments to find a AnomalyEvent
     * @example
     * // Get one AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnomalyEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AnomalyEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnomalyEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnomalyEvents
     * const anomalyEvents = await prisma.anomalyEvent.findMany()
     * 
     * // Get first 10 AnomalyEvents
     * const anomalyEvents = await prisma.anomalyEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anomalyEventWithIdOnly = await prisma.anomalyEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnomalyEventFindManyArgs>(args?: SelectSubset<T, AnomalyEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnomalyEvent.
     * @param {AnomalyEventCreateArgs} args - Arguments to create a AnomalyEvent.
     * @example
     * // Create one AnomalyEvent
     * const AnomalyEvent = await prisma.anomalyEvent.create({
     *   data: {
     *     // ... data to create a AnomalyEvent
     *   }
     * })
     * 
     */
    create<T extends AnomalyEventCreateArgs>(args: SelectSubset<T, AnomalyEventCreateArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnomalyEvents.
     * @param {AnomalyEventCreateManyArgs} args - Arguments to create many AnomalyEvents.
     * @example
     * // Create many AnomalyEvents
     * const anomalyEvent = await prisma.anomalyEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnomalyEventCreateManyArgs>(args?: SelectSubset<T, AnomalyEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnomalyEvents and returns the data saved in the database.
     * @param {AnomalyEventCreateManyAndReturnArgs} args - Arguments to create many AnomalyEvents.
     * @example
     * // Create many AnomalyEvents
     * const anomalyEvent = await prisma.anomalyEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnomalyEvents and only return the `id`
     * const anomalyEventWithIdOnly = await prisma.anomalyEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnomalyEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AnomalyEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnomalyEvent.
     * @param {AnomalyEventDeleteArgs} args - Arguments to delete one AnomalyEvent.
     * @example
     * // Delete one AnomalyEvent
     * const AnomalyEvent = await prisma.anomalyEvent.delete({
     *   where: {
     *     // ... filter to delete one AnomalyEvent
     *   }
     * })
     * 
     */
    delete<T extends AnomalyEventDeleteArgs>(args: SelectSubset<T, AnomalyEventDeleteArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnomalyEvent.
     * @param {AnomalyEventUpdateArgs} args - Arguments to update one AnomalyEvent.
     * @example
     * // Update one AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnomalyEventUpdateArgs>(args: SelectSubset<T, AnomalyEventUpdateArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnomalyEvents.
     * @param {AnomalyEventDeleteManyArgs} args - Arguments to filter AnomalyEvents to delete.
     * @example
     * // Delete a few AnomalyEvents
     * const { count } = await prisma.anomalyEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnomalyEventDeleteManyArgs>(args?: SelectSubset<T, AnomalyEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnomalyEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnomalyEvents
     * const anomalyEvent = await prisma.anomalyEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnomalyEventUpdateManyArgs>(args: SelectSubset<T, AnomalyEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnomalyEvents and returns the data updated in the database.
     * @param {AnomalyEventUpdateManyAndReturnArgs} args - Arguments to update many AnomalyEvents.
     * @example
     * // Update many AnomalyEvents
     * const anomalyEvent = await prisma.anomalyEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnomalyEvents and only return the `id`
     * const anomalyEventWithIdOnly = await prisma.anomalyEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnomalyEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AnomalyEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnomalyEvent.
     * @param {AnomalyEventUpsertArgs} args - Arguments to update or create a AnomalyEvent.
     * @example
     * // Update or create a AnomalyEvent
     * const anomalyEvent = await prisma.anomalyEvent.upsert({
     *   create: {
     *     // ... data to create a AnomalyEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnomalyEvent we want to update
     *   }
     * })
     */
    upsert<T extends AnomalyEventUpsertArgs>(args: SelectSubset<T, AnomalyEventUpsertArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnomalyEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventCountArgs} args - Arguments to filter AnomalyEvents to count.
     * @example
     * // Count the number of AnomalyEvents
     * const count = await prisma.anomalyEvent.count({
     *   where: {
     *     // ... the filter for the AnomalyEvents we want to count
     *   }
     * })
    **/
    count<T extends AnomalyEventCountArgs>(
      args?: Subset<T, AnomalyEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnomalyEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnomalyEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnomalyEventAggregateArgs>(args: Subset<T, AnomalyEventAggregateArgs>): Prisma.PrismaPromise<GetAnomalyEventAggregateType<T>>

    /**
     * Group by AnomalyEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnomalyEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnomalyEventGroupByArgs['orderBy'] }
        : { orderBy?: AnomalyEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnomalyEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnomalyEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnomalyEvent model
   */
  readonly fields: AnomalyEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnomalyEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnomalyEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataset<T extends AnalysisDatasetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisDatasetDefaultArgs<ExtArgs>>): Prisma__AnalysisDatasetClient<$Result.GetResult<Prisma.$AnalysisDatasetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    experimentRun<T extends AnomalyEvent$experimentRunArgs<ExtArgs> = {}>(args?: Subset<T, AnomalyEvent$experimentRunArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    eventLabelLinks<T extends AnomalyEvent$eventLabelLinksArgs<ExtArgs> = {}>(args?: Subset<T, AnomalyEvent$eventLabelLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnomalyEvent model
   */
  interface AnomalyEventFieldRefs {
    readonly id: FieldRef<"AnomalyEvent", 'String'>
    readonly eventId: FieldRef<"AnomalyEvent", 'String'>
    readonly name: FieldRef<"AnomalyEvent", 'String'>
    readonly datasetId: FieldRef<"AnomalyEvent", 'String'>
    readonly line: FieldRef<"AnomalyEvent", 'String'>
    readonly eventTimestamp: FieldRef<"AnomalyEvent", 'DateTime'>
    readonly detectionRule: FieldRef<"AnomalyEvent", 'String'>
    readonly score: FieldRef<"AnomalyEvent", 'Float'>
    readonly dataWindow: FieldRef<"AnomalyEvent", 'String'>
    readonly status: FieldRef<"AnomalyEvent", 'String'>
    readonly reviewerId: FieldRef<"AnomalyEvent", 'String'>
    readonly reviewTimestamp: FieldRef<"AnomalyEvent", 'DateTime'>
    readonly justificationNotes: FieldRef<"AnomalyEvent", 'String'>
    readonly createdAt: FieldRef<"AnomalyEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"AnomalyEvent", 'DateTime'>
    readonly experimentRunId: FieldRef<"AnomalyEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AnomalyEvent findUnique
   */
  export type AnomalyEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyEvent to fetch.
     */
    where: AnomalyEventWhereUniqueInput
  }

  /**
   * AnomalyEvent findUniqueOrThrow
   */
  export type AnomalyEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyEvent to fetch.
     */
    where: AnomalyEventWhereUniqueInput
  }

  /**
   * AnomalyEvent findFirst
   */
  export type AnomalyEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyEvent to fetch.
     */
    where?: AnomalyEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyEvents to fetch.
     */
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnomalyEvents.
     */
    cursor?: AnomalyEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnomalyEvents.
     */
    distinct?: AnomalyEventScalarFieldEnum | AnomalyEventScalarFieldEnum[]
  }

  /**
   * AnomalyEvent findFirstOrThrow
   */
  export type AnomalyEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyEvent to fetch.
     */
    where?: AnomalyEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyEvents to fetch.
     */
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnomalyEvents.
     */
    cursor?: AnomalyEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnomalyEvents.
     */
    distinct?: AnomalyEventScalarFieldEnum | AnomalyEventScalarFieldEnum[]
  }

  /**
   * AnomalyEvent findMany
   */
  export type AnomalyEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyEvents to fetch.
     */
    where?: AnomalyEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyEvents to fetch.
     */
    orderBy?: AnomalyEventOrderByWithRelationInput | AnomalyEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnomalyEvents.
     */
    cursor?: AnomalyEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyEvents.
     */
    skip?: number
    distinct?: AnomalyEventScalarFieldEnum | AnomalyEventScalarFieldEnum[]
  }

  /**
   * AnomalyEvent create
   */
  export type AnomalyEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AnomalyEvent.
     */
    data: XOR<AnomalyEventCreateInput, AnomalyEventUncheckedCreateInput>
  }

  /**
   * AnomalyEvent createMany
   */
  export type AnomalyEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnomalyEvents.
     */
    data: AnomalyEventCreateManyInput | AnomalyEventCreateManyInput[]
  }

  /**
   * AnomalyEvent createManyAndReturn
   */
  export type AnomalyEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * The data used to create many AnomalyEvents.
     */
    data: AnomalyEventCreateManyInput | AnomalyEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnomalyEvent update
   */
  export type AnomalyEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AnomalyEvent.
     */
    data: XOR<AnomalyEventUpdateInput, AnomalyEventUncheckedUpdateInput>
    /**
     * Choose, which AnomalyEvent to update.
     */
    where: AnomalyEventWhereUniqueInput
  }

  /**
   * AnomalyEvent updateMany
   */
  export type AnomalyEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnomalyEvents.
     */
    data: XOR<AnomalyEventUpdateManyMutationInput, AnomalyEventUncheckedUpdateManyInput>
    /**
     * Filter which AnomalyEvents to update
     */
    where?: AnomalyEventWhereInput
    /**
     * Limit how many AnomalyEvents to update.
     */
    limit?: number
  }

  /**
   * AnomalyEvent updateManyAndReturn
   */
  export type AnomalyEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * The data used to update AnomalyEvents.
     */
    data: XOR<AnomalyEventUpdateManyMutationInput, AnomalyEventUncheckedUpdateManyInput>
    /**
     * Filter which AnomalyEvents to update
     */
    where?: AnomalyEventWhereInput
    /**
     * Limit how many AnomalyEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnomalyEvent upsert
   */
  export type AnomalyEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AnomalyEvent to update in case it exists.
     */
    where: AnomalyEventWhereUniqueInput
    /**
     * In case the AnomalyEvent found by the `where` argument doesn't exist, create a new AnomalyEvent with this data.
     */
    create: XOR<AnomalyEventCreateInput, AnomalyEventUncheckedCreateInput>
    /**
     * In case the AnomalyEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnomalyEventUpdateInput, AnomalyEventUncheckedUpdateInput>
  }

  /**
   * AnomalyEvent delete
   */
  export type AnomalyEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
    /**
     * Filter which AnomalyEvent to delete.
     */
    where: AnomalyEventWhereUniqueInput
  }

  /**
   * AnomalyEvent deleteMany
   */
  export type AnomalyEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnomalyEvents to delete
     */
    where?: AnomalyEventWhereInput
    /**
     * Limit how many AnomalyEvents to delete.
     */
    limit?: number
  }

  /**
   * AnomalyEvent.experimentRun
   */
  export type AnomalyEvent$experimentRunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentRun
     */
    select?: ExperimentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExperimentRun
     */
    omit?: ExperimentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperimentRunInclude<ExtArgs> | null
    where?: ExperimentRunWhereInput
  }

  /**
   * AnomalyEvent.eventLabelLinks
   */
  export type AnomalyEvent$eventLabelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    where?: EventLabelLinkWhereInput
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    cursor?: EventLabelLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventLabelLinkScalarFieldEnum | EventLabelLinkScalarFieldEnum[]
  }

  /**
   * AnomalyEvent without action
   */
  export type AnomalyEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyEvent
     */
    select?: AnomalyEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyEvent
     */
    omit?: AnomalyEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyEventInclude<ExtArgs> | null
  }


  /**
   * Model AnomalyLabel
   */

  export type AggregateAnomalyLabel = {
    _count: AnomalyLabelCountAggregateOutputType | null
    _min: AnomalyLabelMinAggregateOutputType | null
    _max: AnomalyLabelMaxAggregateOutputType | null
  }

  export type AnomalyLabelMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnomalyLabelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AnomalyLabelCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AnomalyLabelMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnomalyLabelMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AnomalyLabelCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AnomalyLabelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnomalyLabel to aggregate.
     */
    where?: AnomalyLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyLabels to fetch.
     */
    orderBy?: AnomalyLabelOrderByWithRelationInput | AnomalyLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnomalyLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnomalyLabels
    **/
    _count?: true | AnomalyLabelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnomalyLabelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnomalyLabelMaxAggregateInputType
  }

  export type GetAnomalyLabelAggregateType<T extends AnomalyLabelAggregateArgs> = {
        [P in keyof T & keyof AggregateAnomalyLabel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnomalyLabel[P]>
      : GetScalarType<T[P], AggregateAnomalyLabel[P]>
  }




  export type AnomalyLabelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnomalyLabelWhereInput
    orderBy?: AnomalyLabelOrderByWithAggregationInput | AnomalyLabelOrderByWithAggregationInput[]
    by: AnomalyLabelScalarFieldEnum[] | AnomalyLabelScalarFieldEnum
    having?: AnomalyLabelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnomalyLabelCountAggregateInputType | true
    _min?: AnomalyLabelMinAggregateInputType
    _max?: AnomalyLabelMaxAggregateInputType
  }

  export type AnomalyLabelGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: AnomalyLabelCountAggregateOutputType | null
    _min: AnomalyLabelMinAggregateOutputType | null
    _max: AnomalyLabelMaxAggregateOutputType | null
  }

  type GetAnomalyLabelGroupByPayload<T extends AnomalyLabelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnomalyLabelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnomalyLabelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnomalyLabelGroupByOutputType[P]>
            : GetScalarType<T[P], AnomalyLabelGroupByOutputType[P]>
        }
      >
    >


  export type AnomalyLabelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    eventLabelLinks?: boolean | AnomalyLabel$eventLabelLinksArgs<ExtArgs>
    _count?: boolean | AnomalyLabelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["anomalyLabel"]>

  export type AnomalyLabelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["anomalyLabel"]>

  export type AnomalyLabelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["anomalyLabel"]>

  export type AnomalyLabelSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AnomalyLabelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["anomalyLabel"]>
  export type AnomalyLabelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    eventLabelLinks?: boolean | AnomalyLabel$eventLabelLinksArgs<ExtArgs>
    _count?: boolean | AnomalyLabelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnomalyLabelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AnomalyLabelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AnomalyLabelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnomalyLabel"
    objects: {
      eventLabelLinks: Prisma.$EventLabelLinkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["anomalyLabel"]>
    composites: {}
  }

  type AnomalyLabelGetPayload<S extends boolean | null | undefined | AnomalyLabelDefaultArgs> = $Result.GetResult<Prisma.$AnomalyLabelPayload, S>

  type AnomalyLabelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnomalyLabelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnomalyLabelCountAggregateInputType | true
    }

  export interface AnomalyLabelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnomalyLabel'], meta: { name: 'AnomalyLabel' } }
    /**
     * Find zero or one AnomalyLabel that matches the filter.
     * @param {AnomalyLabelFindUniqueArgs} args - Arguments to find a AnomalyLabel
     * @example
     * // Get one AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnomalyLabelFindUniqueArgs>(args: SelectSubset<T, AnomalyLabelFindUniqueArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnomalyLabel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnomalyLabelFindUniqueOrThrowArgs} args - Arguments to find a AnomalyLabel
     * @example
     * // Get one AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnomalyLabelFindUniqueOrThrowArgs>(args: SelectSubset<T, AnomalyLabelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnomalyLabel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelFindFirstArgs} args - Arguments to find a AnomalyLabel
     * @example
     * // Get one AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnomalyLabelFindFirstArgs>(args?: SelectSubset<T, AnomalyLabelFindFirstArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnomalyLabel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelFindFirstOrThrowArgs} args - Arguments to find a AnomalyLabel
     * @example
     * // Get one AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnomalyLabelFindFirstOrThrowArgs>(args?: SelectSubset<T, AnomalyLabelFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnomalyLabels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnomalyLabels
     * const anomalyLabels = await prisma.anomalyLabel.findMany()
     * 
     * // Get first 10 AnomalyLabels
     * const anomalyLabels = await prisma.anomalyLabel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anomalyLabelWithIdOnly = await prisma.anomalyLabel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnomalyLabelFindManyArgs>(args?: SelectSubset<T, AnomalyLabelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnomalyLabel.
     * @param {AnomalyLabelCreateArgs} args - Arguments to create a AnomalyLabel.
     * @example
     * // Create one AnomalyLabel
     * const AnomalyLabel = await prisma.anomalyLabel.create({
     *   data: {
     *     // ... data to create a AnomalyLabel
     *   }
     * })
     * 
     */
    create<T extends AnomalyLabelCreateArgs>(args: SelectSubset<T, AnomalyLabelCreateArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnomalyLabels.
     * @param {AnomalyLabelCreateManyArgs} args - Arguments to create many AnomalyLabels.
     * @example
     * // Create many AnomalyLabels
     * const anomalyLabel = await prisma.anomalyLabel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnomalyLabelCreateManyArgs>(args?: SelectSubset<T, AnomalyLabelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnomalyLabels and returns the data saved in the database.
     * @param {AnomalyLabelCreateManyAndReturnArgs} args - Arguments to create many AnomalyLabels.
     * @example
     * // Create many AnomalyLabels
     * const anomalyLabel = await prisma.anomalyLabel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnomalyLabels and only return the `id`
     * const anomalyLabelWithIdOnly = await prisma.anomalyLabel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnomalyLabelCreateManyAndReturnArgs>(args?: SelectSubset<T, AnomalyLabelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnomalyLabel.
     * @param {AnomalyLabelDeleteArgs} args - Arguments to delete one AnomalyLabel.
     * @example
     * // Delete one AnomalyLabel
     * const AnomalyLabel = await prisma.anomalyLabel.delete({
     *   where: {
     *     // ... filter to delete one AnomalyLabel
     *   }
     * })
     * 
     */
    delete<T extends AnomalyLabelDeleteArgs>(args: SelectSubset<T, AnomalyLabelDeleteArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnomalyLabel.
     * @param {AnomalyLabelUpdateArgs} args - Arguments to update one AnomalyLabel.
     * @example
     * // Update one AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnomalyLabelUpdateArgs>(args: SelectSubset<T, AnomalyLabelUpdateArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnomalyLabels.
     * @param {AnomalyLabelDeleteManyArgs} args - Arguments to filter AnomalyLabels to delete.
     * @example
     * // Delete a few AnomalyLabels
     * const { count } = await prisma.anomalyLabel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnomalyLabelDeleteManyArgs>(args?: SelectSubset<T, AnomalyLabelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnomalyLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnomalyLabels
     * const anomalyLabel = await prisma.anomalyLabel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnomalyLabelUpdateManyArgs>(args: SelectSubset<T, AnomalyLabelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnomalyLabels and returns the data updated in the database.
     * @param {AnomalyLabelUpdateManyAndReturnArgs} args - Arguments to update many AnomalyLabels.
     * @example
     * // Update many AnomalyLabels
     * const anomalyLabel = await prisma.anomalyLabel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnomalyLabels and only return the `id`
     * const anomalyLabelWithIdOnly = await prisma.anomalyLabel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnomalyLabelUpdateManyAndReturnArgs>(args: SelectSubset<T, AnomalyLabelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnomalyLabel.
     * @param {AnomalyLabelUpsertArgs} args - Arguments to update or create a AnomalyLabel.
     * @example
     * // Update or create a AnomalyLabel
     * const anomalyLabel = await prisma.anomalyLabel.upsert({
     *   create: {
     *     // ... data to create a AnomalyLabel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnomalyLabel we want to update
     *   }
     * })
     */
    upsert<T extends AnomalyLabelUpsertArgs>(args: SelectSubset<T, AnomalyLabelUpsertArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnomalyLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelCountArgs} args - Arguments to filter AnomalyLabels to count.
     * @example
     * // Count the number of AnomalyLabels
     * const count = await prisma.anomalyLabel.count({
     *   where: {
     *     // ... the filter for the AnomalyLabels we want to count
     *   }
     * })
    **/
    count<T extends AnomalyLabelCountArgs>(
      args?: Subset<T, AnomalyLabelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnomalyLabelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnomalyLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnomalyLabelAggregateArgs>(args: Subset<T, AnomalyLabelAggregateArgs>): Prisma.PrismaPromise<GetAnomalyLabelAggregateType<T>>

    /**
     * Group by AnomalyLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnomalyLabelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnomalyLabelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnomalyLabelGroupByArgs['orderBy'] }
        : { orderBy?: AnomalyLabelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnomalyLabelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnomalyLabelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnomalyLabel model
   */
  readonly fields: AnomalyLabelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnomalyLabel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnomalyLabelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    eventLabelLinks<T extends AnomalyLabel$eventLabelLinksArgs<ExtArgs> = {}>(args?: Subset<T, AnomalyLabel$eventLabelLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnomalyLabel model
   */
  interface AnomalyLabelFieldRefs {
    readonly id: FieldRef<"AnomalyLabel", 'String'>
    readonly name: FieldRef<"AnomalyLabel", 'String'>
    readonly description: FieldRef<"AnomalyLabel", 'String'>
    readonly createdAt: FieldRef<"AnomalyLabel", 'DateTime'>
    readonly updatedAt: FieldRef<"AnomalyLabel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnomalyLabel findUnique
   */
  export type AnomalyLabelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyLabel to fetch.
     */
    where: AnomalyLabelWhereUniqueInput
  }

  /**
   * AnomalyLabel findUniqueOrThrow
   */
  export type AnomalyLabelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyLabel to fetch.
     */
    where: AnomalyLabelWhereUniqueInput
  }

  /**
   * AnomalyLabel findFirst
   */
  export type AnomalyLabelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyLabel to fetch.
     */
    where?: AnomalyLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyLabels to fetch.
     */
    orderBy?: AnomalyLabelOrderByWithRelationInput | AnomalyLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnomalyLabels.
     */
    cursor?: AnomalyLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnomalyLabels.
     */
    distinct?: AnomalyLabelScalarFieldEnum | AnomalyLabelScalarFieldEnum[]
  }

  /**
   * AnomalyLabel findFirstOrThrow
   */
  export type AnomalyLabelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyLabel to fetch.
     */
    where?: AnomalyLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyLabels to fetch.
     */
    orderBy?: AnomalyLabelOrderByWithRelationInput | AnomalyLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnomalyLabels.
     */
    cursor?: AnomalyLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnomalyLabels.
     */
    distinct?: AnomalyLabelScalarFieldEnum | AnomalyLabelScalarFieldEnum[]
  }

  /**
   * AnomalyLabel findMany
   */
  export type AnomalyLabelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter, which AnomalyLabels to fetch.
     */
    where?: AnomalyLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnomalyLabels to fetch.
     */
    orderBy?: AnomalyLabelOrderByWithRelationInput | AnomalyLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnomalyLabels.
     */
    cursor?: AnomalyLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnomalyLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnomalyLabels.
     */
    skip?: number
    distinct?: AnomalyLabelScalarFieldEnum | AnomalyLabelScalarFieldEnum[]
  }

  /**
   * AnomalyLabel create
   */
  export type AnomalyLabelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * The data needed to create a AnomalyLabel.
     */
    data: XOR<AnomalyLabelCreateInput, AnomalyLabelUncheckedCreateInput>
  }

  /**
   * AnomalyLabel createMany
   */
  export type AnomalyLabelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnomalyLabels.
     */
    data: AnomalyLabelCreateManyInput | AnomalyLabelCreateManyInput[]
  }

  /**
   * AnomalyLabel createManyAndReturn
   */
  export type AnomalyLabelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * The data used to create many AnomalyLabels.
     */
    data: AnomalyLabelCreateManyInput | AnomalyLabelCreateManyInput[]
  }

  /**
   * AnomalyLabel update
   */
  export type AnomalyLabelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * The data needed to update a AnomalyLabel.
     */
    data: XOR<AnomalyLabelUpdateInput, AnomalyLabelUncheckedUpdateInput>
    /**
     * Choose, which AnomalyLabel to update.
     */
    where: AnomalyLabelWhereUniqueInput
  }

  /**
   * AnomalyLabel updateMany
   */
  export type AnomalyLabelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnomalyLabels.
     */
    data: XOR<AnomalyLabelUpdateManyMutationInput, AnomalyLabelUncheckedUpdateManyInput>
    /**
     * Filter which AnomalyLabels to update
     */
    where?: AnomalyLabelWhereInput
    /**
     * Limit how many AnomalyLabels to update.
     */
    limit?: number
  }

  /**
   * AnomalyLabel updateManyAndReturn
   */
  export type AnomalyLabelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * The data used to update AnomalyLabels.
     */
    data: XOR<AnomalyLabelUpdateManyMutationInput, AnomalyLabelUncheckedUpdateManyInput>
    /**
     * Filter which AnomalyLabels to update
     */
    where?: AnomalyLabelWhereInput
    /**
     * Limit how many AnomalyLabels to update.
     */
    limit?: number
  }

  /**
   * AnomalyLabel upsert
   */
  export type AnomalyLabelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * The filter to search for the AnomalyLabel to update in case it exists.
     */
    where: AnomalyLabelWhereUniqueInput
    /**
     * In case the AnomalyLabel found by the `where` argument doesn't exist, create a new AnomalyLabel with this data.
     */
    create: XOR<AnomalyLabelCreateInput, AnomalyLabelUncheckedCreateInput>
    /**
     * In case the AnomalyLabel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnomalyLabelUpdateInput, AnomalyLabelUncheckedUpdateInput>
  }

  /**
   * AnomalyLabel delete
   */
  export type AnomalyLabelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
    /**
     * Filter which AnomalyLabel to delete.
     */
    where: AnomalyLabelWhereUniqueInput
  }

  /**
   * AnomalyLabel deleteMany
   */
  export type AnomalyLabelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnomalyLabels to delete
     */
    where?: AnomalyLabelWhereInput
    /**
     * Limit how many AnomalyLabels to delete.
     */
    limit?: number
  }

  /**
   * AnomalyLabel.eventLabelLinks
   */
  export type AnomalyLabel$eventLabelLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    where?: EventLabelLinkWhereInput
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    cursor?: EventLabelLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventLabelLinkScalarFieldEnum | EventLabelLinkScalarFieldEnum[]
  }

  /**
   * AnomalyLabel without action
   */
  export type AnomalyLabelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnomalyLabel
     */
    select?: AnomalyLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnomalyLabel
     */
    omit?: AnomalyLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnomalyLabelInclude<ExtArgs> | null
  }


  /**
   * Model EventLabelLink
   */

  export type AggregateEventLabelLink = {
    _count: EventLabelLinkCountAggregateOutputType | null
    _min: EventLabelLinkMinAggregateOutputType | null
    _max: EventLabelLinkMaxAggregateOutputType | null
  }

  export type EventLabelLinkMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    labelId: string | null
    createdAt: Date | null
  }

  export type EventLabelLinkMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    labelId: string | null
    createdAt: Date | null
  }

  export type EventLabelLinkCountAggregateOutputType = {
    id: number
    eventId: number
    labelId: number
    createdAt: number
    _all: number
  }


  export type EventLabelLinkMinAggregateInputType = {
    id?: true
    eventId?: true
    labelId?: true
    createdAt?: true
  }

  export type EventLabelLinkMaxAggregateInputType = {
    id?: true
    eventId?: true
    labelId?: true
    createdAt?: true
  }

  export type EventLabelLinkCountAggregateInputType = {
    id?: true
    eventId?: true
    labelId?: true
    createdAt?: true
    _all?: true
  }

  export type EventLabelLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLabelLink to aggregate.
     */
    where?: EventLabelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLabelLinks to fetch.
     */
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventLabelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLabelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLabelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventLabelLinks
    **/
    _count?: true | EventLabelLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventLabelLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventLabelLinkMaxAggregateInputType
  }

  export type GetEventLabelLinkAggregateType<T extends EventLabelLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateEventLabelLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventLabelLink[P]>
      : GetScalarType<T[P], AggregateEventLabelLink[P]>
  }




  export type EventLabelLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventLabelLinkWhereInput
    orderBy?: EventLabelLinkOrderByWithAggregationInput | EventLabelLinkOrderByWithAggregationInput[]
    by: EventLabelLinkScalarFieldEnum[] | EventLabelLinkScalarFieldEnum
    having?: EventLabelLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventLabelLinkCountAggregateInputType | true
    _min?: EventLabelLinkMinAggregateInputType
    _max?: EventLabelLinkMaxAggregateInputType
  }

  export type EventLabelLinkGroupByOutputType = {
    id: string
    eventId: string
    labelId: string
    createdAt: Date
    _count: EventLabelLinkCountAggregateOutputType | null
    _min: EventLabelLinkMinAggregateOutputType | null
    _max: EventLabelLinkMaxAggregateOutputType | null
  }

  type GetEventLabelLinkGroupByPayload<T extends EventLabelLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventLabelLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventLabelLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventLabelLinkGroupByOutputType[P]>
            : GetScalarType<T[P], EventLabelLinkGroupByOutputType[P]>
        }
      >
    >


  export type EventLabelLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    labelId?: boolean
    createdAt?: boolean
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventLabelLink"]>

  export type EventLabelLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    labelId?: boolean
    createdAt?: boolean
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventLabelLink"]>

  export type EventLabelLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    labelId?: boolean
    createdAt?: boolean
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventLabelLink"]>

  export type EventLabelLinkSelectScalar = {
    id?: boolean
    eventId?: boolean
    labelId?: boolean
    createdAt?: boolean
  }

  export type EventLabelLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "labelId" | "createdAt", ExtArgs["result"]["eventLabelLink"]>
  export type EventLabelLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }
  export type EventLabelLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }
  export type EventLabelLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    anomalyEvent?: boolean | AnomalyEventDefaultArgs<ExtArgs>
    anomalyLabel?: boolean | AnomalyLabelDefaultArgs<ExtArgs>
  }

  export type $EventLabelLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventLabelLink"
    objects: {
      anomalyEvent: Prisma.$AnomalyEventPayload<ExtArgs>
      anomalyLabel: Prisma.$AnomalyLabelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      labelId: string
      createdAt: Date
    }, ExtArgs["result"]["eventLabelLink"]>
    composites: {}
  }

  type EventLabelLinkGetPayload<S extends boolean | null | undefined | EventLabelLinkDefaultArgs> = $Result.GetResult<Prisma.$EventLabelLinkPayload, S>

  type EventLabelLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventLabelLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventLabelLinkCountAggregateInputType | true
    }

  export interface EventLabelLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventLabelLink'], meta: { name: 'EventLabelLink' } }
    /**
     * Find zero or one EventLabelLink that matches the filter.
     * @param {EventLabelLinkFindUniqueArgs} args - Arguments to find a EventLabelLink
     * @example
     * // Get one EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventLabelLinkFindUniqueArgs>(args: SelectSubset<T, EventLabelLinkFindUniqueArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventLabelLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventLabelLinkFindUniqueOrThrowArgs} args - Arguments to find a EventLabelLink
     * @example
     * // Get one EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventLabelLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, EventLabelLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventLabelLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkFindFirstArgs} args - Arguments to find a EventLabelLink
     * @example
     * // Get one EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventLabelLinkFindFirstArgs>(args?: SelectSubset<T, EventLabelLinkFindFirstArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventLabelLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkFindFirstOrThrowArgs} args - Arguments to find a EventLabelLink
     * @example
     * // Get one EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventLabelLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, EventLabelLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventLabelLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventLabelLinks
     * const eventLabelLinks = await prisma.eventLabelLink.findMany()
     * 
     * // Get first 10 EventLabelLinks
     * const eventLabelLinks = await prisma.eventLabelLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventLabelLinkWithIdOnly = await prisma.eventLabelLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventLabelLinkFindManyArgs>(args?: SelectSubset<T, EventLabelLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventLabelLink.
     * @param {EventLabelLinkCreateArgs} args - Arguments to create a EventLabelLink.
     * @example
     * // Create one EventLabelLink
     * const EventLabelLink = await prisma.eventLabelLink.create({
     *   data: {
     *     // ... data to create a EventLabelLink
     *   }
     * })
     * 
     */
    create<T extends EventLabelLinkCreateArgs>(args: SelectSubset<T, EventLabelLinkCreateArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventLabelLinks.
     * @param {EventLabelLinkCreateManyArgs} args - Arguments to create many EventLabelLinks.
     * @example
     * // Create many EventLabelLinks
     * const eventLabelLink = await prisma.eventLabelLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventLabelLinkCreateManyArgs>(args?: SelectSubset<T, EventLabelLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventLabelLinks and returns the data saved in the database.
     * @param {EventLabelLinkCreateManyAndReturnArgs} args - Arguments to create many EventLabelLinks.
     * @example
     * // Create many EventLabelLinks
     * const eventLabelLink = await prisma.eventLabelLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventLabelLinks and only return the `id`
     * const eventLabelLinkWithIdOnly = await prisma.eventLabelLink.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventLabelLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, EventLabelLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventLabelLink.
     * @param {EventLabelLinkDeleteArgs} args - Arguments to delete one EventLabelLink.
     * @example
     * // Delete one EventLabelLink
     * const EventLabelLink = await prisma.eventLabelLink.delete({
     *   where: {
     *     // ... filter to delete one EventLabelLink
     *   }
     * })
     * 
     */
    delete<T extends EventLabelLinkDeleteArgs>(args: SelectSubset<T, EventLabelLinkDeleteArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventLabelLink.
     * @param {EventLabelLinkUpdateArgs} args - Arguments to update one EventLabelLink.
     * @example
     * // Update one EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventLabelLinkUpdateArgs>(args: SelectSubset<T, EventLabelLinkUpdateArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventLabelLinks.
     * @param {EventLabelLinkDeleteManyArgs} args - Arguments to filter EventLabelLinks to delete.
     * @example
     * // Delete a few EventLabelLinks
     * const { count } = await prisma.eventLabelLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventLabelLinkDeleteManyArgs>(args?: SelectSubset<T, EventLabelLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLabelLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventLabelLinks
     * const eventLabelLink = await prisma.eventLabelLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventLabelLinkUpdateManyArgs>(args: SelectSubset<T, EventLabelLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLabelLinks and returns the data updated in the database.
     * @param {EventLabelLinkUpdateManyAndReturnArgs} args - Arguments to update many EventLabelLinks.
     * @example
     * // Update many EventLabelLinks
     * const eventLabelLink = await prisma.eventLabelLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventLabelLinks and only return the `id`
     * const eventLabelLinkWithIdOnly = await prisma.eventLabelLink.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventLabelLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, EventLabelLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventLabelLink.
     * @param {EventLabelLinkUpsertArgs} args - Arguments to update or create a EventLabelLink.
     * @example
     * // Update or create a EventLabelLink
     * const eventLabelLink = await prisma.eventLabelLink.upsert({
     *   create: {
     *     // ... data to create a EventLabelLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventLabelLink we want to update
     *   }
     * })
     */
    upsert<T extends EventLabelLinkUpsertArgs>(args: SelectSubset<T, EventLabelLinkUpsertArgs<ExtArgs>>): Prisma__EventLabelLinkClient<$Result.GetResult<Prisma.$EventLabelLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventLabelLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkCountArgs} args - Arguments to filter EventLabelLinks to count.
     * @example
     * // Count the number of EventLabelLinks
     * const count = await prisma.eventLabelLink.count({
     *   where: {
     *     // ... the filter for the EventLabelLinks we want to count
     *   }
     * })
    **/
    count<T extends EventLabelLinkCountArgs>(
      args?: Subset<T, EventLabelLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventLabelLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventLabelLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventLabelLinkAggregateArgs>(args: Subset<T, EventLabelLinkAggregateArgs>): Prisma.PrismaPromise<GetEventLabelLinkAggregateType<T>>

    /**
     * Group by EventLabelLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLabelLinkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventLabelLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventLabelLinkGroupByArgs['orderBy'] }
        : { orderBy?: EventLabelLinkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventLabelLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventLabelLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventLabelLink model
   */
  readonly fields: EventLabelLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventLabelLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventLabelLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    anomalyEvent<T extends AnomalyEventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnomalyEventDefaultArgs<ExtArgs>>): Prisma__AnomalyEventClient<$Result.GetResult<Prisma.$AnomalyEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    anomalyLabel<T extends AnomalyLabelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnomalyLabelDefaultArgs<ExtArgs>>): Prisma__AnomalyLabelClient<$Result.GetResult<Prisma.$AnomalyLabelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventLabelLink model
   */
  interface EventLabelLinkFieldRefs {
    readonly id: FieldRef<"EventLabelLink", 'String'>
    readonly eventId: FieldRef<"EventLabelLink", 'String'>
    readonly labelId: FieldRef<"EventLabelLink", 'String'>
    readonly createdAt: FieldRef<"EventLabelLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventLabelLink findUnique
   */
  export type EventLabelLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter, which EventLabelLink to fetch.
     */
    where: EventLabelLinkWhereUniqueInput
  }

  /**
   * EventLabelLink findUniqueOrThrow
   */
  export type EventLabelLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter, which EventLabelLink to fetch.
     */
    where: EventLabelLinkWhereUniqueInput
  }

  /**
   * EventLabelLink findFirst
   */
  export type EventLabelLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter, which EventLabelLink to fetch.
     */
    where?: EventLabelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLabelLinks to fetch.
     */
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLabelLinks.
     */
    cursor?: EventLabelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLabelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLabelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLabelLinks.
     */
    distinct?: EventLabelLinkScalarFieldEnum | EventLabelLinkScalarFieldEnum[]
  }

  /**
   * EventLabelLink findFirstOrThrow
   */
  export type EventLabelLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter, which EventLabelLink to fetch.
     */
    where?: EventLabelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLabelLinks to fetch.
     */
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLabelLinks.
     */
    cursor?: EventLabelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLabelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLabelLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLabelLinks.
     */
    distinct?: EventLabelLinkScalarFieldEnum | EventLabelLinkScalarFieldEnum[]
  }

  /**
   * EventLabelLink findMany
   */
  export type EventLabelLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter, which EventLabelLinks to fetch.
     */
    where?: EventLabelLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLabelLinks to fetch.
     */
    orderBy?: EventLabelLinkOrderByWithRelationInput | EventLabelLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventLabelLinks.
     */
    cursor?: EventLabelLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLabelLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLabelLinks.
     */
    skip?: number
    distinct?: EventLabelLinkScalarFieldEnum | EventLabelLinkScalarFieldEnum[]
  }

  /**
   * EventLabelLink create
   */
  export type EventLabelLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a EventLabelLink.
     */
    data: XOR<EventLabelLinkCreateInput, EventLabelLinkUncheckedCreateInput>
  }

  /**
   * EventLabelLink createMany
   */
  export type EventLabelLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventLabelLinks.
     */
    data: EventLabelLinkCreateManyInput | EventLabelLinkCreateManyInput[]
  }

  /**
   * EventLabelLink createManyAndReturn
   */
  export type EventLabelLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * The data used to create many EventLabelLinks.
     */
    data: EventLabelLinkCreateManyInput | EventLabelLinkCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventLabelLink update
   */
  export type EventLabelLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a EventLabelLink.
     */
    data: XOR<EventLabelLinkUpdateInput, EventLabelLinkUncheckedUpdateInput>
    /**
     * Choose, which EventLabelLink to update.
     */
    where: EventLabelLinkWhereUniqueInput
  }

  /**
   * EventLabelLink updateMany
   */
  export type EventLabelLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventLabelLinks.
     */
    data: XOR<EventLabelLinkUpdateManyMutationInput, EventLabelLinkUncheckedUpdateManyInput>
    /**
     * Filter which EventLabelLinks to update
     */
    where?: EventLabelLinkWhereInput
    /**
     * Limit how many EventLabelLinks to update.
     */
    limit?: number
  }

  /**
   * EventLabelLink updateManyAndReturn
   */
  export type EventLabelLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * The data used to update EventLabelLinks.
     */
    data: XOR<EventLabelLinkUpdateManyMutationInput, EventLabelLinkUncheckedUpdateManyInput>
    /**
     * Filter which EventLabelLinks to update
     */
    where?: EventLabelLinkWhereInput
    /**
     * Limit how many EventLabelLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventLabelLink upsert
   */
  export type EventLabelLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the EventLabelLink to update in case it exists.
     */
    where: EventLabelLinkWhereUniqueInput
    /**
     * In case the EventLabelLink found by the `where` argument doesn't exist, create a new EventLabelLink with this data.
     */
    create: XOR<EventLabelLinkCreateInput, EventLabelLinkUncheckedCreateInput>
    /**
     * In case the EventLabelLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventLabelLinkUpdateInput, EventLabelLinkUncheckedUpdateInput>
  }

  /**
   * EventLabelLink delete
   */
  export type EventLabelLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
    /**
     * Filter which EventLabelLink to delete.
     */
    where: EventLabelLinkWhereUniqueInput
  }

  /**
   * EventLabelLink deleteMany
   */
  export type EventLabelLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLabelLinks to delete
     */
    where?: EventLabelLinkWhereInput
    /**
     * Limit how many EventLabelLinks to delete.
     */
    limit?: number
  }

  /**
   * EventLabelLink without action
   */
  export type EventLabelLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLabelLink
     */
    select?: EventLabelLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventLabelLink
     */
    omit?: EventLabelLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventLabelLinkInclude<ExtArgs> | null
  }


  /**
   * Model TrainedModel
   */

  export type AggregateTrainedModel = {
    _count: TrainedModelCountAggregateOutputType | null
    _min: TrainedModelMinAggregateOutputType | null
    _max: TrainedModelMaxAggregateOutputType | null
  }

  export type TrainedModelMinAggregateOutputType = {
    id: string | null
    name: string | null
    scenarioType: string | null
    status: string | null
    experimentRunId: string | null
    modelConfig: string | null
    dataSourceConfig: string | null
    modelPath: string | null
    trainingMetrics: string | null
    validationMetrics: string | null
    trainingLogs: string | null
    jobId: string | null
    createdAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type TrainedModelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    scenarioType: string | null
    status: string | null
    experimentRunId: string | null
    modelConfig: string | null
    dataSourceConfig: string | null
    modelPath: string | null
    trainingMetrics: string | null
    validationMetrics: string | null
    trainingLogs: string | null
    jobId: string | null
    createdAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type TrainedModelCountAggregateOutputType = {
    id: number
    name: number
    scenarioType: number
    status: number
    experimentRunId: number
    modelConfig: number
    dataSourceConfig: number
    modelPath: number
    trainingMetrics: number
    validationMetrics: number
    trainingLogs: number
    jobId: number
    createdAt: number
    startedAt: number
    completedAt: number
    _all: number
  }


  export type TrainedModelMinAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    experimentRunId?: true
    modelConfig?: true
    dataSourceConfig?: true
    modelPath?: true
    trainingMetrics?: true
    validationMetrics?: true
    trainingLogs?: true
    jobId?: true
    createdAt?: true
    startedAt?: true
    completedAt?: true
  }

  export type TrainedModelMaxAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    experimentRunId?: true
    modelConfig?: true
    dataSourceConfig?: true
    modelPath?: true
    trainingMetrics?: true
    validationMetrics?: true
    trainingLogs?: true
    jobId?: true
    createdAt?: true
    startedAt?: true
    completedAt?: true
  }

  export type TrainedModelCountAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    experimentRunId?: true
    modelConfig?: true
    dataSourceConfig?: true
    modelPath?: true
    trainingMetrics?: true
    validationMetrics?: true
    trainingLogs?: true
    jobId?: true
    createdAt?: true
    startedAt?: true
    completedAt?: true
    _all?: true
  }

  export type TrainedModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrainedModel to aggregate.
     */
    where?: TrainedModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainedModels to fetch.
     */
    orderBy?: TrainedModelOrderByWithRelationInput | TrainedModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrainedModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainedModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainedModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrainedModels
    **/
    _count?: true | TrainedModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrainedModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrainedModelMaxAggregateInputType
  }

  export type GetTrainedModelAggregateType<T extends TrainedModelAggregateArgs> = {
        [P in keyof T & keyof AggregateTrainedModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrainedModel[P]>
      : GetScalarType<T[P], AggregateTrainedModel[P]>
  }




  export type TrainedModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainedModelWhereInput
    orderBy?: TrainedModelOrderByWithAggregationInput | TrainedModelOrderByWithAggregationInput[]
    by: TrainedModelScalarFieldEnum[] | TrainedModelScalarFieldEnum
    having?: TrainedModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrainedModelCountAggregateInputType | true
    _min?: TrainedModelMinAggregateInputType
    _max?: TrainedModelMaxAggregateInputType
  }

  export type TrainedModelGroupByOutputType = {
    id: string
    name: string
    scenarioType: string
    status: string
    experimentRunId: string
    modelConfig: string
    dataSourceConfig: string
    modelPath: string | null
    trainingMetrics: string | null
    validationMetrics: string | null
    trainingLogs: string | null
    jobId: string | null
    createdAt: Date
    startedAt: Date | null
    completedAt: Date | null
    _count: TrainedModelCountAggregateOutputType | null
    _min: TrainedModelMinAggregateOutputType | null
    _max: TrainedModelMaxAggregateOutputType | null
  }

  type GetTrainedModelGroupByPayload<T extends TrainedModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrainedModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrainedModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrainedModelGroupByOutputType[P]>
            : GetScalarType<T[P], TrainedModelGroupByOutputType[P]>
        }
      >
    >


  export type TrainedModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    experimentRunId?: boolean
    modelConfig?: boolean
    dataSourceConfig?: boolean
    modelPath?: boolean
    trainingMetrics?: boolean
    validationMetrics?: boolean
    trainingLogs?: boolean
    jobId?: boolean
    createdAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
    evaluationRuns?: boolean | TrainedModel$evaluationRunsArgs<ExtArgs>
    _count?: boolean | TrainedModelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trainedModel"]>

  export type TrainedModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    experimentRunId?: boolean
    modelConfig?: boolean
    dataSourceConfig?: boolean
    modelPath?: boolean
    trainingMetrics?: boolean
    validationMetrics?: boolean
    trainingLogs?: boolean
    jobId?: boolean
    createdAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trainedModel"]>

  export type TrainedModelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    experimentRunId?: boolean
    modelConfig?: boolean
    dataSourceConfig?: boolean
    modelPath?: boolean
    trainingMetrics?: boolean
    validationMetrics?: boolean
    trainingLogs?: boolean
    jobId?: boolean
    createdAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trainedModel"]>

  export type TrainedModelSelectScalar = {
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    experimentRunId?: boolean
    modelConfig?: boolean
    dataSourceConfig?: boolean
    modelPath?: boolean
    trainingMetrics?: boolean
    validationMetrics?: boolean
    trainingLogs?: boolean
    jobId?: boolean
    createdAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }

  export type TrainedModelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "scenarioType" | "status" | "experimentRunId" | "modelConfig" | "dataSourceConfig" | "modelPath" | "trainingMetrics" | "validationMetrics" | "trainingLogs" | "jobId" | "createdAt" | "startedAt" | "completedAt", ExtArgs["result"]["trainedModel"]>
  export type TrainedModelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
    evaluationRuns?: boolean | TrainedModel$evaluationRunsArgs<ExtArgs>
    _count?: boolean | TrainedModelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TrainedModelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
  }
  export type TrainedModelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    experimentRun?: boolean | ExperimentRunDefaultArgs<ExtArgs>
  }

  export type $TrainedModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrainedModel"
    objects: {
      experimentRun: Prisma.$ExperimentRunPayload<ExtArgs>
      evaluationRuns: Prisma.$EvaluationRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      scenarioType: string
      status: string
      experimentRunId: string
      modelConfig: string
      dataSourceConfig: string
      modelPath: string | null
      trainingMetrics: string | null
      validationMetrics: string | null
      trainingLogs: string | null
      jobId: string | null
      createdAt: Date
      startedAt: Date | null
      completedAt: Date | null
    }, ExtArgs["result"]["trainedModel"]>
    composites: {}
  }

  type TrainedModelGetPayload<S extends boolean | null | undefined | TrainedModelDefaultArgs> = $Result.GetResult<Prisma.$TrainedModelPayload, S>

  type TrainedModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrainedModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrainedModelCountAggregateInputType | true
    }

  export interface TrainedModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrainedModel'], meta: { name: 'TrainedModel' } }
    /**
     * Find zero or one TrainedModel that matches the filter.
     * @param {TrainedModelFindUniqueArgs} args - Arguments to find a TrainedModel
     * @example
     * // Get one TrainedModel
     * const trainedModel = await prisma.trainedModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrainedModelFindUniqueArgs>(args: SelectSubset<T, TrainedModelFindUniqueArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrainedModel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrainedModelFindUniqueOrThrowArgs} args - Arguments to find a TrainedModel
     * @example
     * // Get one TrainedModel
     * const trainedModel = await prisma.trainedModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrainedModelFindUniqueOrThrowArgs>(args: SelectSubset<T, TrainedModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrainedModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelFindFirstArgs} args - Arguments to find a TrainedModel
     * @example
     * // Get one TrainedModel
     * const trainedModel = await prisma.trainedModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrainedModelFindFirstArgs>(args?: SelectSubset<T, TrainedModelFindFirstArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrainedModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelFindFirstOrThrowArgs} args - Arguments to find a TrainedModel
     * @example
     * // Get one TrainedModel
     * const trainedModel = await prisma.trainedModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrainedModelFindFirstOrThrowArgs>(args?: SelectSubset<T, TrainedModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrainedModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrainedModels
     * const trainedModels = await prisma.trainedModel.findMany()
     * 
     * // Get first 10 TrainedModels
     * const trainedModels = await prisma.trainedModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trainedModelWithIdOnly = await prisma.trainedModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrainedModelFindManyArgs>(args?: SelectSubset<T, TrainedModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrainedModel.
     * @param {TrainedModelCreateArgs} args - Arguments to create a TrainedModel.
     * @example
     * // Create one TrainedModel
     * const TrainedModel = await prisma.trainedModel.create({
     *   data: {
     *     // ... data to create a TrainedModel
     *   }
     * })
     * 
     */
    create<T extends TrainedModelCreateArgs>(args: SelectSubset<T, TrainedModelCreateArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrainedModels.
     * @param {TrainedModelCreateManyArgs} args - Arguments to create many TrainedModels.
     * @example
     * // Create many TrainedModels
     * const trainedModel = await prisma.trainedModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrainedModelCreateManyArgs>(args?: SelectSubset<T, TrainedModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrainedModels and returns the data saved in the database.
     * @param {TrainedModelCreateManyAndReturnArgs} args - Arguments to create many TrainedModels.
     * @example
     * // Create many TrainedModels
     * const trainedModel = await prisma.trainedModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrainedModels and only return the `id`
     * const trainedModelWithIdOnly = await prisma.trainedModel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrainedModelCreateManyAndReturnArgs>(args?: SelectSubset<T, TrainedModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrainedModel.
     * @param {TrainedModelDeleteArgs} args - Arguments to delete one TrainedModel.
     * @example
     * // Delete one TrainedModel
     * const TrainedModel = await prisma.trainedModel.delete({
     *   where: {
     *     // ... filter to delete one TrainedModel
     *   }
     * })
     * 
     */
    delete<T extends TrainedModelDeleteArgs>(args: SelectSubset<T, TrainedModelDeleteArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrainedModel.
     * @param {TrainedModelUpdateArgs} args - Arguments to update one TrainedModel.
     * @example
     * // Update one TrainedModel
     * const trainedModel = await prisma.trainedModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrainedModelUpdateArgs>(args: SelectSubset<T, TrainedModelUpdateArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrainedModels.
     * @param {TrainedModelDeleteManyArgs} args - Arguments to filter TrainedModels to delete.
     * @example
     * // Delete a few TrainedModels
     * const { count } = await prisma.trainedModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrainedModelDeleteManyArgs>(args?: SelectSubset<T, TrainedModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrainedModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrainedModels
     * const trainedModel = await prisma.trainedModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrainedModelUpdateManyArgs>(args: SelectSubset<T, TrainedModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrainedModels and returns the data updated in the database.
     * @param {TrainedModelUpdateManyAndReturnArgs} args - Arguments to update many TrainedModels.
     * @example
     * // Update many TrainedModels
     * const trainedModel = await prisma.trainedModel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrainedModels and only return the `id`
     * const trainedModelWithIdOnly = await prisma.trainedModel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrainedModelUpdateManyAndReturnArgs>(args: SelectSubset<T, TrainedModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrainedModel.
     * @param {TrainedModelUpsertArgs} args - Arguments to update or create a TrainedModel.
     * @example
     * // Update or create a TrainedModel
     * const trainedModel = await prisma.trainedModel.upsert({
     *   create: {
     *     // ... data to create a TrainedModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrainedModel we want to update
     *   }
     * })
     */
    upsert<T extends TrainedModelUpsertArgs>(args: SelectSubset<T, TrainedModelUpsertArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrainedModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelCountArgs} args - Arguments to filter TrainedModels to count.
     * @example
     * // Count the number of TrainedModels
     * const count = await prisma.trainedModel.count({
     *   where: {
     *     // ... the filter for the TrainedModels we want to count
     *   }
     * })
    **/
    count<T extends TrainedModelCountArgs>(
      args?: Subset<T, TrainedModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrainedModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrainedModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrainedModelAggregateArgs>(args: Subset<T, TrainedModelAggregateArgs>): Prisma.PrismaPromise<GetTrainedModelAggregateType<T>>

    /**
     * Group by TrainedModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainedModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrainedModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrainedModelGroupByArgs['orderBy'] }
        : { orderBy?: TrainedModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrainedModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrainedModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrainedModel model
   */
  readonly fields: TrainedModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrainedModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrainedModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    experimentRun<T extends ExperimentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExperimentRunDefaultArgs<ExtArgs>>): Prisma__ExperimentRunClient<$Result.GetResult<Prisma.$ExperimentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    evaluationRuns<T extends TrainedModel$evaluationRunsArgs<ExtArgs> = {}>(args?: Subset<T, TrainedModel$evaluationRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrainedModel model
   */
  interface TrainedModelFieldRefs {
    readonly id: FieldRef<"TrainedModel", 'String'>
    readonly name: FieldRef<"TrainedModel", 'String'>
    readonly scenarioType: FieldRef<"TrainedModel", 'String'>
    readonly status: FieldRef<"TrainedModel", 'String'>
    readonly experimentRunId: FieldRef<"TrainedModel", 'String'>
    readonly modelConfig: FieldRef<"TrainedModel", 'String'>
    readonly dataSourceConfig: FieldRef<"TrainedModel", 'String'>
    readonly modelPath: FieldRef<"TrainedModel", 'String'>
    readonly trainingMetrics: FieldRef<"TrainedModel", 'String'>
    readonly validationMetrics: FieldRef<"TrainedModel", 'String'>
    readonly trainingLogs: FieldRef<"TrainedModel", 'String'>
    readonly jobId: FieldRef<"TrainedModel", 'String'>
    readonly createdAt: FieldRef<"TrainedModel", 'DateTime'>
    readonly startedAt: FieldRef<"TrainedModel", 'DateTime'>
    readonly completedAt: FieldRef<"TrainedModel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrainedModel findUnique
   */
  export type TrainedModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter, which TrainedModel to fetch.
     */
    where: TrainedModelWhereUniqueInput
  }

  /**
   * TrainedModel findUniqueOrThrow
   */
  export type TrainedModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter, which TrainedModel to fetch.
     */
    where: TrainedModelWhereUniqueInput
  }

  /**
   * TrainedModel findFirst
   */
  export type TrainedModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter, which TrainedModel to fetch.
     */
    where?: TrainedModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainedModels to fetch.
     */
    orderBy?: TrainedModelOrderByWithRelationInput | TrainedModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrainedModels.
     */
    cursor?: TrainedModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainedModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainedModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrainedModels.
     */
    distinct?: TrainedModelScalarFieldEnum | TrainedModelScalarFieldEnum[]
  }

  /**
   * TrainedModel findFirstOrThrow
   */
  export type TrainedModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter, which TrainedModel to fetch.
     */
    where?: TrainedModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainedModels to fetch.
     */
    orderBy?: TrainedModelOrderByWithRelationInput | TrainedModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrainedModels.
     */
    cursor?: TrainedModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainedModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainedModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrainedModels.
     */
    distinct?: TrainedModelScalarFieldEnum | TrainedModelScalarFieldEnum[]
  }

  /**
   * TrainedModel findMany
   */
  export type TrainedModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter, which TrainedModels to fetch.
     */
    where?: TrainedModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainedModels to fetch.
     */
    orderBy?: TrainedModelOrderByWithRelationInput | TrainedModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrainedModels.
     */
    cursor?: TrainedModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainedModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainedModels.
     */
    skip?: number
    distinct?: TrainedModelScalarFieldEnum | TrainedModelScalarFieldEnum[]
  }

  /**
   * TrainedModel create
   */
  export type TrainedModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * The data needed to create a TrainedModel.
     */
    data: XOR<TrainedModelCreateInput, TrainedModelUncheckedCreateInput>
  }

  /**
   * TrainedModel createMany
   */
  export type TrainedModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrainedModels.
     */
    data: TrainedModelCreateManyInput | TrainedModelCreateManyInput[]
  }

  /**
   * TrainedModel createManyAndReturn
   */
  export type TrainedModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * The data used to create many TrainedModels.
     */
    data: TrainedModelCreateManyInput | TrainedModelCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrainedModel update
   */
  export type TrainedModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * The data needed to update a TrainedModel.
     */
    data: XOR<TrainedModelUpdateInput, TrainedModelUncheckedUpdateInput>
    /**
     * Choose, which TrainedModel to update.
     */
    where: TrainedModelWhereUniqueInput
  }

  /**
   * TrainedModel updateMany
   */
  export type TrainedModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrainedModels.
     */
    data: XOR<TrainedModelUpdateManyMutationInput, TrainedModelUncheckedUpdateManyInput>
    /**
     * Filter which TrainedModels to update
     */
    where?: TrainedModelWhereInput
    /**
     * Limit how many TrainedModels to update.
     */
    limit?: number
  }

  /**
   * TrainedModel updateManyAndReturn
   */
  export type TrainedModelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * The data used to update TrainedModels.
     */
    data: XOR<TrainedModelUpdateManyMutationInput, TrainedModelUncheckedUpdateManyInput>
    /**
     * Filter which TrainedModels to update
     */
    where?: TrainedModelWhereInput
    /**
     * Limit how many TrainedModels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrainedModel upsert
   */
  export type TrainedModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * The filter to search for the TrainedModel to update in case it exists.
     */
    where: TrainedModelWhereUniqueInput
    /**
     * In case the TrainedModel found by the `where` argument doesn't exist, create a new TrainedModel with this data.
     */
    create: XOR<TrainedModelCreateInput, TrainedModelUncheckedCreateInput>
    /**
     * In case the TrainedModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrainedModelUpdateInput, TrainedModelUncheckedUpdateInput>
  }

  /**
   * TrainedModel delete
   */
  export type TrainedModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
    /**
     * Filter which TrainedModel to delete.
     */
    where: TrainedModelWhereUniqueInput
  }

  /**
   * TrainedModel deleteMany
   */
  export type TrainedModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrainedModels to delete
     */
    where?: TrainedModelWhereInput
    /**
     * Limit how many TrainedModels to delete.
     */
    limit?: number
  }

  /**
   * TrainedModel.evaluationRuns
   */
  export type TrainedModel$evaluationRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    where?: EvaluationRunWhereInput
    orderBy?: EvaluationRunOrderByWithRelationInput | EvaluationRunOrderByWithRelationInput[]
    cursor?: EvaluationRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EvaluationRunScalarFieldEnum | EvaluationRunScalarFieldEnum[]
  }

  /**
   * TrainedModel without action
   */
  export type TrainedModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainedModel
     */
    select?: TrainedModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrainedModel
     */
    omit?: TrainedModelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainedModelInclude<ExtArgs> | null
  }


  /**
   * Model EvaluationRun
   */

  export type AggregateEvaluationRun = {
    _count: EvaluationRunCountAggregateOutputType | null
    _min: EvaluationRunMinAggregateOutputType | null
    _max: EvaluationRunMaxAggregateOutputType | null
  }

  export type EvaluationRunMinAggregateOutputType = {
    id: string | null
    name: string | null
    scenarioType: string | null
    status: string | null
    trainedModelId: string | null
    testSetSource: string | null
    evaluationMetrics: string | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type EvaluationRunMaxAggregateOutputType = {
    id: string | null
    name: string | null
    scenarioType: string | null
    status: string | null
    trainedModelId: string | null
    testSetSource: string | null
    evaluationMetrics: string | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type EvaluationRunCountAggregateOutputType = {
    id: number
    name: number
    scenarioType: number
    status: number
    trainedModelId: number
    testSetSource: number
    evaluationMetrics: number
    jobId: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type EvaluationRunMinAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    trainedModelId?: true
    testSetSource?: true
    evaluationMetrics?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type EvaluationRunMaxAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    trainedModelId?: true
    testSetSource?: true
    evaluationMetrics?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type EvaluationRunCountAggregateInputType = {
    id?: true
    name?: true
    scenarioType?: true
    status?: true
    trainedModelId?: true
    testSetSource?: true
    evaluationMetrics?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type EvaluationRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvaluationRun to aggregate.
     */
    where?: EvaluationRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationRuns to fetch.
     */
    orderBy?: EvaluationRunOrderByWithRelationInput | EvaluationRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EvaluationRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EvaluationRuns
    **/
    _count?: true | EvaluationRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EvaluationRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EvaluationRunMaxAggregateInputType
  }

  export type GetEvaluationRunAggregateType<T extends EvaluationRunAggregateArgs> = {
        [P in keyof T & keyof AggregateEvaluationRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvaluationRun[P]>
      : GetScalarType<T[P], AggregateEvaluationRun[P]>
  }




  export type EvaluationRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EvaluationRunWhereInput
    orderBy?: EvaluationRunOrderByWithAggregationInput | EvaluationRunOrderByWithAggregationInput[]
    by: EvaluationRunScalarFieldEnum[] | EvaluationRunScalarFieldEnum
    having?: EvaluationRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EvaluationRunCountAggregateInputType | true
    _min?: EvaluationRunMinAggregateInputType
    _max?: EvaluationRunMaxAggregateInputType
  }

  export type EvaluationRunGroupByOutputType = {
    id: string
    name: string
    scenarioType: string
    status: string
    trainedModelId: string
    testSetSource: string
    evaluationMetrics: string | null
    jobId: string | null
    createdAt: Date
    completedAt: Date | null
    _count: EvaluationRunCountAggregateOutputType | null
    _min: EvaluationRunMinAggregateOutputType | null
    _max: EvaluationRunMaxAggregateOutputType | null
  }

  type GetEvaluationRunGroupByPayload<T extends EvaluationRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EvaluationRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EvaluationRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EvaluationRunGroupByOutputType[P]>
            : GetScalarType<T[P], EvaluationRunGroupByOutputType[P]>
        }
      >
    >


  export type EvaluationRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    trainedModelId?: boolean
    testSetSource?: boolean
    evaluationMetrics?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
    predictions?: boolean | EvaluationRun$predictionsArgs<ExtArgs>
    _count?: boolean | EvaluationRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationRun"]>

  export type EvaluationRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    trainedModelId?: boolean
    testSetSource?: boolean
    evaluationMetrics?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationRun"]>

  export type EvaluationRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    trainedModelId?: boolean
    testSetSource?: boolean
    evaluationMetrics?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["evaluationRun"]>

  export type EvaluationRunSelectScalar = {
    id?: boolean
    name?: boolean
    scenarioType?: boolean
    status?: boolean
    trainedModelId?: boolean
    testSetSource?: boolean
    evaluationMetrics?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type EvaluationRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "scenarioType" | "status" | "trainedModelId" | "testSetSource" | "evaluationMetrics" | "jobId" | "createdAt" | "completedAt", ExtArgs["result"]["evaluationRun"]>
  export type EvaluationRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
    predictions?: boolean | EvaluationRun$predictionsArgs<ExtArgs>
    _count?: boolean | EvaluationRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EvaluationRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
  }
  export type EvaluationRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trainedModel?: boolean | TrainedModelDefaultArgs<ExtArgs>
  }

  export type $EvaluationRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EvaluationRun"
    objects: {
      trainedModel: Prisma.$TrainedModelPayload<ExtArgs>
      predictions: Prisma.$ModelPredictionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      scenarioType: string
      status: string
      trainedModelId: string
      testSetSource: string
      evaluationMetrics: string | null
      jobId: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["evaluationRun"]>
    composites: {}
  }

  type EvaluationRunGetPayload<S extends boolean | null | undefined | EvaluationRunDefaultArgs> = $Result.GetResult<Prisma.$EvaluationRunPayload, S>

  type EvaluationRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EvaluationRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EvaluationRunCountAggregateInputType | true
    }

  export interface EvaluationRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EvaluationRun'], meta: { name: 'EvaluationRun' } }
    /**
     * Find zero or one EvaluationRun that matches the filter.
     * @param {EvaluationRunFindUniqueArgs} args - Arguments to find a EvaluationRun
     * @example
     * // Get one EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EvaluationRunFindUniqueArgs>(args: SelectSubset<T, EvaluationRunFindUniqueArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EvaluationRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EvaluationRunFindUniqueOrThrowArgs} args - Arguments to find a EvaluationRun
     * @example
     * // Get one EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EvaluationRunFindUniqueOrThrowArgs>(args: SelectSubset<T, EvaluationRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EvaluationRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunFindFirstArgs} args - Arguments to find a EvaluationRun
     * @example
     * // Get one EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EvaluationRunFindFirstArgs>(args?: SelectSubset<T, EvaluationRunFindFirstArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EvaluationRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunFindFirstOrThrowArgs} args - Arguments to find a EvaluationRun
     * @example
     * // Get one EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EvaluationRunFindFirstOrThrowArgs>(args?: SelectSubset<T, EvaluationRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EvaluationRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EvaluationRuns
     * const evaluationRuns = await prisma.evaluationRun.findMany()
     * 
     * // Get first 10 EvaluationRuns
     * const evaluationRuns = await prisma.evaluationRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const evaluationRunWithIdOnly = await prisma.evaluationRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EvaluationRunFindManyArgs>(args?: SelectSubset<T, EvaluationRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EvaluationRun.
     * @param {EvaluationRunCreateArgs} args - Arguments to create a EvaluationRun.
     * @example
     * // Create one EvaluationRun
     * const EvaluationRun = await prisma.evaluationRun.create({
     *   data: {
     *     // ... data to create a EvaluationRun
     *   }
     * })
     * 
     */
    create<T extends EvaluationRunCreateArgs>(args: SelectSubset<T, EvaluationRunCreateArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EvaluationRuns.
     * @param {EvaluationRunCreateManyArgs} args - Arguments to create many EvaluationRuns.
     * @example
     * // Create many EvaluationRuns
     * const evaluationRun = await prisma.evaluationRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EvaluationRunCreateManyArgs>(args?: SelectSubset<T, EvaluationRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EvaluationRuns and returns the data saved in the database.
     * @param {EvaluationRunCreateManyAndReturnArgs} args - Arguments to create many EvaluationRuns.
     * @example
     * // Create many EvaluationRuns
     * const evaluationRun = await prisma.evaluationRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EvaluationRuns and only return the `id`
     * const evaluationRunWithIdOnly = await prisma.evaluationRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EvaluationRunCreateManyAndReturnArgs>(args?: SelectSubset<T, EvaluationRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EvaluationRun.
     * @param {EvaluationRunDeleteArgs} args - Arguments to delete one EvaluationRun.
     * @example
     * // Delete one EvaluationRun
     * const EvaluationRun = await prisma.evaluationRun.delete({
     *   where: {
     *     // ... filter to delete one EvaluationRun
     *   }
     * })
     * 
     */
    delete<T extends EvaluationRunDeleteArgs>(args: SelectSubset<T, EvaluationRunDeleteArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EvaluationRun.
     * @param {EvaluationRunUpdateArgs} args - Arguments to update one EvaluationRun.
     * @example
     * // Update one EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EvaluationRunUpdateArgs>(args: SelectSubset<T, EvaluationRunUpdateArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EvaluationRuns.
     * @param {EvaluationRunDeleteManyArgs} args - Arguments to filter EvaluationRuns to delete.
     * @example
     * // Delete a few EvaluationRuns
     * const { count } = await prisma.evaluationRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EvaluationRunDeleteManyArgs>(args?: SelectSubset<T, EvaluationRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvaluationRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EvaluationRuns
     * const evaluationRun = await prisma.evaluationRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EvaluationRunUpdateManyArgs>(args: SelectSubset<T, EvaluationRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EvaluationRuns and returns the data updated in the database.
     * @param {EvaluationRunUpdateManyAndReturnArgs} args - Arguments to update many EvaluationRuns.
     * @example
     * // Update many EvaluationRuns
     * const evaluationRun = await prisma.evaluationRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EvaluationRuns and only return the `id`
     * const evaluationRunWithIdOnly = await prisma.evaluationRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EvaluationRunUpdateManyAndReturnArgs>(args: SelectSubset<T, EvaluationRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EvaluationRun.
     * @param {EvaluationRunUpsertArgs} args - Arguments to update or create a EvaluationRun.
     * @example
     * // Update or create a EvaluationRun
     * const evaluationRun = await prisma.evaluationRun.upsert({
     *   create: {
     *     // ... data to create a EvaluationRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EvaluationRun we want to update
     *   }
     * })
     */
    upsert<T extends EvaluationRunUpsertArgs>(args: SelectSubset<T, EvaluationRunUpsertArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EvaluationRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunCountArgs} args - Arguments to filter EvaluationRuns to count.
     * @example
     * // Count the number of EvaluationRuns
     * const count = await prisma.evaluationRun.count({
     *   where: {
     *     // ... the filter for the EvaluationRuns we want to count
     *   }
     * })
    **/
    count<T extends EvaluationRunCountArgs>(
      args?: Subset<T, EvaluationRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EvaluationRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EvaluationRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EvaluationRunAggregateArgs>(args: Subset<T, EvaluationRunAggregateArgs>): Prisma.PrismaPromise<GetEvaluationRunAggregateType<T>>

    /**
     * Group by EvaluationRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EvaluationRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EvaluationRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EvaluationRunGroupByArgs['orderBy'] }
        : { orderBy?: EvaluationRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EvaluationRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvaluationRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EvaluationRun model
   */
  readonly fields: EvaluationRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EvaluationRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EvaluationRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trainedModel<T extends TrainedModelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrainedModelDefaultArgs<ExtArgs>>): Prisma__TrainedModelClient<$Result.GetResult<Prisma.$TrainedModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    predictions<T extends EvaluationRun$predictionsArgs<ExtArgs> = {}>(args?: Subset<T, EvaluationRun$predictionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EvaluationRun model
   */
  interface EvaluationRunFieldRefs {
    readonly id: FieldRef<"EvaluationRun", 'String'>
    readonly name: FieldRef<"EvaluationRun", 'String'>
    readonly scenarioType: FieldRef<"EvaluationRun", 'String'>
    readonly status: FieldRef<"EvaluationRun", 'String'>
    readonly trainedModelId: FieldRef<"EvaluationRun", 'String'>
    readonly testSetSource: FieldRef<"EvaluationRun", 'String'>
    readonly evaluationMetrics: FieldRef<"EvaluationRun", 'String'>
    readonly jobId: FieldRef<"EvaluationRun", 'String'>
    readonly createdAt: FieldRef<"EvaluationRun", 'DateTime'>
    readonly completedAt: FieldRef<"EvaluationRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EvaluationRun findUnique
   */
  export type EvaluationRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationRun to fetch.
     */
    where: EvaluationRunWhereUniqueInput
  }

  /**
   * EvaluationRun findUniqueOrThrow
   */
  export type EvaluationRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationRun to fetch.
     */
    where: EvaluationRunWhereUniqueInput
  }

  /**
   * EvaluationRun findFirst
   */
  export type EvaluationRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationRun to fetch.
     */
    where?: EvaluationRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationRuns to fetch.
     */
    orderBy?: EvaluationRunOrderByWithRelationInput | EvaluationRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvaluationRuns.
     */
    cursor?: EvaluationRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvaluationRuns.
     */
    distinct?: EvaluationRunScalarFieldEnum | EvaluationRunScalarFieldEnum[]
  }

  /**
   * EvaluationRun findFirstOrThrow
   */
  export type EvaluationRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationRun to fetch.
     */
    where?: EvaluationRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationRuns to fetch.
     */
    orderBy?: EvaluationRunOrderByWithRelationInput | EvaluationRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EvaluationRuns.
     */
    cursor?: EvaluationRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EvaluationRuns.
     */
    distinct?: EvaluationRunScalarFieldEnum | EvaluationRunScalarFieldEnum[]
  }

  /**
   * EvaluationRun findMany
   */
  export type EvaluationRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter, which EvaluationRuns to fetch.
     */
    where?: EvaluationRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EvaluationRuns to fetch.
     */
    orderBy?: EvaluationRunOrderByWithRelationInput | EvaluationRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EvaluationRuns.
     */
    cursor?: EvaluationRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EvaluationRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EvaluationRuns.
     */
    skip?: number
    distinct?: EvaluationRunScalarFieldEnum | EvaluationRunScalarFieldEnum[]
  }

  /**
   * EvaluationRun create
   */
  export type EvaluationRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * The data needed to create a EvaluationRun.
     */
    data: XOR<EvaluationRunCreateInput, EvaluationRunUncheckedCreateInput>
  }

  /**
   * EvaluationRun createMany
   */
  export type EvaluationRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EvaluationRuns.
     */
    data: EvaluationRunCreateManyInput | EvaluationRunCreateManyInput[]
  }

  /**
   * EvaluationRun createManyAndReturn
   */
  export type EvaluationRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * The data used to create many EvaluationRuns.
     */
    data: EvaluationRunCreateManyInput | EvaluationRunCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvaluationRun update
   */
  export type EvaluationRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * The data needed to update a EvaluationRun.
     */
    data: XOR<EvaluationRunUpdateInput, EvaluationRunUncheckedUpdateInput>
    /**
     * Choose, which EvaluationRun to update.
     */
    where: EvaluationRunWhereUniqueInput
  }

  /**
   * EvaluationRun updateMany
   */
  export type EvaluationRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EvaluationRuns.
     */
    data: XOR<EvaluationRunUpdateManyMutationInput, EvaluationRunUncheckedUpdateManyInput>
    /**
     * Filter which EvaluationRuns to update
     */
    where?: EvaluationRunWhereInput
    /**
     * Limit how many EvaluationRuns to update.
     */
    limit?: number
  }

  /**
   * EvaluationRun updateManyAndReturn
   */
  export type EvaluationRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * The data used to update EvaluationRuns.
     */
    data: XOR<EvaluationRunUpdateManyMutationInput, EvaluationRunUncheckedUpdateManyInput>
    /**
     * Filter which EvaluationRuns to update
     */
    where?: EvaluationRunWhereInput
    /**
     * Limit how many EvaluationRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EvaluationRun upsert
   */
  export type EvaluationRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * The filter to search for the EvaluationRun to update in case it exists.
     */
    where: EvaluationRunWhereUniqueInput
    /**
     * In case the EvaluationRun found by the `where` argument doesn't exist, create a new EvaluationRun with this data.
     */
    create: XOR<EvaluationRunCreateInput, EvaluationRunUncheckedCreateInput>
    /**
     * In case the EvaluationRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EvaluationRunUpdateInput, EvaluationRunUncheckedUpdateInput>
  }

  /**
   * EvaluationRun delete
   */
  export type EvaluationRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
    /**
     * Filter which EvaluationRun to delete.
     */
    where: EvaluationRunWhereUniqueInput
  }

  /**
   * EvaluationRun deleteMany
   */
  export type EvaluationRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EvaluationRuns to delete
     */
    where?: EvaluationRunWhereInput
    /**
     * Limit how many EvaluationRuns to delete.
     */
    limit?: number
  }

  /**
   * EvaluationRun.predictions
   */
  export type EvaluationRun$predictionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    where?: ModelPredictionWhereInput
    orderBy?: ModelPredictionOrderByWithRelationInput | ModelPredictionOrderByWithRelationInput[]
    cursor?: ModelPredictionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModelPredictionScalarFieldEnum | ModelPredictionScalarFieldEnum[]
  }

  /**
   * EvaluationRun without action
   */
  export type EvaluationRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EvaluationRun
     */
    select?: EvaluationRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EvaluationRun
     */
    omit?: EvaluationRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EvaluationRunInclude<ExtArgs> | null
  }


  /**
   * Model ModelPrediction
   */

  export type AggregateModelPrediction = {
    _count: ModelPredictionCountAggregateOutputType | null
    _avg: ModelPredictionAvgAggregateOutputType | null
    _sum: ModelPredictionSumAggregateOutputType | null
    _min: ModelPredictionMinAggregateOutputType | null
    _max: ModelPredictionMaxAggregateOutputType | null
  }

  export type ModelPredictionAvgAggregateOutputType = {
    predictionScore: number | null
    groundTruth: number | null
  }

  export type ModelPredictionSumAggregateOutputType = {
    predictionScore: number | null
    groundTruth: number | null
  }

  export type ModelPredictionMinAggregateOutputType = {
    id: string | null
    evaluationRunId: string | null
    timestamp: Date | null
    predictionScore: number | null
    groundTruth: number | null
  }

  export type ModelPredictionMaxAggregateOutputType = {
    id: string | null
    evaluationRunId: string | null
    timestamp: Date | null
    predictionScore: number | null
    groundTruth: number | null
  }

  export type ModelPredictionCountAggregateOutputType = {
    id: number
    evaluationRunId: number
    timestamp: number
    predictionScore: number
    groundTruth: number
    _all: number
  }


  export type ModelPredictionAvgAggregateInputType = {
    predictionScore?: true
    groundTruth?: true
  }

  export type ModelPredictionSumAggregateInputType = {
    predictionScore?: true
    groundTruth?: true
  }

  export type ModelPredictionMinAggregateInputType = {
    id?: true
    evaluationRunId?: true
    timestamp?: true
    predictionScore?: true
    groundTruth?: true
  }

  export type ModelPredictionMaxAggregateInputType = {
    id?: true
    evaluationRunId?: true
    timestamp?: true
    predictionScore?: true
    groundTruth?: true
  }

  export type ModelPredictionCountAggregateInputType = {
    id?: true
    evaluationRunId?: true
    timestamp?: true
    predictionScore?: true
    groundTruth?: true
    _all?: true
  }

  export type ModelPredictionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModelPrediction to aggregate.
     */
    where?: ModelPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelPredictions to fetch.
     */
    orderBy?: ModelPredictionOrderByWithRelationInput | ModelPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModelPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ModelPredictions
    **/
    _count?: true | ModelPredictionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModelPredictionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModelPredictionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModelPredictionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModelPredictionMaxAggregateInputType
  }

  export type GetModelPredictionAggregateType<T extends ModelPredictionAggregateArgs> = {
        [P in keyof T & keyof AggregateModelPrediction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModelPrediction[P]>
      : GetScalarType<T[P], AggregateModelPrediction[P]>
  }




  export type ModelPredictionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModelPredictionWhereInput
    orderBy?: ModelPredictionOrderByWithAggregationInput | ModelPredictionOrderByWithAggregationInput[]
    by: ModelPredictionScalarFieldEnum[] | ModelPredictionScalarFieldEnum
    having?: ModelPredictionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModelPredictionCountAggregateInputType | true
    _avg?: ModelPredictionAvgAggregateInputType
    _sum?: ModelPredictionSumAggregateInputType
    _min?: ModelPredictionMinAggregateInputType
    _max?: ModelPredictionMaxAggregateInputType
  }

  export type ModelPredictionGroupByOutputType = {
    id: string
    evaluationRunId: string
    timestamp: Date
    predictionScore: number
    groundTruth: number | null
    _count: ModelPredictionCountAggregateOutputType | null
    _avg: ModelPredictionAvgAggregateOutputType | null
    _sum: ModelPredictionSumAggregateOutputType | null
    _min: ModelPredictionMinAggregateOutputType | null
    _max: ModelPredictionMaxAggregateOutputType | null
  }

  type GetModelPredictionGroupByPayload<T extends ModelPredictionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModelPredictionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModelPredictionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModelPredictionGroupByOutputType[P]>
            : GetScalarType<T[P], ModelPredictionGroupByOutputType[P]>
        }
      >
    >


  export type ModelPredictionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    evaluationRunId?: boolean
    timestamp?: boolean
    predictionScore?: boolean
    groundTruth?: boolean
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["modelPrediction"]>

  export type ModelPredictionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    evaluationRunId?: boolean
    timestamp?: boolean
    predictionScore?: boolean
    groundTruth?: boolean
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["modelPrediction"]>

  export type ModelPredictionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    evaluationRunId?: boolean
    timestamp?: boolean
    predictionScore?: boolean
    groundTruth?: boolean
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["modelPrediction"]>

  export type ModelPredictionSelectScalar = {
    id?: boolean
    evaluationRunId?: boolean
    timestamp?: boolean
    predictionScore?: boolean
    groundTruth?: boolean
  }

  export type ModelPredictionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "evaluationRunId" | "timestamp" | "predictionScore" | "groundTruth", ExtArgs["result"]["modelPrediction"]>
  export type ModelPredictionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }
  export type ModelPredictionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }
  export type ModelPredictionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evaluationRun?: boolean | EvaluationRunDefaultArgs<ExtArgs>
  }

  export type $ModelPredictionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ModelPrediction"
    objects: {
      evaluationRun: Prisma.$EvaluationRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      evaluationRunId: string
      timestamp: Date
      predictionScore: number
      groundTruth: number | null
    }, ExtArgs["result"]["modelPrediction"]>
    composites: {}
  }

  type ModelPredictionGetPayload<S extends boolean | null | undefined | ModelPredictionDefaultArgs> = $Result.GetResult<Prisma.$ModelPredictionPayload, S>

  type ModelPredictionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModelPredictionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModelPredictionCountAggregateInputType | true
    }

  export interface ModelPredictionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ModelPrediction'], meta: { name: 'ModelPrediction' } }
    /**
     * Find zero or one ModelPrediction that matches the filter.
     * @param {ModelPredictionFindUniqueArgs} args - Arguments to find a ModelPrediction
     * @example
     * // Get one ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModelPredictionFindUniqueArgs>(args: SelectSubset<T, ModelPredictionFindUniqueArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ModelPrediction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModelPredictionFindUniqueOrThrowArgs} args - Arguments to find a ModelPrediction
     * @example
     * // Get one ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModelPredictionFindUniqueOrThrowArgs>(args: SelectSubset<T, ModelPredictionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModelPrediction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionFindFirstArgs} args - Arguments to find a ModelPrediction
     * @example
     * // Get one ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModelPredictionFindFirstArgs>(args?: SelectSubset<T, ModelPredictionFindFirstArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModelPrediction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionFindFirstOrThrowArgs} args - Arguments to find a ModelPrediction
     * @example
     * // Get one ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModelPredictionFindFirstOrThrowArgs>(args?: SelectSubset<T, ModelPredictionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ModelPredictions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ModelPredictions
     * const modelPredictions = await prisma.modelPrediction.findMany()
     * 
     * // Get first 10 ModelPredictions
     * const modelPredictions = await prisma.modelPrediction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const modelPredictionWithIdOnly = await prisma.modelPrediction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModelPredictionFindManyArgs>(args?: SelectSubset<T, ModelPredictionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ModelPrediction.
     * @param {ModelPredictionCreateArgs} args - Arguments to create a ModelPrediction.
     * @example
     * // Create one ModelPrediction
     * const ModelPrediction = await prisma.modelPrediction.create({
     *   data: {
     *     // ... data to create a ModelPrediction
     *   }
     * })
     * 
     */
    create<T extends ModelPredictionCreateArgs>(args: SelectSubset<T, ModelPredictionCreateArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ModelPredictions.
     * @param {ModelPredictionCreateManyArgs} args - Arguments to create many ModelPredictions.
     * @example
     * // Create many ModelPredictions
     * const modelPrediction = await prisma.modelPrediction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModelPredictionCreateManyArgs>(args?: SelectSubset<T, ModelPredictionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ModelPredictions and returns the data saved in the database.
     * @param {ModelPredictionCreateManyAndReturnArgs} args - Arguments to create many ModelPredictions.
     * @example
     * // Create many ModelPredictions
     * const modelPrediction = await prisma.modelPrediction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ModelPredictions and only return the `id`
     * const modelPredictionWithIdOnly = await prisma.modelPrediction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModelPredictionCreateManyAndReturnArgs>(args?: SelectSubset<T, ModelPredictionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ModelPrediction.
     * @param {ModelPredictionDeleteArgs} args - Arguments to delete one ModelPrediction.
     * @example
     * // Delete one ModelPrediction
     * const ModelPrediction = await prisma.modelPrediction.delete({
     *   where: {
     *     // ... filter to delete one ModelPrediction
     *   }
     * })
     * 
     */
    delete<T extends ModelPredictionDeleteArgs>(args: SelectSubset<T, ModelPredictionDeleteArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ModelPrediction.
     * @param {ModelPredictionUpdateArgs} args - Arguments to update one ModelPrediction.
     * @example
     * // Update one ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModelPredictionUpdateArgs>(args: SelectSubset<T, ModelPredictionUpdateArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ModelPredictions.
     * @param {ModelPredictionDeleteManyArgs} args - Arguments to filter ModelPredictions to delete.
     * @example
     * // Delete a few ModelPredictions
     * const { count } = await prisma.modelPrediction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModelPredictionDeleteManyArgs>(args?: SelectSubset<T, ModelPredictionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModelPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ModelPredictions
     * const modelPrediction = await prisma.modelPrediction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModelPredictionUpdateManyArgs>(args: SelectSubset<T, ModelPredictionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModelPredictions and returns the data updated in the database.
     * @param {ModelPredictionUpdateManyAndReturnArgs} args - Arguments to update many ModelPredictions.
     * @example
     * // Update many ModelPredictions
     * const modelPrediction = await prisma.modelPrediction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ModelPredictions and only return the `id`
     * const modelPredictionWithIdOnly = await prisma.modelPrediction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ModelPredictionUpdateManyAndReturnArgs>(args: SelectSubset<T, ModelPredictionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ModelPrediction.
     * @param {ModelPredictionUpsertArgs} args - Arguments to update or create a ModelPrediction.
     * @example
     * // Update or create a ModelPrediction
     * const modelPrediction = await prisma.modelPrediction.upsert({
     *   create: {
     *     // ... data to create a ModelPrediction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ModelPrediction we want to update
     *   }
     * })
     */
    upsert<T extends ModelPredictionUpsertArgs>(args: SelectSubset<T, ModelPredictionUpsertArgs<ExtArgs>>): Prisma__ModelPredictionClient<$Result.GetResult<Prisma.$ModelPredictionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ModelPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionCountArgs} args - Arguments to filter ModelPredictions to count.
     * @example
     * // Count the number of ModelPredictions
     * const count = await prisma.modelPrediction.count({
     *   where: {
     *     // ... the filter for the ModelPredictions we want to count
     *   }
     * })
    **/
    count<T extends ModelPredictionCountArgs>(
      args?: Subset<T, ModelPredictionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModelPredictionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ModelPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ModelPredictionAggregateArgs>(args: Subset<T, ModelPredictionAggregateArgs>): Prisma.PrismaPromise<GetModelPredictionAggregateType<T>>

    /**
     * Group by ModelPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelPredictionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ModelPredictionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModelPredictionGroupByArgs['orderBy'] }
        : { orderBy?: ModelPredictionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ModelPredictionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModelPredictionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ModelPrediction model
   */
  readonly fields: ModelPredictionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ModelPrediction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModelPredictionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    evaluationRun<T extends EvaluationRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EvaluationRunDefaultArgs<ExtArgs>>): Prisma__EvaluationRunClient<$Result.GetResult<Prisma.$EvaluationRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ModelPrediction model
   */
  interface ModelPredictionFieldRefs {
    readonly id: FieldRef<"ModelPrediction", 'String'>
    readonly evaluationRunId: FieldRef<"ModelPrediction", 'String'>
    readonly timestamp: FieldRef<"ModelPrediction", 'DateTime'>
    readonly predictionScore: FieldRef<"ModelPrediction", 'Float'>
    readonly groundTruth: FieldRef<"ModelPrediction", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ModelPrediction findUnique
   */
  export type ModelPredictionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter, which ModelPrediction to fetch.
     */
    where: ModelPredictionWhereUniqueInput
  }

  /**
   * ModelPrediction findUniqueOrThrow
   */
  export type ModelPredictionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter, which ModelPrediction to fetch.
     */
    where: ModelPredictionWhereUniqueInput
  }

  /**
   * ModelPrediction findFirst
   */
  export type ModelPredictionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter, which ModelPrediction to fetch.
     */
    where?: ModelPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelPredictions to fetch.
     */
    orderBy?: ModelPredictionOrderByWithRelationInput | ModelPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModelPredictions.
     */
    cursor?: ModelPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModelPredictions.
     */
    distinct?: ModelPredictionScalarFieldEnum | ModelPredictionScalarFieldEnum[]
  }

  /**
   * ModelPrediction findFirstOrThrow
   */
  export type ModelPredictionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter, which ModelPrediction to fetch.
     */
    where?: ModelPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelPredictions to fetch.
     */
    orderBy?: ModelPredictionOrderByWithRelationInput | ModelPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModelPredictions.
     */
    cursor?: ModelPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModelPredictions.
     */
    distinct?: ModelPredictionScalarFieldEnum | ModelPredictionScalarFieldEnum[]
  }

  /**
   * ModelPrediction findMany
   */
  export type ModelPredictionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter, which ModelPredictions to fetch.
     */
    where?: ModelPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelPredictions to fetch.
     */
    orderBy?: ModelPredictionOrderByWithRelationInput | ModelPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ModelPredictions.
     */
    cursor?: ModelPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelPredictions.
     */
    skip?: number
    distinct?: ModelPredictionScalarFieldEnum | ModelPredictionScalarFieldEnum[]
  }

  /**
   * ModelPrediction create
   */
  export type ModelPredictionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * The data needed to create a ModelPrediction.
     */
    data: XOR<ModelPredictionCreateInput, ModelPredictionUncheckedCreateInput>
  }

  /**
   * ModelPrediction createMany
   */
  export type ModelPredictionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ModelPredictions.
     */
    data: ModelPredictionCreateManyInput | ModelPredictionCreateManyInput[]
  }

  /**
   * ModelPrediction createManyAndReturn
   */
  export type ModelPredictionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * The data used to create many ModelPredictions.
     */
    data: ModelPredictionCreateManyInput | ModelPredictionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModelPrediction update
   */
  export type ModelPredictionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * The data needed to update a ModelPrediction.
     */
    data: XOR<ModelPredictionUpdateInput, ModelPredictionUncheckedUpdateInput>
    /**
     * Choose, which ModelPrediction to update.
     */
    where: ModelPredictionWhereUniqueInput
  }

  /**
   * ModelPrediction updateMany
   */
  export type ModelPredictionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ModelPredictions.
     */
    data: XOR<ModelPredictionUpdateManyMutationInput, ModelPredictionUncheckedUpdateManyInput>
    /**
     * Filter which ModelPredictions to update
     */
    where?: ModelPredictionWhereInput
    /**
     * Limit how many ModelPredictions to update.
     */
    limit?: number
  }

  /**
   * ModelPrediction updateManyAndReturn
   */
  export type ModelPredictionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * The data used to update ModelPredictions.
     */
    data: XOR<ModelPredictionUpdateManyMutationInput, ModelPredictionUncheckedUpdateManyInput>
    /**
     * Filter which ModelPredictions to update
     */
    where?: ModelPredictionWhereInput
    /**
     * Limit how many ModelPredictions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModelPrediction upsert
   */
  export type ModelPredictionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * The filter to search for the ModelPrediction to update in case it exists.
     */
    where: ModelPredictionWhereUniqueInput
    /**
     * In case the ModelPrediction found by the `where` argument doesn't exist, create a new ModelPrediction with this data.
     */
    create: XOR<ModelPredictionCreateInput, ModelPredictionUncheckedCreateInput>
    /**
     * In case the ModelPrediction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModelPredictionUpdateInput, ModelPredictionUncheckedUpdateInput>
  }

  /**
   * ModelPrediction delete
   */
  export type ModelPredictionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
    /**
     * Filter which ModelPrediction to delete.
     */
    where: ModelPredictionWhereUniqueInput
  }

  /**
   * ModelPrediction deleteMany
   */
  export type ModelPredictionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModelPredictions to delete
     */
    where?: ModelPredictionWhereInput
    /**
     * Limit how many ModelPredictions to delete.
     */
    limit?: number
  }

  /**
   * ModelPrediction without action
   */
  export type ModelPredictionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelPrediction
     */
    select?: ModelPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelPrediction
     */
    omit?: ModelPredictionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModelPredictionInclude<ExtArgs> | null
  }


  /**
   * Model Ammeter
   */

  export type AggregateAmmeter = {
    _count: AmmeterCountAggregateOutputType | null
    _avg: AmmeterAvgAggregateOutputType | null
    _sum: AmmeterSumAggregateOutputType | null
    _min: AmmeterMinAggregateOutputType | null
    _max: AmmeterMaxAggregateOutputType | null
  }

  export type AmmeterAvgAggregateOutputType = {
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
  }

  export type AmmeterSumAggregateOutputType = {
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
  }

  export type AmmeterMinAggregateOutputType = {
    id: string | null
    electricMeterNumber: string | null
    electricMeterName: string | null
    deviceNumber: string | null
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmmeterMaxAggregateOutputType = {
    id: string | null
    electricMeterNumber: string | null
    electricMeterName: string | null
    deviceNumber: string | null
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AmmeterCountAggregateOutputType = {
    id: number
    electricMeterNumber: number
    electricMeterName: number
    deviceNumber: number
    factory: number
    device: number
    voltage: number
    currents: number
    power: number
    battery: number
    switchState: number
    networkState: number
    lastUpdated: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AmmeterAvgAggregateInputType = {
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
  }

  export type AmmeterSumAggregateInputType = {
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
  }

  export type AmmeterMinAggregateInputType = {
    id?: true
    electricMeterNumber?: true
    electricMeterName?: true
    deviceNumber?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmmeterMaxAggregateInputType = {
    id?: true
    electricMeterNumber?: true
    electricMeterName?: true
    deviceNumber?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AmmeterCountAggregateInputType = {
    id?: true
    electricMeterNumber?: true
    electricMeterName?: true
    deviceNumber?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AmmeterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ammeter to aggregate.
     */
    where?: AmmeterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ammeters to fetch.
     */
    orderBy?: AmmeterOrderByWithRelationInput | AmmeterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmmeterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ammeters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ammeters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ammeters
    **/
    _count?: true | AmmeterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AmmeterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AmmeterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmmeterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmmeterMaxAggregateInputType
  }

  export type GetAmmeterAggregateType<T extends AmmeterAggregateArgs> = {
        [P in keyof T & keyof AggregateAmmeter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmmeter[P]>
      : GetScalarType<T[P], AggregateAmmeter[P]>
  }




  export type AmmeterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmmeterWhereInput
    orderBy?: AmmeterOrderByWithAggregationInput | AmmeterOrderByWithAggregationInput[]
    by: AmmeterScalarFieldEnum[] | AmmeterScalarFieldEnum
    having?: AmmeterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmmeterCountAggregateInputType | true
    _avg?: AmmeterAvgAggregateInputType
    _sum?: AmmeterSumAggregateInputType
    _min?: AmmeterMinAggregateInputType
    _max?: AmmeterMaxAggregateInputType
  }

  export type AmmeterGroupByOutputType = {
    id: string
    electricMeterNumber: string
    electricMeterName: string
    deviceNumber: string
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    _count: AmmeterCountAggregateOutputType | null
    _avg: AmmeterAvgAggregateOutputType | null
    _sum: AmmeterSumAggregateOutputType | null
    _min: AmmeterMinAggregateOutputType | null
    _max: AmmeterMaxAggregateOutputType | null
  }

  type GetAmmeterGroupByPayload<T extends AmmeterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmmeterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmmeterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmmeterGroupByOutputType[P]>
            : GetScalarType<T[P], AmmeterGroupByOutputType[P]>
        }
      >
    >


  export type AmmeterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    electricMeterNumber?: boolean
    electricMeterName?: boolean
    deviceNumber?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ammeter"]>

  export type AmmeterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    electricMeterNumber?: boolean
    electricMeterName?: boolean
    deviceNumber?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ammeter"]>

  export type AmmeterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    electricMeterNumber?: boolean
    electricMeterName?: boolean
    deviceNumber?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ammeter"]>

  export type AmmeterSelectScalar = {
    id?: boolean
    electricMeterNumber?: boolean
    electricMeterName?: boolean
    deviceNumber?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AmmeterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "electricMeterNumber" | "electricMeterName" | "deviceNumber" | "factory" | "device" | "voltage" | "currents" | "power" | "battery" | "switchState" | "networkState" | "lastUpdated" | "createdAt" | "updatedAt", ExtArgs["result"]["ammeter"]>

  export type $AmmeterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ammeter"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      electricMeterNumber: string
      electricMeterName: string
      deviceNumber: string
      factory: string | null
      device: string | null
      voltage: number | null
      currents: number | null
      power: number | null
      battery: number | null
      switchState: number | null
      networkState: number | null
      lastUpdated: Date | null
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["ammeter"]>
    composites: {}
  }

  type AmmeterGetPayload<S extends boolean | null | undefined | AmmeterDefaultArgs> = $Result.GetResult<Prisma.$AmmeterPayload, S>

  type AmmeterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmmeterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmmeterCountAggregateInputType | true
    }

  export interface AmmeterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ammeter'], meta: { name: 'Ammeter' } }
    /**
     * Find zero or one Ammeter that matches the filter.
     * @param {AmmeterFindUniqueArgs} args - Arguments to find a Ammeter
     * @example
     * // Get one Ammeter
     * const ammeter = await prisma.ammeter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmmeterFindUniqueArgs>(args: SelectSubset<T, AmmeterFindUniqueArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ammeter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmmeterFindUniqueOrThrowArgs} args - Arguments to find a Ammeter
     * @example
     * // Get one Ammeter
     * const ammeter = await prisma.ammeter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmmeterFindUniqueOrThrowArgs>(args: SelectSubset<T, AmmeterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ammeter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterFindFirstArgs} args - Arguments to find a Ammeter
     * @example
     * // Get one Ammeter
     * const ammeter = await prisma.ammeter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmmeterFindFirstArgs>(args?: SelectSubset<T, AmmeterFindFirstArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ammeter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterFindFirstOrThrowArgs} args - Arguments to find a Ammeter
     * @example
     * // Get one Ammeter
     * const ammeter = await prisma.ammeter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmmeterFindFirstOrThrowArgs>(args?: SelectSubset<T, AmmeterFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ammeters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ammeters
     * const ammeters = await prisma.ammeter.findMany()
     * 
     * // Get first 10 Ammeters
     * const ammeters = await prisma.ammeter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ammeterWithIdOnly = await prisma.ammeter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmmeterFindManyArgs>(args?: SelectSubset<T, AmmeterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ammeter.
     * @param {AmmeterCreateArgs} args - Arguments to create a Ammeter.
     * @example
     * // Create one Ammeter
     * const Ammeter = await prisma.ammeter.create({
     *   data: {
     *     // ... data to create a Ammeter
     *   }
     * })
     * 
     */
    create<T extends AmmeterCreateArgs>(args: SelectSubset<T, AmmeterCreateArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ammeters.
     * @param {AmmeterCreateManyArgs} args - Arguments to create many Ammeters.
     * @example
     * // Create many Ammeters
     * const ammeter = await prisma.ammeter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmmeterCreateManyArgs>(args?: SelectSubset<T, AmmeterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ammeters and returns the data saved in the database.
     * @param {AmmeterCreateManyAndReturnArgs} args - Arguments to create many Ammeters.
     * @example
     * // Create many Ammeters
     * const ammeter = await prisma.ammeter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ammeters and only return the `id`
     * const ammeterWithIdOnly = await prisma.ammeter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmmeterCreateManyAndReturnArgs>(args?: SelectSubset<T, AmmeterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ammeter.
     * @param {AmmeterDeleteArgs} args - Arguments to delete one Ammeter.
     * @example
     * // Delete one Ammeter
     * const Ammeter = await prisma.ammeter.delete({
     *   where: {
     *     // ... filter to delete one Ammeter
     *   }
     * })
     * 
     */
    delete<T extends AmmeterDeleteArgs>(args: SelectSubset<T, AmmeterDeleteArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ammeter.
     * @param {AmmeterUpdateArgs} args - Arguments to update one Ammeter.
     * @example
     * // Update one Ammeter
     * const ammeter = await prisma.ammeter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmmeterUpdateArgs>(args: SelectSubset<T, AmmeterUpdateArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ammeters.
     * @param {AmmeterDeleteManyArgs} args - Arguments to filter Ammeters to delete.
     * @example
     * // Delete a few Ammeters
     * const { count } = await prisma.ammeter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmmeterDeleteManyArgs>(args?: SelectSubset<T, AmmeterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ammeters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ammeters
     * const ammeter = await prisma.ammeter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmmeterUpdateManyArgs>(args: SelectSubset<T, AmmeterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ammeters and returns the data updated in the database.
     * @param {AmmeterUpdateManyAndReturnArgs} args - Arguments to update many Ammeters.
     * @example
     * // Update many Ammeters
     * const ammeter = await prisma.ammeter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ammeters and only return the `id`
     * const ammeterWithIdOnly = await prisma.ammeter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmmeterUpdateManyAndReturnArgs>(args: SelectSubset<T, AmmeterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ammeter.
     * @param {AmmeterUpsertArgs} args - Arguments to update or create a Ammeter.
     * @example
     * // Update or create a Ammeter
     * const ammeter = await prisma.ammeter.upsert({
     *   create: {
     *     // ... data to create a Ammeter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ammeter we want to update
     *   }
     * })
     */
    upsert<T extends AmmeterUpsertArgs>(args: SelectSubset<T, AmmeterUpsertArgs<ExtArgs>>): Prisma__AmmeterClient<$Result.GetResult<Prisma.$AmmeterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ammeters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterCountArgs} args - Arguments to filter Ammeters to count.
     * @example
     * // Count the number of Ammeters
     * const count = await prisma.ammeter.count({
     *   where: {
     *     // ... the filter for the Ammeters we want to count
     *   }
     * })
    **/
    count<T extends AmmeterCountArgs>(
      args?: Subset<T, AmmeterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmmeterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ammeter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmmeterAggregateArgs>(args: Subset<T, AmmeterAggregateArgs>): Prisma.PrismaPromise<GetAmmeterAggregateType<T>>

    /**
     * Group by Ammeter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmmeterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmmeterGroupByArgs['orderBy'] }
        : { orderBy?: AmmeterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmmeterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmmeterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ammeter model
   */
  readonly fields: AmmeterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ammeter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmmeterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ammeter model
   */
  interface AmmeterFieldRefs {
    readonly id: FieldRef<"Ammeter", 'String'>
    readonly electricMeterNumber: FieldRef<"Ammeter", 'String'>
    readonly electricMeterName: FieldRef<"Ammeter", 'String'>
    readonly deviceNumber: FieldRef<"Ammeter", 'String'>
    readonly factory: FieldRef<"Ammeter", 'String'>
    readonly device: FieldRef<"Ammeter", 'String'>
    readonly voltage: FieldRef<"Ammeter", 'Float'>
    readonly currents: FieldRef<"Ammeter", 'Float'>
    readonly power: FieldRef<"Ammeter", 'Float'>
    readonly battery: FieldRef<"Ammeter", 'Float'>
    readonly switchState: FieldRef<"Ammeter", 'Int'>
    readonly networkState: FieldRef<"Ammeter", 'Int'>
    readonly lastUpdated: FieldRef<"Ammeter", 'DateTime'>
    readonly createdAt: FieldRef<"Ammeter", 'DateTime'>
    readonly updatedAt: FieldRef<"Ammeter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ammeter findUnique
   */
  export type AmmeterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter, which Ammeter to fetch.
     */
    where: AmmeterWhereUniqueInput
  }

  /**
   * Ammeter findUniqueOrThrow
   */
  export type AmmeterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter, which Ammeter to fetch.
     */
    where: AmmeterWhereUniqueInput
  }

  /**
   * Ammeter findFirst
   */
  export type AmmeterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter, which Ammeter to fetch.
     */
    where?: AmmeterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ammeters to fetch.
     */
    orderBy?: AmmeterOrderByWithRelationInput | AmmeterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ammeters.
     */
    cursor?: AmmeterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ammeters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ammeters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ammeters.
     */
    distinct?: AmmeterScalarFieldEnum | AmmeterScalarFieldEnum[]
  }

  /**
   * Ammeter findFirstOrThrow
   */
  export type AmmeterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter, which Ammeter to fetch.
     */
    where?: AmmeterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ammeters to fetch.
     */
    orderBy?: AmmeterOrderByWithRelationInput | AmmeterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ammeters.
     */
    cursor?: AmmeterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ammeters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ammeters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ammeters.
     */
    distinct?: AmmeterScalarFieldEnum | AmmeterScalarFieldEnum[]
  }

  /**
   * Ammeter findMany
   */
  export type AmmeterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter, which Ammeters to fetch.
     */
    where?: AmmeterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ammeters to fetch.
     */
    orderBy?: AmmeterOrderByWithRelationInput | AmmeterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ammeters.
     */
    cursor?: AmmeterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ammeters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ammeters.
     */
    skip?: number
    distinct?: AmmeterScalarFieldEnum | AmmeterScalarFieldEnum[]
  }

  /**
   * Ammeter create
   */
  export type AmmeterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * The data needed to create a Ammeter.
     */
    data: XOR<AmmeterCreateInput, AmmeterUncheckedCreateInput>
  }

  /**
   * Ammeter createMany
   */
  export type AmmeterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ammeters.
     */
    data: AmmeterCreateManyInput | AmmeterCreateManyInput[]
  }

  /**
   * Ammeter createManyAndReturn
   */
  export type AmmeterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * The data used to create many Ammeters.
     */
    data: AmmeterCreateManyInput | AmmeterCreateManyInput[]
  }

  /**
   * Ammeter update
   */
  export type AmmeterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * The data needed to update a Ammeter.
     */
    data: XOR<AmmeterUpdateInput, AmmeterUncheckedUpdateInput>
    /**
     * Choose, which Ammeter to update.
     */
    where: AmmeterWhereUniqueInput
  }

  /**
   * Ammeter updateMany
   */
  export type AmmeterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ammeters.
     */
    data: XOR<AmmeterUpdateManyMutationInput, AmmeterUncheckedUpdateManyInput>
    /**
     * Filter which Ammeters to update
     */
    where?: AmmeterWhereInput
    /**
     * Limit how many Ammeters to update.
     */
    limit?: number
  }

  /**
   * Ammeter updateManyAndReturn
   */
  export type AmmeterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * The data used to update Ammeters.
     */
    data: XOR<AmmeterUpdateManyMutationInput, AmmeterUncheckedUpdateManyInput>
    /**
     * Filter which Ammeters to update
     */
    where?: AmmeterWhereInput
    /**
     * Limit how many Ammeters to update.
     */
    limit?: number
  }

  /**
   * Ammeter upsert
   */
  export type AmmeterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * The filter to search for the Ammeter to update in case it exists.
     */
    where: AmmeterWhereUniqueInput
    /**
     * In case the Ammeter found by the `where` argument doesn't exist, create a new Ammeter with this data.
     */
    create: XOR<AmmeterCreateInput, AmmeterUncheckedCreateInput>
    /**
     * In case the Ammeter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmmeterUpdateInput, AmmeterUncheckedUpdateInput>
  }

  /**
   * Ammeter delete
   */
  export type AmmeterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
    /**
     * Filter which Ammeter to delete.
     */
    where: AmmeterWhereUniqueInput
  }

  /**
   * Ammeter deleteMany
   */
  export type AmmeterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ammeters to delete
     */
    where?: AmmeterWhereInput
    /**
     * Limit how many Ammeters to delete.
     */
    limit?: number
  }

  /**
   * Ammeter without action
   */
  export type AmmeterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ammeter
     */
    select?: AmmeterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ammeter
     */
    omit?: AmmeterOmit<ExtArgs> | null
  }


  /**
   * Model AmmeterLog
   */

  export type AggregateAmmeterLog = {
    _count: AmmeterLogCountAggregateOutputType | null
    _avg: AmmeterLogAvgAggregateOutputType | null
    _sum: AmmeterLogSumAggregateOutputType | null
    _min: AmmeterLogMinAggregateOutputType | null
    _max: AmmeterLogMaxAggregateOutputType | null
  }

  export type AmmeterLogAvgAggregateOutputType = {
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    statusCode: number | null
    responseTime: number | null
  }

  export type AmmeterLogSumAggregateOutputType = {
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    statusCode: number | null
    responseTime: number | null
  }

  export type AmmeterLogMinAggregateOutputType = {
    id: string | null
    deviceNumber: string | null
    action: string | null
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    requestData: string | null
    responseData: string | null
    statusCode: number | null
    success: boolean | null
    errorMessage: string | null
    responseTime: number | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type AmmeterLogMaxAggregateOutputType = {
    id: string | null
    deviceNumber: string | null
    action: string | null
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    requestData: string | null
    responseData: string | null
    statusCode: number | null
    success: boolean | null
    errorMessage: string | null
    responseTime: number | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type AmmeterLogCountAggregateOutputType = {
    id: number
    deviceNumber: number
    action: number
    factory: number
    device: number
    voltage: number
    currents: number
    power: number
    battery: number
    switchState: number
    networkState: number
    lastUpdated: number
    requestData: number
    responseData: number
    statusCode: number
    success: number
    errorMessage: number
    responseTime: number
    ipAddress: number
    userAgent: number
    userId: number
    createdAt: number
    _all: number
  }


  export type AmmeterLogAvgAggregateInputType = {
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    statusCode?: true
    responseTime?: true
  }

  export type AmmeterLogSumAggregateInputType = {
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    statusCode?: true
    responseTime?: true
  }

  export type AmmeterLogMinAggregateInputType = {
    id?: true
    deviceNumber?: true
    action?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    requestData?: true
    responseData?: true
    statusCode?: true
    success?: true
    errorMessage?: true
    responseTime?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
  }

  export type AmmeterLogMaxAggregateInputType = {
    id?: true
    deviceNumber?: true
    action?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    requestData?: true
    responseData?: true
    statusCode?: true
    success?: true
    errorMessage?: true
    responseTime?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
  }

  export type AmmeterLogCountAggregateInputType = {
    id?: true
    deviceNumber?: true
    action?: true
    factory?: true
    device?: true
    voltage?: true
    currents?: true
    power?: true
    battery?: true
    switchState?: true
    networkState?: true
    lastUpdated?: true
    requestData?: true
    responseData?: true
    statusCode?: true
    success?: true
    errorMessage?: true
    responseTime?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type AmmeterLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmmeterLog to aggregate.
     */
    where?: AmmeterLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmmeterLogs to fetch.
     */
    orderBy?: AmmeterLogOrderByWithRelationInput | AmmeterLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AmmeterLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmmeterLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmmeterLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AmmeterLogs
    **/
    _count?: true | AmmeterLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AmmeterLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AmmeterLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AmmeterLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AmmeterLogMaxAggregateInputType
  }

  export type GetAmmeterLogAggregateType<T extends AmmeterLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAmmeterLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAmmeterLog[P]>
      : GetScalarType<T[P], AggregateAmmeterLog[P]>
  }




  export type AmmeterLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AmmeterLogWhereInput
    orderBy?: AmmeterLogOrderByWithAggregationInput | AmmeterLogOrderByWithAggregationInput[]
    by: AmmeterLogScalarFieldEnum[] | AmmeterLogScalarFieldEnum
    having?: AmmeterLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AmmeterLogCountAggregateInputType | true
    _avg?: AmmeterLogAvgAggregateInputType
    _sum?: AmmeterLogSumAggregateInputType
    _min?: AmmeterLogMinAggregateInputType
    _max?: AmmeterLogMaxAggregateInputType
  }

  export type AmmeterLogGroupByOutputType = {
    id: string
    deviceNumber: string
    action: string
    factory: string | null
    device: string | null
    voltage: number | null
    currents: number | null
    power: number | null
    battery: number | null
    switchState: number | null
    networkState: number | null
    lastUpdated: Date | null
    requestData: string | null
    responseData: string | null
    statusCode: number | null
    success: boolean
    errorMessage: string | null
    responseTime: number | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
    _count: AmmeterLogCountAggregateOutputType | null
    _avg: AmmeterLogAvgAggregateOutputType | null
    _sum: AmmeterLogSumAggregateOutputType | null
    _min: AmmeterLogMinAggregateOutputType | null
    _max: AmmeterLogMaxAggregateOutputType | null
  }

  type GetAmmeterLogGroupByPayload<T extends AmmeterLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AmmeterLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AmmeterLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AmmeterLogGroupByOutputType[P]>
            : GetScalarType<T[P], AmmeterLogGroupByOutputType[P]>
        }
      >
    >


  export type AmmeterLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceNumber?: boolean
    action?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    requestData?: boolean
    responseData?: boolean
    statusCode?: boolean
    success?: boolean
    errorMessage?: boolean
    responseTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ammeterLog"]>

  export type AmmeterLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceNumber?: boolean
    action?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    requestData?: boolean
    responseData?: boolean
    statusCode?: boolean
    success?: boolean
    errorMessage?: boolean
    responseTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ammeterLog"]>

  export type AmmeterLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceNumber?: boolean
    action?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    requestData?: boolean
    responseData?: boolean
    statusCode?: boolean
    success?: boolean
    errorMessage?: boolean
    responseTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ammeterLog"]>

  export type AmmeterLogSelectScalar = {
    id?: boolean
    deviceNumber?: boolean
    action?: boolean
    factory?: boolean
    device?: boolean
    voltage?: boolean
    currents?: boolean
    power?: boolean
    battery?: boolean
    switchState?: boolean
    networkState?: boolean
    lastUpdated?: boolean
    requestData?: boolean
    responseData?: boolean
    statusCode?: boolean
    success?: boolean
    errorMessage?: boolean
    responseTime?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type AmmeterLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deviceNumber" | "action" | "factory" | "device" | "voltage" | "currents" | "power" | "battery" | "switchState" | "networkState" | "lastUpdated" | "requestData" | "responseData" | "statusCode" | "success" | "errorMessage" | "responseTime" | "ipAddress" | "userAgent" | "userId" | "createdAt", ExtArgs["result"]["ammeterLog"]>

  export type $AmmeterLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AmmeterLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deviceNumber: string
      action: string
      factory: string | null
      device: string | null
      voltage: number | null
      currents: number | null
      power: number | null
      battery: number | null
      switchState: number | null
      networkState: number | null
      lastUpdated: Date | null
      requestData: string | null
      responseData: string | null
      statusCode: number | null
      success: boolean
      errorMessage: string | null
      responseTime: number | null
      ipAddress: string | null
      userAgent: string | null
      userId: string | null
      createdAt: Date | null
    }, ExtArgs["result"]["ammeterLog"]>
    composites: {}
  }

  type AmmeterLogGetPayload<S extends boolean | null | undefined | AmmeterLogDefaultArgs> = $Result.GetResult<Prisma.$AmmeterLogPayload, S>

  type AmmeterLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AmmeterLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AmmeterLogCountAggregateInputType | true
    }

  export interface AmmeterLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AmmeterLog'], meta: { name: 'AmmeterLog' } }
    /**
     * Find zero or one AmmeterLog that matches the filter.
     * @param {AmmeterLogFindUniqueArgs} args - Arguments to find a AmmeterLog
     * @example
     * // Get one AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AmmeterLogFindUniqueArgs>(args: SelectSubset<T, AmmeterLogFindUniqueArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AmmeterLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AmmeterLogFindUniqueOrThrowArgs} args - Arguments to find a AmmeterLog
     * @example
     * // Get one AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AmmeterLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AmmeterLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmmeterLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogFindFirstArgs} args - Arguments to find a AmmeterLog
     * @example
     * // Get one AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AmmeterLogFindFirstArgs>(args?: SelectSubset<T, AmmeterLogFindFirstArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AmmeterLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogFindFirstOrThrowArgs} args - Arguments to find a AmmeterLog
     * @example
     * // Get one AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AmmeterLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AmmeterLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AmmeterLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AmmeterLogs
     * const ammeterLogs = await prisma.ammeterLog.findMany()
     * 
     * // Get first 10 AmmeterLogs
     * const ammeterLogs = await prisma.ammeterLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ammeterLogWithIdOnly = await prisma.ammeterLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AmmeterLogFindManyArgs>(args?: SelectSubset<T, AmmeterLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AmmeterLog.
     * @param {AmmeterLogCreateArgs} args - Arguments to create a AmmeterLog.
     * @example
     * // Create one AmmeterLog
     * const AmmeterLog = await prisma.ammeterLog.create({
     *   data: {
     *     // ... data to create a AmmeterLog
     *   }
     * })
     * 
     */
    create<T extends AmmeterLogCreateArgs>(args: SelectSubset<T, AmmeterLogCreateArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AmmeterLogs.
     * @param {AmmeterLogCreateManyArgs} args - Arguments to create many AmmeterLogs.
     * @example
     * // Create many AmmeterLogs
     * const ammeterLog = await prisma.ammeterLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AmmeterLogCreateManyArgs>(args?: SelectSubset<T, AmmeterLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AmmeterLogs and returns the data saved in the database.
     * @param {AmmeterLogCreateManyAndReturnArgs} args - Arguments to create many AmmeterLogs.
     * @example
     * // Create many AmmeterLogs
     * const ammeterLog = await prisma.ammeterLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AmmeterLogs and only return the `id`
     * const ammeterLogWithIdOnly = await prisma.ammeterLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AmmeterLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AmmeterLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AmmeterLog.
     * @param {AmmeterLogDeleteArgs} args - Arguments to delete one AmmeterLog.
     * @example
     * // Delete one AmmeterLog
     * const AmmeterLog = await prisma.ammeterLog.delete({
     *   where: {
     *     // ... filter to delete one AmmeterLog
     *   }
     * })
     * 
     */
    delete<T extends AmmeterLogDeleteArgs>(args: SelectSubset<T, AmmeterLogDeleteArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AmmeterLog.
     * @param {AmmeterLogUpdateArgs} args - Arguments to update one AmmeterLog.
     * @example
     * // Update one AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AmmeterLogUpdateArgs>(args: SelectSubset<T, AmmeterLogUpdateArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AmmeterLogs.
     * @param {AmmeterLogDeleteManyArgs} args - Arguments to filter AmmeterLogs to delete.
     * @example
     * // Delete a few AmmeterLogs
     * const { count } = await prisma.ammeterLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AmmeterLogDeleteManyArgs>(args?: SelectSubset<T, AmmeterLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmmeterLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AmmeterLogs
     * const ammeterLog = await prisma.ammeterLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AmmeterLogUpdateManyArgs>(args: SelectSubset<T, AmmeterLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AmmeterLogs and returns the data updated in the database.
     * @param {AmmeterLogUpdateManyAndReturnArgs} args - Arguments to update many AmmeterLogs.
     * @example
     * // Update many AmmeterLogs
     * const ammeterLog = await prisma.ammeterLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AmmeterLogs and only return the `id`
     * const ammeterLogWithIdOnly = await prisma.ammeterLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AmmeterLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AmmeterLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AmmeterLog.
     * @param {AmmeterLogUpsertArgs} args - Arguments to update or create a AmmeterLog.
     * @example
     * // Update or create a AmmeterLog
     * const ammeterLog = await prisma.ammeterLog.upsert({
     *   create: {
     *     // ... data to create a AmmeterLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AmmeterLog we want to update
     *   }
     * })
     */
    upsert<T extends AmmeterLogUpsertArgs>(args: SelectSubset<T, AmmeterLogUpsertArgs<ExtArgs>>): Prisma__AmmeterLogClient<$Result.GetResult<Prisma.$AmmeterLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AmmeterLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogCountArgs} args - Arguments to filter AmmeterLogs to count.
     * @example
     * // Count the number of AmmeterLogs
     * const count = await prisma.ammeterLog.count({
     *   where: {
     *     // ... the filter for the AmmeterLogs we want to count
     *   }
     * })
    **/
    count<T extends AmmeterLogCountArgs>(
      args?: Subset<T, AmmeterLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AmmeterLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AmmeterLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AmmeterLogAggregateArgs>(args: Subset<T, AmmeterLogAggregateArgs>): Prisma.PrismaPromise<GetAmmeterLogAggregateType<T>>

    /**
     * Group by AmmeterLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AmmeterLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AmmeterLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AmmeterLogGroupByArgs['orderBy'] }
        : { orderBy?: AmmeterLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AmmeterLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAmmeterLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AmmeterLog model
   */
  readonly fields: AmmeterLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AmmeterLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AmmeterLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AmmeterLog model
   */
  interface AmmeterLogFieldRefs {
    readonly id: FieldRef<"AmmeterLog", 'String'>
    readonly deviceNumber: FieldRef<"AmmeterLog", 'String'>
    readonly action: FieldRef<"AmmeterLog", 'String'>
    readonly factory: FieldRef<"AmmeterLog", 'String'>
    readonly device: FieldRef<"AmmeterLog", 'String'>
    readonly voltage: FieldRef<"AmmeterLog", 'Float'>
    readonly currents: FieldRef<"AmmeterLog", 'Float'>
    readonly power: FieldRef<"AmmeterLog", 'Float'>
    readonly battery: FieldRef<"AmmeterLog", 'Float'>
    readonly switchState: FieldRef<"AmmeterLog", 'Int'>
    readonly networkState: FieldRef<"AmmeterLog", 'Int'>
    readonly lastUpdated: FieldRef<"AmmeterLog", 'DateTime'>
    readonly requestData: FieldRef<"AmmeterLog", 'String'>
    readonly responseData: FieldRef<"AmmeterLog", 'String'>
    readonly statusCode: FieldRef<"AmmeterLog", 'Int'>
    readonly success: FieldRef<"AmmeterLog", 'Boolean'>
    readonly errorMessage: FieldRef<"AmmeterLog", 'String'>
    readonly responseTime: FieldRef<"AmmeterLog", 'Int'>
    readonly ipAddress: FieldRef<"AmmeterLog", 'String'>
    readonly userAgent: FieldRef<"AmmeterLog", 'String'>
    readonly userId: FieldRef<"AmmeterLog", 'String'>
    readonly createdAt: FieldRef<"AmmeterLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AmmeterLog findUnique
   */
  export type AmmeterLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter, which AmmeterLog to fetch.
     */
    where: AmmeterLogWhereUniqueInput
  }

  /**
   * AmmeterLog findUniqueOrThrow
   */
  export type AmmeterLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter, which AmmeterLog to fetch.
     */
    where: AmmeterLogWhereUniqueInput
  }

  /**
   * AmmeterLog findFirst
   */
  export type AmmeterLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter, which AmmeterLog to fetch.
     */
    where?: AmmeterLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmmeterLogs to fetch.
     */
    orderBy?: AmmeterLogOrderByWithRelationInput | AmmeterLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmmeterLogs.
     */
    cursor?: AmmeterLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmmeterLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmmeterLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmmeterLogs.
     */
    distinct?: AmmeterLogScalarFieldEnum | AmmeterLogScalarFieldEnum[]
  }

  /**
   * AmmeterLog findFirstOrThrow
   */
  export type AmmeterLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter, which AmmeterLog to fetch.
     */
    where?: AmmeterLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmmeterLogs to fetch.
     */
    orderBy?: AmmeterLogOrderByWithRelationInput | AmmeterLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AmmeterLogs.
     */
    cursor?: AmmeterLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmmeterLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmmeterLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AmmeterLogs.
     */
    distinct?: AmmeterLogScalarFieldEnum | AmmeterLogScalarFieldEnum[]
  }

  /**
   * AmmeterLog findMany
   */
  export type AmmeterLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter, which AmmeterLogs to fetch.
     */
    where?: AmmeterLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AmmeterLogs to fetch.
     */
    orderBy?: AmmeterLogOrderByWithRelationInput | AmmeterLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AmmeterLogs.
     */
    cursor?: AmmeterLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AmmeterLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AmmeterLogs.
     */
    skip?: number
    distinct?: AmmeterLogScalarFieldEnum | AmmeterLogScalarFieldEnum[]
  }

  /**
   * AmmeterLog create
   */
  export type AmmeterLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AmmeterLog.
     */
    data: XOR<AmmeterLogCreateInput, AmmeterLogUncheckedCreateInput>
  }

  /**
   * AmmeterLog createMany
   */
  export type AmmeterLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AmmeterLogs.
     */
    data: AmmeterLogCreateManyInput | AmmeterLogCreateManyInput[]
  }

  /**
   * AmmeterLog createManyAndReturn
   */
  export type AmmeterLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * The data used to create many AmmeterLogs.
     */
    data: AmmeterLogCreateManyInput | AmmeterLogCreateManyInput[]
  }

  /**
   * AmmeterLog update
   */
  export type AmmeterLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AmmeterLog.
     */
    data: XOR<AmmeterLogUpdateInput, AmmeterLogUncheckedUpdateInput>
    /**
     * Choose, which AmmeterLog to update.
     */
    where: AmmeterLogWhereUniqueInput
  }

  /**
   * AmmeterLog updateMany
   */
  export type AmmeterLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AmmeterLogs.
     */
    data: XOR<AmmeterLogUpdateManyMutationInput, AmmeterLogUncheckedUpdateManyInput>
    /**
     * Filter which AmmeterLogs to update
     */
    where?: AmmeterLogWhereInput
    /**
     * Limit how many AmmeterLogs to update.
     */
    limit?: number
  }

  /**
   * AmmeterLog updateManyAndReturn
   */
  export type AmmeterLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * The data used to update AmmeterLogs.
     */
    data: XOR<AmmeterLogUpdateManyMutationInput, AmmeterLogUncheckedUpdateManyInput>
    /**
     * Filter which AmmeterLogs to update
     */
    where?: AmmeterLogWhereInput
    /**
     * Limit how many AmmeterLogs to update.
     */
    limit?: number
  }

  /**
   * AmmeterLog upsert
   */
  export type AmmeterLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AmmeterLog to update in case it exists.
     */
    where: AmmeterLogWhereUniqueInput
    /**
     * In case the AmmeterLog found by the `where` argument doesn't exist, create a new AmmeterLog with this data.
     */
    create: XOR<AmmeterLogCreateInput, AmmeterLogUncheckedCreateInput>
    /**
     * In case the AmmeterLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AmmeterLogUpdateInput, AmmeterLogUncheckedUpdateInput>
  }

  /**
   * AmmeterLog delete
   */
  export type AmmeterLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
    /**
     * Filter which AmmeterLog to delete.
     */
    where: AmmeterLogWhereUniqueInput
  }

  /**
   * AmmeterLog deleteMany
   */
  export type AmmeterLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AmmeterLogs to delete
     */
    where?: AmmeterLogWhereInput
    /**
     * Limit how many AmmeterLogs to delete.
     */
    limit?: number
  }

  /**
   * AmmeterLog without action
   */
  export type AmmeterLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AmmeterLog
     */
    select?: AmmeterLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AmmeterLog
     */
    omit?: AmmeterLogOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AnalysisDatasetScalarFieldEnum: {
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

  export type AnalysisDatasetScalarFieldEnum = (typeof AnalysisDatasetScalarFieldEnum)[keyof typeof AnalysisDatasetScalarFieldEnum]


  export const AnalysisReadyDataScalarFieldEnum: {
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

  export type AnalysisReadyDataScalarFieldEnum = (typeof AnalysisReadyDataScalarFieldEnum)[keyof typeof AnalysisReadyDataScalarFieldEnum]


  export const ExperimentRunScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    filteringParameters: 'filteringParameters',
    status: 'status',
    candidateCount: 'candidateCount',
    positiveLabelCount: 'positiveLabelCount',
    negativeLabelCount: 'negativeLabelCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    candidateStats: 'candidateStats'
  };

  export type ExperimentRunScalarFieldEnum = (typeof ExperimentRunScalarFieldEnum)[keyof typeof ExperimentRunScalarFieldEnum]


  export const AnomalyEventScalarFieldEnum: {
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

  export type AnomalyEventScalarFieldEnum = (typeof AnomalyEventScalarFieldEnum)[keyof typeof AnomalyEventScalarFieldEnum]


  export const AnomalyLabelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AnomalyLabelScalarFieldEnum = (typeof AnomalyLabelScalarFieldEnum)[keyof typeof AnomalyLabelScalarFieldEnum]


  export const EventLabelLinkScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    labelId: 'labelId',
    createdAt: 'createdAt'
  };

  export type EventLabelLinkScalarFieldEnum = (typeof EventLabelLinkScalarFieldEnum)[keyof typeof EventLabelLinkScalarFieldEnum]


  export const TrainedModelScalarFieldEnum: {
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
    createdAt: 'createdAt',
    startedAt: 'startedAt',
    completedAt: 'completedAt'
  };

  export type TrainedModelScalarFieldEnum = (typeof TrainedModelScalarFieldEnum)[keyof typeof TrainedModelScalarFieldEnum]


  export const EvaluationRunScalarFieldEnum: {
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

  export type EvaluationRunScalarFieldEnum = (typeof EvaluationRunScalarFieldEnum)[keyof typeof EvaluationRunScalarFieldEnum]


  export const ModelPredictionScalarFieldEnum: {
    id: 'id',
    evaluationRunId: 'evaluationRunId',
    timestamp: 'timestamp',
    predictionScore: 'predictionScore',
    groundTruth: 'groundTruth'
  };

  export type ModelPredictionScalarFieldEnum = (typeof ModelPredictionScalarFieldEnum)[keyof typeof ModelPredictionScalarFieldEnum]


  export const AmmeterScalarFieldEnum: {
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

  export type AmmeterScalarFieldEnum = (typeof AmmeterScalarFieldEnum)[keyof typeof AmmeterScalarFieldEnum]


  export const AmmeterLogScalarFieldEnum: {
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

  export type AmmeterLogScalarFieldEnum = (typeof AmmeterLogScalarFieldEnum)[keyof typeof AmmeterLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AnalysisDatasetWhereInput = {
    AND?: AnalysisDatasetWhereInput | AnalysisDatasetWhereInput[]
    OR?: AnalysisDatasetWhereInput[]
    NOT?: AnalysisDatasetWhereInput | AnalysisDatasetWhereInput[]
    id?: StringFilter<"AnalysisDataset"> | string
    name?: StringFilter<"AnalysisDataset"> | string
    description?: StringNullableFilter<"AnalysisDataset"> | string | null
    building?: StringFilter<"AnalysisDataset"> | string
    floor?: StringFilter<"AnalysisDataset"> | string
    room?: StringFilter<"AnalysisDataset"> | string
    startDate?: DateTimeFilter<"AnalysisDataset"> | Date | string
    endDate?: DateTimeFilter<"AnalysisDataset"> | Date | string
    occupantType?: StringFilter<"AnalysisDataset"> | string
    meterIdL1?: StringFilter<"AnalysisDataset"> | string
    meterIdL2?: StringFilter<"AnalysisDataset"> | string
    totalRecords?: IntFilter<"AnalysisDataset"> | number
    positiveLabels?: IntFilter<"AnalysisDataset"> | number
    createdAt?: DateTimeFilter<"AnalysisDataset"> | Date | string
    analysisData?: AnalysisReadyDataListRelationFilter
    anomalyEvents?: AnomalyEventListRelationFilter
  }

  export type AnalysisDatasetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    building?: SortOrder
    floor?: SortOrder
    room?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    occupantType?: SortOrder
    meterIdL1?: SortOrder
    meterIdL2?: SortOrder
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
    createdAt?: SortOrder
    analysisData?: AnalysisReadyDataOrderByRelationAggregateInput
    anomalyEvents?: AnomalyEventOrderByRelationAggregateInput
  }

  export type AnalysisDatasetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AnalysisDatasetWhereInput | AnalysisDatasetWhereInput[]
    OR?: AnalysisDatasetWhereInput[]
    NOT?: AnalysisDatasetWhereInput | AnalysisDatasetWhereInput[]
    description?: StringNullableFilter<"AnalysisDataset"> | string | null
    building?: StringFilter<"AnalysisDataset"> | string
    floor?: StringFilter<"AnalysisDataset"> | string
    room?: StringFilter<"AnalysisDataset"> | string
    startDate?: DateTimeFilter<"AnalysisDataset"> | Date | string
    endDate?: DateTimeFilter<"AnalysisDataset"> | Date | string
    occupantType?: StringFilter<"AnalysisDataset"> | string
    meterIdL1?: StringFilter<"AnalysisDataset"> | string
    meterIdL2?: StringFilter<"AnalysisDataset"> | string
    totalRecords?: IntFilter<"AnalysisDataset"> | number
    positiveLabels?: IntFilter<"AnalysisDataset"> | number
    createdAt?: DateTimeFilter<"AnalysisDataset"> | Date | string
    analysisData?: AnalysisReadyDataListRelationFilter
    anomalyEvents?: AnomalyEventListRelationFilter
  }, "id" | "name">

  export type AnalysisDatasetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    building?: SortOrder
    floor?: SortOrder
    room?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    occupantType?: SortOrder
    meterIdL1?: SortOrder
    meterIdL2?: SortOrder
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
    createdAt?: SortOrder
    _count?: AnalysisDatasetCountOrderByAggregateInput
    _avg?: AnalysisDatasetAvgOrderByAggregateInput
    _max?: AnalysisDatasetMaxOrderByAggregateInput
    _min?: AnalysisDatasetMinOrderByAggregateInput
    _sum?: AnalysisDatasetSumOrderByAggregateInput
  }

  export type AnalysisDatasetScalarWhereWithAggregatesInput = {
    AND?: AnalysisDatasetScalarWhereWithAggregatesInput | AnalysisDatasetScalarWhereWithAggregatesInput[]
    OR?: AnalysisDatasetScalarWhereWithAggregatesInput[]
    NOT?: AnalysisDatasetScalarWhereWithAggregatesInput | AnalysisDatasetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    name?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    description?: StringNullableWithAggregatesFilter<"AnalysisDataset"> | string | null
    building?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    floor?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    room?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    startDate?: DateTimeWithAggregatesFilter<"AnalysisDataset"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"AnalysisDataset"> | Date | string
    occupantType?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    meterIdL1?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    meterIdL2?: StringWithAggregatesFilter<"AnalysisDataset"> | string
    totalRecords?: IntWithAggregatesFilter<"AnalysisDataset"> | number
    positiveLabels?: IntWithAggregatesFilter<"AnalysisDataset"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisDataset"> | Date | string
  }

  export type AnalysisReadyDataWhereInput = {
    AND?: AnalysisReadyDataWhereInput | AnalysisReadyDataWhereInput[]
    OR?: AnalysisReadyDataWhereInput[]
    NOT?: AnalysisReadyDataWhereInput | AnalysisReadyDataWhereInput[]
    id?: StringFilter<"AnalysisReadyData"> | string
    datasetId?: StringFilter<"AnalysisReadyData"> | string
    timestamp?: DateTimeFilter<"AnalysisReadyData"> | Date | string
    room?: StringFilter<"AnalysisReadyData"> | string
    rawWattageL1?: FloatFilter<"AnalysisReadyData"> | number
    rawWattageL2?: FloatFilter<"AnalysisReadyData"> | number
    wattage110v?: FloatFilter<"AnalysisReadyData"> | number
    wattage220v?: FloatFilter<"AnalysisReadyData"> | number
    wattageTotal?: FloatFilter<"AnalysisReadyData"> | number
    isPositiveLabel?: BoolFilter<"AnalysisReadyData"> | boolean
    sourceAnomalyEventId?: StringNullableFilter<"AnalysisReadyData"> | string | null
    dataset?: XOR<AnalysisDatasetScalarRelationFilter, AnalysisDatasetWhereInput>
  }

  export type AnalysisReadyDataOrderByWithRelationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    timestamp?: SortOrder
    room?: SortOrder
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
    isPositiveLabel?: SortOrder
    sourceAnomalyEventId?: SortOrderInput | SortOrder
    dataset?: AnalysisDatasetOrderByWithRelationInput
  }

  export type AnalysisReadyDataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceAnomalyEventId?: string
    AND?: AnalysisReadyDataWhereInput | AnalysisReadyDataWhereInput[]
    OR?: AnalysisReadyDataWhereInput[]
    NOT?: AnalysisReadyDataWhereInput | AnalysisReadyDataWhereInput[]
    datasetId?: StringFilter<"AnalysisReadyData"> | string
    timestamp?: DateTimeFilter<"AnalysisReadyData"> | Date | string
    room?: StringFilter<"AnalysisReadyData"> | string
    rawWattageL1?: FloatFilter<"AnalysisReadyData"> | number
    rawWattageL2?: FloatFilter<"AnalysisReadyData"> | number
    wattage110v?: FloatFilter<"AnalysisReadyData"> | number
    wattage220v?: FloatFilter<"AnalysisReadyData"> | number
    wattageTotal?: FloatFilter<"AnalysisReadyData"> | number
    isPositiveLabel?: BoolFilter<"AnalysisReadyData"> | boolean
    dataset?: XOR<AnalysisDatasetScalarRelationFilter, AnalysisDatasetWhereInput>
  }, "id" | "sourceAnomalyEventId">

  export type AnalysisReadyDataOrderByWithAggregationInput = {
    id?: SortOrder
    datasetId?: SortOrder
    timestamp?: SortOrder
    room?: SortOrder
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
    isPositiveLabel?: SortOrder
    sourceAnomalyEventId?: SortOrderInput | SortOrder
    _count?: AnalysisReadyDataCountOrderByAggregateInput
    _avg?: AnalysisReadyDataAvgOrderByAggregateInput
    _max?: AnalysisReadyDataMaxOrderByAggregateInput
    _min?: AnalysisReadyDataMinOrderByAggregateInput
    _sum?: AnalysisReadyDataSumOrderByAggregateInput
  }

  export type AnalysisReadyDataScalarWhereWithAggregatesInput = {
    AND?: AnalysisReadyDataScalarWhereWithAggregatesInput | AnalysisReadyDataScalarWhereWithAggregatesInput[]
    OR?: AnalysisReadyDataScalarWhereWithAggregatesInput[]
    NOT?: AnalysisReadyDataScalarWhereWithAggregatesInput | AnalysisReadyDataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalysisReadyData"> | string
    datasetId?: StringWithAggregatesFilter<"AnalysisReadyData"> | string
    timestamp?: DateTimeWithAggregatesFilter<"AnalysisReadyData"> | Date | string
    room?: StringWithAggregatesFilter<"AnalysisReadyData"> | string
    rawWattageL1?: FloatWithAggregatesFilter<"AnalysisReadyData"> | number
    rawWattageL2?: FloatWithAggregatesFilter<"AnalysisReadyData"> | number
    wattage110v?: FloatWithAggregatesFilter<"AnalysisReadyData"> | number
    wattage220v?: FloatWithAggregatesFilter<"AnalysisReadyData"> | number
    wattageTotal?: FloatWithAggregatesFilter<"AnalysisReadyData"> | number
    isPositiveLabel?: BoolWithAggregatesFilter<"AnalysisReadyData"> | boolean
    sourceAnomalyEventId?: StringNullableWithAggregatesFilter<"AnalysisReadyData"> | string | null
  }

  export type ExperimentRunWhereInput = {
    AND?: ExperimentRunWhereInput | ExperimentRunWhereInput[]
    OR?: ExperimentRunWhereInput[]
    NOT?: ExperimentRunWhereInput | ExperimentRunWhereInput[]
    id?: StringFilter<"ExperimentRun"> | string
    name?: StringFilter<"ExperimentRun"> | string
    description?: StringNullableFilter<"ExperimentRun"> | string | null
    filteringParameters?: StringNullableFilter<"ExperimentRun"> | string | null
    status?: StringFilter<"ExperimentRun"> | string
    candidateCount?: IntNullableFilter<"ExperimentRun"> | number | null
    positiveLabelCount?: IntNullableFilter<"ExperimentRun"> | number | null
    negativeLabelCount?: IntNullableFilter<"ExperimentRun"> | number | null
    createdAt?: DateTimeFilter<"ExperimentRun"> | Date | string
    updatedAt?: DateTimeFilter<"ExperimentRun"> | Date | string
    candidateStats?: StringNullableFilter<"ExperimentRun"> | string | null
    anomalyEvents?: AnomalyEventListRelationFilter
    trainedModels?: TrainedModelListRelationFilter
  }

  export type ExperimentRunOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    filteringParameters?: SortOrderInput | SortOrder
    status?: SortOrder
    candidateCount?: SortOrderInput | SortOrder
    positiveLabelCount?: SortOrderInput | SortOrder
    negativeLabelCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candidateStats?: SortOrderInput | SortOrder
    anomalyEvents?: AnomalyEventOrderByRelationAggregateInput
    trainedModels?: TrainedModelOrderByRelationAggregateInput
  }

  export type ExperimentRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExperimentRunWhereInput | ExperimentRunWhereInput[]
    OR?: ExperimentRunWhereInput[]
    NOT?: ExperimentRunWhereInput | ExperimentRunWhereInput[]
    name?: StringFilter<"ExperimentRun"> | string
    description?: StringNullableFilter<"ExperimentRun"> | string | null
    filteringParameters?: StringNullableFilter<"ExperimentRun"> | string | null
    status?: StringFilter<"ExperimentRun"> | string
    candidateCount?: IntNullableFilter<"ExperimentRun"> | number | null
    positiveLabelCount?: IntNullableFilter<"ExperimentRun"> | number | null
    negativeLabelCount?: IntNullableFilter<"ExperimentRun"> | number | null
    createdAt?: DateTimeFilter<"ExperimentRun"> | Date | string
    updatedAt?: DateTimeFilter<"ExperimentRun"> | Date | string
    candidateStats?: StringNullableFilter<"ExperimentRun"> | string | null
    anomalyEvents?: AnomalyEventListRelationFilter
    trainedModels?: TrainedModelListRelationFilter
  }, "id">

  export type ExperimentRunOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    filteringParameters?: SortOrderInput | SortOrder
    status?: SortOrder
    candidateCount?: SortOrderInput | SortOrder
    positiveLabelCount?: SortOrderInput | SortOrder
    negativeLabelCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candidateStats?: SortOrderInput | SortOrder
    _count?: ExperimentRunCountOrderByAggregateInput
    _avg?: ExperimentRunAvgOrderByAggregateInput
    _max?: ExperimentRunMaxOrderByAggregateInput
    _min?: ExperimentRunMinOrderByAggregateInput
    _sum?: ExperimentRunSumOrderByAggregateInput
  }

  export type ExperimentRunScalarWhereWithAggregatesInput = {
    AND?: ExperimentRunScalarWhereWithAggregatesInput | ExperimentRunScalarWhereWithAggregatesInput[]
    OR?: ExperimentRunScalarWhereWithAggregatesInput[]
    NOT?: ExperimentRunScalarWhereWithAggregatesInput | ExperimentRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExperimentRun"> | string
    name?: StringWithAggregatesFilter<"ExperimentRun"> | string
    description?: StringNullableWithAggregatesFilter<"ExperimentRun"> | string | null
    filteringParameters?: StringNullableWithAggregatesFilter<"ExperimentRun"> | string | null
    status?: StringWithAggregatesFilter<"ExperimentRun"> | string
    candidateCount?: IntNullableWithAggregatesFilter<"ExperimentRun"> | number | null
    positiveLabelCount?: IntNullableWithAggregatesFilter<"ExperimentRun"> | number | null
    negativeLabelCount?: IntNullableWithAggregatesFilter<"ExperimentRun"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ExperimentRun"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExperimentRun"> | Date | string
    candidateStats?: StringNullableWithAggregatesFilter<"ExperimentRun"> | string | null
  }

  export type AnomalyEventWhereInput = {
    AND?: AnomalyEventWhereInput | AnomalyEventWhereInput[]
    OR?: AnomalyEventWhereInput[]
    NOT?: AnomalyEventWhereInput | AnomalyEventWhereInput[]
    id?: StringFilter<"AnomalyEvent"> | string
    eventId?: StringFilter<"AnomalyEvent"> | string
    name?: StringFilter<"AnomalyEvent"> | string
    datasetId?: StringFilter<"AnomalyEvent"> | string
    line?: StringFilter<"AnomalyEvent"> | string
    eventTimestamp?: DateTimeFilter<"AnomalyEvent"> | Date | string
    detectionRule?: StringFilter<"AnomalyEvent"> | string
    score?: FloatFilter<"AnomalyEvent"> | number
    dataWindow?: StringFilter<"AnomalyEvent"> | string
    status?: StringFilter<"AnomalyEvent"> | string
    reviewerId?: StringNullableFilter<"AnomalyEvent"> | string | null
    reviewTimestamp?: DateTimeNullableFilter<"AnomalyEvent"> | Date | string | null
    justificationNotes?: StringNullableFilter<"AnomalyEvent"> | string | null
    createdAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    updatedAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    experimentRunId?: StringNullableFilter<"AnomalyEvent"> | string | null
    dataset?: XOR<AnalysisDatasetScalarRelationFilter, AnalysisDatasetWhereInput>
    experimentRun?: XOR<ExperimentRunNullableScalarRelationFilter, ExperimentRunWhereInput> | null
    eventLabelLinks?: EventLabelLinkListRelationFilter
  }

  export type AnomalyEventOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    datasetId?: SortOrder
    line?: SortOrder
    eventTimestamp?: SortOrder
    detectionRule?: SortOrder
    score?: SortOrder
    dataWindow?: SortOrder
    status?: SortOrder
    reviewerId?: SortOrderInput | SortOrder
    reviewTimestamp?: SortOrderInput | SortOrder
    justificationNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    experimentRunId?: SortOrderInput | SortOrder
    dataset?: AnalysisDatasetOrderByWithRelationInput
    experimentRun?: ExperimentRunOrderByWithRelationInput
    eventLabelLinks?: EventLabelLinkOrderByRelationAggregateInput
  }

  export type AnomalyEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId?: string
    AND?: AnomalyEventWhereInput | AnomalyEventWhereInput[]
    OR?: AnomalyEventWhereInput[]
    NOT?: AnomalyEventWhereInput | AnomalyEventWhereInput[]
    name?: StringFilter<"AnomalyEvent"> | string
    datasetId?: StringFilter<"AnomalyEvent"> | string
    line?: StringFilter<"AnomalyEvent"> | string
    eventTimestamp?: DateTimeFilter<"AnomalyEvent"> | Date | string
    detectionRule?: StringFilter<"AnomalyEvent"> | string
    score?: FloatFilter<"AnomalyEvent"> | number
    dataWindow?: StringFilter<"AnomalyEvent"> | string
    status?: StringFilter<"AnomalyEvent"> | string
    reviewerId?: StringNullableFilter<"AnomalyEvent"> | string | null
    reviewTimestamp?: DateTimeNullableFilter<"AnomalyEvent"> | Date | string | null
    justificationNotes?: StringNullableFilter<"AnomalyEvent"> | string | null
    createdAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    updatedAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    experimentRunId?: StringNullableFilter<"AnomalyEvent"> | string | null
    dataset?: XOR<AnalysisDatasetScalarRelationFilter, AnalysisDatasetWhereInput>
    experimentRun?: XOR<ExperimentRunNullableScalarRelationFilter, ExperimentRunWhereInput> | null
    eventLabelLinks?: EventLabelLinkListRelationFilter
  }, "id" | "eventId">

  export type AnomalyEventOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    datasetId?: SortOrder
    line?: SortOrder
    eventTimestamp?: SortOrder
    detectionRule?: SortOrder
    score?: SortOrder
    dataWindow?: SortOrder
    status?: SortOrder
    reviewerId?: SortOrderInput | SortOrder
    reviewTimestamp?: SortOrderInput | SortOrder
    justificationNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    experimentRunId?: SortOrderInput | SortOrder
    _count?: AnomalyEventCountOrderByAggregateInput
    _avg?: AnomalyEventAvgOrderByAggregateInput
    _max?: AnomalyEventMaxOrderByAggregateInput
    _min?: AnomalyEventMinOrderByAggregateInput
    _sum?: AnomalyEventSumOrderByAggregateInput
  }

  export type AnomalyEventScalarWhereWithAggregatesInput = {
    AND?: AnomalyEventScalarWhereWithAggregatesInput | AnomalyEventScalarWhereWithAggregatesInput[]
    OR?: AnomalyEventScalarWhereWithAggregatesInput[]
    NOT?: AnomalyEventScalarWhereWithAggregatesInput | AnomalyEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    eventId?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    name?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    datasetId?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    line?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    eventTimestamp?: DateTimeWithAggregatesFilter<"AnomalyEvent"> | Date | string
    detectionRule?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    score?: FloatWithAggregatesFilter<"AnomalyEvent"> | number
    dataWindow?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    status?: StringWithAggregatesFilter<"AnomalyEvent"> | string
    reviewerId?: StringNullableWithAggregatesFilter<"AnomalyEvent"> | string | null
    reviewTimestamp?: DateTimeNullableWithAggregatesFilter<"AnomalyEvent"> | Date | string | null
    justificationNotes?: StringNullableWithAggregatesFilter<"AnomalyEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AnomalyEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AnomalyEvent"> | Date | string
    experimentRunId?: StringNullableWithAggregatesFilter<"AnomalyEvent"> | string | null
  }

  export type AnomalyLabelWhereInput = {
    AND?: AnomalyLabelWhereInput | AnomalyLabelWhereInput[]
    OR?: AnomalyLabelWhereInput[]
    NOT?: AnomalyLabelWhereInput | AnomalyLabelWhereInput[]
    id?: StringFilter<"AnomalyLabel"> | string
    name?: StringFilter<"AnomalyLabel"> | string
    description?: StringNullableFilter<"AnomalyLabel"> | string | null
    createdAt?: DateTimeFilter<"AnomalyLabel"> | Date | string
    updatedAt?: DateTimeFilter<"AnomalyLabel"> | Date | string
    eventLabelLinks?: EventLabelLinkListRelationFilter
  }

  export type AnomalyLabelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    eventLabelLinks?: EventLabelLinkOrderByRelationAggregateInput
  }

  export type AnomalyLabelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AnomalyLabelWhereInput | AnomalyLabelWhereInput[]
    OR?: AnomalyLabelWhereInput[]
    NOT?: AnomalyLabelWhereInput | AnomalyLabelWhereInput[]
    description?: StringNullableFilter<"AnomalyLabel"> | string | null
    createdAt?: DateTimeFilter<"AnomalyLabel"> | Date | string
    updatedAt?: DateTimeFilter<"AnomalyLabel"> | Date | string
    eventLabelLinks?: EventLabelLinkListRelationFilter
  }, "id" | "name">

  export type AnomalyLabelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AnomalyLabelCountOrderByAggregateInput
    _max?: AnomalyLabelMaxOrderByAggregateInput
    _min?: AnomalyLabelMinOrderByAggregateInput
  }

  export type AnomalyLabelScalarWhereWithAggregatesInput = {
    AND?: AnomalyLabelScalarWhereWithAggregatesInput | AnomalyLabelScalarWhereWithAggregatesInput[]
    OR?: AnomalyLabelScalarWhereWithAggregatesInput[]
    NOT?: AnomalyLabelScalarWhereWithAggregatesInput | AnomalyLabelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnomalyLabel"> | string
    name?: StringWithAggregatesFilter<"AnomalyLabel"> | string
    description?: StringNullableWithAggregatesFilter<"AnomalyLabel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AnomalyLabel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AnomalyLabel"> | Date | string
  }

  export type EventLabelLinkWhereInput = {
    AND?: EventLabelLinkWhereInput | EventLabelLinkWhereInput[]
    OR?: EventLabelLinkWhereInput[]
    NOT?: EventLabelLinkWhereInput | EventLabelLinkWhereInput[]
    id?: StringFilter<"EventLabelLink"> | string
    eventId?: StringFilter<"EventLabelLink"> | string
    labelId?: StringFilter<"EventLabelLink"> | string
    createdAt?: DateTimeFilter<"EventLabelLink"> | Date | string
    anomalyEvent?: XOR<AnomalyEventScalarRelationFilter, AnomalyEventWhereInput>
    anomalyLabel?: XOR<AnomalyLabelScalarRelationFilter, AnomalyLabelWhereInput>
  }

  export type EventLabelLinkOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    anomalyEvent?: AnomalyEventOrderByWithRelationInput
    anomalyLabel?: AnomalyLabelOrderByWithRelationInput
  }

  export type EventLabelLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId_labelId?: EventLabelLinkEventIdLabelIdCompoundUniqueInput
    AND?: EventLabelLinkWhereInput | EventLabelLinkWhereInput[]
    OR?: EventLabelLinkWhereInput[]
    NOT?: EventLabelLinkWhereInput | EventLabelLinkWhereInput[]
    eventId?: StringFilter<"EventLabelLink"> | string
    labelId?: StringFilter<"EventLabelLink"> | string
    createdAt?: DateTimeFilter<"EventLabelLink"> | Date | string
    anomalyEvent?: XOR<AnomalyEventScalarRelationFilter, AnomalyEventWhereInput>
    anomalyLabel?: XOR<AnomalyLabelScalarRelationFilter, AnomalyLabelWhereInput>
  }, "id" | "eventId_labelId">

  export type EventLabelLinkOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    _count?: EventLabelLinkCountOrderByAggregateInput
    _max?: EventLabelLinkMaxOrderByAggregateInput
    _min?: EventLabelLinkMinOrderByAggregateInput
  }

  export type EventLabelLinkScalarWhereWithAggregatesInput = {
    AND?: EventLabelLinkScalarWhereWithAggregatesInput | EventLabelLinkScalarWhereWithAggregatesInput[]
    OR?: EventLabelLinkScalarWhereWithAggregatesInput[]
    NOT?: EventLabelLinkScalarWhereWithAggregatesInput | EventLabelLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventLabelLink"> | string
    eventId?: StringWithAggregatesFilter<"EventLabelLink"> | string
    labelId?: StringWithAggregatesFilter<"EventLabelLink"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EventLabelLink"> | Date | string
  }

  export type TrainedModelWhereInput = {
    AND?: TrainedModelWhereInput | TrainedModelWhereInput[]
    OR?: TrainedModelWhereInput[]
    NOT?: TrainedModelWhereInput | TrainedModelWhereInput[]
    id?: StringFilter<"TrainedModel"> | string
    name?: StringFilter<"TrainedModel"> | string
    scenarioType?: StringFilter<"TrainedModel"> | string
    status?: StringFilter<"TrainedModel"> | string
    experimentRunId?: StringFilter<"TrainedModel"> | string
    modelConfig?: StringFilter<"TrainedModel"> | string
    dataSourceConfig?: StringFilter<"TrainedModel"> | string
    modelPath?: StringNullableFilter<"TrainedModel"> | string | null
    trainingMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    validationMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    trainingLogs?: StringNullableFilter<"TrainedModel"> | string | null
    jobId?: StringNullableFilter<"TrainedModel"> | string | null
    createdAt?: DateTimeFilter<"TrainedModel"> | Date | string
    startedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
    experimentRun?: XOR<ExperimentRunScalarRelationFilter, ExperimentRunWhereInput>
    evaluationRuns?: EvaluationRunListRelationFilter
  }

  export type TrainedModelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    experimentRunId?: SortOrder
    modelConfig?: SortOrder
    dataSourceConfig?: SortOrder
    modelPath?: SortOrderInput | SortOrder
    trainingMetrics?: SortOrderInput | SortOrder
    validationMetrics?: SortOrderInput | SortOrder
    trainingLogs?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    experimentRun?: ExperimentRunOrderByWithRelationInput
    evaluationRuns?: EvaluationRunOrderByRelationAggregateInput
  }

  export type TrainedModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrainedModelWhereInput | TrainedModelWhereInput[]
    OR?: TrainedModelWhereInput[]
    NOT?: TrainedModelWhereInput | TrainedModelWhereInput[]
    name?: StringFilter<"TrainedModel"> | string
    scenarioType?: StringFilter<"TrainedModel"> | string
    status?: StringFilter<"TrainedModel"> | string
    experimentRunId?: StringFilter<"TrainedModel"> | string
    modelConfig?: StringFilter<"TrainedModel"> | string
    dataSourceConfig?: StringFilter<"TrainedModel"> | string
    modelPath?: StringNullableFilter<"TrainedModel"> | string | null
    trainingMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    validationMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    trainingLogs?: StringNullableFilter<"TrainedModel"> | string | null
    jobId?: StringNullableFilter<"TrainedModel"> | string | null
    createdAt?: DateTimeFilter<"TrainedModel"> | Date | string
    startedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
    experimentRun?: XOR<ExperimentRunScalarRelationFilter, ExperimentRunWhereInput>
    evaluationRuns?: EvaluationRunListRelationFilter
  }, "id">

  export type TrainedModelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    experimentRunId?: SortOrder
    modelConfig?: SortOrder
    dataSourceConfig?: SortOrder
    modelPath?: SortOrderInput | SortOrder
    trainingMetrics?: SortOrderInput | SortOrder
    validationMetrics?: SortOrderInput | SortOrder
    trainingLogs?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: TrainedModelCountOrderByAggregateInput
    _max?: TrainedModelMaxOrderByAggregateInput
    _min?: TrainedModelMinOrderByAggregateInput
  }

  export type TrainedModelScalarWhereWithAggregatesInput = {
    AND?: TrainedModelScalarWhereWithAggregatesInput | TrainedModelScalarWhereWithAggregatesInput[]
    OR?: TrainedModelScalarWhereWithAggregatesInput[]
    NOT?: TrainedModelScalarWhereWithAggregatesInput | TrainedModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrainedModel"> | string
    name?: StringWithAggregatesFilter<"TrainedModel"> | string
    scenarioType?: StringWithAggregatesFilter<"TrainedModel"> | string
    status?: StringWithAggregatesFilter<"TrainedModel"> | string
    experimentRunId?: StringWithAggregatesFilter<"TrainedModel"> | string
    modelConfig?: StringWithAggregatesFilter<"TrainedModel"> | string
    dataSourceConfig?: StringWithAggregatesFilter<"TrainedModel"> | string
    modelPath?: StringNullableWithAggregatesFilter<"TrainedModel"> | string | null
    trainingMetrics?: StringNullableWithAggregatesFilter<"TrainedModel"> | string | null
    validationMetrics?: StringNullableWithAggregatesFilter<"TrainedModel"> | string | null
    trainingLogs?: StringNullableWithAggregatesFilter<"TrainedModel"> | string | null
    jobId?: StringNullableWithAggregatesFilter<"TrainedModel"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrainedModel"> | Date | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"TrainedModel"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"TrainedModel"> | Date | string | null
  }

  export type EvaluationRunWhereInput = {
    AND?: EvaluationRunWhereInput | EvaluationRunWhereInput[]
    OR?: EvaluationRunWhereInput[]
    NOT?: EvaluationRunWhereInput | EvaluationRunWhereInput[]
    id?: StringFilter<"EvaluationRun"> | string
    name?: StringFilter<"EvaluationRun"> | string
    scenarioType?: StringFilter<"EvaluationRun"> | string
    status?: StringFilter<"EvaluationRun"> | string
    trainedModelId?: StringFilter<"EvaluationRun"> | string
    testSetSource?: StringFilter<"EvaluationRun"> | string
    evaluationMetrics?: StringNullableFilter<"EvaluationRun"> | string | null
    jobId?: StringNullableFilter<"EvaluationRun"> | string | null
    createdAt?: DateTimeFilter<"EvaluationRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"EvaluationRun"> | Date | string | null
    trainedModel?: XOR<TrainedModelScalarRelationFilter, TrainedModelWhereInput>
    predictions?: ModelPredictionListRelationFilter
  }

  export type EvaluationRunOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    trainedModelId?: SortOrder
    testSetSource?: SortOrder
    evaluationMetrics?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    trainedModel?: TrainedModelOrderByWithRelationInput
    predictions?: ModelPredictionOrderByRelationAggregateInput
  }

  export type EvaluationRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EvaluationRunWhereInput | EvaluationRunWhereInput[]
    OR?: EvaluationRunWhereInput[]
    NOT?: EvaluationRunWhereInput | EvaluationRunWhereInput[]
    name?: StringFilter<"EvaluationRun"> | string
    scenarioType?: StringFilter<"EvaluationRun"> | string
    status?: StringFilter<"EvaluationRun"> | string
    trainedModelId?: StringFilter<"EvaluationRun"> | string
    testSetSource?: StringFilter<"EvaluationRun"> | string
    evaluationMetrics?: StringNullableFilter<"EvaluationRun"> | string | null
    jobId?: StringNullableFilter<"EvaluationRun"> | string | null
    createdAt?: DateTimeFilter<"EvaluationRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"EvaluationRun"> | Date | string | null
    trainedModel?: XOR<TrainedModelScalarRelationFilter, TrainedModelWhereInput>
    predictions?: ModelPredictionListRelationFilter
  }, "id">

  export type EvaluationRunOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    trainedModelId?: SortOrder
    testSetSource?: SortOrder
    evaluationMetrics?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: EvaluationRunCountOrderByAggregateInput
    _max?: EvaluationRunMaxOrderByAggregateInput
    _min?: EvaluationRunMinOrderByAggregateInput
  }

  export type EvaluationRunScalarWhereWithAggregatesInput = {
    AND?: EvaluationRunScalarWhereWithAggregatesInput | EvaluationRunScalarWhereWithAggregatesInput[]
    OR?: EvaluationRunScalarWhereWithAggregatesInput[]
    NOT?: EvaluationRunScalarWhereWithAggregatesInput | EvaluationRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EvaluationRun"> | string
    name?: StringWithAggregatesFilter<"EvaluationRun"> | string
    scenarioType?: StringWithAggregatesFilter<"EvaluationRun"> | string
    status?: StringWithAggregatesFilter<"EvaluationRun"> | string
    trainedModelId?: StringWithAggregatesFilter<"EvaluationRun"> | string
    testSetSource?: StringWithAggregatesFilter<"EvaluationRun"> | string
    evaluationMetrics?: StringNullableWithAggregatesFilter<"EvaluationRun"> | string | null
    jobId?: StringNullableWithAggregatesFilter<"EvaluationRun"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EvaluationRun"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"EvaluationRun"> | Date | string | null
  }

  export type ModelPredictionWhereInput = {
    AND?: ModelPredictionWhereInput | ModelPredictionWhereInput[]
    OR?: ModelPredictionWhereInput[]
    NOT?: ModelPredictionWhereInput | ModelPredictionWhereInput[]
    id?: StringFilter<"ModelPrediction"> | string
    evaluationRunId?: StringFilter<"ModelPrediction"> | string
    timestamp?: DateTimeFilter<"ModelPrediction"> | Date | string
    predictionScore?: FloatFilter<"ModelPrediction"> | number
    groundTruth?: IntNullableFilter<"ModelPrediction"> | number | null
    evaluationRun?: XOR<EvaluationRunScalarRelationFilter, EvaluationRunWhereInput>
  }

  export type ModelPredictionOrderByWithRelationInput = {
    id?: SortOrder
    evaluationRunId?: SortOrder
    timestamp?: SortOrder
    predictionScore?: SortOrder
    groundTruth?: SortOrderInput | SortOrder
    evaluationRun?: EvaluationRunOrderByWithRelationInput
  }

  export type ModelPredictionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ModelPredictionWhereInput | ModelPredictionWhereInput[]
    OR?: ModelPredictionWhereInput[]
    NOT?: ModelPredictionWhereInput | ModelPredictionWhereInput[]
    evaluationRunId?: StringFilter<"ModelPrediction"> | string
    timestamp?: DateTimeFilter<"ModelPrediction"> | Date | string
    predictionScore?: FloatFilter<"ModelPrediction"> | number
    groundTruth?: IntNullableFilter<"ModelPrediction"> | number | null
    evaluationRun?: XOR<EvaluationRunScalarRelationFilter, EvaluationRunWhereInput>
  }, "id">

  export type ModelPredictionOrderByWithAggregationInput = {
    id?: SortOrder
    evaluationRunId?: SortOrder
    timestamp?: SortOrder
    predictionScore?: SortOrder
    groundTruth?: SortOrderInput | SortOrder
    _count?: ModelPredictionCountOrderByAggregateInput
    _avg?: ModelPredictionAvgOrderByAggregateInput
    _max?: ModelPredictionMaxOrderByAggregateInput
    _min?: ModelPredictionMinOrderByAggregateInput
    _sum?: ModelPredictionSumOrderByAggregateInput
  }

  export type ModelPredictionScalarWhereWithAggregatesInput = {
    AND?: ModelPredictionScalarWhereWithAggregatesInput | ModelPredictionScalarWhereWithAggregatesInput[]
    OR?: ModelPredictionScalarWhereWithAggregatesInput[]
    NOT?: ModelPredictionScalarWhereWithAggregatesInput | ModelPredictionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ModelPrediction"> | string
    evaluationRunId?: StringWithAggregatesFilter<"ModelPrediction"> | string
    timestamp?: DateTimeWithAggregatesFilter<"ModelPrediction"> | Date | string
    predictionScore?: FloatWithAggregatesFilter<"ModelPrediction"> | number
    groundTruth?: IntNullableWithAggregatesFilter<"ModelPrediction"> | number | null
  }

  export type AmmeterWhereInput = {
    AND?: AmmeterWhereInput | AmmeterWhereInput[]
    OR?: AmmeterWhereInput[]
    NOT?: AmmeterWhereInput | AmmeterWhereInput[]
    id?: StringFilter<"Ammeter"> | string
    electricMeterNumber?: StringFilter<"Ammeter"> | string
    electricMeterName?: StringFilter<"Ammeter"> | string
    deviceNumber?: StringFilter<"Ammeter"> | string
    factory?: StringNullableFilter<"Ammeter"> | string | null
    device?: StringNullableFilter<"Ammeter"> | string | null
    voltage?: FloatNullableFilter<"Ammeter"> | number | null
    currents?: FloatNullableFilter<"Ammeter"> | number | null
    power?: FloatNullableFilter<"Ammeter"> | number | null
    battery?: FloatNullableFilter<"Ammeter"> | number | null
    switchState?: IntNullableFilter<"Ammeter"> | number | null
    networkState?: IntNullableFilter<"Ammeter"> | number | null
    lastUpdated?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
  }

  export type AmmeterOrderByWithRelationInput = {
    id?: SortOrder
    electricMeterNumber?: SortOrder
    electricMeterName?: SortOrder
    deviceNumber?: SortOrder
    factory?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    voltage?: SortOrderInput | SortOrder
    currents?: SortOrderInput | SortOrder
    power?: SortOrderInput | SortOrder
    battery?: SortOrderInput | SortOrder
    switchState?: SortOrderInput | SortOrder
    networkState?: SortOrderInput | SortOrder
    lastUpdated?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
  }

  export type AmmeterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deviceNumber?: string
    AND?: AmmeterWhereInput | AmmeterWhereInput[]
    OR?: AmmeterWhereInput[]
    NOT?: AmmeterWhereInput | AmmeterWhereInput[]
    electricMeterNumber?: StringFilter<"Ammeter"> | string
    electricMeterName?: StringFilter<"Ammeter"> | string
    factory?: StringNullableFilter<"Ammeter"> | string | null
    device?: StringNullableFilter<"Ammeter"> | string | null
    voltage?: FloatNullableFilter<"Ammeter"> | number | null
    currents?: FloatNullableFilter<"Ammeter"> | number | null
    power?: FloatNullableFilter<"Ammeter"> | number | null
    battery?: FloatNullableFilter<"Ammeter"> | number | null
    switchState?: IntNullableFilter<"Ammeter"> | number | null
    networkState?: IntNullableFilter<"Ammeter"> | number | null
    lastUpdated?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Ammeter"> | Date | string | null
  }, "id" | "deviceNumber">

  export type AmmeterOrderByWithAggregationInput = {
    id?: SortOrder
    electricMeterNumber?: SortOrder
    electricMeterName?: SortOrder
    deviceNumber?: SortOrder
    factory?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    voltage?: SortOrderInput | SortOrder
    currents?: SortOrderInput | SortOrder
    power?: SortOrderInput | SortOrder
    battery?: SortOrderInput | SortOrder
    switchState?: SortOrderInput | SortOrder
    networkState?: SortOrderInput | SortOrder
    lastUpdated?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: AmmeterCountOrderByAggregateInput
    _avg?: AmmeterAvgOrderByAggregateInput
    _max?: AmmeterMaxOrderByAggregateInput
    _min?: AmmeterMinOrderByAggregateInput
    _sum?: AmmeterSumOrderByAggregateInput
  }

  export type AmmeterScalarWhereWithAggregatesInput = {
    AND?: AmmeterScalarWhereWithAggregatesInput | AmmeterScalarWhereWithAggregatesInput[]
    OR?: AmmeterScalarWhereWithAggregatesInput[]
    NOT?: AmmeterScalarWhereWithAggregatesInput | AmmeterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ammeter"> | string
    electricMeterNumber?: StringWithAggregatesFilter<"Ammeter"> | string
    electricMeterName?: StringWithAggregatesFilter<"Ammeter"> | string
    deviceNumber?: StringWithAggregatesFilter<"Ammeter"> | string
    factory?: StringNullableWithAggregatesFilter<"Ammeter"> | string | null
    device?: StringNullableWithAggregatesFilter<"Ammeter"> | string | null
    voltage?: FloatNullableWithAggregatesFilter<"Ammeter"> | number | null
    currents?: FloatNullableWithAggregatesFilter<"Ammeter"> | number | null
    power?: FloatNullableWithAggregatesFilter<"Ammeter"> | number | null
    battery?: FloatNullableWithAggregatesFilter<"Ammeter"> | number | null
    switchState?: IntNullableWithAggregatesFilter<"Ammeter"> | number | null
    networkState?: IntNullableWithAggregatesFilter<"Ammeter"> | number | null
    lastUpdated?: DateTimeNullableWithAggregatesFilter<"Ammeter"> | Date | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Ammeter"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Ammeter"> | Date | string | null
  }

  export type AmmeterLogWhereInput = {
    AND?: AmmeterLogWhereInput | AmmeterLogWhereInput[]
    OR?: AmmeterLogWhereInput[]
    NOT?: AmmeterLogWhereInput | AmmeterLogWhereInput[]
    id?: StringFilter<"AmmeterLog"> | string
    deviceNumber?: StringFilter<"AmmeterLog"> | string
    action?: StringFilter<"AmmeterLog"> | string
    factory?: StringNullableFilter<"AmmeterLog"> | string | null
    device?: StringNullableFilter<"AmmeterLog"> | string | null
    voltage?: FloatNullableFilter<"AmmeterLog"> | number | null
    currents?: FloatNullableFilter<"AmmeterLog"> | number | null
    power?: FloatNullableFilter<"AmmeterLog"> | number | null
    battery?: FloatNullableFilter<"AmmeterLog"> | number | null
    switchState?: IntNullableFilter<"AmmeterLog"> | number | null
    networkState?: IntNullableFilter<"AmmeterLog"> | number | null
    lastUpdated?: DateTimeNullableFilter<"AmmeterLog"> | Date | string | null
    requestData?: StringNullableFilter<"AmmeterLog"> | string | null
    responseData?: StringNullableFilter<"AmmeterLog"> | string | null
    statusCode?: IntNullableFilter<"AmmeterLog"> | number | null
    success?: BoolFilter<"AmmeterLog"> | boolean
    errorMessage?: StringNullableFilter<"AmmeterLog"> | string | null
    responseTime?: IntNullableFilter<"AmmeterLog"> | number | null
    ipAddress?: StringNullableFilter<"AmmeterLog"> | string | null
    userAgent?: StringNullableFilter<"AmmeterLog"> | string | null
    userId?: StringNullableFilter<"AmmeterLog"> | string | null
    createdAt?: DateTimeNullableFilter<"AmmeterLog"> | Date | string | null
  }

  export type AmmeterLogOrderByWithRelationInput = {
    id?: SortOrder
    deviceNumber?: SortOrder
    action?: SortOrder
    factory?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    voltage?: SortOrderInput | SortOrder
    currents?: SortOrderInput | SortOrder
    power?: SortOrderInput | SortOrder
    battery?: SortOrderInput | SortOrder
    switchState?: SortOrderInput | SortOrder
    networkState?: SortOrderInput | SortOrder
    lastUpdated?: SortOrderInput | SortOrder
    requestData?: SortOrderInput | SortOrder
    responseData?: SortOrderInput | SortOrder
    statusCode?: SortOrderInput | SortOrder
    success?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    responseTime?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
  }

  export type AmmeterLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AmmeterLogWhereInput | AmmeterLogWhereInput[]
    OR?: AmmeterLogWhereInput[]
    NOT?: AmmeterLogWhereInput | AmmeterLogWhereInput[]
    deviceNumber?: StringFilter<"AmmeterLog"> | string
    action?: StringFilter<"AmmeterLog"> | string
    factory?: StringNullableFilter<"AmmeterLog"> | string | null
    device?: StringNullableFilter<"AmmeterLog"> | string | null
    voltage?: FloatNullableFilter<"AmmeterLog"> | number | null
    currents?: FloatNullableFilter<"AmmeterLog"> | number | null
    power?: FloatNullableFilter<"AmmeterLog"> | number | null
    battery?: FloatNullableFilter<"AmmeterLog"> | number | null
    switchState?: IntNullableFilter<"AmmeterLog"> | number | null
    networkState?: IntNullableFilter<"AmmeterLog"> | number | null
    lastUpdated?: DateTimeNullableFilter<"AmmeterLog"> | Date | string | null
    requestData?: StringNullableFilter<"AmmeterLog"> | string | null
    responseData?: StringNullableFilter<"AmmeterLog"> | string | null
    statusCode?: IntNullableFilter<"AmmeterLog"> | number | null
    success?: BoolFilter<"AmmeterLog"> | boolean
    errorMessage?: StringNullableFilter<"AmmeterLog"> | string | null
    responseTime?: IntNullableFilter<"AmmeterLog"> | number | null
    ipAddress?: StringNullableFilter<"AmmeterLog"> | string | null
    userAgent?: StringNullableFilter<"AmmeterLog"> | string | null
    userId?: StringNullableFilter<"AmmeterLog"> | string | null
    createdAt?: DateTimeNullableFilter<"AmmeterLog"> | Date | string | null
  }, "id">

  export type AmmeterLogOrderByWithAggregationInput = {
    id?: SortOrder
    deviceNumber?: SortOrder
    action?: SortOrder
    factory?: SortOrderInput | SortOrder
    device?: SortOrderInput | SortOrder
    voltage?: SortOrderInput | SortOrder
    currents?: SortOrderInput | SortOrder
    power?: SortOrderInput | SortOrder
    battery?: SortOrderInput | SortOrder
    switchState?: SortOrderInput | SortOrder
    networkState?: SortOrderInput | SortOrder
    lastUpdated?: SortOrderInput | SortOrder
    requestData?: SortOrderInput | SortOrder
    responseData?: SortOrderInput | SortOrder
    statusCode?: SortOrderInput | SortOrder
    success?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    responseTime?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: AmmeterLogCountOrderByAggregateInput
    _avg?: AmmeterLogAvgOrderByAggregateInput
    _max?: AmmeterLogMaxOrderByAggregateInput
    _min?: AmmeterLogMinOrderByAggregateInput
    _sum?: AmmeterLogSumOrderByAggregateInput
  }

  export type AmmeterLogScalarWhereWithAggregatesInput = {
    AND?: AmmeterLogScalarWhereWithAggregatesInput | AmmeterLogScalarWhereWithAggregatesInput[]
    OR?: AmmeterLogScalarWhereWithAggregatesInput[]
    NOT?: AmmeterLogScalarWhereWithAggregatesInput | AmmeterLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AmmeterLog"> | string
    deviceNumber?: StringWithAggregatesFilter<"AmmeterLog"> | string
    action?: StringWithAggregatesFilter<"AmmeterLog"> | string
    factory?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    device?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    voltage?: FloatNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    currents?: FloatNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    power?: FloatNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    battery?: FloatNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    switchState?: IntNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    networkState?: IntNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    lastUpdated?: DateTimeNullableWithAggregatesFilter<"AmmeterLog"> | Date | string | null
    requestData?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    responseData?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    statusCode?: IntNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    success?: BoolWithAggregatesFilter<"AmmeterLog"> | boolean
    errorMessage?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    responseTime?: IntNullableWithAggregatesFilter<"AmmeterLog"> | number | null
    ipAddress?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"AmmeterLog"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"AmmeterLog"> | Date | string | null
  }

  export type AnalysisDatasetCreateInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    analysisData?: AnalysisReadyDataCreateNestedManyWithoutDatasetInput
    anomalyEvents?: AnomalyEventCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    analysisData?: AnalysisReadyDataUncheckedCreateNestedManyWithoutDatasetInput
    anomalyEvents?: AnomalyEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisData?: AnalysisReadyDataUpdateManyWithoutDatasetNestedInput
    anomalyEvents?: AnomalyEventUpdateManyWithoutDatasetNestedInput
  }

  export type AnalysisDatasetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisData?: AnalysisReadyDataUncheckedUpdateManyWithoutDatasetNestedInput
    anomalyEvents?: AnomalyEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type AnalysisDatasetCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
  }

  export type AnalysisDatasetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisDatasetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisReadyDataCreateInput = {
    id?: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
    dataset: AnalysisDatasetCreateNestedOneWithoutAnalysisDataInput
  }

  export type AnalysisReadyDataUncheckedCreateInput = {
    id?: string
    datasetId: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
  }

  export type AnalysisReadyDataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
    dataset?: AnalysisDatasetUpdateOneRequiredWithoutAnalysisDataNestedInput
  }

  export type AnalysisReadyDataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalysisReadyDataCreateManyInput = {
    id?: string
    datasetId: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
  }

  export type AnalysisReadyDataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalysisReadyDataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExperimentRunCreateInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    anomalyEvents?: AnomalyEventCreateNestedManyWithoutExperimentRunInput
    trainedModels?: TrainedModelCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    anomalyEvents?: AnomalyEventUncheckedCreateNestedManyWithoutExperimentRunInput
    trainedModels?: TrainedModelUncheckedCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    anomalyEvents?: AnomalyEventUpdateManyWithoutExperimentRunNestedInput
    trainedModels?: TrainedModelUpdateManyWithoutExperimentRunNestedInput
  }

  export type ExperimentRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    anomalyEvents?: AnomalyEventUncheckedUpdateManyWithoutExperimentRunNestedInput
    trainedModels?: TrainedModelUncheckedUpdateManyWithoutExperimentRunNestedInput
  }

  export type ExperimentRunCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
  }

  export type ExperimentRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExperimentRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnomalyEventCreateInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dataset: AnalysisDatasetCreateNestedOneWithoutAnomalyEventsInput
    experimentRun?: ExperimentRunCreateNestedOneWithoutAnomalyEventsInput
    eventLabelLinks?: EventLabelLinkCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventUncheckedCreateInput = {
    id?: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRunId?: string | null
    eventLabelLinks?: EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: AnalysisDatasetUpdateOneRequiredWithoutAnomalyEventsNestedInput
    experimentRun?: ExperimentRunUpdateOneWithoutAnomalyEventsNestedInput
    eventLabelLinks?: EventLabelLinkUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabelLinks?: EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventCreateManyInput = {
    id?: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRunId?: string | null
  }

  export type AnomalyEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnomalyEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRunId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnomalyLabelCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventLabelLinks?: EventLabelLinkCreateNestedManyWithoutAnomalyLabelInput
  }

  export type AnomalyLabelUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventLabelLinks?: EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyLabelInput
  }

  export type AnomalyLabelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventLabelLinks?: EventLabelLinkUpdateManyWithoutAnomalyLabelNestedInput
  }

  export type AnomalyLabelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventLabelLinks?: EventLabelLinkUncheckedUpdateManyWithoutAnomalyLabelNestedInput
  }

  export type AnomalyLabelCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnomalyLabelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnomalyLabelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkCreateInput = {
    id?: string
    createdAt?: Date | string
    anomalyEvent: AnomalyEventCreateNestedOneWithoutEventLabelLinksInput
    anomalyLabel: AnomalyLabelCreateNestedOneWithoutEventLabelLinksInput
  }

  export type EventLabelLinkUncheckedCreateInput = {
    id?: string
    eventId: string
    labelId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anomalyEvent?: AnomalyEventUpdateOneRequiredWithoutEventLabelLinksNestedInput
    anomalyLabel?: AnomalyLabelUpdateOneRequiredWithoutEventLabelLinksNestedInput
  }

  export type EventLabelLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkCreateManyInput = {
    id?: string
    eventId: string
    labelId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainedModelCreateInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    experimentRun: ExperimentRunCreateNestedOneWithoutTrainedModelsInput
    evaluationRuns?: EvaluationRunCreateNestedManyWithoutTrainedModelInput
  }

  export type TrainedModelUncheckedCreateInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    experimentRunId: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    evaluationRuns?: EvaluationRunUncheckedCreateNestedManyWithoutTrainedModelInput
  }

  export type TrainedModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    experimentRun?: ExperimentRunUpdateOneRequiredWithoutTrainedModelsNestedInput
    evaluationRuns?: EvaluationRunUpdateManyWithoutTrainedModelNestedInput
  }

  export type TrainedModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    experimentRunId?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evaluationRuns?: EvaluationRunUncheckedUpdateManyWithoutTrainedModelNestedInput
  }

  export type TrainedModelCreateManyInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    experimentRunId: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type TrainedModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrainedModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    experimentRunId?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EvaluationRunCreateInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    trainedModel: TrainedModelCreateNestedOneWithoutEvaluationRunsInput
    predictions?: ModelPredictionCreateNestedManyWithoutEvaluationRunInput
  }

  export type EvaluationRunUncheckedCreateInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    trainedModelId: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    predictions?: ModelPredictionUncheckedCreateNestedManyWithoutEvaluationRunInput
  }

  export type EvaluationRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trainedModel?: TrainedModelUpdateOneRequiredWithoutEvaluationRunsNestedInput
    predictions?: ModelPredictionUpdateManyWithoutEvaluationRunNestedInput
  }

  export type EvaluationRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trainedModelId?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    predictions?: ModelPredictionUncheckedUpdateManyWithoutEvaluationRunNestedInput
  }

  export type EvaluationRunCreateManyInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    trainedModelId: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type EvaluationRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EvaluationRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trainedModelId?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ModelPredictionCreateInput = {
    id?: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
    evaluationRun: EvaluationRunCreateNestedOneWithoutPredictionsInput
  }

  export type ModelPredictionUncheckedCreateInput = {
    id?: string
    evaluationRunId: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
  }

  export type ModelPredictionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationRun?: EvaluationRunUpdateOneRequiredWithoutPredictionsNestedInput
  }

  export type ModelPredictionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    evaluationRunId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ModelPredictionCreateManyInput = {
    id?: string
    evaluationRunId: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
  }

  export type ModelPredictionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ModelPredictionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    evaluationRunId?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AmmeterCreateInput = {
    id: string
    electricMeterNumber: string
    electricMeterName: string
    deviceNumber: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AmmeterUncheckedCreateInput = {
    id: string
    electricMeterNumber: string
    electricMeterName: string
    deviceNumber: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AmmeterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    electricMeterNumber?: StringFieldUpdateOperationsInput | string
    electricMeterName?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    electricMeterNumber?: StringFieldUpdateOperationsInput | string
    electricMeterName?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterCreateManyInput = {
    id: string
    electricMeterNumber: string
    electricMeterName: string
    deviceNumber: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type AmmeterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    electricMeterNumber?: StringFieldUpdateOperationsInput | string
    electricMeterName?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    electricMeterNumber?: StringFieldUpdateOperationsInput | string
    electricMeterName?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterLogCreateInput = {
    id: string
    deviceNumber: string
    action: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    requestData?: string | null
    responseData?: string | null
    statusCode?: number | null
    success: boolean
    errorMessage?: string | null
    responseTime?: number | null
    ipAddress?: string | null
    userAgent?: string | null
    userId?: string | null
    createdAt?: Date | string | null
  }

  export type AmmeterLogUncheckedCreateInput = {
    id: string
    deviceNumber: string
    action: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    requestData?: string | null
    responseData?: string | null
    statusCode?: number | null
    success: boolean
    errorMessage?: string | null
    responseTime?: number | null
    ipAddress?: string | null
    userAgent?: string | null
    userId?: string | null
    createdAt?: Date | string | null
  }

  export type AmmeterLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterLogCreateManyInput = {
    id: string
    deviceNumber: string
    action: string
    factory?: string | null
    device?: string | null
    voltage?: number | null
    currents?: number | null
    power?: number | null
    battery?: number | null
    switchState?: number | null
    networkState?: number | null
    lastUpdated?: Date | string | null
    requestData?: string | null
    responseData?: string | null
    statusCode?: number | null
    success: boolean
    errorMessage?: string | null
    responseTime?: number | null
    ipAddress?: string | null
    userAgent?: string | null
    userId?: string | null
    createdAt?: Date | string | null
  }

  export type AmmeterLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AmmeterLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceNumber?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    factory?: NullableStringFieldUpdateOperationsInput | string | null
    device?: NullableStringFieldUpdateOperationsInput | string | null
    voltage?: NullableFloatFieldUpdateOperationsInput | number | null
    currents?: NullableFloatFieldUpdateOperationsInput | number | null
    power?: NullableFloatFieldUpdateOperationsInput | number | null
    battery?: NullableFloatFieldUpdateOperationsInput | number | null
    switchState?: NullableIntFieldUpdateOperationsInput | number | null
    networkState?: NullableIntFieldUpdateOperationsInput | number | null
    lastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requestData?: NullableStringFieldUpdateOperationsInput | string | null
    responseData?: NullableStringFieldUpdateOperationsInput | string | null
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AnalysisReadyDataListRelationFilter = {
    every?: AnalysisReadyDataWhereInput
    some?: AnalysisReadyDataWhereInput
    none?: AnalysisReadyDataWhereInput
  }

  export type AnomalyEventListRelationFilter = {
    every?: AnomalyEventWhereInput
    some?: AnomalyEventWhereInput
    none?: AnomalyEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AnalysisReadyDataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnomalyEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalysisDatasetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    room?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    occupantType?: SortOrder
    meterIdL1?: SortOrder
    meterIdL2?: SortOrder
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisDatasetAvgOrderByAggregateInput = {
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
  }

  export type AnalysisDatasetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    room?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    occupantType?: SortOrder
    meterIdL1?: SortOrder
    meterIdL2?: SortOrder
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisDatasetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    room?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    occupantType?: SortOrder
    meterIdL1?: SortOrder
    meterIdL2?: SortOrder
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisDatasetSumOrderByAggregateInput = {
    totalRecords?: SortOrder
    positiveLabels?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AnalysisDatasetScalarRelationFilter = {
    is?: AnalysisDatasetWhereInput
    isNot?: AnalysisDatasetWhereInput
  }

  export type AnalysisReadyDataCountOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    timestamp?: SortOrder
    room?: SortOrder
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
    isPositiveLabel?: SortOrder
    sourceAnomalyEventId?: SortOrder
  }

  export type AnalysisReadyDataAvgOrderByAggregateInput = {
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
  }

  export type AnalysisReadyDataMaxOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    timestamp?: SortOrder
    room?: SortOrder
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
    isPositiveLabel?: SortOrder
    sourceAnomalyEventId?: SortOrder
  }

  export type AnalysisReadyDataMinOrderByAggregateInput = {
    id?: SortOrder
    datasetId?: SortOrder
    timestamp?: SortOrder
    room?: SortOrder
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
    isPositiveLabel?: SortOrder
    sourceAnomalyEventId?: SortOrder
  }

  export type AnalysisReadyDataSumOrderByAggregateInput = {
    rawWattageL1?: SortOrder
    rawWattageL2?: SortOrder
    wattage110v?: SortOrder
    wattage220v?: SortOrder
    wattageTotal?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TrainedModelListRelationFilter = {
    every?: TrainedModelWhereInput
    some?: TrainedModelWhereInput
    none?: TrainedModelWhereInput
  }

  export type TrainedModelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExperimentRunCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    filteringParameters?: SortOrder
    status?: SortOrder
    candidateCount?: SortOrder
    positiveLabelCount?: SortOrder
    negativeLabelCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candidateStats?: SortOrder
  }

  export type ExperimentRunAvgOrderByAggregateInput = {
    candidateCount?: SortOrder
    positiveLabelCount?: SortOrder
    negativeLabelCount?: SortOrder
  }

  export type ExperimentRunMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    filteringParameters?: SortOrder
    status?: SortOrder
    candidateCount?: SortOrder
    positiveLabelCount?: SortOrder
    negativeLabelCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candidateStats?: SortOrder
  }

  export type ExperimentRunMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    filteringParameters?: SortOrder
    status?: SortOrder
    candidateCount?: SortOrder
    positiveLabelCount?: SortOrder
    negativeLabelCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    candidateStats?: SortOrder
  }

  export type ExperimentRunSumOrderByAggregateInput = {
    candidateCount?: SortOrder
    positiveLabelCount?: SortOrder
    negativeLabelCount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ExperimentRunNullableScalarRelationFilter = {
    is?: ExperimentRunWhereInput | null
    isNot?: ExperimentRunWhereInput | null
  }

  export type EventLabelLinkListRelationFilter = {
    every?: EventLabelLinkWhereInput
    some?: EventLabelLinkWhereInput
    none?: EventLabelLinkWhereInput
  }

  export type EventLabelLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnomalyEventCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    datasetId?: SortOrder
    line?: SortOrder
    eventTimestamp?: SortOrder
    detectionRule?: SortOrder
    score?: SortOrder
    dataWindow?: SortOrder
    status?: SortOrder
    reviewerId?: SortOrder
    reviewTimestamp?: SortOrder
    justificationNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    experimentRunId?: SortOrder
  }

  export type AnomalyEventAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AnomalyEventMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    datasetId?: SortOrder
    line?: SortOrder
    eventTimestamp?: SortOrder
    detectionRule?: SortOrder
    score?: SortOrder
    dataWindow?: SortOrder
    status?: SortOrder
    reviewerId?: SortOrder
    reviewTimestamp?: SortOrder
    justificationNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    experimentRunId?: SortOrder
  }

  export type AnomalyEventMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    name?: SortOrder
    datasetId?: SortOrder
    line?: SortOrder
    eventTimestamp?: SortOrder
    detectionRule?: SortOrder
    score?: SortOrder
    dataWindow?: SortOrder
    status?: SortOrder
    reviewerId?: SortOrder
    reviewTimestamp?: SortOrder
    justificationNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    experimentRunId?: SortOrder
  }

  export type AnomalyEventSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AnomalyLabelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnomalyLabelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnomalyLabelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnomalyEventScalarRelationFilter = {
    is?: AnomalyEventWhereInput
    isNot?: AnomalyEventWhereInput
  }

  export type AnomalyLabelScalarRelationFilter = {
    is?: AnomalyLabelWhereInput
    isNot?: AnomalyLabelWhereInput
  }

  export type EventLabelLinkEventIdLabelIdCompoundUniqueInput = {
    eventId: string
    labelId: string
  }

  export type EventLabelLinkCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
  }

  export type EventLabelLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
  }

  export type EventLabelLinkMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
  }

  export type ExperimentRunScalarRelationFilter = {
    is?: ExperimentRunWhereInput
    isNot?: ExperimentRunWhereInput
  }

  export type EvaluationRunListRelationFilter = {
    every?: EvaluationRunWhereInput
    some?: EvaluationRunWhereInput
    none?: EvaluationRunWhereInput
  }

  export type EvaluationRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrainedModelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    experimentRunId?: SortOrder
    modelConfig?: SortOrder
    dataSourceConfig?: SortOrder
    modelPath?: SortOrder
    trainingMetrics?: SortOrder
    validationMetrics?: SortOrder
    trainingLogs?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TrainedModelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    experimentRunId?: SortOrder
    modelConfig?: SortOrder
    dataSourceConfig?: SortOrder
    modelPath?: SortOrder
    trainingMetrics?: SortOrder
    validationMetrics?: SortOrder
    trainingLogs?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TrainedModelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    experimentRunId?: SortOrder
    modelConfig?: SortOrder
    dataSourceConfig?: SortOrder
    modelPath?: SortOrder
    trainingMetrics?: SortOrder
    validationMetrics?: SortOrder
    trainingLogs?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type TrainedModelScalarRelationFilter = {
    is?: TrainedModelWhereInput
    isNot?: TrainedModelWhereInput
  }

  export type ModelPredictionListRelationFilter = {
    every?: ModelPredictionWhereInput
    some?: ModelPredictionWhereInput
    none?: ModelPredictionWhereInput
  }

  export type ModelPredictionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EvaluationRunCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    trainedModelId?: SortOrder
    testSetSource?: SortOrder
    evaluationMetrics?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type EvaluationRunMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    trainedModelId?: SortOrder
    testSetSource?: SortOrder
    evaluationMetrics?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type EvaluationRunMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    scenarioType?: SortOrder
    status?: SortOrder
    trainedModelId?: SortOrder
    testSetSource?: SortOrder
    evaluationMetrics?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type EvaluationRunScalarRelationFilter = {
    is?: EvaluationRunWhereInput
    isNot?: EvaluationRunWhereInput
  }

  export type ModelPredictionCountOrderByAggregateInput = {
    id?: SortOrder
    evaluationRunId?: SortOrder
    timestamp?: SortOrder
    predictionScore?: SortOrder
    groundTruth?: SortOrder
  }

  export type ModelPredictionAvgOrderByAggregateInput = {
    predictionScore?: SortOrder
    groundTruth?: SortOrder
  }

  export type ModelPredictionMaxOrderByAggregateInput = {
    id?: SortOrder
    evaluationRunId?: SortOrder
    timestamp?: SortOrder
    predictionScore?: SortOrder
    groundTruth?: SortOrder
  }

  export type ModelPredictionMinOrderByAggregateInput = {
    id?: SortOrder
    evaluationRunId?: SortOrder
    timestamp?: SortOrder
    predictionScore?: SortOrder
    groundTruth?: SortOrder
  }

  export type ModelPredictionSumOrderByAggregateInput = {
    predictionScore?: SortOrder
    groundTruth?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type AmmeterCountOrderByAggregateInput = {
    id?: SortOrder
    electricMeterNumber?: SortOrder
    electricMeterName?: SortOrder
    deviceNumber?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmmeterAvgOrderByAggregateInput = {
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
  }

  export type AmmeterMaxOrderByAggregateInput = {
    id?: SortOrder
    electricMeterNumber?: SortOrder
    electricMeterName?: SortOrder
    deviceNumber?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmmeterMinOrderByAggregateInput = {
    id?: SortOrder
    electricMeterNumber?: SortOrder
    electricMeterName?: SortOrder
    deviceNumber?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AmmeterSumOrderByAggregateInput = {
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AmmeterLogCountOrderByAggregateInput = {
    id?: SortOrder
    deviceNumber?: SortOrder
    action?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    statusCode?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    responseTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type AmmeterLogAvgOrderByAggregateInput = {
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    statusCode?: SortOrder
    responseTime?: SortOrder
  }

  export type AmmeterLogMaxOrderByAggregateInput = {
    id?: SortOrder
    deviceNumber?: SortOrder
    action?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    statusCode?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    responseTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type AmmeterLogMinOrderByAggregateInput = {
    id?: SortOrder
    deviceNumber?: SortOrder
    action?: SortOrder
    factory?: SortOrder
    device?: SortOrder
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    lastUpdated?: SortOrder
    requestData?: SortOrder
    responseData?: SortOrder
    statusCode?: SortOrder
    success?: SortOrder
    errorMessage?: SortOrder
    responseTime?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type AmmeterLogSumOrderByAggregateInput = {
    voltage?: SortOrder
    currents?: SortOrder
    power?: SortOrder
    battery?: SortOrder
    switchState?: SortOrder
    networkState?: SortOrder
    statusCode?: SortOrder
    responseTime?: SortOrder
  }

  export type AnalysisReadyDataCreateNestedManyWithoutDatasetInput = {
    create?: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput> | AnalysisReadyDataCreateWithoutDatasetInput[] | AnalysisReadyDataUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnalysisReadyDataCreateOrConnectWithoutDatasetInput | AnalysisReadyDataCreateOrConnectWithoutDatasetInput[]
    createMany?: AnalysisReadyDataCreateManyDatasetInputEnvelope
    connect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
  }

  export type AnomalyEventCreateNestedManyWithoutDatasetInput = {
    create?: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput> | AnomalyEventCreateWithoutDatasetInput[] | AnomalyEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutDatasetInput | AnomalyEventCreateOrConnectWithoutDatasetInput[]
    createMany?: AnomalyEventCreateManyDatasetInputEnvelope
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
  }

  export type AnalysisReadyDataUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput> | AnalysisReadyDataCreateWithoutDatasetInput[] | AnalysisReadyDataUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnalysisReadyDataCreateOrConnectWithoutDatasetInput | AnalysisReadyDataCreateOrConnectWithoutDatasetInput[]
    createMany?: AnalysisReadyDataCreateManyDatasetInputEnvelope
    connect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
  }

  export type AnomalyEventUncheckedCreateNestedManyWithoutDatasetInput = {
    create?: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput> | AnomalyEventCreateWithoutDatasetInput[] | AnomalyEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutDatasetInput | AnomalyEventCreateOrConnectWithoutDatasetInput[]
    createMany?: AnomalyEventCreateManyDatasetInputEnvelope
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnalysisReadyDataUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput> | AnalysisReadyDataCreateWithoutDatasetInput[] | AnalysisReadyDataUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnalysisReadyDataCreateOrConnectWithoutDatasetInput | AnalysisReadyDataCreateOrConnectWithoutDatasetInput[]
    upsert?: AnalysisReadyDataUpsertWithWhereUniqueWithoutDatasetInput | AnalysisReadyDataUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: AnalysisReadyDataCreateManyDatasetInputEnvelope
    set?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    disconnect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    delete?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    connect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    update?: AnalysisReadyDataUpdateWithWhereUniqueWithoutDatasetInput | AnalysisReadyDataUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: AnalysisReadyDataUpdateManyWithWhereWithoutDatasetInput | AnalysisReadyDataUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: AnalysisReadyDataScalarWhereInput | AnalysisReadyDataScalarWhereInput[]
  }

  export type AnomalyEventUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput> | AnomalyEventCreateWithoutDatasetInput[] | AnomalyEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutDatasetInput | AnomalyEventCreateOrConnectWithoutDatasetInput[]
    upsert?: AnomalyEventUpsertWithWhereUniqueWithoutDatasetInput | AnomalyEventUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: AnomalyEventCreateManyDatasetInputEnvelope
    set?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    disconnect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    delete?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    update?: AnomalyEventUpdateWithWhereUniqueWithoutDatasetInput | AnomalyEventUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: AnomalyEventUpdateManyWithWhereWithoutDatasetInput | AnomalyEventUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
  }

  export type AnalysisReadyDataUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput> | AnalysisReadyDataCreateWithoutDatasetInput[] | AnalysisReadyDataUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnalysisReadyDataCreateOrConnectWithoutDatasetInput | AnalysisReadyDataCreateOrConnectWithoutDatasetInput[]
    upsert?: AnalysisReadyDataUpsertWithWhereUniqueWithoutDatasetInput | AnalysisReadyDataUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: AnalysisReadyDataCreateManyDatasetInputEnvelope
    set?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    disconnect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    delete?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    connect?: AnalysisReadyDataWhereUniqueInput | AnalysisReadyDataWhereUniqueInput[]
    update?: AnalysisReadyDataUpdateWithWhereUniqueWithoutDatasetInput | AnalysisReadyDataUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: AnalysisReadyDataUpdateManyWithWhereWithoutDatasetInput | AnalysisReadyDataUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: AnalysisReadyDataScalarWhereInput | AnalysisReadyDataScalarWhereInput[]
  }

  export type AnomalyEventUncheckedUpdateManyWithoutDatasetNestedInput = {
    create?: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput> | AnomalyEventCreateWithoutDatasetInput[] | AnomalyEventUncheckedCreateWithoutDatasetInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutDatasetInput | AnomalyEventCreateOrConnectWithoutDatasetInput[]
    upsert?: AnomalyEventUpsertWithWhereUniqueWithoutDatasetInput | AnomalyEventUpsertWithWhereUniqueWithoutDatasetInput[]
    createMany?: AnomalyEventCreateManyDatasetInputEnvelope
    set?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    disconnect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    delete?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    update?: AnomalyEventUpdateWithWhereUniqueWithoutDatasetInput | AnomalyEventUpdateWithWhereUniqueWithoutDatasetInput[]
    updateMany?: AnomalyEventUpdateManyWithWhereWithoutDatasetInput | AnomalyEventUpdateManyWithWhereWithoutDatasetInput[]
    deleteMany?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
  }

  export type AnalysisDatasetCreateNestedOneWithoutAnalysisDataInput = {
    create?: XOR<AnalysisDatasetCreateWithoutAnalysisDataInput, AnalysisDatasetUncheckedCreateWithoutAnalysisDataInput>
    connectOrCreate?: AnalysisDatasetCreateOrConnectWithoutAnalysisDataInput
    connect?: AnalysisDatasetWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AnalysisDatasetUpdateOneRequiredWithoutAnalysisDataNestedInput = {
    create?: XOR<AnalysisDatasetCreateWithoutAnalysisDataInput, AnalysisDatasetUncheckedCreateWithoutAnalysisDataInput>
    connectOrCreate?: AnalysisDatasetCreateOrConnectWithoutAnalysisDataInput
    upsert?: AnalysisDatasetUpsertWithoutAnalysisDataInput
    connect?: AnalysisDatasetWhereUniqueInput
    update?: XOR<XOR<AnalysisDatasetUpdateToOneWithWhereWithoutAnalysisDataInput, AnalysisDatasetUpdateWithoutAnalysisDataInput>, AnalysisDatasetUncheckedUpdateWithoutAnalysisDataInput>
  }

  export type AnomalyEventCreateNestedManyWithoutExperimentRunInput = {
    create?: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput> | AnomalyEventCreateWithoutExperimentRunInput[] | AnomalyEventUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutExperimentRunInput | AnomalyEventCreateOrConnectWithoutExperimentRunInput[]
    createMany?: AnomalyEventCreateManyExperimentRunInputEnvelope
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
  }

  export type TrainedModelCreateNestedManyWithoutExperimentRunInput = {
    create?: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput> | TrainedModelCreateWithoutExperimentRunInput[] | TrainedModelUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: TrainedModelCreateOrConnectWithoutExperimentRunInput | TrainedModelCreateOrConnectWithoutExperimentRunInput[]
    createMany?: TrainedModelCreateManyExperimentRunInputEnvelope
    connect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
  }

  export type AnomalyEventUncheckedCreateNestedManyWithoutExperimentRunInput = {
    create?: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput> | AnomalyEventCreateWithoutExperimentRunInput[] | AnomalyEventUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutExperimentRunInput | AnomalyEventCreateOrConnectWithoutExperimentRunInput[]
    createMany?: AnomalyEventCreateManyExperimentRunInputEnvelope
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
  }

  export type TrainedModelUncheckedCreateNestedManyWithoutExperimentRunInput = {
    create?: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput> | TrainedModelCreateWithoutExperimentRunInput[] | TrainedModelUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: TrainedModelCreateOrConnectWithoutExperimentRunInput | TrainedModelCreateOrConnectWithoutExperimentRunInput[]
    createMany?: TrainedModelCreateManyExperimentRunInputEnvelope
    connect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnomalyEventUpdateManyWithoutExperimentRunNestedInput = {
    create?: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput> | AnomalyEventCreateWithoutExperimentRunInput[] | AnomalyEventUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutExperimentRunInput | AnomalyEventCreateOrConnectWithoutExperimentRunInput[]
    upsert?: AnomalyEventUpsertWithWhereUniqueWithoutExperimentRunInput | AnomalyEventUpsertWithWhereUniqueWithoutExperimentRunInput[]
    createMany?: AnomalyEventCreateManyExperimentRunInputEnvelope
    set?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    disconnect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    delete?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    update?: AnomalyEventUpdateWithWhereUniqueWithoutExperimentRunInput | AnomalyEventUpdateWithWhereUniqueWithoutExperimentRunInput[]
    updateMany?: AnomalyEventUpdateManyWithWhereWithoutExperimentRunInput | AnomalyEventUpdateManyWithWhereWithoutExperimentRunInput[]
    deleteMany?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
  }

  export type TrainedModelUpdateManyWithoutExperimentRunNestedInput = {
    create?: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput> | TrainedModelCreateWithoutExperimentRunInput[] | TrainedModelUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: TrainedModelCreateOrConnectWithoutExperimentRunInput | TrainedModelCreateOrConnectWithoutExperimentRunInput[]
    upsert?: TrainedModelUpsertWithWhereUniqueWithoutExperimentRunInput | TrainedModelUpsertWithWhereUniqueWithoutExperimentRunInput[]
    createMany?: TrainedModelCreateManyExperimentRunInputEnvelope
    set?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    disconnect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    delete?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    connect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    update?: TrainedModelUpdateWithWhereUniqueWithoutExperimentRunInput | TrainedModelUpdateWithWhereUniqueWithoutExperimentRunInput[]
    updateMany?: TrainedModelUpdateManyWithWhereWithoutExperimentRunInput | TrainedModelUpdateManyWithWhereWithoutExperimentRunInput[]
    deleteMany?: TrainedModelScalarWhereInput | TrainedModelScalarWhereInput[]
  }

  export type AnomalyEventUncheckedUpdateManyWithoutExperimentRunNestedInput = {
    create?: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput> | AnomalyEventCreateWithoutExperimentRunInput[] | AnomalyEventUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutExperimentRunInput | AnomalyEventCreateOrConnectWithoutExperimentRunInput[]
    upsert?: AnomalyEventUpsertWithWhereUniqueWithoutExperimentRunInput | AnomalyEventUpsertWithWhereUniqueWithoutExperimentRunInput[]
    createMany?: AnomalyEventCreateManyExperimentRunInputEnvelope
    set?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    disconnect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    delete?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    connect?: AnomalyEventWhereUniqueInput | AnomalyEventWhereUniqueInput[]
    update?: AnomalyEventUpdateWithWhereUniqueWithoutExperimentRunInput | AnomalyEventUpdateWithWhereUniqueWithoutExperimentRunInput[]
    updateMany?: AnomalyEventUpdateManyWithWhereWithoutExperimentRunInput | AnomalyEventUpdateManyWithWhereWithoutExperimentRunInput[]
    deleteMany?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
  }

  export type TrainedModelUncheckedUpdateManyWithoutExperimentRunNestedInput = {
    create?: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput> | TrainedModelCreateWithoutExperimentRunInput[] | TrainedModelUncheckedCreateWithoutExperimentRunInput[]
    connectOrCreate?: TrainedModelCreateOrConnectWithoutExperimentRunInput | TrainedModelCreateOrConnectWithoutExperimentRunInput[]
    upsert?: TrainedModelUpsertWithWhereUniqueWithoutExperimentRunInput | TrainedModelUpsertWithWhereUniqueWithoutExperimentRunInput[]
    createMany?: TrainedModelCreateManyExperimentRunInputEnvelope
    set?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    disconnect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    delete?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    connect?: TrainedModelWhereUniqueInput | TrainedModelWhereUniqueInput[]
    update?: TrainedModelUpdateWithWhereUniqueWithoutExperimentRunInput | TrainedModelUpdateWithWhereUniqueWithoutExperimentRunInput[]
    updateMany?: TrainedModelUpdateManyWithWhereWithoutExperimentRunInput | TrainedModelUpdateManyWithWhereWithoutExperimentRunInput[]
    deleteMany?: TrainedModelScalarWhereInput | TrainedModelScalarWhereInput[]
  }

  export type AnalysisDatasetCreateNestedOneWithoutAnomalyEventsInput = {
    create?: XOR<AnalysisDatasetCreateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedCreateWithoutAnomalyEventsInput>
    connectOrCreate?: AnalysisDatasetCreateOrConnectWithoutAnomalyEventsInput
    connect?: AnalysisDatasetWhereUniqueInput
  }

  export type ExperimentRunCreateNestedOneWithoutAnomalyEventsInput = {
    create?: XOR<ExperimentRunCreateWithoutAnomalyEventsInput, ExperimentRunUncheckedCreateWithoutAnomalyEventsInput>
    connectOrCreate?: ExperimentRunCreateOrConnectWithoutAnomalyEventsInput
    connect?: ExperimentRunWhereUniqueInput
  }

  export type EventLabelLinkCreateNestedManyWithoutAnomalyEventInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput> | EventLabelLinkCreateWithoutAnomalyEventInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyEventInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyEventInput | EventLabelLinkCreateOrConnectWithoutAnomalyEventInput[]
    createMany?: EventLabelLinkCreateManyAnomalyEventInputEnvelope
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
  }

  export type EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyEventInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput> | EventLabelLinkCreateWithoutAnomalyEventInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyEventInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyEventInput | EventLabelLinkCreateOrConnectWithoutAnomalyEventInput[]
    createMany?: EventLabelLinkCreateManyAnomalyEventInputEnvelope
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AnalysisDatasetUpdateOneRequiredWithoutAnomalyEventsNestedInput = {
    create?: XOR<AnalysisDatasetCreateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedCreateWithoutAnomalyEventsInput>
    connectOrCreate?: AnalysisDatasetCreateOrConnectWithoutAnomalyEventsInput
    upsert?: AnalysisDatasetUpsertWithoutAnomalyEventsInput
    connect?: AnalysisDatasetWhereUniqueInput
    update?: XOR<XOR<AnalysisDatasetUpdateToOneWithWhereWithoutAnomalyEventsInput, AnalysisDatasetUpdateWithoutAnomalyEventsInput>, AnalysisDatasetUncheckedUpdateWithoutAnomalyEventsInput>
  }

  export type ExperimentRunUpdateOneWithoutAnomalyEventsNestedInput = {
    create?: XOR<ExperimentRunCreateWithoutAnomalyEventsInput, ExperimentRunUncheckedCreateWithoutAnomalyEventsInput>
    connectOrCreate?: ExperimentRunCreateOrConnectWithoutAnomalyEventsInput
    upsert?: ExperimentRunUpsertWithoutAnomalyEventsInput
    disconnect?: ExperimentRunWhereInput | boolean
    delete?: ExperimentRunWhereInput | boolean
    connect?: ExperimentRunWhereUniqueInput
    update?: XOR<XOR<ExperimentRunUpdateToOneWithWhereWithoutAnomalyEventsInput, ExperimentRunUpdateWithoutAnomalyEventsInput>, ExperimentRunUncheckedUpdateWithoutAnomalyEventsInput>
  }

  export type EventLabelLinkUpdateManyWithoutAnomalyEventNestedInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput> | EventLabelLinkCreateWithoutAnomalyEventInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyEventInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyEventInput | EventLabelLinkCreateOrConnectWithoutAnomalyEventInput[]
    upsert?: EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyEventInput | EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyEventInput[]
    createMany?: EventLabelLinkCreateManyAnomalyEventInputEnvelope
    set?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    disconnect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    delete?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    update?: EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyEventInput | EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyEventInput[]
    updateMany?: EventLabelLinkUpdateManyWithWhereWithoutAnomalyEventInput | EventLabelLinkUpdateManyWithWhereWithoutAnomalyEventInput[]
    deleteMany?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
  }

  export type EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventNestedInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput> | EventLabelLinkCreateWithoutAnomalyEventInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyEventInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyEventInput | EventLabelLinkCreateOrConnectWithoutAnomalyEventInput[]
    upsert?: EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyEventInput | EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyEventInput[]
    createMany?: EventLabelLinkCreateManyAnomalyEventInputEnvelope
    set?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    disconnect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    delete?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    update?: EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyEventInput | EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyEventInput[]
    updateMany?: EventLabelLinkUpdateManyWithWhereWithoutAnomalyEventInput | EventLabelLinkUpdateManyWithWhereWithoutAnomalyEventInput[]
    deleteMany?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
  }

  export type EventLabelLinkCreateNestedManyWithoutAnomalyLabelInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput> | EventLabelLinkCreateWithoutAnomalyLabelInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput | EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput[]
    createMany?: EventLabelLinkCreateManyAnomalyLabelInputEnvelope
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
  }

  export type EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyLabelInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput> | EventLabelLinkCreateWithoutAnomalyLabelInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput | EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput[]
    createMany?: EventLabelLinkCreateManyAnomalyLabelInputEnvelope
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
  }

  export type EventLabelLinkUpdateManyWithoutAnomalyLabelNestedInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput> | EventLabelLinkCreateWithoutAnomalyLabelInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput | EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput[]
    upsert?: EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyLabelInput | EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyLabelInput[]
    createMany?: EventLabelLinkCreateManyAnomalyLabelInputEnvelope
    set?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    disconnect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    delete?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    update?: EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyLabelInput | EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyLabelInput[]
    updateMany?: EventLabelLinkUpdateManyWithWhereWithoutAnomalyLabelInput | EventLabelLinkUpdateManyWithWhereWithoutAnomalyLabelInput[]
    deleteMany?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
  }

  export type EventLabelLinkUncheckedUpdateManyWithoutAnomalyLabelNestedInput = {
    create?: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput> | EventLabelLinkCreateWithoutAnomalyLabelInput[] | EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput[]
    connectOrCreate?: EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput | EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput[]
    upsert?: EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyLabelInput | EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyLabelInput[]
    createMany?: EventLabelLinkCreateManyAnomalyLabelInputEnvelope
    set?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    disconnect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    delete?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    connect?: EventLabelLinkWhereUniqueInput | EventLabelLinkWhereUniqueInput[]
    update?: EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyLabelInput | EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyLabelInput[]
    updateMany?: EventLabelLinkUpdateManyWithWhereWithoutAnomalyLabelInput | EventLabelLinkUpdateManyWithWhereWithoutAnomalyLabelInput[]
    deleteMany?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
  }

  export type AnomalyEventCreateNestedOneWithoutEventLabelLinksInput = {
    create?: XOR<AnomalyEventCreateWithoutEventLabelLinksInput, AnomalyEventUncheckedCreateWithoutEventLabelLinksInput>
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutEventLabelLinksInput
    connect?: AnomalyEventWhereUniqueInput
  }

  export type AnomalyLabelCreateNestedOneWithoutEventLabelLinksInput = {
    create?: XOR<AnomalyLabelCreateWithoutEventLabelLinksInput, AnomalyLabelUncheckedCreateWithoutEventLabelLinksInput>
    connectOrCreate?: AnomalyLabelCreateOrConnectWithoutEventLabelLinksInput
    connect?: AnomalyLabelWhereUniqueInput
  }

  export type AnomalyEventUpdateOneRequiredWithoutEventLabelLinksNestedInput = {
    create?: XOR<AnomalyEventCreateWithoutEventLabelLinksInput, AnomalyEventUncheckedCreateWithoutEventLabelLinksInput>
    connectOrCreate?: AnomalyEventCreateOrConnectWithoutEventLabelLinksInput
    upsert?: AnomalyEventUpsertWithoutEventLabelLinksInput
    connect?: AnomalyEventWhereUniqueInput
    update?: XOR<XOR<AnomalyEventUpdateToOneWithWhereWithoutEventLabelLinksInput, AnomalyEventUpdateWithoutEventLabelLinksInput>, AnomalyEventUncheckedUpdateWithoutEventLabelLinksInput>
  }

  export type AnomalyLabelUpdateOneRequiredWithoutEventLabelLinksNestedInput = {
    create?: XOR<AnomalyLabelCreateWithoutEventLabelLinksInput, AnomalyLabelUncheckedCreateWithoutEventLabelLinksInput>
    connectOrCreate?: AnomalyLabelCreateOrConnectWithoutEventLabelLinksInput
    upsert?: AnomalyLabelUpsertWithoutEventLabelLinksInput
    connect?: AnomalyLabelWhereUniqueInput
    update?: XOR<XOR<AnomalyLabelUpdateToOneWithWhereWithoutEventLabelLinksInput, AnomalyLabelUpdateWithoutEventLabelLinksInput>, AnomalyLabelUncheckedUpdateWithoutEventLabelLinksInput>
  }

  export type ExperimentRunCreateNestedOneWithoutTrainedModelsInput = {
    create?: XOR<ExperimentRunCreateWithoutTrainedModelsInput, ExperimentRunUncheckedCreateWithoutTrainedModelsInput>
    connectOrCreate?: ExperimentRunCreateOrConnectWithoutTrainedModelsInput
    connect?: ExperimentRunWhereUniqueInput
  }

  export type EvaluationRunCreateNestedManyWithoutTrainedModelInput = {
    create?: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput> | EvaluationRunCreateWithoutTrainedModelInput[] | EvaluationRunUncheckedCreateWithoutTrainedModelInput[]
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutTrainedModelInput | EvaluationRunCreateOrConnectWithoutTrainedModelInput[]
    createMany?: EvaluationRunCreateManyTrainedModelInputEnvelope
    connect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
  }

  export type EvaluationRunUncheckedCreateNestedManyWithoutTrainedModelInput = {
    create?: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput> | EvaluationRunCreateWithoutTrainedModelInput[] | EvaluationRunUncheckedCreateWithoutTrainedModelInput[]
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutTrainedModelInput | EvaluationRunCreateOrConnectWithoutTrainedModelInput[]
    createMany?: EvaluationRunCreateManyTrainedModelInputEnvelope
    connect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
  }

  export type ExperimentRunUpdateOneRequiredWithoutTrainedModelsNestedInput = {
    create?: XOR<ExperimentRunCreateWithoutTrainedModelsInput, ExperimentRunUncheckedCreateWithoutTrainedModelsInput>
    connectOrCreate?: ExperimentRunCreateOrConnectWithoutTrainedModelsInput
    upsert?: ExperimentRunUpsertWithoutTrainedModelsInput
    connect?: ExperimentRunWhereUniqueInput
    update?: XOR<XOR<ExperimentRunUpdateToOneWithWhereWithoutTrainedModelsInput, ExperimentRunUpdateWithoutTrainedModelsInput>, ExperimentRunUncheckedUpdateWithoutTrainedModelsInput>
  }

  export type EvaluationRunUpdateManyWithoutTrainedModelNestedInput = {
    create?: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput> | EvaluationRunCreateWithoutTrainedModelInput[] | EvaluationRunUncheckedCreateWithoutTrainedModelInput[]
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutTrainedModelInput | EvaluationRunCreateOrConnectWithoutTrainedModelInput[]
    upsert?: EvaluationRunUpsertWithWhereUniqueWithoutTrainedModelInput | EvaluationRunUpsertWithWhereUniqueWithoutTrainedModelInput[]
    createMany?: EvaluationRunCreateManyTrainedModelInputEnvelope
    set?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    disconnect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    delete?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    connect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    update?: EvaluationRunUpdateWithWhereUniqueWithoutTrainedModelInput | EvaluationRunUpdateWithWhereUniqueWithoutTrainedModelInput[]
    updateMany?: EvaluationRunUpdateManyWithWhereWithoutTrainedModelInput | EvaluationRunUpdateManyWithWhereWithoutTrainedModelInput[]
    deleteMany?: EvaluationRunScalarWhereInput | EvaluationRunScalarWhereInput[]
  }

  export type EvaluationRunUncheckedUpdateManyWithoutTrainedModelNestedInput = {
    create?: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput> | EvaluationRunCreateWithoutTrainedModelInput[] | EvaluationRunUncheckedCreateWithoutTrainedModelInput[]
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutTrainedModelInput | EvaluationRunCreateOrConnectWithoutTrainedModelInput[]
    upsert?: EvaluationRunUpsertWithWhereUniqueWithoutTrainedModelInput | EvaluationRunUpsertWithWhereUniqueWithoutTrainedModelInput[]
    createMany?: EvaluationRunCreateManyTrainedModelInputEnvelope
    set?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    disconnect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    delete?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    connect?: EvaluationRunWhereUniqueInput | EvaluationRunWhereUniqueInput[]
    update?: EvaluationRunUpdateWithWhereUniqueWithoutTrainedModelInput | EvaluationRunUpdateWithWhereUniqueWithoutTrainedModelInput[]
    updateMany?: EvaluationRunUpdateManyWithWhereWithoutTrainedModelInput | EvaluationRunUpdateManyWithWhereWithoutTrainedModelInput[]
    deleteMany?: EvaluationRunScalarWhereInput | EvaluationRunScalarWhereInput[]
  }

  export type TrainedModelCreateNestedOneWithoutEvaluationRunsInput = {
    create?: XOR<TrainedModelCreateWithoutEvaluationRunsInput, TrainedModelUncheckedCreateWithoutEvaluationRunsInput>
    connectOrCreate?: TrainedModelCreateOrConnectWithoutEvaluationRunsInput
    connect?: TrainedModelWhereUniqueInput
  }

  export type ModelPredictionCreateNestedManyWithoutEvaluationRunInput = {
    create?: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput> | ModelPredictionCreateWithoutEvaluationRunInput[] | ModelPredictionUncheckedCreateWithoutEvaluationRunInput[]
    connectOrCreate?: ModelPredictionCreateOrConnectWithoutEvaluationRunInput | ModelPredictionCreateOrConnectWithoutEvaluationRunInput[]
    createMany?: ModelPredictionCreateManyEvaluationRunInputEnvelope
    connect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
  }

  export type ModelPredictionUncheckedCreateNestedManyWithoutEvaluationRunInput = {
    create?: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput> | ModelPredictionCreateWithoutEvaluationRunInput[] | ModelPredictionUncheckedCreateWithoutEvaluationRunInput[]
    connectOrCreate?: ModelPredictionCreateOrConnectWithoutEvaluationRunInput | ModelPredictionCreateOrConnectWithoutEvaluationRunInput[]
    createMany?: ModelPredictionCreateManyEvaluationRunInputEnvelope
    connect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
  }

  export type TrainedModelUpdateOneRequiredWithoutEvaluationRunsNestedInput = {
    create?: XOR<TrainedModelCreateWithoutEvaluationRunsInput, TrainedModelUncheckedCreateWithoutEvaluationRunsInput>
    connectOrCreate?: TrainedModelCreateOrConnectWithoutEvaluationRunsInput
    upsert?: TrainedModelUpsertWithoutEvaluationRunsInput
    connect?: TrainedModelWhereUniqueInput
    update?: XOR<XOR<TrainedModelUpdateToOneWithWhereWithoutEvaluationRunsInput, TrainedModelUpdateWithoutEvaluationRunsInput>, TrainedModelUncheckedUpdateWithoutEvaluationRunsInput>
  }

  export type ModelPredictionUpdateManyWithoutEvaluationRunNestedInput = {
    create?: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput> | ModelPredictionCreateWithoutEvaluationRunInput[] | ModelPredictionUncheckedCreateWithoutEvaluationRunInput[]
    connectOrCreate?: ModelPredictionCreateOrConnectWithoutEvaluationRunInput | ModelPredictionCreateOrConnectWithoutEvaluationRunInput[]
    upsert?: ModelPredictionUpsertWithWhereUniqueWithoutEvaluationRunInput | ModelPredictionUpsertWithWhereUniqueWithoutEvaluationRunInput[]
    createMany?: ModelPredictionCreateManyEvaluationRunInputEnvelope
    set?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    disconnect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    delete?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    connect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    update?: ModelPredictionUpdateWithWhereUniqueWithoutEvaluationRunInput | ModelPredictionUpdateWithWhereUniqueWithoutEvaluationRunInput[]
    updateMany?: ModelPredictionUpdateManyWithWhereWithoutEvaluationRunInput | ModelPredictionUpdateManyWithWhereWithoutEvaluationRunInput[]
    deleteMany?: ModelPredictionScalarWhereInput | ModelPredictionScalarWhereInput[]
  }

  export type ModelPredictionUncheckedUpdateManyWithoutEvaluationRunNestedInput = {
    create?: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput> | ModelPredictionCreateWithoutEvaluationRunInput[] | ModelPredictionUncheckedCreateWithoutEvaluationRunInput[]
    connectOrCreate?: ModelPredictionCreateOrConnectWithoutEvaluationRunInput | ModelPredictionCreateOrConnectWithoutEvaluationRunInput[]
    upsert?: ModelPredictionUpsertWithWhereUniqueWithoutEvaluationRunInput | ModelPredictionUpsertWithWhereUniqueWithoutEvaluationRunInput[]
    createMany?: ModelPredictionCreateManyEvaluationRunInputEnvelope
    set?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    disconnect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    delete?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    connect?: ModelPredictionWhereUniqueInput | ModelPredictionWhereUniqueInput[]
    update?: ModelPredictionUpdateWithWhereUniqueWithoutEvaluationRunInput | ModelPredictionUpdateWithWhereUniqueWithoutEvaluationRunInput[]
    updateMany?: ModelPredictionUpdateManyWithWhereWithoutEvaluationRunInput | ModelPredictionUpdateManyWithWhereWithoutEvaluationRunInput[]
    deleteMany?: ModelPredictionScalarWhereInput | ModelPredictionScalarWhereInput[]
  }

  export type EvaluationRunCreateNestedOneWithoutPredictionsInput = {
    create?: XOR<EvaluationRunCreateWithoutPredictionsInput, EvaluationRunUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutPredictionsInput
    connect?: EvaluationRunWhereUniqueInput
  }

  export type EvaluationRunUpdateOneRequiredWithoutPredictionsNestedInput = {
    create?: XOR<EvaluationRunCreateWithoutPredictionsInput, EvaluationRunUncheckedCreateWithoutPredictionsInput>
    connectOrCreate?: EvaluationRunCreateOrConnectWithoutPredictionsInput
    upsert?: EvaluationRunUpsertWithoutPredictionsInput
    connect?: EvaluationRunWhereUniqueInput
    update?: XOR<XOR<EvaluationRunUpdateToOneWithWhereWithoutPredictionsInput, EvaluationRunUpdateWithoutPredictionsInput>, EvaluationRunUncheckedUpdateWithoutPredictionsInput>
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AnalysisReadyDataCreateWithoutDatasetInput = {
    id?: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
  }

  export type AnalysisReadyDataUncheckedCreateWithoutDatasetInput = {
    id?: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
  }

  export type AnalysisReadyDataCreateOrConnectWithoutDatasetInput = {
    where: AnalysisReadyDataWhereUniqueInput
    create: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput>
  }

  export type AnalysisReadyDataCreateManyDatasetInputEnvelope = {
    data: AnalysisReadyDataCreateManyDatasetInput | AnalysisReadyDataCreateManyDatasetInput[]
  }

  export type AnomalyEventCreateWithoutDatasetInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRun?: ExperimentRunCreateNestedOneWithoutAnomalyEventsInput
    eventLabelLinks?: EventLabelLinkCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventUncheckedCreateWithoutDatasetInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRunId?: string | null
    eventLabelLinks?: EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventCreateOrConnectWithoutDatasetInput = {
    where: AnomalyEventWhereUniqueInput
    create: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput>
  }

  export type AnomalyEventCreateManyDatasetInputEnvelope = {
    data: AnomalyEventCreateManyDatasetInput | AnomalyEventCreateManyDatasetInput[]
  }

  export type AnalysisReadyDataUpsertWithWhereUniqueWithoutDatasetInput = {
    where: AnalysisReadyDataWhereUniqueInput
    update: XOR<AnalysisReadyDataUpdateWithoutDatasetInput, AnalysisReadyDataUncheckedUpdateWithoutDatasetInput>
    create: XOR<AnalysisReadyDataCreateWithoutDatasetInput, AnalysisReadyDataUncheckedCreateWithoutDatasetInput>
  }

  export type AnalysisReadyDataUpdateWithWhereUniqueWithoutDatasetInput = {
    where: AnalysisReadyDataWhereUniqueInput
    data: XOR<AnalysisReadyDataUpdateWithoutDatasetInput, AnalysisReadyDataUncheckedUpdateWithoutDatasetInput>
  }

  export type AnalysisReadyDataUpdateManyWithWhereWithoutDatasetInput = {
    where: AnalysisReadyDataScalarWhereInput
    data: XOR<AnalysisReadyDataUpdateManyMutationInput, AnalysisReadyDataUncheckedUpdateManyWithoutDatasetInput>
  }

  export type AnalysisReadyDataScalarWhereInput = {
    AND?: AnalysisReadyDataScalarWhereInput | AnalysisReadyDataScalarWhereInput[]
    OR?: AnalysisReadyDataScalarWhereInput[]
    NOT?: AnalysisReadyDataScalarWhereInput | AnalysisReadyDataScalarWhereInput[]
    id?: StringFilter<"AnalysisReadyData"> | string
    datasetId?: StringFilter<"AnalysisReadyData"> | string
    timestamp?: DateTimeFilter<"AnalysisReadyData"> | Date | string
    room?: StringFilter<"AnalysisReadyData"> | string
    rawWattageL1?: FloatFilter<"AnalysisReadyData"> | number
    rawWattageL2?: FloatFilter<"AnalysisReadyData"> | number
    wattage110v?: FloatFilter<"AnalysisReadyData"> | number
    wattage220v?: FloatFilter<"AnalysisReadyData"> | number
    wattageTotal?: FloatFilter<"AnalysisReadyData"> | number
    isPositiveLabel?: BoolFilter<"AnalysisReadyData"> | boolean
    sourceAnomalyEventId?: StringNullableFilter<"AnalysisReadyData"> | string | null
  }

  export type AnomalyEventUpsertWithWhereUniqueWithoutDatasetInput = {
    where: AnomalyEventWhereUniqueInput
    update: XOR<AnomalyEventUpdateWithoutDatasetInput, AnomalyEventUncheckedUpdateWithoutDatasetInput>
    create: XOR<AnomalyEventCreateWithoutDatasetInput, AnomalyEventUncheckedCreateWithoutDatasetInput>
  }

  export type AnomalyEventUpdateWithWhereUniqueWithoutDatasetInput = {
    where: AnomalyEventWhereUniqueInput
    data: XOR<AnomalyEventUpdateWithoutDatasetInput, AnomalyEventUncheckedUpdateWithoutDatasetInput>
  }

  export type AnomalyEventUpdateManyWithWhereWithoutDatasetInput = {
    where: AnomalyEventScalarWhereInput
    data: XOR<AnomalyEventUpdateManyMutationInput, AnomalyEventUncheckedUpdateManyWithoutDatasetInput>
  }

  export type AnomalyEventScalarWhereInput = {
    AND?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
    OR?: AnomalyEventScalarWhereInput[]
    NOT?: AnomalyEventScalarWhereInput | AnomalyEventScalarWhereInput[]
    id?: StringFilter<"AnomalyEvent"> | string
    eventId?: StringFilter<"AnomalyEvent"> | string
    name?: StringFilter<"AnomalyEvent"> | string
    datasetId?: StringFilter<"AnomalyEvent"> | string
    line?: StringFilter<"AnomalyEvent"> | string
    eventTimestamp?: DateTimeFilter<"AnomalyEvent"> | Date | string
    detectionRule?: StringFilter<"AnomalyEvent"> | string
    score?: FloatFilter<"AnomalyEvent"> | number
    dataWindow?: StringFilter<"AnomalyEvent"> | string
    status?: StringFilter<"AnomalyEvent"> | string
    reviewerId?: StringNullableFilter<"AnomalyEvent"> | string | null
    reviewTimestamp?: DateTimeNullableFilter<"AnomalyEvent"> | Date | string | null
    justificationNotes?: StringNullableFilter<"AnomalyEvent"> | string | null
    createdAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    updatedAt?: DateTimeFilter<"AnomalyEvent"> | Date | string
    experimentRunId?: StringNullableFilter<"AnomalyEvent"> | string | null
  }

  export type AnalysisDatasetCreateWithoutAnalysisDataInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    anomalyEvents?: AnomalyEventCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetUncheckedCreateWithoutAnalysisDataInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    anomalyEvents?: AnomalyEventUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetCreateOrConnectWithoutAnalysisDataInput = {
    where: AnalysisDatasetWhereUniqueInput
    create: XOR<AnalysisDatasetCreateWithoutAnalysisDataInput, AnalysisDatasetUncheckedCreateWithoutAnalysisDataInput>
  }

  export type AnalysisDatasetUpsertWithoutAnalysisDataInput = {
    update: XOR<AnalysisDatasetUpdateWithoutAnalysisDataInput, AnalysisDatasetUncheckedUpdateWithoutAnalysisDataInput>
    create: XOR<AnalysisDatasetCreateWithoutAnalysisDataInput, AnalysisDatasetUncheckedCreateWithoutAnalysisDataInput>
    where?: AnalysisDatasetWhereInput
  }

  export type AnalysisDatasetUpdateToOneWithWhereWithoutAnalysisDataInput = {
    where?: AnalysisDatasetWhereInput
    data: XOR<AnalysisDatasetUpdateWithoutAnalysisDataInput, AnalysisDatasetUncheckedUpdateWithoutAnalysisDataInput>
  }

  export type AnalysisDatasetUpdateWithoutAnalysisDataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anomalyEvents?: AnomalyEventUpdateManyWithoutDatasetNestedInput
  }

  export type AnalysisDatasetUncheckedUpdateWithoutAnalysisDataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anomalyEvents?: AnomalyEventUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type AnomalyEventCreateWithoutExperimentRunInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dataset: AnalysisDatasetCreateNestedOneWithoutAnomalyEventsInput
    eventLabelLinks?: EventLabelLinkCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventUncheckedCreateWithoutExperimentRunInput = {
    id?: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventLabelLinks?: EventLabelLinkUncheckedCreateNestedManyWithoutAnomalyEventInput
  }

  export type AnomalyEventCreateOrConnectWithoutExperimentRunInput = {
    where: AnomalyEventWhereUniqueInput
    create: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput>
  }

  export type AnomalyEventCreateManyExperimentRunInputEnvelope = {
    data: AnomalyEventCreateManyExperimentRunInput | AnomalyEventCreateManyExperimentRunInput[]
  }

  export type TrainedModelCreateWithoutExperimentRunInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    evaluationRuns?: EvaluationRunCreateNestedManyWithoutTrainedModelInput
  }

  export type TrainedModelUncheckedCreateWithoutExperimentRunInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    evaluationRuns?: EvaluationRunUncheckedCreateNestedManyWithoutTrainedModelInput
  }

  export type TrainedModelCreateOrConnectWithoutExperimentRunInput = {
    where: TrainedModelWhereUniqueInput
    create: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput>
  }

  export type TrainedModelCreateManyExperimentRunInputEnvelope = {
    data: TrainedModelCreateManyExperimentRunInput | TrainedModelCreateManyExperimentRunInput[]
  }

  export type AnomalyEventUpsertWithWhereUniqueWithoutExperimentRunInput = {
    where: AnomalyEventWhereUniqueInput
    update: XOR<AnomalyEventUpdateWithoutExperimentRunInput, AnomalyEventUncheckedUpdateWithoutExperimentRunInput>
    create: XOR<AnomalyEventCreateWithoutExperimentRunInput, AnomalyEventUncheckedCreateWithoutExperimentRunInput>
  }

  export type AnomalyEventUpdateWithWhereUniqueWithoutExperimentRunInput = {
    where: AnomalyEventWhereUniqueInput
    data: XOR<AnomalyEventUpdateWithoutExperimentRunInput, AnomalyEventUncheckedUpdateWithoutExperimentRunInput>
  }

  export type AnomalyEventUpdateManyWithWhereWithoutExperimentRunInput = {
    where: AnomalyEventScalarWhereInput
    data: XOR<AnomalyEventUpdateManyMutationInput, AnomalyEventUncheckedUpdateManyWithoutExperimentRunInput>
  }

  export type TrainedModelUpsertWithWhereUniqueWithoutExperimentRunInput = {
    where: TrainedModelWhereUniqueInput
    update: XOR<TrainedModelUpdateWithoutExperimentRunInput, TrainedModelUncheckedUpdateWithoutExperimentRunInput>
    create: XOR<TrainedModelCreateWithoutExperimentRunInput, TrainedModelUncheckedCreateWithoutExperimentRunInput>
  }

  export type TrainedModelUpdateWithWhereUniqueWithoutExperimentRunInput = {
    where: TrainedModelWhereUniqueInput
    data: XOR<TrainedModelUpdateWithoutExperimentRunInput, TrainedModelUncheckedUpdateWithoutExperimentRunInput>
  }

  export type TrainedModelUpdateManyWithWhereWithoutExperimentRunInput = {
    where: TrainedModelScalarWhereInput
    data: XOR<TrainedModelUpdateManyMutationInput, TrainedModelUncheckedUpdateManyWithoutExperimentRunInput>
  }

  export type TrainedModelScalarWhereInput = {
    AND?: TrainedModelScalarWhereInput | TrainedModelScalarWhereInput[]
    OR?: TrainedModelScalarWhereInput[]
    NOT?: TrainedModelScalarWhereInput | TrainedModelScalarWhereInput[]
    id?: StringFilter<"TrainedModel"> | string
    name?: StringFilter<"TrainedModel"> | string
    scenarioType?: StringFilter<"TrainedModel"> | string
    status?: StringFilter<"TrainedModel"> | string
    experimentRunId?: StringFilter<"TrainedModel"> | string
    modelConfig?: StringFilter<"TrainedModel"> | string
    dataSourceConfig?: StringFilter<"TrainedModel"> | string
    modelPath?: StringNullableFilter<"TrainedModel"> | string | null
    trainingMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    validationMetrics?: StringNullableFilter<"TrainedModel"> | string | null
    trainingLogs?: StringNullableFilter<"TrainedModel"> | string | null
    jobId?: StringNullableFilter<"TrainedModel"> | string | null
    createdAt?: DateTimeFilter<"TrainedModel"> | Date | string
    startedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TrainedModel"> | Date | string | null
  }

  export type AnalysisDatasetCreateWithoutAnomalyEventsInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    analysisData?: AnalysisReadyDataCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetUncheckedCreateWithoutAnomalyEventsInput = {
    id?: string
    name: string
    description?: string | null
    building: string
    floor: string
    room: string
    startDate: Date | string
    endDate: Date | string
    occupantType: string
    meterIdL1: string
    meterIdL2: string
    totalRecords: number
    positiveLabels: number
    createdAt?: Date | string
    analysisData?: AnalysisReadyDataUncheckedCreateNestedManyWithoutDatasetInput
  }

  export type AnalysisDatasetCreateOrConnectWithoutAnomalyEventsInput = {
    where: AnalysisDatasetWhereUniqueInput
    create: XOR<AnalysisDatasetCreateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedCreateWithoutAnomalyEventsInput>
  }

  export type ExperimentRunCreateWithoutAnomalyEventsInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    trainedModels?: TrainedModelCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunUncheckedCreateWithoutAnomalyEventsInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    trainedModels?: TrainedModelUncheckedCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunCreateOrConnectWithoutAnomalyEventsInput = {
    where: ExperimentRunWhereUniqueInput
    create: XOR<ExperimentRunCreateWithoutAnomalyEventsInput, ExperimentRunUncheckedCreateWithoutAnomalyEventsInput>
  }

  export type EventLabelLinkCreateWithoutAnomalyEventInput = {
    id?: string
    createdAt?: Date | string
    anomalyLabel: AnomalyLabelCreateNestedOneWithoutEventLabelLinksInput
  }

  export type EventLabelLinkUncheckedCreateWithoutAnomalyEventInput = {
    id?: string
    labelId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkCreateOrConnectWithoutAnomalyEventInput = {
    where: EventLabelLinkWhereUniqueInput
    create: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput>
  }

  export type EventLabelLinkCreateManyAnomalyEventInputEnvelope = {
    data: EventLabelLinkCreateManyAnomalyEventInput | EventLabelLinkCreateManyAnomalyEventInput[]
  }

  export type AnalysisDatasetUpsertWithoutAnomalyEventsInput = {
    update: XOR<AnalysisDatasetUpdateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedUpdateWithoutAnomalyEventsInput>
    create: XOR<AnalysisDatasetCreateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedCreateWithoutAnomalyEventsInput>
    where?: AnalysisDatasetWhereInput
  }

  export type AnalysisDatasetUpdateToOneWithWhereWithoutAnomalyEventsInput = {
    where?: AnalysisDatasetWhereInput
    data: XOR<AnalysisDatasetUpdateWithoutAnomalyEventsInput, AnalysisDatasetUncheckedUpdateWithoutAnomalyEventsInput>
  }

  export type AnalysisDatasetUpdateWithoutAnomalyEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisData?: AnalysisReadyDataUpdateManyWithoutDatasetNestedInput
  }

  export type AnalysisDatasetUncheckedUpdateWithoutAnomalyEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    building?: StringFieldUpdateOperationsInput | string
    floor?: StringFieldUpdateOperationsInput | string
    room?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    occupantType?: StringFieldUpdateOperationsInput | string
    meterIdL1?: StringFieldUpdateOperationsInput | string
    meterIdL2?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    positiveLabels?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysisData?: AnalysisReadyDataUncheckedUpdateManyWithoutDatasetNestedInput
  }

  export type ExperimentRunUpsertWithoutAnomalyEventsInput = {
    update: XOR<ExperimentRunUpdateWithoutAnomalyEventsInput, ExperimentRunUncheckedUpdateWithoutAnomalyEventsInput>
    create: XOR<ExperimentRunCreateWithoutAnomalyEventsInput, ExperimentRunUncheckedCreateWithoutAnomalyEventsInput>
    where?: ExperimentRunWhereInput
  }

  export type ExperimentRunUpdateToOneWithWhereWithoutAnomalyEventsInput = {
    where?: ExperimentRunWhereInput
    data: XOR<ExperimentRunUpdateWithoutAnomalyEventsInput, ExperimentRunUncheckedUpdateWithoutAnomalyEventsInput>
  }

  export type ExperimentRunUpdateWithoutAnomalyEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    trainedModels?: TrainedModelUpdateManyWithoutExperimentRunNestedInput
  }

  export type ExperimentRunUncheckedUpdateWithoutAnomalyEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    trainedModels?: TrainedModelUncheckedUpdateManyWithoutExperimentRunNestedInput
  }

  export type EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyEventInput = {
    where: EventLabelLinkWhereUniqueInput
    update: XOR<EventLabelLinkUpdateWithoutAnomalyEventInput, EventLabelLinkUncheckedUpdateWithoutAnomalyEventInput>
    create: XOR<EventLabelLinkCreateWithoutAnomalyEventInput, EventLabelLinkUncheckedCreateWithoutAnomalyEventInput>
  }

  export type EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyEventInput = {
    where: EventLabelLinkWhereUniqueInput
    data: XOR<EventLabelLinkUpdateWithoutAnomalyEventInput, EventLabelLinkUncheckedUpdateWithoutAnomalyEventInput>
  }

  export type EventLabelLinkUpdateManyWithWhereWithoutAnomalyEventInput = {
    where: EventLabelLinkScalarWhereInput
    data: XOR<EventLabelLinkUpdateManyMutationInput, EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventInput>
  }

  export type EventLabelLinkScalarWhereInput = {
    AND?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
    OR?: EventLabelLinkScalarWhereInput[]
    NOT?: EventLabelLinkScalarWhereInput | EventLabelLinkScalarWhereInput[]
    id?: StringFilter<"EventLabelLink"> | string
    eventId?: StringFilter<"EventLabelLink"> | string
    labelId?: StringFilter<"EventLabelLink"> | string
    createdAt?: DateTimeFilter<"EventLabelLink"> | Date | string
  }

  export type EventLabelLinkCreateWithoutAnomalyLabelInput = {
    id?: string
    createdAt?: Date | string
    anomalyEvent: AnomalyEventCreateNestedOneWithoutEventLabelLinksInput
  }

  export type EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput = {
    id?: string
    eventId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkCreateOrConnectWithoutAnomalyLabelInput = {
    where: EventLabelLinkWhereUniqueInput
    create: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput>
  }

  export type EventLabelLinkCreateManyAnomalyLabelInputEnvelope = {
    data: EventLabelLinkCreateManyAnomalyLabelInput | EventLabelLinkCreateManyAnomalyLabelInput[]
  }

  export type EventLabelLinkUpsertWithWhereUniqueWithoutAnomalyLabelInput = {
    where: EventLabelLinkWhereUniqueInput
    update: XOR<EventLabelLinkUpdateWithoutAnomalyLabelInput, EventLabelLinkUncheckedUpdateWithoutAnomalyLabelInput>
    create: XOR<EventLabelLinkCreateWithoutAnomalyLabelInput, EventLabelLinkUncheckedCreateWithoutAnomalyLabelInput>
  }

  export type EventLabelLinkUpdateWithWhereUniqueWithoutAnomalyLabelInput = {
    where: EventLabelLinkWhereUniqueInput
    data: XOR<EventLabelLinkUpdateWithoutAnomalyLabelInput, EventLabelLinkUncheckedUpdateWithoutAnomalyLabelInput>
  }

  export type EventLabelLinkUpdateManyWithWhereWithoutAnomalyLabelInput = {
    where: EventLabelLinkScalarWhereInput
    data: XOR<EventLabelLinkUpdateManyMutationInput, EventLabelLinkUncheckedUpdateManyWithoutAnomalyLabelInput>
  }

  export type AnomalyEventCreateWithoutEventLabelLinksInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dataset: AnalysisDatasetCreateNestedOneWithoutAnomalyEventsInput
    experimentRun?: ExperimentRunCreateNestedOneWithoutAnomalyEventsInput
  }

  export type AnomalyEventUncheckedCreateWithoutEventLabelLinksInput = {
    id?: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRunId?: string | null
  }

  export type AnomalyEventCreateOrConnectWithoutEventLabelLinksInput = {
    where: AnomalyEventWhereUniqueInput
    create: XOR<AnomalyEventCreateWithoutEventLabelLinksInput, AnomalyEventUncheckedCreateWithoutEventLabelLinksInput>
  }

  export type AnomalyLabelCreateWithoutEventLabelLinksInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnomalyLabelUncheckedCreateWithoutEventLabelLinksInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AnomalyLabelCreateOrConnectWithoutEventLabelLinksInput = {
    where: AnomalyLabelWhereUniqueInput
    create: XOR<AnomalyLabelCreateWithoutEventLabelLinksInput, AnomalyLabelUncheckedCreateWithoutEventLabelLinksInput>
  }

  export type AnomalyEventUpsertWithoutEventLabelLinksInput = {
    update: XOR<AnomalyEventUpdateWithoutEventLabelLinksInput, AnomalyEventUncheckedUpdateWithoutEventLabelLinksInput>
    create: XOR<AnomalyEventCreateWithoutEventLabelLinksInput, AnomalyEventUncheckedCreateWithoutEventLabelLinksInput>
    where?: AnomalyEventWhereInput
  }

  export type AnomalyEventUpdateToOneWithWhereWithoutEventLabelLinksInput = {
    where?: AnomalyEventWhereInput
    data: XOR<AnomalyEventUpdateWithoutEventLabelLinksInput, AnomalyEventUncheckedUpdateWithoutEventLabelLinksInput>
  }

  export type AnomalyEventUpdateWithoutEventLabelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: AnalysisDatasetUpdateOneRequiredWithoutAnomalyEventsNestedInput
    experimentRun?: ExperimentRunUpdateOneWithoutAnomalyEventsNestedInput
  }

  export type AnomalyEventUncheckedUpdateWithoutEventLabelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRunId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnomalyLabelUpsertWithoutEventLabelLinksInput = {
    update: XOR<AnomalyLabelUpdateWithoutEventLabelLinksInput, AnomalyLabelUncheckedUpdateWithoutEventLabelLinksInput>
    create: XOR<AnomalyLabelCreateWithoutEventLabelLinksInput, AnomalyLabelUncheckedCreateWithoutEventLabelLinksInput>
    where?: AnomalyLabelWhereInput
  }

  export type AnomalyLabelUpdateToOneWithWhereWithoutEventLabelLinksInput = {
    where?: AnomalyLabelWhereInput
    data: XOR<AnomalyLabelUpdateWithoutEventLabelLinksInput, AnomalyLabelUncheckedUpdateWithoutEventLabelLinksInput>
  }

  export type AnomalyLabelUpdateWithoutEventLabelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnomalyLabelUncheckedUpdateWithoutEventLabelLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperimentRunCreateWithoutTrainedModelsInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    anomalyEvents?: AnomalyEventCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunUncheckedCreateWithoutTrainedModelsInput = {
    id?: string
    name: string
    description?: string | null
    filteringParameters?: string | null
    status?: string
    candidateCount?: number | null
    positiveLabelCount?: number | null
    negativeLabelCount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    candidateStats?: string | null
    anomalyEvents?: AnomalyEventUncheckedCreateNestedManyWithoutExperimentRunInput
  }

  export type ExperimentRunCreateOrConnectWithoutTrainedModelsInput = {
    where: ExperimentRunWhereUniqueInput
    create: XOR<ExperimentRunCreateWithoutTrainedModelsInput, ExperimentRunUncheckedCreateWithoutTrainedModelsInput>
  }

  export type EvaluationRunCreateWithoutTrainedModelInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    predictions?: ModelPredictionCreateNestedManyWithoutEvaluationRunInput
  }

  export type EvaluationRunUncheckedCreateWithoutTrainedModelInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    predictions?: ModelPredictionUncheckedCreateNestedManyWithoutEvaluationRunInput
  }

  export type EvaluationRunCreateOrConnectWithoutTrainedModelInput = {
    where: EvaluationRunWhereUniqueInput
    create: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput>
  }

  export type EvaluationRunCreateManyTrainedModelInputEnvelope = {
    data: EvaluationRunCreateManyTrainedModelInput | EvaluationRunCreateManyTrainedModelInput[]
  }

  export type ExperimentRunUpsertWithoutTrainedModelsInput = {
    update: XOR<ExperimentRunUpdateWithoutTrainedModelsInput, ExperimentRunUncheckedUpdateWithoutTrainedModelsInput>
    create: XOR<ExperimentRunCreateWithoutTrainedModelsInput, ExperimentRunUncheckedCreateWithoutTrainedModelsInput>
    where?: ExperimentRunWhereInput
  }

  export type ExperimentRunUpdateToOneWithWhereWithoutTrainedModelsInput = {
    where?: ExperimentRunWhereInput
    data: XOR<ExperimentRunUpdateWithoutTrainedModelsInput, ExperimentRunUncheckedUpdateWithoutTrainedModelsInput>
  }

  export type ExperimentRunUpdateWithoutTrainedModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    anomalyEvents?: AnomalyEventUpdateManyWithoutExperimentRunNestedInput
  }

  export type ExperimentRunUncheckedUpdateWithoutTrainedModelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    filteringParameters?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    candidateCount?: NullableIntFieldUpdateOperationsInput | number | null
    positiveLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    negativeLabelCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    candidateStats?: NullableStringFieldUpdateOperationsInput | string | null
    anomalyEvents?: AnomalyEventUncheckedUpdateManyWithoutExperimentRunNestedInput
  }

  export type EvaluationRunUpsertWithWhereUniqueWithoutTrainedModelInput = {
    where: EvaluationRunWhereUniqueInput
    update: XOR<EvaluationRunUpdateWithoutTrainedModelInput, EvaluationRunUncheckedUpdateWithoutTrainedModelInput>
    create: XOR<EvaluationRunCreateWithoutTrainedModelInput, EvaluationRunUncheckedCreateWithoutTrainedModelInput>
  }

  export type EvaluationRunUpdateWithWhereUniqueWithoutTrainedModelInput = {
    where: EvaluationRunWhereUniqueInput
    data: XOR<EvaluationRunUpdateWithoutTrainedModelInput, EvaluationRunUncheckedUpdateWithoutTrainedModelInput>
  }

  export type EvaluationRunUpdateManyWithWhereWithoutTrainedModelInput = {
    where: EvaluationRunScalarWhereInput
    data: XOR<EvaluationRunUpdateManyMutationInput, EvaluationRunUncheckedUpdateManyWithoutTrainedModelInput>
  }

  export type EvaluationRunScalarWhereInput = {
    AND?: EvaluationRunScalarWhereInput | EvaluationRunScalarWhereInput[]
    OR?: EvaluationRunScalarWhereInput[]
    NOT?: EvaluationRunScalarWhereInput | EvaluationRunScalarWhereInput[]
    id?: StringFilter<"EvaluationRun"> | string
    name?: StringFilter<"EvaluationRun"> | string
    scenarioType?: StringFilter<"EvaluationRun"> | string
    status?: StringFilter<"EvaluationRun"> | string
    trainedModelId?: StringFilter<"EvaluationRun"> | string
    testSetSource?: StringFilter<"EvaluationRun"> | string
    evaluationMetrics?: StringNullableFilter<"EvaluationRun"> | string | null
    jobId?: StringNullableFilter<"EvaluationRun"> | string | null
    createdAt?: DateTimeFilter<"EvaluationRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"EvaluationRun"> | Date | string | null
  }

  export type TrainedModelCreateWithoutEvaluationRunsInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    experimentRun: ExperimentRunCreateNestedOneWithoutTrainedModelsInput
  }

  export type TrainedModelUncheckedCreateWithoutEvaluationRunsInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    experimentRunId: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type TrainedModelCreateOrConnectWithoutEvaluationRunsInput = {
    where: TrainedModelWhereUniqueInput
    create: XOR<TrainedModelCreateWithoutEvaluationRunsInput, TrainedModelUncheckedCreateWithoutEvaluationRunsInput>
  }

  export type ModelPredictionCreateWithoutEvaluationRunInput = {
    id?: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
  }

  export type ModelPredictionUncheckedCreateWithoutEvaluationRunInput = {
    id?: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
  }

  export type ModelPredictionCreateOrConnectWithoutEvaluationRunInput = {
    where: ModelPredictionWhereUniqueInput
    create: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput>
  }

  export type ModelPredictionCreateManyEvaluationRunInputEnvelope = {
    data: ModelPredictionCreateManyEvaluationRunInput | ModelPredictionCreateManyEvaluationRunInput[]
  }

  export type TrainedModelUpsertWithoutEvaluationRunsInput = {
    update: XOR<TrainedModelUpdateWithoutEvaluationRunsInput, TrainedModelUncheckedUpdateWithoutEvaluationRunsInput>
    create: XOR<TrainedModelCreateWithoutEvaluationRunsInput, TrainedModelUncheckedCreateWithoutEvaluationRunsInput>
    where?: TrainedModelWhereInput
  }

  export type TrainedModelUpdateToOneWithWhereWithoutEvaluationRunsInput = {
    where?: TrainedModelWhereInput
    data: XOR<TrainedModelUpdateWithoutEvaluationRunsInput, TrainedModelUncheckedUpdateWithoutEvaluationRunsInput>
  }

  export type TrainedModelUpdateWithoutEvaluationRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    experimentRun?: ExperimentRunUpdateOneRequiredWithoutTrainedModelsNestedInput
  }

  export type TrainedModelUncheckedUpdateWithoutEvaluationRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    experimentRunId?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ModelPredictionUpsertWithWhereUniqueWithoutEvaluationRunInput = {
    where: ModelPredictionWhereUniqueInput
    update: XOR<ModelPredictionUpdateWithoutEvaluationRunInput, ModelPredictionUncheckedUpdateWithoutEvaluationRunInput>
    create: XOR<ModelPredictionCreateWithoutEvaluationRunInput, ModelPredictionUncheckedCreateWithoutEvaluationRunInput>
  }

  export type ModelPredictionUpdateWithWhereUniqueWithoutEvaluationRunInput = {
    where: ModelPredictionWhereUniqueInput
    data: XOR<ModelPredictionUpdateWithoutEvaluationRunInput, ModelPredictionUncheckedUpdateWithoutEvaluationRunInput>
  }

  export type ModelPredictionUpdateManyWithWhereWithoutEvaluationRunInput = {
    where: ModelPredictionScalarWhereInput
    data: XOR<ModelPredictionUpdateManyMutationInput, ModelPredictionUncheckedUpdateManyWithoutEvaluationRunInput>
  }

  export type ModelPredictionScalarWhereInput = {
    AND?: ModelPredictionScalarWhereInput | ModelPredictionScalarWhereInput[]
    OR?: ModelPredictionScalarWhereInput[]
    NOT?: ModelPredictionScalarWhereInput | ModelPredictionScalarWhereInput[]
    id?: StringFilter<"ModelPrediction"> | string
    evaluationRunId?: StringFilter<"ModelPrediction"> | string
    timestamp?: DateTimeFilter<"ModelPrediction"> | Date | string
    predictionScore?: FloatFilter<"ModelPrediction"> | number
    groundTruth?: IntNullableFilter<"ModelPrediction"> | number | null
  }

  export type EvaluationRunCreateWithoutPredictionsInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    trainedModel: TrainedModelCreateNestedOneWithoutEvaluationRunsInput
  }

  export type EvaluationRunUncheckedCreateWithoutPredictionsInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    trainedModelId: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type EvaluationRunCreateOrConnectWithoutPredictionsInput = {
    where: EvaluationRunWhereUniqueInput
    create: XOR<EvaluationRunCreateWithoutPredictionsInput, EvaluationRunUncheckedCreateWithoutPredictionsInput>
  }

  export type EvaluationRunUpsertWithoutPredictionsInput = {
    update: XOR<EvaluationRunUpdateWithoutPredictionsInput, EvaluationRunUncheckedUpdateWithoutPredictionsInput>
    create: XOR<EvaluationRunCreateWithoutPredictionsInput, EvaluationRunUncheckedCreateWithoutPredictionsInput>
    where?: EvaluationRunWhereInput
  }

  export type EvaluationRunUpdateToOneWithWhereWithoutPredictionsInput = {
    where?: EvaluationRunWhereInput
    data: XOR<EvaluationRunUpdateWithoutPredictionsInput, EvaluationRunUncheckedUpdateWithoutPredictionsInput>
  }

  export type EvaluationRunUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trainedModel?: TrainedModelUpdateOneRequiredWithoutEvaluationRunsNestedInput
  }

  export type EvaluationRunUncheckedUpdateWithoutPredictionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    trainedModelId?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AnalysisReadyDataCreateManyDatasetInput = {
    id?: string
    timestamp: Date | string
    room: string
    rawWattageL1: number
    rawWattageL2: number
    wattage110v: number
    wattage220v: number
    wattageTotal: number
    isPositiveLabel?: boolean
    sourceAnomalyEventId?: string | null
  }

  export type AnomalyEventCreateManyDatasetInput = {
    id?: string
    eventId: string
    name: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    experimentRunId?: string | null
  }

  export type AnalysisReadyDataUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalysisReadyDataUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnalysisReadyDataUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: StringFieldUpdateOperationsInput | string
    rawWattageL1?: FloatFieldUpdateOperationsInput | number
    rawWattageL2?: FloatFieldUpdateOperationsInput | number
    wattage110v?: FloatFieldUpdateOperationsInput | number
    wattage220v?: FloatFieldUpdateOperationsInput | number
    wattageTotal?: FloatFieldUpdateOperationsInput | number
    isPositiveLabel?: BoolFieldUpdateOperationsInput | boolean
    sourceAnomalyEventId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnomalyEventUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRun?: ExperimentRunUpdateOneWithoutAnomalyEventsNestedInput
    eventLabelLinks?: EventLabelLinkUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventUncheckedUpdateWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRunId?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabelLinks?: EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventUncheckedUpdateManyWithoutDatasetInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    experimentRunId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AnomalyEventCreateManyExperimentRunInput = {
    id?: string
    eventId: string
    name: string
    datasetId: string
    line: string
    eventTimestamp: Date | string
    detectionRule: string
    score: number
    dataWindow: string
    status?: string
    reviewerId?: string | null
    reviewTimestamp?: Date | string | null
    justificationNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrainedModelCreateManyExperimentRunInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    modelConfig: string
    dataSourceConfig: string
    modelPath?: string | null
    trainingMetrics?: string | null
    validationMetrics?: string | null
    trainingLogs?: string | null
    jobId?: string | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
  }

  export type AnomalyEventUpdateWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataset?: AnalysisDatasetUpdateOneRequiredWithoutAnomalyEventsNestedInput
    eventLabelLinks?: EventLabelLinkUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventUncheckedUpdateWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventLabelLinks?: EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventNestedInput
  }

  export type AnomalyEventUncheckedUpdateManyWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    datasetId?: StringFieldUpdateOperationsInput | string
    line?: StringFieldUpdateOperationsInput | string
    eventTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    detectionRule?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    dataWindow?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    justificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainedModelUpdateWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evaluationRuns?: EvaluationRunUpdateManyWithoutTrainedModelNestedInput
  }

  export type TrainedModelUncheckedUpdateWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evaluationRuns?: EvaluationRunUncheckedUpdateManyWithoutTrainedModelNestedInput
  }

  export type TrainedModelUncheckedUpdateManyWithoutExperimentRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    modelConfig?: StringFieldUpdateOperationsInput | string
    dataSourceConfig?: StringFieldUpdateOperationsInput | string
    modelPath?: NullableStringFieldUpdateOperationsInput | string | null
    trainingMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    validationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    trainingLogs?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EventLabelLinkCreateManyAnomalyEventInput = {
    id?: string
    labelId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkUpdateWithoutAnomalyEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anomalyLabel?: AnomalyLabelUpdateOneRequiredWithoutEventLabelLinksNestedInput
  }

  export type EventLabelLinkUncheckedUpdateWithoutAnomalyEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkUncheckedUpdateManyWithoutAnomalyEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkCreateManyAnomalyLabelInput = {
    id?: string
    eventId: string
    createdAt?: Date | string
  }

  export type EventLabelLinkUpdateWithoutAnomalyLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    anomalyEvent?: AnomalyEventUpdateOneRequiredWithoutEventLabelLinksNestedInput
  }

  export type EventLabelLinkUncheckedUpdateWithoutAnomalyLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLabelLinkUncheckedUpdateManyWithoutAnomalyLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EvaluationRunCreateManyTrainedModelInput = {
    id?: string
    name: string
    scenarioType: string
    status: string
    testSetSource: string
    evaluationMetrics?: string | null
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type EvaluationRunUpdateWithoutTrainedModelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    predictions?: ModelPredictionUpdateManyWithoutEvaluationRunNestedInput
  }

  export type EvaluationRunUncheckedUpdateWithoutTrainedModelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    predictions?: ModelPredictionUncheckedUpdateManyWithoutEvaluationRunNestedInput
  }

  export type EvaluationRunUncheckedUpdateManyWithoutTrainedModelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scenarioType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    testSetSource?: StringFieldUpdateOperationsInput | string
    evaluationMetrics?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ModelPredictionCreateManyEvaluationRunInput = {
    id?: string
    timestamp: Date | string
    predictionScore: number
    groundTruth?: number | null
  }

  export type ModelPredictionUpdateWithoutEvaluationRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ModelPredictionUncheckedUpdateWithoutEvaluationRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ModelPredictionUncheckedUpdateManyWithoutEvaluationRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    predictionScore?: FloatFieldUpdateOperationsInput | number
    groundTruth?: NullableIntFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
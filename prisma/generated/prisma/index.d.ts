
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
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model Image
 * 
 */
export type Image = $Result.DefaultSelection<Prisma.$ImagePayload>
/**
 * Model ImageApplication
 * 
 */
export type ImageApplication = $Result.DefaultSelection<Prisma.$ImageApplicationPayload>
/**
 * Model ImageVariant
 * 
 */
export type ImageVariant = $Result.DefaultSelection<Prisma.$ImageVariantPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model BackupConfig
 * 
 */
export type BackupConfig = $Result.DefaultSelection<Prisma.$BackupConfigPayload>
/**
 * Model BackupRecord
 * 
 */
export type BackupRecord = $Result.DefaultSelection<Prisma.$BackupRecordPayload>
/**
 * Model BackupLock
 * 
 */
export type BackupLock = $Result.DefaultSelection<Prisma.$BackupLockPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model verification
 * 
 */
export type verification = $Result.DefaultSelection<Prisma.$verificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const BackupType: {
  json: 'json',
  sql: 'sql'
};

export type BackupType = (typeof BackupType)[keyof typeof BackupType]


export const BackupPeriod: {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly'
};

export type BackupPeriod = (typeof BackupPeriod)[keyof typeof BackupPeriod]


export const BackupStatus: {
  running: 'running',
  success: 'success',
  failed: 'failed'
};

export type BackupStatus = (typeof BackupStatus)[keyof typeof BackupStatus]


export const BackupTrigger: {
  manual: 'manual',
  scheduled: 'scheduled'
};

export type BackupTrigger = (typeof BackupTrigger)[keyof typeof BackupTrigger]

}

export type BackupType = $Enums.BackupType

export const BackupType: typeof $Enums.BackupType

export type BackupPeriod = $Enums.BackupPeriod

export const BackupPeriod: typeof $Enums.BackupPeriod

export type BackupStatus = $Enums.BackupStatus

export const BackupStatus: typeof $Enums.BackupStatus

export type BackupTrigger = $Enums.BackupTrigger

export const BackupTrigger: typeof $Enums.BackupTrigger

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Applications
 * const applications = await prisma.application.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Applications
   * const applications = await prisma.application.findMany()
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
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.image`: Exposes CRUD operations for the **Image** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Images
    * const images = await prisma.image.findMany()
    * ```
    */
  get image(): Prisma.ImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageApplication`: Exposes CRUD operations for the **ImageApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageApplications
    * const imageApplications = await prisma.imageApplication.findMany()
    * ```
    */
  get imageApplication(): Prisma.ImageApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageVariant`: Exposes CRUD operations for the **ImageVariant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageVariants
    * const imageVariants = await prisma.imageVariant.findMany()
    * ```
    */
  get imageVariant(): Prisma.ImageVariantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backupConfig`: Exposes CRUD operations for the **BackupConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupConfigs
    * const backupConfigs = await prisma.backupConfig.findMany()
    * ```
    */
  get backupConfig(): Prisma.BackupConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backupRecord`: Exposes CRUD operations for the **BackupRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupRecords
    * const backupRecords = await prisma.backupRecord.findMany()
    * ```
    */
  get backupRecord(): Prisma.BackupRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backupLock`: Exposes CRUD operations for the **BackupLock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupLocks
    * const backupLocks = await prisma.backupLock.findMany()
    * ```
    */
  get backupLock(): Prisma.BackupLockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.verificationDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    Application: 'Application',
    Image: 'Image',
    ImageApplication: 'ImageApplication',
    ImageVariant: 'ImageVariant',
    ApiKey: 'ApiKey',
    AuditLog: 'AuditLog',
    BackupConfig: 'BackupConfig',
    BackupRecord: 'BackupRecord',
    BackupLock: 'BackupLock',
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    verification: 'verification'
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
      modelProps: "application" | "image" | "imageApplication" | "imageVariant" | "apiKey" | "auditLog" | "backupConfig" | "backupRecord" | "backupLock" | "user" | "account" | "session" | "verificationToken" | "verification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      Image: {
        payload: Prisma.$ImagePayload<ExtArgs>
        fields: Prisma.ImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findFirst: {
            args: Prisma.ImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findMany: {
            args: Prisma.ImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          create: {
            args: Prisma.ImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          createMany: {
            args: Prisma.ImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          delete: {
            args: Prisma.ImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          update: {
            args: Prisma.ImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          deleteMany: {
            args: Prisma.ImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          upsert: {
            args: Prisma.ImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          aggregate: {
            args: Prisma.ImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImage>
          }
          groupBy: {
            args: Prisma.ImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageCountArgs<ExtArgs>
            result: $Utils.Optional<ImageCountAggregateOutputType> | number
          }
        }
      }
      ImageApplication: {
        payload: Prisma.$ImageApplicationPayload<ExtArgs>
        fields: Prisma.ImageApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          findFirst: {
            args: Prisma.ImageApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          findMany: {
            args: Prisma.ImageApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>[]
          }
          create: {
            args: Prisma.ImageApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          createMany: {
            args: Prisma.ImageApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>[]
          }
          delete: {
            args: Prisma.ImageApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          update: {
            args: Prisma.ImageApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ImageApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImageApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ImageApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageApplicationPayload>
          }
          aggregate: {
            args: Prisma.ImageApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageApplication>
          }
          groupBy: {
            args: Prisma.ImageApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ImageApplicationCountAggregateOutputType> | number
          }
        }
      }
      ImageVariant: {
        payload: Prisma.$ImageVariantPayload<ExtArgs>
        fields: Prisma.ImageVariantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageVariantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageVariantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          findFirst: {
            args: Prisma.ImageVariantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageVariantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          findMany: {
            args: Prisma.ImageVariantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>[]
          }
          create: {
            args: Prisma.ImageVariantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          createMany: {
            args: Prisma.ImageVariantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageVariantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>[]
          }
          delete: {
            args: Prisma.ImageVariantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          update: {
            args: Prisma.ImageVariantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          deleteMany: {
            args: Prisma.ImageVariantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageVariantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImageVariantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>[]
          }
          upsert: {
            args: Prisma.ImageVariantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageVariantPayload>
          }
          aggregate: {
            args: Prisma.ImageVariantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageVariant>
          }
          groupBy: {
            args: Prisma.ImageVariantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageVariantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageVariantCountArgs<ExtArgs>
            result: $Utils.Optional<ImageVariantCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      BackupConfig: {
        payload: Prisma.$BackupConfigPayload<ExtArgs>
        fields: Prisma.BackupConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          findFirst: {
            args: Prisma.BackupConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          findMany: {
            args: Prisma.BackupConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>[]
          }
          create: {
            args: Prisma.BackupConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          createMany: {
            args: Prisma.BackupConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>[]
          }
          delete: {
            args: Prisma.BackupConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          update: {
            args: Prisma.BackupConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          deleteMany: {
            args: Prisma.BackupConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>[]
          }
          upsert: {
            args: Prisma.BackupConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupConfigPayload>
          }
          aggregate: {
            args: Prisma.BackupConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupConfig>
          }
          groupBy: {
            args: Prisma.BackupConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupConfigCountArgs<ExtArgs>
            result: $Utils.Optional<BackupConfigCountAggregateOutputType> | number
          }
        }
      }
      BackupRecord: {
        payload: Prisma.$BackupRecordPayload<ExtArgs>
        fields: Prisma.BackupRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          findFirst: {
            args: Prisma.BackupRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          findMany: {
            args: Prisma.BackupRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>[]
          }
          create: {
            args: Prisma.BackupRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          createMany: {
            args: Prisma.BackupRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>[]
          }
          delete: {
            args: Prisma.BackupRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          update: {
            args: Prisma.BackupRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          deleteMany: {
            args: Prisma.BackupRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>[]
          }
          upsert: {
            args: Prisma.BackupRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupRecordPayload>
          }
          aggregate: {
            args: Prisma.BackupRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupRecord>
          }
          groupBy: {
            args: Prisma.BackupRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupRecordCountArgs<ExtArgs>
            result: $Utils.Optional<BackupRecordCountAggregateOutputType> | number
          }
        }
      }
      BackupLock: {
        payload: Prisma.$BackupLockPayload<ExtArgs>
        fields: Prisma.BackupLockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupLockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupLockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          findFirst: {
            args: Prisma.BackupLockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupLockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          findMany: {
            args: Prisma.BackupLockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>[]
          }
          create: {
            args: Prisma.BackupLockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          createMany: {
            args: Prisma.BackupLockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupLockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>[]
          }
          delete: {
            args: Prisma.BackupLockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          update: {
            args: Prisma.BackupLockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          deleteMany: {
            args: Prisma.BackupLockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupLockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupLockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>[]
          }
          upsert: {
            args: Prisma.BackupLockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupLockPayload>
          }
          aggregate: {
            args: Prisma.BackupLockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupLock>
          }
          groupBy: {
            args: Prisma.BackupLockGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupLockGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupLockCountArgs<ExtArgs>
            result: $Utils.Optional<BackupLockCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      verification: {
        payload: Prisma.$verificationPayload<ExtArgs>
        fields: Prisma.verificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.verificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.verificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          findFirst: {
            args: Prisma.verificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.verificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          findMany: {
            args: Prisma.verificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>[]
          }
          create: {
            args: Prisma.verificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          createMany: {
            args: Prisma.verificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.verificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>[]
          }
          delete: {
            args: Prisma.verificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          update: {
            args: Prisma.verificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          deleteMany: {
            args: Prisma.verificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.verificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.verificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>[]
          }
          upsert: {
            args: Prisma.verificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$verificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.verificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.verificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
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
    application?: ApplicationOmit
    image?: ImageOmit
    imageApplication?: ImageApplicationOmit
    imageVariant?: ImageVariantOmit
    apiKey?: ApiKeyOmit
    auditLog?: AuditLogOmit
    backupConfig?: BackupConfigOmit
    backupRecord?: BackupRecordOmit
    backupLock?: BackupLockOmit
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    verification?: verificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
   * Count Type ApplicationCountOutputType
   */

  export type ApplicationCountOutputType = {
    imageApplications: number
    apiKeys: number
    members: number
    auditLogs: number
  }

  export type ApplicationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imageApplications?: boolean | ApplicationCountOutputTypeCountImageApplicationsArgs
    apiKeys?: boolean | ApplicationCountOutputTypeCountApiKeysArgs
    members?: boolean | ApplicationCountOutputTypeCountMembersArgs
    auditLogs?: boolean | ApplicationCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApplicationCountOutputType
     */
    select?: ApplicationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeCountImageApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageApplicationWhereInput
  }

  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }

  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * ApplicationCountOutputType without action
   */
  export type ApplicationCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type ImageCountOutputType
   */

  export type ImageCountOutputType = {
    variants: number
    applications: number
  }

  export type ImageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | ImageCountOutputTypeCountVariantsArgs
    applications?: boolean | ImageCountOutputTypeCountApplicationsArgs
  }

  // Custom InputTypes
  /**
   * ImageCountOutputType without action
   */
  export type ImageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageCountOutputType
     */
    select?: ImageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImageCountOutputType without action
   */
  export type ImageCountOutputTypeCountVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageVariantWhereInput
  }

  /**
   * ImageCountOutputType without action
   */
  export type ImageCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageApplicationWhereInput
  }


  /**
   * Count Type ApiKeyCountOutputType
   */

  export type ApiKeyCountOutputType = {
    auditLogs: number
  }

  export type ApiKeyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | ApiKeyCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * ApiKeyCountOutputType without action
   */
  export type ApiKeyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKeyCountOutputType
     */
    select?: ApiKeyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApiKeyCountOutputType without action
   */
  export type ApiKeyCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    applications: number
    apiKeys: number
    auditLogs: number
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | UserCountOutputTypeCountApplicationsArgs
    apiKeys?: boolean | UserCountOutputTypeCountApiKeysArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storageDir: string | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    storageDir: string | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    ownerId: number
    createdAt: number
    updatedAt: number
    storageDir: number
    _all: number
  }


  export type ApplicationMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    storageDir?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    storageDir?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    storageDir?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: string
    name: string
    slug: string
    ownerId: string
    createdAt: Date
    updatedAt: Date
    storageDir: string
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storageDir?: boolean
    imageApplications?: boolean | Application$imageApplicationsArgs<ExtArgs>
    apiKeys?: boolean | Application$apiKeysArgs<ExtArgs>
    members?: boolean | Application$membersArgs<ExtArgs>
    auditLogs?: boolean | Application$auditLogsArgs<ExtArgs>
    _count?: boolean | ApplicationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storageDir?: boolean
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storageDir?: boolean
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storageDir?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "ownerId" | "createdAt" | "updatedAt" | "storageDir", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imageApplications?: boolean | Application$imageApplicationsArgs<ExtArgs>
    apiKeys?: boolean | Application$apiKeysArgs<ExtArgs>
    members?: boolean | Application$membersArgs<ExtArgs>
    auditLogs?: boolean | Application$auditLogsArgs<ExtArgs>
    _count?: boolean | ApplicationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      imageApplications: Prisma.$ImageApplicationPayload<ExtArgs>[]
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
      members: Prisma.$UserPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      ownerId: string
      createdAt: Date
      updatedAt: Date
      storageDir: string
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {ApplicationUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.updateManyAndReturn({
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
    updateManyAndReturn<T extends ApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
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
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    imageApplications<T extends Application$imageApplicationsArgs<ExtArgs> = {}>(args?: Subset<T, Application$imageApplicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    apiKeys<T extends Application$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, Application$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends Application$membersArgs<ExtArgs> = {}>(args?: Subset<T, Application$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends Application$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Application$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'String'>
    readonly name: FieldRef<"Application", 'String'>
    readonly slug: FieldRef<"Application", 'String'>
    readonly ownerId: FieldRef<"Application", 'String'>
    readonly createdAt: FieldRef<"Application", 'DateTime'>
    readonly updatedAt: FieldRef<"Application", 'DateTime'>
    readonly storageDir: FieldRef<"Application", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application updateManyAndReturn
   */
  export type ApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.imageApplications
   */
  export type Application$imageApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    where?: ImageApplicationWhereInput
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    cursor?: ImageApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageApplicationScalarFieldEnum | ImageApplicationScalarFieldEnum[]
  }

  /**
   * Application.apiKeys
   */
  export type Application$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * Application.members
   */
  export type Application$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Application.auditLogs
   */
  export type Application$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Image
   */

  export type AggregateImage = {
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  export type ImageAvgAggregateOutputType = {
    sizeBytes: number | null
    width: number | null
    height: number | null
  }

  export type ImageSumAggregateOutputType = {
    sizeBytes: number | null
    width: number | null
    height: number | null
  }

  export type ImageMinAggregateOutputType = {
    id: string | null
    filename: string | null
    contentType: string | null
    sizeBytes: number | null
    width: number | null
    height: number | null
    hash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageMaxAggregateOutputType = {
    id: string | null
    filename: string | null
    contentType: string | null
    sizeBytes: number | null
    width: number | null
    height: number | null
    hash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageCountAggregateOutputType = {
    id: number
    filename: number
    contentType: number
    sizeBytes: number
    width: number
    height: number
    hash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImageAvgAggregateInputType = {
    sizeBytes?: true
    width?: true
    height?: true
  }

  export type ImageSumAggregateInputType = {
    sizeBytes?: true
    width?: true
    height?: true
  }

  export type ImageMinAggregateInputType = {
    id?: true
    filename?: true
    contentType?: true
    sizeBytes?: true
    width?: true
    height?: true
    hash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageMaxAggregateInputType = {
    id?: true
    filename?: true
    contentType?: true
    sizeBytes?: true
    width?: true
    height?: true
    hash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageCountAggregateInputType = {
    id?: true
    filename?: true
    contentType?: true
    sizeBytes?: true
    width?: true
    height?: true
    hash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Image to aggregate.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Images
    **/
    _count?: true | ImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageMaxAggregateInputType
  }

  export type GetImageAggregateType<T extends ImageAggregateArgs> = {
        [P in keyof T & keyof AggregateImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImage[P]>
      : GetScalarType<T[P], AggregateImage[P]>
  }




  export type ImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageWhereInput
    orderBy?: ImageOrderByWithAggregationInput | ImageOrderByWithAggregationInput[]
    by: ImageScalarFieldEnum[] | ImageScalarFieldEnum
    having?: ImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageCountAggregateInputType | true
    _avg?: ImageAvgAggregateInputType
    _sum?: ImageSumAggregateInputType
    _min?: ImageMinAggregateInputType
    _max?: ImageMaxAggregateInputType
  }

  export type ImageGroupByOutputType = {
    id: string
    filename: string
    contentType: string
    sizeBytes: number
    width: number | null
    height: number | null
    hash: string
    createdAt: Date
    updatedAt: Date
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  type GetImageGroupByPayload<T extends ImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageGroupByOutputType[P]>
            : GetScalarType<T[P], ImageGroupByOutputType[P]>
        }
      >
    >


  export type ImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    contentType?: boolean
    sizeBytes?: boolean
    width?: boolean
    height?: boolean
    hash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    variants?: boolean | Image$variantsArgs<ExtArgs>
    applications?: boolean | Image$applicationsArgs<ExtArgs>
    _count?: boolean | ImageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["image"]>

  export type ImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    contentType?: boolean
    sizeBytes?: boolean
    width?: boolean
    height?: boolean
    hash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["image"]>

  export type ImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    contentType?: boolean
    sizeBytes?: boolean
    width?: boolean
    height?: boolean
    hash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["image"]>

  export type ImageSelectScalar = {
    id?: boolean
    filename?: boolean
    contentType?: boolean
    sizeBytes?: boolean
    width?: boolean
    height?: boolean
    hash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "filename" | "contentType" | "sizeBytes" | "width" | "height" | "hash" | "createdAt" | "updatedAt", ExtArgs["result"]["image"]>
  export type ImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | Image$variantsArgs<ExtArgs>
    applications?: boolean | Image$applicationsArgs<ExtArgs>
    _count?: boolean | ImageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Image"
    objects: {
      variants: Prisma.$ImageVariantPayload<ExtArgs>[]
      applications: Prisma.$ImageApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      filename: string
      contentType: string
      sizeBytes: number
      width: number | null
      height: number | null
      hash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["image"]>
    composites: {}
  }

  type ImageGetPayload<S extends boolean | null | undefined | ImageDefaultArgs> = $Result.GetResult<Prisma.$ImagePayload, S>

  type ImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageCountAggregateInputType | true
    }

  export interface ImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Image'], meta: { name: 'Image' } }
    /**
     * Find zero or one Image that matches the filter.
     * @param {ImageFindUniqueArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageFindUniqueArgs>(args: SelectSubset<T, ImageFindUniqueArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Image that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageFindUniqueOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Image that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageFindFirstArgs>(args?: SelectSubset<T, ImageFindFirstArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Image that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Images
     * const images = await prisma.image.findMany()
     * 
     * // Get first 10 Images
     * const images = await prisma.image.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageWithIdOnly = await prisma.image.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageFindManyArgs>(args?: SelectSubset<T, ImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Image.
     * @param {ImageCreateArgs} args - Arguments to create a Image.
     * @example
     * // Create one Image
     * const Image = await prisma.image.create({
     *   data: {
     *     // ... data to create a Image
     *   }
     * })
     * 
     */
    create<T extends ImageCreateArgs>(args: SelectSubset<T, ImageCreateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Images.
     * @param {ImageCreateManyArgs} args - Arguments to create many Images.
     * @example
     * // Create many Images
     * const image = await prisma.image.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageCreateManyArgs>(args?: SelectSubset<T, ImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Images and returns the data saved in the database.
     * @param {ImageCreateManyAndReturnArgs} args - Arguments to create many Images.
     * @example
     * // Create many Images
     * const image = await prisma.image.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Images and only return the `id`
     * const imageWithIdOnly = await prisma.image.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Image.
     * @param {ImageDeleteArgs} args - Arguments to delete one Image.
     * @example
     * // Delete one Image
     * const Image = await prisma.image.delete({
     *   where: {
     *     // ... filter to delete one Image
     *   }
     * })
     * 
     */
    delete<T extends ImageDeleteArgs>(args: SelectSubset<T, ImageDeleteArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Image.
     * @param {ImageUpdateArgs} args - Arguments to update one Image.
     * @example
     * // Update one Image
     * const image = await prisma.image.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageUpdateArgs>(args: SelectSubset<T, ImageUpdateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Images.
     * @param {ImageDeleteManyArgs} args - Arguments to filter Images to delete.
     * @example
     * // Delete a few Images
     * const { count } = await prisma.image.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageDeleteManyArgs>(args?: SelectSubset<T, ImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Images
     * const image = await prisma.image.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageUpdateManyArgs>(args: SelectSubset<T, ImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Images and returns the data updated in the database.
     * @param {ImageUpdateManyAndReturnArgs} args - Arguments to update many Images.
     * @example
     * // Update many Images
     * const image = await prisma.image.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Images and only return the `id`
     * const imageWithIdOnly = await prisma.image.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImageUpdateManyAndReturnArgs>(args: SelectSubset<T, ImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Image.
     * @param {ImageUpsertArgs} args - Arguments to update or create a Image.
     * @example
     * // Update or create a Image
     * const image = await prisma.image.upsert({
     *   create: {
     *     // ... data to create a Image
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Image we want to update
     *   }
     * })
     */
    upsert<T extends ImageUpsertArgs>(args: SelectSubset<T, ImageUpsertArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCountArgs} args - Arguments to filter Images to count.
     * @example
     * // Count the number of Images
     * const count = await prisma.image.count({
     *   where: {
     *     // ... the filter for the Images we want to count
     *   }
     * })
    **/
    count<T extends ImageCountArgs>(
      args?: Subset<T, ImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageAggregateArgs>(args: Subset<T, ImageAggregateArgs>): Prisma.PrismaPromise<GetImageAggregateType<T>>

    /**
     * Group by Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGroupByArgs} args - Group by arguments.
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
      T extends ImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageGroupByArgs['orderBy'] }
        : { orderBy?: ImageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Image model
   */
  readonly fields: ImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Image.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    variants<T extends Image$variantsArgs<ExtArgs> = {}>(args?: Subset<T, Image$variantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    applications<T extends Image$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Image$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Image model
   */
  interface ImageFieldRefs {
    readonly id: FieldRef<"Image", 'String'>
    readonly filename: FieldRef<"Image", 'String'>
    readonly contentType: FieldRef<"Image", 'String'>
    readonly sizeBytes: FieldRef<"Image", 'Int'>
    readonly width: FieldRef<"Image", 'Int'>
    readonly height: FieldRef<"Image", 'Int'>
    readonly hash: FieldRef<"Image", 'String'>
    readonly createdAt: FieldRef<"Image", 'DateTime'>
    readonly updatedAt: FieldRef<"Image", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Image findUnique
   */
  export type ImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findUniqueOrThrow
   */
  export type ImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findFirst
   */
  export type ImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findFirstOrThrow
   */
  export type ImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findMany
   */
  export type ImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Images to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image create
   */
  export type ImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to create a Image.
     */
    data: XOR<ImageCreateInput, ImageUncheckedCreateInput>
  }

  /**
   * Image createMany
   */
  export type ImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Images.
     */
    data: ImageCreateManyInput | ImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Image createManyAndReturn
   */
  export type ImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * The data used to create many Images.
     */
    data: ImageCreateManyInput | ImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Image update
   */
  export type ImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to update a Image.
     */
    data: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
    /**
     * Choose, which Image to update.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image updateMany
   */
  export type ImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Images.
     */
    data: XOR<ImageUpdateManyMutationInput, ImageUncheckedUpdateManyInput>
    /**
     * Filter which Images to update
     */
    where?: ImageWhereInput
    /**
     * Limit how many Images to update.
     */
    limit?: number
  }

  /**
   * Image updateManyAndReturn
   */
  export type ImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * The data used to update Images.
     */
    data: XOR<ImageUpdateManyMutationInput, ImageUncheckedUpdateManyInput>
    /**
     * Filter which Images to update
     */
    where?: ImageWhereInput
    /**
     * Limit how many Images to update.
     */
    limit?: number
  }

  /**
   * Image upsert
   */
  export type ImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The filter to search for the Image to update in case it exists.
     */
    where: ImageWhereUniqueInput
    /**
     * In case the Image found by the `where` argument doesn't exist, create a new Image with this data.
     */
    create: XOR<ImageCreateInput, ImageUncheckedCreateInput>
    /**
     * In case the Image was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
  }

  /**
   * Image delete
   */
  export type ImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter which Image to delete.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image deleteMany
   */
  export type ImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Images to delete
     */
    where?: ImageWhereInput
    /**
     * Limit how many Images to delete.
     */
    limit?: number
  }

  /**
   * Image.variants
   */
  export type Image$variantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    where?: ImageVariantWhereInput
    orderBy?: ImageVariantOrderByWithRelationInput | ImageVariantOrderByWithRelationInput[]
    cursor?: ImageVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageVariantScalarFieldEnum | ImageVariantScalarFieldEnum[]
  }

  /**
   * Image.applications
   */
  export type Image$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    where?: ImageApplicationWhereInput
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    cursor?: ImageApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageApplicationScalarFieldEnum | ImageApplicationScalarFieldEnum[]
  }

  /**
   * Image without action
   */
  export type ImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
  }


  /**
   * Model ImageApplication
   */

  export type AggregateImageApplication = {
    _count: ImageApplicationCountAggregateOutputType | null
    _min: ImageApplicationMinAggregateOutputType | null
    _max: ImageApplicationMaxAggregateOutputType | null
  }

  export type ImageApplicationMinAggregateOutputType = {
    id: string | null
    imageId: string | null
    applicationId: string | null
    originalName: string | null
    linkedAt: Date | null
    updatedAt: Date | null
  }

  export type ImageApplicationMaxAggregateOutputType = {
    id: string | null
    imageId: string | null
    applicationId: string | null
    originalName: string | null
    linkedAt: Date | null
    updatedAt: Date | null
  }

  export type ImageApplicationCountAggregateOutputType = {
    id: number
    imageId: number
    applicationId: number
    originalName: number
    tags: number
    linkedAt: number
    updatedAt: number
    _all: number
  }


  export type ImageApplicationMinAggregateInputType = {
    id?: true
    imageId?: true
    applicationId?: true
    originalName?: true
    linkedAt?: true
    updatedAt?: true
  }

  export type ImageApplicationMaxAggregateInputType = {
    id?: true
    imageId?: true
    applicationId?: true
    originalName?: true
    linkedAt?: true
    updatedAt?: true
  }

  export type ImageApplicationCountAggregateInputType = {
    id?: true
    imageId?: true
    applicationId?: true
    originalName?: true
    tags?: true
    linkedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImageApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageApplication to aggregate.
     */
    where?: ImageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageApplications to fetch.
     */
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageApplications
    **/
    _count?: true | ImageApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageApplicationMaxAggregateInputType
  }

  export type GetImageApplicationAggregateType<T extends ImageApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateImageApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageApplication[P]>
      : GetScalarType<T[P], AggregateImageApplication[P]>
  }




  export type ImageApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageApplicationWhereInput
    orderBy?: ImageApplicationOrderByWithAggregationInput | ImageApplicationOrderByWithAggregationInput[]
    by: ImageApplicationScalarFieldEnum[] | ImageApplicationScalarFieldEnum
    having?: ImageApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageApplicationCountAggregateInputType | true
    _min?: ImageApplicationMinAggregateInputType
    _max?: ImageApplicationMaxAggregateInputType
  }

  export type ImageApplicationGroupByOutputType = {
    id: string
    imageId: string
    applicationId: string
    originalName: string
    tags: JsonValue | null
    linkedAt: Date
    updatedAt: Date
    _count: ImageApplicationCountAggregateOutputType | null
    _min: ImageApplicationMinAggregateOutputType | null
    _max: ImageApplicationMaxAggregateOutputType | null
  }

  type GetImageApplicationGroupByPayload<T extends ImageApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ImageApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ImageApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    applicationId?: boolean
    originalName?: boolean
    tags?: boolean
    linkedAt?: boolean
    updatedAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageApplication"]>

  export type ImageApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    applicationId?: boolean
    originalName?: boolean
    tags?: boolean
    linkedAt?: boolean
    updatedAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageApplication"]>

  export type ImageApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    applicationId?: boolean
    originalName?: boolean
    tags?: boolean
    linkedAt?: boolean
    updatedAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageApplication"]>

  export type ImageApplicationSelectScalar = {
    id?: boolean
    imageId?: boolean
    applicationId?: boolean
    originalName?: boolean
    tags?: boolean
    linkedAt?: boolean
    updatedAt?: boolean
  }

  export type ImageApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imageId" | "applicationId" | "originalName" | "tags" | "linkedAt" | "updatedAt", ExtArgs["result"]["imageApplication"]>
  export type ImageApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }
  export type ImageApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }
  export type ImageApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }

  export type $ImageApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageApplication"
    objects: {
      image: Prisma.$ImagePayload<ExtArgs>
      application: Prisma.$ApplicationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imageId: string
      applicationId: string
      originalName: string
      tags: Prisma.JsonValue | null
      linkedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["imageApplication"]>
    composites: {}
  }

  type ImageApplicationGetPayload<S extends boolean | null | undefined | ImageApplicationDefaultArgs> = $Result.GetResult<Prisma.$ImageApplicationPayload, S>

  type ImageApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageApplicationCountAggregateInputType | true
    }

  export interface ImageApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageApplication'], meta: { name: 'ImageApplication' } }
    /**
     * Find zero or one ImageApplication that matches the filter.
     * @param {ImageApplicationFindUniqueArgs} args - Arguments to find a ImageApplication
     * @example
     * // Get one ImageApplication
     * const imageApplication = await prisma.imageApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageApplicationFindUniqueArgs>(args: SelectSubset<T, ImageApplicationFindUniqueArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageApplication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageApplicationFindUniqueOrThrowArgs} args - Arguments to find a ImageApplication
     * @example
     * // Get one ImageApplication
     * const imageApplication = await prisma.imageApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationFindFirstArgs} args - Arguments to find a ImageApplication
     * @example
     * // Get one ImageApplication
     * const imageApplication = await prisma.imageApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageApplicationFindFirstArgs>(args?: SelectSubset<T, ImageApplicationFindFirstArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationFindFirstOrThrowArgs} args - Arguments to find a ImageApplication
     * @example
     * // Get one ImageApplication
     * const imageApplication = await prisma.imageApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageApplications
     * const imageApplications = await prisma.imageApplication.findMany()
     * 
     * // Get first 10 ImageApplications
     * const imageApplications = await prisma.imageApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageApplicationWithIdOnly = await prisma.imageApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageApplicationFindManyArgs>(args?: SelectSubset<T, ImageApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageApplication.
     * @param {ImageApplicationCreateArgs} args - Arguments to create a ImageApplication.
     * @example
     * // Create one ImageApplication
     * const ImageApplication = await prisma.imageApplication.create({
     *   data: {
     *     // ... data to create a ImageApplication
     *   }
     * })
     * 
     */
    create<T extends ImageApplicationCreateArgs>(args: SelectSubset<T, ImageApplicationCreateArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageApplications.
     * @param {ImageApplicationCreateManyArgs} args - Arguments to create many ImageApplications.
     * @example
     * // Create many ImageApplications
     * const imageApplication = await prisma.imageApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageApplicationCreateManyArgs>(args?: SelectSubset<T, ImageApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImageApplications and returns the data saved in the database.
     * @param {ImageApplicationCreateManyAndReturnArgs} args - Arguments to create many ImageApplications.
     * @example
     * // Create many ImageApplications
     * const imageApplication = await prisma.imageApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImageApplications and only return the `id`
     * const imageApplicationWithIdOnly = await prisma.imageApplication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImageApplication.
     * @param {ImageApplicationDeleteArgs} args - Arguments to delete one ImageApplication.
     * @example
     * // Delete one ImageApplication
     * const ImageApplication = await prisma.imageApplication.delete({
     *   where: {
     *     // ... filter to delete one ImageApplication
     *   }
     * })
     * 
     */
    delete<T extends ImageApplicationDeleteArgs>(args: SelectSubset<T, ImageApplicationDeleteArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageApplication.
     * @param {ImageApplicationUpdateArgs} args - Arguments to update one ImageApplication.
     * @example
     * // Update one ImageApplication
     * const imageApplication = await prisma.imageApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageApplicationUpdateArgs>(args: SelectSubset<T, ImageApplicationUpdateArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageApplications.
     * @param {ImageApplicationDeleteManyArgs} args - Arguments to filter ImageApplications to delete.
     * @example
     * // Delete a few ImageApplications
     * const { count } = await prisma.imageApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageApplicationDeleteManyArgs>(args?: SelectSubset<T, ImageApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageApplications
     * const imageApplication = await prisma.imageApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageApplicationUpdateManyArgs>(args: SelectSubset<T, ImageApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageApplications and returns the data updated in the database.
     * @param {ImageApplicationUpdateManyAndReturnArgs} args - Arguments to update many ImageApplications.
     * @example
     * // Update many ImageApplications
     * const imageApplication = await prisma.imageApplication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImageApplications and only return the `id`
     * const imageApplicationWithIdOnly = await prisma.imageApplication.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImageApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ImageApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImageApplication.
     * @param {ImageApplicationUpsertArgs} args - Arguments to update or create a ImageApplication.
     * @example
     * // Update or create a ImageApplication
     * const imageApplication = await prisma.imageApplication.upsert({
     *   create: {
     *     // ... data to create a ImageApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageApplication we want to update
     *   }
     * })
     */
    upsert<T extends ImageApplicationUpsertArgs>(args: SelectSubset<T, ImageApplicationUpsertArgs<ExtArgs>>): Prisma__ImageApplicationClient<$Result.GetResult<Prisma.$ImageApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationCountArgs} args - Arguments to filter ImageApplications to count.
     * @example
     * // Count the number of ImageApplications
     * const count = await prisma.imageApplication.count({
     *   where: {
     *     // ... the filter for the ImageApplications we want to count
     *   }
     * })
    **/
    count<T extends ImageApplicationCountArgs>(
      args?: Subset<T, ImageApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageApplicationAggregateArgs>(args: Subset<T, ImageApplicationAggregateArgs>): Prisma.PrismaPromise<GetImageApplicationAggregateType<T>>

    /**
     * Group by ImageApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageApplicationGroupByArgs} args - Group by arguments.
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
      T extends ImageApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ImageApplicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageApplication model
   */
  readonly fields: ImageApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    image<T extends ImageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImageDefaultArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    application<T extends ApplicationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApplicationDefaultArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ImageApplication model
   */
  interface ImageApplicationFieldRefs {
    readonly id: FieldRef<"ImageApplication", 'String'>
    readonly imageId: FieldRef<"ImageApplication", 'String'>
    readonly applicationId: FieldRef<"ImageApplication", 'String'>
    readonly originalName: FieldRef<"ImageApplication", 'String'>
    readonly tags: FieldRef<"ImageApplication", 'Json'>
    readonly linkedAt: FieldRef<"ImageApplication", 'DateTime'>
    readonly updatedAt: FieldRef<"ImageApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageApplication findUnique
   */
  export type ImageApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter, which ImageApplication to fetch.
     */
    where: ImageApplicationWhereUniqueInput
  }

  /**
   * ImageApplication findUniqueOrThrow
   */
  export type ImageApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter, which ImageApplication to fetch.
     */
    where: ImageApplicationWhereUniqueInput
  }

  /**
   * ImageApplication findFirst
   */
  export type ImageApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter, which ImageApplication to fetch.
     */
    where?: ImageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageApplications to fetch.
     */
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageApplications.
     */
    cursor?: ImageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageApplications.
     */
    distinct?: ImageApplicationScalarFieldEnum | ImageApplicationScalarFieldEnum[]
  }

  /**
   * ImageApplication findFirstOrThrow
   */
  export type ImageApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter, which ImageApplication to fetch.
     */
    where?: ImageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageApplications to fetch.
     */
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageApplications.
     */
    cursor?: ImageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageApplications.
     */
    distinct?: ImageApplicationScalarFieldEnum | ImageApplicationScalarFieldEnum[]
  }

  /**
   * ImageApplication findMany
   */
  export type ImageApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter, which ImageApplications to fetch.
     */
    where?: ImageApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageApplications to fetch.
     */
    orderBy?: ImageApplicationOrderByWithRelationInput | ImageApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageApplications.
     */
    cursor?: ImageApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageApplications.
     */
    skip?: number
    distinct?: ImageApplicationScalarFieldEnum | ImageApplicationScalarFieldEnum[]
  }

  /**
   * ImageApplication create
   */
  export type ImageApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageApplication.
     */
    data: XOR<ImageApplicationCreateInput, ImageApplicationUncheckedCreateInput>
  }

  /**
   * ImageApplication createMany
   */
  export type ImageApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageApplications.
     */
    data: ImageApplicationCreateManyInput | ImageApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageApplication createManyAndReturn
   */
  export type ImageApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many ImageApplications.
     */
    data: ImageApplicationCreateManyInput | ImageApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageApplication update
   */
  export type ImageApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageApplication.
     */
    data: XOR<ImageApplicationUpdateInput, ImageApplicationUncheckedUpdateInput>
    /**
     * Choose, which ImageApplication to update.
     */
    where: ImageApplicationWhereUniqueInput
  }

  /**
   * ImageApplication updateMany
   */
  export type ImageApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageApplications.
     */
    data: XOR<ImageApplicationUpdateManyMutationInput, ImageApplicationUncheckedUpdateManyInput>
    /**
     * Filter which ImageApplications to update
     */
    where?: ImageApplicationWhereInput
    /**
     * Limit how many ImageApplications to update.
     */
    limit?: number
  }

  /**
   * ImageApplication updateManyAndReturn
   */
  export type ImageApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * The data used to update ImageApplications.
     */
    data: XOR<ImageApplicationUpdateManyMutationInput, ImageApplicationUncheckedUpdateManyInput>
    /**
     * Filter which ImageApplications to update
     */
    where?: ImageApplicationWhereInput
    /**
     * Limit how many ImageApplications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageApplication upsert
   */
  export type ImageApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageApplication to update in case it exists.
     */
    where: ImageApplicationWhereUniqueInput
    /**
     * In case the ImageApplication found by the `where` argument doesn't exist, create a new ImageApplication with this data.
     */
    create: XOR<ImageApplicationCreateInput, ImageApplicationUncheckedCreateInput>
    /**
     * In case the ImageApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageApplicationUpdateInput, ImageApplicationUncheckedUpdateInput>
  }

  /**
   * ImageApplication delete
   */
  export type ImageApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
    /**
     * Filter which ImageApplication to delete.
     */
    where: ImageApplicationWhereUniqueInput
  }

  /**
   * ImageApplication deleteMany
   */
  export type ImageApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageApplications to delete
     */
    where?: ImageApplicationWhereInput
    /**
     * Limit how many ImageApplications to delete.
     */
    limit?: number
  }

  /**
   * ImageApplication without action
   */
  export type ImageApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageApplication
     */
    select?: ImageApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageApplication
     */
    omit?: ImageApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageApplicationInclude<ExtArgs> | null
  }


  /**
   * Model ImageVariant
   */

  export type AggregateImageVariant = {
    _count: ImageVariantCountAggregateOutputType | null
    _avg: ImageVariantAvgAggregateOutputType | null
    _sum: ImageVariantSumAggregateOutputType | null
    _min: ImageVariantMinAggregateOutputType | null
    _max: ImageVariantMaxAggregateOutputType | null
  }

  export type ImageVariantAvgAggregateOutputType = {
    width: number | null
    height: number | null
    sizeBytes: number | null
  }

  export type ImageVariantSumAggregateOutputType = {
    width: number | null
    height: number | null
    sizeBytes: number | null
  }

  export type ImageVariantMinAggregateOutputType = {
    id: string | null
    imageId: string | null
    label: string | null
    filename: string | null
    width: number | null
    height: number | null
    sizeBytes: number | null
    createdAt: Date | null
  }

  export type ImageVariantMaxAggregateOutputType = {
    id: string | null
    imageId: string | null
    label: string | null
    filename: string | null
    width: number | null
    height: number | null
    sizeBytes: number | null
    createdAt: Date | null
  }

  export type ImageVariantCountAggregateOutputType = {
    id: number
    imageId: number
    label: number
    filename: number
    width: number
    height: number
    sizeBytes: number
    createdAt: number
    _all: number
  }


  export type ImageVariantAvgAggregateInputType = {
    width?: true
    height?: true
    sizeBytes?: true
  }

  export type ImageVariantSumAggregateInputType = {
    width?: true
    height?: true
    sizeBytes?: true
  }

  export type ImageVariantMinAggregateInputType = {
    id?: true
    imageId?: true
    label?: true
    filename?: true
    width?: true
    height?: true
    sizeBytes?: true
    createdAt?: true
  }

  export type ImageVariantMaxAggregateInputType = {
    id?: true
    imageId?: true
    label?: true
    filename?: true
    width?: true
    height?: true
    sizeBytes?: true
    createdAt?: true
  }

  export type ImageVariantCountAggregateInputType = {
    id?: true
    imageId?: true
    label?: true
    filename?: true
    width?: true
    height?: true
    sizeBytes?: true
    createdAt?: true
    _all?: true
  }

  export type ImageVariantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageVariant to aggregate.
     */
    where?: ImageVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageVariants to fetch.
     */
    orderBy?: ImageVariantOrderByWithRelationInput | ImageVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageVariants
    **/
    _count?: true | ImageVariantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageVariantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageVariantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageVariantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageVariantMaxAggregateInputType
  }

  export type GetImageVariantAggregateType<T extends ImageVariantAggregateArgs> = {
        [P in keyof T & keyof AggregateImageVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageVariant[P]>
      : GetScalarType<T[P], AggregateImageVariant[P]>
  }




  export type ImageVariantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageVariantWhereInput
    orderBy?: ImageVariantOrderByWithAggregationInput | ImageVariantOrderByWithAggregationInput[]
    by: ImageVariantScalarFieldEnum[] | ImageVariantScalarFieldEnum
    having?: ImageVariantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageVariantCountAggregateInputType | true
    _avg?: ImageVariantAvgAggregateInputType
    _sum?: ImageVariantSumAggregateInputType
    _min?: ImageVariantMinAggregateInputType
    _max?: ImageVariantMaxAggregateInputType
  }

  export type ImageVariantGroupByOutputType = {
    id: string
    imageId: string
    label: string
    filename: string
    width: number | null
    height: number | null
    sizeBytes: number
    createdAt: Date
    _count: ImageVariantCountAggregateOutputType | null
    _avg: ImageVariantAvgAggregateOutputType | null
    _sum: ImageVariantSumAggregateOutputType | null
    _min: ImageVariantMinAggregateOutputType | null
    _max: ImageVariantMaxAggregateOutputType | null
  }

  type GetImageVariantGroupByPayload<T extends ImageVariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageVariantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageVariantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageVariantGroupByOutputType[P]>
            : GetScalarType<T[P], ImageVariantGroupByOutputType[P]>
        }
      >
    >


  export type ImageVariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    label?: boolean
    filename?: boolean
    width?: boolean
    height?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageVariant"]>

  export type ImageVariantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    label?: boolean
    filename?: boolean
    width?: boolean
    height?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageVariant"]>

  export type ImageVariantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageId?: boolean
    label?: boolean
    filename?: boolean
    width?: boolean
    height?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageVariant"]>

  export type ImageVariantSelectScalar = {
    id?: boolean
    imageId?: boolean
    label?: boolean
    filename?: boolean
    width?: boolean
    height?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
  }

  export type ImageVariantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imageId" | "label" | "filename" | "width" | "height" | "sizeBytes" | "createdAt", ExtArgs["result"]["imageVariant"]>
  export type ImageVariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }
  export type ImageVariantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }
  export type ImageVariantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    image?: boolean | ImageDefaultArgs<ExtArgs>
  }

  export type $ImageVariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageVariant"
    objects: {
      image: Prisma.$ImagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imageId: string
      label: string
      filename: string
      width: number | null
      height: number | null
      sizeBytes: number
      createdAt: Date
    }, ExtArgs["result"]["imageVariant"]>
    composites: {}
  }

  type ImageVariantGetPayload<S extends boolean | null | undefined | ImageVariantDefaultArgs> = $Result.GetResult<Prisma.$ImageVariantPayload, S>

  type ImageVariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageVariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageVariantCountAggregateInputType | true
    }

  export interface ImageVariantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageVariant'], meta: { name: 'ImageVariant' } }
    /**
     * Find zero or one ImageVariant that matches the filter.
     * @param {ImageVariantFindUniqueArgs} args - Arguments to find a ImageVariant
     * @example
     * // Get one ImageVariant
     * const imageVariant = await prisma.imageVariant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageVariantFindUniqueArgs>(args: SelectSubset<T, ImageVariantFindUniqueArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageVariant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageVariantFindUniqueOrThrowArgs} args - Arguments to find a ImageVariant
     * @example
     * // Get one ImageVariant
     * const imageVariant = await prisma.imageVariant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageVariantFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageVariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageVariant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantFindFirstArgs} args - Arguments to find a ImageVariant
     * @example
     * // Get one ImageVariant
     * const imageVariant = await prisma.imageVariant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageVariantFindFirstArgs>(args?: SelectSubset<T, ImageVariantFindFirstArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageVariant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantFindFirstOrThrowArgs} args - Arguments to find a ImageVariant
     * @example
     * // Get one ImageVariant
     * const imageVariant = await prisma.imageVariant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageVariantFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageVariantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageVariants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageVariants
     * const imageVariants = await prisma.imageVariant.findMany()
     * 
     * // Get first 10 ImageVariants
     * const imageVariants = await prisma.imageVariant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageVariantWithIdOnly = await prisma.imageVariant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageVariantFindManyArgs>(args?: SelectSubset<T, ImageVariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageVariant.
     * @param {ImageVariantCreateArgs} args - Arguments to create a ImageVariant.
     * @example
     * // Create one ImageVariant
     * const ImageVariant = await prisma.imageVariant.create({
     *   data: {
     *     // ... data to create a ImageVariant
     *   }
     * })
     * 
     */
    create<T extends ImageVariantCreateArgs>(args: SelectSubset<T, ImageVariantCreateArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageVariants.
     * @param {ImageVariantCreateManyArgs} args - Arguments to create many ImageVariants.
     * @example
     * // Create many ImageVariants
     * const imageVariant = await prisma.imageVariant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageVariantCreateManyArgs>(args?: SelectSubset<T, ImageVariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImageVariants and returns the data saved in the database.
     * @param {ImageVariantCreateManyAndReturnArgs} args - Arguments to create many ImageVariants.
     * @example
     * // Create many ImageVariants
     * const imageVariant = await prisma.imageVariant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImageVariants and only return the `id`
     * const imageVariantWithIdOnly = await prisma.imageVariant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageVariantCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageVariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImageVariant.
     * @param {ImageVariantDeleteArgs} args - Arguments to delete one ImageVariant.
     * @example
     * // Delete one ImageVariant
     * const ImageVariant = await prisma.imageVariant.delete({
     *   where: {
     *     // ... filter to delete one ImageVariant
     *   }
     * })
     * 
     */
    delete<T extends ImageVariantDeleteArgs>(args: SelectSubset<T, ImageVariantDeleteArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageVariant.
     * @param {ImageVariantUpdateArgs} args - Arguments to update one ImageVariant.
     * @example
     * // Update one ImageVariant
     * const imageVariant = await prisma.imageVariant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageVariantUpdateArgs>(args: SelectSubset<T, ImageVariantUpdateArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageVariants.
     * @param {ImageVariantDeleteManyArgs} args - Arguments to filter ImageVariants to delete.
     * @example
     * // Delete a few ImageVariants
     * const { count } = await prisma.imageVariant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageVariantDeleteManyArgs>(args?: SelectSubset<T, ImageVariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageVariants
     * const imageVariant = await prisma.imageVariant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageVariantUpdateManyArgs>(args: SelectSubset<T, ImageVariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageVariants and returns the data updated in the database.
     * @param {ImageVariantUpdateManyAndReturnArgs} args - Arguments to update many ImageVariants.
     * @example
     * // Update many ImageVariants
     * const imageVariant = await prisma.imageVariant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImageVariants and only return the `id`
     * const imageVariantWithIdOnly = await prisma.imageVariant.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImageVariantUpdateManyAndReturnArgs>(args: SelectSubset<T, ImageVariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImageVariant.
     * @param {ImageVariantUpsertArgs} args - Arguments to update or create a ImageVariant.
     * @example
     * // Update or create a ImageVariant
     * const imageVariant = await prisma.imageVariant.upsert({
     *   create: {
     *     // ... data to create a ImageVariant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageVariant we want to update
     *   }
     * })
     */
    upsert<T extends ImageVariantUpsertArgs>(args: SelectSubset<T, ImageVariantUpsertArgs<ExtArgs>>): Prisma__ImageVariantClient<$Result.GetResult<Prisma.$ImageVariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantCountArgs} args - Arguments to filter ImageVariants to count.
     * @example
     * // Count the number of ImageVariants
     * const count = await prisma.imageVariant.count({
     *   where: {
     *     // ... the filter for the ImageVariants we want to count
     *   }
     * })
    **/
    count<T extends ImageVariantCountArgs>(
      args?: Subset<T, ImageVariantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageVariantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImageVariantAggregateArgs>(args: Subset<T, ImageVariantAggregateArgs>): Prisma.PrismaPromise<GetImageVariantAggregateType<T>>

    /**
     * Group by ImageVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageVariantGroupByArgs} args - Group by arguments.
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
      T extends ImageVariantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageVariantGroupByArgs['orderBy'] }
        : { orderBy?: ImageVariantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImageVariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageVariant model
   */
  readonly fields: ImageVariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageVariant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageVariantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    image<T extends ImageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImageDefaultArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ImageVariant model
   */
  interface ImageVariantFieldRefs {
    readonly id: FieldRef<"ImageVariant", 'String'>
    readonly imageId: FieldRef<"ImageVariant", 'String'>
    readonly label: FieldRef<"ImageVariant", 'String'>
    readonly filename: FieldRef<"ImageVariant", 'String'>
    readonly width: FieldRef<"ImageVariant", 'Int'>
    readonly height: FieldRef<"ImageVariant", 'Int'>
    readonly sizeBytes: FieldRef<"ImageVariant", 'Int'>
    readonly createdAt: FieldRef<"ImageVariant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageVariant findUnique
   */
  export type ImageVariantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter, which ImageVariant to fetch.
     */
    where: ImageVariantWhereUniqueInput
  }

  /**
   * ImageVariant findUniqueOrThrow
   */
  export type ImageVariantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter, which ImageVariant to fetch.
     */
    where: ImageVariantWhereUniqueInput
  }

  /**
   * ImageVariant findFirst
   */
  export type ImageVariantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter, which ImageVariant to fetch.
     */
    where?: ImageVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageVariants to fetch.
     */
    orderBy?: ImageVariantOrderByWithRelationInput | ImageVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageVariants.
     */
    cursor?: ImageVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageVariants.
     */
    distinct?: ImageVariantScalarFieldEnum | ImageVariantScalarFieldEnum[]
  }

  /**
   * ImageVariant findFirstOrThrow
   */
  export type ImageVariantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter, which ImageVariant to fetch.
     */
    where?: ImageVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageVariants to fetch.
     */
    orderBy?: ImageVariantOrderByWithRelationInput | ImageVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageVariants.
     */
    cursor?: ImageVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageVariants.
     */
    distinct?: ImageVariantScalarFieldEnum | ImageVariantScalarFieldEnum[]
  }

  /**
   * ImageVariant findMany
   */
  export type ImageVariantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter, which ImageVariants to fetch.
     */
    where?: ImageVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageVariants to fetch.
     */
    orderBy?: ImageVariantOrderByWithRelationInput | ImageVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageVariants.
     */
    cursor?: ImageVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageVariants.
     */
    skip?: number
    distinct?: ImageVariantScalarFieldEnum | ImageVariantScalarFieldEnum[]
  }

  /**
   * ImageVariant create
   */
  export type ImageVariantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageVariant.
     */
    data: XOR<ImageVariantCreateInput, ImageVariantUncheckedCreateInput>
  }

  /**
   * ImageVariant createMany
   */
  export type ImageVariantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageVariants.
     */
    data: ImageVariantCreateManyInput | ImageVariantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageVariant createManyAndReturn
   */
  export type ImageVariantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * The data used to create many ImageVariants.
     */
    data: ImageVariantCreateManyInput | ImageVariantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageVariant update
   */
  export type ImageVariantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageVariant.
     */
    data: XOR<ImageVariantUpdateInput, ImageVariantUncheckedUpdateInput>
    /**
     * Choose, which ImageVariant to update.
     */
    where: ImageVariantWhereUniqueInput
  }

  /**
   * ImageVariant updateMany
   */
  export type ImageVariantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageVariants.
     */
    data: XOR<ImageVariantUpdateManyMutationInput, ImageVariantUncheckedUpdateManyInput>
    /**
     * Filter which ImageVariants to update
     */
    where?: ImageVariantWhereInput
    /**
     * Limit how many ImageVariants to update.
     */
    limit?: number
  }

  /**
   * ImageVariant updateManyAndReturn
   */
  export type ImageVariantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * The data used to update ImageVariants.
     */
    data: XOR<ImageVariantUpdateManyMutationInput, ImageVariantUncheckedUpdateManyInput>
    /**
     * Filter which ImageVariants to update
     */
    where?: ImageVariantWhereInput
    /**
     * Limit how many ImageVariants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageVariant upsert
   */
  export type ImageVariantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageVariant to update in case it exists.
     */
    where: ImageVariantWhereUniqueInput
    /**
     * In case the ImageVariant found by the `where` argument doesn't exist, create a new ImageVariant with this data.
     */
    create: XOR<ImageVariantCreateInput, ImageVariantUncheckedCreateInput>
    /**
     * In case the ImageVariant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageVariantUpdateInput, ImageVariantUncheckedUpdateInput>
  }

  /**
   * ImageVariant delete
   */
  export type ImageVariantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
    /**
     * Filter which ImageVariant to delete.
     */
    where: ImageVariantWhereUniqueInput
  }

  /**
   * ImageVariant deleteMany
   */
  export type ImageVariantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageVariants to delete
     */
    where?: ImageVariantWhereInput
    /**
     * Limit how many ImageVariants to delete.
     */
    limit?: number
  }

  /**
   * ImageVariant without action
   */
  export type ImageVariantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageVariant
     */
    select?: ImageVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageVariant
     */
    omit?: ImageVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageVariantInclude<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    applicationId: string | null
    userId: string | null
    name: string | null
    hash: string | null
    lastUsedAt: Date | null
    createdAt: Date | null
    revoked: boolean | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    applicationId: string | null
    userId: string | null
    name: string | null
    hash: string | null
    lastUsedAt: Date | null
    createdAt: Date | null
    revoked: boolean | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    applicationId: number
    userId: number
    name: number
    hash: number
    lastUsedAt: number
    createdAt: number
    revoked: number
    _all: number
  }


  export type ApiKeyMinAggregateInputType = {
    id?: true
    applicationId?: true
    userId?: true
    name?: true
    hash?: true
    lastUsedAt?: true
    createdAt?: true
    revoked?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    applicationId?: true
    userId?: true
    name?: true
    hash?: true
    lastUsedAt?: true
    createdAt?: true
    revoked?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    applicationId?: true
    userId?: true
    name?: true
    hash?: true
    lastUsedAt?: true
    createdAt?: true
    revoked?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    applicationId: string
    userId: string
    name: string
    hash: string
    lastUsedAt: Date | null
    createdAt: Date
    revoked: boolean
    _count: ApiKeyCountAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationId?: boolean
    userId?: boolean
    name?: boolean
    hash?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    revoked?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    auditLogs?: boolean | ApiKey$auditLogsArgs<ExtArgs>
    _count?: boolean | ApiKeyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationId?: boolean
    userId?: boolean
    name?: boolean
    hash?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    revoked?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationId?: boolean
    userId?: boolean
    name?: boolean
    hash?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    revoked?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    applicationId?: boolean
    userId?: boolean
    name?: boolean
    hash?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    revoked?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "applicationId" | "userId" | "name" | "hash" | "lastUsedAt" | "createdAt" | "revoked", ExtArgs["result"]["apiKey"]>
  export type ApiKeyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    auditLogs?: boolean | ApiKey$auditLogsArgs<ExtArgs>
    _count?: boolean | ApiKeyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApiKeyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {
      application: Prisma.$ApplicationPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      applicationId: string
      userId: string
      name: string
      hash: string
      lastUsedAt: Date | null
      createdAt: Date
      revoked: boolean
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
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
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
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
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    application<T extends ApplicationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApplicationDefaultArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    auditLogs<T extends ApiKey$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, ApiKey$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly applicationId: FieldRef<"ApiKey", 'String'>
    readonly userId: FieldRef<"ApiKey", 'String'>
    readonly name: FieldRef<"ApiKey", 'String'>
    readonly hash: FieldRef<"ApiKey", 'String'>
    readonly lastUsedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
    readonly revoked: FieldRef<"ApiKey", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey.auditLogs
   */
  export type ApiKey$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    applicationId: string | null
    apiKeyId: string | null
    action: string | null
    targetId: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    applicationId: string | null
    apiKeyId: string | null
    action: string | null
    targetId: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    applicationId: number
    apiKeyId: number
    action: number
    targetId: number
    ip: number
    userAgent: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    applicationId?: true
    apiKeyId?: true
    action?: true
    targetId?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    applicationId?: true
    apiKeyId?: true
    action?: true
    targetId?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    applicationId?: true
    apiKeyId?: true
    action?: true
    targetId?: true
    ip?: true
    userAgent?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string | null
    applicationId: string | null
    apiKeyId: string | null
    action: string
    targetId: string | null
    ip: string | null
    userAgent: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    applicationId?: boolean
    apiKeyId?: boolean
    action?: boolean
    targetId?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    applicationId?: boolean
    apiKeyId?: boolean
    action?: boolean
    targetId?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    applicationId?: boolean
    apiKeyId?: boolean
    action?: boolean
    targetId?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    applicationId?: boolean
    apiKeyId?: boolean
    action?: boolean
    targetId?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "applicationId" | "apiKeyId" | "action" | "targetId" | "ip" | "userAgent" | "metadata" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
    application?: boolean | AuditLog$applicationArgs<ExtArgs>
    apiKey?: boolean | AuditLog$apiKeyArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      application: Prisma.$ApplicationPayload<ExtArgs> | null
      apiKey: Prisma.$ApiKeyPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      applicationId: string | null
      apiKeyId: string | null
      action: string
      targetId: string | null
      ip: string | null
      userAgent: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    application<T extends AuditLog$applicationArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$applicationArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    apiKey<T extends AuditLog$apiKeyArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$apiKeyArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly applicationId: FieldRef<"AuditLog", 'String'>
    readonly apiKeyId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly targetId: FieldRef<"AuditLog", 'String'>
    readonly ip: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog.application
   */
  export type AuditLog$applicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
  }

  /**
   * AuditLog.apiKey
   */
  export type AuditLog$apiKeyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model BackupConfig
   */

  export type AggregateBackupConfig = {
    _count: BackupConfigCountAggregateOutputType | null
    _avg: BackupConfigAvgAggregateOutputType | null
    _sum: BackupConfigSumAggregateOutputType | null
    _min: BackupConfigMinAggregateOutputType | null
    _max: BackupConfigMaxAggregateOutputType | null
  }

  export type BackupConfigAvgAggregateOutputType = {
    jsonIntervalMinutes: number | null
    sqlIntervalMinutes: number | null
    schedulerIntervalMinutes: number | null
    dailyRetentionDays: number | null
    weeklyRetentionWeeks: number | null
    monthlyRetentionMonths: number | null
  }

  export type BackupConfigSumAggregateOutputType = {
    jsonIntervalMinutes: number | null
    sqlIntervalMinutes: number | null
    schedulerIntervalMinutes: number | null
    dailyRetentionDays: number | null
    weeklyRetentionWeeks: number | null
    monthlyRetentionMonths: number | null
  }

  export type BackupConfigMinAggregateOutputType = {
    id: string | null
    enabled: boolean | null
    basePrefix: string | null
    jsonIntervalMinutes: number | null
    sqlIntervalMinutes: number | null
    schedulerIntervalMinutes: number | null
    dailyRetentionDays: number | null
    weeklyRetentionWeeks: number | null
    monthlyRetentionMonths: number | null
    lastJsonBackupAt: Date | null
    lastSqlBackupAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupConfigMaxAggregateOutputType = {
    id: string | null
    enabled: boolean | null
    basePrefix: string | null
    jsonIntervalMinutes: number | null
    sqlIntervalMinutes: number | null
    schedulerIntervalMinutes: number | null
    dailyRetentionDays: number | null
    weeklyRetentionWeeks: number | null
    monthlyRetentionMonths: number | null
    lastJsonBackupAt: Date | null
    lastSqlBackupAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupConfigCountAggregateOutputType = {
    id: number
    enabled: number
    basePrefix: number
    jsonIntervalMinutes: number
    sqlIntervalMinutes: number
    schedulerIntervalMinutes: number
    dailyRetentionDays: number
    weeklyRetentionWeeks: number
    monthlyRetentionMonths: number
    lastJsonBackupAt: number
    lastSqlBackupAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BackupConfigAvgAggregateInputType = {
    jsonIntervalMinutes?: true
    sqlIntervalMinutes?: true
    schedulerIntervalMinutes?: true
    dailyRetentionDays?: true
    weeklyRetentionWeeks?: true
    monthlyRetentionMonths?: true
  }

  export type BackupConfigSumAggregateInputType = {
    jsonIntervalMinutes?: true
    sqlIntervalMinutes?: true
    schedulerIntervalMinutes?: true
    dailyRetentionDays?: true
    weeklyRetentionWeeks?: true
    monthlyRetentionMonths?: true
  }

  export type BackupConfigMinAggregateInputType = {
    id?: true
    enabled?: true
    basePrefix?: true
    jsonIntervalMinutes?: true
    sqlIntervalMinutes?: true
    schedulerIntervalMinutes?: true
    dailyRetentionDays?: true
    weeklyRetentionWeeks?: true
    monthlyRetentionMonths?: true
    lastJsonBackupAt?: true
    lastSqlBackupAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupConfigMaxAggregateInputType = {
    id?: true
    enabled?: true
    basePrefix?: true
    jsonIntervalMinutes?: true
    sqlIntervalMinutes?: true
    schedulerIntervalMinutes?: true
    dailyRetentionDays?: true
    weeklyRetentionWeeks?: true
    monthlyRetentionMonths?: true
    lastJsonBackupAt?: true
    lastSqlBackupAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupConfigCountAggregateInputType = {
    id?: true
    enabled?: true
    basePrefix?: true
    jsonIntervalMinutes?: true
    sqlIntervalMinutes?: true
    schedulerIntervalMinutes?: true
    dailyRetentionDays?: true
    weeklyRetentionWeeks?: true
    monthlyRetentionMonths?: true
    lastJsonBackupAt?: true
    lastSqlBackupAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BackupConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupConfig to aggregate.
     */
    where?: BackupConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupConfigs to fetch.
     */
    orderBy?: BackupConfigOrderByWithRelationInput | BackupConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupConfigs
    **/
    _count?: true | BackupConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BackupConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BackupConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupConfigMaxAggregateInputType
  }

  export type GetBackupConfigAggregateType<T extends BackupConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupConfig[P]>
      : GetScalarType<T[P], AggregateBackupConfig[P]>
  }




  export type BackupConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupConfigWhereInput
    orderBy?: BackupConfigOrderByWithAggregationInput | BackupConfigOrderByWithAggregationInput[]
    by: BackupConfigScalarFieldEnum[] | BackupConfigScalarFieldEnum
    having?: BackupConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupConfigCountAggregateInputType | true
    _avg?: BackupConfigAvgAggregateInputType
    _sum?: BackupConfigSumAggregateInputType
    _min?: BackupConfigMinAggregateInputType
    _max?: BackupConfigMaxAggregateInputType
  }

  export type BackupConfigGroupByOutputType = {
    id: string
    enabled: boolean
    basePrefix: string
    jsonIntervalMinutes: number
    sqlIntervalMinutes: number
    schedulerIntervalMinutes: number
    dailyRetentionDays: number
    weeklyRetentionWeeks: number
    monthlyRetentionMonths: number
    lastJsonBackupAt: Date | null
    lastSqlBackupAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: BackupConfigCountAggregateOutputType | null
    _avg: BackupConfigAvgAggregateOutputType | null
    _sum: BackupConfigSumAggregateOutputType | null
    _min: BackupConfigMinAggregateOutputType | null
    _max: BackupConfigMaxAggregateOutputType | null
  }

  type GetBackupConfigGroupByPayload<T extends BackupConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupConfigGroupByOutputType[P]>
            : GetScalarType<T[P], BackupConfigGroupByOutputType[P]>
        }
      >
    >


  export type BackupConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enabled?: boolean
    basePrefix?: boolean
    jsonIntervalMinutes?: boolean
    sqlIntervalMinutes?: boolean
    schedulerIntervalMinutes?: boolean
    dailyRetentionDays?: boolean
    weeklyRetentionWeeks?: boolean
    monthlyRetentionMonths?: boolean
    lastJsonBackupAt?: boolean
    lastSqlBackupAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupConfig"]>

  export type BackupConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enabled?: boolean
    basePrefix?: boolean
    jsonIntervalMinutes?: boolean
    sqlIntervalMinutes?: boolean
    schedulerIntervalMinutes?: boolean
    dailyRetentionDays?: boolean
    weeklyRetentionWeeks?: boolean
    monthlyRetentionMonths?: boolean
    lastJsonBackupAt?: boolean
    lastSqlBackupAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupConfig"]>

  export type BackupConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    enabled?: boolean
    basePrefix?: boolean
    jsonIntervalMinutes?: boolean
    sqlIntervalMinutes?: boolean
    schedulerIntervalMinutes?: boolean
    dailyRetentionDays?: boolean
    weeklyRetentionWeeks?: boolean
    monthlyRetentionMonths?: boolean
    lastJsonBackupAt?: boolean
    lastSqlBackupAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupConfig"]>

  export type BackupConfigSelectScalar = {
    id?: boolean
    enabled?: boolean
    basePrefix?: boolean
    jsonIntervalMinutes?: boolean
    sqlIntervalMinutes?: boolean
    schedulerIntervalMinutes?: boolean
    dailyRetentionDays?: boolean
    weeklyRetentionWeeks?: boolean
    monthlyRetentionMonths?: boolean
    lastJsonBackupAt?: boolean
    lastSqlBackupAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BackupConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "enabled" | "basePrefix" | "jsonIntervalMinutes" | "sqlIntervalMinutes" | "schedulerIntervalMinutes" | "dailyRetentionDays" | "weeklyRetentionWeeks" | "monthlyRetentionMonths" | "lastJsonBackupAt" | "lastSqlBackupAt" | "createdAt" | "updatedAt", ExtArgs["result"]["backupConfig"]>

  export type $BackupConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      enabled: boolean
      basePrefix: string
      jsonIntervalMinutes: number
      sqlIntervalMinutes: number
      schedulerIntervalMinutes: number
      dailyRetentionDays: number
      weeklyRetentionWeeks: number
      monthlyRetentionMonths: number
      lastJsonBackupAt: Date | null
      lastSqlBackupAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["backupConfig"]>
    composites: {}
  }

  type BackupConfigGetPayload<S extends boolean | null | undefined | BackupConfigDefaultArgs> = $Result.GetResult<Prisma.$BackupConfigPayload, S>

  type BackupConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupConfigCountAggregateInputType | true
    }

  export interface BackupConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupConfig'], meta: { name: 'BackupConfig' } }
    /**
     * Find zero or one BackupConfig that matches the filter.
     * @param {BackupConfigFindUniqueArgs} args - Arguments to find a BackupConfig
     * @example
     * // Get one BackupConfig
     * const backupConfig = await prisma.backupConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupConfigFindUniqueArgs>(args: SelectSubset<T, BackupConfigFindUniqueArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackupConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupConfigFindUniqueOrThrowArgs} args - Arguments to find a BackupConfig
     * @example
     * // Get one BackupConfig
     * const backupConfig = await prisma.backupConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigFindFirstArgs} args - Arguments to find a BackupConfig
     * @example
     * // Get one BackupConfig
     * const backupConfig = await prisma.backupConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupConfigFindFirstArgs>(args?: SelectSubset<T, BackupConfigFindFirstArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigFindFirstOrThrowArgs} args - Arguments to find a BackupConfig
     * @example
     * // Get one BackupConfig
     * const backupConfig = await prisma.backupConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackupConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupConfigs
     * const backupConfigs = await prisma.backupConfig.findMany()
     * 
     * // Get first 10 BackupConfigs
     * const backupConfigs = await prisma.backupConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupConfigWithIdOnly = await prisma.backupConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupConfigFindManyArgs>(args?: SelectSubset<T, BackupConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackupConfig.
     * @param {BackupConfigCreateArgs} args - Arguments to create a BackupConfig.
     * @example
     * // Create one BackupConfig
     * const BackupConfig = await prisma.backupConfig.create({
     *   data: {
     *     // ... data to create a BackupConfig
     *   }
     * })
     * 
     */
    create<T extends BackupConfigCreateArgs>(args: SelectSubset<T, BackupConfigCreateArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackupConfigs.
     * @param {BackupConfigCreateManyArgs} args - Arguments to create many BackupConfigs.
     * @example
     * // Create many BackupConfigs
     * const backupConfig = await prisma.backupConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupConfigCreateManyArgs>(args?: SelectSubset<T, BackupConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackupConfigs and returns the data saved in the database.
     * @param {BackupConfigCreateManyAndReturnArgs} args - Arguments to create many BackupConfigs.
     * @example
     * // Create many BackupConfigs
     * const backupConfig = await prisma.backupConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackupConfigs and only return the `id`
     * const backupConfigWithIdOnly = await prisma.backupConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BackupConfig.
     * @param {BackupConfigDeleteArgs} args - Arguments to delete one BackupConfig.
     * @example
     * // Delete one BackupConfig
     * const BackupConfig = await prisma.backupConfig.delete({
     *   where: {
     *     // ... filter to delete one BackupConfig
     *   }
     * })
     * 
     */
    delete<T extends BackupConfigDeleteArgs>(args: SelectSubset<T, BackupConfigDeleteArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackupConfig.
     * @param {BackupConfigUpdateArgs} args - Arguments to update one BackupConfig.
     * @example
     * // Update one BackupConfig
     * const backupConfig = await prisma.backupConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupConfigUpdateArgs>(args: SelectSubset<T, BackupConfigUpdateArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackupConfigs.
     * @param {BackupConfigDeleteManyArgs} args - Arguments to filter BackupConfigs to delete.
     * @example
     * // Delete a few BackupConfigs
     * const { count } = await prisma.backupConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupConfigDeleteManyArgs>(args?: SelectSubset<T, BackupConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupConfigs
     * const backupConfig = await prisma.backupConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupConfigUpdateManyArgs>(args: SelectSubset<T, BackupConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupConfigs and returns the data updated in the database.
     * @param {BackupConfigUpdateManyAndReturnArgs} args - Arguments to update many BackupConfigs.
     * @example
     * // Update many BackupConfigs
     * const backupConfig = await prisma.backupConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BackupConfigs and only return the `id`
     * const backupConfigWithIdOnly = await prisma.backupConfig.updateManyAndReturn({
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
    updateManyAndReturn<T extends BackupConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BackupConfig.
     * @param {BackupConfigUpsertArgs} args - Arguments to update or create a BackupConfig.
     * @example
     * // Update or create a BackupConfig
     * const backupConfig = await prisma.backupConfig.upsert({
     *   create: {
     *     // ... data to create a BackupConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupConfig we want to update
     *   }
     * })
     */
    upsert<T extends BackupConfigUpsertArgs>(args: SelectSubset<T, BackupConfigUpsertArgs<ExtArgs>>): Prisma__BackupConfigClient<$Result.GetResult<Prisma.$BackupConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackupConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigCountArgs} args - Arguments to filter BackupConfigs to count.
     * @example
     * // Count the number of BackupConfigs
     * const count = await prisma.backupConfig.count({
     *   where: {
     *     // ... the filter for the BackupConfigs we want to count
     *   }
     * })
    **/
    count<T extends BackupConfigCountArgs>(
      args?: Subset<T, BackupConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BackupConfigAggregateArgs>(args: Subset<T, BackupConfigAggregateArgs>): Prisma.PrismaPromise<GetBackupConfigAggregateType<T>>

    /**
     * Group by BackupConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupConfigGroupByArgs} args - Group by arguments.
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
      T extends BackupConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupConfigGroupByArgs['orderBy'] }
        : { orderBy?: BackupConfigGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BackupConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupConfig model
   */
  readonly fields: BackupConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the BackupConfig model
   */
  interface BackupConfigFieldRefs {
    readonly id: FieldRef<"BackupConfig", 'String'>
    readonly enabled: FieldRef<"BackupConfig", 'Boolean'>
    readonly basePrefix: FieldRef<"BackupConfig", 'String'>
    readonly jsonIntervalMinutes: FieldRef<"BackupConfig", 'Int'>
    readonly sqlIntervalMinutes: FieldRef<"BackupConfig", 'Int'>
    readonly schedulerIntervalMinutes: FieldRef<"BackupConfig", 'Int'>
    readonly dailyRetentionDays: FieldRef<"BackupConfig", 'Int'>
    readonly weeklyRetentionWeeks: FieldRef<"BackupConfig", 'Int'>
    readonly monthlyRetentionMonths: FieldRef<"BackupConfig", 'Int'>
    readonly lastJsonBackupAt: FieldRef<"BackupConfig", 'DateTime'>
    readonly lastSqlBackupAt: FieldRef<"BackupConfig", 'DateTime'>
    readonly createdAt: FieldRef<"BackupConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"BackupConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupConfig findUnique
   */
  export type BackupConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter, which BackupConfig to fetch.
     */
    where: BackupConfigWhereUniqueInput
  }

  /**
   * BackupConfig findUniqueOrThrow
   */
  export type BackupConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter, which BackupConfig to fetch.
     */
    where: BackupConfigWhereUniqueInput
  }

  /**
   * BackupConfig findFirst
   */
  export type BackupConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter, which BackupConfig to fetch.
     */
    where?: BackupConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupConfigs to fetch.
     */
    orderBy?: BackupConfigOrderByWithRelationInput | BackupConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupConfigs.
     */
    cursor?: BackupConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupConfigs.
     */
    distinct?: BackupConfigScalarFieldEnum | BackupConfigScalarFieldEnum[]
  }

  /**
   * BackupConfig findFirstOrThrow
   */
  export type BackupConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter, which BackupConfig to fetch.
     */
    where?: BackupConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupConfigs to fetch.
     */
    orderBy?: BackupConfigOrderByWithRelationInput | BackupConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupConfigs.
     */
    cursor?: BackupConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupConfigs.
     */
    distinct?: BackupConfigScalarFieldEnum | BackupConfigScalarFieldEnum[]
  }

  /**
   * BackupConfig findMany
   */
  export type BackupConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter, which BackupConfigs to fetch.
     */
    where?: BackupConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupConfigs to fetch.
     */
    orderBy?: BackupConfigOrderByWithRelationInput | BackupConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupConfigs.
     */
    cursor?: BackupConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupConfigs.
     */
    skip?: number
    distinct?: BackupConfigScalarFieldEnum | BackupConfigScalarFieldEnum[]
  }

  /**
   * BackupConfig create
   */
  export type BackupConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a BackupConfig.
     */
    data: XOR<BackupConfigCreateInput, BackupConfigUncheckedCreateInput>
  }

  /**
   * BackupConfig createMany
   */
  export type BackupConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupConfigs.
     */
    data: BackupConfigCreateManyInput | BackupConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupConfig createManyAndReturn
   */
  export type BackupConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * The data used to create many BackupConfigs.
     */
    data: BackupConfigCreateManyInput | BackupConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupConfig update
   */
  export type BackupConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a BackupConfig.
     */
    data: XOR<BackupConfigUpdateInput, BackupConfigUncheckedUpdateInput>
    /**
     * Choose, which BackupConfig to update.
     */
    where: BackupConfigWhereUniqueInput
  }

  /**
   * BackupConfig updateMany
   */
  export type BackupConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupConfigs.
     */
    data: XOR<BackupConfigUpdateManyMutationInput, BackupConfigUncheckedUpdateManyInput>
    /**
     * Filter which BackupConfigs to update
     */
    where?: BackupConfigWhereInput
    /**
     * Limit how many BackupConfigs to update.
     */
    limit?: number
  }

  /**
   * BackupConfig updateManyAndReturn
   */
  export type BackupConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * The data used to update BackupConfigs.
     */
    data: XOR<BackupConfigUpdateManyMutationInput, BackupConfigUncheckedUpdateManyInput>
    /**
     * Filter which BackupConfigs to update
     */
    where?: BackupConfigWhereInput
    /**
     * Limit how many BackupConfigs to update.
     */
    limit?: number
  }

  /**
   * BackupConfig upsert
   */
  export type BackupConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the BackupConfig to update in case it exists.
     */
    where: BackupConfigWhereUniqueInput
    /**
     * In case the BackupConfig found by the `where` argument doesn't exist, create a new BackupConfig with this data.
     */
    create: XOR<BackupConfigCreateInput, BackupConfigUncheckedCreateInput>
    /**
     * In case the BackupConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupConfigUpdateInput, BackupConfigUncheckedUpdateInput>
  }

  /**
   * BackupConfig delete
   */
  export type BackupConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
    /**
     * Filter which BackupConfig to delete.
     */
    where: BackupConfigWhereUniqueInput
  }

  /**
   * BackupConfig deleteMany
   */
  export type BackupConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupConfigs to delete
     */
    where?: BackupConfigWhereInput
    /**
     * Limit how many BackupConfigs to delete.
     */
    limit?: number
  }

  /**
   * BackupConfig without action
   */
  export type BackupConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupConfig
     */
    select?: BackupConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupConfig
     */
    omit?: BackupConfigOmit<ExtArgs> | null
  }


  /**
   * Model BackupRecord
   */

  export type AggregateBackupRecord = {
    _count: BackupRecordCountAggregateOutputType | null
    _avg: BackupRecordAvgAggregateOutputType | null
    _sum: BackupRecordSumAggregateOutputType | null
    _min: BackupRecordMinAggregateOutputType | null
    _max: BackupRecordMaxAggregateOutputType | null
  }

  export type BackupRecordAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type BackupRecordSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type BackupRecordMinAggregateOutputType = {
    id: string | null
    type: $Enums.BackupType | null
    period: $Enums.BackupPeriod | null
    status: $Enums.BackupStatus | null
    trigger: $Enums.BackupTrigger | null
    storageKey: string | null
    filename: string | null
    sizeBytes: number | null
    errorMessage: string | null
    createdByUserId: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupRecordMaxAggregateOutputType = {
    id: string | null
    type: $Enums.BackupType | null
    period: $Enums.BackupPeriod | null
    status: $Enums.BackupStatus | null
    trigger: $Enums.BackupTrigger | null
    storageKey: string | null
    filename: string | null
    sizeBytes: number | null
    errorMessage: string | null
    createdByUserId: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupRecordCountAggregateOutputType = {
    id: number
    type: number
    period: number
    status: number
    trigger: number
    storageKey: number
    filename: number
    sizeBytes: number
    errorMessage: number
    createdByUserId: number
    startedAt: number
    completedAt: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BackupRecordAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type BackupRecordSumAggregateInputType = {
    sizeBytes?: true
  }

  export type BackupRecordMinAggregateInputType = {
    id?: true
    type?: true
    period?: true
    status?: true
    trigger?: true
    storageKey?: true
    filename?: true
    sizeBytes?: true
    errorMessage?: true
    createdByUserId?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupRecordMaxAggregateInputType = {
    id?: true
    type?: true
    period?: true
    status?: true
    trigger?: true
    storageKey?: true
    filename?: true
    sizeBytes?: true
    errorMessage?: true
    createdByUserId?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupRecordCountAggregateInputType = {
    id?: true
    type?: true
    period?: true
    status?: true
    trigger?: true
    storageKey?: true
    filename?: true
    sizeBytes?: true
    errorMessage?: true
    createdByUserId?: true
    startedAt?: true
    completedAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BackupRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupRecord to aggregate.
     */
    where?: BackupRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupRecords to fetch.
     */
    orderBy?: BackupRecordOrderByWithRelationInput | BackupRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupRecords
    **/
    _count?: true | BackupRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BackupRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BackupRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupRecordMaxAggregateInputType
  }

  export type GetBackupRecordAggregateType<T extends BackupRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupRecord[P]>
      : GetScalarType<T[P], AggregateBackupRecord[P]>
  }




  export type BackupRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupRecordWhereInput
    orderBy?: BackupRecordOrderByWithAggregationInput | BackupRecordOrderByWithAggregationInput[]
    by: BackupRecordScalarFieldEnum[] | BackupRecordScalarFieldEnum
    having?: BackupRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupRecordCountAggregateInputType | true
    _avg?: BackupRecordAvgAggregateInputType
    _sum?: BackupRecordSumAggregateInputType
    _min?: BackupRecordMinAggregateInputType
    _max?: BackupRecordMaxAggregateInputType
  }

  export type BackupRecordGroupByOutputType = {
    id: string
    type: $Enums.BackupType
    period: $Enums.BackupPeriod
    status: $Enums.BackupStatus
    trigger: $Enums.BackupTrigger
    storageKey: string | null
    filename: string
    sizeBytes: number | null
    errorMessage: string | null
    createdByUserId: string | null
    startedAt: Date
    completedAt: Date | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: BackupRecordCountAggregateOutputType | null
    _avg: BackupRecordAvgAggregateOutputType | null
    _sum: BackupRecordSumAggregateOutputType | null
    _min: BackupRecordMinAggregateOutputType | null
    _max: BackupRecordMaxAggregateOutputType | null
  }

  type GetBackupRecordGroupByPayload<T extends BackupRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupRecordGroupByOutputType[P]>
            : GetScalarType<T[P], BackupRecordGroupByOutputType[P]>
        }
      >
    >


  export type BackupRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    period?: boolean
    status?: boolean
    trigger?: boolean
    storageKey?: boolean
    filename?: boolean
    sizeBytes?: boolean
    errorMessage?: boolean
    createdByUserId?: boolean
    startedAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupRecord"]>

  export type BackupRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    period?: boolean
    status?: boolean
    trigger?: boolean
    storageKey?: boolean
    filename?: boolean
    sizeBytes?: boolean
    errorMessage?: boolean
    createdByUserId?: boolean
    startedAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupRecord"]>

  export type BackupRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    period?: boolean
    status?: boolean
    trigger?: boolean
    storageKey?: boolean
    filename?: boolean
    sizeBytes?: boolean
    errorMessage?: boolean
    createdByUserId?: boolean
    startedAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupRecord"]>

  export type BackupRecordSelectScalar = {
    id?: boolean
    type?: boolean
    period?: boolean
    status?: boolean
    trigger?: boolean
    storageKey?: boolean
    filename?: boolean
    sizeBytes?: boolean
    errorMessage?: boolean
    createdByUserId?: boolean
    startedAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BackupRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "period" | "status" | "trigger" | "storageKey" | "filename" | "sizeBytes" | "errorMessage" | "createdByUserId" | "startedAt" | "completedAt" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["backupRecord"]>

  export type $BackupRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.BackupType
      period: $Enums.BackupPeriod
      status: $Enums.BackupStatus
      trigger: $Enums.BackupTrigger
      storageKey: string | null
      filename: string
      sizeBytes: number | null
      errorMessage: string | null
      createdByUserId: string | null
      startedAt: Date
      completedAt: Date | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["backupRecord"]>
    composites: {}
  }

  type BackupRecordGetPayload<S extends boolean | null | undefined | BackupRecordDefaultArgs> = $Result.GetResult<Prisma.$BackupRecordPayload, S>

  type BackupRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupRecordCountAggregateInputType | true
    }

  export interface BackupRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupRecord'], meta: { name: 'BackupRecord' } }
    /**
     * Find zero or one BackupRecord that matches the filter.
     * @param {BackupRecordFindUniqueArgs} args - Arguments to find a BackupRecord
     * @example
     * // Get one BackupRecord
     * const backupRecord = await prisma.backupRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupRecordFindUniqueArgs>(args: SelectSubset<T, BackupRecordFindUniqueArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackupRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupRecordFindUniqueOrThrowArgs} args - Arguments to find a BackupRecord
     * @example
     * // Get one BackupRecord
     * const backupRecord = await prisma.backupRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordFindFirstArgs} args - Arguments to find a BackupRecord
     * @example
     * // Get one BackupRecord
     * const backupRecord = await prisma.backupRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupRecordFindFirstArgs>(args?: SelectSubset<T, BackupRecordFindFirstArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordFindFirstOrThrowArgs} args - Arguments to find a BackupRecord
     * @example
     * // Get one BackupRecord
     * const backupRecord = await prisma.backupRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackupRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupRecords
     * const backupRecords = await prisma.backupRecord.findMany()
     * 
     * // Get first 10 BackupRecords
     * const backupRecords = await prisma.backupRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupRecordWithIdOnly = await prisma.backupRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupRecordFindManyArgs>(args?: SelectSubset<T, BackupRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackupRecord.
     * @param {BackupRecordCreateArgs} args - Arguments to create a BackupRecord.
     * @example
     * // Create one BackupRecord
     * const BackupRecord = await prisma.backupRecord.create({
     *   data: {
     *     // ... data to create a BackupRecord
     *   }
     * })
     * 
     */
    create<T extends BackupRecordCreateArgs>(args: SelectSubset<T, BackupRecordCreateArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackupRecords.
     * @param {BackupRecordCreateManyArgs} args - Arguments to create many BackupRecords.
     * @example
     * // Create many BackupRecords
     * const backupRecord = await prisma.backupRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupRecordCreateManyArgs>(args?: SelectSubset<T, BackupRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackupRecords and returns the data saved in the database.
     * @param {BackupRecordCreateManyAndReturnArgs} args - Arguments to create many BackupRecords.
     * @example
     * // Create many BackupRecords
     * const backupRecord = await prisma.backupRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackupRecords and only return the `id`
     * const backupRecordWithIdOnly = await prisma.backupRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BackupRecord.
     * @param {BackupRecordDeleteArgs} args - Arguments to delete one BackupRecord.
     * @example
     * // Delete one BackupRecord
     * const BackupRecord = await prisma.backupRecord.delete({
     *   where: {
     *     // ... filter to delete one BackupRecord
     *   }
     * })
     * 
     */
    delete<T extends BackupRecordDeleteArgs>(args: SelectSubset<T, BackupRecordDeleteArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackupRecord.
     * @param {BackupRecordUpdateArgs} args - Arguments to update one BackupRecord.
     * @example
     * // Update one BackupRecord
     * const backupRecord = await prisma.backupRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupRecordUpdateArgs>(args: SelectSubset<T, BackupRecordUpdateArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackupRecords.
     * @param {BackupRecordDeleteManyArgs} args - Arguments to filter BackupRecords to delete.
     * @example
     * // Delete a few BackupRecords
     * const { count } = await prisma.backupRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupRecordDeleteManyArgs>(args?: SelectSubset<T, BackupRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupRecords
     * const backupRecord = await prisma.backupRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupRecordUpdateManyArgs>(args: SelectSubset<T, BackupRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupRecords and returns the data updated in the database.
     * @param {BackupRecordUpdateManyAndReturnArgs} args - Arguments to update many BackupRecords.
     * @example
     * // Update many BackupRecords
     * const backupRecord = await prisma.backupRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BackupRecords and only return the `id`
     * const backupRecordWithIdOnly = await prisma.backupRecord.updateManyAndReturn({
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
    updateManyAndReturn<T extends BackupRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BackupRecord.
     * @param {BackupRecordUpsertArgs} args - Arguments to update or create a BackupRecord.
     * @example
     * // Update or create a BackupRecord
     * const backupRecord = await prisma.backupRecord.upsert({
     *   create: {
     *     // ... data to create a BackupRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupRecord we want to update
     *   }
     * })
     */
    upsert<T extends BackupRecordUpsertArgs>(args: SelectSubset<T, BackupRecordUpsertArgs<ExtArgs>>): Prisma__BackupRecordClient<$Result.GetResult<Prisma.$BackupRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackupRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordCountArgs} args - Arguments to filter BackupRecords to count.
     * @example
     * // Count the number of BackupRecords
     * const count = await prisma.backupRecord.count({
     *   where: {
     *     // ... the filter for the BackupRecords we want to count
     *   }
     * })
    **/
    count<T extends BackupRecordCountArgs>(
      args?: Subset<T, BackupRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BackupRecordAggregateArgs>(args: Subset<T, BackupRecordAggregateArgs>): Prisma.PrismaPromise<GetBackupRecordAggregateType<T>>

    /**
     * Group by BackupRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupRecordGroupByArgs} args - Group by arguments.
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
      T extends BackupRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupRecordGroupByArgs['orderBy'] }
        : { orderBy?: BackupRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BackupRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupRecord model
   */
  readonly fields: BackupRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the BackupRecord model
   */
  interface BackupRecordFieldRefs {
    readonly id: FieldRef<"BackupRecord", 'String'>
    readonly type: FieldRef<"BackupRecord", 'BackupType'>
    readonly period: FieldRef<"BackupRecord", 'BackupPeriod'>
    readonly status: FieldRef<"BackupRecord", 'BackupStatus'>
    readonly trigger: FieldRef<"BackupRecord", 'BackupTrigger'>
    readonly storageKey: FieldRef<"BackupRecord", 'String'>
    readonly filename: FieldRef<"BackupRecord", 'String'>
    readonly sizeBytes: FieldRef<"BackupRecord", 'Int'>
    readonly errorMessage: FieldRef<"BackupRecord", 'String'>
    readonly createdByUserId: FieldRef<"BackupRecord", 'String'>
    readonly startedAt: FieldRef<"BackupRecord", 'DateTime'>
    readonly completedAt: FieldRef<"BackupRecord", 'DateTime'>
    readonly metadata: FieldRef<"BackupRecord", 'Json'>
    readonly createdAt: FieldRef<"BackupRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"BackupRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupRecord findUnique
   */
  export type BackupRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter, which BackupRecord to fetch.
     */
    where: BackupRecordWhereUniqueInput
  }

  /**
   * BackupRecord findUniqueOrThrow
   */
  export type BackupRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter, which BackupRecord to fetch.
     */
    where: BackupRecordWhereUniqueInput
  }

  /**
   * BackupRecord findFirst
   */
  export type BackupRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter, which BackupRecord to fetch.
     */
    where?: BackupRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupRecords to fetch.
     */
    orderBy?: BackupRecordOrderByWithRelationInput | BackupRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupRecords.
     */
    cursor?: BackupRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupRecords.
     */
    distinct?: BackupRecordScalarFieldEnum | BackupRecordScalarFieldEnum[]
  }

  /**
   * BackupRecord findFirstOrThrow
   */
  export type BackupRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter, which BackupRecord to fetch.
     */
    where?: BackupRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupRecords to fetch.
     */
    orderBy?: BackupRecordOrderByWithRelationInput | BackupRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupRecords.
     */
    cursor?: BackupRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupRecords.
     */
    distinct?: BackupRecordScalarFieldEnum | BackupRecordScalarFieldEnum[]
  }

  /**
   * BackupRecord findMany
   */
  export type BackupRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter, which BackupRecords to fetch.
     */
    where?: BackupRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupRecords to fetch.
     */
    orderBy?: BackupRecordOrderByWithRelationInput | BackupRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupRecords.
     */
    cursor?: BackupRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupRecords.
     */
    skip?: number
    distinct?: BackupRecordScalarFieldEnum | BackupRecordScalarFieldEnum[]
  }

  /**
   * BackupRecord create
   */
  export type BackupRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a BackupRecord.
     */
    data: XOR<BackupRecordCreateInput, BackupRecordUncheckedCreateInput>
  }

  /**
   * BackupRecord createMany
   */
  export type BackupRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupRecords.
     */
    data: BackupRecordCreateManyInput | BackupRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupRecord createManyAndReturn
   */
  export type BackupRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * The data used to create many BackupRecords.
     */
    data: BackupRecordCreateManyInput | BackupRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupRecord update
   */
  export type BackupRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a BackupRecord.
     */
    data: XOR<BackupRecordUpdateInput, BackupRecordUncheckedUpdateInput>
    /**
     * Choose, which BackupRecord to update.
     */
    where: BackupRecordWhereUniqueInput
  }

  /**
   * BackupRecord updateMany
   */
  export type BackupRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupRecords.
     */
    data: XOR<BackupRecordUpdateManyMutationInput, BackupRecordUncheckedUpdateManyInput>
    /**
     * Filter which BackupRecords to update
     */
    where?: BackupRecordWhereInput
    /**
     * Limit how many BackupRecords to update.
     */
    limit?: number
  }

  /**
   * BackupRecord updateManyAndReturn
   */
  export type BackupRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * The data used to update BackupRecords.
     */
    data: XOR<BackupRecordUpdateManyMutationInput, BackupRecordUncheckedUpdateManyInput>
    /**
     * Filter which BackupRecords to update
     */
    where?: BackupRecordWhereInput
    /**
     * Limit how many BackupRecords to update.
     */
    limit?: number
  }

  /**
   * BackupRecord upsert
   */
  export type BackupRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the BackupRecord to update in case it exists.
     */
    where: BackupRecordWhereUniqueInput
    /**
     * In case the BackupRecord found by the `where` argument doesn't exist, create a new BackupRecord with this data.
     */
    create: XOR<BackupRecordCreateInput, BackupRecordUncheckedCreateInput>
    /**
     * In case the BackupRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupRecordUpdateInput, BackupRecordUncheckedUpdateInput>
  }

  /**
   * BackupRecord delete
   */
  export type BackupRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
    /**
     * Filter which BackupRecord to delete.
     */
    where: BackupRecordWhereUniqueInput
  }

  /**
   * BackupRecord deleteMany
   */
  export type BackupRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupRecords to delete
     */
    where?: BackupRecordWhereInput
    /**
     * Limit how many BackupRecords to delete.
     */
    limit?: number
  }

  /**
   * BackupRecord without action
   */
  export type BackupRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupRecord
     */
    select?: BackupRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupRecord
     */
    omit?: BackupRecordOmit<ExtArgs> | null
  }


  /**
   * Model BackupLock
   */

  export type AggregateBackupLock = {
    _count: BackupLockCountAggregateOutputType | null
    _min: BackupLockMinAggregateOutputType | null
    _max: BackupLockMaxAggregateOutputType | null
  }

  export type BackupLockMinAggregateOutputType = {
    name: string | null
    owner: string | null
    lockedUntil: Date | null
    lockedAt: Date | null
    updatedAt: Date | null
  }

  export type BackupLockMaxAggregateOutputType = {
    name: string | null
    owner: string | null
    lockedUntil: Date | null
    lockedAt: Date | null
    updatedAt: Date | null
  }

  export type BackupLockCountAggregateOutputType = {
    name: number
    owner: number
    lockedUntil: number
    lockedAt: number
    updatedAt: number
    _all: number
  }


  export type BackupLockMinAggregateInputType = {
    name?: true
    owner?: true
    lockedUntil?: true
    lockedAt?: true
    updatedAt?: true
  }

  export type BackupLockMaxAggregateInputType = {
    name?: true
    owner?: true
    lockedUntil?: true
    lockedAt?: true
    updatedAt?: true
  }

  export type BackupLockCountAggregateInputType = {
    name?: true
    owner?: true
    lockedUntil?: true
    lockedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BackupLockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupLock to aggregate.
     */
    where?: BackupLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupLocks to fetch.
     */
    orderBy?: BackupLockOrderByWithRelationInput | BackupLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupLocks
    **/
    _count?: true | BackupLockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupLockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupLockMaxAggregateInputType
  }

  export type GetBackupLockAggregateType<T extends BackupLockAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupLock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupLock[P]>
      : GetScalarType<T[P], AggregateBackupLock[P]>
  }




  export type BackupLockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupLockWhereInput
    orderBy?: BackupLockOrderByWithAggregationInput | BackupLockOrderByWithAggregationInput[]
    by: BackupLockScalarFieldEnum[] | BackupLockScalarFieldEnum
    having?: BackupLockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupLockCountAggregateInputType | true
    _min?: BackupLockMinAggregateInputType
    _max?: BackupLockMaxAggregateInputType
  }

  export type BackupLockGroupByOutputType = {
    name: string
    owner: string
    lockedUntil: Date
    lockedAt: Date
    updatedAt: Date
    _count: BackupLockCountAggregateOutputType | null
    _min: BackupLockMinAggregateOutputType | null
    _max: BackupLockMaxAggregateOutputType | null
  }

  type GetBackupLockGroupByPayload<T extends BackupLockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupLockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupLockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupLockGroupByOutputType[P]>
            : GetScalarType<T[P], BackupLockGroupByOutputType[P]>
        }
      >
    >


  export type BackupLockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    name?: boolean
    owner?: boolean
    lockedUntil?: boolean
    lockedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupLock"]>

  export type BackupLockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    name?: boolean
    owner?: boolean
    lockedUntil?: boolean
    lockedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupLock"]>

  export type BackupLockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    name?: boolean
    owner?: boolean
    lockedUntil?: boolean
    lockedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupLock"]>

  export type BackupLockSelectScalar = {
    name?: boolean
    owner?: boolean
    lockedUntil?: boolean
    lockedAt?: boolean
    updatedAt?: boolean
  }

  export type BackupLockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"name" | "owner" | "lockedUntil" | "lockedAt" | "updatedAt", ExtArgs["result"]["backupLock"]>

  export type $BackupLockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupLock"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      name: string
      owner: string
      lockedUntil: Date
      lockedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["backupLock"]>
    composites: {}
  }

  type BackupLockGetPayload<S extends boolean | null | undefined | BackupLockDefaultArgs> = $Result.GetResult<Prisma.$BackupLockPayload, S>

  type BackupLockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupLockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupLockCountAggregateInputType | true
    }

  export interface BackupLockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupLock'], meta: { name: 'BackupLock' } }
    /**
     * Find zero or one BackupLock that matches the filter.
     * @param {BackupLockFindUniqueArgs} args - Arguments to find a BackupLock
     * @example
     * // Get one BackupLock
     * const backupLock = await prisma.backupLock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupLockFindUniqueArgs>(args: SelectSubset<T, BackupLockFindUniqueArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackupLock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupLockFindUniqueOrThrowArgs} args - Arguments to find a BackupLock
     * @example
     * // Get one BackupLock
     * const backupLock = await prisma.backupLock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupLockFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupLockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupLock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockFindFirstArgs} args - Arguments to find a BackupLock
     * @example
     * // Get one BackupLock
     * const backupLock = await prisma.backupLock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupLockFindFirstArgs>(args?: SelectSubset<T, BackupLockFindFirstArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupLock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockFindFirstOrThrowArgs} args - Arguments to find a BackupLock
     * @example
     * // Get one BackupLock
     * const backupLock = await prisma.backupLock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupLockFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupLockFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackupLocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupLocks
     * const backupLocks = await prisma.backupLock.findMany()
     * 
     * // Get first 10 BackupLocks
     * const backupLocks = await prisma.backupLock.findMany({ take: 10 })
     * 
     * // Only select the `name`
     * const backupLockWithNameOnly = await prisma.backupLock.findMany({ select: { name: true } })
     * 
     */
    findMany<T extends BackupLockFindManyArgs>(args?: SelectSubset<T, BackupLockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackupLock.
     * @param {BackupLockCreateArgs} args - Arguments to create a BackupLock.
     * @example
     * // Create one BackupLock
     * const BackupLock = await prisma.backupLock.create({
     *   data: {
     *     // ... data to create a BackupLock
     *   }
     * })
     * 
     */
    create<T extends BackupLockCreateArgs>(args: SelectSubset<T, BackupLockCreateArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackupLocks.
     * @param {BackupLockCreateManyArgs} args - Arguments to create many BackupLocks.
     * @example
     * // Create many BackupLocks
     * const backupLock = await prisma.backupLock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupLockCreateManyArgs>(args?: SelectSubset<T, BackupLockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackupLocks and returns the data saved in the database.
     * @param {BackupLockCreateManyAndReturnArgs} args - Arguments to create many BackupLocks.
     * @example
     * // Create many BackupLocks
     * const backupLock = await prisma.backupLock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackupLocks and only return the `name`
     * const backupLockWithNameOnly = await prisma.backupLock.createManyAndReturn({
     *   select: { name: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupLockCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupLockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BackupLock.
     * @param {BackupLockDeleteArgs} args - Arguments to delete one BackupLock.
     * @example
     * // Delete one BackupLock
     * const BackupLock = await prisma.backupLock.delete({
     *   where: {
     *     // ... filter to delete one BackupLock
     *   }
     * })
     * 
     */
    delete<T extends BackupLockDeleteArgs>(args: SelectSubset<T, BackupLockDeleteArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackupLock.
     * @param {BackupLockUpdateArgs} args - Arguments to update one BackupLock.
     * @example
     * // Update one BackupLock
     * const backupLock = await prisma.backupLock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupLockUpdateArgs>(args: SelectSubset<T, BackupLockUpdateArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackupLocks.
     * @param {BackupLockDeleteManyArgs} args - Arguments to filter BackupLocks to delete.
     * @example
     * // Delete a few BackupLocks
     * const { count } = await prisma.backupLock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupLockDeleteManyArgs>(args?: SelectSubset<T, BackupLockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupLocks
     * const backupLock = await prisma.backupLock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupLockUpdateManyArgs>(args: SelectSubset<T, BackupLockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupLocks and returns the data updated in the database.
     * @param {BackupLockUpdateManyAndReturnArgs} args - Arguments to update many BackupLocks.
     * @example
     * // Update many BackupLocks
     * const backupLock = await prisma.backupLock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BackupLocks and only return the `name`
     * const backupLockWithNameOnly = await prisma.backupLock.updateManyAndReturn({
     *   select: { name: true },
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
    updateManyAndReturn<T extends BackupLockUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupLockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BackupLock.
     * @param {BackupLockUpsertArgs} args - Arguments to update or create a BackupLock.
     * @example
     * // Update or create a BackupLock
     * const backupLock = await prisma.backupLock.upsert({
     *   create: {
     *     // ... data to create a BackupLock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupLock we want to update
     *   }
     * })
     */
    upsert<T extends BackupLockUpsertArgs>(args: SelectSubset<T, BackupLockUpsertArgs<ExtArgs>>): Prisma__BackupLockClient<$Result.GetResult<Prisma.$BackupLockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackupLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockCountArgs} args - Arguments to filter BackupLocks to count.
     * @example
     * // Count the number of BackupLocks
     * const count = await prisma.backupLock.count({
     *   where: {
     *     // ... the filter for the BackupLocks we want to count
     *   }
     * })
    **/
    count<T extends BackupLockCountArgs>(
      args?: Subset<T, BackupLockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupLockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BackupLockAggregateArgs>(args: Subset<T, BackupLockAggregateArgs>): Prisma.PrismaPromise<GetBackupLockAggregateType<T>>

    /**
     * Group by BackupLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupLockGroupByArgs} args - Group by arguments.
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
      T extends BackupLockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupLockGroupByArgs['orderBy'] }
        : { orderBy?: BackupLockGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BackupLockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupLockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupLock model
   */
  readonly fields: BackupLockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupLock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupLockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the BackupLock model
   */
  interface BackupLockFieldRefs {
    readonly name: FieldRef<"BackupLock", 'String'>
    readonly owner: FieldRef<"BackupLock", 'String'>
    readonly lockedUntil: FieldRef<"BackupLock", 'DateTime'>
    readonly lockedAt: FieldRef<"BackupLock", 'DateTime'>
    readonly updatedAt: FieldRef<"BackupLock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupLock findUnique
   */
  export type BackupLockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter, which BackupLock to fetch.
     */
    where: BackupLockWhereUniqueInput
  }

  /**
   * BackupLock findUniqueOrThrow
   */
  export type BackupLockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter, which BackupLock to fetch.
     */
    where: BackupLockWhereUniqueInput
  }

  /**
   * BackupLock findFirst
   */
  export type BackupLockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter, which BackupLock to fetch.
     */
    where?: BackupLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupLocks to fetch.
     */
    orderBy?: BackupLockOrderByWithRelationInput | BackupLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupLocks.
     */
    cursor?: BackupLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupLocks.
     */
    distinct?: BackupLockScalarFieldEnum | BackupLockScalarFieldEnum[]
  }

  /**
   * BackupLock findFirstOrThrow
   */
  export type BackupLockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter, which BackupLock to fetch.
     */
    where?: BackupLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupLocks to fetch.
     */
    orderBy?: BackupLockOrderByWithRelationInput | BackupLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupLocks.
     */
    cursor?: BackupLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupLocks.
     */
    distinct?: BackupLockScalarFieldEnum | BackupLockScalarFieldEnum[]
  }

  /**
   * BackupLock findMany
   */
  export type BackupLockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter, which BackupLocks to fetch.
     */
    where?: BackupLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupLocks to fetch.
     */
    orderBy?: BackupLockOrderByWithRelationInput | BackupLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupLocks.
     */
    cursor?: BackupLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupLocks.
     */
    skip?: number
    distinct?: BackupLockScalarFieldEnum | BackupLockScalarFieldEnum[]
  }

  /**
   * BackupLock create
   */
  export type BackupLockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * The data needed to create a BackupLock.
     */
    data: XOR<BackupLockCreateInput, BackupLockUncheckedCreateInput>
  }

  /**
   * BackupLock createMany
   */
  export type BackupLockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupLocks.
     */
    data: BackupLockCreateManyInput | BackupLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupLock createManyAndReturn
   */
  export type BackupLockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * The data used to create many BackupLocks.
     */
    data: BackupLockCreateManyInput | BackupLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupLock update
   */
  export type BackupLockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * The data needed to update a BackupLock.
     */
    data: XOR<BackupLockUpdateInput, BackupLockUncheckedUpdateInput>
    /**
     * Choose, which BackupLock to update.
     */
    where: BackupLockWhereUniqueInput
  }

  /**
   * BackupLock updateMany
   */
  export type BackupLockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupLocks.
     */
    data: XOR<BackupLockUpdateManyMutationInput, BackupLockUncheckedUpdateManyInput>
    /**
     * Filter which BackupLocks to update
     */
    where?: BackupLockWhereInput
    /**
     * Limit how many BackupLocks to update.
     */
    limit?: number
  }

  /**
   * BackupLock updateManyAndReturn
   */
  export type BackupLockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * The data used to update BackupLocks.
     */
    data: XOR<BackupLockUpdateManyMutationInput, BackupLockUncheckedUpdateManyInput>
    /**
     * Filter which BackupLocks to update
     */
    where?: BackupLockWhereInput
    /**
     * Limit how many BackupLocks to update.
     */
    limit?: number
  }

  /**
   * BackupLock upsert
   */
  export type BackupLockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * The filter to search for the BackupLock to update in case it exists.
     */
    where: BackupLockWhereUniqueInput
    /**
     * In case the BackupLock found by the `where` argument doesn't exist, create a new BackupLock with this data.
     */
    create: XOR<BackupLockCreateInput, BackupLockUncheckedCreateInput>
    /**
     * In case the BackupLock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupLockUpdateInput, BackupLockUncheckedUpdateInput>
  }

  /**
   * BackupLock delete
   */
  export type BackupLockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
    /**
     * Filter which BackupLock to delete.
     */
    where: BackupLockWhereUniqueInput
  }

  /**
   * BackupLock deleteMany
   */
  export type BackupLockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupLocks to delete
     */
    where?: BackupLockWhereInput
    /**
     * Limit how many BackupLocks to delete.
     */
    limit?: number
  }

  /**
   * BackupLock without action
   */
  export type BackupLockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupLock
     */
    select?: BackupLockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupLock
     */
    omit?: BackupLockOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
    banned: number
    banReason: number
    banExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    emailVerified: boolean | null
    image: string | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    applications?: boolean | User$applicationsArgs<ExtArgs>
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "role" | "banned" | "banReason" | "banExpires" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | User$applicationsArgs<ExtArgs>
    apiKeys?: boolean | User$apiKeysArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      apiKeys: Prisma.$ApiKeyPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      emailVerified: boolean | null
      image: string | null
      role: string | null
      banned: boolean | null
      banReason: string | null
      banExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends User$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    apiKeys<T extends User$apiKeysArgs<ExtArgs> = {}>(args?: Subset<T, User$apiKeysArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly banReason: FieldRef<"User", 'String'>
    readonly banExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.applications
   */
  export type User$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * User.apiKeys
   */
  export type User$apiKeysArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiKeyInclude<ExtArgs> | null
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    cursor?: ApiKeyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
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
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    token: string | null
    userId: string | null
    expiresAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    token: string | null
    userId: string | null
    expiresAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    token: number
    userId: number
    expiresAt: number
    ipAddress: number
    userAgent: number
    impersonatedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    token?: true
    userId?: true
    expiresAt?: true
    ipAddress?: true
    userAgent?: true
    impersonatedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    token: string
    userId: string
    expiresAt: Date
    ipAddress: string | null
    userAgent: string | null
    impersonatedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    token?: boolean
    userId?: boolean
    expiresAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    impersonatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "userId" | "expiresAt" | "ipAddress" | "userAgent" | "impersonatedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      userId: string
      expiresAt: Date
      ipAddress: string | null
      userAgent: string | null
      impersonatedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
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
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly token: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly impersonatedBy: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
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
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
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
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which verification to aggregate.
     */
    where?: verificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verifications to fetch.
     */
    orderBy?: verificationOrderByWithRelationInput | verificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: verificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type verificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: verificationWhereInput
    orderBy?: verificationOrderByWithAggregationInput | verificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: verificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends verificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type verificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type verificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type verificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type verificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type verificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $verificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type verificationGetPayload<S extends boolean | null | undefined | verificationDefaultArgs> = $Result.GetResult<Prisma.$verificationPayload, S>

  type verificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<verificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface verificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['verification'], meta: { name: 'verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {verificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends verificationFindUniqueArgs>(args: SelectSubset<T, verificationFindUniqueArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {verificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends verificationFindUniqueOrThrowArgs>(args: SelectSubset<T, verificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends verificationFindFirstArgs>(args?: SelectSubset<T, verificationFindFirstArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends verificationFindFirstOrThrowArgs>(args?: SelectSubset<T, verificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends verificationFindManyArgs>(args?: SelectSubset<T, verificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {verificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends verificationCreateArgs>(args: SelectSubset<T, verificationCreateArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {verificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends verificationCreateManyArgs>(args?: SelectSubset<T, verificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {verificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends verificationCreateManyAndReturnArgs>(args?: SelectSubset<T, verificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {verificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends verificationDeleteArgs>(args: SelectSubset<T, verificationDeleteArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {verificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends verificationUpdateArgs>(args: SelectSubset<T, verificationUpdateArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {verificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends verificationDeleteManyArgs>(args?: SelectSubset<T, verificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends verificationUpdateManyArgs>(args: SelectSubset<T, verificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {verificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
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
    updateManyAndReturn<T extends verificationUpdateManyAndReturnArgs>(args: SelectSubset<T, verificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {verificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends verificationUpsertArgs>(args: SelectSubset<T, verificationUpsertArgs<ExtArgs>>): Prisma__verificationClient<$Result.GetResult<Prisma.$verificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends verificationCountArgs>(
      args?: Subset<T, verificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {verificationGroupByArgs} args - Group by arguments.
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
      T extends verificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: verificationGroupByArgs['orderBy'] }
        : { orderBy?: verificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, verificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the verification model
   */
  readonly fields: verificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__verificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the verification model
   */
  interface verificationFieldRefs {
    readonly id: FieldRef<"verification", 'String'>
    readonly identifier: FieldRef<"verification", 'String'>
    readonly value: FieldRef<"verification", 'String'>
    readonly expiresAt: FieldRef<"verification", 'DateTime'>
    readonly createdAt: FieldRef<"verification", 'DateTime'>
    readonly updatedAt: FieldRef<"verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * verification findUnique
   */
  export type verificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter, which verification to fetch.
     */
    where: verificationWhereUniqueInput
  }

  /**
   * verification findUniqueOrThrow
   */
  export type verificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter, which verification to fetch.
     */
    where: verificationWhereUniqueInput
  }

  /**
   * verification findFirst
   */
  export type verificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter, which verification to fetch.
     */
    where?: verificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verifications to fetch.
     */
    orderBy?: verificationOrderByWithRelationInput | verificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for verifications.
     */
    cursor?: verificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * verification findFirstOrThrow
   */
  export type verificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter, which verification to fetch.
     */
    where?: verificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verifications to fetch.
     */
    orderBy?: verificationOrderByWithRelationInput | verificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for verifications.
     */
    cursor?: verificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * verification findMany
   */
  export type verificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter, which verifications to fetch.
     */
    where?: verificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of verifications to fetch.
     */
    orderBy?: verificationOrderByWithRelationInput | verificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing verifications.
     */
    cursor?: verificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * verification create
   */
  export type verificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * The data needed to create a verification.
     */
    data: XOR<verificationCreateInput, verificationUncheckedCreateInput>
  }

  /**
   * verification createMany
   */
  export type verificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many verifications.
     */
    data: verificationCreateManyInput | verificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * verification createManyAndReturn
   */
  export type verificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * The data used to create many verifications.
     */
    data: verificationCreateManyInput | verificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * verification update
   */
  export type verificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * The data needed to update a verification.
     */
    data: XOR<verificationUpdateInput, verificationUncheckedUpdateInput>
    /**
     * Choose, which verification to update.
     */
    where: verificationWhereUniqueInput
  }

  /**
   * verification updateMany
   */
  export type verificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update verifications.
     */
    data: XOR<verificationUpdateManyMutationInput, verificationUncheckedUpdateManyInput>
    /**
     * Filter which verifications to update
     */
    where?: verificationWhereInput
    /**
     * Limit how many verifications to update.
     */
    limit?: number
  }

  /**
   * verification updateManyAndReturn
   */
  export type verificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * The data used to update verifications.
     */
    data: XOR<verificationUpdateManyMutationInput, verificationUncheckedUpdateManyInput>
    /**
     * Filter which verifications to update
     */
    where?: verificationWhereInput
    /**
     * Limit how many verifications to update.
     */
    limit?: number
  }

  /**
   * verification upsert
   */
  export type verificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * The filter to search for the verification to update in case it exists.
     */
    where: verificationWhereUniqueInput
    /**
     * In case the verification found by the `where` argument doesn't exist, create a new verification with this data.
     */
    create: XOR<verificationCreateInput, verificationUncheckedCreateInput>
    /**
     * In case the verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<verificationUpdateInput, verificationUncheckedUpdateInput>
  }

  /**
   * verification delete
   */
  export type verificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
    /**
     * Filter which verification to delete.
     */
    where: verificationWhereUniqueInput
  }

  /**
   * verification deleteMany
   */
  export type verificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which verifications to delete
     */
    where?: verificationWhereInput
    /**
     * Limit how many verifications to delete.
     */
    limit?: number
  }

  /**
   * verification without action
   */
  export type verificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the verification
     */
    select?: verificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the verification
     */
    omit?: verificationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    storageDir: 'storageDir'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const ImageScalarFieldEnum: {
    id: 'id',
    filename: 'filename',
    contentType: 'contentType',
    sizeBytes: 'sizeBytes',
    width: 'width',
    height: 'height',
    hash: 'hash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImageScalarFieldEnum = (typeof ImageScalarFieldEnum)[keyof typeof ImageScalarFieldEnum]


  export const ImageApplicationScalarFieldEnum: {
    id: 'id',
    imageId: 'imageId',
    applicationId: 'applicationId',
    originalName: 'originalName',
    tags: 'tags',
    linkedAt: 'linkedAt',
    updatedAt: 'updatedAt'
  };

  export type ImageApplicationScalarFieldEnum = (typeof ImageApplicationScalarFieldEnum)[keyof typeof ImageApplicationScalarFieldEnum]


  export const ImageVariantScalarFieldEnum: {
    id: 'id',
    imageId: 'imageId',
    label: 'label',
    filename: 'filename',
    width: 'width',
    height: 'height',
    sizeBytes: 'sizeBytes',
    createdAt: 'createdAt'
  };

  export type ImageVariantScalarFieldEnum = (typeof ImageVariantScalarFieldEnum)[keyof typeof ImageVariantScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    applicationId: 'applicationId',
    userId: 'userId',
    name: 'name',
    hash: 'hash',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt',
    revoked: 'revoked'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    applicationId: 'applicationId',
    apiKeyId: 'apiKeyId',
    action: 'action',
    targetId: 'targetId',
    ip: 'ip',
    userAgent: 'userAgent',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const BackupConfigScalarFieldEnum: {
    id: 'id',
    enabled: 'enabled',
    basePrefix: 'basePrefix',
    jsonIntervalMinutes: 'jsonIntervalMinutes',
    sqlIntervalMinutes: 'sqlIntervalMinutes',
    schedulerIntervalMinutes: 'schedulerIntervalMinutes',
    dailyRetentionDays: 'dailyRetentionDays',
    weeklyRetentionWeeks: 'weeklyRetentionWeeks',
    monthlyRetentionMonths: 'monthlyRetentionMonths',
    lastJsonBackupAt: 'lastJsonBackupAt',
    lastSqlBackupAt: 'lastSqlBackupAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BackupConfigScalarFieldEnum = (typeof BackupConfigScalarFieldEnum)[keyof typeof BackupConfigScalarFieldEnum]


  export const BackupRecordScalarFieldEnum: {
    id: 'id',
    type: 'type',
    period: 'period',
    status: 'status',
    trigger: 'trigger',
    storageKey: 'storageKey',
    filename: 'filename',
    sizeBytes: 'sizeBytes',
    errorMessage: 'errorMessage',
    createdByUserId: 'createdByUserId',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BackupRecordScalarFieldEnum = (typeof BackupRecordScalarFieldEnum)[keyof typeof BackupRecordScalarFieldEnum]


  export const BackupLockScalarFieldEnum: {
    name: 'name',
    owner: 'owner',
    lockedUntil: 'lockedUntil',
    lockedAt: 'lockedAt',
    updatedAt: 'updatedAt'
  };

  export type BackupLockScalarFieldEnum = (typeof BackupLockScalarFieldEnum)[keyof typeof BackupLockScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    banned: 'banned',
    banReason: 'banReason',
    banExpires: 'banExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    token: 'token',
    userId: 'userId',
    expiresAt: 'expiresAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    impersonatedBy: 'impersonatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BackupType'
   */
  export type EnumBackupTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupType'>
    


  /**
   * Reference to a field of type 'BackupType[]'
   */
  export type ListEnumBackupTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupType[]'>
    


  /**
   * Reference to a field of type 'BackupPeriod'
   */
  export type EnumBackupPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupPeriod'>
    


  /**
   * Reference to a field of type 'BackupPeriod[]'
   */
  export type ListEnumBackupPeriodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupPeriod[]'>
    


  /**
   * Reference to a field of type 'BackupStatus'
   */
  export type EnumBackupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupStatus'>
    


  /**
   * Reference to a field of type 'BackupStatus[]'
   */
  export type ListEnumBackupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupStatus[]'>
    


  /**
   * Reference to a field of type 'BackupTrigger'
   */
  export type EnumBackupTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupTrigger'>
    


  /**
   * Reference to a field of type 'BackupTrigger[]'
   */
  export type ListEnumBackupTriggerFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BackupTrigger[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: StringFilter<"Application"> | string
    name?: StringFilter<"Application"> | string
    slug?: StringFilter<"Application"> | string
    ownerId?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    storageDir?: StringFilter<"Application"> | string
    imageApplications?: ImageApplicationListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    members?: UserListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storageDir?: SortOrder
    imageApplications?: ImageApplicationOrderByRelationAggregateInput
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    members?: UserOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    name?: StringFilter<"Application"> | string
    ownerId?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    storageDir?: StringFilter<"Application"> | string
    imageApplications?: ImageApplicationListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    members?: UserListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "slug">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storageDir?: SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Application"> | string
    name?: StringWithAggregatesFilter<"Application"> | string
    slug?: StringWithAggregatesFilter<"Application"> | string
    ownerId?: StringWithAggregatesFilter<"Application"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    storageDir?: StringWithAggregatesFilter<"Application"> | string
  }

  export type ImageWhereInput = {
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    id?: StringFilter<"Image"> | string
    filename?: StringFilter<"Image"> | string
    contentType?: StringFilter<"Image"> | string
    sizeBytes?: IntFilter<"Image"> | number
    width?: IntNullableFilter<"Image"> | number | null
    height?: IntNullableFilter<"Image"> | number | null
    hash?: StringFilter<"Image"> | string
    createdAt?: DateTimeFilter<"Image"> | Date | string
    updatedAt?: DateTimeFilter<"Image"> | Date | string
    variants?: ImageVariantListRelationFilter
    applications?: ImageApplicationListRelationFilter
  }

  export type ImageOrderByWithRelationInput = {
    id?: SortOrder
    filename?: SortOrder
    contentType?: SortOrder
    sizeBytes?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    variants?: ImageVariantOrderByRelationAggregateInput
    applications?: ImageApplicationOrderByRelationAggregateInput
  }

  export type ImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    hash?: string
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    filename?: StringFilter<"Image"> | string
    contentType?: StringFilter<"Image"> | string
    sizeBytes?: IntFilter<"Image"> | number
    width?: IntNullableFilter<"Image"> | number | null
    height?: IntNullableFilter<"Image"> | number | null
    createdAt?: DateTimeFilter<"Image"> | Date | string
    updatedAt?: DateTimeFilter<"Image"> | Date | string
    variants?: ImageVariantListRelationFilter
    applications?: ImageApplicationListRelationFilter
  }, "id" | "hash">

  export type ImageOrderByWithAggregationInput = {
    id?: SortOrder
    filename?: SortOrder
    contentType?: SortOrder
    sizeBytes?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImageCountOrderByAggregateInput
    _avg?: ImageAvgOrderByAggregateInput
    _max?: ImageMaxOrderByAggregateInput
    _min?: ImageMinOrderByAggregateInput
    _sum?: ImageSumOrderByAggregateInput
  }

  export type ImageScalarWhereWithAggregatesInput = {
    AND?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    OR?: ImageScalarWhereWithAggregatesInput[]
    NOT?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Image"> | string
    filename?: StringWithAggregatesFilter<"Image"> | string
    contentType?: StringWithAggregatesFilter<"Image"> | string
    sizeBytes?: IntWithAggregatesFilter<"Image"> | number
    width?: IntNullableWithAggregatesFilter<"Image"> | number | null
    height?: IntNullableWithAggregatesFilter<"Image"> | number | null
    hash?: StringWithAggregatesFilter<"Image"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Image"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Image"> | Date | string
  }

  export type ImageApplicationWhereInput = {
    AND?: ImageApplicationWhereInput | ImageApplicationWhereInput[]
    OR?: ImageApplicationWhereInput[]
    NOT?: ImageApplicationWhereInput | ImageApplicationWhereInput[]
    id?: StringFilter<"ImageApplication"> | string
    imageId?: StringFilter<"ImageApplication"> | string
    applicationId?: StringFilter<"ImageApplication"> | string
    originalName?: StringFilter<"ImageApplication"> | string
    tags?: JsonNullableFilter<"ImageApplication">
    linkedAt?: DateTimeFilter<"ImageApplication"> | Date | string
    updatedAt?: DateTimeFilter<"ImageApplication"> | Date | string
    image?: XOR<ImageScalarRelationFilter, ImageWhereInput>
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
  }

  export type ImageApplicationOrderByWithRelationInput = {
    id?: SortOrder
    imageId?: SortOrder
    applicationId?: SortOrder
    originalName?: SortOrder
    tags?: SortOrderInput | SortOrder
    linkedAt?: SortOrder
    updatedAt?: SortOrder
    image?: ImageOrderByWithRelationInput
    application?: ApplicationOrderByWithRelationInput
  }

  export type ImageApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    imageId_applicationId?: ImageApplicationImageIdApplicationIdCompoundUniqueInput
    AND?: ImageApplicationWhereInput | ImageApplicationWhereInput[]
    OR?: ImageApplicationWhereInput[]
    NOT?: ImageApplicationWhereInput | ImageApplicationWhereInput[]
    imageId?: StringFilter<"ImageApplication"> | string
    applicationId?: StringFilter<"ImageApplication"> | string
    originalName?: StringFilter<"ImageApplication"> | string
    tags?: JsonNullableFilter<"ImageApplication">
    linkedAt?: DateTimeFilter<"ImageApplication"> | Date | string
    updatedAt?: DateTimeFilter<"ImageApplication"> | Date | string
    image?: XOR<ImageScalarRelationFilter, ImageWhereInput>
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
  }, "id" | "imageId_applicationId">

  export type ImageApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    imageId?: SortOrder
    applicationId?: SortOrder
    originalName?: SortOrder
    tags?: SortOrderInput | SortOrder
    linkedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImageApplicationCountOrderByAggregateInput
    _max?: ImageApplicationMaxOrderByAggregateInput
    _min?: ImageApplicationMinOrderByAggregateInput
  }

  export type ImageApplicationScalarWhereWithAggregatesInput = {
    AND?: ImageApplicationScalarWhereWithAggregatesInput | ImageApplicationScalarWhereWithAggregatesInput[]
    OR?: ImageApplicationScalarWhereWithAggregatesInput[]
    NOT?: ImageApplicationScalarWhereWithAggregatesInput | ImageApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImageApplication"> | string
    imageId?: StringWithAggregatesFilter<"ImageApplication"> | string
    applicationId?: StringWithAggregatesFilter<"ImageApplication"> | string
    originalName?: StringWithAggregatesFilter<"ImageApplication"> | string
    tags?: JsonNullableWithAggregatesFilter<"ImageApplication">
    linkedAt?: DateTimeWithAggregatesFilter<"ImageApplication"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImageApplication"> | Date | string
  }

  export type ImageVariantWhereInput = {
    AND?: ImageVariantWhereInput | ImageVariantWhereInput[]
    OR?: ImageVariantWhereInput[]
    NOT?: ImageVariantWhereInput | ImageVariantWhereInput[]
    id?: StringFilter<"ImageVariant"> | string
    imageId?: StringFilter<"ImageVariant"> | string
    label?: StringFilter<"ImageVariant"> | string
    filename?: StringFilter<"ImageVariant"> | string
    width?: IntNullableFilter<"ImageVariant"> | number | null
    height?: IntNullableFilter<"ImageVariant"> | number | null
    sizeBytes?: IntFilter<"ImageVariant"> | number
    createdAt?: DateTimeFilter<"ImageVariant"> | Date | string
    image?: XOR<ImageScalarRelationFilter, ImageWhereInput>
  }

  export type ImageVariantOrderByWithRelationInput = {
    id?: SortOrder
    imageId?: SortOrder
    label?: SortOrder
    filename?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
    image?: ImageOrderByWithRelationInput
  }

  export type ImageVariantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImageVariantWhereInput | ImageVariantWhereInput[]
    OR?: ImageVariantWhereInput[]
    NOT?: ImageVariantWhereInput | ImageVariantWhereInput[]
    imageId?: StringFilter<"ImageVariant"> | string
    label?: StringFilter<"ImageVariant"> | string
    filename?: StringFilter<"ImageVariant"> | string
    width?: IntNullableFilter<"ImageVariant"> | number | null
    height?: IntNullableFilter<"ImageVariant"> | number | null
    sizeBytes?: IntFilter<"ImageVariant"> | number
    createdAt?: DateTimeFilter<"ImageVariant"> | Date | string
    image?: XOR<ImageScalarRelationFilter, ImageWhereInput>
  }, "id">

  export type ImageVariantOrderByWithAggregationInput = {
    id?: SortOrder
    imageId?: SortOrder
    label?: SortOrder
    filename?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
    _count?: ImageVariantCountOrderByAggregateInput
    _avg?: ImageVariantAvgOrderByAggregateInput
    _max?: ImageVariantMaxOrderByAggregateInput
    _min?: ImageVariantMinOrderByAggregateInput
    _sum?: ImageVariantSumOrderByAggregateInput
  }

  export type ImageVariantScalarWhereWithAggregatesInput = {
    AND?: ImageVariantScalarWhereWithAggregatesInput | ImageVariantScalarWhereWithAggregatesInput[]
    OR?: ImageVariantScalarWhereWithAggregatesInput[]
    NOT?: ImageVariantScalarWhereWithAggregatesInput | ImageVariantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImageVariant"> | string
    imageId?: StringWithAggregatesFilter<"ImageVariant"> | string
    label?: StringWithAggregatesFilter<"ImageVariant"> | string
    filename?: StringWithAggregatesFilter<"ImageVariant"> | string
    width?: IntNullableWithAggregatesFilter<"ImageVariant"> | number | null
    height?: IntNullableWithAggregatesFilter<"ImageVariant"> | number | null
    sizeBytes?: IntWithAggregatesFilter<"ImageVariant"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ImageVariant"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    applicationId?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    hash?: StringFilter<"ApiKey"> | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revoked?: BoolFilter<"ApiKey"> | boolean
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    auditLogs?: AuditLogListRelationFilter
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    applicationId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    hash?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    revoked?: SortOrder
    application?: ApplicationOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    hash?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    applicationId?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revoked?: BoolFilter<"ApiKey"> | boolean
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "hash">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    applicationId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    hash?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    revoked?: SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiKey"> | string
    applicationId?: StringWithAggregatesFilter<"ApiKey"> | string
    userId?: StringWithAggregatesFilter<"ApiKey"> | string
    name?: StringWithAggregatesFilter<"ApiKey"> | string
    hash?: StringWithAggregatesFilter<"ApiKey"> | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
    revoked?: BoolWithAggregatesFilter<"ApiKey"> | boolean
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    applicationId?: StringNullableFilter<"AuditLog"> | string | null
    apiKeyId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    application?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    apiKey?: XOR<ApiKeyNullableScalarRelationFilter, ApiKeyWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    applicationId?: SortOrderInput | SortOrder
    apiKeyId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetId?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    application?: ApplicationOrderByWithRelationInput
    apiKey?: ApiKeyOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringNullableFilter<"AuditLog"> | string | null
    applicationId?: StringNullableFilter<"AuditLog"> | string | null
    apiKeyId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    application?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    apiKey?: XOR<ApiKeyNullableScalarRelationFilter, ApiKeyWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    applicationId?: SortOrderInput | SortOrder
    apiKeyId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetId?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    applicationId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    apiKeyId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    targetId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    ip?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type BackupConfigWhereInput = {
    AND?: BackupConfigWhereInput | BackupConfigWhereInput[]
    OR?: BackupConfigWhereInput[]
    NOT?: BackupConfigWhereInput | BackupConfigWhereInput[]
    id?: StringFilter<"BackupConfig"> | string
    enabled?: BoolFilter<"BackupConfig"> | boolean
    basePrefix?: StringFilter<"BackupConfig"> | string
    jsonIntervalMinutes?: IntFilter<"BackupConfig"> | number
    sqlIntervalMinutes?: IntFilter<"BackupConfig"> | number
    schedulerIntervalMinutes?: IntFilter<"BackupConfig"> | number
    dailyRetentionDays?: IntFilter<"BackupConfig"> | number
    weeklyRetentionWeeks?: IntFilter<"BackupConfig"> | number
    monthlyRetentionMonths?: IntFilter<"BackupConfig"> | number
    lastJsonBackupAt?: DateTimeNullableFilter<"BackupConfig"> | Date | string | null
    lastSqlBackupAt?: DateTimeNullableFilter<"BackupConfig"> | Date | string | null
    createdAt?: DateTimeFilter<"BackupConfig"> | Date | string
    updatedAt?: DateTimeFilter<"BackupConfig"> | Date | string
  }

  export type BackupConfigOrderByWithRelationInput = {
    id?: SortOrder
    enabled?: SortOrder
    basePrefix?: SortOrder
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
    lastJsonBackupAt?: SortOrderInput | SortOrder
    lastSqlBackupAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupConfigWhereInput | BackupConfigWhereInput[]
    OR?: BackupConfigWhereInput[]
    NOT?: BackupConfigWhereInput | BackupConfigWhereInput[]
    enabled?: BoolFilter<"BackupConfig"> | boolean
    basePrefix?: StringFilter<"BackupConfig"> | string
    jsonIntervalMinutes?: IntFilter<"BackupConfig"> | number
    sqlIntervalMinutes?: IntFilter<"BackupConfig"> | number
    schedulerIntervalMinutes?: IntFilter<"BackupConfig"> | number
    dailyRetentionDays?: IntFilter<"BackupConfig"> | number
    weeklyRetentionWeeks?: IntFilter<"BackupConfig"> | number
    monthlyRetentionMonths?: IntFilter<"BackupConfig"> | number
    lastJsonBackupAt?: DateTimeNullableFilter<"BackupConfig"> | Date | string | null
    lastSqlBackupAt?: DateTimeNullableFilter<"BackupConfig"> | Date | string | null
    createdAt?: DateTimeFilter<"BackupConfig"> | Date | string
    updatedAt?: DateTimeFilter<"BackupConfig"> | Date | string
  }, "id">

  export type BackupConfigOrderByWithAggregationInput = {
    id?: SortOrder
    enabled?: SortOrder
    basePrefix?: SortOrder
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
    lastJsonBackupAt?: SortOrderInput | SortOrder
    lastSqlBackupAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BackupConfigCountOrderByAggregateInput
    _avg?: BackupConfigAvgOrderByAggregateInput
    _max?: BackupConfigMaxOrderByAggregateInput
    _min?: BackupConfigMinOrderByAggregateInput
    _sum?: BackupConfigSumOrderByAggregateInput
  }

  export type BackupConfigScalarWhereWithAggregatesInput = {
    AND?: BackupConfigScalarWhereWithAggregatesInput | BackupConfigScalarWhereWithAggregatesInput[]
    OR?: BackupConfigScalarWhereWithAggregatesInput[]
    NOT?: BackupConfigScalarWhereWithAggregatesInput | BackupConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackupConfig"> | string
    enabled?: BoolWithAggregatesFilter<"BackupConfig"> | boolean
    basePrefix?: StringWithAggregatesFilter<"BackupConfig"> | string
    jsonIntervalMinutes?: IntWithAggregatesFilter<"BackupConfig"> | number
    sqlIntervalMinutes?: IntWithAggregatesFilter<"BackupConfig"> | number
    schedulerIntervalMinutes?: IntWithAggregatesFilter<"BackupConfig"> | number
    dailyRetentionDays?: IntWithAggregatesFilter<"BackupConfig"> | number
    weeklyRetentionWeeks?: IntWithAggregatesFilter<"BackupConfig"> | number
    monthlyRetentionMonths?: IntWithAggregatesFilter<"BackupConfig"> | number
    lastJsonBackupAt?: DateTimeNullableWithAggregatesFilter<"BackupConfig"> | Date | string | null
    lastSqlBackupAt?: DateTimeNullableWithAggregatesFilter<"BackupConfig"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BackupConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BackupConfig"> | Date | string
  }

  export type BackupRecordWhereInput = {
    AND?: BackupRecordWhereInput | BackupRecordWhereInput[]
    OR?: BackupRecordWhereInput[]
    NOT?: BackupRecordWhereInput | BackupRecordWhereInput[]
    id?: StringFilter<"BackupRecord"> | string
    type?: EnumBackupTypeFilter<"BackupRecord"> | $Enums.BackupType
    period?: EnumBackupPeriodFilter<"BackupRecord"> | $Enums.BackupPeriod
    status?: EnumBackupStatusFilter<"BackupRecord"> | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFilter<"BackupRecord"> | $Enums.BackupTrigger
    storageKey?: StringNullableFilter<"BackupRecord"> | string | null
    filename?: StringFilter<"BackupRecord"> | string
    sizeBytes?: IntNullableFilter<"BackupRecord"> | number | null
    errorMessage?: StringNullableFilter<"BackupRecord"> | string | null
    createdByUserId?: StringNullableFilter<"BackupRecord"> | string | null
    startedAt?: DateTimeFilter<"BackupRecord"> | Date | string
    completedAt?: DateTimeNullableFilter<"BackupRecord"> | Date | string | null
    metadata?: JsonNullableFilter<"BackupRecord">
    createdAt?: DateTimeFilter<"BackupRecord"> | Date | string
    updatedAt?: DateTimeFilter<"BackupRecord"> | Date | string
  }

  export type BackupRecordOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    filename?: SortOrder
    sizeBytes?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdByUserId?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupRecordWhereInput | BackupRecordWhereInput[]
    OR?: BackupRecordWhereInput[]
    NOT?: BackupRecordWhereInput | BackupRecordWhereInput[]
    type?: EnumBackupTypeFilter<"BackupRecord"> | $Enums.BackupType
    period?: EnumBackupPeriodFilter<"BackupRecord"> | $Enums.BackupPeriod
    status?: EnumBackupStatusFilter<"BackupRecord"> | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFilter<"BackupRecord"> | $Enums.BackupTrigger
    storageKey?: StringNullableFilter<"BackupRecord"> | string | null
    filename?: StringFilter<"BackupRecord"> | string
    sizeBytes?: IntNullableFilter<"BackupRecord"> | number | null
    errorMessage?: StringNullableFilter<"BackupRecord"> | string | null
    createdByUserId?: StringNullableFilter<"BackupRecord"> | string | null
    startedAt?: DateTimeFilter<"BackupRecord"> | Date | string
    completedAt?: DateTimeNullableFilter<"BackupRecord"> | Date | string | null
    metadata?: JsonNullableFilter<"BackupRecord">
    createdAt?: DateTimeFilter<"BackupRecord"> | Date | string
    updatedAt?: DateTimeFilter<"BackupRecord"> | Date | string
  }, "id">

  export type BackupRecordOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    storageKey?: SortOrderInput | SortOrder
    filename?: SortOrder
    sizeBytes?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdByUserId?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BackupRecordCountOrderByAggregateInput
    _avg?: BackupRecordAvgOrderByAggregateInput
    _max?: BackupRecordMaxOrderByAggregateInput
    _min?: BackupRecordMinOrderByAggregateInput
    _sum?: BackupRecordSumOrderByAggregateInput
  }

  export type BackupRecordScalarWhereWithAggregatesInput = {
    AND?: BackupRecordScalarWhereWithAggregatesInput | BackupRecordScalarWhereWithAggregatesInput[]
    OR?: BackupRecordScalarWhereWithAggregatesInput[]
    NOT?: BackupRecordScalarWhereWithAggregatesInput | BackupRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackupRecord"> | string
    type?: EnumBackupTypeWithAggregatesFilter<"BackupRecord"> | $Enums.BackupType
    period?: EnumBackupPeriodWithAggregatesFilter<"BackupRecord"> | $Enums.BackupPeriod
    status?: EnumBackupStatusWithAggregatesFilter<"BackupRecord"> | $Enums.BackupStatus
    trigger?: EnumBackupTriggerWithAggregatesFilter<"BackupRecord"> | $Enums.BackupTrigger
    storageKey?: StringNullableWithAggregatesFilter<"BackupRecord"> | string | null
    filename?: StringWithAggregatesFilter<"BackupRecord"> | string
    sizeBytes?: IntNullableWithAggregatesFilter<"BackupRecord"> | number | null
    errorMessage?: StringNullableWithAggregatesFilter<"BackupRecord"> | string | null
    createdByUserId?: StringNullableWithAggregatesFilter<"BackupRecord"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"BackupRecord"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"BackupRecord"> | Date | string | null
    metadata?: JsonNullableWithAggregatesFilter<"BackupRecord">
    createdAt?: DateTimeWithAggregatesFilter<"BackupRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BackupRecord"> | Date | string
  }

  export type BackupLockWhereInput = {
    AND?: BackupLockWhereInput | BackupLockWhereInput[]
    OR?: BackupLockWhereInput[]
    NOT?: BackupLockWhereInput | BackupLockWhereInput[]
    name?: StringFilter<"BackupLock"> | string
    owner?: StringFilter<"BackupLock"> | string
    lockedUntil?: DateTimeFilter<"BackupLock"> | Date | string
    lockedAt?: DateTimeFilter<"BackupLock"> | Date | string
    updatedAt?: DateTimeFilter<"BackupLock"> | Date | string
  }

  export type BackupLockOrderByWithRelationInput = {
    name?: SortOrder
    owner?: SortOrder
    lockedUntil?: SortOrder
    lockedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupLockWhereUniqueInput = Prisma.AtLeast<{
    name?: string
    AND?: BackupLockWhereInput | BackupLockWhereInput[]
    OR?: BackupLockWhereInput[]
    NOT?: BackupLockWhereInput | BackupLockWhereInput[]
    owner?: StringFilter<"BackupLock"> | string
    lockedUntil?: DateTimeFilter<"BackupLock"> | Date | string
    lockedAt?: DateTimeFilter<"BackupLock"> | Date | string
    updatedAt?: DateTimeFilter<"BackupLock"> | Date | string
  }, "name">

  export type BackupLockOrderByWithAggregationInput = {
    name?: SortOrder
    owner?: SortOrder
    lockedUntil?: SortOrder
    lockedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BackupLockCountOrderByAggregateInput
    _max?: BackupLockMaxOrderByAggregateInput
    _min?: BackupLockMinOrderByAggregateInput
  }

  export type BackupLockScalarWhereWithAggregatesInput = {
    AND?: BackupLockScalarWhereWithAggregatesInput | BackupLockScalarWhereWithAggregatesInput[]
    OR?: BackupLockScalarWhereWithAggregatesInput[]
    NOT?: BackupLockScalarWhereWithAggregatesInput | BackupLockScalarWhereWithAggregatesInput[]
    name?: StringWithAggregatesFilter<"BackupLock"> | string
    owner?: StringWithAggregatesFilter<"BackupLock"> | string
    lockedUntil?: DateTimeWithAggregatesFilter<"BackupLock"> | Date | string
    lockedAt?: DateTimeWithAggregatesFilter<"BackupLock"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BackupLock"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: BoolNullableFilter<"User"> | boolean | null
    image?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    applications?: ApplicationListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    apiKeys?: ApiKeyOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: BoolNullableFilter<"User"> | boolean | null
    image?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    applications?: ApplicationListRelationFilter
    apiKeys?: ApiKeyListRelationFilter
    auditLogs?: AuditLogListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    banned?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    banReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    banExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    token?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    impersonatedBy?: StringNullableWithAggregatesFilter<"Session"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type verificationWhereInput = {
    AND?: verificationWhereInput | verificationWhereInput[]
    OR?: verificationWhereInput[]
    NOT?: verificationWhereInput | verificationWhereInput[]
    id?: StringFilter<"verification"> | string
    identifier?: StringFilter<"verification"> | string
    value?: StringFilter<"verification"> | string
    expiresAt?: DateTimeFilter<"verification"> | Date | string
    createdAt?: DateTimeFilter<"verification"> | Date | string
    updatedAt?: DateTimeFilter<"verification"> | Date | string
  }

  export type verificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type verificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    identifier_value?: verificationIdentifierValueCompoundUniqueInput
    AND?: verificationWhereInput | verificationWhereInput[]
    OR?: verificationWhereInput[]
    NOT?: verificationWhereInput | verificationWhereInput[]
    identifier?: StringFilter<"verification"> | string
    value?: StringFilter<"verification"> | string
    expiresAt?: DateTimeFilter<"verification"> | Date | string
    createdAt?: DateTimeFilter<"verification"> | Date | string
    updatedAt?: DateTimeFilter<"verification"> | Date | string
  }, "id" | "identifier_value">

  export type verificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: verificationCountOrderByAggregateInput
    _max?: verificationMaxOrderByAggregateInput
    _min?: verificationMinOrderByAggregateInput
  }

  export type verificationScalarWhereWithAggregatesInput = {
    AND?: verificationScalarWhereWithAggregatesInput | verificationScalarWhereWithAggregatesInput[]
    OR?: verificationScalarWhereWithAggregatesInput[]
    NOT?: verificationScalarWhereWithAggregatesInput | verificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"verification"> | string
    identifier?: StringWithAggregatesFilter<"verification"> | string
    value?: StringWithAggregatesFilter<"verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"verification"> | Date | string
  }

  export type ApplicationCreateInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyCreateNestedManyWithoutApplicationInput
    members?: UserCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationUncheckedCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutApplicationInput
    members?: UserUncheckedCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutApplicationNestedInput
    members?: UserUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUncheckedUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutApplicationNestedInput
    members?: UserUncheckedUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationCreateManyInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
  }

  export type ImageCreateInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: ImageVariantCreateNestedManyWithoutImageInput
    applications?: ImageApplicationCreateNestedManyWithoutImageInput
  }

  export type ImageUncheckedCreateInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: ImageVariantUncheckedCreateNestedManyWithoutImageInput
    applications?: ImageApplicationUncheckedCreateNestedManyWithoutImageInput
  }

  export type ImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: ImageVariantUpdateManyWithoutImageNestedInput
    applications?: ImageApplicationUpdateManyWithoutImageNestedInput
  }

  export type ImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: ImageVariantUncheckedUpdateManyWithoutImageNestedInput
    applications?: ImageApplicationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type ImageCreateManyInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationCreateInput = {
    id?: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
    image: ImageCreateNestedOneWithoutApplicationsInput
    application: ApplicationCreateNestedOneWithoutImageApplicationsInput
  }

  export type ImageApplicationUncheckedCreateInput = {
    id?: string
    imageId: string
    applicationId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: ImageUpdateOneRequiredWithoutApplicationsNestedInput
    application?: ApplicationUpdateOneRequiredWithoutImageApplicationsNestedInput
  }

  export type ImageApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationCreateManyInput = {
    id?: string
    imageId: string
    applicationId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantCreateInput = {
    id?: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
    image: ImageCreateNestedOneWithoutVariantsInput
  }

  export type ImageVariantUncheckedCreateInput = {
    id?: string
    imageId: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ImageVariantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: ImageUpdateOneRequiredWithoutVariantsNestedInput
  }

  export type ImageVariantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantCreateManyInput = {
    id?: string
    imageId: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ImageVariantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    id?: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    application: ApplicationCreateNestedOneWithoutApiKeysInput
    user: UserCreateNestedOneWithoutApiKeysInput
    auditLogs?: AuditLogCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    applicationId: string
    userId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    application?: ApplicationUpdateOneRequiredWithoutApiKeysNestedInput
    user?: UserUpdateOneRequiredWithoutApiKeysNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    applicationId: string
    userId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
    application?: ApplicationCreateNestedOneWithoutAuditLogsInput
    apiKey?: ApiKeyCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    applicationId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
    application?: ApplicationUpdateOneWithoutAuditLogsNestedInput
    apiKey?: ApiKeyUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId?: string | null
    applicationId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupConfigCreateInput = {
    id?: string
    enabled: boolean
    basePrefix: string
    jsonIntervalMinutes: number
    sqlIntervalMinutes: number
    schedulerIntervalMinutes: number
    dailyRetentionDays: number
    weeklyRetentionWeeks: number
    monthlyRetentionMonths: number
    lastJsonBackupAt?: Date | string | null
    lastSqlBackupAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupConfigUncheckedCreateInput = {
    id?: string
    enabled: boolean
    basePrefix: string
    jsonIntervalMinutes: number
    sqlIntervalMinutes: number
    schedulerIntervalMinutes: number
    dailyRetentionDays: number
    weeklyRetentionWeeks: number
    monthlyRetentionMonths: number
    lastJsonBackupAt?: Date | string | null
    lastSqlBackupAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    basePrefix?: StringFieldUpdateOperationsInput | string
    jsonIntervalMinutes?: IntFieldUpdateOperationsInput | number
    sqlIntervalMinutes?: IntFieldUpdateOperationsInput | number
    schedulerIntervalMinutes?: IntFieldUpdateOperationsInput | number
    dailyRetentionDays?: IntFieldUpdateOperationsInput | number
    weeklyRetentionWeeks?: IntFieldUpdateOperationsInput | number
    monthlyRetentionMonths?: IntFieldUpdateOperationsInput | number
    lastJsonBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSqlBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    basePrefix?: StringFieldUpdateOperationsInput | string
    jsonIntervalMinutes?: IntFieldUpdateOperationsInput | number
    sqlIntervalMinutes?: IntFieldUpdateOperationsInput | number
    schedulerIntervalMinutes?: IntFieldUpdateOperationsInput | number
    dailyRetentionDays?: IntFieldUpdateOperationsInput | number
    weeklyRetentionWeeks?: IntFieldUpdateOperationsInput | number
    monthlyRetentionMonths?: IntFieldUpdateOperationsInput | number
    lastJsonBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSqlBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupConfigCreateManyInput = {
    id?: string
    enabled: boolean
    basePrefix: string
    jsonIntervalMinutes: number
    sqlIntervalMinutes: number
    schedulerIntervalMinutes: number
    dailyRetentionDays: number
    weeklyRetentionWeeks: number
    monthlyRetentionMonths: number
    lastJsonBackupAt?: Date | string | null
    lastSqlBackupAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    basePrefix?: StringFieldUpdateOperationsInput | string
    jsonIntervalMinutes?: IntFieldUpdateOperationsInput | number
    sqlIntervalMinutes?: IntFieldUpdateOperationsInput | number
    schedulerIntervalMinutes?: IntFieldUpdateOperationsInput | number
    dailyRetentionDays?: IntFieldUpdateOperationsInput | number
    weeklyRetentionWeeks?: IntFieldUpdateOperationsInput | number
    monthlyRetentionMonths?: IntFieldUpdateOperationsInput | number
    lastJsonBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSqlBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    basePrefix?: StringFieldUpdateOperationsInput | string
    jsonIntervalMinutes?: IntFieldUpdateOperationsInput | number
    sqlIntervalMinutes?: IntFieldUpdateOperationsInput | number
    schedulerIntervalMinutes?: IntFieldUpdateOperationsInput | number
    dailyRetentionDays?: IntFieldUpdateOperationsInput | number
    weeklyRetentionWeeks?: IntFieldUpdateOperationsInput | number
    monthlyRetentionMonths?: IntFieldUpdateOperationsInput | number
    lastJsonBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSqlBackupAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupRecordCreateInput = {
    id?: string
    type: $Enums.BackupType
    period: $Enums.BackupPeriod
    status: $Enums.BackupStatus
    trigger: $Enums.BackupTrigger
    storageKey?: string | null
    filename: string
    sizeBytes?: number | null
    errorMessage?: string | null
    createdByUserId?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupRecordUncheckedCreateInput = {
    id?: string
    type: $Enums.BackupType
    period: $Enums.BackupPeriod
    status: $Enums.BackupStatus
    trigger: $Enums.BackupTrigger
    storageKey?: string | null
    filename: string
    sizeBytes?: number | null
    errorMessage?: string | null
    createdByUserId?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumBackupTypeFieldUpdateOperationsInput | $Enums.BackupType
    period?: EnumBackupPeriodFieldUpdateOperationsInput | $Enums.BackupPeriod
    status?: EnumBackupStatusFieldUpdateOperationsInput | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFieldUpdateOperationsInput | $Enums.BackupTrigger
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumBackupTypeFieldUpdateOperationsInput | $Enums.BackupType
    period?: EnumBackupPeriodFieldUpdateOperationsInput | $Enums.BackupPeriod
    status?: EnumBackupStatusFieldUpdateOperationsInput | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFieldUpdateOperationsInput | $Enums.BackupTrigger
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupRecordCreateManyInput = {
    id?: string
    type: $Enums.BackupType
    period: $Enums.BackupPeriod
    status: $Enums.BackupStatus
    trigger: $Enums.BackupTrigger
    storageKey?: string | null
    filename: string
    sizeBytes?: number | null
    errorMessage?: string | null
    createdByUserId?: string | null
    startedAt?: Date | string
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumBackupTypeFieldUpdateOperationsInput | $Enums.BackupType
    period?: EnumBackupPeriodFieldUpdateOperationsInput | $Enums.BackupPeriod
    status?: EnumBackupStatusFieldUpdateOperationsInput | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFieldUpdateOperationsInput | $Enums.BackupTrigger
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumBackupTypeFieldUpdateOperationsInput | $Enums.BackupType
    period?: EnumBackupPeriodFieldUpdateOperationsInput | $Enums.BackupPeriod
    status?: EnumBackupStatusFieldUpdateOperationsInput | $Enums.BackupStatus
    trigger?: EnumBackupTriggerFieldUpdateOperationsInput | $Enums.BackupTrigger
    storageKey?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    sizeBytes?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupLockCreateInput = {
    name: string
    owner: string
    lockedUntil: Date | string
    lockedAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupLockUncheckedCreateInput = {
    name: string
    owner: string
    lockedUntil: Date | string
    lockedAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupLockUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    lockedUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupLockUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    lockedUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupLockCreateManyInput = {
    name: string
    owner: string
    lockedUntil: Date | string
    lockedAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupLockUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    lockedUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupLockUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    lockedUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    token: string
    userId: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    token: string
    userId: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type verificationUncheckedCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type verificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationCreateManyInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type verificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type verificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ImageApplicationListRelationFilter = {
    every?: ImageApplicationWhereInput
    some?: ImageApplicationWhereInput
    none?: ImageApplicationWhereInput
  }

  export type ApiKeyListRelationFilter = {
    every?: ApiKeyWhereInput
    some?: ApiKeyWhereInput
    none?: ApiKeyWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type ImageApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApiKeyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storageDir?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storageDir?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storageDir?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ImageVariantListRelationFilter = {
    every?: ImageVariantWhereInput
    some?: ImageVariantWhereInput
    none?: ImageVariantWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ImageVariantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImageCountOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    contentType?: SortOrder
    sizeBytes?: SortOrder
    width?: SortOrder
    height?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type ImageMaxOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    contentType?: SortOrder
    sizeBytes?: SortOrder
    width?: SortOrder
    height?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageMinOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    contentType?: SortOrder
    sizeBytes?: SortOrder
    width?: SortOrder
    height?: SortOrder
    hash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ImageScalarRelationFilter = {
    is?: ImageWhereInput
    isNot?: ImageWhereInput
  }

  export type ApplicationScalarRelationFilter = {
    is?: ApplicationWhereInput
    isNot?: ApplicationWhereInput
  }

  export type ImageApplicationImageIdApplicationIdCompoundUniqueInput = {
    imageId: string
    applicationId: string
  }

  export type ImageApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    applicationId?: SortOrder
    originalName?: SortOrder
    tags?: SortOrder
    linkedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    applicationId?: SortOrder
    originalName?: SortOrder
    linkedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    applicationId?: SortOrder
    originalName?: SortOrder
    linkedAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ImageVariantCountOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    label?: SortOrder
    filename?: SortOrder
    width?: SortOrder
    height?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageVariantAvgOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
    sizeBytes?: SortOrder
  }

  export type ImageVariantMaxOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    label?: SortOrder
    filename?: SortOrder
    width?: SortOrder
    height?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageVariantMinOrderByAggregateInput = {
    id?: SortOrder
    imageId?: SortOrder
    label?: SortOrder
    filename?: SortOrder
    width?: SortOrder
    height?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageVariantSumOrderByAggregateInput = {
    width?: SortOrder
    height?: SortOrder
    sizeBytes?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    hash?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    revoked?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    hash?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    revoked?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    hash?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
    revoked?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ApplicationNullableScalarRelationFilter = {
    is?: ApplicationWhereInput | null
    isNot?: ApplicationWhereInput | null
  }

  export type ApiKeyNullableScalarRelationFilter = {
    is?: ApiKeyWhereInput | null
    isNot?: ApiKeyWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    applicationId?: SortOrder
    apiKeyId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    applicationId?: SortOrder
    apiKeyId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    applicationId?: SortOrder
    apiKeyId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BackupConfigCountOrderByAggregateInput = {
    id?: SortOrder
    enabled?: SortOrder
    basePrefix?: SortOrder
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
    lastJsonBackupAt?: SortOrder
    lastSqlBackupAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupConfigAvgOrderByAggregateInput = {
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
  }

  export type BackupConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    enabled?: SortOrder
    basePrefix?: SortOrder
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
    lastJsonBackupAt?: SortOrder
    lastSqlBackupAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupConfigMinOrderByAggregateInput = {
    id?: SortOrder
    enabled?: SortOrder
    basePrefix?: SortOrder
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
    lastJsonBackupAt?: SortOrder
    lastSqlBackupAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupConfigSumOrderByAggregateInput = {
    jsonIntervalMinutes?: SortOrder
    sqlIntervalMinutes?: SortOrder
    schedulerIntervalMinutes?: SortOrder
    dailyRetentionDays?: SortOrder
    weeklyRetentionWeeks?: SortOrder
    monthlyRetentionMonths?: SortOrder
  }

  export type EnumBackupTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupType | EnumBackupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTypeFilter<$PrismaModel> | $Enums.BackupType
  }

  export type EnumBackupPeriodFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupPeriod | EnumBackupPeriodFieldRefInput<$PrismaModel>
    in?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupPeriodFilter<$PrismaModel> | $Enums.BackupPeriod
  }

  export type EnumBackupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupStatus | EnumBackupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupStatusFilter<$PrismaModel> | $Enums.BackupStatus
  }

  export type EnumBackupTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupTrigger | EnumBackupTriggerFieldRefInput<$PrismaModel>
    in?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTriggerFilter<$PrismaModel> | $Enums.BackupTrigger
  }

  export type BackupRecordCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    sizeBytes?: SortOrder
    errorMessage?: SortOrder
    createdByUserId?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupRecordAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type BackupRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    sizeBytes?: SortOrder
    errorMessage?: SortOrder
    createdByUserId?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupRecordMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    period?: SortOrder
    status?: SortOrder
    trigger?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    sizeBytes?: SortOrder
    errorMessage?: SortOrder
    createdByUserId?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupRecordSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type EnumBackupTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupType | EnumBackupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTypeWithAggregatesFilter<$PrismaModel> | $Enums.BackupType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupTypeFilter<$PrismaModel>
    _max?: NestedEnumBackupTypeFilter<$PrismaModel>
  }

  export type EnumBackupPeriodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupPeriod | EnumBackupPeriodFieldRefInput<$PrismaModel>
    in?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupPeriodWithAggregatesFilter<$PrismaModel> | $Enums.BackupPeriod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupPeriodFilter<$PrismaModel>
    _max?: NestedEnumBackupPeriodFilter<$PrismaModel>
  }

  export type EnumBackupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupStatus | EnumBackupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupStatusWithAggregatesFilter<$PrismaModel> | $Enums.BackupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupStatusFilter<$PrismaModel>
    _max?: NestedEnumBackupStatusFilter<$PrismaModel>
  }

  export type EnumBackupTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupTrigger | EnumBackupTriggerFieldRefInput<$PrismaModel>
    in?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTriggerWithAggregatesFilter<$PrismaModel> | $Enums.BackupTrigger
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupTriggerFilter<$PrismaModel>
    _max?: NestedEnumBackupTriggerFilter<$PrismaModel>
  }

  export type BackupLockCountOrderByAggregateInput = {
    name?: SortOrder
    owner?: SortOrder
    lockedUntil?: SortOrder
    lockedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupLockMaxOrderByAggregateInput = {
    name?: SortOrder
    owner?: SortOrder
    lockedUntil?: SortOrder
    lockedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupLockMinOrderByAggregateInput = {
    name?: SortOrder
    owner?: SortOrder
    lockedUntil?: SortOrder
    lockedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    impersonatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type verificationIdentifierValueCompoundUniqueInput = {
    identifier: string
    value: string
  }

  export type verificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type verificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type verificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageApplicationCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput> | ImageApplicationCreateWithoutApplicationInput[] | ImageApplicationUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutApplicationInput | ImageApplicationCreateOrConnectWithoutApplicationInput[]
    createMany?: ImageApplicationCreateManyApplicationInputEnvelope
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
  }

  export type ApiKeyCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput> | ApiKeyCreateWithoutApplicationInput[] | ApiKeyUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutApplicationInput | ApiKeyCreateOrConnectWithoutApplicationInput[]
    createMany?: ApiKeyCreateManyApplicationInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput> | UserCreateWithoutApplicationsInput[] | UserUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput | UserCreateOrConnectWithoutApplicationsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutApplicationInput = {
    create?: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput> | AuditLogCreateWithoutApplicationInput[] | AuditLogUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApplicationInput | AuditLogCreateOrConnectWithoutApplicationInput[]
    createMany?: AuditLogCreateManyApplicationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type ImageApplicationUncheckedCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput> | ImageApplicationCreateWithoutApplicationInput[] | ImageApplicationUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutApplicationInput | ImageApplicationCreateOrConnectWithoutApplicationInput[]
    createMany?: ImageApplicationCreateManyApplicationInputEnvelope
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutApplicationInput = {
    create?: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput> | ApiKeyCreateWithoutApplicationInput[] | ApiKeyUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutApplicationInput | ApiKeyCreateOrConnectWithoutApplicationInput[]
    createMany?: ApiKeyCreateManyApplicationInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput> | UserCreateWithoutApplicationsInput[] | UserUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput | UserCreateOrConnectWithoutApplicationsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutApplicationInput = {
    create?: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput> | AuditLogCreateWithoutApplicationInput[] | AuditLogUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApplicationInput | AuditLogCreateOrConnectWithoutApplicationInput[]
    createMany?: AuditLogCreateManyApplicationInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ImageApplicationUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput> | ImageApplicationCreateWithoutApplicationInput[] | ImageApplicationUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutApplicationInput | ImageApplicationCreateOrConnectWithoutApplicationInput[]
    upsert?: ImageApplicationUpsertWithWhereUniqueWithoutApplicationInput | ImageApplicationUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ImageApplicationCreateManyApplicationInputEnvelope
    set?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    disconnect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    delete?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    update?: ImageApplicationUpdateWithWhereUniqueWithoutApplicationInput | ImageApplicationUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ImageApplicationUpdateManyWithWhereWithoutApplicationInput | ImageApplicationUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
  }

  export type ApiKeyUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput> | ApiKeyCreateWithoutApplicationInput[] | ApiKeyUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutApplicationInput | ApiKeyCreateOrConnectWithoutApplicationInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutApplicationInput | ApiKeyUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ApiKeyCreateManyApplicationInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutApplicationInput | ApiKeyUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutApplicationInput | ApiKeyUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type UserUpdateManyWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput> | UserCreateWithoutApplicationsInput[] | UserUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput | UserCreateOrConnectWithoutApplicationsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutApplicationsInput | UserUpsertWithWhereUniqueWithoutApplicationsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutApplicationsInput | UserUpdateWithWhereUniqueWithoutApplicationsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutApplicationsInput | UserUpdateManyWithWhereWithoutApplicationsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput> | AuditLogCreateWithoutApplicationInput[] | AuditLogUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApplicationInput | AuditLogCreateOrConnectWithoutApplicationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutApplicationInput | AuditLogUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: AuditLogCreateManyApplicationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutApplicationInput | AuditLogUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutApplicationInput | AuditLogUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type ImageApplicationUncheckedUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput> | ImageApplicationCreateWithoutApplicationInput[] | ImageApplicationUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutApplicationInput | ImageApplicationCreateOrConnectWithoutApplicationInput[]
    upsert?: ImageApplicationUpsertWithWhereUniqueWithoutApplicationInput | ImageApplicationUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ImageApplicationCreateManyApplicationInputEnvelope
    set?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    disconnect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    delete?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    update?: ImageApplicationUpdateWithWhereUniqueWithoutApplicationInput | ImageApplicationUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ImageApplicationUpdateManyWithWhereWithoutApplicationInput | ImageApplicationUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput> | ApiKeyCreateWithoutApplicationInput[] | ApiKeyUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutApplicationInput | ApiKeyCreateOrConnectWithoutApplicationInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutApplicationInput | ApiKeyUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: ApiKeyCreateManyApplicationInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutApplicationInput | ApiKeyUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutApplicationInput | ApiKeyUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput> | UserCreateWithoutApplicationsInput[] | UserUncheckedCreateWithoutApplicationsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput | UserCreateOrConnectWithoutApplicationsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutApplicationsInput | UserUpsertWithWhereUniqueWithoutApplicationsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutApplicationsInput | UserUpdateWithWhereUniqueWithoutApplicationsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutApplicationsInput | UserUpdateManyWithWhereWithoutApplicationsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutApplicationNestedInput = {
    create?: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput> | AuditLogCreateWithoutApplicationInput[] | AuditLogUncheckedCreateWithoutApplicationInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApplicationInput | AuditLogCreateOrConnectWithoutApplicationInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutApplicationInput | AuditLogUpsertWithWhereUniqueWithoutApplicationInput[]
    createMany?: AuditLogCreateManyApplicationInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutApplicationInput | AuditLogUpdateWithWhereUniqueWithoutApplicationInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutApplicationInput | AuditLogUpdateManyWithWhereWithoutApplicationInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type ImageVariantCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput> | ImageVariantCreateWithoutImageInput[] | ImageVariantUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageVariantCreateOrConnectWithoutImageInput | ImageVariantCreateOrConnectWithoutImageInput[]
    createMany?: ImageVariantCreateManyImageInputEnvelope
    connect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
  }

  export type ImageApplicationCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput> | ImageApplicationCreateWithoutImageInput[] | ImageApplicationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutImageInput | ImageApplicationCreateOrConnectWithoutImageInput[]
    createMany?: ImageApplicationCreateManyImageInputEnvelope
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
  }

  export type ImageVariantUncheckedCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput> | ImageVariantCreateWithoutImageInput[] | ImageVariantUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageVariantCreateOrConnectWithoutImageInput | ImageVariantCreateOrConnectWithoutImageInput[]
    createMany?: ImageVariantCreateManyImageInputEnvelope
    connect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
  }

  export type ImageApplicationUncheckedCreateNestedManyWithoutImageInput = {
    create?: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput> | ImageApplicationCreateWithoutImageInput[] | ImageApplicationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutImageInput | ImageApplicationCreateOrConnectWithoutImageInput[]
    createMany?: ImageApplicationCreateManyImageInputEnvelope
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ImageVariantUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput> | ImageVariantCreateWithoutImageInput[] | ImageVariantUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageVariantCreateOrConnectWithoutImageInput | ImageVariantCreateOrConnectWithoutImageInput[]
    upsert?: ImageVariantUpsertWithWhereUniqueWithoutImageInput | ImageVariantUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageVariantCreateManyImageInputEnvelope
    set?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    disconnect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    delete?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    connect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    update?: ImageVariantUpdateWithWhereUniqueWithoutImageInput | ImageVariantUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageVariantUpdateManyWithWhereWithoutImageInput | ImageVariantUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageVariantScalarWhereInput | ImageVariantScalarWhereInput[]
  }

  export type ImageApplicationUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput> | ImageApplicationCreateWithoutImageInput[] | ImageApplicationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutImageInput | ImageApplicationCreateOrConnectWithoutImageInput[]
    upsert?: ImageApplicationUpsertWithWhereUniqueWithoutImageInput | ImageApplicationUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageApplicationCreateManyImageInputEnvelope
    set?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    disconnect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    delete?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    update?: ImageApplicationUpdateWithWhereUniqueWithoutImageInput | ImageApplicationUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageApplicationUpdateManyWithWhereWithoutImageInput | ImageApplicationUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
  }

  export type ImageVariantUncheckedUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput> | ImageVariantCreateWithoutImageInput[] | ImageVariantUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageVariantCreateOrConnectWithoutImageInput | ImageVariantCreateOrConnectWithoutImageInput[]
    upsert?: ImageVariantUpsertWithWhereUniqueWithoutImageInput | ImageVariantUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageVariantCreateManyImageInputEnvelope
    set?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    disconnect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    delete?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    connect?: ImageVariantWhereUniqueInput | ImageVariantWhereUniqueInput[]
    update?: ImageVariantUpdateWithWhereUniqueWithoutImageInput | ImageVariantUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageVariantUpdateManyWithWhereWithoutImageInput | ImageVariantUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageVariantScalarWhereInput | ImageVariantScalarWhereInput[]
  }

  export type ImageApplicationUncheckedUpdateManyWithoutImageNestedInput = {
    create?: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput> | ImageApplicationCreateWithoutImageInput[] | ImageApplicationUncheckedCreateWithoutImageInput[]
    connectOrCreate?: ImageApplicationCreateOrConnectWithoutImageInput | ImageApplicationCreateOrConnectWithoutImageInput[]
    upsert?: ImageApplicationUpsertWithWhereUniqueWithoutImageInput | ImageApplicationUpsertWithWhereUniqueWithoutImageInput[]
    createMany?: ImageApplicationCreateManyImageInputEnvelope
    set?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    disconnect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    delete?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    connect?: ImageApplicationWhereUniqueInput | ImageApplicationWhereUniqueInput[]
    update?: ImageApplicationUpdateWithWhereUniqueWithoutImageInput | ImageApplicationUpdateWithWhereUniqueWithoutImageInput[]
    updateMany?: ImageApplicationUpdateManyWithWhereWithoutImageInput | ImageApplicationUpdateManyWithWhereWithoutImageInput[]
    deleteMany?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
  }

  export type ImageCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<ImageCreateWithoutApplicationsInput, ImageUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ImageCreateOrConnectWithoutApplicationsInput
    connect?: ImageWhereUniqueInput
  }

  export type ApplicationCreateNestedOneWithoutImageApplicationsInput = {
    create?: XOR<ApplicationCreateWithoutImageApplicationsInput, ApplicationUncheckedCreateWithoutImageApplicationsInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutImageApplicationsInput
    connect?: ApplicationWhereUniqueInput
  }

  export type ImageUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<ImageCreateWithoutApplicationsInput, ImageUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: ImageCreateOrConnectWithoutApplicationsInput
    upsert?: ImageUpsertWithoutApplicationsInput
    connect?: ImageWhereUniqueInput
    update?: XOR<XOR<ImageUpdateToOneWithWhereWithoutApplicationsInput, ImageUpdateWithoutApplicationsInput>, ImageUncheckedUpdateWithoutApplicationsInput>
  }

  export type ApplicationUpdateOneRequiredWithoutImageApplicationsNestedInput = {
    create?: XOR<ApplicationCreateWithoutImageApplicationsInput, ApplicationUncheckedCreateWithoutImageApplicationsInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutImageApplicationsInput
    upsert?: ApplicationUpsertWithoutImageApplicationsInput
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutImageApplicationsInput, ApplicationUpdateWithoutImageApplicationsInput>, ApplicationUncheckedUpdateWithoutImageApplicationsInput>
  }

  export type ImageCreateNestedOneWithoutVariantsInput = {
    create?: XOR<ImageCreateWithoutVariantsInput, ImageUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ImageCreateOrConnectWithoutVariantsInput
    connect?: ImageWhereUniqueInput
  }

  export type ImageUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: XOR<ImageCreateWithoutVariantsInput, ImageUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ImageCreateOrConnectWithoutVariantsInput
    upsert?: ImageUpsertWithoutVariantsInput
    connect?: ImageWhereUniqueInput
    update?: XOR<XOR<ImageUpdateToOneWithWhereWithoutVariantsInput, ImageUpdateWithoutVariantsInput>, ImageUncheckedUpdateWithoutVariantsInput>
  }

  export type ApplicationCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<ApplicationCreateWithoutApiKeysInput, ApplicationUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApiKeysInput
    connect?: ApplicationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutApiKeysInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    connect?: UserWhereUniqueInput
  }

  export type AuditLogCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput> | AuditLogCreateWithoutApiKeyInput[] | AuditLogUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApiKeyInput | AuditLogCreateOrConnectWithoutApiKeyInput[]
    createMany?: AuditLogCreateManyApiKeyInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutApiKeyInput = {
    create?: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput> | AuditLogCreateWithoutApiKeyInput[] | AuditLogUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApiKeyInput | AuditLogCreateOrConnectWithoutApiKeyInput[]
    createMany?: AuditLogCreateManyApiKeyInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ApplicationUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<ApplicationCreateWithoutApiKeysInput, ApplicationUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApiKeysInput
    upsert?: ApplicationUpsertWithoutApiKeysInput
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutApiKeysInput, ApplicationUpdateWithoutApiKeysInput>, ApplicationUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserUpdateOneRequiredWithoutApiKeysNestedInput = {
    create?: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    connectOrCreate?: UserCreateOrConnectWithoutApiKeysInput
    upsert?: UserUpsertWithoutApiKeysInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApiKeysInput, UserUpdateWithoutApiKeysInput>, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type AuditLogUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput> | AuditLogCreateWithoutApiKeyInput[] | AuditLogUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApiKeyInput | AuditLogCreateOrConnectWithoutApiKeyInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutApiKeyInput | AuditLogUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: AuditLogCreateManyApiKeyInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutApiKeyInput | AuditLogUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutApiKeyInput | AuditLogUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutApiKeyNestedInput = {
    create?: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput> | AuditLogCreateWithoutApiKeyInput[] | AuditLogUncheckedCreateWithoutApiKeyInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutApiKeyInput | AuditLogCreateOrConnectWithoutApiKeyInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutApiKeyInput | AuditLogUpsertWithWhereUniqueWithoutApiKeyInput[]
    createMany?: AuditLogCreateManyApiKeyInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutApiKeyInput | AuditLogUpdateWithWhereUniqueWithoutApiKeyInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutApiKeyInput | AuditLogUpdateManyWithWhereWithoutApiKeyInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type ApplicationCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<ApplicationCreateWithoutAuditLogsInput, ApplicationUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutAuditLogsInput
    connect?: ApplicationWhereUniqueInput
  }

  export type ApiKeyCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<ApiKeyCreateWithoutAuditLogsInput, ApiKeyUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutAuditLogsInput
    connect?: ApiKeyWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ApplicationUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<ApplicationCreateWithoutAuditLogsInput, ApplicationUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutAuditLogsInput
    upsert?: ApplicationUpsertWithoutAuditLogsInput
    disconnect?: ApplicationWhereInput | boolean
    delete?: ApplicationWhereInput | boolean
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutAuditLogsInput, ApplicationUpdateWithoutAuditLogsInput>, ApplicationUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ApiKeyUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<ApiKeyCreateWithoutAuditLogsInput, ApiKeyUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: ApiKeyCreateOrConnectWithoutAuditLogsInput
    upsert?: ApiKeyUpsertWithoutAuditLogsInput
    disconnect?: ApiKeyWhereInput | boolean
    delete?: ApiKeyWhereInput | boolean
    connect?: ApiKeyWhereUniqueInput
    update?: XOR<XOR<ApiKeyUpdateToOneWithWhereWithoutAuditLogsInput, ApiKeyUpdateWithoutAuditLogsInput>, ApiKeyUncheckedUpdateWithoutAuditLogsInput>
  }

  export type EnumBackupTypeFieldUpdateOperationsInput = {
    set?: $Enums.BackupType
  }

  export type EnumBackupPeriodFieldUpdateOperationsInput = {
    set?: $Enums.BackupPeriod
  }

  export type EnumBackupStatusFieldUpdateOperationsInput = {
    set?: $Enums.BackupStatus
  }

  export type EnumBackupTriggerFieldUpdateOperationsInput = {
    set?: $Enums.BackupTrigger
  }

  export type ApplicationCreateNestedManyWithoutMembersInput = {
    create?: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput> | ApplicationCreateWithoutMembersInput[] | ApplicationUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutMembersInput | ApplicationCreateOrConnectWithoutMembersInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ApiKeyCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutMembersInput = {
    create?: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput> | ApplicationCreateWithoutMembersInput[] | ApplicationUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutMembersInput | ApplicationCreateOrConnectWithoutMembersInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ApiKeyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ApplicationUpdateManyWithoutMembersNestedInput = {
    create?: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput> | ApplicationCreateWithoutMembersInput[] | ApplicationUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutMembersInput | ApplicationCreateOrConnectWithoutMembersInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutMembersInput | ApplicationUpsertWithWhereUniqueWithoutMembersInput[]
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutMembersInput | ApplicationUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutMembersInput | ApplicationUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ApiKeyUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutMembersNestedInput = {
    create?: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput> | ApplicationCreateWithoutMembersInput[] | ApplicationUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutMembersInput | ApplicationCreateOrConnectWithoutMembersInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutMembersInput | ApplicationUpsertWithWhereUniqueWithoutMembersInput[]
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutMembersInput | ApplicationUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutMembersInput | ApplicationUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput> | ApiKeyCreateWithoutUserInput[] | ApiKeyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApiKeyCreateOrConnectWithoutUserInput | ApiKeyCreateOrConnectWithoutUserInput[]
    upsert?: ApiKeyUpsertWithWhereUniqueWithoutUserInput | ApiKeyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApiKeyCreateManyUserInputEnvelope
    set?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    disconnect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    delete?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    connect?: ApiKeyWhereUniqueInput | ApiKeyWhereUniqueInput[]
    update?: ApiKeyUpdateWithWhereUniqueWithoutUserInput | ApiKeyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApiKeyUpdateManyWithWhereWithoutUserInput | ApiKeyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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

  export type NestedEnumBackupTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupType | EnumBackupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTypeFilter<$PrismaModel> | $Enums.BackupType
  }

  export type NestedEnumBackupPeriodFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupPeriod | EnumBackupPeriodFieldRefInput<$PrismaModel>
    in?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupPeriodFilter<$PrismaModel> | $Enums.BackupPeriod
  }

  export type NestedEnumBackupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupStatus | EnumBackupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupStatusFilter<$PrismaModel> | $Enums.BackupStatus
  }

  export type NestedEnumBackupTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupTrigger | EnumBackupTriggerFieldRefInput<$PrismaModel>
    in?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTriggerFilter<$PrismaModel> | $Enums.BackupTrigger
  }

  export type NestedEnumBackupTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupType | EnumBackupTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupType[] | ListEnumBackupTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTypeWithAggregatesFilter<$PrismaModel> | $Enums.BackupType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupTypeFilter<$PrismaModel>
    _max?: NestedEnumBackupTypeFilter<$PrismaModel>
  }

  export type NestedEnumBackupPeriodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupPeriod | EnumBackupPeriodFieldRefInput<$PrismaModel>
    in?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupPeriod[] | ListEnumBackupPeriodFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupPeriodWithAggregatesFilter<$PrismaModel> | $Enums.BackupPeriod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupPeriodFilter<$PrismaModel>
    _max?: NestedEnumBackupPeriodFilter<$PrismaModel>
  }

  export type NestedEnumBackupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupStatus | EnumBackupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupStatus[] | ListEnumBackupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupStatusWithAggregatesFilter<$PrismaModel> | $Enums.BackupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupStatusFilter<$PrismaModel>
    _max?: NestedEnumBackupStatusFilter<$PrismaModel>
  }

  export type NestedEnumBackupTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BackupTrigger | EnumBackupTriggerFieldRefInput<$PrismaModel>
    in?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    notIn?: $Enums.BackupTrigger[] | ListEnumBackupTriggerFieldRefInput<$PrismaModel>
    not?: NestedEnumBackupTriggerWithAggregatesFilter<$PrismaModel> | $Enums.BackupTrigger
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBackupTriggerFilter<$PrismaModel>
    _max?: NestedEnumBackupTriggerFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ImageApplicationCreateWithoutApplicationInput = {
    id?: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
    image: ImageCreateNestedOneWithoutApplicationsInput
  }

  export type ImageApplicationUncheckedCreateWithoutApplicationInput = {
    id?: string
    imageId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageApplicationCreateOrConnectWithoutApplicationInput = {
    where: ImageApplicationWhereUniqueInput
    create: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput>
  }

  export type ImageApplicationCreateManyApplicationInputEnvelope = {
    data: ImageApplicationCreateManyApplicationInput | ImageApplicationCreateManyApplicationInput[]
    skipDuplicates?: boolean
  }

  export type ApiKeyCreateWithoutApplicationInput = {
    id?: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    user: UserCreateNestedOneWithoutApiKeysInput
    auditLogs?: AuditLogCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateWithoutApplicationInput = {
    id?: string
    userId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyCreateOrConnectWithoutApplicationInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput>
  }

  export type ApiKeyCreateManyApplicationInputEnvelope = {
    data: ApiKeyCreateManyApplicationInput | ApiKeyCreateManyApplicationInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutApplicationsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApplicationsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type AuditLogCreateWithoutApplicationInput = {
    id?: string
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
    apiKey?: ApiKeyCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutApplicationInput = {
    id?: string
    userId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutApplicationInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput>
  }

  export type AuditLogCreateManyApplicationInputEnvelope = {
    data: AuditLogCreateManyApplicationInput | AuditLogCreateManyApplicationInput[]
    skipDuplicates?: boolean
  }

  export type ImageApplicationUpsertWithWhereUniqueWithoutApplicationInput = {
    where: ImageApplicationWhereUniqueInput
    update: XOR<ImageApplicationUpdateWithoutApplicationInput, ImageApplicationUncheckedUpdateWithoutApplicationInput>
    create: XOR<ImageApplicationCreateWithoutApplicationInput, ImageApplicationUncheckedCreateWithoutApplicationInput>
  }

  export type ImageApplicationUpdateWithWhereUniqueWithoutApplicationInput = {
    where: ImageApplicationWhereUniqueInput
    data: XOR<ImageApplicationUpdateWithoutApplicationInput, ImageApplicationUncheckedUpdateWithoutApplicationInput>
  }

  export type ImageApplicationUpdateManyWithWhereWithoutApplicationInput = {
    where: ImageApplicationScalarWhereInput
    data: XOR<ImageApplicationUpdateManyMutationInput, ImageApplicationUncheckedUpdateManyWithoutApplicationInput>
  }

  export type ImageApplicationScalarWhereInput = {
    AND?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
    OR?: ImageApplicationScalarWhereInput[]
    NOT?: ImageApplicationScalarWhereInput | ImageApplicationScalarWhereInput[]
    id?: StringFilter<"ImageApplication"> | string
    imageId?: StringFilter<"ImageApplication"> | string
    applicationId?: StringFilter<"ImageApplication"> | string
    originalName?: StringFilter<"ImageApplication"> | string
    tags?: JsonNullableFilter<"ImageApplication">
    linkedAt?: DateTimeFilter<"ImageApplication"> | Date | string
    updatedAt?: DateTimeFilter<"ImageApplication"> | Date | string
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutApplicationInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutApplicationInput, ApiKeyUncheckedUpdateWithoutApplicationInput>
    create: XOR<ApiKeyCreateWithoutApplicationInput, ApiKeyUncheckedCreateWithoutApplicationInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutApplicationInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutApplicationInput, ApiKeyUncheckedUpdateWithoutApplicationInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutApplicationInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutApplicationInput>
  }

  export type ApiKeyScalarWhereInput = {
    AND?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    OR?: ApiKeyScalarWhereInput[]
    NOT?: ApiKeyScalarWhereInput | ApiKeyScalarWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    applicationId?: StringFilter<"ApiKey"> | string
    userId?: StringFilter<"ApiKey"> | string
    name?: StringFilter<"ApiKey"> | string
    hash?: StringFilter<"ApiKey"> | string
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
    revoked?: BoolFilter<"ApiKey"> | boolean
  }

  export type UserUpsertWithWhereUniqueWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateManyWithWhereWithoutApplicationsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutApplicationsInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: BoolNullableFilter<"User"> | boolean | null
    image?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutApplicationInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutApplicationInput, AuditLogUncheckedUpdateWithoutApplicationInput>
    create: XOR<AuditLogCreateWithoutApplicationInput, AuditLogUncheckedCreateWithoutApplicationInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutApplicationInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutApplicationInput, AuditLogUncheckedUpdateWithoutApplicationInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutApplicationInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutApplicationInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    applicationId?: StringNullableFilter<"AuditLog"> | string | null
    apiKeyId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    ip?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type ImageVariantCreateWithoutImageInput = {
    id?: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ImageVariantUncheckedCreateWithoutImageInput = {
    id?: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ImageVariantCreateOrConnectWithoutImageInput = {
    where: ImageVariantWhereUniqueInput
    create: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput>
  }

  export type ImageVariantCreateManyImageInputEnvelope = {
    data: ImageVariantCreateManyImageInput | ImageVariantCreateManyImageInput[]
    skipDuplicates?: boolean
  }

  export type ImageApplicationCreateWithoutImageInput = {
    id?: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
    application: ApplicationCreateNestedOneWithoutImageApplicationsInput
  }

  export type ImageApplicationUncheckedCreateWithoutImageInput = {
    id?: string
    applicationId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageApplicationCreateOrConnectWithoutImageInput = {
    where: ImageApplicationWhereUniqueInput
    create: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput>
  }

  export type ImageApplicationCreateManyImageInputEnvelope = {
    data: ImageApplicationCreateManyImageInput | ImageApplicationCreateManyImageInput[]
    skipDuplicates?: boolean
  }

  export type ImageVariantUpsertWithWhereUniqueWithoutImageInput = {
    where: ImageVariantWhereUniqueInput
    update: XOR<ImageVariantUpdateWithoutImageInput, ImageVariantUncheckedUpdateWithoutImageInput>
    create: XOR<ImageVariantCreateWithoutImageInput, ImageVariantUncheckedCreateWithoutImageInput>
  }

  export type ImageVariantUpdateWithWhereUniqueWithoutImageInput = {
    where: ImageVariantWhereUniqueInput
    data: XOR<ImageVariantUpdateWithoutImageInput, ImageVariantUncheckedUpdateWithoutImageInput>
  }

  export type ImageVariantUpdateManyWithWhereWithoutImageInput = {
    where: ImageVariantScalarWhereInput
    data: XOR<ImageVariantUpdateManyMutationInput, ImageVariantUncheckedUpdateManyWithoutImageInput>
  }

  export type ImageVariantScalarWhereInput = {
    AND?: ImageVariantScalarWhereInput | ImageVariantScalarWhereInput[]
    OR?: ImageVariantScalarWhereInput[]
    NOT?: ImageVariantScalarWhereInput | ImageVariantScalarWhereInput[]
    id?: StringFilter<"ImageVariant"> | string
    imageId?: StringFilter<"ImageVariant"> | string
    label?: StringFilter<"ImageVariant"> | string
    filename?: StringFilter<"ImageVariant"> | string
    width?: IntNullableFilter<"ImageVariant"> | number | null
    height?: IntNullableFilter<"ImageVariant"> | number | null
    sizeBytes?: IntFilter<"ImageVariant"> | number
    createdAt?: DateTimeFilter<"ImageVariant"> | Date | string
  }

  export type ImageApplicationUpsertWithWhereUniqueWithoutImageInput = {
    where: ImageApplicationWhereUniqueInput
    update: XOR<ImageApplicationUpdateWithoutImageInput, ImageApplicationUncheckedUpdateWithoutImageInput>
    create: XOR<ImageApplicationCreateWithoutImageInput, ImageApplicationUncheckedCreateWithoutImageInput>
  }

  export type ImageApplicationUpdateWithWhereUniqueWithoutImageInput = {
    where: ImageApplicationWhereUniqueInput
    data: XOR<ImageApplicationUpdateWithoutImageInput, ImageApplicationUncheckedUpdateWithoutImageInput>
  }

  export type ImageApplicationUpdateManyWithWhereWithoutImageInput = {
    where: ImageApplicationScalarWhereInput
    data: XOR<ImageApplicationUpdateManyMutationInput, ImageApplicationUncheckedUpdateManyWithoutImageInput>
  }

  export type ImageCreateWithoutApplicationsInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: ImageVariantCreateNestedManyWithoutImageInput
  }

  export type ImageUncheckedCreateWithoutApplicationsInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    variants?: ImageVariantUncheckedCreateNestedManyWithoutImageInput
  }

  export type ImageCreateOrConnectWithoutApplicationsInput = {
    where: ImageWhereUniqueInput
    create: XOR<ImageCreateWithoutApplicationsInput, ImageUncheckedCreateWithoutApplicationsInput>
  }

  export type ApplicationCreateWithoutImageApplicationsInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    apiKeys?: ApiKeyCreateNestedManyWithoutApplicationInput
    members?: UserCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutImageApplicationsInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutApplicationInput
    members?: UserUncheckedCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutImageApplicationsInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutImageApplicationsInput, ApplicationUncheckedCreateWithoutImageApplicationsInput>
  }

  export type ImageUpsertWithoutApplicationsInput = {
    update: XOR<ImageUpdateWithoutApplicationsInput, ImageUncheckedUpdateWithoutApplicationsInput>
    create: XOR<ImageCreateWithoutApplicationsInput, ImageUncheckedCreateWithoutApplicationsInput>
    where?: ImageWhereInput
  }

  export type ImageUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: ImageWhereInput
    data: XOR<ImageUpdateWithoutApplicationsInput, ImageUncheckedUpdateWithoutApplicationsInput>
  }

  export type ImageUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: ImageVariantUpdateManyWithoutImageNestedInput
  }

  export type ImageUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    variants?: ImageVariantUncheckedUpdateManyWithoutImageNestedInput
  }

  export type ApplicationUpsertWithoutImageApplicationsInput = {
    update: XOR<ApplicationUpdateWithoutImageApplicationsInput, ApplicationUncheckedUpdateWithoutImageApplicationsInput>
    create: XOR<ApplicationCreateWithoutImageApplicationsInput, ApplicationUncheckedCreateWithoutImageApplicationsInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutImageApplicationsInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutImageApplicationsInput, ApplicationUncheckedUpdateWithoutImageApplicationsInput>
  }

  export type ApplicationUpdateWithoutImageApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    apiKeys?: ApiKeyUpdateManyWithoutApplicationNestedInput
    members?: UserUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutImageApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutApplicationNestedInput
    members?: UserUncheckedUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ImageCreateWithoutVariantsInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ImageApplicationCreateNestedManyWithoutImageInput
  }

  export type ImageUncheckedCreateWithoutVariantsInput = {
    id?: string
    filename: string
    contentType: string
    sizeBytes: number
    width?: number | null
    height?: number | null
    hash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ImageApplicationUncheckedCreateNestedManyWithoutImageInput
  }

  export type ImageCreateOrConnectWithoutVariantsInput = {
    where: ImageWhereUniqueInput
    create: XOR<ImageCreateWithoutVariantsInput, ImageUncheckedCreateWithoutVariantsInput>
  }

  export type ImageUpsertWithoutVariantsInput = {
    update: XOR<ImageUpdateWithoutVariantsInput, ImageUncheckedUpdateWithoutVariantsInput>
    create: XOR<ImageCreateWithoutVariantsInput, ImageUncheckedCreateWithoutVariantsInput>
    where?: ImageWhereInput
  }

  export type ImageUpdateToOneWithWhereWithoutVariantsInput = {
    where?: ImageWhereInput
    data: XOR<ImageUpdateWithoutVariantsInput, ImageUncheckedUpdateWithoutVariantsInput>
  }

  export type ImageUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ImageApplicationUpdateManyWithoutImageNestedInput
  }

  export type ImageUncheckedUpdateWithoutVariantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    contentType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    hash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ImageApplicationUncheckedUpdateManyWithoutImageNestedInput
  }

  export type ApplicationCreateWithoutApiKeysInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationCreateNestedManyWithoutApplicationInput
    members?: UserCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutApiKeysInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationUncheckedCreateNestedManyWithoutApplicationInput
    members?: UserUncheckedCreateNestedManyWithoutApplicationsInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutApiKeysInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutApiKeysInput, ApplicationUncheckedCreateWithoutApiKeysInput>
  }

  export type UserCreateWithoutApiKeysInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutMembersInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApiKeysInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutMembersInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApiKeysInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
  }

  export type AuditLogCreateWithoutApiKeyInput = {
    id?: string
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
    application?: ApplicationCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutApiKeyInput = {
    id?: string
    userId?: string | null
    applicationId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutApiKeyInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput>
  }

  export type AuditLogCreateManyApiKeyInputEnvelope = {
    data: AuditLogCreateManyApiKeyInput | AuditLogCreateManyApiKeyInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithoutApiKeysInput = {
    update: XOR<ApplicationUpdateWithoutApiKeysInput, ApplicationUncheckedUpdateWithoutApiKeysInput>
    create: XOR<ApplicationCreateWithoutApiKeysInput, ApplicationUncheckedCreateWithoutApiKeysInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutApiKeysInput, ApplicationUncheckedUpdateWithoutApiKeysInput>
  }

  export type ApplicationUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUpdateManyWithoutApplicationNestedInput
    members?: UserUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUncheckedUpdateManyWithoutApplicationNestedInput
    members?: UserUncheckedUpdateManyWithoutApplicationsNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type UserUpsertWithoutApiKeysInput = {
    update: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
    create: XOR<UserCreateWithoutApiKeysInput, UserUncheckedCreateWithoutApiKeysInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApiKeysInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApiKeysInput, UserUncheckedUpdateWithoutApiKeysInput>
  }

  export type UserUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutMembersNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApiKeysInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutMembersNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AuditLogUpsertWithWhereUniqueWithoutApiKeyInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutApiKeyInput, AuditLogUncheckedUpdateWithoutApiKeyInput>
    create: XOR<AuditLogCreateWithoutApiKeyInput, AuditLogUncheckedCreateWithoutApiKeyInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutApiKeyInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutApiKeyInput, AuditLogUncheckedUpdateWithoutApiKeyInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutApiKeyInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutApiKeyInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type ApplicationCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyCreateNestedManyWithoutApplicationInput
    members?: UserCreateNestedManyWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationUncheckedCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutApplicationInput
    members?: UserUncheckedCreateNestedManyWithoutApplicationsInput
  }

  export type ApplicationCreateOrConnectWithoutAuditLogsInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutAuditLogsInput, ApplicationUncheckedCreateWithoutAuditLogsInput>
  }

  export type ApiKeyCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    application: ApplicationCreateNestedOneWithoutApiKeysInput
    user: UserCreateNestedOneWithoutApiKeysInput
  }

  export type ApiKeyUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    applicationId: string
    userId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
  }

  export type ApiKeyCreateOrConnectWithoutAuditLogsInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutAuditLogsInput, ApiKeyUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplicationUpsertWithoutAuditLogsInput = {
    update: XOR<ApplicationUpdateWithoutAuditLogsInput, ApplicationUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<ApplicationCreateWithoutAuditLogsInput, ApplicationUncheckedCreateWithoutAuditLogsInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutAuditLogsInput, ApplicationUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ApplicationUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutApplicationNestedInput
    members?: UserUpdateManyWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUncheckedUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutApplicationNestedInput
    members?: UserUncheckedUpdateManyWithoutApplicationsNestedInput
  }

  export type ApiKeyUpsertWithoutAuditLogsInput = {
    update: XOR<ApiKeyUpdateWithoutAuditLogsInput, ApiKeyUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<ApiKeyCreateWithoutAuditLogsInput, ApiKeyUncheckedCreateWithoutAuditLogsInput>
    where?: ApiKeyWhereInput
  }

  export type ApiKeyUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: ApiKeyWhereInput
    data: XOR<ApiKeyUpdateWithoutAuditLogsInput, ApiKeyUncheckedUpdateWithoutAuditLogsInput>
  }

  export type ApiKeyUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    application?: ApplicationUpdateOneRequiredWithoutApiKeysNestedInput
    user?: UserUpdateOneRequiredWithoutApiKeysNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ApplicationCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyCreateNestedManyWithoutApplicationInput
    auditLogs?: AuditLogCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    storageDir: string
    imageApplications?: ImageApplicationUncheckedCreateNestedManyWithoutApplicationInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutApplicationInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutMembersInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput>
  }

  export type ApiKeyCreateWithoutUserInput = {
    id?: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    application: ApplicationCreateNestedOneWithoutApiKeysInput
    auditLogs?: AuditLogCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyUncheckedCreateWithoutUserInput = {
    id?: string
    applicationId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutApiKeyInput
  }

  export type ApiKeyCreateOrConnectWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyCreateManyUserInputEnvelope = {
    data: ApiKeyCreateManyUserInput | ApiKeyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    application?: ApplicationCreateNestedOneWithoutAuditLogsInput
    apiKey?: ApiKeyCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    applicationId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithWhereUniqueWithoutMembersInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutMembersInput, ApplicationUncheckedUpdateWithoutMembersInput>
    create: XOR<ApplicationCreateWithoutMembersInput, ApplicationUncheckedCreateWithoutMembersInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutMembersInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutMembersInput, ApplicationUncheckedUpdateWithoutMembersInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutMembersInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutMembersInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: StringFilter<"Application"> | string
    name?: StringFilter<"Application"> | string
    slug?: StringFilter<"Application"> | string
    ownerId?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    storageDir?: StringFilter<"Application"> | string
  }

  export type ApiKeyUpsertWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    update: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
    create: XOR<ApiKeyCreateWithoutUserInput, ApiKeyUncheckedCreateWithoutUserInput>
  }

  export type ApiKeyUpdateWithWhereUniqueWithoutUserInput = {
    where: ApiKeyWhereUniqueInput
    data: XOR<ApiKeyUpdateWithoutUserInput, ApiKeyUncheckedUpdateWithoutUserInput>
  }

  export type ApiKeyUpdateManyWithWhereWithoutUserInput = {
    where: ApiKeyScalarWhereInput
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    token?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: boolean | null
    image?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutMembersInput
    apiKeys?: ApiKeyUncheckedCreateNestedManyWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutMembersNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ImageApplicationCreateManyApplicationInput = {
    id?: string
    imageId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiKeyCreateManyApplicationInput = {
    id?: string
    userId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
  }

  export type AuditLogCreateManyApplicationInput = {
    id?: string
    userId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ImageApplicationUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: ImageUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ImageApplicationUncheckedUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationUncheckedUpdateManyWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutApiKeysNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateManyWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
    apiKey?: ApiKeyUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantCreateManyImageInput = {
    id?: string
    label: string
    filename: string
    width?: number | null
    height?: number | null
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ImageApplicationCreateManyImageInput = {
    id?: string
    applicationId: string
    originalName: string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageVariantUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantUncheckedUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageVariantUncheckedUpdateManyWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    application?: ApplicationUpdateOneRequiredWithoutImageApplicationsNestedInput
  }

  export type ImageApplicationUncheckedUpdateWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageApplicationUncheckedUpdateManyWithoutImageInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    tags?: NullableJsonNullValueInput | InputJsonValue
    linkedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyApiKeyInput = {
    id?: string
    userId?: string | null
    applicationId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
    application?: ApplicationUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutApiKeyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateManyUserInput = {
    id?: string
    applicationId: string
    name: string
    hash: string
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    revoked?: boolean
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    applicationId?: string | null
    apiKeyId?: string | null
    action: string
    targetId?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUpdateManyWithoutApplicationNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
    imageApplications?: ImageApplicationUncheckedUpdateManyWithoutApplicationNestedInput
    apiKeys?: ApiKeyUncheckedUpdateManyWithoutApplicationNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateManyWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storageDir?: StringFieldUpdateOperationsInput | string
  }

  export type ApiKeyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    application?: ApplicationUpdateOneRequiredWithoutApiKeysNestedInput
    auditLogs?: AuditLogUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    auditLogs?: AuditLogUncheckedUpdateManyWithoutApiKeyNestedInput
  }

  export type ApiKeyUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    application?: ApplicationUpdateOneWithoutAuditLogsNestedInput
    apiKey?: ApiKeyUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: NullableStringFieldUpdateOperationsInput | string | null
    apiKeyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
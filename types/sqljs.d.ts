declare module 'sql.js' {
  export interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  export interface Statement {
    step(): boolean;
    getAsObject(): Record<string, unknown>;
    free(): void;
  }

  export interface Database {
    prepare(sql: string): Statement;
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => Database;
  }

  const initSqlJs: (config?: SqlJsConfig) => Promise<SqlJsStatic>;

  export default initSqlJs;
  export { SqlJsStatic, Database, Statement, SqlJsConfig };
}

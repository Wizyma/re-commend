declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_TEST: boolean;
    }
  }
}

export { };
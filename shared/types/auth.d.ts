declare module "#auth-utils" {
  interface User {
    sub: string;
    legacy_id?: string;
  }
}

export {};

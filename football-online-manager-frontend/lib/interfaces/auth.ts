export interface LoginResponse {
    user: {
      id:string
      email:string
      role:string
    }
    message:string
  }
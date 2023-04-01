import { Errors } from "./errors.enum"

export const permissionService = (jwt: string) => {
  if (!jwt) {
    throw new Error(Errors.PERMISSION_DENIED)
  }
}

import { Context } from '../../context';
import { verify, Secret } from 'jsonwebtoken';

// Authentication and authorization logic

interface JWTData {
  id: string;
}
const isJWTData = (input: object | string): input is JWTData => { return typeof input === "object" && "id" in input; };  

export const getUserId = (context: Context) => {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verified = verify(token, process.env.AUTH_SECRET as Secret)
    if(isJWTData(verified)) {
      const { id } = verified
      return id
    } throw new Error(`JWT Data invalid: ${JSON.stringify(verified)}`)
  }
  throw new Error('Not authenticated')
}

export const getUserRole = async (context: Context) => {
  const id = getUserId(context)
  const user = await context.db.user.findUnique({ where: { id } })
  if (user) return user.role
  throw new Error('User not found')
}

export const userIsEditor = async (context: Context): Promise<boolean> => {
  const role = await getUserRole(context)
  if (['Editor', 'Admin'].includes(role as string)) return true
  throw new Error(`Not authorized, user has role: ${role}`)
}

export const userIsAdmin = async (context: Context) => {
  const role = await getUserRole(context)
  if (role === 'Admin') return true
  throw new Error(`Not authorized, user has role: ${role}`)
}

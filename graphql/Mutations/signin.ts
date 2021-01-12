import { extendType } from 'nexus';
import { stringArg, nonNull } from 'nexus';
import bcrypt from 'bcrypt';
import { sign, Secret } from 'jsonwebtoken';

export const signInMutation  = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signinUser', {
      type: 'UserAuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { email, password }, ctx): Promise<any> => {
        const user = await ctx.db.user.findUnique({ where: { email }});
        if (!user) {
          throw new Error('Invalid Login');
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password as string);
    
        if (!passwordMatch) {
          throw new Error('Invalid Login');
        }
    
        const token = sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.AUTH_SECRET as Secret,
          {
            expiresIn: '30d',
          },
        );
    
        console.log({ user, token });
    
        return { user, token };    
      }
    })
  },
})


import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.createdAt()
    t.model.email()
    t.model.password()
    t.model.firstName()
    t.model.id()
    t.model.lastName()
    t.model.role()
    t.model.updatedAt()
    t.model.userName()
  },
});

export const UserAuthPayload = objectType({
  name: 'UserAuthPayload',
  definition(t){
    t.string("token");
    t.field("user", { type: "User" });
  },
});

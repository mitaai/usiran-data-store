import { enumType } from 'nexus'

export const UserRole = enumType({
  name: 'UserRole',
  members: ['Admin', 'Editor', 'Viewer'],
})

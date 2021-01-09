import { ObjectDefinitionBlock } from 'nexus/dist/definitions/objectType';

type PickType<T, K extends string> = T extends Pick<any, K> ? T[K] : any;

type CRUD<TypeName extends string> = PickType<NexusGenCustomOutputProperties<TypeName>, 'crud'>;

type Model<TypeName extends string> = PickType<NexusGenCustomOutputProperties<TypeName>, 'model'>;

export const model = <TypeName extends string>(
  t: ObjectDefinitionBlock<TypeName>
): Model<TypeName> => (t as any).model;


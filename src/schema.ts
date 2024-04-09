import { builder } from './builder';
import { Artists, IArtist } from './data';

export const Artist = builder.objectRef<IArtist>('Artist');

Artist.implement({
  fields: (t) => ({
    name: t.exposeString('name'),
    genre: t.exposeString('genre'),
    instagram: t.exposeString('instagram'),
    spotify: t.exposeString('spotify'),
  }),
});

const DEFAULT_PAGE_SIZE = 10;

builder.queryType({
  fields: (t) => ({
    artist: t.field({
      type: Artist,
      nullable: true,
      args: {
        name: t.arg.string({ required: true }),
      },
      resolve: (root, args) =>
        Artists.find((artist) => artist.name === args.name),
    }),
    artists: t.field({
      type: [Artist],
      nullable: true,
      args: {
        take: t.arg.int(),
        skip: t.arg.int(),
      },
      resolve: (root, { skip, take }) =>
        [...Artists.values()].slice(
          skip ?? 0,
          (skip ?? 0) + (take ?? DEFAULT_PAGE_SIZE)
        ),
    }),
  }),
});

export const schema = builder.toSchema();

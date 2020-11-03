import addSchemasFactory from './utils/addSchemasFactory';
import tag from './utils/tag';

export const song = {
  $id: 'song',
  title: 'Song',
  type: 'object',
  required: ['time', 'song'],
  description: 'Song',
  properties: {
    time: {
      type: 'object',
      required: ['aired', 'referenceDate'],
      properties: {
        aired: {
          type: 'string',
          format: 'date-time',
          description: 'When song has aired',
        },
        referenceDate: {
          type: 'string',
          format: 'date-time',
          description:
            'Date used to fill empty "aired" time in order to get valid ISO timestamp',
        },
      },
    },
    song: {
      type: 'object',
      required: ['authors', 'name', 'displayName'],
      properties: {
        authors: {
          type: 'array',
          items: { type: 'string', description: "Song's authors" },
        },
        details: {
          type: 'array',
          items: {
            type: 'string',
            nullable: true,
          },
        },
        name: { type: 'string', description: "Song's name" },
        displayName: {
          type: 'string',
          description:
            "Formatted song's name that includes authors, song name and details (if present)",
        },
      },
    },
  },
};

export const songList = {
  $id: 'songList',
  title: 'Song list',
  type: 'array',
  description: 'Song list',
  tags: [tag.ItemList],
  items: {
    $ref: 'song#',
  },
};

export const getLatestSongListSchema = {
  description: 'Get latest song list',
  tags: [tag.GetMany],
  response: {
    '2xx': {
      type: 'array',
      items: {
        $ref: 'songList#/items',
      },
    },
  },
  headers: {
    type: 'object',
    properties: {
      'Accept-Version': { type: 'string', default: '1.0.0' },
    },
  },
};

export const addSchemas = addSchemasFactory([song, songList]);

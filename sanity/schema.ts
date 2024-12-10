import { type SchemaTypeDefinition } from 'sanity'

const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
  ],
}

const startup = {
  name: 'startup',
  title: 'Startup',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
    },
    {
      name: 'pitch',
      title: 'Pitch',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'string',
    },
    {
      name: 'preview',
      title: 'Preview URL',
      type: 'url',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'views',
      title: 'Views',
      type: 'number',
      initialValue: 0,
    },
  ],
}

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [startup, user],
}

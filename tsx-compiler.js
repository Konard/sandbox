
async ({ deep, require, gql, data: { newLink } }) => {
    const ts = require('typescript');
const { data: [generatedFrom] } = await deep.select({
      type_id: await deep.id('@deep-foundation/core', 'GeneratedFrom'),
to_id: newLink.id, 
});
const value = newLink?.value?.value;
let compiledString = '';
if (value) {
      const result = ts.transpileModule(value, {
        "compilerOptions": {
        "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "sourceMap": true, 
    "noImplicitAny": false,
    "removeComments": true,
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ESNext",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "isolatedModules": true
  }
});
if (!result.outputText) {
      throw result;
}
compiledString = result.outputText || '';
}
if (!generatedFrom) {
      await deep.insert({
        type_id: await deep.id('@deep-foundation/core', 'GeneratedFrom'),
  to_id: newLink.id,
  in: { data: {
          type_id: await deep.id('@deep-foundation/core', 'Contain'),
    from_id: newLink.id,
  } },
  from: { data: {
          type_id: await deep.id('@deep-foundation/core', 'SyncTextFile'),
    string: { data: { value: compiledString } },
    in: { data: {
            type_id: await deep.id('@deep-foundation/core', 'Contain'),
      from_id: newLink.id,
      string: { data: { value: 'generated' } },
    } },
  } },
});
} else {
      await deep.update({
        link_id: { _eq: generatedFrom.from_id },
}, {
        value: compiledString,
}, { table: 'strings' });
}
}
